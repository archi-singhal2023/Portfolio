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

## Backlog / Next
- P1: Add Hugging Face + Kaggle links when available; real GitHub demo/paper URLs
- P2: Blog/writing section; project detail pages; view counter analytics
- P2: Light "command palette" nav (Cmd+K)
