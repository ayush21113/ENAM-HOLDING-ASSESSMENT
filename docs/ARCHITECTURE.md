# FINN: System Architecture & Technical Specifications

**Built for**: ENAM Holdings AI Engineer Build Challenge  
**Application**: Mobile-First Financial Investment Agent  
**Focus**: Signal Filtering, Primary Grounding, High Conviction, and Zero "AI Slop"

---

## 1. High-Level System Architecture

```mermaid
flowchart TD
    subgraph Primary Ingestion Layer
        YF["Yahoo Finance API\n(EOD Prices, Volume, 20d MA)"]
        EX["NSE / BSE Exchange Feed\n(Regulatory Disclosures)"]
        SC["Screener.in & Primary IR\n(Annual Reports, Concalls)"]
    end

    subgraph FINN Backend (FastAPI Core)
        MD["Market Data Service\n• 20d Avg Volume\n• Threshold Triggers"]
        AC["Announcement Classifier\n• 17 Taxonomy Categories\n• Tier 1/2/3 Prioritizer"]
        EN["Enrichment Engine\n• Results: Rev, EBITDA, PBT, PAT (QoQ/YoY)\n• Mgmt: Career Pedigree & Background"]
        PR["Primary Research Engine\n• 8 Modules\n• Strict Primary Grounding"]
        NV["Narrative vs. Numbers Engine\n• 4-Quarter Guidance Audit\n• Promised vs. Delivered Diff"]
        MR["Smart Model Router\n• Tier A: Gemini 2.0 Flash / Groq Llama 3.3\n• Tier B: Gemini Pro / GPT-4o\n• Fallback: Deterministic Heuristics"]
        CACHE["Tiered Cache Layer\n• Memory & Disk Cache (10m TTL)"]
    end

    subgraph FINN Mobile-First Client (React / Vite / Tailwind)
        PUSH["Push Digest Feed\n• 24h / 3d / 7d Window\n• Collapsed Routine Filings\n• Enriched Results & Mgmt Cards"]
        PORT["Portfolio Monitor\n• 18 High-Conviction Companies\n• Volume Multiplier Badges\n• Alert Indicators"]
        PULL["Pull Deep Research\n• Universal Any-Ticker Engine\n• 8 Analytical Deep Modules\n• Primary Source Audit Trails"]
        CTRL["Controls & Alerts Modal\n• Configurable Threshold Sliders\n• Dynamic LLM Key Config"]
    end

    Primary Ingestion Layer --> FINN Backend
    FINN Backend --> CACHE
    FINN Backend --> FINN Mobile-First Client
```

---

## 2. Ingestion & Data Normalization

### A. Market Data & Unusual Threshold Breaches
- **EOD Ingestion**: Pulls end-of-day market closes and daily volume across the portfolio universe (`.NS` / `.BO` tickers).
- **20-Day Moving Average**: Computes the 20-day trailing baseline volume excluding the current session.
- **Volume Multiplier**:
  $$\text{Volume Multiplier} = \frac{\text{Current Daily Volume}}{\text{Average Volume}_{20\text{d}}}$$
  If $\text{Multiplier} \ge \text{Threshold}$ (default $2.0\times$), an automatic `VOLUME_SPIKE` alert is triggered.
- **Price Delta**:
  $$\Delta P = \frac{P_{\text{close}} - P_{\text{prev}}}{P_{\text{prev}}} \times 100$$
  If $|\Delta P| \ge \text{Threshold}$ (default $\pm 3.0\%$), a `PRICE_SURGE` or `PRICE_DUMP` alert is surfaced.

---

## 3. The 17-Category Announcement Taxonomy & Prioritization

Filings are classified into the 17 corporate announcement categories defined in the ENAM reference manual:

| Category | Priority Tier | Filtering Action | Description |
| :--- | :---: | :---: | :--- |
| `results` | **Tier 1** | Immediate Highlight | Quarterly/annual financials, board approvals, results decks |
| `management_change`| **Tier 1** | Immediate Highlight | CEO, CFO, MD, or director appointments, resignations, retirements |
| `M&A` | **Tier 1** | Immediate Highlight | Mergers, acquisitions, demergers, joint ventures, subsidiary investments |
| `credit_rating` | **Tier 1** | Immediate Highlight | Agency rating upgrades, downgrades, or reaffirmations |
| `litigation` | **Tier 1** | Immediate Highlight | Lawsuits, regulatory actions, penalties, restructuring |
| `capex` | **Tier 2** | Watchlist Feed | New plant approvals, facility expansions, commercial production |
| `fund_raise` | **Tier 2** | Watchlist Feed | Rights issues, QIPs, preferential allotments, debt/CP |
| `dividend` | **Tier 2** | Watchlist Feed | Cash dividends and record dates |
| `bonus_split` | **Tier 2** | Watchlist Feed | Bonus shares and stock splits |
| `insider_trading` | **Tier 2** | Watchlist Feed | Promoter/insider SEBI PIT disclosures |
| `earnings_call` | **Tier 2** | Watchlist Feed | Concall dates, audio links, and transcripts |
| `pledging` | **Tier 2** | Watchlist Feed | Promoter share pledge creation or revocation |
| `unclassified` | **Tier 3** | Collapsible / Bury | Routine compliance, ESOP allotments, auditor reappointment |
| `agm_egm` | **Tier 3** | Collapsible / Bury | Scrutinizer voting reports, meeting notices |
| `postal_ballot` | **Tier 3** | Collapsible / Bury | Routine postal ballot paperwork |
| `investor_meetings`| **Tier 3** | Collapsible / Bury | Routine analyst meet intimations |
| `press_release` | **Tier 3** | Collapsible / Bury | Non-material orders or routine PRs |

---

## 4. Deep Enrichment Mechanics

### 1. Quarterly Results Enrichment
Raw quarterly filings are parsed to extract:
- **Revenue**: Top-line turnover in ₹ Crores.
- **EBITDA & EBITDA Margin**: Core operating profitability ($\frac{\text{EBITDA}}{\text{Revenue}} \times 100$).
- **PBT**: Profit Before Tax.
- **PAT**: Profit After Tax (Net Profit).
- **Variations**:
  $$\text{QoQ \%} = \frac{M_{\text{current}} - M_{\text{prev\_qtr}}}{M_{\text{prev\_qtr}}} \times 100, \quad \text{YoY \%} = \frac{M_{\text{current}} - M_{\text{same\_qtr\_prev\_yr}}}{M_{\text{same\_qtr\_prev\_yr}}} \times 100$$
- **Margin Commentary**: One-line analytical distillation of margin drivers (operating leverage, input costs, product mix).

### 2. Management Transition Enrichment
When an executive transition is announced, FINN enriches the disclosure with:
- Executive name and new vs. former role
- Prior leadership tenure and parent organizations (e.g., Tesla, Polestar)
- Domain track record and educational pedigree (e.g., IIT, patents, technical specializations)

---

## 5. The 8-Module Primary Pull Research Engine

FINN strictly rejects secondary commentary (broker notes, target prices, media hype) and grounds all analysis in **primary sources**:

1. **Business Snapshot**: Core operations, business lines, revenue share, and defensible moats.
2. **Financial Snapshot**: Current TTM revenue, margins, PAT, ROCE, ROE, P/E, and EV/EBITDA.
3. **Trajectory**: 3-year revenue and PAT CAGRs, margin trajectory, and business drags.
4. **Balance Sheet & Leverage**: Debt levels, Net Debt, Debt-to-Equity ratio, and Working Capital Days.
5. **Cash Quality**:
   $$\text{Cash Conversion Ratio} = \frac{\text{Cash Flow from Operations (CFO)}}{\text{Net Profit (PAT)}}$$
   Verifies whether reported accounting earnings genuinely translate into physical cash flow.
6. **The Flagship "Narrative vs. Numbers"**:
   - Compares management claims and guidance stated in quarterly concalls against actual numbers delivered 3 months later.
   - Evaluates whether guidance was **BEAT**, **MET**, **MISSED**, or **DIVERGED**.
   - Scores divergence from 1 (aligned) to 5 (severe divergence).
7. **Forward Guidance**: Explicit stated management expectations on sales CAGR, capex outlays, and margin bands.
8. **Bull vs. Bear Case**: Compact, high-conviction dual-perspective investment thesis.

---

## 6. Smart Model Routing & Cost Optimization

To satisfy the requirement of cost efficiency without sacrificing quality:
- **Bulk Extraction & Classification (Tier A)**: Routed to fast, low-cost or free-tier models (`Gemini 2.0 Flash` or Groq `llama-3.3-70b-versatile`).
- **Deep Synthesis & Narrative Audit (Tier B)**: Routed to reasoning-optimized models (`Gemini Pro` / `GPT-4o` / `Claude 3.5 Sonnet`).
- **Deterministic Heuristic Fallback**: Zero-dependency offline heuristics and pre-indexed primary models ensure FINN runs flawlessly with zero API keys.
