"use client";

import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";

type Msg = { role: "user" | "model"; text: string };

const GREETING: Msg = {
  role: "model",
  text: "Hey! I'm your StackItUp supplement & fitness expert. Ask me about any supplement, stack, or how to feel better, sleep better, or get stronger. 💪",
};

export default function ChatBot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([GREETING]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, open]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

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
      const history = next.filter((m, i) => !(i === 0 && m === GREETING));
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history }),
      });
      if (!res.ok || !res.body) {
        const msg = await res.text().catch(() => "Request failed");
        throw new Error(msg || "Request failed");
      }
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
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close chat"
              className="text-text/70 hover:text-accent text-2xl leading-none px-2"
            >
              ×
            </button>
          </div>

          <div
            ref={scrollRef}
            className="flex-1 overflow-y-auto px-4 py-3 space-y-3"
          >
            {messages.map((m, i) => (
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
            ))}
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
