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

  // Prepare grounded context from audited primary records
  const systemContext = `You are PULSE, an elite Institutional Financial Research Copilot at ENAM Holdings.
You evaluate Indian equities strictly based on primary sources (BSE/NSE filings, audited annual reports, Note 34 related party schedules, and concall Q&A transcripts).

COMPANY CONTEXT:
- Symbol: ${research.symbol} (${research.company_name})
- Sector: ${research.sector}
- Core Business Moat: ${research.business_snapshot.competitive_moat}
- TTM Revenue: ₹${research.financial_snapshot.revenue_ttm_cr} Cr | EBITDA Margin: ${research.financial_snapshot.ebitda_margin_pct}%
- Management Credibility Batting Average: ${research.credibility_scorecard?.batting_average_pct}% (${research.credibility_scorecard?.verdict})
- Guidance Audit History: ${JSON.stringify(research.narrative_vs_numbers.slice(0, 3))}
- Forensic Health: ${research.forensic_radar?.manipulation_risk} Manipulation Risk (Beneish M-Score: ${research.forensic_radar?.beneish_m_score})
- Concall Analyst Pressure Points: ${JSON.stringify(research.concall_qa?.slice(0, 2) || [])}

INSTRUCTIONS:
- Answer the user's question directly, concisely, and insightfully. Max 2-3 short paragraphs.
- Cite specific numbers, quarters, and management statements from the context above.
- Maintain an institutional investment analyst tone (objective, skeptical of promoter hype).
- Never invent ungrounded data. If unsure, state what is in the filings.`;

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
