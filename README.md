# PULSE · ENAM: Real-Time Mobile Investment Intelligence Agent

> **Built for the ENAM Holdings AI Engineer Build Challenge (IIT Screening - 2027)**  
> *A mobile-first proactive intelligence and primary fundamental research layer for public-markets investors.*

[![Live App](https://img.shields.io/badge/Deployment-Vercel%20Edge%20Live-00D09C.svg?logo=vercel&logoColor=white)](https://enam-holding-assessment-frontend.vercel.app)
[![React](https://img.shields.io/badge/Frontend-React%2019%20%2B%20Vite-61DAFB.svg?logo=react&logoColor=black)](https://reactjs.org/)
[![TailwindCSS](https://img.shields.io/badge/Styling-Tailwind%20CSS-38B2AC.svg?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![TypeScript](https://img.shields.io/badge/Types-TypeScript-3178C6.svg?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688.svg?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)

---

## 🌐 Live Application & Review Links

### 1. 🚀 Production Web App (Instant Mobile / Desktop Access)
👉 **[https://enam-holding-assessment-frontend.vercel.app](https://enam-holding-assessment-frontend.vercel.app)**  
*Runs serverless on Vercel Edge with zero setup. Optimized for mobile viewports (390×844) with full client-side primary research, pre-market IC memo, and Gemini 2.0 Flash-Lite Copilot.*

### 2. 🎨 Interactive Mobile Prototype on Figma
👉 **[Launch Interactive Mobile Prototype on Figma](https://www.figma.com/design/jygIJOszMFKW9UZqHhDHrk?node-id=15-3&autoplay-code-preview=15-3)**  
*Runs the full interactive web application directly inside Figma in a mobile device frame.*

### 3. 💻 GitHub Repository
👉 **[https://github.com/ayush21113/ENAM-HOLDING-ASSESSMENT](https://github.com/ayush21113/ENAM-HOLDING-ASSESSMENT)**

---

## 🧭 Project Positioning & Philosophy

> **PULSE is an institutional mobile-first investment intelligence solution designed for high-conviction portfolio tracking. It operates in Push Mode (filtering noise from 28 companies across 17 regulatory filing categories and alerting on price/volume anomalies) and Pull Mode (performing primary-source fundamental research across ENAM’s analytical dimensions, highlighted by our 4-quarter Management Guidance Batting Average, concall analyst grilling analysis in The Hot Seat, Beneish M-Score forensics, and an Edge AI Copilot).**

Public-markets investors do not suffer from an information shortage; they are overwhelmed by sheer volume. PULSE is engineered around the belief that **the scarce skill is filtering: surfacing the 2% critical catalysts and burying routine compliance paperwork.**

```
                             ┌────────────────────────────────────────┐
                             │              PULSE · ENAM              │
                             │   (Investment Intelligence Solution)   │
                             └───────────────────┬────────────────────┘
                                                 │
                      ┌──────────────────────────┴──────────────────────────┐
                      ▼                                                     ▼
            【 PUSH MODE 】                                       【 PULL MODE 】
       (Proactive Signal Filtering)                           (Deep Primary Research)
   • Windowed Digest (24h, 3d, 7d)                       • 28 High-Conviction Indian Holdings
   • 17 Regulatory Announcement Categories               • Strict Primary Grounding (BSE/NSE + Concalls)
   • Collapsible Routine 80% Compliance Rows             • 8 Core ENAM Analytical Dimensions
   • Enriched Results (Rev, EBITDA, PBT, PAT)            • Flagship "Narrative vs. Numbers" Audit
   • Automated QoQ & YoY Percentage Deltas               • Management Guidance Batting Average
   • Enriched C-Suite Transitions (Pedigree)             • Concall Q&A Hot Seat (Analyst Grilling Tone)
   • Pre-Market IC Morning Memo (1-Click MD)             • Beneish M-Score & Forensic Earnings Radar
   • Configurable EOD Threshold Alerts (±3%, 2x Vol)     • Ask Pulse Copilot (Gemini 2.0 Flash-Lite)
```

---

## ⚡ Core Architecture & Feature Matrix

### 1. Push Mode (Proactive Signal Filtering)
* **Windowed Digest**: Configurable time window (24h default, 3d, 7d) across a **28-company high-conviction Indian portfolio** spanning cyclicals, retail, financials, EMS, defence, and internet commerce.
* **17-Category Taxonomical Classifier**: Classifies exchange filings according to the ENAM reference guide (`results`, `management_change`, `M&A`, `capex`, `credit_rating`, `litigation`, `fund_raise`, `press_release`, `dividend`, `bonus_split`, `insider_trading`, `pledging`, `earnings_call`, `investor_meetings`, `postal_ballot`, `agm_egm`, `unclassified`).
* **Smart Priority Tiering**:
  * **Tier 1 (Critical Catalysts)**: Results, M&A, C-suite changes, major orders surfaced with priority accent badges.
  * **Tier 2 (Operational Watchlist)**: Capacity expansions, rating actions, institutional investor meetings.
  * **Tier 3 (Routine Paperwork)**: ESOP allotments, postal ballots, and AGM notices are automatically collapsed to preserve cognitive bandwidth.
* **Automated Contextual Enrichment**:
  * *Quarterly Results*: Instant extraction of **Revenue, EBITDA, PBT, and PAT** with **QoQ and YoY** percentage deltas and operating margin drivers.
  * *Leadership Changes*: Career pedigree, past corporate affiliations, and academic credentials.
* **Configurable EOD Threshold Alerts**: Monitors latest End-of-Day market data for volume breakouts ($> 2.0\times$ 20-DMA) and daily price swings ($\pm 3\%$) with real-time sliders in Settings.

---

### 2. Pull Mode (Deep Primary Fundamental Research)
* **Precise Primary-Source Grounding**: Claims are strictly grounded in underlying company filings, audited annual reports, and concall transcripts (zero secondary media commentary or broker target notes).
* **8 Core ENAM Analytical Modules**:
  1. **Business Snapshot & Segments**: Revenue mix, core operating units, and competitive moats.
  2. **Financial Snapshot**: Current TTM metrics, EBITDA margin, ROCE, ROE, P/E ratio, EV/EBITDA.
  3. **Multi-Year Trajectory**: 3-year sales/PAT CAGR and margin expansion vs. compressions.
  4. **Balance Sheet & Leverage**: Debt profile, Net Debt, Debt-to-Equity, and Working Capital Days.
  5. **Cash Quality**: Cash conversion ratio ($\text{CFO} / \text{PAT}$) and Free Cash Flow generation.
  6. **Flagship "Narrative vs. Numbers" Module**: Compares management forward guidance against actual delivered reality across 4 consecutive quarters, scoring alignment as `BEAT`, `MET`, `MISSED`, or `DIVERGED`.
  7. **Forward Guidance**: Explicit stated management expectations on growth, footprint expansion, capex, and margin bands.
  8. **Bull vs. Bear Thesis**: Tight, high-conviction dual-perspective investment cases.
* **Institutional Extensions**:
  * **Management Guidance Batting Average**: Quantitative 4-quarter scorecard benchmarking historical credibility (e.g. Tata Motors at 50% credibility with Novelis supply chain disruption).
  * **Concall Q&A Hot Seat**: Isolates unscripted analyst grilling from PR statements, classifying executive tone as `DIRECT`, `CAUTIOUS`, or `EVASIVE`.
  * **Beneish M-Score & Forensic Radar**: DSRI, AQI, DEPI, and TATA accrual indexes to screen for earnings manipulation risks.
  * **Statutory Footnote Auditor**: Audits Note 34 (Related Party Transactions) for arm's-length terms and scans the Independent Auditor's Report for qualifications.

---

### 3. Autonomous AI Tools & Interaction Design
* **Pre-Market Investment Committee (IC) Morning Memo**: 1-click synthesized executive brief in clean Markdown with one-click clipboard copy.
* **60-Second AI Morning Audio Briefing**: Pre-market audio briefing player using the browser's native Web Speech API and dynamic waveform visualization.
* **Ask Pulse AI Copilot**: Powered by **Google Gemini 2.0 Flash-Lite** with grounded filing context injection and **strict institutional domain guardrails** (politely refuses general coding, DSA/LeetCode, or off-topic requests).
* **Zero-Downtime Deterministic Fallback**: Complete client-side financial engine ensuring all 28 stocks and analytical modules remain fully functional with 0ms latency even without an API key.

---

### 4. Design System: Groww-Inspired Mobile Aesthetic
* **Typography**: **Plus Jakarta Sans** for crisp reading hierarchy paired with **JetBrains Mono** for financial figures.
* **Seamless List Rows**: Hairline dividers (`divide-y divide-[#F5F6F8]`) eliminating bulky card borders.
* **Clean Metadata**: Subtle inline dot-separated metadata text (`Credit rating • 30 Oct, 9:45 PM • BSE`).
* **Ergonomics**: Bottom navigation optimized for one-handed mobile phone usage with zero horizontal table scrolling.

---

## 🛠️ Local Development & Quick Start

```powershell
# 1. Clone the repository
git clone https://github.com/ayush21113/ENAM-HOLDING-ASSESSMENT.git
cd ENAM-HOLDING-ASSESSMENT

# 2. Run the frontend (Vite React Client)
cd frontend
npm install
npm run dev
```
Open **`http://localhost:5173`** in your browser.

*(Optional)* Run the FastAPI backend:
```powershell
# In project root:
python -m venv .venv
.\.venv\Scripts\pip install -r backend/requirements.txt
$env:PYTHONPATH="backend"
.\.venv\Scripts\python -m uvicorn app.main:app --host 127.0.0.1 --port 8000
```

---

## 📂 Repository Structure

```
├── frontend/                        # React 19 + TypeScript + Tailwind CSS (Vercel Edge Ready)
│   ├── src/
│   │   ├── components/              # Mobile views (Today, Watchlist, Research, HotSeat, Copilot)
│   │   ├── services/
│   │   │   ├── api.ts               # Unified API gateway with auto cloud edge detection
│   │   │   ├── standaloneEngine.ts  # Client-side primary research & financial models
│   │   │   └── geminiService.ts     # Gemini 2.0 Flash-Lite with domain guardrails
│   │   └── types/                   # Strict TypeScript domain interfaces
│   └── dist/                        # Optimized production bundle
├── backend/                         # FastAPI Python Server
│   └── app/
│       ├── main.py                  # API routes & static SPA mounting
│       ├── config.py                # 28-stock portfolio definition & thresholds
│       └── services/                # Market feeds, classification, and research modules
└── docs/
    ├── COVERING_NOTE.md             # Formal submission writeup for ENAM evaluators
    ├── AI_BUILD_HISTORY.md          # 10-session agent prompt & delivery trajectory
    ├── ARCHITECTURE.md              # Detailed technical design specifications
    └── EMAIL_SUBMISSION.md          # Ready-to-send draft for assessment@enam.com
```

---

## ⚖️ Trade-offs & Deliberate Omissions
1. **Intraday Tick-by-Tick Orderbook Streaming**: Omitted by design. Long-horizon fundamental investors prioritize structural quarterly inflections and EOD closing patterns over microsecond orderbook noise.
2. **FinTwit / Social Media Sentiment Scrapers**: Retail Twitter and Reddit sentiment frequently inject herd bias and manipulation noise. Pull research strictly isolates audited statutory disclosures.
3. **Secondary Broker Consensus Target Notes**: Excluded sell-side target prices in favor of direct management guidance vs. delivered reality audits.

---

## 🚀 Where We Would Take It Next
1. **Quartr-Style Concall Audio Sync**: Synchronized word-for-word transcript scrubbing with direct time-stamped jumps to heated analyst Q&A exchanges.
2. **Direct BSE/NSE XBRL XML Ingestion**: Ingesting machine-readable structured XBRL exchange feeds for sub-100ms automated tabular extraction.
3. **Multi-Year Executive Linguistic Fingerprinting**: Tracking promoter tone vectors across 5+ years of calls to detect subtle evasive shifts before financial deterioration appears.
4. **Instant Webhook Push Notifications (Telegram / WhatsApp)**: Pushing immediate alerts when an investor's custom ±X% price or >2x volume threshold is breached post-market.
