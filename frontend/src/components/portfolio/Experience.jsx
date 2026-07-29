import { motion } from "framer-motion";
import { Briefcase, GraduationCap, BookOpen } from "lucide-react";
import { EXPERIENCE, EDUCATION, PUBLICATION } from "../../data/portfolio";
import { SectionHeading } from "./SectionHeading";

const Node = ({ children, testid }) => (
  <motion.div
    initial={{ opacity: 0, x: -30 }}
    whileInView={{ opacity: 1, x: 0 }}
    viewport={{ once: true, margin: "-60px" }}
    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    data-testid={testid}
    className="relative pl-12 md:pl-20"
  >
    {/* node dot */}
    <span className="absolute left-[6px] top-1.5 h-3.5 w-3.5 -translate-x-1/2 rounded-full border-2 border-[#00FF94] bg-[#050505] glow-emerald md:left-[10px]" />
    {children}
  </motion.div>
);

export const Experience = () => {
  return (
    <section
      id="experience"
      data-testid="experience-section"
      className="relative mx-auto max-w-[1400px] px-6 py-24 md:px-10 md:py-32"
    >
      <SectionHeading index="04" label="Journey" title="Experience & Impact" />

      <div className="relative mt-16">
        {/* central/left glowing line */}
        <div className="absolute left-[6px] top-0 h-full w-px bg-gradient-to-b from-[#00FF94] via-[#00FF94]/40 to-transparent md:left-[10px]" />

        <div className="space-y-14">
          {EXPERIENCE.map((exp, i) => (
            <Node key={i} testid={`experience-item-${i}`}>
              <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-[#00FF94]">
                <Briefcase size={13} /> {exp.period} · {exp.location}
              </div>
              <h3 className="mt-3 font-heading text-2xl font-extrabold text-white md:text-3xl">
                {exp.role}{" "}
                <span className="text-zinc-500">@ {exp.company}</span>
              </h3>
              <ul className="mt-5 space-y-3">
                {exp.points.map((pt, j) => (
                  <li key={j} className="flex gap-3 font-body text-base leading-relaxed text-zinc-400">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#00FF94]" />
                    {pt}
                  </li>
                ))}
              </ul>
              <div className="mt-5 flex flex-wrap gap-2">
                {exp.tags.map((t) => (
                  <span
                    key={t}
                    className="rounded-full border border-white/15 bg-white/5 px-3 py-1 font-mono text-[11px] text-zinc-300"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </Node>
          ))}

          <Node testid="education-item">
            <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-[#00FF94]">
              <GraduationCap size={13} /> {EDUCATION.period}
            </div>
            <h3 className="mt-3 font-heading text-2xl font-extrabold text-white md:text-3xl">
              {EDUCATION.degree}
            </h3>
            <p className="mt-2 font-body text-base text-zinc-400">{EDUCATION.school}</p>
          </Node>

          <Node testid="publication-item">
            <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-[#00FF94]">
              <BookOpen size={13} /> Publication · {PUBLICATION.detail}
            </div>
            <h3 className="mt-3 font-heading text-xl font-extrabold text-white md:text-2xl">
              {PUBLICATION.title}
            </h3>
            <p className="mt-2 font-body text-sm text-zinc-500">{PUBLICATION.journal}</p>
            <p className="mt-1 font-mono text-xs text-zinc-600">{PUBLICATION.authors}</p>
          </Node>
        </div>
      </div>
    </section>
  );
};
