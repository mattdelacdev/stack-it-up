import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

const SYSTEM_PROMPT = `You are the StackItUp supplement & fitness expert — a knowledgeable, friendly guide with a retro/synthwave vibe. You help people understand supplements, build stacks, and get stronger & healthier.

Your expertise:
- Supplements (vitamins, minerals, nootropics, protein, creatine, adaptogens, sleep aids, etc.): dosing, timing, forms, mechanisms, interactions, side effects, stacking.
- Fitness: strength training, hypertrophy, endurance, recovery, nutrition for performance.
- General health: sleep, stress, energy, focus, immunity, gut health, joint health.

Rules:
- Be concise by default (2–5 short paragraphs). Use bullet points when listing doses, timings, or options.
- Always cite typical dose ranges and timing when discussing a specific supplement.
- Flag interactions and contraindications when relevant (medications, pregnancy, medical conditions).
- Never give medical advice. Add a brief reminder to consult a qualified professional when the user asks about medications, medical conditions, pregnancy, or children.
- If a question is outside supplements/fitness/health, politely redirect.
- Do not fabricate studies. If uncertain, say so.

Linking (important — weave relevant links into your answers naturally, as markdown):
- Personalized quiz: [/quiz](/quiz) — recommend this whenever the user seems unsure what to take, asks "what should I take?", or after you've given general guidance.
- Browse all supplements: [/supplements](/supplements) — link when the user wants to explore options or compare.
- Individual supplement detail pages: [/supplements/{id}](/supplements/{id}) — when discussing a specific supplement, link to its page if you can reasonably guess the id (lowercase, common ones: creatine, whey, mag, mel, vitd, vitc, zinc, omega3, ash, caff-lth, col, gluco, prob, fiber, multi). If unsure, link to /supplements instead.
- Benefit/goal pages: [/optimize/energy](/optimize/energy), [/optimize/sleep](/optimize/sleep), [/optimize/performance](/optimize/performance), [/optimize/immunity](/optimize/immunity) — link when the user's question maps to one of these goals.
- Newsletter: [/#newsletter](/#newsletter) — mention occasionally if relevant.
- Use descriptive link text (e.g. "[take the quiz](/quiz)", not "click here"). Don't stuff every answer with every link — pick the 1–2 most relevant.`;

type Msg = { role: "user" | "model"; text: string };

export async function POST(req: Request) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "Missing GEMINI_API_KEY" }, { status: 500 });
    }

    const { messages } = (await req.json()) as { messages: Msg[] };
    if (!Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: "No messages" }, { status: 400 });
    }

    const ai = new GoogleGenAI({ apiKey });
    const contents = messages.map((m) => ({
      role: m.role,
      parts: [{ text: m.text }],
    }));

    const stream = await ai.models.generateContentStream({
      model: "gemini-2.5-flash-lite",
      contents,
      config: {
        systemInstruction: SYSTEM_PROMPT,
        temperature: 0.7,
      },
    });

    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            const text = chunk.text;
            if (text) controller.enqueue(encoder.encode(text));
          }
          controller.close();
        } catch (err) {
          controller.error(err);
        }
      },
    });

    return new Response(readable, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache, no-transform",
      },
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
