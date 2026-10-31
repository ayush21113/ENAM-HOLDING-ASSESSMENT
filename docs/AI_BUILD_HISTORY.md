# FINN: AI Build History & Agent Trajectory Log

**Candidate Assessment**: ENAM Holdings AI Engineer Build Challenge  
**Agent Architecture**: Antigravity Pair-Programming Agent (Advanced Agentic Coding)  
**Tools Used**: Antigravity IDE, Google Gemini 2.0 / 3.8 Reasoning, Vite, FastAPI, TypeScript, Tailwind CSS

---

## Session 1: Requirements Deconstruction & Domain Mapping
### User Prompt:
> "ANALYSE THE PS IN THE GIVEN PDF"

### Reasoning & Exploration:
- Located and deeply extracted two documents in the workspace:
  - `1. ENAM_AI_Engineer_Build_Challenge_Main.pdf` (The Core Problem Statement)
  - `2. ENAM_AI_Engineer_Build_Challenge_Reference.pdf` (Announcement Categories & Financial Glossary)
- Analyzed the investment firm's lean, high-conviction ethos:
  - The scarce skill in modern equity markets is **not aggregation, but filtering**.
  - Identified the two distinct interaction modalities:
    1. **Push Mode**: Windowed digest across 15–20 NSE/BSE stocks, configurable threshold alert triggers (price $\pm X\%$, volume $>2\times$), and deep enrichments for Quarterly Results (Revenue, EBITDA, PBT, PAT with QoQ and YoY) and Management Transitions (career pedigree, past firms).
    2. **Pull Mode**: Strict primary-source grounding (Annual Reports + Concall Transcripts; no secondary noise/broker notes), 8 distinct analytical modules, and the marquee **"Narrative vs. Numbers"** module auditing management guidance vs. actual delivered results across 4 quarters.
  - Identified key evaluation criteria: **"Thin-but-working beats broad-but-broken"**, **"No AI Slop"**, Smart Model Routing, and Mobile-First UX.

---

## Session 2: System Architecture & Execution Planning
### User Prompt:
> "OK START WORKING ON IT AND MAKE SURE ALL DELIVERABLES ARE COMPLETED MAKE SURE TO BE TOP IN TERMS OF QUALITY AS HERE PRECISION MATTERS . ALSO FOR DESIGN GO TRHOUGH THE WEBSITES USED FOR SIMILAR PLATFORMS FOR FRONTEND AND KEEP IT SIMPLE"

### Design Research & Inspiration:
- Queried industry-standard platforms (Quartr, Koyfin, Bloomberg Mobile, Screener.in, Tijori Finance):
  - **Quartr**: Clean card feeds, bottom navigation bar, primary audio/transcript synchronization.
  - **Koyfin / Bloomberg**: High data density, negative/positive color coding (emerald-400 / rose-400), no gratuitous empty space, tabbed financial breakdowns.
  - **Screener.in**: Audit trail of primary filings (Annual Reports, Concall PDFs).
- Formulated system layout:
  - **Backend**: FastAPI with asynchronous endpoints, `yfinance` integration for EOD prices and 20-day volume moving averages, 17-category announcement classifier, and dual-layer cache.
  - **Frontend**: Mobile-first responsive client built with React, Vite, TypeScript, Tailwind CSS, and Lucide Icons. Features an integrated desktop simulated mobile frame toggle for evaluators.
  - **Smart Model Router**: Multi-tiered architecture supporting low-cost/free tier bulk extraction (Gemini 2.0 Flash / Groq Llama 3.3) and deep reasoning models, paired with deterministic local heuristics for 100% test-time reliability.

---

## Session 3: Backend Implementation & Engineering Fixes
### Actions:
- Implemented `backend/app/config.py` with an 18-stock high-conviction Indian portfolio spanning large-cap cyclicals (`LT.NS`, `TATAMOTORS.NS`), high-growth retail (`TRENT.NS`, `TITAN.NS`), financials (`HDFCBANK.NS`, `CDSL.NS`), EMS (`DIXON.NS`, `KAYNES.NS`), defense (`HAL.NS`), and quick commerce (`ZOMATO.NS`).
- Implemented `backend/app/models.py` with typed Pydantic models for Announcements, EnrichedQuarterlyResult, EnrichedManagementChange, StockEOD, TriggeredAlert, and ResearchPullResponse.
- Implemented `backend/app/services/market_data.py`: Fetches EOD prices, computes 20-day moving average volume, calculates volume breakout multiples, and evaluates price swings against configurable thresholds.
- Implemented `backend/app/services/announcements.py`: 17-category taxonomy with 3-tier prioritization.
- Implemented `backend/app/services/primary_research.py`: Deep primary datasets for core portfolio tickers and dynamic generalization engine for any arbitrary NSE ticker.
- Implemented `backend/app/services/llm_router.py`: Dynamic routing and runtime key injection.

### Debugging & Precision Fixes:
1. **Windows CRT Epoch Error**:
   - *Bug*: In `announcements.py`, sorting announcements using `datetime.strptime(a.timestamp, "%d %b %H:%M").timestamp()` threw `OSError: [Errno 22] Invalid argument` on Windows because dates without a year default to 1900 (pre-1970 UNIX epoch).
   - *Fix*: Refactored sort comparator to sort directly by `(ann.tier, hours_ago)`, ensuring robust cross-platform execution.
2. **PowerShell Web Request Execution**:
   - *Bug*: PowerShell 5.1 `Invoke-WebRequest` defaulted to Internet Explorer DOM parsing, stalling on headless calls.
   - *Fix*: Verified with `-UseBasicParsing` and native JSON deserialization.

---

## Session 4: Frontend Implementation & Strict TypeScript Verification
### Actions:
- Built modern components:
  - `Header.tsx`: Brand pill, live market indicator, active routing mode badge, triggered alert indicator, and simulated mobile frame toggle.
  - `Navigation.tsx`: Native mobile bottom tab bar (Push Feed, Portfolio, Research Pull, Alerts).
  - `FeedPush.tsx`: Windowed digest selector (24h, 3d, 7d), category filter pills, routine paperwork collapse switch, Enriched Quarterly Results cards (Revenue, EBITDA, PBT, PAT + QoQ/YoY + margin commentary), and Enriched Management Transition cards.
  - `ResearchPull.tsx`: Universal ticker search, primary sources audit links, and the 8 analytical modules featuring the **Narrative vs. Numbers** 4-quarter promise vs. delivered audit table.
  - `PortfolioView.tsx`: Sector filtering, real-time prices, 20d volume multiple badges, and one-tap deep research.
  - `AlertSettingsModal.tsx`: Real-time sliders for price move ($\pm X\%$) and volume multiplier ($> Y\times$), API key input modal for Gemini/Groq/OpenAI, and active alerts overview.

### Debugging & Compilation Fixes:
- Resolved Vite template TypeScript strict flags (`verbatimModuleSyntax`, `allowImportingTsExtensions`) to ensure production builds run cleanly with zero errors.
- Built unified static mount in FastAPI so a single process serves both the backend API and the responsive mobile frontend at `http://localhost:8000`.

---

## Session 5: Deliverables Packaging & Verification
- Produced complete documentation suite:
  - `docs/COVERING_NOTE.md`: Comprehensive submission note addressing architecture, trade-offs, omissions, and future roadmap.
  - `docs/EMAIL_SUBMISSION.md`: Ready-to-send template for `assessment@enam.com`.
  - `docs/ARCHITECTURE.md`: Deep technical design document.
  - `README.md`: Setup instructions, screenshots layout, and evaluation mapping.

---

## 6. Iteration 5: Groww App Overhaul & Advanced AI Gemini Features

### User Feedback:
- "bhai ye cards wala format use mt kr see these for references"
- "grow app ka ui dek for reference"
- "change the font yrr its too classy"
- "too simple bhai add more features maybe ai tools too if the ps permits use gemini api"

### Prompt & Execution:
1. **Groww Design System & Typography**:
   - Replaced classy serif font with **Plus Jakarta Sans** (clean, crisp, modern fintech standard).
   - Removed awkward colored box outlines on tags (`credit rating`, `capex`), replacing them with subtle clean text and metadata dots (`Credit rating • 30 Oct, 9:45 PM • BSE`).
   - Clean white canvas (`#FFFFFF` / `#F5F6F8`), Groww Green `#00D09C` / `#00875A` and Groww Red `#EB5B3C`.
   - Hairline dividers (`divide-y divide-[#F5F6F8]`), eliminating heavy boxy card borders.
2. **AI Tool 1: 60-Second AI Morning Audio Briefing**:
   - Synthesizes today's Tier-1 filings and volume breakouts into a 60-second executive audio script before market open.
   - Built interactive audio player with waveform animation and Web Speech API audio playback (`window.speechSynthesis`).
3. **AI Tool 2: FINN Interactive Copilot**:
   - Dedicated AI navigation tab for interactive concall/filing Q&A.
   - Grounded strictly in primary disclosures (Zero Hallucination).
   - 1-click forensic query pills: `🎯 Audit Management Guidance`, `⚠️ Scan Red Flags`, `💰 CFO vs PAT Cash Conversion`, `🏭 Capex Timelines`, `👔 Leadership Pedigree`.
4. **AI Tool 3: Statutory Footnote & Governance Auditor**:
   - Added forensic module to Research Pull auditing Note 34 (Related Party Transactions), Contingent Liabilities / Net Worth ratio, and Statutory Auditor Qualifications.
5. **Figma Code Layer Synchronization**:
   - Updated Figma Code Layer (`nodeId: 3:3`) at `https://www.figma.com/design/jygIJOszMFKW9UZqHhDHrk?node-id=3-3&autoplay-code-preview=3-3`.

