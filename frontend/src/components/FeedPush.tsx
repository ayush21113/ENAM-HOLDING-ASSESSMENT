import React from 'react';
import { Announcement } from '../types';
import { ArrowUpRight, UserCheck, FileText, ExternalLink, Sparkles, Inbox } from 'lucide-react';

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
  const categories = [
    { id: 'all', label: 'All filings' },
    { id: 'results', label: 'Results' },
    { id: 'management_change', label: 'Management' },
    { id: 'M&A', label: 'M&A' },
    { id: 'capex', label: 'Capex' },
    { id: 'credit_rating', label: 'Credit rating' },
    { id: 'litigation', label: 'Litigation' },
    { id: 'insider_trading', label: 'Insider trading' },
    { id: 'unclassified', label: 'Routine (Tier 3)' },
  ];

  const getCategoryBadgeClass = (category: string) => {
    switch (category) {
      case 'results':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      case 'management_change':
        return 'bg-purple-50 text-purple-800 border-purple-200';
      case 'M&A':
        return 'bg-blue-50 text-blue-800 border-blue-200';
      case 'capex':
        return 'bg-teal-50 text-teal-800 border-teal-200';
      case 'litigation':
        return 'bg-red-50 text-red-800 border-red-200';
      case 'credit_rating':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'insider_trading':
        return 'bg-orange-50 text-orange-800 border-orange-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="space-y-4 pb-20">
      {/* Digest Window Controls */}
      <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-card space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-semibold text-gray-900 tracking-tight">Digest window</span>
            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded border border-gray-200">
              {announcements.length} disclosures
            </span>
          </div>

          {/* Window Picker */}
          <div className="flex bg-gray-100 rounded-lg p-0.5 border border-gray-200 text-xs font-medium">
            {[
              { val: 24, label: '24 hours' },
              { val: 72, label: '3 days' },
              { val: 168, label: '7 days' },
            ].map((item) => (
              <button
                key={item.val}
                onClick={() => setWindowHours(item.val)}
                className={`px-2.5 py-1 rounded transition ${
                  windowHours === item.val
                    ? 'bg-white text-gray-900 font-semibold shadow-subtle'
                    : 'text-gray-600 hover:text-gray-900'
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
              className={`px-3 py-1 rounded-full whitespace-nowrap text-xs transition border font-medium ${
                selectedCategory === c.id
                  ? 'bg-gray-900 text-white border-gray-900'
                  : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        {/* Routine Filter Toggle */}
        <div className="pt-2 flex items-center justify-between border-t border-gray-100 text-xs text-gray-600">
          <span>Collapse routine paperwork (ESOP allotments, general certificates)</span>
          <button
            onClick={() => setHideRoutine(!hideRoutine)}
            className={`w-9 h-5 flex items-center rounded-full p-0.5 duration-200 cursor-pointer ${
              hideRoutine ? 'bg-blue-800 justify-end' : 'bg-gray-300 justify-start'
            }`}
          >
            <div className="bg-white w-4 h-4 rounded-full shadow-sm"></div>
          </button>
        </div>
      </div>

      {/* Announcements Stream */}
      {loading ? (
        <div className="py-16 flex flex-col items-center justify-center space-y-2">
          <div className="w-5 h-5 border-2 border-blue-800 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xs text-gray-500 font-medium">Filtering exchange filings...</p>
        </div>
      ) : announcements.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-xl p-8 text-center space-y-2 shadow-card">
          <Inbox className="w-8 h-8 text-gray-400 mx-auto" />
          <h3 className="text-sm font-semibold text-gray-900">No disclosures in this window</h3>
          <p className="text-xs text-gray-500">Expand the window to 3 days or 7 days, or adjust category filters.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {announcements.map((ann) => {
            const isTier1 = ann.tier === 1;

            return (
              <div
                key={ann.id}
                className={`bg-white border rounded-xl p-4 transition-all duration-150 shadow-card ${
                  isTier1
                    ? 'border-gray-300'
                    : 'border-gray-200 opacity-90 hover:opacity-100'
                }`}
              >
                {/* Header: Ticker, Category, Timestamp */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => onSelectTickerForResearch(ann.symbol)}
                      className="font-bold text-xs text-gray-900 bg-gray-100 hover:bg-gray-200 px-2 py-0.5 rounded border border-gray-200 transition font-mono"
                    >
                      {ann.symbol}
                    </button>
                    <span className="text-xs text-gray-600 truncate max-w-[150px]">
                      {ann.company_name}
                    </span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded border ${getCategoryBadgeClass(ann.category)}`}>
                      {ann.category.replace('_', ' ')}
                    </span>
                    <span className="text-xs text-gray-400">{ann.timestamp}</span>
                  </div>
                </div>

                {/* Announcement Headline */}
                <h4 className="text-sm font-semibold text-gray-900 leading-snug mb-1">
                  {ann.title}
                </h4>
                <p className="text-xs text-gray-600 leading-relaxed font-normal">
                  {ann.summary}
                </p>

                {/* ENRICHMENT 1: QUARTERLY RESULTS CARD */}
                {ann.result_data && (
                  <div className="mt-3 bg-gray-50 border border-gray-200 rounded-lg p-3.5 space-y-3">
                    <div className="flex items-center justify-between border-b border-gray-200 pb-2">
                      <div className="flex items-center space-x-1.5 text-xs font-semibold text-gray-900">
                        <Sparkles className="w-3.5 h-3.5 text-blue-800" />
                        <span>First-cut headline numbers ({ann.result_data.quarter})</span>
                      </div>
                      <span className="text-xs bg-white text-gray-700 border border-gray-200 px-2 py-0.5 rounded font-mono font-medium">
                        EBITDA margin: {ann.result_data.ebitda_margin_pct}%
                      </span>
                    </div>

                    {/* Financial Metrics Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                      {/* Revenue */}
                      <div className="bg-white p-2.5 rounded border border-gray-200">
                        <div className="text-xs text-gray-500">Revenue</div>
                        <div className="text-sm font-bold text-gray-900 font-mono mt-0.5">
                          ₹{ann.result_data.revenue_cr.toLocaleString()} Cr
                        </div>
                        <div className="flex items-center gap-2 mt-1 text-xs">
                          <span className={ann.result_data.revenue_qoq_pct >= 0 ? 'text-emerald-700 font-medium' : 'text-red-700 font-medium'}>
                            {ann.result_data.revenue_qoq_pct >= 0 ? '+' : ''}{ann.result_data.revenue_qoq_pct}% QoQ
                          </span>
                          <span className={ann.result_data.revenue_yoy_pct >= 0 ? 'text-emerald-700 font-medium' : 'text-red-700 font-medium'}>
                            {ann.result_data.revenue_yoy_pct >= 0 ? '+' : ''}{ann.result_data.revenue_yoy_pct}% YoY
                          </span>
                        </div>
                      </div>

                      {/* EBITDA */}
                      <div className="bg-white p-2.5 rounded border border-gray-200">
                        <div className="text-xs text-gray-500">EBITDA</div>
                        <div className="text-sm font-bold text-gray-900 font-mono mt-0.5">
                          ₹{ann.result_data.ebitda_cr.toLocaleString()} Cr
                        </div>
                        <div className="flex items-center gap-2 mt-1 text-xs">
                          <span className={ann.result_data.ebitda_qoq_pct >= 0 ? 'text-emerald-700 font-medium' : 'text-red-700 font-medium'}>
                            {ann.result_data.ebitda_qoq_pct >= 0 ? '+' : ''}{ann.result_data.ebitda_qoq_pct}% QoQ
                          </span>
                          <span className={ann.result_data.ebitda_yoy_pct >= 0 ? 'text-emerald-700 font-medium' : 'text-red-700 font-medium'}>
                            {ann.result_data.ebitda_yoy_pct >= 0 ? '+' : ''}{ann.result_data.ebitda_yoy_pct}% YoY
                          </span>
                        </div>
                      </div>

                      {/* PBT */}
                      <div className="bg-white p-2.5 rounded border border-gray-200">
                        <div className="text-xs text-gray-500">PBT</div>
                        <div className="text-sm font-bold text-gray-900 font-mono mt-0.5">
                          ₹{ann.result_data.pbt_cr.toLocaleString()} Cr
                        </div>
                        <div className="flex items-center gap-2 mt-1 text-xs">
                          <span className={ann.result_data.pbt_qoq_pct >= 0 ? 'text-emerald-700 font-medium' : 'text-red-700 font-medium'}>
                            {ann.result_data.pbt_qoq_pct >= 0 ? '+' : ''}{ann.result_data.pbt_qoq_pct}% QoQ
                          </span>
                          <span className={ann.result_data.pbt_yoy_pct >= 0 ? 'text-emerald-700 font-medium' : 'text-red-700 font-medium'}>
                            {ann.result_data.pbt_yoy_pct >= 0 ? '+' : ''}{ann.result_data.pbt_yoy_pct}% YoY
                          </span>
                        </div>
                      </div>

                      {/* PAT */}
                      <div className="bg-white p-2.5 rounded border border-gray-200">
                        <div className="text-xs text-gray-500">PAT (Net profit)</div>
                        <div className="text-sm font-bold text-gray-900 font-mono mt-0.5">
                          ₹{ann.result_data.pat_cr.toLocaleString()} Cr
                        </div>
                        <div className="flex items-center gap-2 mt-1 text-xs">
                          <span className={ann.result_data.pat_qoq_pct >= 0 ? 'text-emerald-700 font-medium' : 'text-red-700 font-medium'}>
                            {ann.result_data.pat_qoq_pct >= 0 ? '+' : ''}{ann.result_data.pat_qoq_pct}% QoQ
                          </span>
                          <span className={ann.result_data.pat_yoy_pct >= 0 ? 'text-emerald-700 font-medium' : 'text-red-700 font-medium'}>
                            {ann.result_data.pat_yoy_pct >= 0 ? '+' : ''}{ann.result_data.pat_yoy_pct}% YoY
                          </span>
                        </div>
                      </div>
                    </div>

                    <p className="text-xs text-gray-700 bg-white p-2.5 rounded border border-gray-200 leading-relaxed font-normal">
                      <span className="font-semibold text-gray-900">Margin context: </span>
                      {ann.result_data.margin_commentary}
                    </p>
                  </div>
                )}

                {/* ENRICHMENT 2: MANAGEMENT CHANGE CARD */}
                {ann.mgmt_data && (
                  <div className="mt-3 bg-purple-50/40 border border-purple-200 rounded-lg p-3.5 space-y-2">
                    <div className="flex items-center justify-between border-b border-purple-100 pb-2">
                      <div className="flex items-center space-x-1.5 text-xs font-semibold text-purple-900">
                        <UserCheck className="w-3.5 h-3.5 text-purple-700" />
                        <span>Leadership transition</span>
                      </div>
                      <span className="text-xs bg-white text-purple-800 border border-purple-200 px-2 py-0.5 rounded font-medium">
                        {ann.mgmt_data.action}
                      </span>
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-gray-900">
                          {ann.mgmt_data.person_name}
                        </span>
                        <span className="text-xs text-purple-800 font-medium">
                          {ann.mgmt_data.new_role}
                        </span>
                      </div>

                      <p className="text-xs text-gray-700 leading-relaxed">
                        {ann.mgmt_data.career_background}
                      </p>

                      {ann.mgmt_data.pedigree_highlights.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {ann.mgmt_data.pedigree_highlights.map((h, idx) => (
                            <span
                              key={idx}
                              className="text-xs bg-white text-gray-700 border border-gray-200 px-2 py-0.5 rounded"
                            >
                              {h}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Card Footer */}
                <div className="mt-3 pt-2.5 border-t border-gray-100 flex items-center justify-between text-xs">
                  <div>
                    {ann.filing_url && (
                      <a
                        href={ann.filing_url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-gray-500 hover:text-gray-800 text-xs flex items-center gap-1 font-medium transition"
                      >
                        <FileText className="w-3 h-3" />
                        Exchange filing
                        <ExternalLink className="w-2.5 h-2.5 opacity-60" />
                      </a>
                    )}
                  </div>

                  <button
                    onClick={() => onSelectTickerForResearch(ann.symbol)}
                    className="text-xs font-semibold text-blue-900 hover:text-blue-700 flex items-center gap-1 transition"
                  >
                    Pull research
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
