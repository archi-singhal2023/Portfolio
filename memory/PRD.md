# PRD — Archi Singhal AI/ML Portfolio

## Original Problem Statement
Build a modern, high-converting, interactive AI/ML portfolio for Archi Singhal (B.Tech AI/ML, SSIPMT Raipur). Dark-mode terminal/glassmorphism aesthetic, neon emerald accent. Award-worthy (Awwwards-level) with kinetic hero, framer-motion + lenis motion.

## User Choices
- Interactive AI component: LIVE LLM playground (Claude Sonnet 4-6 via Emergent LLM key)
- Contact form: sends real email via Emergent-managed Resend to singhalarchi583@gmail.com
- Socials: GitHub (archi-singhal2023), LinkedIn (archi-singhal-803489253)
- Headline leads with Generative AI / Agentic Systems

## Architecture
- Frontend: React 19 + Tailwind, framer-motion (reveals), lenis (smooth scroll), react-fast-marquee, custom canvas particle field. Fonts: Cabinet Grotesk / Satoshi / JetBrains Mono.
- Backend: FastAPI. Endpoints: `/api/playground/chat` (SSE streaming Claude), `/api/contact` (Mongo + Resend email).
- DB: MongoDB (chat_messages, contact_messages).

## What's Been Implemented (2025-12)
- Hero with masked line-by-line reveal, particle neural-net background, CTAs, socials
- Editorial marquee, categorized Skills bento grid (5 groups)
- 2 case-study project cards with problem/architecture/stack/metrics/links
- LIVE terminal AI playground (streaming, suggestion chips)
- Experience timeline + education + IJACECT publication
- Working contact form (email + DB) with toast feedback, downloadable resume PDF
- Fully responsive, dark mode. Tested 100% pass (iteration_1).

### Feature Round 2 (2025-12)
- Hero restructured to reference layout: "OPEN TO WORK" badge, giant ARCHI name, "Aspiring AI/ML Engineer" subtitle, skill pills, button-style social links. Removed Hugging Face. Description now Python + Agentic AI focused.
- Floating AI avatar assistant "ARIA" (transparent PNG cutout, glow, idle float, docks on scroll).
- Time-based greeting + auto-speak on load (autoplay-blocked fallback: tap-to-hear + first-interaction trigger).
- Sarvam AI multilingual TTS via backend proxy `/api/tts` (model bulbul:v3, speaker priya). Non-English auto-translated by Claude. Languages: English, Hindi, Hinglish, Tamil, Telugu, Kannada, Odia, Bengali. Mongo cache (tts_cache).
- Language dropdown, replay, mute, speaking pulse rings.
- Project narration: clicking a project card makes ARIA point/nod + speak a 2-sentence summary in the selected language.

### KNOWN ISSUE
- Emergent-managed email (Resend) key `EMERGENT_EMAIL_KEY` currently returns 401 "API key is invalid" (platform-side; worked in iter1, now rejected). Contact form now degrades gracefully: message is ALWAYS saved to Mongo (`contact_messages`) and returns success; email is best-effort (`email_sent` flag). Re-fetched playbook returns the same (invalid) key.

## Backlog / Next
- P0: Restore email delivery (managed key) OR add an owner-only inbox page to read `contact_messages`.
- P1: Real GitHub demo/paper URLs; Hugging Face + Kaggle when available.
- P2: Project detail pages; Cmd+K command palette.
