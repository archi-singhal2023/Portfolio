import { createContext, useContext, useState, useRef, useCallback } from "react";

const AvatarContext = createContext(null);

export function AvatarProvider({ children }) {
  const [language, setLanguage] = useState("english");
  const narratorRef = useRef(null);

  // Avatar registers its narration handler here.
  const registerNarrator = useCallback((fn) => {
    narratorRef.current = fn;
  }, []);

  // Any component can request narration (e.g. project cards).
  const narrate = useCallback((payload) => {
    narratorRef.current && narratorRef.current(payload);
  }, []);

  return (
    <AvatarContext.Provider value={{ language, setLanguage, registerNarrator, narrate }}>
      {children}
    </AvatarContext.Provider>
  );
}

export function useAvatar() {
  const ctx = useContext(AvatarContext);
  if (!ctx) throw new Error("useAvatar must be used within AvatarProvider");
  return ctx;
}
