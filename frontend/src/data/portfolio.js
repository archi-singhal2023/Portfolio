// Central portfolio data for Archi Singhal — edit here to update the site.

export const PROFILE = {
  name: "Archi Singhal",
  role: "AI/ML Engineer",
  location: "Raipur, India",
  email: "singhalarchi583@gmail.com",
  resumeUrl: "/Archi_Singhal_Resume.pdf",
  badge: "OPEN TO WORK",
  headlineName: "ARCHI",
  subtitle: "Aspiring AI/ML Engineer",
  valueProp:
    "Python-first AI/ML engineer specializing in Agentic AI & multi-agent systems — architecting autonomous LLM pipelines, production RAG platforms, and intelligent tooling that solves real-world problems.",
  heroTags: ["Python", "PyTorch", "TensorFlow", "AWS", "RAG", "GenAI/LLMs", "MLOps"],
  socials: [
    { label: "GitHub", handle: "archi-singhal2023", url: "https://github.com/archi-singhal2023", icon: "Github" },
    { label: "LinkedIn", handle: "archi-singhal", url: "https://www.linkedin.com/in/archi-singhal-803489253/", icon: "Linkedin" },
    { label: "Email", handle: "singhalarchi583@gmail.com", url: "mailto:singhalarchi583@gmail.com", icon: "Mail" },
  ],
};

export const MARQUEE_ITEMS = [
  "NLP", "RAG", "DEEP LEARNING", "MULTI-AGENT PIPELINES",
  "COMPUTER VISION", "LLMs", "PROMPT ENGINEERING", "MLOps",
];

export const SKILLS = [
  {
    title: "AI / ML",
    tag: "core",
    items: ["LLMs", "RAG", "Agentic AI", "Multi-Agent Systems", "Prompt Engineering", "NLP", "Deep Learning", "Computer Vision", "YOLOv8", "CNN"],
  },
  {
    title: "Frameworks & APIs",
    tag: "build",
    items: ["LangChain", "ChromaDB", "HuggingFace", "TensorFlow", "FastAPI", "Flask", "Groq API", "Tavily API"],
  },
  {
    title: "Cloud & DevOps",
    tag: "ship",
    items: ["AWS EC2", "AWS S3", "Docker", "GitHub Actions CI/CD", "Render"],
  },
  {
    title: "Languages",
    tag: "lang",
    items: ["Python", "SQL", "Core Java", "C"],
  },
  {
    title: "Tools",
    tag: "kit",
    items: ["Git", "VS Code", "Jupyter", "Google Colab", "Streamlit"],
  },
];

export const PROJECTS = [
  {
    index: "01",
    name: "Multi-Agent AI News Explainer",
    voiceSummary:
      "This is Archi's Multi-Agent AI News Explainer — a six-agent pipeline that autonomously discovers news, verifies sources, and writes balanced explainers. It's deployed live on Render with dynamic, runtime query planning to optimize API usage.",
    period: "Jul 2026 — Present",
    status: "LIVE",
    problem:
      "News is fragmented and biased. Objective: an autonomous system that discovers current events, verifies sources, and synthesizes balanced, multi-angle explainers — with full attribution.",
    architecture:
      "A 6-agent pipeline — Discovery, Triage, Researcher, Analyst, Editor, Classifier — with a Researcher that generates topic-specific search angles at runtime and a triage router that classifies stories by required depth to optimize API usage.",
    stack: ["Python", "Flask", "Groq API", "Tavily API", "Multi-Agent Orchestration", "Gunicorn", "Render"],
    metrics: [
      { value: "6", label: "Autonomous agents" },
      { value: "Live", label: "Self-refreshing prod" },
      { value: "Runtime", label: "Dynamic query planning" },
    ],
    links: { github: "https://github.com/archi-singhal2023", demo: "#", paper: null },
  },
  {
    index: "02",
    name: "RAG-Based Knowledge Management System",
    voiceSummary:
      "This is Archi's RAG Knowledge Management System — a production PDF question-answering app built with LangChain and ChromaDB, using MMR retrieval for source-backed answers. The research behind it was published in the IJACECT journal in 2026.",
    period: "Jan 2026 — Mar 2026",
    status: "PUBLISHED",
    problem:
      "Researchers drown in dense PDFs. Objective: a production RAG app that answers questions from document corpora with source-backed, low-redundancy responses.",
    architecture:
      "End-to-end PDF-to-Q&A pipeline using LangChain + ChromaDB for semantic retrieval, with MMR retrieval to cut redundant chunks and lift answer relevance across multi-document corpora. Deployed on HuggingFace Spaces with Docker + CI/CD and AWS S3 storage.",
    stack: ["Python", "LangChain", "ChromaDB", "FastAPI", "AWS EC2/S3", "Docker", "HuggingFace", "GitHub Actions"],
    metrics: [
      { value: "IJACECT", label: "Published 2026" },
      { value: "MMR", label: "Retrieval strategy" },
      { value: "CI/CD", label: "Automated deploys" },
    ],
    links: { github: "https://github.com/archi-singhal2023/RAG-Based-Knowledge", demo: "https://huggingface.co/spaces/Archi-01/Documind-space?logs=container", paper: "https://journals.mriindia.com/index.php/ijacect/article/view/2347" },
  },
  {
    index: "03",
    name: "AI Photo Booth",
    voiceSummary:
      "This is Archi's AI Photo Booth — a real-time computer vision app that snaps photos using blink and hand-gesture detection with MediaPipe, then builds a polaroid-style strip. It runs fully hands-free with a voice-guided countdown, no button clicks needed.",
    period: "2025",
    status: "CV",
    problem:
      "Photo booths need manual clicking, which breaks the moment. Objective: a hands-free, gesture-driven booth that captures candid shots automatically and packages them into a shareable polaroid strip.",
    architecture:
      "Real-time pipeline using MediaPipe Face Mesh for blink detection and MediaPipe Hands for finger gestures, orchestrated with OpenCV for the camera feed and a Tkinter UI. A blink triggers the shutter, a raised finger switches filters, and three captures are composited into a stylized polaroid strip with an audio countdown.",
    stack: ["Python", "OpenCV", "MediaPipe", "Face Mesh", "Computer Vision", "Tkinter"],
    metrics: [
      { value: "Hands-free", label: "Gesture capture" },
      { value: "Real-time", label: "Blink + finger detect" },
      { value: "Polaroid", label: "Auto strip output" },
    ],
    links: { github: "https://github.com/archi-singhal2023/AI-Photo-Booth", demo: null, paper: null },
  },
];

export const EXPERIENCE = [
  {
    role: "AI/ML Intern",
    company: "FTV Salon Academy",
    period: "Sep 2024 — Dec 2024",
    location: "Remote",
    points: [
      "Built and deployed a DialogFlow + FastAPI chatbot that automated customer interactions, cutting average response time by 50% in simulated production workflows.",
      "Developed a responsive business website (HTML, CSS, Bootstrap) to showcase the chatbot integration, improving usability and client presentation quality.",
    ],
    tags: ["DialogFlow", "FastAPI", "Chatbot", "Automation"],
  },
];

export const EDUCATION = {
  degree: "B.Tech — Artificial Intelligence & Machine Learning",
  school: "SSIPMT, Raipur",
  period: "Graduating June 2026",
};

export const PUBLICATION = {
  title: "DocuMind: RAG System for Research Paper Q&A",
  journal: "International Journal on Advanced Computer Engineering and Communication Technology",
  detail: "Vol 15, Issue 1, pp. 160–166 · 2026",
  authors: "Vyas, S., Singhal, A., Sharma, P., Chauhan, R.P.S., & Chandra, A.",
};

export const PLAYGROUND_SUGGESTIONS = [
  "What is the Multi-Agent News Explainer?",
  "Explain Archi's RAG system architecture.",
  "Why MMR retrieval over standard similarity?",
  "What's Archi's strongest skill area?",
];

// Avatar assistant config
export const LANGUAGES = [
  { key: "english", label: "English" },
  { key: "hindi", label: "हिंदी" },
  { key: "tamil", label: "தமிழ்" },
  { key: "telugu", label: "తెలుగు" },
  { key: "kannada", label: "ಕನ್ನಡ" },
  { key: "odia", label: "ଓଡ଼ିଆ" },
  { key: "bengali", label: "বাংলা" },
];

export const AVATAR_INTRO =
  "Welcome to the portfolio of Archi, an AI/ML Engineer. A creative mind with a strong teamwork spirit, Archi is looking for opportunities to apply her knowledge to solve real-world problems.";

