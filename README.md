# Archi Singhal — AI/ML Portfolio

Personal portfolio site with a live AI playground and multilingual voice assistant.

## Stack

- **Frontend:** React 19, Tailwind, Framer Motion, shadcn/ui
- **Backend:** FastAPI, MongoDB Atlas
- **AI:** Groq (Llama 3.3) for playground chat + translation
- **Voice:** Sarvam AI text-to-speech
- **Email:** EmailJS

## Local development

Backend:
\`\`\`bash
cd backend
pip install -r requirements.txt
uvicorn server:app --reload --port 8000
\`\`\`

Frontend:
\`\`\`bash
cd frontend
yarn install
yarn start
\`\`\`

Both need their own `.env` — see `.env.example` in each folder.

## Deployment

- Frontend: Vercel
- Backend: Render
- Database: MongoDB Atlas
