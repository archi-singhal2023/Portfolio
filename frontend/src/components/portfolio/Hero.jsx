import { motion } from "framer-motion";
import { ArrowDown, Github, Linkedin, Mail, FileText } from "lucide-react";
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
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8 inline-flex items-center gap-3 rounded-full border border-[#00FF94]/40 bg-[#00FF94]/5 px-5 py-2.5 font-mono text-xs uppercase tracking-[0.25em] text-[#00FF94] glow-emerald"
        >
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#00FF94] opacity-70" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-[#00FF94]" />
          </span>
          {PROFILE.badge}
        </motion.div>

        <h1 className="font-heading text-[26vw] font-black leading-[0.82] tracking-tighter text-white sm:text-[22vw] lg:text-[16vw]">
          <span className="reveal-line">
            <motion.span
              custom={0}
              variants={lineVariants}
              initial="hidden"
              animate="visible"
              className="block"
            >
              {PROFILE.headlineName}
            </motion.span>
          </span>
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.8 }}
          className="mt-4 font-heading text-3xl font-bold tracking-tight text-[#00FF94] glow-text sm:text-4xl lg:text-5xl"
        >
          {PROFILE.subtitle}
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1, duration: 0.8 }}
          className="mt-8 max-w-2xl font-body text-base leading-relaxed text-zinc-400 sm:text-lg"
        >
          {PROFILE.valueProp}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.25, duration: 0.8 }}
          className="mt-8 flex flex-wrap gap-2.5"
        >
          {PROFILE.heroTags.map((tag) => (
            <span
              key={tag}
              data-testid={`hero-tag-${tag.toLowerCase().replace(/[^a-z0-9]/g, "-")}`}
              className="rounded-full border border-white/15 bg-white/[0.03] px-4 py-1.5 font-mono text-xs text-zinc-300 transition-colors hover:border-[#00FF94]/50 hover:text-[#00FF94]"
            >
              {tag}
            </span>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4, duration: 0.8 }}
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
            <FileText size={15} /> Resume
          </a>
          {PROFILE.socials
            .filter((s) => s.icon !== "Mail")
            .map((s) => {
              const Icon = ICONS[s.icon];
              return (
                <a
                  key={s.label}
                  href={s.url}
                  target={s.url.startsWith("#") ? undefined : "_blank"}
                  rel="noopener noreferrer"
                  data-testid={`hero-social-${s.label.toLowerCase().replace(/\s+/g, "-")}`}
                  className="flex items-center gap-2 border border-white/20 px-7 py-4 font-mono text-xs uppercase tracking-[0.15em] text-white transition-colors hover:border-[#00FF94] hover:text-[#00FF94]"
                >
                  <Icon size={15} /> {s.label}
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
