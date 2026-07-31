import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Globe, Volume2, VolumeX, Play, ChevronUp, X } from "lucide-react";
import { LANGUAGES, AVATAR_INTRO } from "../../data/portfolio";
import { speak, stopSpeaking } from "../../services/sarvamVoice";
import { useAvatar } from "../../context/AvatarContext";

const timeGreeting = () => {
  const h = new Date().getHours();
  if (h >= 4 && h < 12) return "Good morning!";
  if (h >= 12 && h < 17) return "Good afternoon!";
  return "Good evening!";
};

export const Avatar = () => {
  const { language, setLanguage, registerNarrator } = useAvatar();
  const [docked, setDocked] = useState(false);
  const [bubble, setBubble] = useState("");
  const [speaking, setSpeaking] = useState(false);
  const [pointing, setPointing] = useState(false);
  const [needsTap, setNeedsTap] = useState(false);
  const [muted, setMuted] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [showBubble, setShowBubble] = useState(true);

  const greetedRef = useRef(false);
  const lastTextRef = useRef("");
  const mutedRef = useRef(false);
  const autoplayBlockedRef = useRef(false);
  const languageRef = useRef(language);
  useEffect(() => { languageRef.current = language; }, [language]);
  useEffect(() => { mutedRef.current = muted; }, [muted]);

  const greetingText = `${timeGreeting()} ${AVATAR_INTRO}`;

  // core speak routine
  const doSpeak = useCallback(async (text, { point } = {}) => {
    lastTextRef.current = text;
    setBubble(text);
    setShowBubble(true);
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
      // autoplay blocked or voice not configured — keep text visible
      if (e && e.name === "NotAllowedError") {
        setNeedsTap(true);
        autoplayBlockedRef.current = true;
      }
    }
  }, []);

  // register project narration handler
  useEffect(() => {
    registerNarrator((payload) => {
      if (payload?.type === "project" && payload.project) {
        doSpeak(payload.project.voiceSummary, { point: true });
      }
    });
  }, [registerNarrator, doSpeak]);

  // greeting on load (with autoplay fallback)
  useEffect(() => {
    if (greetedRef.current) return;
    greetedRef.current = true;
    setBubble(greetingText);
    const t = setTimeout(() => doSpeak(greetingText), 1600);

    // if autoplay was blocked, play greeting on the first user interaction
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
  const imgWidth = docked ? 132 : 288;

  return (
    <div
      data-testid="avatar-assistant"
      className="pointer-events-none fixed bottom-4 right-3 z-40 flex flex-col items-end sm:bottom-6 sm:right-6"
    >
      {/* speech bubble + controls */}
      <AnimatePresence>
        {showBubble && bubble && (
          <motion.div
            key="bubble"
            initial={{ opacity: 0, y: 12, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            data-testid="avatar-bubble"
            className="pointer-events-auto relative mb-3 w-[74vw] max-w-[330px] glass rounded-2xl rounded-br-sm border border-[#00FF94]/25 p-4 shadow-[0_8px_40px_rgba(0,0,0,0.6)]"
          >
            <button
              onClick={() => setShowBubble(false)}
              data-testid="avatar-bubble-close"
              className="absolute right-2 top-2 text-zinc-500 transition-colors hover:text-white"
              aria-label="Dismiss"
            >
              <X size={14} />
            </button>

            <div className="mb-2 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-[#00FF94]">
              <span className="relative flex h-1.5 w-1.5">
                {speaking && (
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#00FF94]" />
                )}
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#00FF94]" />
              </span>
              ARIA · Archi&apos;s Assistant
            </div>

            <p className="pr-4 font-body text-sm leading-relaxed text-zinc-200">{bubble}</p>

            {needsTap && (
              <button
                onClick={replay}
                data-testid="avatar-tap-to-hear"
                className="mt-3 flex items-center gap-2 rounded-full border border-[#00FF94]/40 bg-[#00FF94]/5 px-3 py-1.5 font-mono text-[11px] text-[#00FF94]"
              >
                <Play size={12} /> Tap to hear me
              </button>
            )}

            {/* controls */}
            <div className="mt-3 flex items-center gap-2 border-t border-white/10 pt-3">
              {/* language dropdown */}
              <div className="relative">
                <button
                  onClick={() => setLangOpen((v) => !v)}
                  data-testid="avatar-language-toggle"
                  className="flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 font-mono text-[11px] text-zinc-200 transition-colors hover:border-[#00FF94]/50"
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
                      className="absolute bottom-full left-0 mb-2 max-h-56 w-40 overflow-y-auto rounded-xl border border-white/10 bg-[#0a0a0a] p-1 shadow-2xl"
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

              <button
                onClick={replay}
                data-testid="avatar-replay"
                className="rounded-full border border-white/15 bg-white/5 p-2 text-zinc-300 transition-colors hover:border-[#00FF94]/50 hover:text-[#00FF94]"
                aria-label="Replay"
              >
                <Play size={13} />
              </button>
              <button
                onClick={toggleMute}
                data-testid="avatar-mute"
                className="rounded-full border border-white/15 bg-white/5 p-2 text-zinc-300 transition-colors hover:border-[#00FF94]/50 hover:text-[#00FF94]"
                aria-label={muted ? "Unmute" : "Mute"}
              >
                {muted ? <VolumeX size={13} /> : <Volume2 size={13} />}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* re-open bubble tab when dismissed */}
      {!showBubble && (
        <button
          onClick={() => setShowBubble(true)}
          data-testid="avatar-reopen"
          className="pointer-events-auto mb-3 rounded-full border border-[#00FF94]/40 bg-[#0a0a0a] px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.15em] text-[#00FF94]"
        >
          Ask ARIA
        </button>
      )}

      {/* avatar image */}
      <motion.button
        onClick={replay}
        data-testid="avatar-image-btn"
        aria-label="Replay greeting"
        className="pointer-events-auto relative flex items-end justify-center"
        animate={{ width: imgWidth }}
        transition={{ type: "spring", stiffness: 140, damping: 20 }}
        style={{ transformOrigin: "bottom right" }}
      >
        {/* speaking rings */}
        <AnimatePresence>
          {speaking && (
            <>
              {[0, 1, 2].map((i) => (
                <motion.span
                  key={i}
                  className="absolute bottom-6 h-24 w-24 rounded-full border border-[#00FF94]/40"
                  initial={{ scale: 0.6, opacity: 0.6 }}
                  animate={{ scale: 2.2, opacity: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1.6, repeat: Infinity, delay: i * 0.5, ease: "easeOut" }}
                />
              ))}
            </>
          )}
        </AnimatePresence>

        {/* glow */}
        <div className="absolute bottom-2 h-40 w-40 rounded-full bg-[#00FF94]/15 blur-3xl" />

        <motion.img
          src="/avatar.png"
          alt="Archi's AI assistant"
          className="relative z-[1] w-full drop-shadow-[0_10px_30px_rgba(0,0,0,0.6)]"
          initial={{ opacity: 0, y: 60, rotate: -3 }}
          animate={{
            opacity: 1,
            y: pointing ? -6 : [0, -8, 0],
            rotate: pointing ? -6 : 0,
          }}
          transition={
            pointing
              ? { duration: 0.5 }
              : { y: { duration: 4, repeat: Infinity, ease: "easeInOut" }, opacity: { duration: 0.9 }, rotate: { duration: 0.5 } }
          }
        />
      </motion.button>
    </div>
  );
};
