import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { PROFILE } from "../../data/portfolio";

const LINKS = [
  { label: "Skills", href: "#skills" },
  { label: "Projects", href: "#projects" },
  { label: "Playground", href: "#playground" },
  { label: "Experience", href: "#experience" },
  { label: "Contact", href: "#contact" },
];

export const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const go = (href) => {
    setOpen(false);
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <motion.header
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
      data-testid="navbar"
      className={`fixed top-0 left-0 z-50 w-full transition-[background,border] duration-300 ${
        scrolled ? "glass border-b border-white/10" : "border-b border-transparent"
      }`}
    >
      <nav className="mx-auto flex max-w-[1400px] items-center justify-between px-6 py-4 md:px-10">
        <button
          data-testid="nav-logo"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="font-mono text-sm tracking-tight text-white"
        >
          <span className="text-[#00FF94]">~/</span>archi.singhal
          <span className="cursor-blink text-[#00FF94]">_</span>
        </button>

        <div className="hidden items-center gap-8 md:flex">
          {LINKS.map((l) => (
            <button
              key={l.href}
              data-testid={`nav-link-${l.label.toLowerCase()}`}
              onClick={() => go(l.href)}
              className="font-mono text-xs uppercase tracking-[0.15em] text-zinc-400 transition-colors hover:text-[#00FF94]"
            >
              {l.label}
            </button>
          ))}
          <a
            href={PROFILE.resumeUrl}
            target="_blank"
            rel="noopener noreferrer"
            data-testid="nav-resume-btn"
            className="border border-[#00FF94] px-4 py-2 font-mono text-xs uppercase tracking-[0.15em] text-[#00FF94] transition-colors hover:bg-[#00FF94] hover:text-black"
          >
            Resume
          </a>
        </div>

        <button
          data-testid="nav-mobile-toggle"
          onClick={() => setOpen((v) => !v)}
          className="text-white md:hidden"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-white/10 glass md:hidden"
          >
            <div className="flex flex-col gap-1 px-6 py-4">
              {LINKS.map((l) => (
                <button
                  key={l.href}
                  data-testid={`nav-mobile-link-${l.label.toLowerCase()}`}
                  onClick={() => go(l.href)}
                  className="py-3 text-left font-mono text-sm uppercase tracking-[0.15em] text-zinc-300"
                >
                  {l.label}
                </button>
              ))}
              <a
                href={PROFILE.resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                data-testid="nav-mobile-resume"
                className="mt-2 border border-[#00FF94] px-4 py-3 text-center font-mono text-sm uppercase tracking-[0.15em] text-[#00FF94]"
              >
                View Resume
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};
