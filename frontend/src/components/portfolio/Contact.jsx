import { useState } from "react";
import { motion } from "framer-motion";
import { Github, Linkedin, Mail, Send, Loader2, Check, FileText, ArrowUpRight } from "lucide-react";
import { toast } from "sonner";
import { send } from "@emailjs/browser";
import { PROFILE } from "../../data/portfolio";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;
const EMAILJS_SERVICE_ID = process.env.REACT_APP_EMAILJS_SERVICE_ID;
const EMAILJS_TEMPLATE_ID = process.env.REACT_APP_EMAILJS_TEMPLATE_ID;
const EMAILJS_PUBLIC_KEY = process.env.REACT_APP_EMAILJS_PUBLIC_KEY;
const USE_EMAILJS = Boolean(EMAILJS_SERVICE_ID && EMAILJS_TEMPLATE_ID && EMAILJS_PUBLIC_KEY);
const ICONS = { Github, Linkedin, Mail };

export const Contact = () => {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState("idle"); // idle | sending | sent

  const submit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      toast.error("Please fill in all fields.");
      return;
    }
    setStatus("sending");

    try {
      if (USE_EMAILJS) {
        console.debug("EmailJS send", {
          serviceId: EMAILJS_SERVICE_ID,
          templateId: EMAILJS_TEMPLATE_ID,
          publicKey: EMAILJS_PUBLIC_KEY,
        });
        await send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
          from_name: form.name,
          from_email: form.email,
          message: form.message,
        }, EMAILJS_PUBLIC_KEY);
      } else {
        const resp = await fetch(`${API}/contact`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
        const data = await resp.json();
        if (!resp.ok) throw new Error(data.detail || "failed");
      }

      setStatus("sent");
      toast.success("Message sent — Archi will get back to you soon.");
      setForm({ name: "", email: "", message: "" });
      setTimeout(() => setStatus("idle"), 3000);
    } catch (err) {
      console.error("Contact send failed", err);
      setStatus("idle");
      const errorText = err?.text || err?.message || "Failed to send. Try email directly.";
      toast.error(errorText);
    }
  };

  const emailServiceMode = USE_EMAILJS ? "EmailJS" : "Backend API";
  const field = "w-full border-b border-white/15 bg-transparent py-4 font-body text-lg text-white placeholder:text-zinc-600 transition-colors focus:border-[#00FF94] focus:outline-none";

  return (
    <section
      id="contact"
      data-testid="contact-section"
      className="relative overflow-hidden border-t border-white/10 bg-[#050505] px-6 py-24 md:px-10 md:py-32"
    >
      <div className="mx-auto max-w-[1400px]">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="font-mono text-xs uppercase tracking-[0.25em] text-[#00FF94]"
        >
          [05] · Contact
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mt-4 font-heading text-[16vw] font-black leading-[0.85] tracking-tighter text-white md:text-[11vw]"
        >
          LET&apos;S <span className="text-[#00FF94] glow-text">BUILD.</span>
        </motion.h2>

        <div className="mt-16 grid grid-cols-1 gap-16 lg:grid-cols-2">
          {/* form */}
          <motion.form
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            onSubmit={submit}
            data-testid="contact-form"
            className="space-y-8"
          >
            <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-xs text-white/80">
              Sending with <span className="font-semibold text-[#00FF94]">{emailServiceMode}</span>
            </div>
            <input
              data-testid="contact-name"
              className={field}
              placeholder="Your name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            <input
              data-testid="contact-email"
              type="email"
              className={field}
              placeholder="Your email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
            <textarea
              data-testid="contact-message"
              rows={4}
              className={`${field} resize-none`}
              placeholder="What do you want to build?"
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
            />
            <button
              type="submit"
              data-testid="contact-submit"
              disabled={status !== "idle"}
              className="group flex items-center gap-3 bg-[#00FF94] px-8 py-4 font-mono text-xs font-bold uppercase tracking-[0.15em] text-black transition-transform hover:-translate-y-1 disabled:opacity-70"
            >
              {status === "sending" && <Loader2 size={16} className="animate-spin" />}
              {status === "sent" && <Check size={16} />}
              {status === "idle" && <Send size={16} />}
              {status === "sending" ? "Sending" : status === "sent" ? "Sent" : "Send Message"}
            </button>
          </motion.form>

          {/* direct links */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="flex flex-col justify-between gap-10"
          >
            <div className="space-y-1">
              {PROFILE.socials.map((s) => {
                const Icon = ICONS[s.icon];
                return (
                  <a
                    key={s.label}
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-testid={`contact-social-${s.label.toLowerCase()}`}
                    className="group flex items-center justify-between border-b border-white/10 py-5 transition-colors hover:border-[#00FF94]/50"
                  >
                    <span className="flex items-center gap-4">
                      <Icon size={20} className="text-[#00FF94]" />
                      <span className="font-heading text-xl font-bold text-white">{s.label}</span>
                    </span>
                    <span className="flex items-center gap-2 font-mono text-xs text-zinc-500 transition-colors group-hover:text-[#00FF94]">
                      {s.handle}
                      <ArrowUpRight size={15} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </span>
                  </a>
                );
              })}
            </div>

            <a
              href={PROFILE.resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              data-testid="contact-resume-download"
              className="flex items-center justify-center gap-3 border border-[#00FF94] py-5 font-mono text-xs uppercase tracking-[0.15em] text-[#00FF94] transition-colors hover:bg-[#00FF94] hover:text-black"
            >
              <FileText size={16} /> View Résumé (PDF)
            </a>
          </motion.div>
        </div>

        {/* footer bar */}
        <div className="mt-24 flex flex-col items-start justify-between gap-4 border-t border-white/10 pt-8 font-mono text-xs text-zinc-600 md:flex-row md:items-center">
          <span>© 2026 {PROFILE.name}. Built with React, FastAPI & Claude.</span>
          <span className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[#00FF94] glow-emerald" /> Available for AI/ML roles
          </span>
        </div>
      </div>
    </section>
  );
};
