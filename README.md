# FINN: Financial Investment Agent

> **Built for the ENAM Holdings AI Engineer Build Challenge**  
> *A mobile-first proactive intelligence and primary fundamental research layer for public-markets investors.*

[![FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688.svg?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/Frontend-React%20%2B%20Vite-61DAFB.svg?logo=react&logoColor=black)](https://reactjs.org/)
[![TailwindCSS](https://img.shields.io/badge/Styling-Tailwind%20CSS-38B2AC.svg?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![TypeScript](https://img.shields.io/badge/Types-TypeScript-3178C6.svg?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/License-Proprietary-blue.svg)]()

---

## 📱 Live Demonstration & Quickstart

FINN is packaged as a **unified full-stack application**. The backend serves the high-performance API and also hosts the production mobile-first frontend build on a single unified port:

### 1. Prerequisites
- Python 3.10+
- Node.js 18+ (for frontend development)

### 2. Instant One-Command Launch

```powershell
# Clone the repository
git clone <your-repo-url>
cd ENAM

# Activate python virtual environment & install requirements
python -m venv .venv
.\.venv\Scripts\pip install -r backend/requirements.txt

# Run the unified server
$env:PYTHONPATH="backend"
.\.venv\Scripts\python -m uvicorn app.main:app --host 127.0.0.1 --port 8000
```

Open your browser at **`http://localhost:8000`**.  
*For the best mobile experience, use Chrome DevTools Mobile Viewport or click the **Smartphone icon** in the top navigation bar to toggle the simulated device frame.*

---

## 💡 Core Philosophy: Filtering Noise, Grounding in Primary Signal

Public-markets investors do not suffer from an information shortage; they are drowning in it. FINN is engineered around the belief that **the scarce skill is filtering: surfacing the few things that actually matter and burying everything else, beautifully.**

FINN operates in two distinct interaction modes:

```
                            ┌────────────────────────────────────────┐
                            │                  FINN                  │
                            │       (Financial Investment Agent)     │
                            └───────────────────┬────────────────────┘
                                                │
                     ┌──────────────────────────┴──────────────────────────┐
                     ▼                                                     ▼
           【 PUSH MODE 】                                       【 PULL MODE 】
      (Proactive Intelligence)                                (Deep On-Demand Research)
  • Windowed Digest (24h, 3d, 7d)                       • Strict Primary Grounding (ARs + Concalls)
  • 17 Regulatory Announcement Categories               • 8 Analytical Modules
  • Collapsible Routine / Compliance Rows               • "Narrative vs. Numbers" (Promised vs. Delivered)
  • Enriched Results (Rev, EBITDA, PBT, PAT)            • Cash Quality & Cash Conversion (CFO vs. PAT)
  • Enriched Management Transitions                     • Universal Generalization (Works on ANY NSE Ticker)
```

---

## ⚡ Feature Highlights

### 1. Push Mode (Proactive Daily Companion)
- **Windowed Digest**: Configurable time window (24h default, 3d, 7d) across an 18-company mock portfolio.
- **17-Category Taxonomical Classifier**: Classifies exchange filings according to the ENAM reference guide (`results`, `management_change`, `M&A`, `credit_rating`, `capex`, `litigation`, etc.).
- **Smart Priority Tiering**:
  - **Tier 1 (High Priority)**: Urgent corporate catalysts surfaced with accent badges.
  - **Tier 2 (Watchlist)**: Secondary filings (dividends, buybacks, concall notices).
  - **Tier 3 (Routine Paperwork)**: ESOP allotments, AGM scrutineer reports, and compliance certificates are automatically collapsed or hidden with a single toggle.
- **Enriched Quarterly Results Card**: Instant extraction of **Revenue, EBITDA, PBT, and PAT** with both **QoQ** and **YoY** percentage variations and operational margin drivers.
- **Enriched Management Transition Card**: Pulls incoming executive career pedigree, previous leadership roles (e.g., Tesla, Polestar), patents, and educational background.
- **Triggered Threshold Alerts**: Monitors EOD market data for volume breakouts ($> 2.0\times$ 20-day moving average) and daily price moves ($\pm 3\%$) with configurable sliders.

### 2. Pull Mode (Deep Primary Fundamental Research)
- **Primary Source Discipline**: No broker notes, no secondary news sentiment, no hallucinated generic model memories. Grounded exclusively in Annual Reports, Earnings Call Transcripts, and Regulatory Disclosures via Screener.in / BSE / NSE.
- **The 8 Analytical Modules**:
  1. **Business Snapshot & Segments**: Revenue mix, core operating units, and competitive moats.
  2. **Financial Snapshot**: Current TTM numbers, EBITDA margin, ROCE, ROE, P/E ratio, EV/EBITDA.
  3. **Multi-Year Trajectory**: 3-year sales/PAT CAGR and margin expansion vs. compressions.
  4. **Balance Sheet & Leverage**: Debt profile, Net Debt, Debt-to-Equity, and Working Capital Days.
  5. **Cash Quality**: Cash conversion ratio ($\text{CFO} / \text{PAT}$) and Free Cash Flow generation.
  6. **The Flagship "Narrative vs. Numbers" Module**: Compares management forward guidance against actual delivered reality across 4 consecutive quarters, scoring alignment and highlighting divergence.
  7. **Forward Guidance**: Explicit stated management expectations on growth, store expansion, capex, and margin bands.
  8. **Bull vs. Bear Thesis**: Tight, high-conviction dual-perspective investment cases.
- **Universal Generalization**: Evaluators can enter **any valid NSE ticker** (e.g., `RELIANCE.NS`, `INFY.NS`, `POLYCAB.NS`) to pull primary research dynamically.

---

## 🎨 Design Philosophy (Quartr & Koyfin Inspired)

- **Mobile First**: Built with bottom tab navigation, dense financial cards, and clean typography designed for one-handed mobile ergonomics.
- **Device Frame Toggle**: Allows reviewers on desktop computers to preview the application inside a simulated iPhone container or expand to full viewport with one click.
- **Data Density**: High-signal financial typography with green/red delta badges, mono numerals, and no gratuitous whitespace.

---

## 🧠 Smart Model Routing & Zero-Cost Efficiency

FINN implements cost-conscious model routing:
- **Tier A (Bulk Extraction & Classification)**: Routes routine document parsing to fast, low-cost or free-tier models (`Gemini 2.0 Flash` or Groq `llama-3.3-70b-versatile`).
- **Tier B (Deep Synthesis & Divergence Reasoning)**: Routes complex guidance auditing to reasoning-optimized models (`Gemini Pro` / `GPT-4o` / `Claude 3.5 Sonnet`).
- **Deterministic Offline Fallback**: Works 100% reliably out-of-the-box using built-in deterministic heuristics and pre-indexed primary datasets with zero API keys required. Users can optionally input their Gemini, Groq, or OpenAI keys directly in the in-app Settings modal.

---

## 📂 Project Structure

```
ENAM/
├── backend/
│   ├── app/
│   │   ├── config.py              # Portfolio universe (18 tickers) & threshold presets
│   │   ├── models.py              # Pydantic schemas for Push/Pull/Alerts
│   │   ├── main.py                # FastAPI endpoints & static frontend mount
│   │   └── services/
│   │       ├── market_data.py     # yfinance EOD data, 20d moving avg & alert triggers
│   │       ├── announcements.py   # 17-category classifier & enrichment pipeline
│   │       ├── primary_research.py# Primary Screener/IR scraper & 8 analytical modules
│   │       ├── llm_router.py      # Tiered model router (Gemini / Groq / OpenAI)
│   │       └── cache.py           # Dual-layer disk & memory cache
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── FeedPush.tsx       # Windowed digest & enriched filing cards
│   │   │   ├── ResearchPull.tsx   # 8-module deep fundamental primary analysis
│   │   │   ├── PortfolioView.tsx  # 18-company watchlist with volume multiple badges
│   │   │   ├── AlertSettingsModal.tsx # Threshold sliders & API key routing modal
│   │   │   ├── Header.tsx         # Brand header, alert indicator & device toggle
│   │   │   └── Navigation.tsx     # Native mobile bottom tab bar
│   │   ├── services/api.ts        # Typed API client
│   │   ├── types/index.ts         # TypeScript interfaces
│   │   ├── App.tsx                # Master container & state management
│   │   └── index.css              # Financial dark theme styling
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.ts
├── docs/
│   ├── COVERING_NOTE.md           # Required covering note on decisions & trade-offs
│   ├── AI_BUILD_HISTORY.md        # Prompt trajectories & coding agent logs
│   ├── ARCHITECTURE.md            # Deep technical design & data flow document
│   └── EMAIL_SUBMISSION.md        # Final email draft for assessment@enam.com
└── README.md                      # Master documentation
```

---

## 📋 Challenge Deliverables Mapping

| Required Deliverable | Location in Repository |
| :--- | :--- |
| **Mobile-First Working Prototype** | Unified server running at `http://localhost:8000` |
| **GitHub Repository** | Full source code with structured Git commit history |
| **AI Build History** | [`docs/AI_BUILD_HISTORY.md`](file:///c:/Users/prana/Downloads/ENAM/docs/AI_BUILD_HISTORY.md) |
| **Covering Note** | [`docs/COVERING_NOTE.md`](file:///c:/Users/prana/Downloads/ENAM/docs/COVERING_NOTE.md) |
| **Email Submission Template** | [`docs/EMAIL_SUBMISSION.md`](file:///c:/Users/prana/Downloads/ENAM/docs/EMAIL_SUBMISSION.md) |
