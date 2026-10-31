import React, { useState, useEffect } from 'react';
import { ResearchPullResponse } from '../types';
import { api } from '../services/api';
import { 
  Search, FileCheck, Layers, BarChart2, Activity, ShieldAlert, 
  DollarSign, CheckCircle2, AlertTriangle, ArrowUpRight, 
  HelpCircle, Sparkles, BookOpen, Clock 
} from 'lucide-react';

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
    { id: 'narrative', label: 'Narrative vs Numbers', badge: 'Highlight' },
    { id: 'business', label: 'Business & Moat' },
    { id: 'financials', label: 'Financial Snapshot' },
    { id: 'trajectory', label: 'Multi-Year Trajectory' },
    { id: 'balance_sheet', label: 'Balance Sheet & Debt' },
    { id: 'cash_quality', label: 'Cash Quality' },
    { id: 'guidance', label: 'Forward Guidance' },
    { id: 'bull_bear', label: 'Bull vs Bear' },
  ];

  const getVerdictClass = (verdict: string) => {
    switch (verdict) {
      case 'BEAT':
        return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'MET':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'MISSED':
        return 'bg-rose-500/20 text-rose-400 border-rose-500/30';
      case 'DIVERGED':
        return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      default:
        return 'bg-slate-800 text-slate-300';
    }
  };

  return (
    <div className="space-y-4 pb-24">
      {/* Search Header */}
      <div className="bg-surface border border-surfaceBorder rounded-2xl p-4 space-y-3">
        <form onSubmit={handleSearchSubmit} className="relative flex items-center">
          <Search className="w-4 h-4 absolute left-3.5 text-slate-400" />
          <input
            type="text"
            value={tickerInput}
            onChange={(e) => setTickerInput(e.target.value)}
            placeholder="Search ANY NSE/BSE ticker (e.g. RELIANCE, DIXON, TRENT)..."
            className="w-full bg-slate-900 border border-slate-700/80 rounded-xl pl-10 pr-24 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition font-mono"
          />
          <button
            type="submit"
            className="absolute right-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold transition"
          >
            Dig In
          </button>
        </form>

        {/* Quick Ticker Chips */}
        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 scrollbar-none text-[11px]">
          <span className="text-slate-500 font-medium">Quick:</span>
          {quickTickers.map((t) => (
            <button
              key={t}
              onClick={() => {
                setTickerInput(t);
                setActiveTicker(t);
              }}
              className={`px-2.5 py-0.5 rounded-md border font-mono transition ${
                activeTicker === t
                  ? 'bg-blue-500/20 border-blue-500/50 text-blue-300 font-semibold'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="py-16 flex flex-col items-center justify-center space-y-3">
          <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xs text-slate-400">Grounding research in Annual Reports & Transcripts...</p>
        </div>
      ) : error ? (
        <div className="bg-surface border border-rose-500/30 rounded-2xl p-6 text-center space-y-2">
          <ShieldAlert className="w-8 h-8 text-rose-500 mx-auto" />
          <h3 className="text-sm font-semibold text-slate-200">Research Query Error</h3>
          <p className="text-xs text-rose-400">{error}</p>
        </div>
      ) : data ? (
        <div className="space-y-4">
          {/* Company Banner */}
          <div className="bg-surface border border-surfaceBorder rounded-2xl p-4">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center space-x-2">
                  <h2 className="text-lg font-bold text-white tracking-tight">{data.company_name}</h2>
                  <span className="text-xs font-mono px-2 py-0.5 bg-slate-800 text-blue-400 rounded border border-slate-700">
                    {data.symbol}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">{data.sector}</p>
              </div>

              <div className="text-right">
                <span className="text-[10px] text-emerald-400 font-medium bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                  <FileCheck className="w-3 h-3" />
                  Primary Data Grounded
                </span>
              </div>
            </div>

            {/* Primary Sources Audit Links */}
            <div className="mt-3 pt-3 border-t border-slate-800/80 flex flex-wrap items-center gap-2 text-[11px] text-slate-400">
              <span className="text-slate-500 font-medium">Disclosures:</span>
              {data.primary_sources.map((src, i) => (
                <a
                  key={i}
                  href={src.url}
                  target="_blank"
                  rel="noreferrer"
                  className="bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 px-2.5 py-1 rounded-md inline-flex items-center gap-1 hover:text-blue-400 transition"
                >
                  <BookOpen className="w-2.5 h-2.5 text-blue-400" />
                  {src.title}
                  <ArrowUpRight className="w-2.5 h-2.5 opacity-50" />
                </a>
              ))}
            </div>
          </div>

          {/* Module Selector Pills */}
          <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
            {modules.map((m) => (
              <button
                key={m.id}
                onClick={() => setActiveModule(m.id)}
                className={`px-3 py-1.5 rounded-xl whitespace-nowrap text-[11px] transition font-medium border flex items-center gap-1.5 ${
                  activeModule === m.id
                    ? 'bg-blue-600 text-white border-blue-500 shadow-sm'
                    : 'bg-surface text-slate-400 border-surfaceBorder hover:text-slate-200'
                }`}
              >
                <span>{m.label}</span>
                {m.badge && (
                  <span className="px-1.5 py-0.2 bg-amber-400 text-slate-950 font-bold text-[9px] rounded-full">
                    {m.badge}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* MODULE 1: NARRATIVE VS NUMBERS (HIGHLIGHT) */}
          {activeModule === 'narrative' && (
            <div className="bg-surface border border-surfaceBorder rounded-2xl p-4 space-y-4">
              <div className="border-b border-slate-800 pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <h3 className="text-sm font-bold text-white">Narrative vs. Numbers Audit</h3>
                  </div>
                  <span className="text-[11px] text-slate-400">Past 4 Quarters Performance</span>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  Comparing executive concall guidance against actual delivered financial outcomes.
                </p>
              </div>

              <div className="space-y-3">
                {data.narrative_vs_numbers.map((q, idx) => (
                  <div
                    key={idx}
                    className="bg-slate-900/90 border border-slate-800 rounded-xl p-3.5 space-y-2.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-blue-400 font-mono">{q.quarter}</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded border font-mono ${getVerdictClass(q.verdict)}`}>
                        {q.verdict}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      {/* Promised */}
                      <div className="bg-slate-950/60 p-2.5 rounded-lg border border-slate-800/80">
                        <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide">
                          Management Promised (Guidance)
                        </div>
                        <p className="text-slate-200 mt-1 text-[11px] leading-relaxed">
                          "{q.management_guidance}"
                        </p>
                      </div>

                      {/* Delivered */}
                      <div className="bg-slate-950/60 p-2.5 rounded-lg border border-slate-800/80">
                        <div className="text-[10px] font-semibold text-emerald-400 uppercase tracking-wide">
                          Delivered (Exchange Results)
                        </div>
                        <p className="text-slate-200 mt-1 text-[11px] leading-relaxed">
                          {q.actual_delivered}
                        </p>
                      </div>
                    </div>

                    <div className="text-[11px] bg-slate-800/40 p-2 rounded border border-slate-800 text-slate-300">
                      <span className="font-semibold text-amber-400">Analyst Synthesis: </span>
                      {q.analyst_takeaway}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* MODULE 2: BUSINESS SNAPSHOT */}
          {activeModule === 'business' && (
            <div className="bg-surface border border-surfaceBorder rounded-2xl p-4 space-y-4">
              <div>
                <h3 className="text-sm font-bold text-white">Business Overview & Segments</h3>
                <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                  {data.business_snapshot.core_activity}
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wide">Operating Segments</h4>
                <div className="space-y-2">
                  {data.business_snapshot.segments.map((seg, i) => (
                    <div key={i} className="bg-slate-900 border border-slate-800 p-3 rounded-xl flex items-center justify-between">
                      <div>
                        <div className="text-xs font-bold text-white">{seg.name}</div>
                        <div className="text-[11px] text-slate-400 mt-0.5">{seg.margin_profile}</div>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-mono font-bold text-blue-400">
                          {seg.revenue_share_pct}%
                        </span>
                        <div className="text-[10px] text-slate-500">Revenue Mix</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl">
                <h4 className="text-xs font-bold text-amber-400">Competitive Moat</h4>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  {data.business_snapshot.competitive_moat}
                </p>
              </div>
            </div>
          )}

          {/* MODULE 3: FINANCIAL SNAPSHOT */}
          {activeModule === 'financials' && (
            <div className="bg-surface border border-surfaceBorder rounded-2xl p-4 space-y-3">
              <h3 className="text-sm font-bold text-white">Financial Snapshot & Key Ratios</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs">
                <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl">
                  <div className="text-[10px] text-slate-400 uppercase">Revenue (TTM)</div>
                  <div className="text-sm font-bold text-white font-mono mt-1">₹{data.financial_snapshot.revenue_ttm_cr.toLocaleString()} Cr</div>
                </div>
                <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl">
                  <div className="text-[10px] text-slate-400 uppercase">EBITDA Margin</div>
                  <div className="text-sm font-bold text-emerald-400 font-mono mt-1">{data.financial_snapshot.ebitda_margin_pct}%</div>
                </div>
                <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl">
                  <div className="text-[10px] text-slate-400 uppercase">PAT (TTM)</div>
                  <div className="text-sm font-bold text-white font-mono mt-1">₹{data.financial_snapshot.pat_ttm_cr.toLocaleString()} Cr</div>
                </div>
                <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl">
                  <div className="text-[10px] text-slate-400 uppercase">ROCE</div>
                  <div className="text-sm font-bold text-blue-400 font-mono mt-1">{data.financial_snapshot.roce_pct}%</div>
                </div>
                <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl">
                  <div className="text-[10px] text-slate-400 uppercase">ROE</div>
                  <div className="text-sm font-bold text-indigo-400 font-mono mt-1">{data.financial_snapshot.roe_pct}%</div>
                </div>
                <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl">
                  <div className="text-[10px] text-slate-400 uppercase">P/E Ratio</div>
                  <div className="text-sm font-bold text-amber-400 font-mono mt-1">{data.financial_snapshot.pe_ratio}x</div>
                </div>
              </div>
            </div>
          )}

          {/* MODULE 4: TRAJECTORY */}
          {activeModule === 'trajectory' && (
            <div className="bg-surface border border-surfaceBorder rounded-2xl p-4 space-y-3">
              <h3 className="text-sm font-bold text-white">Multi-Year Trajectory & Compressions</h3>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl">
                  <div className="text-[10px] text-slate-400">3-Year Sales CAGR</div>
                  <div className="text-base font-bold text-emerald-400 font-mono mt-1">+{data.trajectory['3yr_sales_cagr_pct']}%</div>
                </div>
                <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl">
                  <div className="text-[10px] text-slate-400">3-Year PAT CAGR</div>
                  <div className="text-base font-bold text-emerald-400 font-mono mt-1">+{data.trajectory['3yr_pat_cagr_pct']}%</div>
                </div>
              </div>
              <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl space-y-1.5 text-xs">
                <div className="font-semibold text-white">Margin Trend:</div>
                <p className="text-slate-300 leading-relaxed">{data.trajectory.margin_trend}</p>
              </div>
              <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl space-y-1.5 text-xs">
                <div className="font-semibold text-amber-400">Compressions & Drags:</div>
                <p className="text-slate-300 leading-relaxed">{data.trajectory.compressions}</p>
              </div>
            </div>
          )}

          {/* MODULE 5: BALANCE SHEET */}
          {activeModule === 'balance_sheet' && (
            <div className="bg-surface border border-surfaceBorder rounded-2xl p-4 space-y-3">
              <h3 className="text-sm font-bold text-white">Balance Sheet, Leverage & Working Capital</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs">
                <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl">
                  <div className="text-[10px] text-slate-400 uppercase">Total Debt</div>
                  <div className="text-sm font-bold text-white font-mono mt-1">₹{data.balance_sheet.total_debt_cr} Cr</div>
                </div>
                <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl">
                  <div className="text-[10px] text-slate-400 uppercase">Cash & Equiv</div>
                  <div className="text-sm font-bold text-white font-mono mt-1">₹{data.balance_sheet.cash_equivalents_cr} Cr</div>
                </div>
                <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl">
                  <div className="text-[10px] text-slate-400 uppercase">Debt / Equity</div>
                  <div className="text-sm font-bold text-blue-400 font-mono mt-1">{data.balance_sheet.debt_to_equity}</div>
                </div>
              </div>
              <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl space-y-1 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-white">Working Capital Cycle:</span>
                  <span className="font-mono text-blue-400 font-bold">{data.balance_sheet.working_capital_days} Days</span>
                </div>
                <p className="text-slate-300 text-[11px] leading-relaxed pt-1">{data.balance_sheet.working_capital_trend}</p>
              </div>
            </div>
          )}

          {/* MODULE 6: CASH QUALITY */}
          {activeModule === 'cash_quality' && (
            <div className="bg-surface border border-surfaceBorder rounded-2xl p-4 space-y-3">
              <h3 className="text-sm font-bold text-white">Cash Quality & Cash Conversion (CFO vs PAT)</h3>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl">
                  <div className="text-[10px] text-slate-400">Cash Flow from Operations (CFO)</div>
                  <div className="text-sm font-bold text-white font-mono mt-1">₹{data.cash_quality.cfo_ttm_cr} Cr</div>
                </div>
                <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl">
                  <div className="text-[10px] text-slate-400">Accounting Net Profit (PAT)</div>
                  <div className="text-sm font-bold text-white font-mono mt-1">₹{data.cash_quality.pat_ttm_cr} Cr</div>
                </div>
              </div>
              <div className="bg-slate-900 border border-slate-800 p-3.5 rounded-xl space-y-1.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-white">Cash Conversion Ratio (CFO ÷ PAT):</span>
                  <span className="font-mono text-emerald-400 font-bold text-sm">
                    {data.cash_quality.cash_conversion_ratio}x
                  </span>
                </div>
                <p className="text-slate-300 text-[11px] leading-relaxed pt-1">{data.cash_quality.verdict}</p>
                <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px]">
                  <span className="text-slate-400">Free Cash Flow (FCF):</span>
                  <span className="font-mono font-bold text-white">₹{data.cash_quality.free_cash_flow_cr} Cr</span>
                </div>
              </div>
            </div>
          )}

          {/* MODULE 7: GUIDANCE */}
          {activeModule === 'guidance' && (
            <div className="bg-surface border border-surfaceBorder rounded-2xl p-4 space-y-3">
              <h3 className="text-sm font-bold text-white">Explicit Forward Guidance Targets</h3>
              <div className="space-y-2 text-xs">
                <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl">
                  <div className="text-[10px] text-slate-400 uppercase">Sales Growth Target</div>
                  <div className="text-xs font-semibold text-white mt-1">{data.guidance.forward_sales_growth_target}</div>
                </div>
                {data.guidance.store_addition_targets && (
                  <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl">
                    <div className="text-[10px] text-slate-400 uppercase">Capacity / Expansion Target</div>
                    <div className="text-xs font-semibold text-white mt-1">{data.guidance.store_addition_targets}</div>
                  </div>
                )}
                <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl">
                  <div className="text-[10px] text-slate-400 uppercase">Guided Capex Outlay</div>
                  <div className="text-xs font-semibold text-white mt-1">{data.guidance.capex_plans}</div>
                </div>
                <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl">
                  <div className="text-[10px] text-slate-400 uppercase">Target Operating Margin Band</div>
                  <div className="text-xs font-semibold text-emerald-400 mt-1">{data.guidance.margin_band}</div>
                </div>
              </div>
            </div>
          )}

          {/* MODULE 8: BULL VS BEAR */}
          {activeModule === 'bull_bear' && (
            <div className="bg-surface border border-surfaceBorder rounded-2xl p-4 space-y-3">
              <h3 className="text-sm font-bold text-white">High-Conviction Thesis: Bull vs. Bear</h3>
              <div className="space-y-3 text-xs">
                <div className="bg-emerald-950/20 border border-emerald-500/30 p-3.5 rounded-xl space-y-1">
                  <div className="font-bold text-emerald-400 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    The Bull Thesis
                  </div>
                  <p className="text-slate-200 text-[11px] leading-relaxed pt-1">
                    {data.bull_vs_bear.bull_case}
                  </p>
                </div>

                <div className="bg-rose-950/20 border border-rose-500/30 p-3.5 rounded-xl space-y-1">
                  <div className="font-bold text-rose-400 flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    The Bear Thesis (Key Vulnerabilities)
                  </div>
                  <p className="text-slate-200 text-[11px] leading-relaxed pt-1">
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
