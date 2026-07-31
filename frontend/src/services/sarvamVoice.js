// Sarvam AI voice service — talks to our backend proxy (key stays server-side).
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

let currentAudio = null;

export function stopSpeaking() {
  if (currentAudio) {
    currentAudio.pause();
    currentAudio.src = "";
    currentAudio = null;
  }
}

/**
 * Synthesize `text` in `language` via backend, then play it.
 * Returns a promise that resolves { spokenText } once playback STARTS.
 * onStart / onEnd callbacks fire around actual audio playback.
 */
export async function speak(text, language, { onStart, onEnd } = {}) {
  stopSpeaking();

  const res = await fetch(`${API}/tts`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text, language }),
  });

  if (!res.ok) {
    const err = new Error(`TTS failed: ${res.status}`);
    err.status = res.status;
    throw err;
  }

  const data = await res.json();
  const audio = new Audio(`data:${data.mime_type || "audio/wav"};base64,${data.audio_base64}`);
  currentAudio = audio;

  audio.addEventListener("play", () => onStart && onStart());
  audio.addEventListener("ended", () => {
    onEnd && onEnd();
    if (currentAudio === audio) currentAudio = null;
  });
  audio.addEventListener("error", () => {
    onEnd && onEnd();
  });

  await audio.play(); // may reject if autoplay is blocked
  return { spokenText: data.spoken_text };
}
