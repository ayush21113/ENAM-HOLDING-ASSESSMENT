"""
Configuration and Portfolio Universe for FINN (Financial Investment Agent)
"""
import os
from typing import List, Dict

PORTFOLIO_TICKERS: List[Dict[str, str]] = [
    {"symbol": "RELIANCE.NS", "name": "Reliance Industries", "sector": "Energy & Conglomerate", "cap": "Large"},
    {"symbol": "TCS.NS", "name": "Tata Consultancy Services", "sector": "Information Technology", "cap": "Large"},
    {"symbol": "HDFCBANK.NS", "name": "HDFC Bank", "sector": "Banking & Financials", "cap": "Large"},
    {"symbol": "TATAMOTORS.NS", "name": "Tata Motors", "sector": "Automotive", "cap": "Large"},
    {"symbol": "LT.NS", "name": "Larsen & Toubro", "sector": "Capital Goods & Infra", "cap": "Large"},
    {"symbol": "TRENT.NS", "name": "Trent Ltd", "sector": "Consumer & Retail", "cap": "Large"},
    {"symbol": "TITAN.NS", "name": "Titan Company", "sector": "Consumer & Retail", "cap": "Large"},
    {"symbol": "ZOMATO.NS", "name": "Zomato Ltd", "sector": "Internet & E-commerce", "cap": "Large"},
    {"symbol": "DIXON.NS", "name": "Dixon Technologies", "sector": "Electronics Manufacturing", "cap": "Mid"},
    {"symbol": "KAYNES.NS", "name": "Kaynes Technology", "sector": "Electronics & Defence", "cap": "Mid"},
    {"symbol": "HAL.NS", "name": "Hindustan Aeronautics", "sector": "Defence & Aerospace", "cap": "Large"},
    {"symbol": "CDSL.NS", "name": "Central Depository Services", "sector": "Financial Market Infra", "cap": "Mid"},
    {"symbol": "SUNPHARMA.NS", "name": "Sun Pharmaceutical", "sector": "Pharmaceuticals", "cap": "Large"},
    {"symbol": "DEEPAKNTR.NS", "name": "Deepak Nitrite", "sector": "Specialty Chemicals", "cap": "Mid"},
    {"symbol": "POLYCAB.NS", "name": "Polycab India", "sector": "Cables & Electricals", "cap": "Large"},
    {"symbol": "VBL.NS", "name": "Varun Beverages", "sector": "FMCG / Beverages", "cap": "Large"},
    {"symbol": "KPITTECH.NS", "name": "KPIT Technologies", "sector": "Automotive Tech & Software", "cap": "Mid"},
    {"symbol": "PERSISTENT.NS", "name": "Persistent Systems", "sector": "Information Technology", "cap": "Mid"},
]

DEFAULT_ALERT_THRESHOLDS = {
    "price_change_pct": 3.0,     # Alert on +/- 3% price move
    "volume_multiplier": 2.0,    # Alert when daily volume is > 2.0x 20-day average
    "material_categories": [
        "results",
        "M&A",
        "management_change",
        "credit_rating",
        "litigation",
        "fund_raise",
        "capex",
        "insider_trading"
    ]
}

CATEGORY_TIERS = {
    # Tier 1: Urgent / High Priority
    "results": 1,
    "M&A": 1,
    "management_change": 1,
    "litigation": 1,
    "credit_rating": 1,
    
    # Tier 2: Medium Priority / Watchlist
    "fund_raise": 2,
    "insider_trading": 2,
    "capex": 2,
    "dividend": 2,
    "bonus_split": 2,
    "earnings_call": 2,
    "pledging": 2,
    
    # Tier 3: Routine / Collapsible Paperwork
    "investor_meetings": 3,
    "press_release": 3,
    "postal_ballot": 3,
    "agm_egm": 3,
    "unclassified": 3,
}
