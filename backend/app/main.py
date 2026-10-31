"""
FINN Backend API - FastAPI Entrypoint
"""
from fastapi import FastAPI, Query, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
import os
from typing import Optional, List, Dict, Any
from app.config import PORTFOLIO_TICKERS, DEFAULT_ALERT_THRESHOLDS, CATEGORY_TIERS
from app.models import (
    StockEOD, Announcement, TriggeredAlert, 
    ResearchPullResponse, SettingsUpdate
)
from app.services.market_data import fetch_portfolio_market_data, fetch_single_ticker_eod
from app.services.announcements import get_announcements_digest, classify_announcement_text
from app.services.primary_research import fetch_primary_research_for_ticker
from app.services.llm_router import llm_router
from pydantic import BaseModel

app = FastAPI(
    title="FINN: Financial Investment Agent API",
    description="Proactive Push & Deep Pull Fundamental Research Engine for Public Market Investors",
    version="1.0.0"
)

# Enable CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory settings state
runtime_settings = {
    "price_threshold_pct": DEFAULT_ALERT_THRESHOLDS["price_change_pct"],
    "volume_multiplier": DEFAULT_ALERT_THRESHOLDS["volume_multiplier"]
}

class ClassifyRequest(BaseModel):
    title: str
    content: str

@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "agent": "FINN Financial Investment Agent",
        "version": "1.0.0",
        "llm_status": llm_router.get_status()
    }

@app.get("/api/portfolio")
def get_portfolio() -> Dict[str, Any]:
    """
    Returns the EOD market overview, prices, volume multiples, and alert triggers across portfolio.
    """
    stocks, alerts = fetch_portfolio_market_data(
        price_thresh=runtime_settings["price_threshold_pct"],
        vol_thresh=runtime_settings["volume_multiplier"]
    )
    return {
        "count": len(stocks),
        "stocks": stocks,
        "active_alerts_count": len(alerts)
    }

@app.get("/api/feed")
def get_feed(
    window_hours: int = Query(24, description="Digest window in hours (e.g. 24, 72, 168)"),
    ticker: Optional[str] = Query(None, description="Optional ticker symbol filter"),
    category: Optional[str] = Query("all", description="Category filter from 17 categories"),
    hide_routine: bool = Query(False, description="Collapse routine paperwork (Tier 3)")
) -> Dict[str, Any]:
    """
    Windowed corporate announcement digest sorted by priority (Tier 1 first).
    """
    announcements = get_announcements_digest(
        window_hours=window_hours,
        ticker_filter=ticker,
        category_filter=category,
        hide_routine=hide_routine
    )
    return {
        "window_hours": window_hours,
        "count": len(announcements),
        "announcements": announcements,
        "categories_breakdown": {cat: len([a for a in announcements if a.category == cat]) for cat in CATEGORY_TIERS.keys()}
    }

@app.get("/api/alerts")
def get_alerts() -> Dict[str, Any]:
    """
    Returns all active triggered alerts across portfolio (volume spikes, price breakouts, material filings).
    """
    _, market_alerts = fetch_portfolio_market_data(
        price_thresh=runtime_settings["price_threshold_pct"],
        vol_thresh=runtime_settings["volume_multiplier"]
    )
    
    # Also fetch recent Tier 1 material announcements
    recent_filings = get_announcements_digest(window_hours=48)
    filing_alerts = []
    for f in recent_filings:
        if f.tier == 1:
            filing_alerts.append(TriggeredAlert(
                id=f"alert-filing-{f.id}",
                symbol=f.symbol,
                company_name=f.company_name,
                alert_type="MATERIAL_ANNOUNCEMENT",
                title=f"Material Filing: {f.category.upper()}",
                description=f"{f.title} ({f.summary})",
                severity="critical" if f.category in ["results", "management_change", "M&A"] else "warning",
                timestamp=f.timestamp
            ))
            
    combined = market_alerts + filing_alerts
    return {
        "count": len(combined),
        "alerts": combined
    }

@app.get("/api/research/{symbol}")
def get_research_pull(symbol: str) -> ResearchPullResponse:
    """
    Pull mode: Deep on-demand fundamental analysis strictly grounded in primary sources (ARs + concalls).
    Generalizes to ANY valid NSE/BSE ticker.
    """
    try:
        data = fetch_primary_research_for_ticker(symbol)
        return data
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch primary research: {str(e)}")

@app.get("/api/settings")
def get_settings():
    return {
        "thresholds": runtime_settings,
        "llm_router": llm_router.get_status()
    }

@app.post("/api/settings")
def update_settings(payload: SettingsUpdate):
    runtime_settings["price_threshold_pct"] = payload.price_threshold_pct
    runtime_settings["volume_multiplier"] = payload.volume_multiplier
    llm_router.update_keys(
        gemini_key=payload.gemini_api_key,
        groq_key=payload.groq_api_key,
        openai_key=payload.openai_api_key
    )
    return {
        "status": "updated",
        "thresholds": runtime_settings,
        "llm_router": llm_router.get_status()
    }

@app.post("/api/classify")
def classify_announcement(req: ClassifyRequest):
    """
    Live classification endpoint for any arbitrary corporate announcement text.
    """
    cat = classify_announcement_text(req.title, req.content)
    tier = CATEGORY_TIERS.get(cat, 3)
    return {
        "category": cat,
        "tier": tier,
        "is_material": tier == 1
    }

# Mount frontend build if available
frontend_dist = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "frontend", "dist"))
if os.path.exists(frontend_dist):
    app.mount("/assets", StaticFiles(directory=os.path.join(frontend_dist, "assets")), name="assets")

    @app.get("/{full_path:path}")
    def serve_frontend(full_path: str):
        file_path = os.path.join(frontend_dist, full_path)
        if os.path.exists(file_path) and os.path.isfile(file_path):
            return FileResponse(file_path)
        return FileResponse(os.path.join(frontend_dist, "index.html"))
