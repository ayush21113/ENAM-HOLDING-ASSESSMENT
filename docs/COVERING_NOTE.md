# FINN (Financial Investment Agent) — Covering Note

**Submission for**: ENAM Holdings AI Engineer Build Challenge  
**Role**: AI Engineer (IIT Screening - 2027)  
**Deliverable**: Working Mobile-First Prototype + Repository + Covering Note  
**Candidate Submission Subject**: `ENAM - IIT screening - 2027`  
**Submission Email**: `assessment@enam.com`

---

## 1. Executive Summary & Positioning

> **FINN is a mobile-first investment intelligence agent that filters a high-conviction portfolio’s regulatory and EOD market signals in Push mode, and performs primary-source fundamental research across ENAM’s eight analytical dimensions in Pull mode, augmented by a forensic auditor, management-guidance tracking, AI copilot, and cost-aware model routing.**

Recognizing that public-markets investors are overwhelmed by sheer disclosure volume rather than an absence of data, FINN focuses ruthlessly on **filtering, signal prioritization, and primary-source grounding**.

---

## 2. Interaction Modalities & Core Architecture

### A. Push Mode (Proactive Signal Filtering)
* **Windowed Digest**: Configurable time window (24h, 3d, 7d). Routine administrative filings (ESOP allotments, general meeting paperwork, postal ballots) are collapsible into a secondary view to preserve cognitive bandwidth.
* **17-Category Taxonomical Classifier**: Classifies raw exchange filings into the exact categories specified in the ENAM reference manual (`results`, `management_change`, `M&A`, `capex`, `credit_rating`, `litigation`, `fund_raise`, `press_release`, `dividend`, `bonus_split`, `insider_trading`, `pledging`, `earnings_call`, `investor_meetings`, `postal_ballot`, `agm_egm`, `unclassified`) with 3-tier severity ranking.
* **Configurable EOD Threshold Monitoring & Triggered Alerts**: Evaluates End-of-Day price swings ($\pm 3\%$ default) and unusual volume spikes ($> 2.0\times$ 20-day moving average) against latest EOD market data after close.
* **Deep Push Enrichments**:
  * *Financial Results*: Automated extraction of headline metrics — **Revenue, EBITDA, PBT, and PAT** — accompanied by both **QoQ** and **YoY** percentage variations and operating margin commentary.
  * *Management Transitions*: Enriches incoming C-suite executives with career history, prior leadership roles, and operational track record.

---

### B. Pull Mode (Deep Primary Fundamental Research)
* **Precise Primary-Source Grounding**: Source discovery may use Screener/BSE/NSE/company IR pages, while analytical claims are strictly grounded in underlying company filings, annual reports, and concall transcripts (explicitly excluding broker consensus notes and secondary media commentary).
* **8 Core ENAM Research Modules**:
  1. **Business Snapshot**: Core operations, operating segments, and competitive moat analysis.
  2. **Financial Snapshot**: Headline TTM metrics, margins, ROCE, ROE, P/E, and EV/EBITDA.
  3. **Trajectory**: Multi-year revenue and PAT CAGR, long-term margin direction, and cost compressions.
  4. **Balance Sheet & Leverage**: Total Debt, Net Debt, Debt/Equity, and working-capital cycle days.
  5. **Cash Quality**: Cash from Operations ($\text{CFO}$) vs. Reported Profit ($\text{PAT}$), Cash Conversion Multiple ($\text{CFO} / \text{PAT}$), and Free Cash Flow ($\text{FCF}$) generation.
  6. **Flagship "Narrative vs. Numbers" Diff**: Compares management forward guidance against actual delivered reality across 4 consecutive quarters, scoring alignment as `BEAT`, `MET`, `MISSED`, or `DIVERGED`.
  7. **Forward Guidance Targets**: Explicit stated management targets on sales growth, footprint expansion, and capex outlays.
  8. **Bull vs. Bear Thesis**: High-conviction qualitative thesis for long-term compounding vs. critical downside risks.
* **Added FINN Extensions**:
  * **+ Statutory Footnote & Governance Auditor**: Audits Note 34 (Related Party Transactions) for arm's-length compliance, reviews the Statutory Auditor's Report for adverse qualifications, and screens Contingent Liabilities / Net Worth.
  * **+ Universal Any-Ticker Generalization**: Dynamically analyzes any user-entered NSE/BSE ticker, extending beyond the 18-stock demonstration universe.

---

### C. Autonomous AI Tools & Model Routing
* **60-Second AI Morning Audio Briefing**: Live speech-synthesized audio briefing player (using native Web Speech API + dynamic waveform visualization) delivering an executive 60-second morning audio wrap of Tier-1 disclosures and EOD volume breakouts before the market opens.
* **FINN Interactive Primary Copilot**: Interactive dialogue interface dedicated to concalls and filings with 1-click forensic query pills (Guidance Audit, Note 34 Footnote scan, Cash Conversion CFO/PAT check, Capex timelines).
* **Cost-Conscious Model Routing**: Supports Google Gemini 2.0 Flash (`google-genai`), Groq Llama 3.3 70B, and OpenAI. Routine classification is routed to high-speed/free-tier models, reserving deeper models for narrative synthesis. If no API key is supplied, a deterministic heuristic fallback ensures the prototype remains fully functional during evaluation.
* **Groww-Style Modern Fintech UI**: Mobile-first design inspired by Groww (clean white `#FFFFFF` canvas, Groww Green `#00D09C` / `#00875A`, Plus Jakarta Sans typography, hairline dividers, zero boxy card clutter).

---

## 3. Key Decisions & Architectural Trade-offs

| Decision | What We Chose | Trade-off / Rationale |
| :--- | :--- | :--- |
| **Model Routing Strategy** | Multi-Tiered Routing + Deterministic Fallback | Routine extraction uses lightweight models (`Gemini 2.0 Flash` / `Groq Llama 3.3`), reserving reasoning models for Narrative vs. Numbers synthesis. Deterministic fallback ensures the evaluation prototype remains functional without an API key. |
| **Primary Grounding Discipline** | Primary Filings Only (No Broker Notes / Web Sentiment) | Secondary news and broker commentaries introduce market noise and herd biases. By grounding claims strictly in primary investor disclosures, FINN preserves high conviction and auditability. |
| **Mobile-First UX** | Focused Mobile Viewport + Device Frame Toggle | Public-markets investors monitor portfolios on the go. Inspired by mobile-first workflows, we prioritized vertical density, bottom navigation, and collapsible routine rows over bloated desktop dashboards. |
| **Caching Layer** | 10-Minute Disk & Memory Cache | Market data and LLM synthesis are cached locally to minimize redundant network calls, preserve rate limits, and provide instant sub-50ms UI transitions. |

---

## 4. What Was Deliberately Left Out

To adhere to the core principle **"Thin-but-working beats broad-but-broken"**, we deliberately excluded several secondary features:
1. **Intraday Tick-by-Tick Streaming**: Institutional public-markets investors focus on high-conviction fundamental shifts and EOD closing patterns, not tick-by-tick microsecond order book noise. We focused on End-of-Day (EOD) closing data and 20-day volume moving averages.
2. **Social Sentiment & Twitter Scrapers**: Sentiment analysis on financial Twitter/Reddit is noisy and frequently manipulated by retail momentum. We excluded all secondary chatter to maintain institutional signal integrity.
3. **Complex Portfolio Accounting / Tax Ledgers**: FINN is an intelligence and research copilot, not a custodial brokerage or back-office accounting engine.

---

## 5. Where We Would Take It Next

Given more time and production infrastructure, the next evolution of FINN would incorporate:
1. **Audio Transcript Sync (Quartr-style)**: Synchronized audio playback with interactive concall transcript scrubbing, jumping directly to analyst Q&A pressure points.
2. **Multi-Agent Management Style Profiler**: Tracking executive linguistic markers across 5+ years of calls to detect defensive tone shifts, evasive answers, and sudden guidance changes.
3. **Automated XBRL Regulatory Filings Parser**: Directly ingesting machine-readable XBRL feeds from BSE/NSE disclosures for instantaneous tabular parsing.
4. **Push Notification Webhooks (Telegram / WhatsApp / Slack)**: Real-time mobile webhook delivery when an investor's custom threshold is breached after market close.
