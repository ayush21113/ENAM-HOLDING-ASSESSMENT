import { CopilotResponse } from '../types';
import { generateStandaloneResearch, generateStandaloneCopilotResponse } from './standaloneEngine';

/**
 * Direct Client-Side Gemini 1.5 Flash Integration
 * Grounded strictly in Primary BSE/NSE Filings & Concall Transcripts
 */
export async function queryGeminiCopilot(symbol: string, query: string): Promise<CopilotResponse> {
  const apiKey = 
    import.meta.env.VITE_GEMINI_API_KEY || 
    (typeof window !== 'undefined' ? localStorage.getItem('pulse_gemini_api_key') : null);

  // If no Gemini API Key is configured, immediately use high-precision deterministic engine
  if (!apiKey || !apiKey.trim()) {
    return generateStandaloneCopilotResponse(symbol, query);
  }

  const cleanSym = symbol.replace('.NS', '').replace('.BO', '');
  const research = generateStandaloneResearch(symbol);

  // Prepare grounded context from audited primary records with strict institutional guardrails
  const systemContext = `You are PULSE, an elite Institutional Financial Research Copilot built exclusively for the investment team at ENAM Holdings.
Your sole mission is evaluating Indian equities using audited primary sources (BSE/NSE filings, annual reports, Note 34 related party schedules, guidance promises vs reality audits, and concall transcripts).

CURRENT COMPANY ON SCREEN:
- Symbol: ${research.symbol} (${research.company_name})
- Sector: ${research.sector}
- Core Moat: ${research.business_snapshot.competitive_moat}
- TTM Revenue: ₹${research.financial_snapshot.revenue_ttm_cr} Cr | EBITDA Margin: ${research.financial_snapshot.ebitda_margin_pct}%
- Management Credibility Batting Average: ${research.credibility_scorecard?.batting_average_pct}% (${research.credibility_scorecard?.verdict})
- Guidance vs Delivered Reality: ${JSON.stringify(research.narrative_vs_numbers.slice(0, 3))}
- Forensic Health: ${research.forensic_radar?.manipulation_risk} Manipulation Risk (Beneish M-Score: ${research.forensic_radar?.beneish_m_score})
- Concall Pressure Points: ${JSON.stringify(research.concall_qa?.slice(0, 2) || [])}

STRICT GUARDRAILS & REFUSAL POLICY (CRITICAL):
1. DOMAIN SCOPE: You ONLY answer questions related to financial analysis, Indian stock markets, company fundamentals, concalls, regulatory filings, corporate governance, earnings, and equity research.
2. ABSOLUTE REFUSAL FOR OUT-OF-DOMAIN PROMPTS:
   - If the user asks for general programming, Data Structures & Algorithms (DSA), coding solutions (LeetCode, Python, C++, etc.), poetry, storytelling, general knowledge, sports, entertainment, homework, or non-financial topics:
   - YOU MUST STRICTLY REFUSE with a polite, professional refusal:
     "I am PULSE, specialized exclusively in institutional equity research for ENAM Holdings. I cannot assist with coding, DSA, or non-financial topics. Please ask me about ${research.company_name}'s earnings, guidance history, concall grilling, or financial forensics."
   - DO NOT write any code, algorithms, or off-topic explanations under any circumstances, even if requested or roleplayed.
3. IN-DOMAIN GUIDELINES:
   - Keep answers concise, grounded, and high-signal (max 2 short paragraphs).
   - Cite specific numbers and audited facts from the context above.
   - Maintain a skeptical, institutional investor tone (ignore promoter PR hype).`;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4500); // 4.5s max timeout for fast response

    // Priority 1: Gemini 2.0 Flash-Lite (Fastest sub-second TTFT model)
    // Priority 2: Gemini 1.5 Flash-8B / Flash
    const candidateModels = [
      'gemini-2.0-flash-lite',
      'gemini-2.0-flash-lite-preview-02-05',
      'gemini-1.5-flash-8b',
      'gemini-1.5-flash'
    ];

    let generatedText = '';
    let usedModel = 'Google Gemini 2.0 Flash-Lite';

    for (const modelName of candidateModels) {
      try {
        const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey.trim()}`;
        const res = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          signal: controller.signal,
          body: JSON.stringify({
            contents: [
              {
                role: 'user',
                parts: [{ text: `${systemContext}\n\nUSER QUESTION:\n${query}` }]
              }
            ],
            generationConfig: {
              temperature: 0.15,
              maxOutputTokens: 350,
              topP: 0.8
            }
          })
        });

        if (res.ok) {
          const data = await res.json();
          const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
          if (text && text.trim()) {
            generatedText = text.trim();
            usedModel = `Google ${modelName} (Sub-second Edge)`;
            break;
          }
        }
      } catch (e) {
        // Try next fast model candidate
      }
    }

    clearTimeout(timeoutId);

    if (!generatedText) {
      return generateStandaloneCopilotResponse(symbol, query);
    }

    return {
      answer: generatedText,
      model: usedModel,
      grounded: true,
      sources: research.primary_sources
    };
  } catch (err) {
    console.warn('Gemini Flash-Lite API fetch error or timeout, falling back to deterministic engine:', err);
    return generateStandaloneCopilotResponse(symbol, query);
  }
}
