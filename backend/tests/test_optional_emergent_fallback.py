import asyncio
import importlib
import sys
from pathlib import Path


def test_server_imports_without_emergent_sdk(monkeypatch):
    monkeypatch.setenv("MONGO_URL", "mongodb://localhost:27017")
    monkeypatch.setenv("DB_NAME", "portfolio_test")
    monkeypatch.setenv("EMERGENT_LLM_KEY", "dummy")
    monkeypatch.setenv("EMERGENT_EMAIL_KEY", "dummy")
    monkeypatch.setenv("EMAIL_FROM_NAME", "Test")
    monkeypatch.setenv("OWNER_EMAIL", "owner@example.com")

    backend_dir = Path(__file__).resolve().parents[1]
    if str(backend_dir) not in sys.path:
        sys.path.insert(0, str(backend_dir))

    sys.modules.pop("server", None)
    server = importlib.import_module("server")

    chat = server.LlmChat(
        api_key="dummy",
        session_id="test-session",
        system_message="Keep it short.",
    )

    result = asyncio.run(chat.send_message(server.UserMessage(text="Hello")))
    assert "unavailable" in result.lower()


def test_email_config_reports_missing_credentials(monkeypatch):
    monkeypatch.setenv("MONGO_URL", "mongodb://localhost:27017")
    monkeypatch.setenv("DB_NAME", "portfolio_test")
    monkeypatch.setenv("EMERGENT_LLM_KEY", "dummy")
    monkeypatch.delenv("EMERGENT_EMAIL_KEY", raising=False)
    monkeypatch.delenv("OWNER_EMAIL", raising=False)

    backend_dir = Path(__file__).resolve().parents[1]
    if str(backend_dir) not in sys.path:
        sys.path.insert(0, str(backend_dir))

    sys.modules.pop("server", None)
    server = importlib.import_module("server")

    assert not server.is_email_configured()


def test_email_config_allows_smtp_without_emergent_key(monkeypatch):
    monkeypatch.setenv("MONGO_URL", "mongodb://localhost:27017")
    monkeypatch.setenv("DB_NAME", "portfolio_test")
    monkeypatch.setenv("EMERGENT_LLM_KEY", "dummy")
    monkeypatch.delenv("EMERGENT_EMAIL_KEY", raising=False)
    monkeypatch.setenv("OWNER_EMAIL", "owner@example.com")
    monkeypatch.setenv("SMTP_HOST", "smtp.example.com")
    monkeypatch.setenv("SMTP_PORT", "587")
    monkeypatch.setenv("SMTP_USER", "user@example.com")
    monkeypatch.setenv("SMTP_PASSWORD", "secret")

    backend_dir = Path(__file__).resolve().parents[1]
    if str(backend_dir) not in sys.path:
        sys.path.insert(0, str(backend_dir))

    sys.modules.pop("server", None)
    server = importlib.import_module("server")

    assert server.is_email_configured()
