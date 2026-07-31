"""Portfolio backend tests including new /api/tts endpoint (Sarvam + Claude translation)."""
import os
import json
import time
import pytest
import requests

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL", "https://aiml-labs.preview.emergentagent.com").rstrip("/")
API = f"{BASE_URL}/api"


@pytest.fixture(scope="module")
def s():
    return requests.Session()


# ---------------- Regression ----------------
def test_root(s):
    r = s.get(f"{API}/")
    assert r.status_code == 200
    assert r.json().get("message") == "Archi Singhal Portfolio API"


def test_contact_valid(s):
    r = s.post(f"{API}/contact", json={
        "name": "TEST_Tester",
        "email": "test+regression@example.com",
        "message": "Automated regression test",
    })
    assert r.status_code == 200
    assert r.json().get("status") == "success"


def test_playground_streams(s):
    with s.post(f"{API}/playground/chat",
                json={"session_id": "test-regression", "message": "In one sentence, who is Archi?"},
                stream=True, timeout=60) as r:
        assert r.status_code == 200
        got_delta = False
        got_done = False
        for raw in r.iter_lines():
            if not raw:
                continue
            line = raw.decode()
            if line.startswith("data: "):
                obj = json.loads(line[6:])
                if "delta" in obj:
                    got_delta = True
                if obj.get("done"):
                    got_done = True
                    break
        assert got_delta and got_done


# ---------------- TTS ----------------
def test_tts_english(s):
    r = s.post(f"{API}/tts", json={
        "text": "Good afternoon! Welcome to the portfolio of Archi.",
        "language": "english",
    }, timeout=90)
    assert r.status_code == 200, r.text
    data = r.json()
    assert data["mime_type"] == "audio/wav"
    assert isinstance(data.get("audio_base64"), str)
    assert len(data["audio_base64"]) > 1000
    assert data.get("spoken_text")


def test_tts_hindi_translated(s):
    r = s.post(f"{API}/tts", json={
        "text": "Welcome to the portfolio of Archi. She builds agentic AI systems.",
        "language": "hindi",
    }, timeout=120)
    assert r.status_code == 200, r.text
    data = r.json()
    assert len(data["audio_base64"]) > 1000
    # Devanagari script check
    spoken = data["spoken_text"]
    assert any("\u0900" <= ch <= "\u097F" for ch in spoken), f"Not Devanagari: {spoken}"


def test_tts_tamil(s):
    r = s.post(f"{API}/tts", json={"text": "Welcome to Archi's portfolio.", "language": "tamil"}, timeout=120)
    assert r.status_code == 200, r.text
    assert len(r.json()["audio_base64"]) > 1000


def test_tts_hinglish(s):
    r = s.post(f"{API}/tts", json={"text": "Welcome to Archi's portfolio.", "language": "hinglish"}, timeout=120)
    assert r.status_code == 200, r.text
    assert len(r.json()["audio_base64"]) > 1000


def test_tts_cache(s):
    payload = {"text": "Cached hello from Archi's portfolio test.", "language": "english"}
    r1 = s.post(f"{API}/tts", json=payload, timeout=90)
    assert r1.status_code == 200
    t0 = time.time()
    r2 = s.post(f"{API}/tts", json=payload, timeout=90)
    dt = time.time() - t0
    assert r2.status_code == 200
    assert r1.json()["audio_base64"] == r2.json()["audio_base64"]
    # second should be fast (cache hit)
    assert dt < 5, f"Cache slow: {dt}s"


def test_tts_empty_text_422(s):
    r = s.post(f"{API}/tts", json={"text": "", "language": "english"})
    assert r.status_code == 422
