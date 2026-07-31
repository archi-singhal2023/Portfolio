import { useEffect } from "react";
import Lenis from "lenis";
import "@/App.css";
import { Toaster } from "@/components/ui/sonner";
import { AvatarProvider } from "@/context/AvatarContext";
import { Navbar } from "@/components/portfolio/Navbar";
import { Hero } from "@/components/portfolio/Hero";
import { MarqueeStrip } from "@/components/portfolio/MarqueeStrip";
import { Skills } from "@/components/portfolio/Skills";
import { Projects } from "@/components/portfolio/Projects";
import { Playground } from "@/components/portfolio/Playground";
import { Experience } from "@/components/portfolio/Experience";
import { Contact } from "@/components/portfolio/Contact";
import { Avatar } from "@/components/portfolio/Avatar";

function App() {
  useEffect(() => {
    document.documentElement.classList.add("dark");
    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });
    let rafId;
    const raf = (time) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);
    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);

  return (
    <AvatarProvider>
      <div className="App" data-testid="app-root">
        <Navbar />
        <main>
          <Hero />
          <MarqueeStrip />
          <Skills />
          <Projects />
          <Playground />
          <Experience />
          <Contact />
        </main>
        <Avatar />
        <Toaster
          position="top-right"
          theme="dark"
          toastOptions={{
            style: {
              background: "#0a0a0a",
              border: "1px solid rgba(0,255,148,0.3)",
              color: "#fff",
              fontFamily: "JetBrains Mono, monospace",
              fontSize: "13px",
            },
          }}
        />
      </div>
    </AvatarProvider>
  );
}

export default App;
