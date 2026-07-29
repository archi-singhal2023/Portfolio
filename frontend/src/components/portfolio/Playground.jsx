import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Terminal, CornerDownLeft, Loader2 } from "lucide-react";
import { PLAYGROUND_SUGGESTIONS } from "../../data/portfolio";
import { SectionHeading } from "./SectionHeading";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const sessionId = `pg-${Math.random().toString(36).slice(2)}-${Date.now()}`;

export const Playground = () => {
  const [history, setHistory] = useState([
    {
      role: "system",
      content:
        "ARIA v1.0 — Archi's portfolio assistant. Ask me anything about her projects, skills, or experience.",
    },
  ]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [history]);

  const send = async (text) => {
    const prompt = (text ?? input).trim();
    if (!prompt || streaming) return;
    setInput("");
    setHistory((h) => [...h, { role: "user", content: prompt }, { role: "assistant", content: "" }]);
    setStreaming(true);

    try {
      const resp = await fetch(`${API}/playground/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ session_id: sessionId, message: prompt }),
      });

      if (!resp.ok || !resp.body) throw new Error("stream failed");

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const parts = buffer.split("\n\n");
        buffer = parts.pop() || "";
        for (const part of parts) {
          const line = part.trim();
          if (!line.startsWith("data:")) continue;
          try {
            const data = JSON.parse(line.slice(5).trim());
            if (data.delta) {
              setHistory((h) => {
                const copy = [...h];
                copy[copy.length - 1] = {
                  role: "assistant",
                  content: copy[copy.length - 1].content + data.delta,
                };
                return copy;
              });
            } else if (data.error) {
              setHistory((h) => {
                const copy = [...h];
                copy[copy.length - 1] = { role: "assistant", content: "// error: AI stream failed. Try again." };
                return copy;
              });
            }
          } catch (_) {
            /* ignore malformed chunk */
          }
        }
      }
    } catch (e) {
      setHistory((h) => {
        const copy = [...h];
        copy[copy.length - 1] = { role: "assistant", content: "// connection error. Please retry." };
        return copy;
      });
    } finally {
      setStreaming(false);
    }
  };

  return (
    <section
      id="playground"
      data-testid="playground-section"
      className="relative mx-auto max-w-[1400px] px-6 py-24 md:px-10 md:py-32"
    >
      <SectionHeading index="03" label="Interactive" title="Prompt Playground" />
      <p className="mt-6 max-w-xl font-body text-base text-zinc-400">
        A live LLM agent (Claude Sonnet) grounded in Archi&apos;s resume. Ask it about her
        architecture decisions, metrics, or stack.
      </p>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.7 }}
        data-testid="terminal-window"
        className="scanlines relative mt-12 overflow-hidden rounded-xl border border-[#00FF94]/25 bg-black shadow-[0_0_60px_rgba(0,255,148,0.08)]"
      >
        {/* title bar */}
        <div className="flex items-center gap-2 border-b border-white/10 bg-[#0a0a0a] px-4 py-3">
          <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
          <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
          <span className="h-3 w-3 rounded-full bg-[#28c840]" />
          <div className="ml-3 flex items-center gap-2 font-mono text-xs text-zinc-500">
            <Terminal size={13} /> aria@archi-singhal: ~/portfolio
          </div>
        </div>

        {/* output */}
        <div
          ref={scrollRef}
          className="relative z-[3] h-[340px] overflow-y-auto p-5 font-mono text-sm leading-relaxed md:p-6"
        >
          {history.map((m, i) => (
            <div key={i} className="mb-4">
              {m.role === "user" && (
                <div className="text-white">
                  <span className="text-[#00E5FF]">visitor@web</span>
                  <span className="text-zinc-600">:~$ </span>
                  {m.content}
                </div>
              )}
              {m.role === "assistant" && (
                <div className="whitespace-pre-wrap text-[#00FF94]">
                  <span className="text-zinc-600">aria &gt; </span>
                  {m.content}
                  {streaming && i === history.length - 1 && (
                    <span className="cursor-blink">▋</span>
                  )}
                  {!m.content && streaming && i === history.length - 1 && (
                    <Loader2 size={14} className="ml-1 inline animate-spin" />
                  )}
                </div>
              )}
              {m.role === "system" && (
                <div className="text-zinc-500">
                  <span className="text-[#00FF94]">●</span> {m.content}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* suggestions */}
        <div className="relative z-[3] flex flex-wrap gap-2 border-t border-white/10 px-5 py-3">
          {PLAYGROUND_SUGGESTIONS.map((s, i) => (
            <button
              key={i}
              data-testid={`playground-suggestion-${i}`}
              onClick={() => send(s)}
              disabled={streaming}
              className="rounded-full border border-white/15 bg-white/5 px-3 py-1 font-mono text-[11px] text-zinc-400 transition-colors hover:border-[#00FF94]/50 hover:text-[#00FF94] disabled:opacity-40"
            >
              {s}
            </button>
          ))}
        </div>

        {/* input */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            send();
          }}
          className="relative z-[3] flex items-center gap-3 border-t border-white/10 bg-[#0a0a0a] px-5 py-4"
        >
          <span className="font-mono text-sm text-[#00E5FF]">$</span>
          <input
            data-testid="playground-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a question and hit Enter…"
            disabled={streaming}
            className="flex-1 bg-transparent font-mono text-sm text-white placeholder:text-zinc-600 focus:outline-none"
          />
          <button
            type="submit"
            data-testid="playground-send"
            disabled={streaming || !input.trim()}
            className="flex items-center gap-1 border border-[#00FF94]/40 px-3 py-1.5 font-mono text-xs text-[#00FF94] transition-colors hover:bg-[#00FF94] hover:text-black disabled:opacity-40"
          >
            {streaming ? <Loader2 size={13} className="animate-spin" /> : <CornerDownLeft size={13} />}
            run
          </button>
        </form>
      </motion.div>
    </section>
  );
};
