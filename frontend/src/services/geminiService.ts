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
    const timeoutId = setTimeout(() => controller.abort(), 6500); // 6.5s timeout

    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey.trim()}`;

    const res = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      signal: controller.signal,
      body: JSON.stringify({
        contents: [
          {
            role: 'user',
            parts: [
              { text: `${systemContext}\n\nUSER QUESTION:\n${query}` }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.2,
          maxOutputTokens: 450,
          topP: 0.8
        }
      })
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      console.warn('Gemini API call failed with status', res.status);
      return generateStandaloneCopilotResponse(symbol, query);
    }

    const data = await res.json();
    const generatedText = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!generatedText || !generatedText.trim()) {
      return generateStandaloneCopilotResponse(symbol, query);
    }

    return {
      answer: generatedText.trim(),
      model: "Google Gemini 1.5 Flash (Grounded in Primary BSE/NSE Filings)",
      grounded: true,
      sources: research.primary_sources
    };
  } catch (err) {
    console.warn('Gemini API fetch error or timeout, falling back to deterministic engine:', err);
    return generateStandaloneCopilotResponse(symbol, query);
  }
}
