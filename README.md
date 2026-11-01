# FINN: Financial Investment Agent

> **Built for the ENAM Holdings AI Engineer Build Challenge (IIT Screening - 2027)**  
> *A mobile-first proactive intelligence and primary fundamental research layer for public-markets investors.*

[![FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688.svg?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/Frontend-React%20%2B%20Vite-61DAFB.svg?logo=react&logoColor=black)](https://reactjs.org/)
[![TailwindCSS](https://img.shields.io/badge/Styling-Tailwind%20CSS-38B2AC.svg?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![TypeScript](https://img.shields.io/badge/Types-TypeScript-3178C6.svg?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

---

## 🧭 Project Positioning

> **FINN is a mobile-first investment intelligence agent that filters a high-conviction portfolio’s regulatory and EOD market signals in Push mode, and performs primary-source fundamental research across ENAM’s eight analytical dimensions in Pull mode, augmented by a forensic auditor, management-guidance tracking, AI copilot, and cost-aware model routing.**

---

## 📱 Live Demonstration & Verification

### Option 1: Instant Interactive Review on Mobile/Web (Zero Setup)
👉 **[Launch Interactive Mobile Prototype on Figma](https://www.figma.com/design/jygIJOszMFKW9UZqHhDHrk?node-id=15-3&autoplay-code-preview=15-3)**  
*Runs the full interactive web application directly inside Figma in a mobile viewport — testable immediately on desktop or mobile phone with zero command-line setup.*

### Option 2: Live Public Web App (Phone Accessible)
👉 **https://e98175785e8938.lhr.life** *(Direct public HTTPS tunnel to running FastAPI + Vite full-stack service)*

### Option 3: Local One-Command Launch
```powershell
# Clone the repository
git clone https://github.com/ayush-enam/FINN-investment-agent
cd ENAM

# Activate python virtual environment & install requirements
python -m venv .venv
.\.venv\Scripts\pip install -r backend/requirements.txt

# Run the unified server
$env:PYTHONPATH="backend"
.\.venv\Scripts\python -m uvicorn app.main:app --host 127.0.0.1 --port 8000
```
Open **`http://localhost:8000`** in your browser.

---

## 💡 Core Philosophy: Filtering Noise, Grounding in Primary Signal

Public-markets investors do not suffer from an information shortage; they are overwhelmed by sheer volume. FINN is engineered around the belief that **the scarce skill is filtering: surfacing the critical signals and burying administrative noise.**

```
                             ┌────────────────────────────────────────┐
                             │                  FINN                  │
                             │       (Financial Investment Agent)     │
                             └───────────────────┬────────────────────┘
                                                 │
                      ┌──────────────────────────┴──────────────────────────┐
                      ▼                                                     ▼
            【 PUSH MODE 】                                       【 PULL MODE 】
       (Proactive Signal Filtering)                           (Deep Primary Research)
   • Windowed Digest (24h, 3d, 7d)                       • Strict Primary Grounding (ARs + Concalls)
   • 17 Regulatory Announcement Categories               • 8 Core ENAM Research Modules
   • Collapsible Routine / Compliance Rows               • "Narrative vs. Numbers" 4-Quarter Audit
   • Enriched Results (Rev, EBITDA, PBT, PAT)            • Cash Quality & Cash Conversion (CFO vs. PAT)
   • Enriched C-Suite Transitions (Pedigree)             • + Concall Q&A Hot Seat (AlphaSense standard)
   • Institutional Catalyst Calendar (Dial-ins)          • + Management Guidance Batting Average
   • Configurable EOD Threshold Alerts                   • + Added Statutory Footnote Auditor
                                                         • + Universal Any-Ticker Generalization
```

---

## ⚡ Feature Highlights

### 1. Push Mode (Proactive Signal Filtering)
* **Windowed Digest**: Configurable time window (24h default, 3d, 7d) across an 18-company high-conviction Indian portfolio.
* **17-Category Taxonomical Classifier**: Classifies exchange filings according to the ENAM reference guide (`results`, `management_change`, `M&A`, `capex`, `credit_rating`, `litigation`, `fund_raise`, `press_release`, `dividend`, `bonus_split`, `insider_trading`, `pledging`, `earnings_call`, `investor_meetings`, `postal_ballot`, `agm_egm`, `unclassified`).
* **Smart Priority Tiering**:
  * **Tier 1 (High Priority)**: Urgent corporate catalysts surfaced with accent badges.
  * **Tier 2 (Watchlist)**: Secondary operational filings.
  * **Tier 3 (Routine Paperwork)**: ESOP allotments, general meeting paperwork, and postal ballots are automatically collapsed into a secondary view.
* **Enriched Quarterly Results**: Automated extraction of **Revenue, EBITDA, PBT, and PAT** with both **QoQ** and **YoY** percentage variations and operational margin drivers.
* **Enriched Management Transitions**: Extracts executive appointments and enriches incoming leaders with career history, prior leadership roles, and operational pedigree.
* **Configurable EOD Threshold Alerts**: Monitors latest End-of-Day market data for volume breakouts ($> 2.0\times$ 20-day moving average) and daily price swings ($\pm 3\%$) with adjustable sliders.

### 2. Pull Mode (Deep Primary Fundamental Research)
* **Precise Primary-Source Grounding**: Source discovery may use Screener/BSE/NSE/company IR pages, while analytical claims are strictly grounded in underlying company filings, annual reports, and concall transcripts.
* **8 Core ENAM Research Modules**:
  1. **Business Snapshot & Segments**: Revenue mix, core operating units, and competitive moats.
  2. **Financial Snapshot**: Current TTM numbers, EBITDA margin, ROCE, ROE, P/E ratio, EV/EBITDA.
  3. **Multi-Year Trajectory**: 3-year sales/PAT CAGR and margin expansion vs. compressions.
  4. **Balance Sheet & Leverage**: Debt profile, Net Debt, Debt-to-Equity, and Working Capital Days.
  5. **Cash Quality**: Cash conversion ratio ($\text{CFO} / \text{PAT}$) and Free Cash Flow generation.
  6. **Flagship "Narrative vs. Numbers" Module**: Compares management forward guidance against actual delivered reality across 4 consecutive quarters, scoring alignment as `BEAT`, `MET`, `MISSED`, or `DIVERGED`.
  7. **Forward Guidance**: Explicit stated management expectations on growth, store expansion, capex, and margin bands.
  8. **Bull vs. Bear Thesis**: Tight, high-conviction dual-perspective investment cases.
* **Added FINN Extensions**:
  * **+ Statutory Footnote & Governance Auditor**: Audits Note 34 (Related Party Transactions) for arm's-length terms, scans the Independent Auditor's Report for qualifications, and checks Contingent Liabilities / Net Worth.
  * **+ Universal Any-Ticker Generalization**: Dynamically evaluates any user-entered NSE/BSE ticker beyond the mock portfolio.

### 3. Autonomous AI Features (Powered by Gemini 2.0 Flash)
* **60-Second AI Morning Audio Briefing**: Pre-market audio briefing player using the browser's native Web Speech API and dynamic waveform visualization.
* **FINN Interactive Primary Copilot**: Interactive dialogue interface dedicated to concalls and filings with 1-click forensic query pills (Guidance Audit, Note 34 Footnote scan, Cash Conversion CFO/PAT check, Capex timelines).
* **Cost-Conscious Model Routing**: Multi-tiered routing supporting Google Gemini 2.0 Flash (`google-genai`), Groq Llama 3.3 70B, and OpenAI, paired with a deterministic heuristic fallback to ensure the evaluation prototype remains functional without an API key.

---

## 🎨 Design Philosophy: Groww-Inspired Mobile Aesthetic

* **Typography**: **Plus Jakarta Sans** (clean, crisp, modern fintech standard) paired with **JetBrains Mono** for financial figures.
* **Seamless List Rows**: Converted bulky card containers into seamless rows separated by hairline dividers (`divide-y divide-[#F5F6F8]`).
* **Subtle Metadata**: Replaced harsh boxed borders around tags with understated dot-separated metadata text (`Credit rating • 30 Oct, 9:45 PM • BSE`).
* **Ergonomics**: Bottom 5-tab navigation bar (`Feed`, `Holdings`, `AI Copilot`, `Research`, `Alerts`) optimized for one-handed mobile phone usage.

---

## 📂 Repository Structure

```
├── backend/
│   ├── app/
│   │   ├── main.py                  # API endpoints, middleware & static SPA mounting
│   │   ├── config.py                # 18-stock portfolio definition, thresholds, tiers
│   │   ├── models.py                # Pydantic data schemas
│   │   └── services/
│   │       ├── market_data.py       # EOD prices, 20d MA, volume multiples
│   │       ├── announcements.py     # 17-category taxonomy, QoQ/YoY metric extraction
│   │       ├── primary_research.py  # 8-module analytical suite & dynamic ticker engine
│   │       ├── llm_router.py        # Gemini 2.0 Flash routing, Copilot, 60s briefing
│   │       └── cache.py             # 10-minute disk and memory cache
├── frontend/
│   ├── src/                         # React 19 + TypeScript + Tailwind v4 components
│   └── dist/                        # Compiled production SPA bundle
└── docs/
    ├── COVERING_NOTE.md             # Formal submission writeup for ENAM evaluators
    ├── AI_BUILD_HISTORY.md          # Chronological log of agent prompts & iterations
    ├── ARCHITECTURE.md              # Detailed technical and data pipeline specifications
    └── EMAIL_SUBMISSION.md          # Ready-to-send draft for assessment@enam.com
```

---

## ⚖️ Trade-offs & Deliberate Omissions
* **Intraday Streaming**: Omitted by design. Long-horizon fundamental investors focus on structural quarterly inflections and EOD closing breakouts, not tick-level intraday volatility.
* **Secondary Sentiment Scrapers**: Social media sentiment is noisy and momentum-driven. Pull research strictly isolates primary disclosures.
* **Deterministic Fallback Operation**: Ensures all core views and research modules remain functional even if an evaluator runs the application without entering an external API key.
