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

from emergentintegrations.llm.chat import LlmChat, UserMessage, TextDelta, StreamDone

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Integration keys
EMERGENT_LLM_KEY = os.environ['EMERGENT_LLM_KEY']
EMAIL_BASE_URL = "https://integrations.emergentagent.com"
EMAIL_KEY = os.environ['EMERGENT_EMAIL_KEY']
EMAIL_FROM_NAME = os.environ['EMAIL_FROM_NAME']
OWNER_EMAIL = os.environ['OWNER_EMAIL']

app = FastAPI()
api_router = APIRouter(prefix="/api")

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

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
    """Streaming AI playground powered by Claude Sonnet via Emergent LLM key."""
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

    chat = LlmChat(
        api_key=EMERGENT_LLM_KEY,
        session_id=req.session_id,
        system_message=PORTFOLIO_CONTEXT,
    ).with_model("anthropic", "claude-sonnet-4-6")

    async def event_generator():
        full = ""
        try:
            async for event in chat.stream_message(UserMessage(text=req.message)):
                if isinstance(event, TextDelta):
                    full += event.content
                    yield f"data: {json.dumps({'delta': event.content})}\n\n"
                elif isinstance(event, StreamDone):
                    break
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
    """Save contact submission to DB and email the owner via Emergent Resend."""
    doc = {
        "id": str(uuid.uuid4()),
        "name": req.name,
        "email": req.email,
        "message": req.message,
        "timestamp": datetime.now(timezone.utc).isoformat(),
    }
    await db.contact_messages.insert_one(doc)

    html_content = f"""
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#050505;padding:32px;font-family:Arial,sans-serif;">
      <tr><td>
        <table width="600" cellpadding="0" cellspacing="0" align="center" style="background:#0f0f10;border:1px solid #1f1f1f;border-radius:12px;overflow:hidden;">
          <tr><td style="background:#00FF94;padding:20px 28px;">
            <span style="color:#000;font-size:18px;font-weight:bold;letter-spacing:1px;">NEW PORTFOLIO MESSAGE</span>
          </td></tr>
          <tr><td style="padding:28px;color:#e5e5e5;">
            <p style="margin:0 0 8px;color:#00FF94;font-size:12px;letter-spacing:2px;text-transform:uppercase;">From</p>
            <p style="margin:0 0 20px;font-size:16px;color:#fff;">{req.name} &lt;{req.email}&gt;</p>
            <p style="margin:0 0 8px;color:#00FF94;font-size:12px;letter-spacing:2px;text-transform:uppercase;">Message</p>
            <p style="margin:0;font-size:15px;line-height:1.6;color:#cfcfcf;white-space:pre-wrap;">{req.message}</p>
          </td></tr>
          <tr><td style="padding:16px 28px;border-top:1px solid #1f1f1f;color:#666;font-size:12px;">
            Sent from your portfolio contact form
          </td></tr>
        </table>
      </td></tr>
    </table>
    """

    payload = {
        "to": [OWNER_EMAIL],
        "subject": f"Portfolio contact from {req.name}",
        "html": html_content,
        "from_name": EMAIL_FROM_NAME,
        "contact_email": req.email,
    }

    try:
        async with httpx.AsyncClient(timeout=30) as http_client:
            resp = await http_client.post(
                f"{EMAIL_BASE_URL}/api/v1/email/send",
                headers={"X-Email-Key": EMAIL_KEY},
                json=payload,
            )
        resp.raise_for_status()
    except Exception as e:
        logger.error(f"Contact email send failed: {e}")
        # Message is saved even if email fails; surface a soft error
        raise HTTPException(status_code=502, detail="Message saved but email delivery failed")

    return {"status": "success", "message": "Thanks! Your message has been sent."}


@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheck):
    doc = input.model_dump()
    doc['timestamp'] = doc['timestamp'].isoformat()
    await db.status_checks.insert_one(doc)
    return input


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
