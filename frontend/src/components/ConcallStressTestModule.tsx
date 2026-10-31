import React from 'react';
import { ConcallQAItem } from '../types';
import { MessageSquareText, HelpCircle, CheckCircle2, AlertCircle, ShieldAlert, Award } from 'lucide-react';

interface ConcallStressTestProps {
  symbol: string;
  items?: ConcallQAItem[];
}

export const ConcallStressTestModule: React.FC<ConcallStressTestProps> = ({ symbol, items = [] }) => {
  if (!items || items.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-8 text-center space-y-2 border border-[#ebecef] shadow-xs">
        <MessageSquareText className="w-8 h-8 text-[#7c7e8c] mx-auto opacity-50" />
        <h4 className="text-sm font-semibold text-[#1e222b]">No transcript Q&A recorded</h4>
        <p className="text-xs text-[#7c7e8c]">
          Upcoming Q2 earnings call transcript will be parsed and stress-tested automatically.
        </p>
      </div>
    );
  }

  const getToneBadge = (tone: string) => {
    switch (tone) {
      case 'DIRECT':
        return (
          <span className="flex items-center space-x-1 text-[10px] font-bold text-[#00875A] bg-[#e8f8f3] px-2 py-0.5 rounded uppercase">
            <CheckCircle2 className="w-3 h-3" />
            <span>Direct & Assertive</span>
          </span>
        );
      case 'CAUTIOUS':
        return (
          <span className="flex items-center space-x-1 text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded uppercase">
            <AlertCircle className="w-3 h-3" />
            <span>Cautious / Hedged</span>
          </span>
        );
      default:
        return (
          <span className="flex items-center space-x-1 text-[10px] font-bold text-[#EB5B3C] bg-[#fdf1ee] px-2 py-0.5 rounded uppercase">
            <ShieldAlert className="w-3 h-3" />
            <span>Evasive / Deflective</span>
          </span>
        );
    }
  };

  return (
    <div className="space-y-3">
      {/* Overview Card */}
      <div className="bg-[#f5f6f8] rounded-xl p-3.5 flex items-center justify-between">
        <div>
          <div className="text-[11px] text-[#7c7e8c] font-medium uppercase tracking-wider">
            Unscripted Concall Scrutiny
          </div>
          <div className="text-sm font-bold text-[#1e222b] mt-0.5">
            Analyst Q&A Stress-Test ("The Hot Seat")
          </div>
        </div>
        <span className="text-xs font-bold text-[#00875A] bg-[#e8f8f3] px-2.5 py-1 rounded-full border border-[#00D09C]/30">
          AlphaSense Benchmark
        </span>
      </div>

      <p className="text-xs text-[#7c7e8c] leading-relaxed">
        Prepared management remarks are public relations; alpha lives in unscripted analyst grilling. FINN isolates the most contentious Q&A exchanges from the latest concall:
      </p>

      {/* List of Q&A Items (Groww list style) */}
      <div className="divide-y divide-[#f5f6f8] border border-[#ebecef] rounded-xl overflow-hidden bg-white shadow-xs">
        {items.map((qa, idx) => (
          <div key={idx} className="p-4 space-y-2.5 hover:bg-[#fafbfd] transition">
            {/* Meta Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="font-bold text-xs text-[#1e222b]">
                  {qa.analyst_name}
                </span>
                <span className="text-[11px] text-[#7c7e8c]">
                  ({qa.brokerage_firm})
                </span>
              </div>
              {getToneBadge(qa.tone_verdict)}
            </div>

            {/* Topic pill */}
            <div className="inline-block bg-[#f5f6f8] text-[#1e222b] text-[10px] font-semibold px-2 py-0.5 rounded font-mono">
              Topic: {qa.topic}
            </div>

            {/* Analyst Question */}
            <div className="bg-[#fff9f6] border-l-2 border-[#EB5B3C] p-2.5 rounded-r-lg space-y-1">
              <div className="text-[10px] font-bold text-[#EB5B3C] uppercase tracking-wider flex items-center gap-1">
                <HelpCircle className="w-3 h-3" />
                Analyst Question (Under Scrutiny)
              </div>
              <p className="text-xs font-medium text-[#1e222b] italic">
                "{qa.question_summary}"
              </p>
            </div>

            {/* Management Response */}
            <div className="bg-[#f5f6f8] p-2.5 rounded-lg space-y-1">
              <div className="text-[10px] font-bold text-[#00875A] uppercase tracking-wider flex items-center gap-1">
                <Award className="w-3 h-3" />
                Management Verbatim Response
              </div>
              <p className="text-xs text-[#44475b] leading-relaxed">
                "{qa.management_response}"
              </p>
            </div>

            {/* Institutional Takeaway */}
            <div className="text-[11px] text-[#1e222b] bg-white border border-[#ebecef] p-2.5 rounded-lg flex items-start gap-1.5">
              <strong className="text-[#00875A] shrink-0 font-bold">Institutional Takeaway:</strong>
              <span className="text-[#44475b] leading-relaxed">{qa.institutional_takeaway}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
