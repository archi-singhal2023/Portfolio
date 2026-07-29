import { motion } from "framer-motion";

export const SectionHeading = ({ index, label, title, light }) => {
  return (
    <div data-testid={`heading-${label.toLowerCase()}`}>
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="flex items-center gap-4 font-mono text-xs uppercase tracking-[0.25em] text-[#00FF94]"
      >
        <span>[{index}]</span>
        <span className="h-px w-12 bg-[#00FF94]/40" />
        <span className={light ? "text-black/60" : "text-zinc-500"}>{label}</span>
      </motion.div>
      <motion.h2
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className={`mt-5 font-heading text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl ${
          light ? "text-black" : "text-white"
        }`}
      >
        {title}
      </motion.h2>
    </div>
  );
};
