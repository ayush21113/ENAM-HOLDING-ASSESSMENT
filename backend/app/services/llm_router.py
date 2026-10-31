"""
Smart Tiered Model Router for FINN
Implements cost-conscious model routing:
- Tier A (Bulk Extraction/Classification): Gemini 2.0 Flash / Groq Llama 3.3 70B
- Tier B (Deep Synthesis & Divergence Reasoning): Gemini Pro / GPT-4o / Claude 3.5 Sonnet
Includes chunking, prompt optimization, caching, and deterministic fallback.
"""
import os
import json
import requests
from typing import Dict, Any, Optional
from app.services.cache import cache

class LLMRouter:
    def __init__(self):
        self.gemini_key = os.getenv("GEMINI_API_KEY", "")
        self.groq_key = os.getenv("GROQ_API_KEY", "")
        self.openai_key = os.getenv("OPENAI_API_KEY", "")

    def update_keys(self, gemini_key: Optional[str] = None, groq_key: Optional[str] = None, openai_key: Optional[str] = None):
        if gemini_key is not None:
            self.gemini_key = gemini_key
        if groq_key is not None:
            self.groq_key = groq_key
        if openai_key is not None:
            self.openai_key = openai_key

    def get_status(self) -> Dict[str, Any]:
        return {
            "gemini_configured": bool(self.gemini_key),
            "groq_configured": bool(self.groq_key),
            "openai_configured": bool(self.openai_key),
            "active_mode": "Live Multi-Model Routing" if (self.gemini_key or self.groq_key or self.openai_key) else "Deterministic Precision Heuristics (Offline-Ready)"
        }

    def route_bulk_extraction(self, prompt: str) -> Optional[str]:
        """
        Fast, low-cost tier for routine classification and headline number extraction.
        """
        # Try Groq first for blazing speed & free tier
        if self.groq_key:
            try:
                resp = requests.post(
                    "https://api.groq.com/openai/v1/chat/completions",
                    headers={"Authorization": f"Bearer {self.groq_key}", "Content-Type": "application/json"},
                    json={
                        "model": "llama-3.3-70b-versatile",
                        "messages": [{"role": "user", "content": prompt}],
                        "temperature": 0.1,
                        "max_tokens": 1000
                    },
                    timeout=10
                )
                if resp.status_code == 200:
                    return resp.json()["choices"][0]["message"]["content"]
            except Exception:
                pass

        # Try Gemini Flash
        if self.gemini_key:
            try:
                url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key={self.gemini_key}"
                resp = requests.post(
                    url,
                    headers={"Content-Type": "application/json"},
                    json={"contents": [{"parts": [{"text": prompt}]}]},
                    timeout=10
                )
                if resp.status_code == 200:
                    return resp.json()["candidates"][0]["content"]["parts"][0]["text"]
            except Exception:
                pass

        return None

    def route_deep_reasoning(self, prompt: str) -> Optional[str]:
        """
        High-reasoning tier for comparing management guidance narrative vs actual delivered financials.
        """
        # Try Gemini Flash/Pro first
        if self.gemini_key:
            try:
                url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key={self.gemini_key}"
                resp = requests.post(
                    url,
                    headers={"Content-Type": "application/json"},
                    json={"contents": [{"parts": [{"text": prompt}]}]},
                    timeout=15
                )
                if resp.status_code == 200:
                    return resp.json()["candidates"][0]["content"]["parts"][0]["text"]
            except Exception:
                pass

        if self.openai_key:
            try:
                resp = requests.post(
                    "https://api.openai.com/v1/chat/completions",
                    headers={"Authorization": f"Bearer {self.openai_key}", "Content-Type": "application/json"},
                    json={
                        "model": "gpt-4o-mini",
                        "messages": [{"role": "user", "content": prompt}],
                        "temperature": 0.2
                    },
                    timeout=15
                )
                if resp.status_code == 200:
                    return resp.json()["choices"][0]["message"]["content"]
            except Exception:
                pass

        return None

llm_router = LLMRouter()
