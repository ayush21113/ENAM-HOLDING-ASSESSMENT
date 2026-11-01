import React, { useState, useEffect } from 'react';
import { ResearchPullResponse } from '../types';
import { api } from '../services/api';
import { ForensicAuditModule } from './ForensicAuditModule';
import { ConcallStressTestModule } from './ConcallStressTestModule';
import { DisclosureDiffModule } from './DisclosureDiffModule';
import { ForensicRadarModule } from './ForensicRadarModule';
import { Search, FileCheck, ArrowUpRight, BookOpen, AlertCircle, Sparkles, ShieldCheck, Target, Award, MessageSquare } from 'lucide-react';

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
    { id: 'narrative', label: 'Narrative vs Numbers', highlight: true },
    { id: 'disclosure_diff', label: 'Semantic Diff (QoQ)', highlight: true },
    { id: 'concall_qa', label: 'Concall Hot Seat (Q&A)', highlight: true },
    { id: 'forensic', label: 'Forensic Radar & Beneish', highlight: true },
    { id: 'business', label: 'Business' },
    { id: 'financials', label: 'Financials' },
    { id: 'trajectory', label: 'Trajectory' },
    { id: 'balance_sheet', label: 'Balance Sheet' },
    { id: 'cash_quality', label: 'Cash Quality' },
    { id: 'guidance', label: 'Guidance' },
    { id: 'bull_bear', label: 'Bull vs Bear' },
  ];

  const getVerdictBadge = (verdict: string) => {
    switch (verdict) {
      case 'BEAT':
        return 'bg-[#e8f8f3] text-[#00875A] font-bold';
      case 'MET':
        return 'bg-blue-50 text-blue-800 font-semibold';
      case 'MISSED':
        return 'bg-[#fdf1ee] text-[#EB5B3C] font-bold';
      case 'DIVERGED':
        return 'bg-amber-50 text-amber-800 font-semibold';
      default:
        return 'bg-gray-100 text-gray-800 font-medium';
    }
  };

  return (
    <div className="space-y-3 pb-24">
      {/* 1. SEARCH BAR */}
      <div className="bg-white rounded-2xl p-4 border border-[#ebecef] shadow-xs space-y-3">
        <form onSubmit={handleSearchSubmit} className="relative flex items-center">
          <Search className="w-4 h-4 absolute left-3.5 text-[#7c7e8c]" />
          <input
            type="text"
            value={tickerInput}
            onChange={(e) => setTickerInput(e.target.value)}
            placeholder="Search any NSE/BSE stock (e.g. RELIANCE, DIXON)..."
            className="w-full bg-[#f5f6f8] rounded-xl pl-10 pr-24 py-2.5 text-xs text-[#1e222b] placeholder-[#7c7e8c] focus:outline-none focus:bg-white focus:ring-1 focus:ring-[#00D09C] transition font-mono"
          />
          <button
            type="submit"
            className="absolute right-1.5 px-3.5 py-1.5 bg-[#00D09C] hover:bg-[#00B386] text-white rounded-lg text-xs font-bold transition shadow-xs"
          >
            Search
          </button>
        </form>

        {/* Quick Tickers Chips */}
        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
          <span className="text-[#7c7e8c] font-medium">Popular:</span>
          {quickTickers.map((t) => (
            <button
              key={t}
              onClick={() => {
                setTickerInput(t);
                setActiveTicker(t);
              }}
              className={`px-2.5 py-1 rounded-full font-mono text-xs transition ${
                activeTicker === t
                  ? 'bg-[#1e222b] text-white font-bold'
                  : 'bg-[#f5f6f8] text-[#7c7e8c] hover:bg-[#ebecef] hover:text-[#1e222b]'
              }`}
            >
              {t.replace('.NS', '')}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="py-16 flex flex-col items-center justify-center space-y-2">
          <div className="w-5 h-5 border-2 border-[#00D09C] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xs text-[#7c7e8c] font-medium">Fetching primary disclosures (annual reports & concalls)...</p>
        </div>
      ) : error ? (
        <div className="bg-white border border-[#ebecef] rounded-2xl p-6 text-center space-y-2 shadow-xs">
          <AlertCircle className="w-8 h-8 text-[#EB5B3C] mx-auto" />
          <h3 className="text-sm font-semibold text-[#1e222b]">Stock not found</h3>
          <p className="text-xs text-[#7c7e8c]">{error}</p>
        </div>
      ) : data ? (
        <div className="space-y-3">
          {/* Company Overview Header */}
          <div className="bg-white border border-[#ebecef] rounded-2xl p-4 shadow-xs space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center space-x-2">
                  <h2 className="text-xl font-bold text-[#1e222b] tracking-tight">{data.company_name}</h2>
                  <span className="text-xs font-mono font-bold px-2 py-0.5 bg-[#f5f6f8] text-[#1e222b] rounded">
                    {data.symbol}
                  </span>
                </div>
                <p className="text-xs text-[#7c7e8c] mt-0.5">{data.sector}</p>
              </div>

              <span className="text-xs text-[#00875A] font-semibold bg-[#e8f8f3] px-2.5 py-1 rounded-full inline-flex items-center gap-1">
                <FileCheck className="w-3.5 h-3.5" />
                Primary Data
              </span>
            </div>

            {/* Primary Source Disclosure Links */}
            <div className="pt-2 border-t border-[#f5f6f8] flex flex-wrap items-center gap-1.5 text-xs text-[#7c7e8c]">
              <span className="font-medium text-[#1e222b]">Sources:</span>
              {data.primary_sources.map((src, i) => (
                <a
                  key={i}
                  href={src.url}
                  target="_blank"
                  rel="noreferrer"
                  className="bg-[#f5f6f8] hover:bg-[#ebecef] text-[#1e222b] px-2.5 py-1 rounded-lg inline-flex items-center gap-1 transition text-[11px] font-medium"
                >
                  <BookOpen className="w-3 h-3 text-[#00875A]" />
                  {src.title}
                  <ArrowUpRight className="w-2.5 h-2.5 opacity-50" />
                </a>
              ))}
            </div>
          </div>

          {/* Module Selector Chips */}
          <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
            {modules.map((m) => (
              <button
                key={m.id}
                onClick={() => setActiveModule(m.id)}
                className={`px-3 py-1.5 rounded-full whitespace-nowrap text-xs transition font-semibold ${
                  activeModule === m.id
                    ? 'bg-[#1e222b] text-white shadow-xs'
                    : 'bg-white text-[#7c7e8c] border border-[#ebecef] hover:bg-[#f5f6f8]'
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>

          {/* MODULE 1: NARRATIVE VS NUMBERS (THE HIGHLIGHT FEATURE) */}
          {activeModule === 'narrative' && (
            <div className="bg-white border border-[#ebecef] rounded-2xl p-4 shadow-xs space-y-4">
              <div className="border-b border-[#f5f6f8] pb-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-[#1e222b] flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-[#00875A]" />
                    Narrative vs. Numbers Audit
                  </h3>
                  <span className="text-xs text-[#7c7e8c]">Last 4 Quarters</span>
                </div>
                <p className="text-xs text-[#7c7e8c] mt-0.5">
                  Auditing what management promised on quarterly concalls versus what was actually delivered.
                </p>
              </div>

              {/* GLOBAL BENCHMARK: MANAGEMENT GUIDANCE CREDIBILITY SCORECARD */}
              {data.credibility_scorecard && (
                <div className="bg-[#f5f6f8] rounded-xl p-3.5 space-y-2 border border-[#ebecef]">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-[10px] text-[#7c7e8c] font-bold uppercase tracking-wider">
                        Management Guidance Batting Average
                      </div>
                      <div className="text-sm font-bold text-[#1e222b] mt-0.5 flex items-baseline gap-2">
                        <span className="font-mono text-base text-[#00875A] font-extrabold">
                          {data.credibility_scorecard.batting_average_pct}% Beat/Meet Rate
                        </span>
                        <span className="text-[10px] font-bold text-[#00875A] bg-[#e8f8f3] px-1.5 py-0.2 rounded">
                          {data.credibility_scorecard.verdict}
                        </span>
                      </div>
                    </div>
                    <div className="text-right text-xs">
                      <span className="font-mono font-bold text-[#1e222b]">
                        {data.credibility_scorecard.beats} Beats • {data.credibility_scorecard.meets} Meets • {data.credibility_scorecard.misses} Misses
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-[#44475b] leading-relaxed">
                    {data.credibility_scorecard.summary}
                  </p>
                </div>
              )}

              <div className="space-y-3">
                {data.narrative_vs_numbers.map((q, idx) => (
                  <div
                    key={idx}
                    className="bg-[#fafbfd] border border-[#ebecef] rounded-xl p-3.5 space-y-2.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#1e222b] font-mono">{q.quarter}</span>
                      <span className={`text-xs px-2 py-0.5 rounded ${getVerdictBadge(q.verdict)}`}>
                        {q.verdict}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      {/* Promised */}
                      <div className="bg-white p-3 rounded-lg border border-[#ebecef]">
                        <div className="text-[11px] font-semibold text-[#7c7e8c]">
                          Management Guidance
                        </div>
                        <p className="text-[#1e222b] mt-1 text-xs leading-relaxed">
                          "{q.management_guidance}"
                        </p>
                      </div>

                      {/* Delivered */}
                      <div className="bg-white p-3 rounded-lg border border-[#ebecef]">
                        <div className="text-[11px] font-semibold text-[#00875A]">
                          Delivered Financials
                        </div>
                        <p className="text-[#1e222b] mt-1 text-xs leading-relaxed">
                          {q.actual_delivered}
                        </p>
                      </div>
                    </div>

                    <div className="text-xs bg-white p-2.5 rounded-lg border border-[#ebecef] text-[#44475b]">
                      <span className="font-semibold text-[#1e222b]">Analyst Takeaway: </span>
                      {q.analyst_takeaway}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* EXTENSION: SEMANTIC CONCALL & DISCLOSURE DIFF ("WHAT CHANGED?") */}
          {activeModule === 'disclosure_diff' && (
            <div className="bg-white border border-[#ebecef] rounded-2xl p-4 shadow-xs space-y-3">
              <DisclosureDiffModule diffs={data.disclosure_diff} companyName={data.company_name} />
            </div>
          )}

          {/* EXTENSION: CONCALL Q&A STRESS-TEST ("THE HOT SEAT") */}
          {activeModule === 'concall_qa' && (
            <div className="bg-white border border-[#ebecef] rounded-2xl p-4 shadow-xs space-y-3">
              <ConcallStressTestModule symbol={activeTicker} items={data.concall_qa} />
            </div>
          )}

          {/* MODULE: FORENSIC & RED FLAGS AUDIT + BENEISH M-SCORE RADAR */}
          {activeModule === 'forensic' && (
            <div className="bg-white border border-[#ebecef] rounded-2xl p-4 shadow-xs space-y-4">
              <ForensicRadarModule radar={data.forensic_radar} companyName={data.company_name} />
              <div className="pt-2 border-t border-[#F5F6F8]">
                <ForensicAuditModule symbol={activeTicker} />
              </div>
            </div>
          )}

          {/* MODULE 2: BUSINESS SNAPSHOT */}
          {activeModule === 'business' && (
            <div className="bg-white border border-[#ebecef] rounded-2xl p-4 shadow-xs space-y-3">
              <h3 className="text-sm font-bold text-[#1e222b]">Business Model & Revenue Mix</h3>
              <p className="text-xs text-[#44475b] leading-relaxed">
                {data.business_snapshot.core_activity}
              </p>

              <div className="space-y-2 pt-1">
                <div className="text-xs font-semibold text-[#1e222b]">Operating Segments</div>
                {data.business_snapshot.segments.map((seg, i) => (
                  <div key={i} className="bg-[#f5f6f8] p-3 rounded-xl flex items-center justify-between">
                    <div>
                      <div className="text-xs font-semibold text-[#1e222b]">{seg.name}</div>
                      <div className="text-[11px] text-[#7c7e8c] mt-0.5">{seg.margin_profile}</div>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-mono font-bold text-[#1e222b]">
                        {seg.revenue_share_pct}%
                      </span>
                      <div className="text-[10px] text-[#7c7e8c]">Share</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-[#e8f8f3] p-3 rounded-xl text-xs space-y-1">
                <div className="font-bold text-[#00875A]">Competitive Moat</div>
                <p className="text-[#00875A] leading-relaxed font-normal">
                  {data.business_snapshot.competitive_moat}
                </p>
              </div>
            </div>
          )}

          {/* MODULE 3: FINANCIAL SNAPSHOT */}
          {activeModule === 'financials' && (
            <div className="bg-white border border-[#ebecef] rounded-2xl p-4 shadow-xs space-y-3">
              <h3 className="text-sm font-bold text-[#1e222b]">Financial Overview (TTM)</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                <div className="bg-[#f5f6f8] p-3 rounded-xl">
                  <div className="text-[10px] text-[#7c7e8c]">Revenue</div>
                  <div className="text-sm font-bold text-[#1e222b] font-mono mt-0.5">₹{data.financial_snapshot.revenue_ttm_cr.toLocaleString()} Cr</div>
                </div>
                <div className="bg-[#f5f6f8] p-3 rounded-xl">
                  <div className="text-[10px] text-[#7c7e8c]">EBITDA Margin</div>
                  <div className="text-sm font-bold text-[#00875A] font-mono mt-0.5">{data.financial_snapshot.ebitda_margin_pct}%</div>
                </div>
                <div className="bg-[#f5f6f8] p-3 rounded-xl">
                  <div className="text-[10px] text-[#7c7e8c]">Net Profit (PAT)</div>
                  <div className="text-sm font-bold text-[#1e222b] font-mono mt-0.5">₹{data.financial_snapshot.pat_ttm_cr.toLocaleString()} Cr</div>
                </div>
                <div className="bg-[#f5f6f8] p-3 rounded-xl">
                  <div className="text-[10px] text-[#7c7e8c]">ROCE</div>
                  <div className="text-sm font-bold text-[#1e222b] font-mono mt-0.5">{data.financial_snapshot.roce_pct}%</div>
                </div>
                <div className="bg-[#f5f6f8] p-3 rounded-xl">
                  <div className="text-[10px] text-[#7c7e8c]">ROE</div>
                  <div className="text-sm font-bold text-[#1e222b] font-mono mt-0.5">{data.financial_snapshot.roe_pct}%</div>
                </div>
                <div className="bg-[#f5f6f8] p-3 rounded-xl">
                  <div className="text-[10px] text-[#7c7e8c]">P/E Ratio</div>
                  <div className="text-sm font-bold text-[#1e222b] font-mono mt-0.5">{data.financial_snapshot.pe_ratio}x</div>
                </div>
              </div>
            </div>
          )}

          {/* MODULE 4: TRAJECTORY */}
          {activeModule === 'trajectory' && (
            <div className="bg-white border border-[#ebecef] rounded-2xl p-4 shadow-xs space-y-3">
              <h3 className="text-sm font-bold text-[#1e222b]">Growth Trajectory & Compressions</h3>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-[#f5f6f8] p-3 rounded-xl">
                  <div className="text-[10px] text-[#7c7e8c]">3-Year Sales CAGR</div>
                  <div className="text-base font-bold text-[#00875A] font-mono mt-0.5">+{data.trajectory['3yr_sales_cagr_pct']}%</div>
                </div>
                <div className="bg-[#f5f6f8] p-3 rounded-xl">
                  <div className="text-[10px] text-[#7c7e8c]">3-Year PAT CAGR</div>
                  <div className="text-base font-bold text-[#00875A] font-mono mt-0.5">+{data.trajectory['3yr_pat_cagr_pct']}%</div>
                </div>
              </div>
              <div className="bg-[#f5f6f8] p-3 rounded-xl space-y-1 text-xs">
                <div className="font-semibold text-[#1e222b]">Margin Trend:</div>
                <p className="text-[#44475b] leading-relaxed">{data.trajectory.margin_trend}</p>
              </div>
              <div className="bg-[#f5f6f8] p-3 rounded-xl space-y-1 text-xs">
                <div className="font-semibold text-[#1e222b]">Compressions & Headwinds:</div>
                <p className="text-[#44475b] leading-relaxed">{data.trajectory.compressions}</p>
              </div>
            </div>
          )}

          {/* MODULE 5: BALANCE SHEET */}
          {activeModule === 'balance_sheet' && (
            <div className="bg-white border border-[#ebecef] rounded-2xl p-4 shadow-xs space-y-3">
              <h3 className="text-sm font-bold text-[#1e222b]">Debt Profile & Working Capital</h3>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div className="bg-[#f5f6f8] p-3 rounded-xl">
                  <div className="text-[10px] text-[#7c7e8c]">Total Debt</div>
                  <div className="text-sm font-bold text-[#1e222b] font-mono mt-0.5">₹{data.balance_sheet.total_debt_cr} Cr</div>
                </div>
                <div className="bg-[#f5f6f8] p-3 rounded-xl">
                  <div className="text-[10px] text-[#7c7e8c]">Cash & Equiv</div>
                  <div className="text-sm font-bold text-[#1e222b] font-mono mt-0.5">₹{data.balance_sheet.cash_equivalents_cr} Cr</div>
                </div>
                <div className="bg-[#f5f6f8] p-3 rounded-xl">
                  <div className="text-[10px] text-[#7c7e8c]">D/E Ratio</div>
                  <div className="text-sm font-bold text-[#1e222b] font-mono mt-0.5">{data.balance_sheet.debt_to_equity}</div>
                </div>
              </div>
              <div className="bg-[#f5f6f8] p-3 rounded-xl space-y-1 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-[#1e222b]">Working Capital Cycle:</span>
                  <span className="font-mono font-bold text-[#1e222b]">{data.balance_sheet.working_capital_days} Days</span>
                </div>
                <p className="text-[#44475b] leading-relaxed pt-0.5">{data.balance_sheet.working_capital_trend}</p>
              </div>
            </div>
          )}

          {/* MODULE 6: CASH QUALITY */}
          {activeModule === 'cash_quality' && (
            <div className="bg-white border border-[#ebecef] rounded-2xl p-4 shadow-xs space-y-3">
              <h3 className="text-sm font-bold text-[#1e222b]">Cash Flow vs. Accounting Profit</h3>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-[#f5f6f8] p-3 rounded-xl">
                  <div className="text-[10px] text-[#7c7e8c]">Cash from Operations (CFO)</div>
                  <div className="text-sm font-bold text-[#1e222b] font-mono mt-0.5">₹{data.cash_quality.cfo_ttm_cr} Cr</div>
                </div>
                <div className="bg-[#f5f6f8] p-3 rounded-xl">
                  <div className="text-[10px] text-[#7c7e8c]">Reported Profit (PAT)</div>
                  <div className="text-sm font-bold text-[#1e222b] font-mono mt-0.5">₹{data.cash_quality.pat_ttm_cr} Cr</div>
                </div>
              </div>
              <div className="bg-[#f5f6f8] p-3.5 rounded-xl space-y-1 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-[#1e222b]">Cash Conversion (CFO ÷ PAT):</span>
                  <span className="font-mono text-[#00875A] font-bold text-sm">
                    {data.cash_quality.cash_conversion_ratio}x
                  </span>
                </div>
                <p className="text-[#44475b] leading-relaxed pt-0.5">{data.cash_quality.verdict}</p>
                <div className="pt-2 border-t border-[#ebecef] flex items-center justify-between text-xs">
                  <span className="text-[#7c7e8c]">Free Cash Flow (FCF):</span>
                  <span className="font-mono font-bold text-[#1e222b]">₹{data.cash_quality.free_cash_flow_cr} Cr</span>
                </div>
              </div>
            </div>
          )}

          {/* MODULE 7: GUIDANCE */}
          {activeModule === 'guidance' && (
            <div className="bg-white border border-[#ebecef] rounded-2xl p-4 shadow-xs space-y-3">
              <h3 className="text-sm font-bold text-[#1e222b]">Management Guidance Targets</h3>
              <div className="space-y-2 text-xs">
                <div className="bg-[#f5f6f8] p-3 rounded-xl">
                  <div className="text-[10px] text-[#7c7e8c]">Sales Target</div>
                  <div className="text-xs font-semibold text-[#1e222b] mt-0.5">{data.guidance.forward_sales_growth_target}</div>
                </div>
                {data.guidance.store_addition_targets && (
                  <div className="bg-[#f5f6f8] p-3 rounded-xl">
                    <div className="text-[10px] text-[#7c7e8c]">Footprint Expansion</div>
                    <div className="text-xs font-semibold text-[#1e222b] mt-0.5">{data.guidance.store_addition_targets}</div>
                  </div>
                )}
                <div className="bg-[#f5f6f8] p-3 rounded-xl">
                  <div className="text-[10px] text-[#7c7e8c]">Capex Outlay</div>
                  <div className="text-xs font-semibold text-[#1e222b] mt-0.5">{data.guidance.capex_plans}</div>
                </div>
                <div className="bg-[#f5f6f8] p-3 rounded-xl">
                  <div className="text-[10px] text-[#7c7e8c]">Operating Margin Band</div>
                  <div className="text-xs font-semibold text-[#00875A] mt-0.5">{data.guidance.margin_band}</div>
                </div>
              </div>
            </div>
          )}

          {/* MODULE 8: BULL VS BEAR */}
          {activeModule === 'bull_bear' && (
            <div className="bg-white border border-[#ebecef] rounded-2xl p-4 shadow-xs space-y-3">
              <h3 className="text-sm font-bold text-[#1e222b]">Bull vs. Bear Thesis</h3>
              <div className="space-y-2.5 text-xs">
                <div className="bg-[#e8f8f3] p-3.5 rounded-xl space-y-1">
                  <div className="font-bold text-[#00875A]">The Bull Case</div>
                  <p className="text-[#00875A] leading-relaxed pt-0.5">
                    {data.bull_vs_bear.bull_case}
                  </p>
                </div>

                <div className="bg-[#fdf1ee] p-3.5 rounded-xl space-y-1">
                  <div className="font-bold text-[#EB5B3C]">The Bear Case</div>
                  <p className="text-[#EB5B3C] leading-relaxed pt-0.5">
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
