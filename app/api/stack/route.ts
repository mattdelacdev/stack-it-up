import { GoogleGenAI, Type } from "@google/genai";
import { NextResponse } from "next/server";
import { getServerSupabase } from "@/lib/supabase/server";
import { checkAndRecord, rateLimitMessage } from "@/lib/rate-limit";
import type { QuizAnswers, Supplement } from "@/lib/supplements";

export const runtime = "nodejs";

const SYSTEM = `You are the StackItUp supplement expert. Given a user's quiz answers and the full catalog of available supplements, choose the most appropriate subset for their stack.

Rules:
- Pick only supplements from the provided catalog (by id). Do not invent ids.
- Typical stack size: 5–10 items. Always include basic core staples (a multivitamin and omega-3 if present in the catalog) unless there's a clear reason not to.
- Prioritize the user's stated goals, then correct likely deficiencies implied by diet/sun/age/activity.
- If the user provides extra context (medical conditions, medications, allergies, budget, pregnancy, specific goals), treat it as high-priority — remove contraindicated picks, add relevant ones, and acknowledge constraints in the summary. If they mention medications or serious medical conditions, note in the summary that they should check with their doctor first.
- Avoid redundant overlap (e.g. don't pick multiple items that do the same job).
- For each pick, write a 1-sentence "why" tailored to THIS user's answers (personal, specific — e.g. "For your vegan diet and low sun exposure…"). Max ~140 chars.
- Return a concise "summary" (2–3 sentences) explaining the overall shape of the stack.`;

type Pick = { id: string; why: string };

export async function POST(req: Request) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "Missing GEMINI_API_KEY" }, { status: 500 });
    }

    const { answers } = (await req.json()) as { answers: QuizAnswers };
    if (!answers) {
      return NextResponse.json({ error: "Missing answers" }, { status: 400 });
    }

    const rl = await checkAndRecord(req, "stack");
    if (!rl.allowed) {
      return NextResponse.json(
        { error: rateLimitMessage(rl), retryAfterSec: rl.retryAfterSec },
        {
          status: 429,
          headers: { "Retry-After": String(rl.retryAfterSec) },
        },
      );
    }

    const supabase = await getServerSupabase();
    const { data, error } = await supabase
      .from("supplements")
      .select("id, name, dose, dose_low, dose_high, dose_unit, timing, why, tag");
    if (error) throw error;
    const catalog = (data ?? []) as Supplement[];
    const byId = new Map(catalog.map((s) => [s.id, s]));

    const catalogForAi = catalog.map((s) => ({
      id: s.id,
      name: s.name,
      tag: s.tag,
      timing: s.timing,
      why: s.why,
    }));

    const ai = new GoogleGenAI({ apiKey });
    const prompt = `User quiz answers:\n${JSON.stringify(answers, null, 2)}\n\nAvailable supplements (pick from these ids only):\n${JSON.stringify(catalogForAi, null, 2)}\n\nReturn a JSON object with "picks" (ordered array of {id, why}) and "summary".`;

    const res = await ai.models.generateContent({
      model: "gemini-2.5-flash-lite",
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      config: {
        systemInstruction: SYSTEM,
        temperature: 0.4,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING },
            picks: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  why: { type: Type.STRING },
                },
                required: ["id", "why"],
              },
            },
          },
          required: ["summary", "picks"],
        },
      },
    });

    const text = res.text ?? "";
    const parsed = JSON.parse(text) as { summary: string; picks: Pick[] };

    const tagOrder = { core: 0, goal: 1, lifestyle: 2 } as const;
    const stack: Supplement[] = [];
    const seen = new Set<string>();
    for (const p of parsed.picks) {
      if (seen.has(p.id)) continue;
      const s = byId.get(p.id);
      if (!s) continue;
      seen.add(p.id);
      stack.push({ ...s, why: p.why || s.why });
    }
    stack.sort((a, b) => tagOrder[a.tag] - tagOrder[b.tag]);

    return NextResponse.json({ summary: parsed.summary, stack });
  } catch (err) {
    const raw = err instanceof Error ? err.message : "Unknown error";
    const isQuota = /RESOURCE_EXHAUSTED|quota|429/i.test(raw);
    const msg = isQuota
      ? "We've hit today's free-tier AI quota — please try again in a little while, or come back tomorrow."
      : "Something went wrong generating your stack. Please try again.";
    return NextResponse.json({ error: msg }, { status: isQuota ? 429 : 500 });
  }
}
