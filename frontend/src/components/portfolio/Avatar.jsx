import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Globe, Volume2, VolumeX, Play, ChevronUp } from "lucide-react";
import { LANGUAGES, AVATAR_INTRO } from "../../data/portfolio";
import { speak, stopSpeaking } from "../../services/sarvamVoice";
import { useAvatar } from "../../context/AvatarContext";

const timeGreeting = () => {
  const h = new Date().getHours();
  if (h >= 4 && h < 12) return "Good morning.";
  if (h >= 12 && h < 17) return "Good afternoon.";
  return "Good evening.";
};

const useViewportWidth = () => {
  const [w, setW] = useState(typeof window !== "undefined" ? window.innerWidth : 1280);
  useEffect(() => {
    const onResize = () => setW(window.innerWidth);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);
  return w;
};

export const Avatar = () => {
  const { language, setLanguage, registerNarrator } = useAvatar();
  const vw = useViewportWidth();
  const [docked, setDocked] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [pointing, setPointing] = useState(false);
  const [needsTap, setNeedsTap] = useState(false);
  const [muted, setMuted] = useState(false);
  const [langOpen, setLangOpen] = useState(false);

  const greetedRef = useRef(false);
  const lastTextRef = useRef("");
  const mutedRef = useRef(false);
  const autoplayBlockedRef = useRef(false);
  const languageRef = useRef(language);
  useEffect(() => { languageRef.current = language; }, [language]);
  useEffect(() => { mutedRef.current = muted; }, [muted]);

  const greetingText = `${timeGreeting()} ${AVATAR_INTRO}`;

  // core speak routine (voice only — no on-screen transcript)
  const doSpeak = useCallback(async (text, { point } = {}) => {
    lastTextRef.current = text;
    if (point) {
      setPointing(true);
      setTimeout(() => setPointing(false), 2600);
    }
    if (mutedRef.current) return;
    try {
      setNeedsTap(false);
      await speak(text, languageRef.current, {
        onStart: () => setSpeaking(true),
        onEnd: () => setSpeaking(false),
      });
    } catch (e) {
      setSpeaking(false);
      if (e && e.name === "NotAllowedError") {
        setNeedsTap(true);
        autoplayBlockedRef.current = true;
      }
    }
  }, []);

  // project narration handler
  useEffect(() => {
    registerNarrator((payload) => {
      if (payload?.type === "project" && payload.project) {
        doSpeak(payload.project.voiceSummary, { point: true });
      }
    });
  }, [registerNarrator, doSpeak]);

  // greeting on load (with autoplay fallback)
  useEffect(() => {
    const t = setTimeout(() => {
      if (greetedRef.current) return;
      greetedRef.current = true;
      doSpeak(greetingText);
    }, 1600);

    const onFirstInteract = () => {
      if (autoplayBlockedRef.current && !mutedRef.current) {
        autoplayBlockedRef.current = false;
        setNeedsTap(false);
        doSpeak(lastTextRef.current || greetingText);
      }
    };
    window.addEventListener("pointerdown", onFirstInteract);
    return () => {
      clearTimeout(t);
      window.removeEventListener("pointerdown", onFirstInteract);
    };
  }, []);

  // dock on scroll
  useEffect(() => {
    const onScroll = () => setDocked(window.scrollY > window.innerHeight * 0.55);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const replay = () => doSpeak(lastTextRef.current || greetingText);

  const changeLanguage = (key) => {
    setLanguage(key);
    languageRef.current = key;
    setLangOpen(false);
    doSpeak(lastTextRef.current || greetingText);
  };

  const toggleMute = () => {
    const next = !muted;
    setMuted(next);
    mutedRef.current = next;
    if (next) {
      stopSpeaking();
      setSpeaking(false);
    }
  };

  const currentLang = LANGUAGES.find((l) => l.key === language) || LANGUAGES[0];
  const heroWidth = vw >= 1024 ? 470 : vw >= 640 ? 320 : 210;
  const imgWidth = docked ? 128 : heroWidth;

  return (
    <div
      data-testid="avatar-assistant"
      className="pointer-events-none fixed bottom-0 right-0 z-40 flex items-end gap-2 p-3 sm:gap-3 sm:p-5"
    >
      {/* control cluster (kept minimal — no speech transcript) */}
      <div className="pointer-events-auto relative mb-2 flex flex-col items-start gap-2">
        {/* language dropdown */}
        <div className="relative">
          <button
            onClick={() => setLangOpen((v) => !v)}
            data-testid="avatar-language-toggle"
            className="flex items-center gap-1.5 rounded-full border border-white/15 bg-black/50 px-3 py-1.5 font-mono text-[11px] text-zinc-200 backdrop-blur-md transition-colors hover:border-[#00FF94]/50"
          >
            <Globe size={12} className="text-[#00FF94]" />
            {currentLang.label}
            <ChevronUp size={12} className={`transition-transform ${langOpen ? "" : "rotate-180"}`} />
          </button>
          <AnimatePresence>
            {langOpen && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 6 }}
                data-testid="avatar-language-menu"
                className="absolute bottom-full left-0 mb-2 max-h-60 w-40 overflow-y-auto rounded-xl border border-white/10 bg-[#0a0a0a] p-1 shadow-2xl"
              >
                {LANGUAGES.map((l) => (
                  <button
                    key={l.key}
                    onClick={() => changeLanguage(l.key)}
                    data-testid={`avatar-lang-${l.key}`}
                    className={`block w-full rounded-lg px-3 py-2 text-left font-mono text-xs transition-colors hover:bg-white/5 ${
                      l.key === language ? "text-[#00FF94]" : "text-zinc-300"
                    }`}
                  >
                    {l.label}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={toggleMute}
            data-testid="avatar-mute"
            className="rounded-full border border-white/15 bg-black/50 p-2 text-zinc-300 backdrop-blur-md transition-colors hover:border-[#00FF94]/50 hover:text-[#00FF94]"
            aria-label={muted ? "Unmute" : "Mute"}
          >
            {muted ? <VolumeX size={13} /> : <Volume2 size={13} />}
          </button>

          {/* speaking equalizer */}
          <AnimatePresence>
            {speaking && (
              <motion.div
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                className="flex items-center gap-0.5 overflow-hidden pl-1"
                data-testid="avatar-speaking-indicator"
              >
                {[0, 1, 2, 3].map((i) => (
                  <motion.span
                    key={i}
                    className="w-0.5 rounded-full bg-[#00FF94]"
                    animate={{ height: [4, 14, 6, 12, 4] }}
                    transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.12 }}
                  />
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {needsTap && !speaking && (
            <button
              onClick={replay}
              data-testid="avatar-tap-to-hear"
              aria-label="Tap to hear greeting"
              className="rounded-full border border-[#00FF94]/50 bg-[#00FF94]/10 p-2 text-[#00FF94]"
            >
              <motion.span
                animate={{ scale: [1, 1.25, 1] }}
                transition={{ duration: 1.2, repeat: Infinity }}
                className="block"
              >
                <Play size={13} />
              </motion.span>
            </button>
          )}
        </div>
      </div>

      {/* cinematic avatar */}
      <motion.button
        onClick={replay}
        data-testid="avatar-image-btn"
        aria-label="Replay greeting"
        className="pointer-events-auto relative flex items-end justify-center"
        animate={{ width: imgWidth }}
        transition={{ type: "spring", stiffness: 140, damping: 20 }}
        style={{ transformOrigin: "bottom right" }}
      >
        {/* soft twinkles behind */}
        {!docked &&
          [
            { t: "10%", l: "12%", d: 0 },
            { t: "22%", l: "70%", d: 0.6 },
            { t: "40%", l: "8%", d: 1.1 },
            { t: "60%", l: "80%", d: 1.6 },
            { t: "30%", l: "40%", d: 0.3 },
          ].map((s, i) => (
            <motion.span
              key={i}
              className="absolute h-1 w-1 rounded-full bg-white"
              style={{ top: s.t, left: s.l }}
              animate={{ opacity: [0.1, 0.9, 0.1], scale: [0.8, 1.3, 0.8] }}
              transition={{ duration: 2.6, repeat: Infinity, delay: s.d }}
            />
          ))}

        {/* speaking rings */}
        <AnimatePresence>
          {speaking && (
            <>
              {[0, 1, 2].map((i) => (
                <motion.span
                  key={i}
                  className="absolute bottom-16 h-28 w-28 rounded-full border border-[#00FF94]/40"
                  initial={{ scale: 0.6, opacity: 0.6 }}
                  animate={{ scale: 2.4, opacity: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1.8, repeat: Infinity, delay: i * 0.55, ease: "easeOut" }}
                />
              ))}
            </>
          )}
        </AnimatePresence>

        {/* cinematic glow + vignette so the avatar melts into the dark hero */}
        <div className="absolute bottom-4 h-48 w-48 rounded-full bg-[#00FF94]/15 blur-[70px]" />
        <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_center,transparent_55%,rgba(5,5,5,0.7)_100%)]" />

        <motion.img
          src="/avatar.png"
          alt="Archi's AI assistant"
          className="relative z-[1] w-full"
          style={{
            WebkitMaskImage:
              "linear-gradient(to bottom, black 82%, transparent 100%)",
            maskImage: "linear-gradient(to bottom, black 82%, transparent 100%)",
            filter: "drop-shadow(0 12px 40px rgba(0,0,0,0.7))",
          }}
          initial={{ opacity: 0, y: 60, rotate: -3 }}
          animate={{
            opacity: 1,
            y: pointing ? -8 : [0, -9, 0],
            rotate: pointing ? -5 : 0,
          }}
          transition={
            pointing
              ? { duration: 0.5 }
              : {
                  y: { duration: 4.5, repeat: Infinity, ease: "easeInOut" },
                  opacity: { duration: 1 },
                  rotate: { duration: 0.5 },
                }
          }
        />
      </motion.button>
    </div>
  );
};
