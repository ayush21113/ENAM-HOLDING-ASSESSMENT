import React, { useState } from 'react';
import { ICMemoResponse } from '../types';
import { FileText, Copy, Check, Download, X, ShieldAlert, TrendingUp, Sparkles, AlertCircle } from 'lucide-react';

interface ICMemoModalProps {
  isOpen: boolean;
  onClose: () => void;
  memo: ICMemoResponse | null;
  loading: boolean;
  onRegenerate: () => void;
}

export const ICMemoModal: React.FC<ICMemoModalProps> = ({
  isOpen,
  onClose,
  memo,
  loading,
  onRegenerate
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    if (!memo) return;
    navigator.clipboard.writeText(memo.markdown_memo);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!memo) return;
    const blob = new Blob([memo.markdown_memo], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `ENAM_IC_Morning_Memo_${new Date().toISOString().slice(0, 10)}.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden border border-[#EBECEF]">
        
        {/* Modal Header */}
        <div className="px-5 py-4 border-b border-[#F5F6F8] flex items-center justify-between bg-white sticky top-0 z-10">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#00D09C]/10 flex items-center justify-center text-[#00875A]">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-sm font-semibold text-[#1F2937]">Pre-Market IC Morning Memo</h3>
                <span className="text-[10px] bg-[#00D09C]/10 text-[#00875A] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider">
                  AI Synthesized
                </span>
              </div>
              <p className="text-[11px] text-[#7C7E8C]">
                Official briefing prepared for ENAM Investment Committee
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-[#7C7E8C] hover:bg-[#F5F6F8] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-5 flex-1 text-[#1F2937]">
          {loading ? (
            <div className="py-20 flex flex-col items-center justify-center space-y-3">
              <div className="w-7 h-7 border-2 border-[#00D09C] border-t-transparent rounded-full animate-spin"></div>
              <p className="text-xs font-medium text-[#7C7E8C]">Synthesizing portfolio catalysts & market stance...</p>
            </div>
          ) : memo ? (
            <>
              {/* Meta strip */}
              <div className="flex flex-wrap items-center justify-between gap-2 p-3 bg-[#F5F6F8] rounded-xl text-xs">
                <div>
                  <span className="text-[#7C7E8C]">Timing: </span>
                  <span className="font-semibold text-[#1F2937]">{memo.generated_at}</span>
                </div>
                <div>
                  <span className="text-[#7C7E8C]">Universe: </span>
                  <span className="font-semibold text-[#1F2937]">{memo.portfolio_symbol_count} Holdings</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <span className="text-[#7C7E8C]">IC Stance: </span>
                  <span className="font-bold text-[#00875A] bg-[#00D09C]/15 px-2 py-0.5 rounded-md">
                    {memo.market_stance}
                  </span>
                </div>
              </div>

              {/* Executive Summary */}
              <div className="space-y-1.5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#7C7E8C]">1. Executive Stance</h4>
                <p className="text-xs leading-relaxed text-[#44475B] bg-white p-3 rounded-xl border border-[#F5F6F8]">
                  {memo.executive_summary}
                </p>
              </div>

              {/* Priority Disclosures */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#7C7E8C]">2. Priority Filing Catalysts</h4>
                  <span className="text-[11px] text-[#00875A] font-semibold">{memo.catalyst_breakdown?.length || 0} Tier-1 Disclosures</span>
                </div>
                <div className="space-y-2">
                  {memo.catalyst_breakdown?.map((cat: any, idx: number) => (
                    <div key={idx} className="p-3 rounded-xl bg-white border border-[#F5F6F8] hover:border-[#00D09C]/30 transition-colors">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold text-[#1F2937]">{cat.symbol?.replace('.NS', '')}</span>
                        <span className="text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded-sm bg-neutral-100 text-neutral-600">
                          {cat.category}
                        </span>
                      </div>
                      <p className="text-xs text-[#44475B] line-clamp-2">{cat.title}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Volume & Price Anomalies */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#7C7E8C]">3. Latest EOD Volume Anomalies</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {memo.volume_anomalies?.map((vol: any, idx: number) => (
                    <div key={idx} className="p-2.5 rounded-xl bg-white border border-[#F5F6F8] flex items-center justify-between">
                      <div>
                        <span className="text-xs font-semibold text-[#1F2937]">{vol.symbol?.replace('.NS', '')}</span>
                        <p className="text-[11px] text-[#7C7E8C]">₹{vol.price?.toLocaleString('en-IN')}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-bold text-[#00875A] bg-[#00D09C]/10 px-2 py-0.5 rounded-md">
                          {vol.volume_multiple}x 20-DMA
                        </span>
                        <p className="text-[10px] text-neutral-500 mt-0.5">{vol.change_pct > 0 ? `+${vol.change_pct}%` : `${vol.change_pct}%`}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Items */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#7C7E8C]">4. Analyst Action Items for Today</h4>
                <div className="p-3 rounded-xl bg-emerald-50/40 border border-emerald-100 space-y-1.5">
                  {memo.analyst_action_items?.map((item: string, idx: number) => (
                    <div key={idx} className="flex items-start space-x-2 text-xs text-neutral-700">
                      <span className="w-4 h-4 rounded-full bg-emerald-600 text-white text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <span className="leading-snug">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-10">
              <AlertCircle className="w-8 h-8 text-neutral-300 mx-auto mb-2" />
              <p className="text-xs text-[#7C7E8C]">Failed to generate Investment Committee memo.</p>
              <button 
                onClick={onRegenerate}
                className="mt-3 text-xs text-[#00875A] font-semibold hover:underline"
              >
                Retry generation
              </button>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-5 py-3.5 border-t border-[#F5F6F8] bg-white flex items-center justify-between">
          <button
            onClick={onRegenerate}
            disabled={loading}
            className="text-xs font-semibold text-[#7C7E8C] hover:text-[#1F2937] transition-colors flex items-center space-x-1"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Re-synthesize</span>
          </button>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleDownload}
              disabled={!memo || loading}
              className="px-3 py-2 rounded-xl border border-[#EBECEF] text-xs font-semibold text-[#44475B] hover:bg-[#F5F6F8] transition-colors flex items-center space-x-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download .md</span>
            </button>
            <button
              onClick={handleCopy}
              disabled={!memo || loading}
              className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition-colors ${
                copied 
                  ? 'bg-[#00875A] text-white' 
                  : 'bg-[#00D09C] hover:bg-[#00b587] text-white'
              }`}
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy IC Memo</span>
                </>
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
