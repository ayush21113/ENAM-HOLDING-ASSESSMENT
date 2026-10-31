export interface EnrichedQuarterlyResult {
  quarter: string;
  revenue_cr: number;
  revenue_qoq_pct: number;
  revenue_yoy_pct: number;
  ebitda_cr: number;
  ebitda_qoq_pct: number;
  ebitda_yoy_pct: number;
  ebitda_margin_pct: number;
  pbt_cr: number;
  pbt_qoq_pct: number;
  pbt_yoy_pct: number;
  pat_cr: number;
  pat_qoq_pct: number;
  pat_yoy_pct: number;
  margin_commentary: string;
}

export interface EnrichedManagementChange {
  action: string;
  person_name: string;
  new_role: string;
  former_role?: string;
  prior_company?: string;
  career_background: string;
  pedigree_highlights: string[];
}

export interface Announcement {
  id: string;
  symbol: string;
  company_name: string;
  category: string;
  tier: number; // 1 = Critical, 2 = Medium, 3 = Routine
  title: string;
  summary: string;
  timestamp: string;
  filing_url?: string;
  is_material: boolean;
  result_data?: EnrichedQuarterlyResult;
  mgmt_data?: EnrichedManagementChange;
  tags: string[];
}

export interface TriggeredAlert {
  id: string;
  symbol: string;
  company_name: string;
  alert_type: string;
  title: string;
  description: string;
  metric_value?: number;
  threshold_value?: number;
  severity: 'info' | 'warning' | 'critical';
  timestamp: string;
}

export interface StockEOD {
  symbol: string;
  name: string;
  sector: string;
  market_cap_tier: string;
  price: number;
  change_pct: number;
  volume: number;
  avg_volume_20d: number;
  volume_multiple: number;
  day_high: number;
  day_low: number;
  pe_ratio?: number;
  market_cap_cr?: number;
  has_active_alert: boolean;
  alert_summary?: string;
}

export interface NarrativeQuarter {
  quarter: string;
  management_guidance: string;
  actual_delivered: string;
  verdict: 'BEAT' | 'MET' | 'MISSED' | 'DIVERGED';
  divergence_score: number;
  analyst_takeaway: string;
}

export interface ResearchPullResponse {
  symbol: string;
  company_name: string;
  sector: string;
  primary_sources: Array<{ title: string; type: string; date: string; url: string }>;
  business_snapshot: {
    core_activity: string;
    segments: Array<{ name: string; revenue_share_pct: number; margin_profile: string }>;
    competitive_moat: string;
  };
  financial_snapshot: {
    revenue_ttm_cr: number;
    ebitda_margin_pct: number;
    pat_ttm_cr: number;
    roce_pct: number;
    roe_pct: number;
    pe_ratio: number;
    ev_ebitda: number;
  };
  trajectory: {
    '3yr_sales_cagr_pct': number;
    '3yr_pat_cagr_pct': number;
    margin_trend: string;
    compressions: string;
  };
  balance_sheet: {
    total_debt_cr: number;
    cash_equivalents_cr: number;
    net_debt_cr: number;
    debt_to_equity: number;
    working_capital_days: number;
    working_capital_trend: string;
  };
  cash_quality: {
    cfo_ttm_cr: number;
    pat_ttm_cr: number;
    cash_conversion_ratio: number;
    free_cash_flow_cr: number;
    verdict: string;
  };
  narrative_vs_numbers: NarrativeQuarter[];
  guidance: {
    forward_sales_growth_target: string;
    store_addition_targets?: string;
    capex_plans: string;
    margin_band: string;
  };
  bull_vs_bear: {
    bull_case: string;
    bear_case: string;
  };
}

export interface UserSettings {
  price_threshold_pct: number;
  volume_multiplier: number;
  gemini_api_key?: string;
  groq_api_key?: string;
  openai_api_key?: string;
}

export interface BriefingResponse {
  script: string;
  catalysts_count: number;
  tier1_count: number;
  timestamp: string;
}

export interface ForensicFlag {
  type: string;
  severity: 'clean' | 'monitor' | 'warning' | 'alert';
  title: string;
  detail: string;
}

export interface ForensicReport {
  symbol: string;
  overall_health: string;
  flags: ForensicFlag[];
}

export interface CopilotResponse {
  answer: string;
  model: string;
  grounded: boolean;
  sources: Array<{
    title: string;
    type: string;
    date: string;
    url: string;
  }>;
}
