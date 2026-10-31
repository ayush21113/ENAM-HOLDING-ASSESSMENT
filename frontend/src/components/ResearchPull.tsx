import React, { useState, useEffect } from 'react';
import { ResearchPullResponse } from '../types';
import { api } from '../services/api';
import { Search, FileCheck, ArrowUpRight, BookOpen, AlertCircle } from 'lucide-react';

interface ResearchPullProps {
  initialSymbol?: string;
  onBackToFeed?: () => void;
}

export const ResearchPull: React.FC<ResearchPullProps> = ({
  initialSymbol = 'TRENT.NS',
}) => {
  const [tickerInput, setTickerInput] = useState(initialSymbol);
  const [activeTicker, setActiveTicker] = useState(initialSymbol);
  const [data, setData] = useState<ResearchPullResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeModule, setActiveModule] = useState<string>('narrative');

  useEffect(() => {
    loadResearch(activeTicker);
  }, [activeTicker]);

  const loadResearch = async (symbol: string) => {
    setLoading(true);
    setError(null);
    try {
      const resp = await api.getResearchPull(symbol);
      setData(resp);
    } catch (err: any) {
      setError(err.message || 'Failed to load primary research');
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (tickerInput.trim()) {
      setActiveTicker(tickerInput.trim().toUpperCase());
    }
  };

  const quickTickers = ['TRENT.NS', 'DIXON.NS', 'TATAMOTORS.NS', 'RELIANCE.NS', 'HDFCBANK.NS', 'INFY.NS'];

  const modules = [
    { id: 'narrative', label: 'Narrative vs numbers', highlight: true },
    { id: 'business', label: 'Business & segments' },
    { id: 'financials', label: 'Financial snapshot' },
    { id: 'trajectory', label: 'Multi-year trajectory' },
    { id: 'balance_sheet', label: 'Balance sheet' },
    { id: 'cash_quality', label: 'Cash quality' },
    { id: 'guidance', label: 'Forward guidance' },
    { id: 'bull_bear', label: 'Bull vs bear' },
  ];

  const getVerdictClass = (verdict: string) => {
    switch (verdict) {
      case 'BEAT':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      case 'MET':
        return 'bg-blue-50 text-blue-800 border-blue-200';
      case 'MISSED':
        return 'bg-red-50 text-red-800 border-red-200';
      case 'DIVERGED':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="space-y-4 pb-24">
      {/* Search Header */}
      <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-card space-y-3">
        <form onSubmit={handleSearchSubmit} className="relative flex items-center">
          <Search className="w-4 h-4 absolute left-3.5 text-gray-400" />
          <input
            type="text"
            value={tickerInput}
            onChange={(e) => setTickerInput(e.target.value)}
            placeholder="Search any NSE/BSE ticker (e.g. RELIANCE, DIXON, TRENT)..."
            className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-10 pr-24 py-2.5 text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:bg-white focus:border-blue-800 transition font-mono"
          />
          <button
            type="submit"
            className="absolute right-1.5 px-3 py-1.5 bg-gray-900 hover:bg-gray-800 text-white rounded-md text-xs font-semibold transition"
          >
            Research
          </button>
        </form>

        {/* Quick Tickers */}
        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
          <span className="text-gray-400 font-medium">Quick:</span>
          {quickTickers.map((t) => (
            <button
              key={t}
              onClick={() => {
                setTickerInput(t);
                setActiveTicker(t);
              }}
              className={`px-2.5 py-0.5 rounded border font-mono text-xs transition ${
                activeTicker === t
                  ? 'bg-blue-50 border-blue-300 text-blue-900 font-semibold'
                  : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="py-16 flex flex-col items-center justify-center space-y-2">
          <div className="w-5 h-5 border-2 border-blue-800 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xs text-gray-500 font-medium">Fetching primary disclosures (annual reports & concalls)...</p>
        </div>
      ) : error ? (
        <div className="bg-white border border-red-200 rounded-xl p-6 text-center space-y-2 shadow-card">
          <AlertCircle className="w-8 h-8 text-red-500 mx-auto" />
          <h3 className="text-sm font-semibold text-gray-900">Query notice</h3>
          <p className="text-xs text-red-700">{error}</p>
        </div>
      ) : data ? (
        <div className="space-y-4">
          {/* Company Banner */}
          <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-card">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center space-x-2">
                  <h2 className="text-lg font-bold text-gray-900 tracking-tight">{data.company_name}</h2>
                  <span className="text-xs font-mono px-2 py-0.5 bg-gray-100 text-gray-700 rounded border border-gray-200">
                    {data.symbol}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-0.5">{data.sector}</p>
              </div>

              <div className="text-right">
                <span className="text-xs text-emerald-800 font-medium bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded inline-flex items-center gap-1">
                  <FileCheck className="w-3.5 h-3.5" />
                  Primary sources grounded
                </span>
              </div>
            </div>

            {/* Primary Sources Audit Links */}
            <div className="mt-3 pt-3 border-t border-gray-100 flex flex-wrap items-center gap-2 text-xs text-gray-500">
              <span className="font-medium text-gray-600">Disclosures:</span>
              {data.primary_sources.map((src, i) => (
                <a
                  key={i}
                  href={src.url}
                  target="_blank"
                  rel="noreferrer"
                  className="bg-gray-50 border border-gray-200 hover:border-gray-300 text-gray-700 px-2.5 py-1 rounded inline-flex items-center gap-1 transition"
                >
                  <BookOpen className="w-3 h-3 text-blue-800" />
                  {src.title}
                  <ArrowUpRight className="w-3 h-3 opacity-50" />
                </a>
              ))}
            </div>
          </div>

          {/* Module Selector */}
          <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
            {modules.map((m) => (
              <button
                key={m.id}
                onClick={() => setActiveModule(m.id)}
                className={`px-3 py-1.5 rounded-lg whitespace-nowrap text-xs transition border font-medium flex items-center gap-1.5 ${
                  activeModule === m.id
                    ? 'bg-gray-900 text-white border-gray-900 shadow-subtle'
                    : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                }`}
              >
                <span>{m.label}</span>
                {m.highlight && (
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
                )}
              </button>
            ))}
          </div>

          {/* MODULE 1: NARRATIVE VS NUMBERS (HIGHLIGHT) */}
          {activeModule === 'narrative' && (
            <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-card space-y-4">
              <div className="border-b border-gray-100 pb-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-gray-900">Narrative vs. numbers audit</h3>
                  <span className="text-xs text-gray-500">Last 4 quarters</span>
                </div>
                <p className="text-xs text-gray-600 mt-1">
                  Cross-referencing executive commentary and guidance against actual financial results delivered.
                </p>
              </div>

              <div className="space-y-3">
                {data.narrative_vs_numbers.map((q, idx) => (
                  <div
                    key={idx}
                    className="bg-gray-50 border border-gray-200 rounded-lg p-3.5 space-y-2.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-gray-900 font-mono">{q.quarter}</span>
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded border ${getVerdictClass(q.verdict)}`}>
                        {q.verdict}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      {/* Promised */}
                      <div className="bg-white p-3 rounded border border-gray-200">
                        <div className="text-xs font-semibold text-gray-500">
                          Management guidance (Concall)
                        </div>
                        <p className="text-gray-800 mt-1 text-xs leading-relaxed">
                          "{q.management_guidance}"
                        </p>
                      </div>

                      {/* Delivered */}
                      <div className="bg-white p-3 rounded border border-gray-200">
                        <div className="text-xs font-semibold text-gray-900">
                          Actual delivered (Exchange results)
                        </div>
                        <p className="text-gray-800 mt-1 text-xs leading-relaxed">
                          {q.actual_delivered}
                        </p>
                      </div>
                    </div>

                    <div className="text-xs bg-white p-2.5 rounded border border-gray-200 text-gray-700">
                      <span className="font-semibold text-gray-900">Synthesis: </span>
                      {q.analyst_takeaway}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* MODULE 2: BUSINESS SNAPSHOT */}
          {activeModule === 'business' && (
            <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-card space-y-4">
              <div>
                <h3 className="text-sm font-bold text-gray-900">Business overview</h3>
                <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                  {data.business_snapshot.core_activity}
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="text-xs font-semibold text-gray-700">Operating segments</h4>
                <div className="space-y-2">
                  {data.business_snapshot.segments.map((seg, i) => (
                    <div key={i} className="bg-gray-50 border border-gray-200 p-3 rounded-lg flex items-center justify-between">
                      <div>
                        <div className="text-xs font-semibold text-gray-900">{seg.name}</div>
                        <div className="text-xs text-gray-500 mt-0.5">{seg.margin_profile}</div>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-mono font-bold text-gray-900">
                          {seg.revenue_share_pct}%
                        </span>
                        <div className="text-xs text-gray-500">Revenue mix</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-blue-50/50 border border-blue-200 p-3 rounded-lg">
                <h4 className="text-xs font-bold text-blue-900">Competitive moat</h4>
                <p className="text-xs text-gray-700 mt-1 leading-relaxed">
                  {data.business_snapshot.competitive_moat}
                </p>
              </div>
            </div>
          )}

          {/* MODULE 3: FINANCIAL SNAPSHOT */}
          {activeModule === 'financials' && (
            <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-card space-y-3">
              <h3 className="text-sm font-bold text-gray-900">Financial snapshot & headline ratios</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs">
                <div className="bg-gray-50 border border-gray-200 p-3 rounded-lg">
                  <div className="text-xs text-gray-500">Revenue (TTM)</div>
                  <div className="text-sm font-bold text-gray-900 font-mono mt-1">₹{data.financial_snapshot.revenue_ttm_cr.toLocaleString()} Cr</div>
                </div>
                <div className="bg-gray-50 border border-gray-200 p-3 rounded-lg">
                  <div className="text-xs text-gray-500">EBITDA margin</div>
                  <div className="text-sm font-bold text-emerald-800 font-mono mt-1">{data.financial_snapshot.ebitda_margin_pct}%</div>
                </div>
                <div className="bg-gray-50 border border-gray-200 p-3 rounded-lg">
                  <div className="text-xs text-gray-500">PAT (TTM)</div>
                  <div className="text-sm font-bold text-gray-900 font-mono mt-1">₹{data.financial_snapshot.pat_ttm_cr.toLocaleString()} Cr</div>
                </div>
                <div className="bg-gray-50 border border-gray-200 p-3 rounded-lg">
                  <div className="text-xs text-gray-500">ROCE</div>
                  <div className="text-sm font-bold text-blue-900 font-mono mt-1">{data.financial_snapshot.roce_pct}%</div>
                </div>
                <div className="bg-gray-50 border border-gray-200 p-3 rounded-lg">
                  <div className="text-xs text-gray-500">ROE</div>
                  <div className="text-sm font-bold text-blue-900 font-mono mt-1">{data.financial_snapshot.roe_pct}%</div>
                </div>
                <div className="bg-gray-50 border border-gray-200 p-3 rounded-lg">
                  <div className="text-xs text-gray-500">P/E ratio</div>
                  <div className="text-sm font-bold text-gray-900 font-mono mt-1">{data.financial_snapshot.pe_ratio}x</div>
                </div>
              </div>
            </div>
          )}

          {/* MODULE 4: TRAJECTORY */}
          {activeModule === 'trajectory' && (
            <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-card space-y-3">
              <h3 className="text-sm font-bold text-gray-900">Multi-year direction</h3>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-gray-50 border border-gray-200 p-3 rounded-lg">
                  <div className="text-xs text-gray-500">3-year sales CAGR</div>
                  <div className="text-base font-bold text-emerald-800 font-mono mt-1">+{data.trajectory['3yr_sales_cagr_pct']}%</div>
                </div>
                <div className="bg-gray-50 border border-gray-200 p-3 rounded-lg">
                  <div className="text-xs text-gray-500">3-year PAT CAGR</div>
                  <div className="text-base font-bold text-emerald-800 font-mono mt-1">+{data.trajectory['3yr_pat_cagr_pct']}%</div>
                </div>
              </div>
              <div className="bg-gray-50 border border-gray-200 p-3 rounded-lg space-y-1 text-xs">
                <div className="font-semibold text-gray-900">Margin trajectory:</div>
                <p className="text-gray-700 leading-relaxed">{data.trajectory.margin_trend}</p>
              </div>
              <div className="bg-gray-50 border border-gray-200 p-3 rounded-lg space-y-1 text-xs">
                <div className="font-semibold text-gray-900">Compressions & drags:</div>
                <p className="text-gray-700 leading-relaxed">{data.trajectory.compressions}</p>
              </div>
            </div>
          )}

          {/* MODULE 5: BALANCE SHEET */}
          {activeModule === 'balance_sheet' && (
            <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-card space-y-3">
              <h3 className="text-sm font-bold text-gray-900">Balance sheet & leverage</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs">
                <div className="bg-gray-50 border border-gray-200 p-3 rounded-lg">
                  <div className="text-xs text-gray-500">Total debt</div>
                  <div className="text-sm font-bold text-gray-900 font-mono mt-1">₹{data.balance_sheet.total_debt_cr} Cr</div>
                </div>
                <div className="bg-gray-50 border border-gray-200 p-3 rounded-lg">
                  <div className="text-xs text-gray-500">Cash & equivalents</div>
                  <div className="text-sm font-bold text-gray-900 font-mono mt-1">₹{data.balance_sheet.cash_equivalents_cr} Cr</div>
                </div>
                <div className="bg-gray-50 border border-gray-200 p-3 rounded-lg">
                  <div className="text-xs text-gray-500">Debt to equity</div>
                  <div className="text-sm font-bold text-gray-900 font-mono mt-1">{data.balance_sheet.debt_to_equity}</div>
                </div>
              </div>
              <div className="bg-gray-50 border border-gray-200 p-3 rounded-lg space-y-1 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-gray-900">Working capital cycle:</span>
                  <span className="font-mono text-gray-900 font-bold">{data.balance_sheet.working_capital_days} days</span>
                </div>
                <p className="text-gray-700 text-xs leading-relaxed pt-1">{data.balance_sheet.working_capital_trend}</p>
              </div>
            </div>
          )}

          {/* MODULE 6: CASH QUALITY */}
          {activeModule === 'cash_quality' && (
            <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-card space-y-3">
              <h3 className="text-sm font-bold text-gray-900">Cash quality & conversion (CFO vs PAT)</h3>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-gray-50 border border-gray-200 p-3 rounded-lg">
                  <div className="text-xs text-gray-500">Operating cash flow (CFO)</div>
                  <div className="text-sm font-bold text-gray-900 font-mono mt-1">₹{data.cash_quality.cfo_ttm_cr} Cr</div>
                </div>
                <div className="bg-gray-50 border border-gray-200 p-3 rounded-lg">
                  <div className="text-xs text-gray-500">Reported net profit (PAT)</div>
                  <div className="text-sm font-bold text-gray-900 font-mono mt-1">₹{data.cash_quality.pat_ttm_cr} Cr</div>
                </div>
              </div>
              <div className="bg-gray-50 border border-gray-200 p-3.5 rounded-lg space-y-1 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-gray-900">Cash conversion ratio (CFO ÷ PAT):</span>
                  <span className="font-mono text-emerald-800 font-bold text-sm">
                    {data.cash_quality.cash_conversion_ratio}x
                  </span>
                </div>
                <p className="text-gray-700 text-xs leading-relaxed pt-1">{data.cash_quality.verdict}</p>
                <div className="pt-2 border-t border-gray-200 flex items-center justify-between text-xs">
                  <span className="text-gray-500">Free cash flow (FCF):</span>
                  <span className="font-mono font-bold text-gray-900">₹{data.cash_quality.free_cash_flow_cr} Cr</span>
                </div>
              </div>
            </div>
          )}

          {/* MODULE 7: GUIDANCE */}
          {activeModule === 'guidance' && (
            <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-card space-y-3">
              <h3 className="text-sm font-bold text-gray-900">Explicit forward guidance</h3>
              <div className="space-y-2 text-xs">
                <div className="bg-gray-50 border border-gray-200 p-3 rounded-lg">
                  <div className="text-xs text-gray-500">Sales growth expectation</div>
                  <div className="text-xs font-semibold text-gray-900 mt-0.5">{data.guidance.forward_sales_growth_target}</div>
                </div>
                {data.guidance.store_addition_targets && (
                  <div className="bg-gray-50 border border-gray-200 p-3 rounded-lg">
                    <div className="text-xs text-gray-500">Expansion & footprint</div>
                    <div className="text-xs font-semibold text-gray-900 mt-0.5">{data.guidance.store_addition_targets}</div>
                  </div>
                )}
                <div className="bg-gray-50 border border-gray-200 p-3 rounded-lg">
                  <div className="text-xs text-gray-500">Guided capex</div>
                  <div className="text-xs font-semibold text-gray-900 mt-0.5">{data.guidance.capex_plans}</div>
                </div>
                <div className="bg-gray-50 border border-gray-200 p-3 rounded-lg">
                  <div className="text-xs text-gray-500">Target operating margin band</div>
                  <div className="text-xs font-semibold text-emerald-800 mt-0.5">{data.guidance.margin_band}</div>
                </div>
              </div>
            </div>
          )}

          {/* MODULE 8: BULL VS BEAR */}
          {activeModule === 'bull_bear' && (
            <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-card space-y-3">
              <h3 className="text-sm font-bold text-gray-900">High-conviction thesis: Bull vs. bear</h3>
              <div className="space-y-3 text-xs">
                <div className="bg-emerald-50/50 border border-emerald-200 p-3.5 rounded-lg space-y-1">
                  <div className="font-bold text-emerald-900">
                    The bull case
                  </div>
                  <p className="text-gray-800 text-xs leading-relaxed pt-1">
                    {data.bull_vs_bear.bull_case}
                  </p>
                </div>

                <div className="bg-red-50/50 border border-red-200 p-3.5 rounded-lg space-y-1">
                  <div className="font-bold text-red-900">
                    The bear case (Key risks)
                  </div>
                  <p className="text-gray-800 text-xs leading-relaxed pt-1">
                    {data.bull_vs_bear.bear_case}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
};
