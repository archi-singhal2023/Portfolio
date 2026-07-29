import { motion } from "framer-motion";
import { ArrowDown, Github, Linkedin, Mail, FileText, Sparkles } from "lucide-react";
import { ParticleField } from "./ParticleField";
import { PROFILE } from "../../data/portfolio";

const ICONS = { Github, Linkedin, Mail };

const lineVariants = {
  hidden: { y: "110%" },
  visible: (i) => ({
    y: "0%",
    transition: { duration: 1, ease: [0.76, 0, 0.24, 1], delay: 0.4 + i * 0.12 },
  }),
};

export const Hero = () => {
  const scrollTo = (id) =>
    document.querySelector(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <section
      id="hero"
      data-testid="hero-section"
      className="relative flex min-h-screen flex-col justify-center overflow-hidden grid-bg pt-28 pb-16"
    >
      <ParticleField />
      {/* radial fade so particles don't clash with text */}
      <div
        className="pointer-events-none absolute inset-0 z-[1]"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 30% 45%, rgba(5,5,5,0.55), rgba(5,5,5,0.9) 70%)",
        }}
      />

      <div className="relative z-10 mx-auto w-full max-w-[1400px] px-6 md:px-10">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-8 flex items-center gap-3 font-mono text-xs uppercase tracking-[0.25em] text-[#00FF94]"
        >
          <span className="h-2 w-2 rounded-full bg-[#00FF94] glow-emerald" />
          {PROFILE.role} · {PROFILE.location} · Available 2026
        </motion.div>

        <h1 className="font-heading text-[15vw] font-black leading-[0.85] tracking-tighter text-white sm:text-[13vw] lg:text-[11vw]">
          {PROFILE.headlineLines.map((line, i) => (
            <span key={i} className="reveal-line">
              <motion.span
                custom={i}
                variants={lineVariants}
                initial="hidden"
                animate="visible"
                className="block"
              >
                {line.includes("AGENTIC") ? (
                  <span className="text-[#00FF94] glow-text">{line}</span>
                ) : (
                  line
                )}
              </motion.span>
            </span>
          ))}
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1, duration: 0.8 }}
          className="mt-10 max-w-xl font-body text-base leading-relaxed text-zinc-400 sm:text-lg"
        >
          {PROFILE.valueProp}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.3, duration: 0.8 }}
          className="mt-10 flex flex-wrap items-center gap-4"
        >
          <button
            data-testid="hero-view-projects"
            onClick={() => scrollTo("#projects")}
            className="group flex items-center gap-2 bg-[#00FF94] px-7 py-4 font-mono text-xs font-bold uppercase tracking-[0.15em] text-black transition-transform hover:-translate-y-1"
          >
            View Projects
            <ArrowDown size={15} className="transition-transform group-hover:translate-y-0.5" />
          </button>
          <a
            href={PROFILE.resumeUrl}
            download
            data-testid="hero-read-resume"
            className="flex items-center gap-2 border border-white/20 px-7 py-4 font-mono text-xs uppercase tracking-[0.15em] text-white transition-colors hover:border-[#00FF94] hover:text-[#00FF94]"
          >
            <FileText size={15} /> Read Resume
          </a>
          <button
            data-testid="hero-try-ai"
            onClick={() => scrollTo("#playground")}
            className="flex items-center gap-2 px-3 py-4 font-mono text-xs uppercase tracking-[0.15em] text-zinc-400 transition-colors hover:text-[#00FF94]"
          >
            <Sparkles size={15} /> Ask my AI
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="mt-12 flex items-center gap-5"
        >
          {PROFILE.socials.map((s) => {
            const Icon = ICONS[s.icon];
            return (
              <a
                key={s.label}
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                data-testid={`hero-social-${s.label.toLowerCase()}`}
                aria-label={s.label}
                className="text-zinc-500 transition-colors hover:text-[#00FF94]"
              >
                <Icon size={20} />
              </a>
            );
          })}
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8 }}
        className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 font-mono text-[10px] uppercase tracking-[0.3em] text-zinc-600"
      >
        <span className="flex items-center gap-2">
          <ArrowDown size={12} className="animate-bounce" /> scroll
        </span>
      </motion.div>
    </section>
  );
};
