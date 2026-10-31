"""
Corporate Announcements Service for FINN
Categorization (17 categories), Priority Tiering (1=Critical, 2=Medium, 3=Routine),
Windowed Digest, and Deep Enrichment (Quarterly Results & Management Transitions).
"""
from typing import List, Dict, Optional, Any
from app.config import CATEGORY_TIERS, PORTFOLIO_TICKERS
from app.models import Announcement, EnrichedQuarterlyResult, EnrichedManagementChange
from datetime import datetime, timedelta
import random

# Realistically simulated seed announcements representing current Indian market filings
SEED_ANNOUNCEMENTS: List[Dict[str, Any]] = [
    {
        "id": "ann-trent-q2",
        "symbol": "TRENT.NS",
        "company_name": "Trent Ltd",
        "category": "results",
        "title": "Financial Results for the Quarter and Half Year ended September 30, 2026",
        "summary": "Standalone and Consolidated Q2 FY27 unaudited financial results approved by the Board.",
        "hours_ago": 3,
        "is_material": True,
        "filing_url": "https://www.bseindia.com/xml-data/corpfiling/AttachLive/trent_q2_results.pdf",
        "tags": ["Earnings", "Zudio Expansion", "High Margin"],
        "result_data": {
            "quarter": "Q2 FY27",
            "revenue_cr": 4156.8,
            "revenue_qoq_pct": 8.4,
            "revenue_yoy_pct": 39.2,
            "ebitda_cr": 642.5,
            "ebitda_qoq_pct": 11.2,
            "ebitda_yoy_pct": 48.6,
            "ebitda_margin_pct": 15.45,
            "pbt_cr": 485.2,
            "pbt_qoq_pct": 12.8,
            "pbt_yoy_pct": 53.1,
            "pat_cr": 361.4,
            "pat_qoq_pct": 13.5,
            "pat_yoy_pct": 54.8,
            "margin_commentary": "EBITDA margin expanded 98 bps YoY driven by strong gross margins in Zudio and scale operating leverage across Star Bazaar."
        }
    },
    {
        "id": "ann-tatamotors-mgmt",
        "symbol": "TATAMOTORS.NS",
        "company_name": "Tata Motors",
        "category": "management_change",
        "title": "Appointment of Chief Operating Officer for Electric Mobility Business",
        "summary": "Board approves appointment of Dr. Vikram Sengupta as COO of Passenger Electric Vehicles.",
        "hours_ago": 6,
        "is_material": True,
        "filing_url": "https://www.bseindia.com/xml-data/corpfiling/AttachLive/tatamotors_mgmt.pdf",
        "tags": ["C-Suite", "EV Strategy", "Leadership"],
        "mgmt_data": {
            "action": "Appointed Chief Operating Officer (EV Division)",
            "person_name": "Dr. Vikram Sengupta",
            "new_role": "Chief Operating Officer - Electric Mobility",
            "former_role": "Senior VP of Powertrain Engineering",
            "prior_company": "Tesla Europe & Polestar",
            "career_background": "22+ years in automotive electrification. Led platform architecture for Polestar 3/4. PhD in Power Electronics from RWTH Aachen.",
            "pedigree_highlights": [
                "Former Global Powertrain Lead at Polestar (Gothenburg)",
                "8 patents in solid-state battery thermal management",
                "Alumnus: IIT Kharagpur (B.Tech) & RWTH Aachen (Doctorate)"
            ]
        }
    },
    {
        "id": "ann-dixon-capex",
        "symbol": "DIXON.NS",
        "company_name": "Dixon Technologies",
        "category": "capex",
        "title": "Inauguration of New Display Module and Precision Component Facility at Noida",
        "summary": "Phase-2 display module line commercialized with ₹320 Cr outlay under IT Hardware PLI 2.0.",
        "hours_ago": 9,
        "is_material": True,
        "filing_url": "https://www.bseindia.com/xml-data/corpfiling/AttachLive/dixon_facility.pdf",
        "tags": ["Capex", "PLI Scheme", "Component Localization"]
    },
    {
        "id": "ann-zomato-ma",
        "symbol": "ZOMATO.NS",
        "company_name": "Zomato Ltd",
        "category": "M&A",
        "title": "Execution of Share Purchase Agreement for acquisition of Orbit Logistics Network",
        "summary": "Acquisition of 100% equity stake in cold-chain logistics platform for ₹410 Cr all-cash transaction to bolster Blinkit dark-store fresh replenishment.",
        "hours_ago": 14,
        "is_material": True,
        "filing_url": "https://www.bseindia.com/xml-data/corpfiling/AttachLive/zomato_spa.pdf",
        "tags": ["M&A", "Quick Commerce", "Blinkit Synergy"]
    },
    {
        "id": "ann-cdsl-credit",
        "symbol": "CDSL.NS",
        "company_name": "Central Depository Services",
        "category": "credit_rating",
        "title": "CRISIL Reaffirms Long Term Rating at CRISIL AAA / Stable",
        "summary": "CRISIL Ratings has reaffirmed rating on debt instruments at AAA/Stable reflecting strong monopoly market position and zero debt profile.",
        "hours_ago": 18,
        "is_material": True,
        "filing_url": "https://www.bseindia.com/xml-data/corpfiling/AttachLive/cdsl_crisil.pdf",
        "tags": ["Credit Rating", "AAA", "Zero Debt"]
    },
    {
        "id": "ann-hdfc-insider",
        "symbol": "HDFCBANK.NS",
        "company_name": "HDFC Bank",
        "category": "insider_trading",
        "title": "Disclosures under Reg 7(2) read with Reg 6(2) of SEBI PIT Regulations",
        "summary": "Market purchase of 25,000 equity shares by Group Head of Commercial Banking from open market.",
        "hours_ago": 21,
        "is_material": False,
        "filing_url": "https://www.bseindia.com/xml-data/corpfiling/AttachLive/hdfc_pit.pdf",
        "tags": ["Insider Buying", "Senior Leadership"]
    },
    {
        "id": "ann-sunpharma-litigation",
        "symbol": "SUNPHARMA.NS",
        "company_name": "Sun Pharmaceutical",
        "category": "litigation",
        "title": "Update on Patent Litigation with US Department of Justice / Generic Competitor",
        "summary": "Favorable district court ruling upholding patent validity for specialty ophthalmology franchise.",
        "hours_ago": 26,
        "is_material": True,
        "filing_url": "https://www.bseindia.com/xml-data/corpfiling/AttachLive/sunpharma_court.pdf",
        "tags": ["Litigation", "US FDA", "Patent Won"]
    },
    {
        "id": "ann-tcs-esop",
        "symbol": "TCS.NS",
        "company_name": "Tata Consultancy Services",
        "category": "unclassified",
        "title": "Allotment of 18,450 Equity Shares under Employee Stock Option Scheme",
        "summary": "Routine share allotment to eligible employees pursuant to exercise of ESOP options.",
        "hours_ago": 4,
        "is_material": False,
        "filing_url": "https://www.bseindia.com/xml-data/corpfiling/AttachLive/tcs_esop.pdf",
        "tags": ["ESOP", "Compliance", "Routine"]
    },
    {
        "id": "ann-reliance-agm",
        "symbol": "RELIANCE.NS",
        "company_name": "Reliance Industries",
        "category": "agm_egm",
        "title": "Notice of Post-AGM Scrutinizer Report on Remote E-Voting",
        "summary": "Report of Scrutinizer detailing voting results on routine ordinary resolutions passed at 47th AGM.",
        "hours_ago": 12,
        "is_material": False,
        "filing_url": "https://www.bseindia.com/xml-data/corpfiling/AttachLive/reliance_scrutinizer.pdf",
        "tags": ["AGM", "Voting Results", "Routine"]
    },
    {
        "id": "ann-lt-order",
        "symbol": "LT.NS",
        "company_name": "Larsen & Toubro",
        "category": "press_release",
        "title": "L&T Construction Secures Mega Order (₹5,000 to ₹7,000 Cr) for Power Transmission in Middle East",
        "summary": "Hydrocarbon and power transmission business bags 380kV substation expansion package in Saudi Arabia.",
        "hours_ago": 30,
        "is_material": True,
        "filing_url": "https://www.bseindia.com/xml-data/corpfiling/AttachLive/lt_order.pdf",
        "tags": ["Order Win", "Middle East", "Transmission"]
    },
    {
        "id": "ann-titan-dividend",
        "symbol": "TITAN.NS",
        "company_name": "Titan Company",
        "category": "dividend",
        "title": "Intimation of Record Date for Interim Dividend of ₹11 per share",
        "summary": "Board fixes November 14 as record date for payment of interim dividend for FY27.",
        "hours_ago": 34,
        "is_material": False,
        "filing_url": "https://www.bseindia.com/xml-data/corpfiling/AttachLive/titan_div.pdf",
        "tags": ["Dividend", "Cash Flow"]
    },
    {
        "id": "ann-hal-postal",
        "symbol": "HAL.NS",
        "company_name": "Hindustan Aeronautics",
        "category": "postal_ballot",
        "title": "Postal Ballot Notice for alteration of Articles of Association",
        "summary": "Shareholder approval sought via postal ballot for administrative amendments to MoA & AoA.",
        "hours_ago": 8,
        "is_material": False,
        "filing_url": "https://www.bseindia.com/xml-data/corpfiling/AttachLive/hal_pb.pdf",
        "tags": ["Postal Ballot", "Statutory"]
    }
]

def classify_announcement_text(title: str, text: str) -> str:
    """
    Classifies raw announcement text into one of the 17 specified categories.
    Deterministic heuristic engine with regex pattern matching.
    """
    comb = f"{title} {text}".lower()

    if any(k in comb for k in ["financial result", "quarterly result", "unaudited financial", "audited result", "q1", "q2", "q3", "q4"]):
        return "results"
    if any(k in comb for k in ["acquisition", "merger", "demerger", "joint venture", "amalgamation", "stake sale"]):
        return "M&A"
    if any(k in comb for k in ["resignation", "appointment", "appointed", "resigned", "cfo", "ceo", "managing director", "director retired"]):
        return "management_change"
    if any(k in comb for k in ["qip", "rights issue", "preferential allotment", "commercial paper", "fund raise", "raising fund"]):
        return "fund_raise"
    if any(k in comb for k in ["lawsuit", "court", "high court", "arbitration", "penalty", "sebi order", "litigation"]):
        return "litigation"
    if any(k in comb for k in ["credit rating", "crisil", "icra", "care rating", "reaffirmed"]):
        return "credit_rating"
    if any(k in comb for k in ["insider trading", "pit regulation", "reg 7(2)", "promoter buying", "promoter selling"]):
        return "insider_trading"
    if any(k in comb for k in ["earnings call", "concall transcript", "investor call audio", "conference call"]):
        return "earnings_call"
    if any(k in comb for k in ["dividend", "interim dividend", "record date for dividend"]):
        return "dividend"
    if any(k in comb for k in ["stock split", "bonus issue", "sub-division"]):
        return "bonus_split"
    if any(k in comb for k in ["capex", "capacity expansion", "new plant", "manufacturing facility", "commercial production"]):
        return "capex"
    if any(k in comb for k in ["pledge", "revocation of pledge", "release of shares"]):
        return "pledging"
    if any(k in comb for k in ["postal ballot", "e-voting notice"]):
        return "postal_ballot"
    if any(k in comb for k in ["annual general meeting", "extraordinary general meeting", "agm notice", "egm notice"]):
        return "agm_egm"
    if any(k in comb for k in ["analyst meet", "investor conference", "institutional investor meet"]):
        return "investor_meetings"
    if any(k in comb for k in ["press release", "order win", "contract awarded", "clarification"]):
        return "press_release"
    
    return "unclassified"

def get_announcements_digest(
    window_hours: int = 24,
    ticker_filter: Optional[str] = None,
    category_filter: Optional[str] = None,
    hide_routine: bool = False
) -> List[Announcement]:
    """
    Returns windowed announcements digest sorted by priority (Tier 1 first) and recency.
    """
    now = datetime.now()
    results = []

    for item in SEED_ANNOUNCEMENTS:
        # Check window
        hours = item.get("hours_ago", 10)
        if hours > window_hours:
            continue

        symbol = item["symbol"]
        if ticker_filter and ticker_filter.upper() not in symbol.upper():
            continue

        cat = item["category"]
        if category_filter and category_filter != "all" and cat != category_filter:
            continue

        tier = CATEGORY_TIERS.get(cat, 3)
        if hide_routine and tier == 3:
            continue

        # Format timestamp
        timestamp_dt = now - timedelta(hours=hours)
        timestamp_str = timestamp_dt.strftime("%d %b %H:%M")

        res_data = None
        if "result_data" in item:
            res_data = EnrichedQuarterlyResult(**item["result_data"])

        mgmt_data = None
        if "mgmt_data" in item:
            mgmt_data = EnrichedManagementChange(**item["mgmt_data"])

        ann = Announcement(
            id=item["id"],
            symbol=symbol,
            company_name=item["company_name"],
            category=cat,
            tier=tier,
            title=item["title"],
            summary=item["summary"],
            timestamp=timestamp_str,
            filing_url=item.get("filing_url"),
            is_material=item.get("is_material", tier == 1),
            result_data=res_data,
            mgmt_data=mgmt_data,
            tags=item.get("tags", [])
        )
        results.append((ann, hours))

    # Sort primarily by Tier (Tier 1 first), then by recency (smallest hours ago first)
    results.sort(key=lambda x: (x[0].tier, x[1]))
    return [x[0] for x in results]

def get_catalysts_calendar() -> List[Dict[str, Any]]:
    """
    Returns upcoming institutional catalysts, earnings dates, and concalls
    across the portfolio universe (Quartr / AlphaSense standard).
    """
    return [
        {
            "symbol": "TRENT.NS",
            "company_name": "Trent Ltd",
            "event_type": "CONCALL",
            "date": "06 Nov 2026",
            "time": "04:00 PM IST",
            "status": "CONFIRMED",
            "details": "Q2 FY27 Earnings Conference Call • Universal Dial-in: +91 22 6280 1144",
            "key_watchpoints": "Zudio store addition pace, gross margin mix, and UAE international pilot update"
        },
        {
            "symbol": "DIXON.NS",
            "company_name": "Dixon Technologies",
            "event_type": "CONCALL",
            "date": "09 Nov 2026",
            "time": "05:00 PM IST",
            "status": "CONFIRMED",
            "details": "Q2 FY27 Post-Earnings Briefing • Diamond Pass Registration Active",
            "key_watchpoints": "Noida display component line ramp-up, Ismartu integration, and PLI incentive claims"
        },
        {
            "symbol": "TATAMOTORS.NS",
            "company_name": "Tata Motors",
            "event_type": "BOARD_MEETING",
            "date": "12 Nov 2026",
            "time": "02:30 PM IST",
            "status": "SCHEDULED",
            "details": "Board of Directors meeting for financial results and EV demerger roadmap review",
            "key_watchpoints": "Commercial Vehicle demand cycle, JLR free cash flow generation, and EV battery supply chain"
        },
        {
            "symbol": "RELIANCE.NS",
            "company_name": "Reliance Industries",
            "event_type": "ANALYST_MEET",
            "date": "14 Nov 2026",
            "time": "07:00 PM IST",
            "status": "SCHEDULED",
            "details": "Quarterly Analyst Media & Investor Briefing • Webcast Live via JioEvents",
            "key_watchpoints": "Jio tariff hike realization, 5G monetization, and Retail square footage additions"
        },
        {
            "symbol": "KAYNES.NS",
            "company_name": "Kaynes Technology",
            "event_type": "BOARD_MEETING",
            "date": "16 Nov 2026",
            "time": "03:30 PM IST",
            "status": "SCHEDULED",
            "details": "Board Meeting for Q2 unaudited standalone and consolidated results approval",
            "key_watchpoints": "Sanand OSAT semiconductor assembly progress, defense order book execution"
        },
        {
            "symbol": "HAL.NS",
            "company_name": "Hindustan Aeronautics",
            "event_type": "CONCALL",
            "date": "18 Nov 2026",
            "time": "11:00 AM IST",
            "status": "TENTATIVE",
            "details": "Institutional Investor Conference Call • Audio webcast available on BSE",
            "key_watchpoints": "LCA Tejas Mk1A delivery milestones, GE-F404 engine shipments, and export pipeline"
        }
    ]

