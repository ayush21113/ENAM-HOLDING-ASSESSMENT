import React, { useState } from 'react';
import { Announcement, StockEOD } from '../types';
import { 
  Play, Pause, ArrowUpRight, ChevronDown, ChevronUp, 
  Clock, Sparkles, Volume2, Calendar
} from 'lucide-react';

interface TodayViewProps {
  announcements: Announcement[];
  stocks: StockEOD[];
  loading: boolean;
  onSelectTicker: (symbol: string) => void;
  onOpenICMemo?: () => void;
  onAskFinn?: (symbol: string, contextTitle: string) => void;
}

export const TodayView: React.FC<TodayViewProps> = ({
  announcements,
  stocks,
  loading,
  onSelectTicker,
  onOpenICMemo,
  onAskFinn,
}) => {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [showRoutine, setShowRoutine] = useState(false);
  const [expandedFilingId, setExpandedFilingId] = useState<string | null>(null);

  // 1. Identify critical changes (Volume breakouts >= 2x or Price swings >= 3%)
  const criticalMarketMoves = stocks
    .filter((s) => s.volume_multiple >= 2.0 || Math.abs(s.change_pct) >= 3.0)
    .slice(0, 2);

  // 2. Separate material filings (Tier 1) from routine
  const materialFilings = announcements.filter((a) => a.tier === 1);
  const routineFilings = announcements.filter((a) => a.tier !== 1);

  // Audio briefing playback
  const toggleAudio = () => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;

    if (isPlayingAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
    } else {
      window.speechSynthesis.cancel();
      const script = `Good morning. Today's portfolio briefing: ${criticalMarketMoves.length} critical market anomalies and ${materialFilings.length} Tier-one corporate filings require your attention.`;
      const utterance = new SpeechSynthesisUtterance(script);
      utterance.rate = 1.05;
      utterance.onend = () => setIsPlayingAudio(false);
      utterance.onerror = () => setIsPlayingAudio(false);
      window.speechSynthesis.speak(utterance);
      setIsPlayingAudio(true);
    }
  };

  return (
    <div className="space-y-4 pb-24 max-w-md mx-auto">
      {/* 1. TOP PULSE BAR (Minimal, no bulky visualizer) */}
      <div className="flex items-center justify-between pt-1">
        <div>
          <h1 className="text-base font-bold text-[#1e222b] tracking-tight">Today</h1>
          <p className="text-xs text-[#7c7e8c]">
            {criticalMarketMoves.length} market anomalies · {materialFilings.length} material filings
          </p>
        </div>

        {/* Compact Actions */}
        <div className="flex items-center space-x-1.5">
          <button
            onClick={toggleAudio}
            className={`px-2.5 py-1 rounded-full text-xs font-semibold flex items-center space-x-1 transition ${
              isPlayingAudio
                ? 'bg-[#EB5B3C] text-white'
                : 'bg-white border border-[#ebecef] hover:bg-[#f5f6f8] text-[#1e222b]'
            }`}
          >
            {isPlayingAudio ? (
              <>
                <Pause className="w-3 h-3 fill-current" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="w-3 h-3 fill-current text-[#00875A]" />
                <span>60s Audio</span>
              </>
            )}
          </button>

          {onOpenICMemo && (
            <button
              onClick={onOpenICMemo}
              className="px-2.5 py-1 rounded-full text-xs font-semibold bg-white border border-[#ebecef] hover:bg-[#f5f6f8] text-[#1e222b] transition"
            >
              IC Memo
            </button>
          )}
        </div>
      </div>

      {/* 2. CRITICAL PORTFOLIO CHANGES (Top Priority) */}
      {criticalMarketMoves.length > 0 && (
        <section className="space-y-1.5">
          <div className="text-[11px] font-semibold text-[#7c7e8c] uppercase tracking-wider px-0.5">
            Critical Market Movements
          </div>

          <div className="bg-white rounded-xl border border-[#ebecef] divide-y divide-[#f5f6f8] overflow-hidden">
            {criticalMarketMoves.map((stock) => {
              const isVol = stock.volume_multiple >= 2.0;
              const isSurge = stock.change_pct > 0;
              return (
                <div
                  key={stock.symbol}
                  onClick={() => onSelectTicker(stock.symbol)}
                  className="p-3.5 hover:bg-[#fafbfd] cursor-pointer transition flex items-center justify-between"
                >
                  <div className="space-y-0.5 min-w-0 pr-3">
                    <div className="flex items-center space-x-1.5">
                      <span className="font-bold text-xs text-[#1e222b] font-mono">
                        {stock.symbol.replace('.NS', '')}
                      </span>
                      <span className="text-xs text-[#7c7e8c]">·</span>
                      <span className="text-xs text-[#7c7e8c] truncate">
                        {stock.name}
                      </span>
                    </div>

                    <div className="text-xs text-[#1e222b] font-medium">
                      {isVol ? (
                        <span className="text-amber-700">
                          Unusual Volume: <strong className="font-mono">{stock.volume_multiple}x</strong> 20-DMA
                        </span>
                      ) : (
                        <span className={isSurge ? 'text-[#00875A]' : 'text-[#EB5B3C]'}>
                          Price Breakout: {isSurge ? '+' : ''}{stock.change_pct}%
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-xs font-bold text-[#00875A] flex items-center gap-0.5 hover:underline">
                      Investigate <ArrowUpRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* 3. RECENT MATERIAL FILINGS */}
      <section className="space-y-1.5">
        <div className="flex items-center justify-between px-0.5">
          <span className="text-[11px] font-semibold text-[#7c7e8c] uppercase tracking-wider">
            Material Filings
          </span>
          <span className="text-[11px] text-[#7c7e8c]">
            {materialFilings.length} Tier-1
          </span>
        </div>

        {loading ? (
          <div className="py-10 text-center text-xs text-[#7c7e8c]">
            Updating exchange filings...
          </div>
        ) : materialFilings.length === 0 ? (
          <div className="bg-white rounded-xl border border-[#ebecef] p-6 text-center text-xs text-[#7c7e8c]">
            No material Tier-1 filings in this cycle.
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-[#ebecef] divide-y divide-[#f5f6f8] overflow-hidden">
            {materialFilings.map((ann) => {
              const isExpanded = expandedFilingId === ann.id;
              const hasFinancials = Boolean(ann.result_data);

              return (
                <div key={ann.id} className="p-3.5 space-y-2 hover:bg-[#fafbfd] transition">
                  {/* Row Top: Company & Category */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1.5 min-w-0">
                      <span 
                        onClick={() => onSelectTicker(ann.symbol)}
                        className="font-bold text-xs text-[#1e222b] font-mono hover:text-[#00875A] cursor-pointer"
                      >
                        {ann.symbol.replace('.NS', '')}
                      </span>
                      <span className="text-xs text-[#7c7e8c]">·</span>
                      <span className="text-xs text-[#7c7e8c] truncate">
                        {ann.company_name}
                      </span>
                    </div>

                    <span className="text-[11px] font-semibold text-[#00875A] shrink-0 capitalize">
                      {ann.category.replace('_', ' ')}
                    </span>
                  </div>

                  {/* Headline Title */}
                  <div 
                    onClick={() => setExpandedFilingId(isExpanded ? null : ann.id)}
                    className="text-xs font-semibold text-[#1e222b] cursor-pointer leading-snug"
                  >
                    {ann.title}
                  </div>

                  {/* Highlight Metrics (If Quarterly Results) */}
                  {hasFinancials && ann.result_data && (
                    <div className="flex items-center space-x-3 text-[11px] font-mono text-[#1e222b] bg-[#f5f6f8] p-2 rounded-lg">
                      <span>Rev: <strong>₹{ann.result_data.revenue_cr} Cr</strong> ({ann.result_data.revenue_yoy_pct > 0 ? '+' : ''}{ann.result_data.revenue_yoy_pct}%)</span>
                      <span className="text-[#7c7e8c]">|</span>
                      <span>Margin: <strong>{ann.result_data.ebitda_margin_pct}%</strong></span>
                    </div>
                  )}

                  {/* Expanded Detail Drawer */}
                  {isExpanded && (
                    <div className="pt-2 text-xs text-[#44475b] leading-relaxed space-y-2 border-t border-[#f5f6f8]">
                      <p>{ann.summary}</p>

                      <div className="flex items-center justify-between pt-1">
                        {ann.filing_url ? (
                          <a
                            href={ann.filing_url}
                            target="_blank"
                            rel="noreferrer"
                            className="text-[11px] text-[#7c7e8c] hover:text-[#1e222b] underline"
                          >
                            View raw BSE filing ↗
                          </a>
                        ) : <span />}

                        {onAskFinn && (
                          <button
                            onClick={() => onAskFinn(ann.symbol, ann.title)}
                            className="text-xs font-semibold text-[#00875A] flex items-center gap-1 hover:underline"
                          >
                            <Sparkles className="w-3 h-3" />
                            Analyze impact with Pulse
                          </button>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Row Bottom: Time & Action */}
                  <div className="flex items-center justify-between text-[11px] text-[#7c7e8c] pt-0.5">
                    <span>{ann.timestamp}</span>
                    <button
                      onClick={() => setExpandedFilingId(isExpanded ? null : ann.id)}
                      className="text-[#7c7e8c] hover:text-[#1e222b] flex items-center gap-0.5"
                    >
                      <span>{isExpanded ? 'Less' : 'Details'}</span>
                      {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* 4. UPCOMING KEY CATALYST (1 Highlight Row) */}
      <section className="space-y-1.5">
        <div className="text-[11px] font-semibold text-[#7c7e8c] uppercase tracking-wider px-0.5">
          Upcoming Catalyst
        </div>

        <div 
          onClick={() => onSelectTicker('HAL.NS')}
          className="bg-white rounded-xl border border-[#ebecef] p-3.5 hover:bg-[#fafbfd] cursor-pointer transition flex items-center justify-between"
        >
          <div className="space-y-0.5">
            <div className="flex items-center space-x-1.5">
              <span className="font-bold text-xs text-[#1e222b] font-mono">HAL</span>
              <span className="text-xs text-[#7c7e8c]">· Hindustan Aeronautics</span>
            </div>
            <div className="text-xs text-[#1e222b] font-medium">
              Board Meeting (Financial Results & Interim Dividend)
            </div>
            <div className="text-[11px] text-[#00875A] flex items-center gap-1">
              <Clock className="w-3 h-3" /> Nov 07, 2026 at 14:00 IST
            </div>
          </div>
          <ArrowUpRight className="w-4 h-4 text-[#7c7e8c]" />
        </div>
      </section>

      {/* 5. COLLAPSED ROUTINE PAPERWORK */}
      {routineFilings.length > 0 && (
        <div className="pt-1">
          <button
            onClick={() => setShowRoutine(!showRoutine)}
            className="w-full py-2.5 px-3 bg-white border border-[#ebecef] rounded-xl text-xs font-medium text-[#7c7e8c] hover:text-[#1e222b] flex items-center justify-between transition"
          >
            <span>
              {showRoutine ? 'Hide' : 'Show'} {routineFilings.length} routine compliance & ESOP filings
            </span>
            {showRoutine ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>

          {showRoutine && (
            <div className="mt-2 bg-white rounded-xl border border-[#ebecef] divide-y divide-[#f5f6f8] overflow-hidden">
              {routineFilings.map((ann) => (
                <div key={ann.id} className="p-3 text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#1e222b] font-mono">{ann.symbol.replace('.NS', '')}</span>
                    <span className="text-[10px] text-[#7c7e8c]">{ann.timestamp}</span>
                  </div>
                  <p className="text-[#7c7e8c] text-[11px]">{ann.title}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
