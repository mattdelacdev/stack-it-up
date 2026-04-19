"use client";

import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";

type Msg = { role: "user" | "model" | "upsell"; text: string };

const GREETING: Msg = {
  role: "model",
  text: "Hey! I'm your StackItUp supplement & fitness expert. Ask me about any supplement, stack, or how to feel better, sleep better, or get stronger. 💪",
};

const STORAGE_KEY = "stackitup:chat:v1";

export default function ChatBot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([GREETING]);
  const [hydrated, setHydrated] = useState(false);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tier, setTier] = useState<"free" | "pro" | "admin" | "anon" | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Msg[];
        if (Array.isArray(parsed) && parsed.length > 0) setMessages(parsed);
      }
    } catch {}
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    } catch {}
  }, [messages, hydrated]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, open]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  useEffect(() => {
    if (!open || tier) return;
    let cancelled = false;
    fetch("/api/chat", { method: "GET" })
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (cancelled || !d) return;
        setTier(d.tier);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [open, tier]);

  function clearHistory() {
    setMessages([GREETING]);
    setError(null);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {}
  }

  async function send() {
    const text = input.trim();
    if (!text || sending) return;
    setError(null);
    const next: Msg[] = [...messages, { role: "user", text }];
    setMessages(next);
    setInput("");
    setSending(true);
    setMessages((prev) => [...prev, { role: "model", text: "" }]);

    try {
      const history = next.filter(
        (m, i) => !(i === 0 && m.role === "model" && m.text === GREETING.text),
      );
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history }),
      });
      if (!res.ok || !res.body) {
        const body = await res.text().catch(() => "");
        if (res.status === 429) {
          setMessages((prev) => [
            ...prev.slice(0, -1),
            {
              role: "upsell",
              text:
                "You've used your free question for today. Upgrade to Pro for 5 chats per day.",
            },
          ]);
          return;
        }
        let msg = "Request failed";
        try {
          const j = JSON.parse(body);
          if (j?.error) msg = j.error;
        } catch {
          if (body) msg = body;
        }
        throw new Error(msg);
      }
      const tier = res.headers.get("x-user-tier");
      const remainingDay = Number(res.headers.get("x-remaining-day") ?? "0");
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let acc = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        acc += decoder.decode(value, { stream: true });
        setMessages((prev) => {
          const copy = [...prev];
          copy[copy.length - 1] = { role: "model", text: acc };
          return copy;
        });
      }
      if (tier === "free" || tier === "anon") {
        setMessages((prev) => [
          ...prev,
          {
            role: "upsell",
            text:
              remainingDay <= 0
                ? "You've used your free question for today. Upgrade to Pro for 5 chats per day."
                : "Enjoying the expert? Pro gives you 5 chats per day instead of 1.",
          },
        ]);
      }
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Something went wrong";
      setError(msg);
      setMessages((prev) => prev.slice(0, -1));
    } finally {
      setSending(false);
    }
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  }

  return (
    <>
      {!open && (
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Open supplement expert chat"
          className="fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-full bg-primary text-bg border-4 border-bg-deep shadow-retro px-5 py-3 font-display uppercase tracking-[0.2em] text-xs hover:bg-accent hover:text-bg transition-colors"
        >
          <span aria-hidden>💬</span>
          <span>Ask Expert</span>
        </button>
      )}

      {open && (
        <div
          role="dialog"
          aria-label="Supplement expert chat"
          className="fixed bottom-5 right-5 z-50 flex w-[min(92vw,380px)] h-[min(80vh,560px)] flex-col rounded-lg border-4 border-primary bg-bg-deep/95 backdrop-blur shadow-retro overflow-hidden"
        >
          <div className="flex items-center justify-between border-b-4 border-primary/50 bg-bg/60 px-4 py-3">
            <div className="flex items-center gap-2">
              <span aria-hidden className="text-lg">🧬</span>
              <div className="leading-tight">
                <p className="font-display text-sm text-accent tracking-[0.15em] uppercase">
                  Stack Expert
                </p>
                <p className="text-[10px] text-text/60 font-mono">Powered by Gemini</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={clearHistory}
                disabled={sending || messages.length <= 1}
                aria-label="Clear chat history"
                title="Clear chat history"
                className="font-display text-[10px] uppercase tracking-[0.15em] text-text/60 hover:text-accent disabled:opacity-30 px-2 py-1 border border-primary/30 rounded"
              >
                Clear
              </button>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close chat"
                className="text-text/70 hover:text-accent text-2xl leading-none px-2"
              >
                ×
              </button>
            </div>
          </div>

          {tier !== "pro" && tier !== "admin" && (
            <a
              href="/pricing"
              className="block border-b-2 border-accent/50 bg-gradient-to-r from-primary/20 to-accent/20 px-4 py-2 text-xs font-display uppercase tracking-[0.15em] text-accent hover:bg-accent/20 transition-colors"
            >
              ⚡ Free: 1 chat/day · Go Pro for 5 →
            </a>
          )}

          <div
            ref={scrollRef}
            className="flex-1 overflow-y-auto px-4 py-3 space-y-3"
          >
            {messages.map((m, i) => {
              if (m.role === "upsell") {
                return (
                  <div key={i} className="flex justify-start">
                    <a
                      href="/pricing"
                      className="max-w-[85%] rounded-md px-3 py-2 text-sm bg-gradient-to-br from-primary/30 to-accent/20 border-2 border-accent text-text hover:border-primary transition-colors block"
                    >
                      <p className="font-display text-[10px] uppercase tracking-[0.2em] text-accent mb-1">
                        ⚡ Go Pro
                      </p>
                      <p className="leading-snug">{m.text}</p>
                      <p className="mt-1 font-display text-[10px] uppercase tracking-[0.2em] text-primary">
                        See plans →
                      </p>
                    </a>
                  </div>
                );
              }
              return (
                <div
                  key={i}
                  className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] rounded-md px-3 py-2 text-sm break-words ${
                      m.role === "user"
                        ? "bg-primary/20 border-2 border-primary/60 text-text whitespace-pre-wrap"
                        : "bg-bg/70 border-2 border-secondary/50 text-text chat-md"
                    }`}
                  >
                    {m.role === "model" ? (
                      m.text ? (
                        <ReactMarkdown>{m.text}</ReactMarkdown>
                      ) : sending && i === messages.length - 1 ? (
                        <span className="text-text/50 font-mono">…thinking</span>
                      ) : null
                    ) : (
                      m.text
                    )}
                  </div>
                </div>
              );
            })}
            {error && (
              <p className="text-xs text-red-400 font-mono">⚠ {error}</p>
            )}
          </div>

          <div className="border-t-4 border-primary/50 bg-bg/60 p-3">
            <div className="flex items-end gap-2">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={onKeyDown}
                placeholder="Ask about creatine, sleep, stacks…"
                rows={1}
                disabled={sending}
                className="flex-1 resize-none rounded bg-bg-deep border-2 border-primary/40 focus:border-accent outline-none px-3 py-2 text-sm text-text placeholder:text-text/40 max-h-28"
              />
              <button
                type="button"
                onClick={send}
                disabled={sending || !input.trim()}
                className="font-display text-xs uppercase tracking-[0.15em] bg-accent text-bg border-2 border-bg-deep px-3 py-2 disabled:opacity-40 hover:bg-primary hover:text-bg transition-colors"
              >
                Send
              </button>
            </div>
            <p className="mt-2 text-[10px] text-text/40 font-mono">
              Educational only. Not medical advice.
            </p>
          </div>
        </div>
      )}
    </>
  );
}
