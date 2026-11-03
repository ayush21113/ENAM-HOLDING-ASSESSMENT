"""
Pydantic Schemas for FINN
"""
from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field

class EnrichedQuarterlyResult(BaseModel):
    quarter: str
    revenue_cr: float
    revenue_qoq_pct: float
    revenue_yoy_pct: float
    ebitda_cr: float
    ebitda_qoq_pct: float
    ebitda_yoy_pct: float
    ebitda_margin_pct: float
    pbt_cr: float
    pbt_qoq_pct: float
    pbt_yoy_pct: float
    pat_cr: float
    pat_qoq_pct: float
    pat_yoy_pct: float
    margin_commentary: str

class EnrichedManagementChange(BaseModel):
    action: str  # e.g., "Appointed CEO", "Resigned CFO"
    person_name: str
    new_role: str
    former_role: Optional[str] = None
    prior_company: Optional[str] = None
    career_background: str
    pedigree_highlights: List[str] = []

class Announcement(BaseModel):
    id: str
    symbol: str
    company_name: str
    category: str
    tier: int = 1  # 1 (Critical), 2 (Medium), 3 (Routine)
    title: str
    summary: str
    timestamp: str
    filing_url: Optional[str] = None
    is_material: bool = False
    result_data: Optional[EnrichedQuarterlyResult] = None
    mgmt_data: Optional[EnrichedManagementChange] = None
    tags: List[str] = []

class TriggeredAlert(BaseModel):
    id: str
    symbol: str
    company_name: str
    alert_type: str  # "VOLUME_SPIKE", "PRICE_SURGE", "PRICE_DUMP", "MATERIAL_ANNOUNCEMENT"
    title: str
    description: str
    metric_value: Optional[float] = None
    threshold_value: Optional[float] = None
    severity: str = "warning"  # "info", "warning", "critical"
    timestamp: str

class StockEOD(BaseModel):
    symbol: str
    name: str
    sector: str
    market_cap_tier: str
    price: float
    change_pct: float
    volume: int
    avg_volume_20d: int
    volume_multiple: float
    day_high: float
    day_low: float
    pe_ratio: Optional[float] = None
    market_cap_cr: Optional[float] = None
    has_active_alert: bool = False
    alert_summary: Optional[str] = None
    source: str = "Live Yahoo Chart v8"

class LiveStockQuote(BaseModel):
    symbol: str
    name: str
    price: float
    change_pct: float
    change_abs: float
    previous_close: float
    day_high: float
    day_low: float
    fifty_two_week_high: Optional[float] = None
    fifty_two_week_low: Optional[float] = None
    volume: int
    avg_volume_20d: int
    volume_multiple: float
    timestamp: str
    is_live: bool = True
    source: str = "Live Market Feed"

class NarrativeQuarter(BaseModel):
    quarter: str
    management_guidance: str
    actual_delivered: str
    verdict: str  # "BEAT", "MET", "MISSED", "DIVERGED"
    divergence_score: int  # 1 (low divergence) to 5 (severe divergence)
    analyst_takeaway: str

class ConcallQAItem(BaseModel):
    analyst_name: str
    brokerage_firm: str
    topic: str
    question_summary: str
    management_response: str
    tone_verdict: str  # "DIRECT", "CAUTIOUS", "EVASIVE"
    pressure_level: str  # "HIGH", "MEDIUM", "LOW"
    institutional_takeaway: str

class GuidanceCredibilityScorecard(BaseModel):
    batting_average_pct: int
    verdict: str
    summary: str
    quarters_reviewed: int
    beats: int
    meets: int
    misses: int

class DisclosureDiffItem(BaseModel):
    category: str  # "Guidance Language", "Margin Policy", "Capex Milestone", "Risk Disclosure"
    prior_quarter: str
    prior_quote: str
    current_quarter: str
    current_quote: str
    semantic_shift: str  # "Softened", "Strengthened", "Omitted", "Reframed"
    severity: str  # "neutral", "attention", "positive"
    institutional_insight: str

class ForensicMetric(BaseModel):
    metric_code: str  # e.g., "DSRI", "AQI", "DEPI", "TATA", "RPT"
    metric_name: str
    value: float
    benchmark: str
    verdict: str  # "SAFE", "WATCHLIST", "FLAG"
    detail: str

class ForensicAccountingRadar(BaseModel):
    beneish_m_score: float
    manipulation_risk: str  # "LOW", "MODERATE", "HIGH"
    composite_health_score: int  # 0 to 100
    metrics: List[ForensicMetric]
    auditor_opinion: str
    rpt_note34_verdict: str

class ICMemoResponse(BaseModel):
    generated_at: str
    portfolio_symbol_count: int
    market_stance: str
    executive_summary: str
    catalyst_breakdown: List[Dict[str, Any]]
    volume_anomalies: List[Dict[str, Any]]
    forensic_audit_flags: List[Dict[str, Any]]
    analyst_action_items: List[str]
    markdown_memo: str

class ResearchPullResponse(BaseModel):
    symbol: str
    company_name: str
    sector: str
    primary_sources: List[Dict[str, str]]
    
    # The 8 analytical modules
    business_snapshot: Dict[str, Any]
    financial_snapshot: Dict[str, Any]
    trajectory: Dict[str, Any]
    balance_sheet: Dict[str, Any]
    cash_quality: Dict[str, Any]
    narrative_vs_numbers: List[NarrativeQuarter]
    guidance: Dict[str, Any]
    bull_vs_bear: Dict[str, Any]

    # Advanced Global Research Extensions (AlphaSense & Quartr benchmarks)
    concall_qa: Optional[List[ConcallQAItem]] = None
    credibility_scorecard: Optional[GuidanceCredibilityScorecard] = None
    disclosure_diff: Optional[List[DisclosureDiffItem]] = None
    forensic_radar: Optional[ForensicAccountingRadar] = None

class SettingsUpdate(BaseModel):
    price_threshold_pct: float = 3.0
    volume_multiplier: float = 2.0
    gemini_api_key: Optional[str] = None
    groq_api_key: Optional[str] = None
    openai_api_key: Optional[str] = None
