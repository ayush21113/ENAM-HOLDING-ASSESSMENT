# Email Submission Template

**To**: `assessment@enam.com`  
**Subject**: `ENAM - IIT screening - 2027`  

---

### Body:

Dear ENAM Holdings Investment & Engineering Team,

Please find my submission for the **ENAM AI Engineer Build Challenge — FINN: Financial Investment Agent**.

> **Project Positioning**: FINN is a mobile-first investment intelligence agent that filters a high-conviction portfolio’s regulatory and EOD market signals in Push mode, and performs primary-source fundamental research across ENAM’s eight analytical dimensions in Pull mode, augmented by a forensic auditor, management-guidance tracking, AI copilot, and cost-aware model routing.

---

### Key Review Links:
1. **Live Mobile Prototype (Figma Runnable Layer)**:  
   👉 **[Launch Interactive Mobile Prototype on Figma](https://www.figma.com/design/jygIJOszMFKW9UZqHhDHrk?node-id=15-3&autoplay-code-preview=15-3)**  
   *(Runs the full interactive web application directly inside Figma in a mobile viewport with zero setup required — testable immediately on desktop or mobile).*
2. **Live Public Web App (Phone Accessible)**:  
   👉 **https://fdf24f6d5d3b18.lhr.life**  
   *(Direct public HTTPS URL to the running FastAPI + React application, testable on any mobile phone or incognito browser).*
3. **GitHub Repository**:  
   👉 `https://github.com/ayush-enam/FINN-investment-agent` *(or attach local repo bundle)*
4. **AI Build History & Raw Transcripts**:  
   Included in repository at `docs/AI_BUILD_HISTORY.md` and `docs/raw_transcript_summary.md`.
5. **Covering Note**:  
   Included in repository at `docs/COVERING_NOTE.md` and summarized below.

---

### Summary of What Was Built:

* **Push Mode (Proactive Signal Filtering)**: 
  * Prioritized **Windowed Digest (24h, 3d, 7d)** across an 18-company high-conviction portfolio spanning diverse Indian sectors (Large-cap to high-growth Mid-cap).
  * Routine administrative paperwork (ESOPs, postal ballots) is collapsible, elevating material catalysts based on the **17 corporate announcement categories** defined in your reference guide (including `press_release`, `results`, `management_change`, `M&A`, `capex`, `credit_rating`, etc.).
  * **Automated Contextual Enrichment**: Full quarterly headline financial extractions (**Revenue, EBITDA, PBT, PAT** with **QoQ and YoY** calculations) and incoming C-suite executive career background bios.
  * **Configurable EOD Threshold Monitoring**: Evaluates End-of-Day price swings ($\pm X\%$) and 20-day volume breakouts ($> 2.0\times$ average) calculated against the latest EOD market data.

* **Pull Mode (Deep Primary Research Engine)**:
  * Strict primary-source grounding: Source discovery may use Screener/BSE/NSE/company IR pages, while analytical claims are grounded in underlying company filings, annual reports, and concall transcripts (no broker notes or media commentary).
  * **8 Core ENAM Research Modules**:
    1. Business Snapshot (core operations, segments, competitive moat)
    2. Financial Snapshot (headline TTM numbers, margins, ROCE, ROE, valuation multiples)
    3. Trajectory (3-year revenue/PAT CAGR, margin trends)
    4. Balance Sheet (debt structure, D/E, working capital days)
    5. Cash Quality (CFO vs. PAT, Cash Conversion ratio, Free Cash Flow)
    6. **Flagship "Narrative vs. Numbers" Diff** (audits management forward guidance across 4 consecutive quarters against actual delivered reality with divergence scoring)
    7. Forward Guidance Targets (sales growth, capex, and margin targets)
    8. Bull vs. Bear Thesis (conviction drivers vs. downside risks)
  * **+ Added FINN Institutional Extensions (Benchmarked against Global Best Practices)**:
    * **Concall Q&A Stress-Test ("The Hot Seat")**: Isolates unscripted analyst Q&A pressure points from scripted PR, categorizing tone (`DIRECT`, `CAUTIOUS`, `EVASIVE`) with institutional takeaways (AlphaSense/Quartr standard).
    * **Management Guidance Batting Average**: 4-quarter quantitative credibility scorecard benchmarking historical guidance delivery.
    * **Institutional Catalyst Calendar**: Upcoming concall schedules, dial-in numbers, and watchpoints.
    * **Forensic Auditor**: Note 34 (Related Party Transactions) scan, Statutory Auditor qualifications, and Contingent Liabilities monitor.
    * **Universal Any-Ticker Generalization**: Dynamically analyzes any user-entered NSE/BSE ticker beyond the mock portfolio.

* **Autonomous AI Intelligence & Interaction Design**:
  * **Pre-Market Investment Committee (IC) Morning Memo Generator**: Synthesizes an executive institutional 1-page IC brief from today's filings, volume anomalies, and accounting flags in clean Markdown with 1-click clipboard copy and `.md` export.
  * **Semantic Concall & Disclosure Diff ("What Changed?")**: Tracks sequential linguistic shifts between quarters, highlighting softened promises, de-risked commitments, and omitted risks.
  * **Beneish M-Score & Forensic Earnings Quality Radar**: Computes DSRI, AQI, DEPI, and TATA accruals to establish an institutional manipulation risk rating (< -2.22 safe threshold).
  * **60-Second AI Morning Audio Briefing**: Executive pre-market audio briefing player using the browser's native Web Speech API and dynamic waveform visualization.
  * **FINN Interactive Primary Copilot**: Interactive dialogue interface dedicated to concalls and filings with 1-click forensic query pills (Guidance Audit, Note 34 Footnote scan, Cash Conversion CFO/PAT check, Capex timelines).
  * **Cost-Conscious Model Routing**: Multi-tiered routing supporting Google Gemini 2.0 Flash (`google-genai`), Groq Llama 3.3 70B, and OpenAI, paired with a deterministic heuristic fallback to ensure the evaluation prototype remains functional without an API key.
  * **Groww-Style Modern Fintech UI**: Mobile-first design inspired by Groww (clean white `#FFFFFF` canvas, Groww Green `#00D09C` / `#00875A`, Plus Jakarta Sans typography, hairline dividers, zero boxy card clutter).

Please find attached the covering note detailing architectural decisions, deliberate trade-offs, omissions, and future directions, alongside the complete AI build history.

Looking forward to discussing the architecture and investment philosophy further.

Warm regards,  
[Your Name]  
IIT [Your Campus] — Batch of 2027  
[Your Phone Number] | [Your LinkedIn URL]
