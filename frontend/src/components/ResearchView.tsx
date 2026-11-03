import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { ResearchPullResponse, LiveStockQuote } from '../types';
import { ForensicAuditModule } from './ForensicAuditModule';
import { ConcallStressTestModule } from './ConcallStressTestModule';
import { DisclosureDiffModule } from './DisclosureDiffModule';
import { ForensicRadarModule } from './ForensicRadarModule';
import { 
  Search, BookOpen, ArrowUpRight, Sparkles, 
  ChevronRight, AlertCircle, TrendingUp, TrendingDown 
} from 'lucide-react';

interface ResearchViewProps {
  initialSymbol?: string;
  onAskFinn: (symbol: string, contextTitle: string) => void;
  onBackToWatchlist?: () => void;
}

type ResearchTab = 'overview' | 'financials' | 'guidance' | 'forensics';

export const ResearchView: React.FC<ResearchViewProps> = ({
  initialSymbol = 'TRENT.NS',
  onAskFinn,
}) => {
  const [activeTicker, setActiveTicker] = useState(initialSymbol);
  const [tickerInput, setTickerInput] = useState(initialSymbol.replace('.NS', ''));
  const [data, setData] = useState<ResearchPullResponse | null>(null);
  const [liveQuote, setLiveQuote] = useState<LiveStockQuote | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<ResearchTab>('overview');

  // Sync when user taps a stock in Watchlist or Today
  useEffect(() => {
    if (initialSymbol && initialSymbol !== activeTicker) {
      setActiveTicker(initialSymbol);
      setTickerInput(initialSymbol.replace('.NS', '').replace('.BO', ''));
    }
  }, [initialSymbol]);

  useEffect(() => {
    loadResearch(activeTicker);
  }, [activeTicker]);

  const loadResearch = async (symbol: string) => {
    setLoading(true);
    setError(null);
    setLiveQuote(null);
    try {
      const resp = await api.getResearchPull(symbol);
      setData(resp);
      api.getLiveQuote(symbol).then((q) => setLiveQuote(q)).catch(() => {});
    } catch (err: any) {
      console.error('Research load error', err);
      setError(err.message || 'Failed to load primary research');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (tickerInput.trim()) {
      let sym = tickerInput.trim().toUpperCase();
      if (!sym.endsWith('.NS') && !sym.endsWith('.BO')) sym = `${sym}.NS`;
      setActiveTicker(sym);
    }
  };

  const getVerdictBadge = (verdict: string, score: number) => {
    switch (verdict) {
      case 'BEAT':
        return (
          <span className="flex items-center space-x-1 text-xs font-bold text-[#00875A]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00875A]" />
            <span>BEAT</span>
          </span>
        );
      case 'MET':
        return (
          <span className="flex items-center space-x-1 text-xs font-semibold text-[#00875A]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00875A]" />
            <span>MET</span>
          </span>
        );
      case 'MISSED':
        return (
          <span className="flex items-center space-x-1 text-xs font-bold text-[#EB5B3C]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#EB5B3C]" />
            <span>MISSED ({score}/5)</span>
          </span>
        );
      case 'DIVERGED':
        return (
          <span className="flex items-center space-x-1 text-xs font-bold text-amber-700">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            <span>DIVERGED ({score}/5)</span>
          </span>
        );
      default:
        return (
          <span className="flex items-center space-x-1 text-xs font-medium text-neutral-600">
            <span className="w-1.5 h-1.5 rounded-full bg-neutral-400" />
            <span>{verdict}</span>
          </span>
        );
    }
  };

  return (
    <div className="space-y-4 pb-28 max-w-md mx-auto">
      {/* 1. COMPACT TICKER SEARCH */}
      <div className="space-y-2 pt-1">
        <form onSubmit={handleSearch} className="relative">
          <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-[#7c7e8c]" />
          <input
            type="text"
            value={tickerInput}
            onChange={(e) => setTickerInput(e.target.value)}
            placeholder="Search company (e.g. TATAMOTORS, TRENT, DIXON)..."
            className="w-full bg-white border border-[#ebecef] rounded-xl pl-8.5 pr-20 py-2 text-xs text-[#1e222b] placeholder-[#7c7e8c] focus:outline-none focus:border-[#00875A] transition"
          />
          <button
            type="submit"
            className="absolute right-1.5 top-1.5 px-2.5 py-1 text-xs font-semibold bg-[#1e222b] text-white rounded-lg hover:bg-black transition"
          >
            Audit
          </button>
        </form>

        {/* Quick-Audit Flagship Pills */}
        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 scrollbar-none text-[11px]">
          <span className="text-[#7c7e8c] font-medium text-[10px] uppercase tracking-wider shrink-0">
            Quick Audit:
          </span>
          {[
            { sym: 'TATAMOTORS.NS', label: 'TATAMOTORS (50% Met · Red Alert)' },
            { sym: 'TRENT.NS', label: 'TRENT (75% Met)' },
            { sym: 'DIXON.NS', label: 'DIXON (75% Met)' },
            { sym: 'RELIANCE.NS', label: 'RELIANCE' },
          ].map((item) => (
            <button
              key={item.sym}
              type="button"
              onClick={() => {
                setActiveTicker(item.sym);
                setTickerInput(item.sym.replace('.NS', ''));
              }}
              className={`px-2.5 py-1 rounded-full text-xs font-mono transition shrink-0 ${
                activeTicker === item.sym
                  ? 'bg-[#1e222b] text-white font-bold shadow-xs'
                  : 'bg-white border border-[#ebecef] text-[#44475b] hover:bg-[#f5f6f8]'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="py-20 text-center text-xs text-[#7c7e8c] space-y-2">
          <div className="w-5 h-5 border-2 border-[#00875A] border-t-transparent rounded-full animate-spin mx-auto" />
          <p>Auditing primary filings & concall transcripts...</p>
        </div>
      ) : error ? (
        <div className="bg-white rounded-xl border border-[#ebecef] p-8 text-center text-xs text-[#7c7e8c] space-y-3">
          <AlertCircle className="w-6 h-6 text-[#EB5B3C] mx-auto" />
          <div>
            <p className="font-semibold text-[#1e222b] text-sm">Unable to fetch primary data</p>
            <p className="mt-1 text-xs text-[#7c7e8c]">{error}</p>
          </div>
          <button
            onClick={() => loadResearch(activeTicker)}
            className="px-4 py-1.5 bg-[#1e222b] text-white rounded-lg font-bold text-xs hover:bg-black transition"
          >
            Retry Audit
          </button>
        </div>
      ) : data ? (
        <div className="space-y-3.5">
          {/* 2. COMPANY HEADER HIERARCHY */}
          <div className="space-y-1.5 px-0.5">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-lg font-bold text-[#1e222b] tracking-tight">
                  {data.company_name}
                </h1>
                <div className="flex items-center space-x-1.5 text-xs text-[#7c7e8c]">
                  <span className="font-mono font-semibold text-[#1e222b]">{data.symbol}</span>
                  <span>·</span>
                  <span>{data.sector}</span>
                </div>
              </div>

              {liveQuote && (
                <div className="text-right">
                  <div className="text-base font-bold font-mono text-[#1e222b]">
                    ₹{liveQuote.price.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </div>
                  <div className={`text-xs font-mono font-semibold ${liveQuote.change_pct >= 0 ? 'text-[#00875A]' : 'text-[#EB5B3C]'}`}>
                    {liveQuote.change_pct >= 0 ? '+' : ''}{liveQuote.change_pct}%
                  </div>
                </div>
              )}
            </div>

            {/* Quiet Primary Sources Grounding */}
            <div className="flex items-center space-x-2 text-[11px] text-[#7c7e8c] pt-0.5">
              <span>Sources:</span>
              <div className="flex items-center space-x-1.5 overflow-x-auto scrollbar-none">
                {data.primary_sources.map((s, idx) => (
                  <a
                    key={idx}
                    href={s.url}
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-[#1e222b] underline truncate max-w-[140px]"
                  >
                    {s.title}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* 3. 4 CRITICAL FINANCIAL INDICATORS (Clean Strip) */}
          <div className="grid grid-cols-4 gap-2 bg-white rounded-xl border border-[#ebecef] p-3 text-center">
            <div>
              <div className="text-[10px] text-[#7c7e8c] uppercase tracking-wider">Revenue</div>
              <div className="text-xs font-bold font-mono text-[#1e222b] mt-0.5">
                ₹{data.financial_snapshot.revenue_ttm_cr.toLocaleString('en-IN')} Cr
              </div>
            </div>
            <div>
              <div className="text-[10px] text-[#7c7e8c] uppercase tracking-wider">EBITDA %</div>
              <div className="text-xs font-bold font-mono text-[#1e222b] mt-0.5">
                {data.financial_snapshot.ebitda_margin_pct}%
              </div>
            </div>
            <div>
              <div className="text-[10px] text-[#7c7e8c] uppercase tracking-wider">PAT</div>
              <div className="text-xs font-bold font-mono text-[#1e222b] mt-0.5">
                ₹{data.financial_snapshot.pat_ttm_cr.toLocaleString('en-IN')} Cr
              </div>
            </div>
            <div>
              <div className="text-[10px] text-[#7c7e8c] uppercase tracking-wider">ROCE</div>
              <div className="text-xs font-bold font-mono text-[#00875A] mt-0.5">
                {data.financial_snapshot.roce_pct}%
              </div>
            </div>
          </div>

          {/* 4. REFINED 4-SEGMENT CONTROL (Replaces 11 chaotic scrolling pills!) */}
          <div className="flex bg-[#f5f6f8] rounded-xl p-1 text-xs font-medium">
            {[
              { id: 'overview' as ResearchTab, label: 'Overview' },
              { id: 'financials' as ResearchTab, label: 'Financials' },
              { id: 'guidance' as ResearchTab, label: 'Guidance' },
              { id: 'forensics' as ResearchTab, label: 'Forensics' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 py-1.5 text-center rounded-lg transition text-xs ${
                  activeTab === tab.id
                    ? 'bg-white text-[#1e222b] font-bold shadow-xs'
                    : 'text-[#7c7e8c] hover:text-[#1e222b]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* 5. TAB CONTENT */}

          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-3">
              <div className="bg-white rounded-xl border border-[#ebecef] p-3.5 space-y-2">
                <div className="text-xs font-bold text-[#1e222b]">Business Model</div>
                <p className="text-xs text-[#44475b] leading-relaxed">
                  {data.business_snapshot.core_activity}
                </p>

                <div className="pt-2 border-t border-[#f5f6f8] space-y-1">
                  <div className="text-[11px] font-semibold text-[#7c7e8c]">Operating Moat:</div>
                  <p className="text-xs text-[#1e222b]">{data.business_snapshot.competitive_moat}</p>
                </div>
              </div>

              {/* Bull vs Bear */}
              <div className="bg-white rounded-xl border border-[#ebecef] p-3.5 space-y-2.5">
                <div className="text-xs font-bold text-[#1e222b]">Institutional Bull vs. Bear Thesis</div>
                
                <div className="space-y-1 bg-[#f9fbf9] p-2.5 rounded-lg border-l-2 border-[#00875A]">
                  <div className="text-[11px] font-bold text-[#00875A]">The Bull Case</div>
                  <p className="text-xs text-[#44475b] leading-relaxed">{data.bull_vs_bear.bull_case}</p>
                </div>

                <div className="space-y-1 bg-[#fffaf9] p-2.5 rounded-lg border-l-2 border-[#EB5B3C]">
                  <div className="text-[11px] font-bold text-[#EB5B3C]">The Bear Case</div>
                  <p className="text-xs text-[#44475b] leading-relaxed">{data.bull_vs_bear.bear_case}</p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: FINANCIALS */}
          {activeTab === 'financials' && (
            <div className="space-y-3">
              {/* Trajectory */}
              <div className="bg-white rounded-xl border border-[#ebecef] p-3.5 space-y-2">
                <div className="text-xs font-bold text-[#1e222b]">Growth Trajectory (3Y CAGR)</div>
                <div className="grid grid-cols-2 gap-2 text-center py-1">
                  <div className="bg-[#f5f6f8] p-2 rounded-lg">
                    <div className="text-[10px] text-[#7c7e8c]">Sales CAGR</div>
                    <div className="text-sm font-bold font-mono text-[#00875A] mt-0.5">
                      +{data.trajectory['3yr_sales_cagr_pct']}%
                    </div>
                  </div>
                  <div className="bg-[#f5f6f8] p-2 rounded-lg">
                    <div className="text-[10px] text-[#7c7e8c]">PAT CAGR</div>
                    <div className="text-sm font-bold font-mono text-[#00875A] mt-0.5">
                      +{data.trajectory['3yr_pat_cagr_pct']}%
                    </div>
                  </div>
                </div>
                <p className="text-xs text-[#7c7e8c] leading-relaxed">{data.trajectory.margin_trend}</p>
              </div>

              {/* Cash Quality (CFO vs PAT) */}
              <div className="bg-white rounded-xl border border-[#ebecef] p-3.5 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#1e222b]">Cash Flow Quality</span>
                  <span className="text-[11px] font-mono font-bold text-[#00875A]">
                    {Math.round(data.cash_quality.cash_conversion_ratio * 100)}% Conversion
                  </span>
                </div>
                <p className="text-xs text-[#44475b] leading-relaxed">
                  CFO: ₹{data.cash_quality.cfo_ttm_cr} Cr vs. Reported PAT: ₹{data.cash_quality.pat_ttm_cr} Cr. Free Cash Flow: ₹{data.cash_quality.free_cash_flow_cr} Cr.
                </p>
                <div className="text-[11px] text-[#7c7e8c] bg-[#f5f6f8] p-2 rounded-lg">
                  Verdict: <strong>{data.cash_quality.verdict}</strong>
                </div>
              </div>

              {/* Balance Sheet */}
              <div className="bg-white rounded-xl border border-[#ebecef] p-3.5 space-y-2">
                <div className="text-xs font-bold text-[#1e222b]">Balance Sheet Structure</div>
                <div className="flex items-center justify-between text-xs py-1">
                  <span className="text-[#7c7e8c]">Debt-to-Equity:</span>
                  <span className="font-mono font-bold text-[#1e222b]">{data.balance_sheet.debt_to_equity}</span>
                </div>
                <div className="flex items-center justify-between text-xs py-1 border-t border-[#f5f6f8]">
                  <span className="text-[#7c7e8c]">Cash & Equivalents:</span>
                  <span className="font-mono font-bold text-[#00875A]">₹{data.balance_sheet.cash_equivalents_cr} Cr</span>
                </div>
                <div className="flex items-center justify-between text-xs py-1 border-t border-[#f5f6f8]">
                  <span className="text-[#7c7e8c]">Working Capital Cycle:</span>
                  <span className="font-mono text-[#1e222b]">{data.balance_sheet.working_capital_days} days</span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: GUIDANCE & REALITY */}
          {activeTab === 'guidance' && (
            <div className="space-y-3">
              {/* Guidance Batting Average Header */}
              {data.credibility_scorecard && (
                <div className="bg-white rounded-xl border border-[#ebecef] p-3 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-[#1e222b]">Management Batting Average</div>
                      <div className="text-[11px] text-[#7c7e8c]">{data.credibility_scorecard.verdict}</div>
                    </div>
                    <div className={`text-base font-bold font-mono ${
                      data.credibility_scorecard.batting_average_pct >= 80 
                        ? 'text-[#00875A]' 
                        : data.credibility_scorecard.batting_average_pct >= 60 
                        ? 'text-amber-600' 
                        : 'text-[#EB5B3C]'
                    }`}>
                      {data.credibility_scorecard.batting_average_pct}%
                    </div>
                  </div>
                  <p className="text-[11px] text-[#7c7e8c] leading-snug border-t border-[#f5f6f8] pt-1.5">
                    {data.credibility_scorecard.summary}
                  </p>
                </div>
              )}

              {/* Narrative vs Numbers 4 Quarters */}
              <div className="bg-white rounded-xl border border-[#ebecef] divide-y divide-[#f5f6f8] overflow-hidden">
                {data.narrative_vs_numbers.map((q) => {
                  const isMiss = q.verdict === 'MISSED';
                  const isDiverged = q.verdict === 'DIVERGED';
                  const bgClass = isMiss ? 'bg-[#fffaf9]/60' : isDiverged ? 'bg-[#fffdf8]/60' : '';

                  return (
                    <div key={q.quarter} className={`p-3.5 space-y-1.5 ${bgClass}`}>
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-[#1e222b] font-mono">{q.quarter}</span>
                        {getVerdictBadge(q.verdict, q.divergence_score)}
                      </div>

                      <div className="text-xs text-[#7c7e8c]">
                        <strong>Promise:</strong> {q.management_guidance}
                      </div>
                      <div className="text-xs text-[#1e222b]">
                        <strong>Delivered:</strong> {q.actual_delivered}
                      </div>
                      <div className="text-[11px] text-[#44475b] bg-[#f5f6f8] p-2 rounded-lg mt-1">
                        <em>Takeaway:</em> {q.analyst_takeaway}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Concall Hot Seat (Unscripted Q&A) */}
              {data.concall_qa && data.concall_qa.length > 0 && (
                <ConcallStressTestModule symbol={data.symbol} items={data.concall_qa} />
              )}
            </div>
          )}

          {/* TAB 4: FORENSICS & GOVERNANCE */}
          {activeTab === 'forensics' && (
            <div className="space-y-3">
              {/* Beneish M-Score Radar */}
              <ForensicRadarModule radar={data.forensic_radar} companyName={data.company_name} />

              {/* Footnote Auditor */}
              <ForensicAuditModule symbol={data.symbol} />
            </div>
          )}

          {/* 6. CONTEXTUAL "ASK FINN" TRIGGER BAR */}
          <div className="pt-2">
            <button
              onClick={() => onAskFinn(data.symbol, `Deep Research · ${data.company_name}`)}
              className="w-full py-2.5 px-4 rounded-xl bg-[#1e222b] hover:bg-black text-white text-xs font-semibold flex items-center justify-center space-x-2 transition shadow-xs"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#00D09C]" />
              <span>Ask FINN about {data.company_name}</span>
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
};
