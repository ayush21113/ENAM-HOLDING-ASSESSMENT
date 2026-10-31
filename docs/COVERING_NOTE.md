# FINN (Financial Investment Agent) — Covering Note

**Submission for**: ENAM Holdings AI Engineer Build Challenge  
**Role**: AI Engineer (IIT Screening - 2027)  
**Deliverable**: Working Mobile-First Prototype + Repository + Covering Note  
**Candidate Submission Subject**: `ENAM - IIT screening - 2027`  
**Submission Email**: `assessment@enam.com`

---

## 1. What We Built

We built **FINN**, a mobile-first intelligent companion engineered specifically for a high-conviction public-markets investment team. Recognizing that investors are overwhelmed by sheer volume rather than a lack of data, FINN focuses ruthlessly on **filtering, signal prioritization, and primary grounding**.

### Core Architecture & Interaction Modalities:
1. **Push Mode (Proactive Intelligence)**:
   - **Windowed Digest**: Configurable time window (24h, 3d, 7d). Routine regulatory filings (ESOPs, postal ballots, routine voting results) are automatically collapsed into a secondary view, elevating high-impact filings.
   - **17-Category Taxonomical Classifier**: Maps raw exchange filings into the exact categories specified in the ENAM reference manual (`results`, `management_change`, `M&A`, `credit_rating`, `litigation`, `capex`, `fund_raise`, etc.) with 3-tier severity ranking.
   - **Triggered Threshold Alerts**: Configurable sliders for volume spikes ($> 2.0\times$ 20-day moving average) and material price swings ($\pm 3\%$) evaluated against live EOD market data.
   - **Deep Push Enrichments**:
     - *Quarterly Results*: Instant extraction of headline metrics — **Revenue, EBITDA, PBT, and PAT** — accompanied by both **QoQ** and **YoY** percentage variations and margin expansion/compression commentary.
     - *Management Transitions*: Beyond announcing a resignation or appointment, FINN enriches incoming C-suite executives with their career pedigree, former leadership roles, and operational track record.

2. **Pull Mode (Deep Primary Research Engine)**:
   - **Strict Primary Grounding**: Adheres strictly to the discipline that differentiated signal lives exclusively in primary disclosures (Annual Reports, Quarterly Concall Transcripts, and Regulatory Disclosures) — explicitly excluding broker notes, media narratives, and LLM hallucination.
   - **The 8-Module Analytical Suite**:
     1. *Business Snapshot*: Core operations, operating segments, and competitive moat.
     2. *Financial Snapshot*: Headline TTM numbers, margins, ROCE, ROE, and valuation multiples.
     3. *Trajectory*: Multi-year revenue/PAT CAGR and margin expansion vs. compression.
     4. *Balance Sheet & Leverage*: Debt/Equity, working-capital cycle days, and funding structure.
     5. *Cash Quality*: Cash conversion ratio ($\text{CFO} / \text{PAT}$) and Free Cash Flow generation.
     6. **The Flagship "Narrative vs. Numbers" Diff**: Compares management forward guidance against actual delivered reality across 4 consecutive quarters, scoring alignment and highlighting divergence.
     7. **Forensic & Footnote Auditor**: Statutory audit of Note 34 (Related Party Transactions), Auditor qualification check, and Working Capital elongation.
     8. *Forward Guidance Targets*: Explicit stated targets on sales growth, margins, and capex.
     9. *Bull vs. Bear Thesis*: Tight, high-conviction cases for both sides.
   - **Universal Generalization**: Operates dynamically on any NSE/BSE ticker, not just the demo portfolio.

3. **Autonomous AI Features (Gemini 2.0 & Primary LLM Router)**:
   - **60-Second AI Morning Briefing Player**: Live speech-synthesized audio player (using native Web Speech API + waveform animation) delivering an executive 60-second morning audio wrap of Tier-1 disclosures and market breakouts before the bell.
   - **FINN Interactive Primary Copilot**: Interactive dialogue interface dedicated to concalls and filings with 1-click forensic query pills (Guidance Audit, Note 34 Footnote scan, Cash Conversion CFO/PAT check, Capex timelines).
   - **Groww-Style Modern Fintech UI**: Mobile-first design inspired by Groww (clean white `#FFFFFF` canvas, Groww Green `#00D09C` / `#00875A`, Plus Jakarta Sans typography, hairline dividers, zero boxy card clutter).

---

## 2. Key Decisions & Architectural Trade-offs

| Decision | What We Chose | Trade-off / Rationale |
| :--- | :--- | :--- |
| **Model Routing Strategy** | Multi-Tiered LLM Routing + Deterministic Fallback | High-volume classification and table extraction use lightweight models (`Gemini 2.0 Flash` / `Groq Llama 3.3 70B`), reserving deep reasoning models only for the "Narrative vs. Numbers" synthesis. If no API key is provided, deterministic rules and structured caches ensure 100% uptime with zero crashing. |
| **Strict Primary Grounding** | Primary Filings Only (No Web Sentiment / Broker Notes) | Secondary news and broker commentaries introduce market noise and herd biases. By grounding solely in primary investor disclosures (Screener.in / BSE / NSE), FINN guarantees high conviction and auditability. |
| **Mobile-First UX** | Dedicated Mobile Container + Native Viewport Toggle | Public-markets investors monitor portfolios on the go. Inspired by platforms like Quartr and Koyfin, we prioritized vertical density, bottom navigation, collapsible routine rows, and instant tab switching over bloated desktop dashboards. |
| **Caching Layer** | 10-Minute Disk & Memory Cache | Market data and LLM synthesis are cached locally to minimize redundant network calls, preserve free-tier rate limits, and provide instant sub-50ms UI transitions. |

---

## 3. What Was Deliberately Left Out

To adhere to the core principle **"Thin-but-working beats broad-but-broken"**, we deliberately excluded several secondary features:
1. **Intraday Tick-by-Tick Streaming**: Institutional public-markets investors focus on high-conviction fundamental shifts, not high-frequency order book noise. We focused on End-of-Day (EOD) closing data and 20-day volume moving averages.
2. **Social Sentiment & Twitter Scrapers**: Sentiment analysis on financial Twitter/Reddit is noisy and frequently manipulated by retail momentum. We excluded all secondary chatter to maintain institutional signal integrity.
3. **Complex Portfolio Accounting / Tax Ledgers**: FINN is an intelligence and research copilot, not a custodial brokerage or back-office accounting engine.

---

## 4. Where We Would Take It Next

Given more time and production infrastructure, the next evolution of FINN would incorporate:
1. **Audio Transcript Sync (Quartr-style)**: Synchronized audio playback with interactive transcript scrubbing, jumping directly to analyst Q&A pressure points.
2. **Automated Red-Flag Scanner on Notes to Accounts**: Deep parsing of Contingent Liabilities, Related-Party Transactions (RPTs), and Auditor Qualifications from Annual Report footnotes.
3. **Multi-Agent Management Style Profiler**: Tracking executive linguistic markers across 5+ years of calls to detect defensive tone shifts, evasive answers, and sudden guidance changes.
4. **Push Notification Webhooks (Telegram / WhatsApp / Slack)**: Real-time mobile webhook delivery when an investor's custom threshold is breached after market close.
