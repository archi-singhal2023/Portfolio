import { motion } from "framer-motion";
import { SKILLS } from "../../data/portfolio";
import { SectionHeading } from "./SectionHeading";

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};
const card = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

// bento spans for a broken, non-uniform grid
const SPANS = [
  "md:col-span-6 md:row-span-2",
  "md:col-span-6",
  "md:col-span-4",
  "md:col-span-4",
  "md:col-span-4",
];

export const Skills = () => {
  return (
    <section
      id="skills"
      data-testid="skills-section"
      className="relative mx-auto max-w-[1400px] px-6 py-24 md:px-10 md:py-32"
    >
      <SectionHeading index="01" label="Stack" title="Technical Arsenal" />

      <motion.div
        variants={container}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        className="mt-16 grid grid-cols-1 gap-5 md:grid-cols-12"
      >
        {SKILLS.map((group, i) => (
          <motion.div
            key={group.title}
            variants={card}
            data-testid={`skill-card-${group.tag}`}
            className={`group glass p-8 transition-all duration-300 hover:-translate-y-2 hover:border-[#00FF94]/50 ${SPANS[i]}`}
          >
            <div className="mb-6 flex items-center justify-between">
              <h3 className="font-heading text-2xl font-extrabold text-white md:text-3xl">
                {group.title}
              </h3>
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#00FF94]">
                /{group.tag}
              </span>
            </div>
            <ul className="flex flex-wrap gap-x-6 gap-y-3">
              {group.items.map((item) => (
                <li
                  key={item}
                  className="flex items-center gap-2 font-mono text-sm text-zinc-300 transition-colors group-hover:text-white"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-[#00FF94] glow-emerald" />
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
};
