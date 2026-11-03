# Email Submission for ENAM Holdings

**To**: `assessment@enam.com`  
**Subject**: `ENAM - IIT screening - 2027`  

---

### Email Body (Copy & Paste Ready):

Dear ENAM Holdings Investment & Engineering Team,

Please find my submission for the **ENAM AI Engineer Build Challenge — PULSE: Real-Time Mobile Investment Intelligence Agent**.

> **Project Overview**: PULSE is an institutional mobile-first investment intelligence solution designed for high-conviction portfolio tracking. It operates in **Push Mode** (filtering noise from 28 companies across 17 regulatory filing categories and alerting on price/volume anomalies) and **Pull Mode** (performing primary-source fundamental research across ENAM’s analytical dimensions, highlighted by our 4-quarter **Management Guidance Batting Average**, concall analyst grilling analysis in **The Hot Seat**, **Beneish M-Score forensics**, and an **Edge AI Copilot**).

---

### Key Review Links:

1. 🌐 **Live Web Application (Mobile Optimized)**:  
   👉 **https://enam-holding-assessment-frontend.vercel.app**  
   *(Runs on Vercel Edge with zero setup. Fully testable immediately on any mobile phone or desktop browser).*

2. 💻 **GitHub Repository**:  
   👉 **https://github.com/ayush21113/ENAM-HOLDING-ASSESSMENT**  
   *(Clean modular architecture: `/frontend` React/TypeScript + `/backend` FastAPI/Python + `/docs`).*

3. 📄 **Comprehensive Covering Note**:  
   Available in repository at `docs/COVERING_NOTE.md` detailing architectural trade-offs, primary source grounding decisions, and scaling roadmap.

---

### Summary of What Was Built:

* **Push Mode (Noise-Filtered Proactive Digest)**: 
  * Prioritized **Windowed Digest (24h, 3d, 7d)** across a **28-company high-conviction portfolio** (Large to Mid-caps across Auto, Retail, EMS, Defence, IT, Banking, FMCG).
  * Automatically collapses routine 80% compliance paperwork (ESOPs, notices) and elevates high-conviction catalysts based on the **17 regulatory announcement categories**.
  * **Automated Contextual Extraction**: Extracts quarterly headline financials (**Revenue, EBITDA, PBT, PAT** with **QoQ & YoY deltas**) and C-suite career pedigree bios.
  * **Configurable EOD Threshold Alerts**: Alerts on $\pm 3\%$ price moves and $> 2.0\times$ volume breakouts.

* **Pull Mode (Deep Primary Research Engine)**:
  * Strict primary-source grounding in BSE/NSE filings, audited annual reports, and concall transcripts (zero secondary media commentary or broker notes).
  * **8 Core Analytical Modules**: Business Snapshot, Financials TTM, 3-Yr Trajectory, Balance Sheet, Cash Quality (CFO/PAT ratio), Narrative vs. Numbers Audit, Forward Guidance, and Bull vs. Bear Thesis.
  * **Flagship USP — Narrative vs. Numbers Guidance Audit**: Audits management promises from 4 quarters ago against actual numbers delivered, calculating an institutional **Batting Average Scorecard** (e.g. Tata Motors at 50% credibility with Novelis supply chain divergence).
  * **Concall Q&A Hot Seat**: Isolates unscripted analyst grilling from PR remarks, with tone classification (`DIRECT`, `CAUTIOUS`, `EVASIVE`).
  * **Forensic Radar**: Beneish M-Score manipulation risk calculation and Note 34 Related Party Transaction audit.

* **Autonomous Edge AI & Interaction Design**:
  * **Pre-Market Investment Committee (IC) Morning Memo**: 1-click institutional morning brief with Markdown copy & export.
  * **60-Second Audio Morning Briefing**: Native audio player with dynamic waveform.
  * **Ask Pulse Copilot**: Direct integration with **Google Gemini 2.0 Flash-Lite** with strict institutional guardrails (rejects off-topic coding/DSA) and zero-downtime deterministic fallback.
  * **Mobile-First UX**: Clean, Groww/Linear-inspired minimal interface designed for one-handed mobile navigation without horizontal tables or cluttered cards.

Looking forward to discussing the architecture and investment philosophy further.

Warm regards,  
**Ayush**  
IIT Kanpur — Batch of 2027  
Email: workayushiitk23@gmail.com  
GitHub: https://github.com/ayush21113/ENAM-HOLDING-ASSESSMENT
