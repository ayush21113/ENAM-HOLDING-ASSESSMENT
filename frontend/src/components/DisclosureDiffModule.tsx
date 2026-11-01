import React from 'react';
import { DisclosureDiffItem } from '../types';
import { GitCompare, ArrowRight, ShieldCheck, AlertCircle, Sparkles } from 'lucide-react';

interface DisclosureDiffModuleProps {
  diffs?: DisclosureDiffItem[];
  companyName: string;
}

export const DisclosureDiffModule: React.FC<DisclosureDiffModuleProps> = ({
  diffs,
  companyName
}) => {
  if (!diffs || diffs.length === 0) {
    return (
      <div className="py-8 text-center text-xs text-[#7C7E8C]">
        No semantic disclosure variations detected between recent quarters.
      </div>
    );
  }

  const getShiftBadge = (severity: string, shift: string) => {
    switch (severity) {
      case 'positive':
        return (
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">
            {shift}
          </span>
        );
      case 'attention':
        return (
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-50 text-amber-700 border border-amber-200">
            {shift}
          </span>
        );
      default:
        return (
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-neutral-100 text-neutral-600 border border-neutral-200">
            {shift}
          </span>
        );
    }
  };

  return (
    <div className="space-y-4">
      {/* Banner */}
      <div className="p-3.5 rounded-xl bg-[#F5F6F8] border border-[#EBECEF] flex items-start space-x-3">
        <div className="w-7 h-7 rounded-lg bg-[#00D09C]/15 flex items-center justify-center text-[#00875A] shrink-0 mt-0.5">
          <GitCompare className="w-4 h-4" />
        </div>
        <div>
          <div className="flex items-center space-x-2">
            <h4 className="text-xs font-bold text-[#1F2937]">Semantic Concall & Disclosure Diff</h4>
            <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.2 bg-[#00D09C]/10 text-[#00875A] rounded">
              Linguistic Radar
            </span>
          </div>
          <p className="text-[11px] text-[#7C7E8C] mt-0.5 leading-relaxed">
            Tracks subtle quarterly adjustments in management's spoken guidance, omitted risk factors, and capex milestones across sequential earnings calls.
          </p>
        </div>
      </div>

      {/* Diff Items */}
      <div className="space-y-3">
        {diffs.map((diff, idx) => (
          <div 
            key={idx}
            className="p-4 rounded-xl bg-white border border-[#EBECEF] hover:border-[#00D09C]/40 transition-colors space-y-3"
          >
            {/* Header */}
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#1F2937]">{diff.category}</span>
              {getShiftBadge(diff.severity, diff.semantic_shift)}
            </div>

            {/* Side by side / Stacked comparison */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              {/* Prior Quarter */}
              <div className="p-2.5 rounded-lg bg-[#F9FAFB] border border-[#F3F4F6] space-y-1">
                <div className="flex items-center justify-between text-[10px] text-[#7C7E8C] font-semibold uppercase">
                  <span>{diff.prior_quarter}</span>
                  <span className="text-neutral-400">Baseline Quote</span>
                </div>
                <p className="text-xs text-[#44475B] italic leading-relaxed">
                  "{diff.prior_quote}"
                </p>
              </div>

              {/* Current Quarter */}
              <div className="p-2.5 rounded-lg bg-emerald-50/30 border border-emerald-100/60 space-y-1">
                <div className="flex items-center justify-between text-[10px] text-[#00875A] font-semibold uppercase">
                  <span>{diff.current_quarter}</span>
                  <span className="text-emerald-600 flex items-center space-x-0.5">
                    <Sparkles className="w-2.5 h-2.5" />
                    <span>Latest Update</span>
                  </span>
                </div>
                <p className="text-xs text-[#1F2937] font-medium leading-relaxed">
                  "{diff.current_quote}"
                </p>
              </div>
            </div>

            {/* Institutional Implication */}
            <div className="p-2.5 rounded-lg bg-neutral-50 text-[11px] text-[#44475B] border border-neutral-100 flex items-start space-x-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#7C7E8C] shrink-0 mt-0.5">
                Takeaway:
              </span>
              <span className="leading-snug">{diff.institutional_insight}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
