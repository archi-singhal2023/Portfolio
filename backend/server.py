from fastapi import FastAPI, APIRouter, HTTPException
from fastapi.responses import StreamingResponse
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import json
import logging
import httpx
from pathlib import Path
from pydantic import BaseModel, Field, EmailStr
from typing import List, Optional
import uuid
from datetime import datetime, timezone
from groq import AsyncGroq

GROQ_API_KEY = os.getenv("GROQ_API_KEY", "")
groq_client = AsyncGroq(api_key=GROQ_API_KEY)

logger = logging.getLogger(__name__)

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.getenv("MONGO_URL", "mongodb://localhost:27017")
client = AsyncIOMotorClient(mongo_url)
db = client[os.getenv("DB_NAME", "portfolio")]

app = FastAPI()
api_router = APIRouter(prefix="/api")

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)

# ---------------- System prompt for the AI Playground ----------------
PORTFOLIO_CONTEXT = """You are ARIA — Archi Singhal's AI assistant embedded in her portfolio website.
You answer visitors' questions about Archi in a crisp, confident, engineering-focused tone. Keep answers concise (2-5 sentences unless asked for detail).

ABOUT ARCHI SINGHAL:
- B.Tech in Artificial Intelligence & Machine Learning, SSIPMT Raipur (graduating June 2026).
- Specialist in Generative AI, Agentic AI & Multi-Agent Systems, RAG, NLP, Deep Learning, and Computer Vision.
- Email: singhalarchi583@gmail.com | GitHub: github.com/archi-singhal2023 | LinkedIn: linkedin.com/in/archi-singhal-803489253

SKILLS:
- AI/ML: LLMs, RAG, Agentic AI, Multi-Agent Systems, Prompt Engineering, NLP, Deep Learning, Computer Vision, YOLOv8, CNN
- Frameworks & APIs: LangChain, ChromaDB, HuggingFace, TensorFlow, FastAPI, Flask, Groq API, Tavily API
- Cloud & DevOps: AWS (EC2, S3), Docker, GitHub Actions CI/CD, Render
- Languages: Python, SQL, Core Java, C
- Tools: Git, VS Code, Jupyter, Google Colab, Streamlit

PROJECTS:
1. Multi-Agent AI News Explainer (Jul 2026 - Present): Architected a 6-agent pipeline (Discovery, Triage, Researcher, Analyst, Editor, Classifier) that autonomously discovers news, verifies sources, and synthesizes multi-angle explainers with source attribution. Dynamic runtime query planning + triage routing to optimize API usage. Deployed live on Render with a Flask REST API. Stack: Python, Flask, Groq API, Tavily API, Multi-Agent Orchestration, Gunicorn.
2. RAG-Based Knowledge Management System (Jan-Mar 2026): Production RAG app on HuggingFace Spaces with Docker + CI/CD via GitHub Actions; AWS S3 document storage. End-to-end PDF-to-Q&A using LangChain + ChromaDB with MMR retrieval for source-backed answers. Research published in IJACECT 2026 ("DocuMind: RAG System for Research Paper Q&A"). Stack: Python, LangChain, ChromaDB, FastAPI, AWS EC2/S3, Docker, HuggingFace.

EXPERIENCE:
- AI/ML Intern, FTV Salon Academy (Sep-Dec 2024, Remote): Built & deployed a DialogFlow + FastAPI chatbot that automated customer interactions, cutting average response time by 50% in simulated production workflows. Built a responsive business website (HTML/CSS/Bootstrap).

PUBLICATION: "DocuMind: RAG System for Research Paper Q&A", IJACECT, Vol 15, Issue 1, pp. 160-166, 2026.

RULES: Only discuss Archi's professional background, skills, and projects. If asked something unrelated, politely redirect to Archi's work. Never invent facts not listed here. You may reason about her tech choices."""


# ---------------- Models ----------------
class ChatRequest(BaseModel):
    session_id: str
    message: str


class ContactRequest(BaseModel):
    name: str
    email: EmailStr
    message: str


class StatusCheck(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


# ---------------- Routes ----------------
@api_router.get("/")
async def root():
    return {"message": "Archi Singhal Portfolio API"}


@api_router.post("/playground/chat")
async def playground_chat(req: ChatRequest):
    """Streaming AI playground powered by Groq (Llama 3.3)."""
    if not req.message.strip():
        raise HTTPException(status_code=400, detail="Message cannot be empty")

    # Persist the user message
    await db.chat_messages.insert_one({
        "id": str(uuid.uuid4()),
        "session_id": req.session_id,
        "role": "user",
        "content": req.message,
        "timestamp": datetime.now(timezone.utc).isoformat(),
    })

    async def event_generator():
        full = ""
        if not GROQ_API_KEY:
            logger.warning("Playground chat skipped: GROQ_API_KEY not set")
            yield f"data: {json.dumps({'error': 'AI playground is not configured'})}\n\n"
            yield f"data: {json.dumps({'done': True})}\n\n"
            return
        try:
            stream = await groq_client.chat.completions.create(
                model="llama-3.3-70b-versatile",
                max_tokens=1024,
                messages=[
                    {"role": "system", "content": PORTFOLIO_CONTEXT},
                    {"role": "user", "content": req.message},
                ],
                stream=True,
            )
            async for chunk in stream:
                delta = chunk.choices[0].delta.content
                if delta:
                    full += delta
                    yield f"data: {json.dumps({'delta': delta})}\n\n"
        except Exception as e:
            logger.error(f"Playground stream error: {e}")
            yield f"data: {json.dumps({'error': 'AI stream failed'})}\n\n"
        finally:
            if full:
                await db.chat_messages.insert_one({
                    "id": str(uuid.uuid4()),
                    "session_id": req.session_id,
                    "role": "assistant",
                    "content": full,
                    "timestamp": datetime.now(timezone.utc).isoformat(),
                })
            yield f"data: {json.dumps({'done': True})}\n\n"

    return StreamingResponse(
        event_generator(),
        media_type="text/event-stream",
        headers={"Cache-Control": "no-cache", "X-Accel-Buffering": "no"},
    )


@api_router.post("/contact")
async def contact(req: ContactRequest):
    """Save contact submission to DB. Email delivery is handled client-side via EmailJS."""
    doc = {
        "id": str(uuid.uuid4()),
        "name": req.name,
        "email": req.email,
        "message": req.message,
        "timestamp": datetime.now(timezone.utc).isoformat(),
    }
    await db.contact_messages.insert_one(doc)

    return {
        "status": "success",
        "message": "Thanks! Your message has been received.",
    }


@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheck):
    doc = input.model_dump()
    doc['timestamp'] = doc['timestamp'].isoformat()
    await db.status_checks.insert_one(doc)
    return input


SARVAM_API_KEY = os.environ.get('SARVAM_API_KEY')
SARVAM_TTS_URL = "https://api.sarvam.ai/text-to-speech"
SARVAM_SPEAKER = "priya"

# language key -> (sarvam target_language_code, human name for translation, translate?)
LANGUAGE_MAP = {
    "english": ("en-IN", "English", False),
    "hindi": ("hi-IN", "Hindi (Devanagari script)", True),
    "tamil": ("ta-IN", "Tamil", True),
    "telugu": ("te-IN", "Telugu", True),
    "kannada": ("kn-IN", "Kannada", True),
    "odia": ("od-IN", "Odia", True),
    "bengali": ("bn-IN", "Bengali", True),
    "hinglish": ("en-IN", "Hinglish (romanized Hindi mixed with English, written in Latin script)", True),
}

async def translate_text(text: str, language_name: str) -> str:
    if not GROQ_API_KEY:
        logger.warning("Translation skipped: GROQ_API_KEY not set")
        return text
    try:
        resp = await groq_client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            max_tokens=1024,
            messages=[
                {
                    "role": "system",
                    "content": (
                        "You are a professional translator. Translate the user's text into "
                        f"{language_name}. Output ONLY the translation, no quotes, no notes, "
                        "no transliteration in brackets. Keep proper nouns like 'Archi', "
                        "'AI/ML', 'RAG', 'Python' as-is."
                    ),
                },
                {"role": "user", "content": text},
            ],
        )
        return resp.choices[0].message.content.strip()
    except Exception as e:
        logger.error(f"Translation failed: {e}")
        return text


class TTSRequest(BaseModel):
    text: str = Field(min_length=1, max_length=1500)
    language: str = "english"


@api_router.post("/tts")
async def text_to_speech(req: TTSRequest):
    if not SARVAM_API_KEY:
        raise HTTPException(status_code=503, detail="Voice not configured")

    lang_key = req.language.lower()
    target_code, lang_name, needs_translation = LANGUAGE_MAP.get(
        lang_key, LANGUAGE_MAP["english"]
    )

    # cache by (source text + language) to avoid re-translating / re-synthesizing
    cache_key = f"{lang_key}:{req.text}"
    cached = await db.tts_cache.find_one({"key": cache_key}, {"_id": 0})
    if cached:
        return {"audio_base64": cached["audio"], "mime_type": "audio/wav", "spoken_text": cached["spoken_text"]}

    spoken_text = req.text
    if needs_translation:
        spoken_text = await translate_text(req.text, lang_name)

    payload = {
        "text": spoken_text[:1500],
        "target_language_code": target_code,
        "model": "bulbul:v3",
        "speaker": SARVAM_SPEAKER,
        "pace": 1.0,
        "temperature": 0.6,
        "speech_sample_rate": "24000",
        "output_audio_codec": "wav",
    }

    try:
        async with httpx.AsyncClient(timeout=60) as http_client:
            resp = await http_client.post(
                SARVAM_TTS_URL,
                headers={"api-subscription-key": SARVAM_API_KEY, "Content-Type": "application/json"},
                json=payload,
            )
        resp.raise_for_status()
        data = resp.json()
        audio_b64 = data["audios"][0]
    except httpx.HTTPStatusError as e:
        logger.error(f"Sarvam TTS failed: {e.response.status_code} {e.response.text}")
        raise HTTPException(status_code=502, detail="Voice synthesis failed")
    except Exception as e:
        logger.error(f"Sarvam TTS error: {e}")
        raise HTTPException(status_code=500, detail="Voice synthesis error")

    await db.tts_cache.insert_one({"key": cache_key, "audio": audio_b64, "spoken_text": spoken_text})
    return {"audio_base64": audio_b64, "mime_type": "audio/wav", "spoken_text": spoken_text}


app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()