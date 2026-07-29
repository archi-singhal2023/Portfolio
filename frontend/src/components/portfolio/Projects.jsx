import { motion } from "framer-motion";
import { Github, ExternalLink, FileText, Target, Cpu } from "lucide-react";
import { PROJECTS } from "../../data/portfolio";
import { SectionHeading } from "./SectionHeading";

const ProjectCard = ({ p }) => {
  return (
    <motion.article
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      data-testid={`project-card-${p.index}`}
      className="group relative overflow-hidden border border-white/10 bg-[#080808] transition-colors duration-500 hover:border-[#00FF94]/40"
    >
      {/* tracing top beam */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#00FF94] to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

      <div className="grid grid-cols-1 lg:grid-cols-12">
        {/* left: index + meta */}
        <div className="border-b border-white/10 p-8 lg:col-span-4 lg:border-b-0 lg:border-r lg:p-12">
          <div className="flex items-center justify-between">
            <span className="font-heading text-6xl font-black text-white/10 md:text-7xl">
              {p.index}
            </span>
            <span className="border border-[#00FF94]/40 bg-[#00FF94]/5 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-[#00FF94]">
              {p.status}
            </span>
          </div>
          <h3 className="mt-8 font-heading text-2xl font-extrabold leading-tight text-white md:text-3xl">
            {p.name}
          </h3>
          <p className="mt-3 font-mono text-xs uppercase tracking-[0.15em] text-zinc-500">
            {p.period}
          </p>

          <div className="mt-8 grid grid-cols-3 gap-3">
            {p.metrics.map((m) => (
              <div key={m.label} className="border-l border-[#00FF94]/30 pl-3">
                <div className="font-heading text-lg font-black text-[#00FF94] glow-text">
                  {m.value}
                </div>
                <div className="mt-1 font-mono text-[9px] uppercase leading-tight tracking-wide text-zinc-500">
                  {m.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* right: case study body */}
        <div className="p-8 lg:col-span-8 lg:p-12">
          <div className="space-y-8">
            <div>
              <div className="mb-3 flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-[#00FF94]">
                <Target size={13} /> Problem & Objective
              </div>
              <p className="font-body text-base leading-relaxed text-zinc-400">{p.problem}</p>
            </div>
            <div>
              <div className="mb-3 flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-[#00FF94]">
                <Cpu size={13} /> Architecture & Approach
              </div>
              <p className="font-body text-base leading-relaxed text-zinc-400">{p.architecture}</p>
            </div>

            <div className="flex flex-wrap gap-2">
              {p.stack.map((t) => (
                <span
                  key={t}
                  className="rounded-full border border-white/15 bg-white/5 px-3 py-1 font-mono text-[11px] text-zinc-300"
                >
                  {t}
                </span>
              ))}
            </div>

            <div className="flex flex-wrap gap-3 pt-2">
              {p.links.github && (
                <a
                  href={p.links.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-testid={`project-${p.index}-github`}
                  className="flex items-center gap-2 border border-white/20 px-4 py-2 font-mono text-xs uppercase tracking-[0.1em] text-white transition-colors hover:border-[#00FF94] hover:text-[#00FF94]"
                >
                  <Github size={14} /> Repo
                </a>
              )}
              {p.links.demo && (
                <a
                  href={p.links.demo}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-testid={`project-${p.index}-demo`}
                  className="flex items-center gap-2 border border-white/20 px-4 py-2 font-mono text-xs uppercase tracking-[0.1em] text-white transition-colors hover:border-[#00FF94] hover:text-[#00FF94]"
                >
                  <ExternalLink size={14} /> Live Demo
                </a>
              )}
              {p.links.paper && (
                <a
                  href={p.links.paper}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-testid={`project-${p.index}-paper`}
                  className="flex items-center gap-2 border border-white/20 px-4 py-2 font-mono text-xs uppercase tracking-[0.1em] text-white transition-colors hover:border-[#00FF94] hover:text-[#00FF94]"
                >
                  <FileText size={14} /> Paper
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.article>
  );
};

export const Projects = () => {
  return (
    <section
      id="projects"
      data-testid="projects-section"
      className="relative mx-auto max-w-[1400px] px-6 py-24 md:px-10 md:py-32"
    >
      <SectionHeading index="02" label="Work" title="Featured Case Studies" />
      <div className="mt-16 space-y-8">
        {PROJECTS.map((p) => (
          <ProjectCard key={p.index} p={p} />
        ))}
      </div>
    </section>
  );
};
