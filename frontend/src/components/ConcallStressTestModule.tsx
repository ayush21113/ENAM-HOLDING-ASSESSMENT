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
          <span className="flex items-center space-x-1.5 text-xs font-semibold text-[#00875A]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00875A]"></span>
            <span>Direct & Assertive</span>
          </span>
        );
      case 'CAUTIOUS':
        return (
          <span className="flex items-center space-x-1.5 text-xs font-semibold text-amber-600">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
            <span>Cautious / Hedged</span>
          </span>
        );
      default:
        return (
          <span className="flex items-center space-x-1.5 text-xs font-semibold text-[#EB5B3C]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#EB5B3C]"></span>
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
        <span className="text-xs font-semibold text-[#00875A] flex items-center space-x-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#00875A]"></span>
          <span>AlphaSense Benchmark</span>
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

            {/* Topic indicator */}
            <div className="text-[11px] font-mono text-[#7c7e8c]">
              Topic: <span className="font-semibold text-[#1e222b]">{qa.topic}</span>
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
