import React, { useState } from 'react';
import { Announcement } from '../types';
import { 
  TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight, 
  UserCheck, Briefcase, ChevronDown, ChevronUp, FileText, 
  ExternalLink, Filter, Sparkles, AlertCircle 
} from 'lucide-react';

interface FeedPushProps {
  announcements: Announcement[];
  loading: boolean;
  windowHours: number;
  setWindowHours: (hours: number) => void;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  hideRoutine: boolean;
  setHideRoutine: (hide: boolean) => void;
  onSelectTickerForResearch: (symbol: string) => void;
}

export const FeedPush: React.FC<FeedPushProps> = ({
  announcements,
  loading,
  windowHours,
  setWindowHours,
  selectedCategory,
  setSelectedCategory,
  hideRoutine,
  setHideRoutine,
  onSelectTickerForResearch,
}) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const categories = [
    { id: 'all', label: 'All Filings' },
    { id: 'results', label: 'Results' },
    { id: 'management_change', label: 'Management' },
    { id: 'M&A', label: 'M&A' },
    { id: 'capex', label: 'Capex' },
    { id: 'credit_rating', label: 'Credit Rating' },
    { id: 'litigation', label: 'Litigation' },
    { id: 'insider_trading', label: 'Insider Trading' },
    { id: 'unclassified', label: 'Routine (Tier 3)' },
  ];

  const getCategoryBadgeClass = (category: string) => {
    switch (category) {
      case 'results':
        return 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30';
      case 'management_change':
        return 'bg-purple-500/15 text-purple-400 border-purple-500/30';
      case 'M&A':
        return 'bg-indigo-500/15 text-indigo-400 border-indigo-500/30';
      case 'capex':
        return 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30';
      case 'litigation':
        return 'bg-rose-500/15 text-rose-400 border-rose-500/30';
      case 'credit_rating':
        return 'bg-amber-500/15 text-amber-400 border-amber-500/30';
      case 'insider_trading':
        return 'bg-orange-500/15 text-orange-400 border-orange-500/30';
      default:
        return 'bg-slate-700/40 text-slate-400 border-slate-700';
    }
  };

  return (
    <div className="space-y-4 pb-20">
      {/* Windowed Digest Header Controls */}
      <div className="bg-surface border border-surfaceBorder rounded-2xl p-3.5 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-semibold text-slate-300 tracking-wide uppercase">Digest Window</span>
            <span className="text-[10px] text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-full border border-blue-500/20">
              {announcements.length} Disclosures
            </span>
          </div>

          {/* Window Picker */}
          <div className="flex bg-slate-900 rounded-lg p-0.5 border border-slate-800 text-[11px]">
            {[
              { val: 24, label: '24h' },
              { val: 72, label: '3d' },
              { val: 168, label: '7d' },
            ].map((item) => (
              <button
                key={item.val}
                onClick={() => setWindowHours(item.val)}
                className={`px-2.5 py-1 rounded-md transition font-medium ${
                  windowHours === item.val
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedCategory(c.id)}
              className={`px-3 py-1 rounded-full whitespace-nowrap text-[11px] transition font-medium border ${
                selectedCategory === c.id
                  ? 'bg-slate-100 text-slate-900 border-white'
                  : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:border-slate-700 hover:text-slate-300'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        {/* Routine Filter Toggle */}
        <div className="pt-1 flex items-center justify-between border-t border-slate-800/80 text-xs text-slate-400">
          <span className="text-[11px]">Bury routine compliance / ESOP paperwork</span>
          <button
            onClick={() => setHideRoutine(!hideRoutine)}
            className={`w-9 h-5 flex items-center rounded-full p-1 duration-300 ease-in-out cursor-pointer ${
              hideRoutine ? 'bg-blue-600 justify-end' : 'bg-slate-800 justify-start'
            }`}
          >
            <div className="bg-white w-3.5 h-3.5 rounded-full shadow-md transform"></div>
          </button>
        </div>
      </div>

      {/* Announcements Stream */}
      {loading ? (
        <div className="py-12 flex flex-col items-center justify-center space-y-3">
          <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xs text-slate-400 font-medium">Filtering & Prioritizing Exchange Stream...</p>
        </div>
      ) : announcements.length === 0 ? (
        <div className="bg-surface border border-surfaceBorder rounded-2xl p-8 text-center space-y-2">
          <AlertCircle className="w-8 h-8 text-slate-500 mx-auto" />
          <h3 className="text-sm font-semibold text-slate-300">No disclosures in this window</h3>
          <p className="text-xs text-slate-500">Try switching to the 3d or 7d window, or clear category filters.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {announcements.map((ann) => {
            const isExpanded = expandedId === ann.id;
            const isTier1 = ann.tier === 1;

            return (
              <div
                key={ann.id}
                className={`bg-surface border rounded-2xl p-4 transition-all duration-200 ${
                  isTier1
                    ? 'border-surfaceBorder hover:border-blue-500/40 shadow-sm'
                    : 'border-slate-800/60 opacity-85 hover:opacity-100'
                }`}
              >
                {/* Header: Ticker, Category, Timestamp */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => onSelectTickerForResearch(ann.symbol)}
                      className="font-bold text-xs text-white bg-slate-800 hover:bg-blue-600 hover:text-white px-2 py-0.5 rounded transition flex items-center gap-1"
                    >
                      {ann.symbol}
                      <ArrowUpRight className="w-3 h-3 opacity-60" />
                    </button>
                    <span className="text-[11px] text-slate-400 truncate max-w-[120px]">
                      {ann.company_name}
                    </span>
                  </div>

                  <div className="flex items-center space-x-1.5">
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded border capitalize ${getCategoryBadgeClass(ann.category)}`}>
                      {ann.category.replace('_', ' ')}
                    </span>
                    <span className="text-[10px] text-slate-500">{ann.timestamp}</span>
                  </div>
                </div>

                {/* Announcement Headline */}
                <h4 className="text-sm font-semibold text-slate-100 leading-snug mb-1">
                  {ann.title}
                </h4>
                <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                  {ann.summary}
                </p>

                {/* ENRICHMENT 1: QUARTERLY RESULTS CARD */}
                {ann.result_data && (
                  <div className="mt-3.5 bg-slate-900/90 border border-emerald-500/20 rounded-xl p-3.5 space-y-3">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                      <div className="flex items-center space-x-1.5 text-xs font-bold text-emerald-400">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>First-Cut Headline Performance ({ann.result_data.quarter})</span>
                      </div>
                      <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded font-mono">
                        EBITDA Margin: {ann.result_data.ebitda_margin_pct}%
                      </span>
                    </div>

                    {/* Financial Metrics Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                      {/* Revenue */}
                      <div className="bg-slate-800/40 p-2 rounded-lg border border-slate-800">
                        <div className="text-[10px] text-slate-400 font-medium">Revenue</div>
                        <div className="text-sm font-bold text-white font-mono mt-0.5">
                          ₹{ann.result_data.revenue_cr.toLocaleString()} Cr
                        </div>
                        <div className="flex items-center gap-2 mt-1 text-[10px]">
                          <span className={`flex items-center ${ann.result_data.revenue_qoq_pct >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                            {ann.result_data.revenue_qoq_pct >= 0 ? '+' : ''}{ann.result_data.revenue_qoq_pct}% QoQ
                          </span>
                          <span className={`flex items-center ${ann.result_data.revenue_yoy_pct >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                            {ann.result_data.revenue_yoy_pct >= 0 ? '+' : ''}{ann.result_data.revenue_yoy_pct}% YoY
                          </span>
                        </div>
                      </div>

                      {/* EBITDA */}
                      <div className="bg-slate-800/40 p-2 rounded-lg border border-slate-800">
                        <div className="text-[10px] text-slate-400 font-medium">EBITDA</div>
                        <div className="text-sm font-bold text-white font-mono mt-0.5">
                          ₹{ann.result_data.ebitda_cr.toLocaleString()} Cr
                        </div>
                        <div className="flex items-center gap-2 mt-1 text-[10px]">
                          <span className={`flex items-center ${ann.result_data.ebitda_qoq_pct >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                            {ann.result_data.ebitda_qoq_pct >= 0 ? '+' : ''}{ann.result_data.ebitda_qoq_pct}% QoQ
                          </span>
                          <span className={`flex items-center ${ann.result_data.ebitda_yoy_pct >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                            {ann.result_data.ebitda_yoy_pct >= 0 ? '+' : ''}{ann.result_data.ebitda_yoy_pct}% YoY
                          </span>
                        </div>
                      </div>

                      {/* PBT */}
                      <div className="bg-slate-800/40 p-2 rounded-lg border border-slate-800">
                        <div className="text-[10px] text-slate-400 font-medium">PBT</div>
                        <div className="text-sm font-bold text-white font-mono mt-0.5">
                          ₹{ann.result_data.pbt_cr.toLocaleString()} Cr
                        </div>
                        <div className="flex items-center gap-2 mt-1 text-[10px]">
                          <span className={`flex items-center ${ann.result_data.pbt_qoq_pct >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                            {ann.result_data.pbt_qoq_pct >= 0 ? '+' : ''}{ann.result_data.pbt_qoq_pct}% QoQ
                          </span>
                          <span className={`flex items-center ${ann.result_data.pbt_yoy_pct >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                            {ann.result_data.pbt_yoy_pct >= 0 ? '+' : ''}{ann.result_data.pbt_yoy_pct}% YoY
                          </span>
                        </div>
                      </div>

                      {/* PAT */}
                      <div className="bg-slate-800/40 p-2 rounded-lg border border-slate-800">
                        <div className="text-[10px] text-slate-400 font-medium">PAT (Net Profit)</div>
                        <div className="text-sm font-bold text-white font-mono mt-0.5">
                          ₹{ann.result_data.pat_cr.toLocaleString()} Cr
                        </div>
                        <div className="flex items-center gap-2 mt-1 text-[10px]">
                          <span className={`flex items-center ${ann.result_data.pat_qoq_pct >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                            {ann.result_data.pat_qoq_pct >= 0 ? '+' : ''}{ann.result_data.pat_qoq_pct}% QoQ
                          </span>
                          <span className={`flex items-center ${ann.result_data.pat_yoy_pct >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                            {ann.result_data.pat_yoy_pct >= 0 ? '+' : ''}{ann.result_data.pat_yoy_pct}% YoY
                          </span>
                        </div>
                      </div>
                    </div>

                    <p className="text-[11px] text-slate-300 italic bg-slate-950/60 p-2 rounded border border-slate-800/80">
                      💡 {ann.result_data.margin_commentary}
                    </p>
                  </div>
                )}

                {/* ENRICHMENT 2: MANAGEMENT CHANGE CARD */}
                {ann.mgmt_data && (
                  <div className="mt-3.5 bg-slate-900/90 border border-purple-500/20 rounded-xl p-3.5 space-y-2.5">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                      <div className="flex items-center space-x-1.5 text-xs font-bold text-purple-400">
                        <UserCheck className="w-3.5 h-3.5" />
                        <span>Leadership Transition Enrichment</span>
                      </div>
                      <span className="text-[10px] bg-purple-500/10 text-purple-300 px-2 py-0.5 rounded font-medium">
                        {ann.mgmt_data.action}
                      </span>
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <h5 className="text-xs font-bold text-white">
                          {ann.mgmt_data.person_name}
                        </h5>
                        <span className="text-[11px] text-purple-300 font-medium">
                          {ann.mgmt_data.new_role}
                        </span>
                      </div>

                      <p className="text-xs text-slate-300 leading-relaxed">
                        {ann.mgmt_data.career_background}
                      </p>

                      {ann.mgmt_data.pedigree_highlights.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {ann.mgmt_data.pedigree_highlights.map((h, idx) => (
                            <span
                              key={idx}
                              className="text-[10px] bg-slate-800/80 text-slate-300 border border-slate-700 px-2 py-0.5 rounded"
                            >
                              • {h}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Card Footer: Filing Link and Deep Pull Action */}
                <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-2">
                    {ann.filing_url && (
                      <a
                        href={ann.filing_url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-slate-400 hover:text-blue-400 text-[11px] flex items-center gap-1 transition"
                      >
                        <FileText className="w-3 h-3" />
                        Official Exchange Filing
                        <ExternalLink className="w-2.5 h-2.5 opacity-60" />
                      </a>
                    )}
                  </div>

                  <button
                    onClick={() => onSelectTickerForResearch(ann.symbol)}
                    className="text-[11px] font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1 transition"
                  >
                    Pull Research
                    <ArrowUpRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
