import React, { useState } from 'react';
import { Announcement } from '../types';
import { MorningBriefingCard } from './MorningBriefingCard';
import { CatalystCalendarWidget } from './CatalystCalendarWidget';
import { 
  TrendingUp, ArrowUpRight, UserCheck, FileText, 
  ExternalLink, Sparkles, ChevronDown, ChevronUp,
  Building, ShieldAlert, Award, Layers
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

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const categories = [
    { id: 'all', label: 'All' },
    { id: 'results', label: 'Results' },
    { id: 'management_change', label: 'Management' },
    { id: 'M&A', label: 'M&A' },
    { id: 'capex', label: 'Capex' },
    { id: 'credit_rating', label: 'Ratings' },
    { id: 'litigation', label: 'Litigation' },
  ];

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'results':
        return <TrendingUp className="w-4 h-4 text-[#00875A]" />;
      case 'management_change':
        return <UserCheck className="w-4 h-4 text-purple-700" />;
      case 'M&A':
        return <Building className="w-4 h-4 text-blue-700" />;
      case 'capex':
        return <Layers className="w-4 h-4 text-teal-700" />;
      case 'credit_rating':
        return <Award className="w-4 h-4 text-amber-700" />;
      case 'litigation':
        return <ShieldAlert className="w-4 h-4 text-red-600" />;
      default:
        return <FileText className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-3 pb-24">
      {/* 0. 60-SECOND AI MORNING BRIEFING PLAYER */}
      <MorningBriefingCard />

      {/* 1. GROWW-STYLE SUMMARY BAR */}
      <div className="bg-white rounded-2xl p-4 border border-[#ebecef] shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-[11px] text-[#7c7e8c] font-medium uppercase tracking-wider">
              Corporate Disclosures
            </div>
            <div className="text-xl font-bold text-[#1e222b] font-mono mt-0.5 flex items-baseline space-x-1.5">
              <span>{announcements.length} filings</span>
              <span className="text-xs font-normal text-[#00875A]">
                in last {windowHours === 24 ? '24 hours' : windowHours === 72 ? '3 days' : '7 days'}
              </span>
            </div>
          </div>

          {/* Window Picker */}
          <div className="flex bg-[#f5f6f8] rounded-xl p-1 text-xs font-medium">
            {[
              { val: 24, label: '24h' },
              { val: 72, label: '3d' },
              { val: 168, label: '7d' },
            ].map((item) => (
              <button
                key={item.val}
                onClick={() => setWindowHours(item.val)}
                className={`px-2.5 py-1 rounded-lg transition ${
                  windowHours === item.val
                    ? 'bg-white text-[#1e222b] font-bold shadow-xs'
                    : 'text-[#7c7e8c] hover:text-[#1e222b]'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* Filter Chips (Groww Style - No harsh borders) */}
        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedCategory(c.id)}
              className={`px-3 py-1.5 rounded-full whitespace-nowrap text-xs transition font-medium ${
                selectedCategory === c.id
                  ? 'bg-[#1e222b] text-white shadow-xs'
                  : 'bg-[#f5f6f8] text-[#7c7e8c] hover:bg-[#ebecef] hover:text-[#1e222b]'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        {/* Routine toggle */}
        <div className="pt-2 border-t border-[#f5f6f8] flex items-center justify-between text-xs text-[#7c7e8c]">
          <span>Hide routine compliance & ESOP paperwork</span>
          <button
            onClick={() => setHideRoutine(!hideRoutine)}
            className={`w-9 h-5 flex items-center rounded-full p-0.5 duration-200 cursor-pointer ${
              hideRoutine ? 'bg-[#00D09C] justify-end' : 'bg-[#e2e8f0] justify-start'
            }`}
          >
            <div className="bg-white w-4 h-4 rounded-full shadow-xs"></div>
          </button>
        </div>
      </div>

      {/* 1.5 INSTITUTIONAL CATALYST & CONCALL CALENDAR (Quartr / AlphaSense standard) */}
      <CatalystCalendarWidget onSelectTicker={onSelectTickerForResearch} />

      {/* 2. GROWW-STYLE DISCLOSURE STREAM (Clean list rows with subtle dividers, NO bulky boxed cards!) */}
      {loading ? (
        <div className="py-16 flex flex-col items-center justify-center space-y-2">
          <div className="w-5 h-5 border-2 border-[#00D09C] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xs text-[#7c7e8c] font-medium">Updating exchange stream...</p>
        </div>
      ) : announcements.length === 0 ? (
        <div className="bg-white rounded-2xl p-8 text-center space-y-2 border border-[#ebecef] shadow-xs">
          <p className="text-sm font-semibold text-[#1e222b]">No disclosures found</p>
          <p className="text-xs text-[#7c7e8c]">Try expanding the digest window to 3d or 7d.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-[#ebecef] shadow-xs overflow-hidden divide-y divide-[#f5f6f8]">
          {announcements.map((ann) => {
            const isExpanded = expandedId === ann.id;

            return (
              <div key={ann.id} className="transition hover:bg-[#fcfdfd]">
                {/* Clean Row Header */}
                <div
                  onClick={() => toggleExpand(ann.id)}
                  className="p-4 flex items-start justify-between cursor-pointer space-x-3"
                >
                  {/* Left: Clean Circular Category Icon (Groww Style) */}
                  <div className="w-10 h-10 rounded-full bg-[#f5f6f8] flex items-center justify-center shrink-0 mt-0.5">
                    {getCategoryIcon(ann.category)}
                  </div>

                  {/* Middle: Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-sm text-[#1e222b] font-mono tracking-tight">
                        {ann.symbol.replace('.NS', '')}
                      </span>
                      <span className="text-xs text-[#7c7e8c] truncate max-w-[140px]">
                        {ann.company_name}
                      </span>
                    </div>

                    <h4 className="text-xs font-semibold text-[#1e222b] leading-snug mt-1 line-clamp-2">
                      {ann.title}
                    </h4>

                    {/* Meta line: Clean text with dot separator, NO awkward colored outline boxes! */}
                    <div className="flex items-center space-x-1.5 mt-1 text-[11px] text-[#7c7e8c]">
                      <span className="capitalize font-medium text-[#1e222b]">
                        {ann.category.replace('_', ' ')}
                      </span>
                      <span>•</span>
                      <span>{ann.timestamp}</span>
                      <span>•</span>
                      <span>BSE/NSE</span>
                    </div>
                  </div>

                  {/* Right: Groww-style Green/Neutral Delta Badge & Chevron */}
                  <div className="text-right shrink-0 flex flex-col items-end space-y-1">
                    {ann.result_data ? (
                      <span className="text-xs font-bold text-[#00875A] bg-[#e8f8f3] px-2 py-0.5 rounded font-mono">
                        +{ann.result_data.revenue_yoy_pct}% YoY
                      </span>
                    ) : ann.category === 'management_change' ? (
                      <span className="text-[11px] font-semibold text-purple-700 bg-purple-50 px-2 py-0.5 rounded">
                        New C-Suite
                      </span>
                    ) : null}

                    <div className="text-[#7c7e8c] pt-1">
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </div>
                  </div>
                </div>

                {/* Inline Expanded Drawer (Revealed smoothly on click) */}
                {isExpanded && (
                  <div className="px-4 pb-4 pt-1 bg-[#fafbfd] border-t border-[#f5f6f8] space-y-3 animate-in fade-in duration-150">
                    <p className="text-xs text-[#44475b] leading-relaxed">
                      {ann.summary}
                    </p>

                    {/* ENRICHMENT 1: GROWW-STYLE FINANCIAL RESULTS METRICS */}
                    {ann.result_data && (
                      <div className="bg-white rounded-xl p-3.5 border border-[#ebecef] space-y-2.5">
                        <div className="flex items-center justify-between border-b border-[#f5f6f8] pb-2">
                          <span className="text-xs font-bold text-[#1e222b] flex items-center gap-1.5">
                            <Sparkles className="w-3.5 h-3.5 text-[#00875A]" />
                            Financial Performance ({ann.result_data.quarter})
                          </span>
                          <span className="text-xs font-semibold text-[#00875A]">
                            EBITDA Margin: {ann.result_data.ebitda_margin_pct}%
                          </span>
                        </div>

                        {/* Clean 4-Metric Grid */}
                        <div className="grid grid-cols-4 gap-2 text-center text-xs">
                          <div className="bg-[#f5f6f8] p-2 rounded-lg">
                            <div className="text-[10px] text-[#7c7e8c]">Revenue</div>
                            <div className="text-xs font-bold text-[#1e222b] font-mono mt-0.5">
                              ₹{ann.result_data.revenue_cr.toLocaleString()} Cr
                            </div>
                            <div className="text-[10px] text-[#00875A] font-semibold mt-0.5">
                              +{ann.result_data.revenue_yoy_pct}% YoY
                            </div>
                          </div>

                          <div className="bg-[#f5f6f8] p-2 rounded-lg">
                            <div className="text-[10px] text-[#7c7e8c]">EBITDA</div>
                            <div className="text-xs font-bold text-[#1e222b] font-mono mt-0.5">
                              ₹{ann.result_data.ebitda_cr.toLocaleString()} Cr
                            </div>
                            <div className="text-[10px] text-[#00875A] font-semibold mt-0.5">
                              +{ann.result_data.ebitda_yoy_pct}% YoY
                            </div>
                          </div>

                          <div className="bg-[#f5f6f8] p-2 rounded-lg">
                            <div className="text-[10px] text-[#7c7e8c]">PBT</div>
                            <div className="text-xs font-bold text-[#1e222b] font-mono mt-0.5">
                              ₹{ann.result_data.pbt_cr.toLocaleString()} Cr
                            </div>
                            <div className="text-[10px] text-[#00875A] font-semibold mt-0.5">
                              +{ann.result_data.pbt_yoy_pct}% YoY
                            </div>
                          </div>

                          <div className="bg-[#f5f6f8] p-2 rounded-lg">
                            <div className="text-[10px] text-[#7c7e8c]">Net Profit</div>
                            <div className="text-xs font-bold text-[#1e222b] font-mono mt-0.5">
                              ₹{ann.result_data.pat_cr.toLocaleString()} Cr
                            </div>
                            <div className="text-[10px] text-[#00875A] font-semibold mt-0.5">
                              +{ann.result_data.pat_yoy_pct}% YoY
                            </div>
                          </div>
                        </div>

                        <p className="text-xs text-[#44475b] italic bg-[#f5f6f8] p-2 rounded leading-snug">
                          💡 {ann.result_data.margin_commentary}
                        </p>
                      </div>
                    )}

                    {/* ENRICHMENT 2: MANAGEMENT CHANGE DETAILS */}
                    {ann.mgmt_data && (
                      <div className="bg-white rounded-xl p-3.5 border border-[#ebecef] space-y-2">
                        <div className="flex items-center justify-between border-b border-[#f5f6f8] pb-1.5">
                          <span className="text-xs font-bold text-[#1e222b]">
                            {ann.mgmt_data.person_name}
                          </span>
                          <span className="text-xs text-purple-700 font-semibold">
                            {ann.mgmt_data.new_role}
                          </span>
                        </div>
                        <p className="text-xs text-[#44475b] leading-relaxed">
                          {ann.mgmt_data.career_background}
                        </p>
                        {ann.mgmt_data.pedigree_highlights.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 pt-1">
                            {ann.mgmt_data.pedigree_highlights.map((h, i) => (
                              <span key={i} className="text-[11px] bg-[#f5f6f8] text-[#1e222b] px-2 py-0.5 rounded font-medium">
                                • {h}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Action Footers */}
                    <div className="flex items-center justify-between pt-1 text-xs">
                      {ann.filing_url && (
                        <a
                          href={ann.filing_url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[#7c7e8c] hover:text-[#00875A] font-medium flex items-center gap-1 transition"
                        >
                          <FileText className="w-3.5 h-3.5" />
                          View original filing
                          <ExternalLink className="w-3 h-3 opacity-60" />
                        </a>
                      )}

                      <button
                        onClick={() => onSelectTickerForResearch(ann.symbol)}
                        className="px-3 py-1 bg-[#00D09C] hover:bg-[#00B386] text-white rounded-lg font-bold flex items-center gap-1 transition shadow-xs"
                      >
                        Dig into {ann.symbol.replace('.NS', '')}
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
