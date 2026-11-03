import React, { useState } from 'react';
import { 
  X, ChevronRight, ChevronLeft, Sparkles, 
  TrendingUp, Radio, HelpCircle, ShieldAlert, CheckCircle2 
} from 'lucide-react';

interface UserGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UserGuideModal: React.FC<UserGuideModalProps> = ({ isOpen, onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);

  if (!isOpen) return null;

  const steps = [
    {
      badge: "Step 1 of 4 · Push Signals",
      icon: <Radio className="w-5 h-5 text-[#00D09C]" />,
      title: "Today Command Center",
      subtitle: "Burying the noise, surfacing the 2% that matters.",
      desc: "Investors drown in 40+ filings weekly. FINN collapses 80% routine compliance paperwork (ESOPs, notices) and elevates high-conviction catalysts with automated headline financial extractions (YoY & QoQ deltas).",
      features: [
        "Top 1–2 critical market breakouts & volume spikes",
        "Tier-1 regulatory filings with instant PBT/PAT extraction",
        "60s synthesized audio brief & pre-market IC Morning Memo"
      ]
    },
    {
      badge: "Step 2 of 4 · Portfolio & Alerts",
      icon: <TrendingUp className="w-5 h-5 text-[#00D09C]" />,
      title: "Clean Scannable Watchlist",
      subtitle: "Zero-clutter layout inspired by Groww & Linear.",
      desc: "No overwhelming 20-column desktop grids. Each holding shows exact price, daily move, and clear anomaly indicators. Configure custom threshold triggers in Settings.",
      features: [
        "18 high-conviction Indian companies across diverse sectors",
        "Immediate alert badge on ±3% moves or >2x volume breakout",
        "Tap any company to drill straight into primary research"
      ]
    },
    {
      badge: "Step 3 of 4 · Core USP",
      icon: <Sparkles className="w-5 h-5 text-[#00D09C]" />,
      title: "Narrative vs. Numbers",
      subtitle: "Auditing management promises against delivered reality.",
      desc: "Promoters make big promises on concalls that investors forget. FINN matches management guidance from 4 quarters ago against actual reported numbers with divergence scoring (1 to 5).",
      features: [
        "Batting Average Scorecard (e.g. Tata Motors at 50%)",
        "🔴 MISSED & 🟠 DIVERGED flags with exact quotes",
        "100% grounded in primary BSE/NSE filings & concalls"
      ]
    },
    {
      badge: "Step 4 of 4 · Forensics & Copilot",
      icon: <ShieldAlert className="w-5 h-5 text-[#00D09C]" />,
      title: "Hot Seat & Primary Copilot",
      subtitle: "Dissecting unscripted analyst cross-examinations.",
      desc: "FINN strips the 15-minute scripted PR speech to highlight when analysts corner management, tagging tone as DIRECT, CAUTIOUS, or EVASIVE. Ask FINN any question for source-cited answers.",
      features: [
        "Concall Hot Seat: isolates analyst pressure points",
        "Forensic Radar: Note 34 Related Party deals & M-Score",
        "Ask FINN slide-over sheet grounded in primary filings"
      ]
    }
  ];

  const s = steps[currentStep];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      onClose();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="w-full max-w-sm bg-white rounded-2xl shadow-2xl border border-[#ebecef] overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b border-[#f5f6f8] flex items-center justify-between bg-[#fafbfd]">
          <div className="flex items-center space-x-2">
            <div className="w-7 h-7 rounded-lg bg-[#00D09C]/15 flex items-center justify-center">
              {s.icon}
            </div>
            <span className="text-[11px] font-bold text-[#00875A] tracking-wider uppercase">
              {s.badge}
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-full text-[#7c7e8c] hover:text-[#1e222b] hover:bg-neutral-100 transition"
            aria-label="Close guide"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1">
          <div>
            <h2 className="text-lg font-bold text-[#1e222b] tracking-tight">
              {s.title}
            </h2>
            <p className="text-xs font-semibold text-[#00875A] mt-0.5">
              {s.subtitle}
            </p>
          </div>

          <p className="text-xs text-[#44475b] leading-relaxed">
            {s.desc}
          </p>

          {/* Key Bullet Points */}
          <div className="bg-[#f5f6f8] p-3 rounded-xl border border-[#ebecef] space-y-2">
            <div className="text-[10px] font-bold text-[#7c7e8c] uppercase tracking-wider">
              Key Capabilities:
            </div>
            {s.features.map((feat, idx) => (
              <div key={idx} className="flex items-start space-x-2 text-xs text-[#1e222b]">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#00875A] shrink-0 mt-0.5" />
                <span className="leading-snug">{feat}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer with Step Dots & Controls */}
        <div className="p-4 border-t border-[#f5f6f8] bg-[#fafbfd] flex items-center justify-between">
          {/* Step Indicators */}
          <div className="flex items-center space-x-1.5">
            {steps.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentStep(idx)}
                className={`h-1.5 rounded-full transition-all ${
                  currentStep === idx 
                    ? 'w-6 bg-[#00875A]' 
                    : 'w-1.5 bg-[#ebecef] hover:bg-neutral-300'
                }`}
                aria-label={`Go to step ${idx + 1}`}
              />
            ))}
          </div>

          {/* Navigation Buttons */}
          <div className="flex items-center space-x-2">
            {currentStep > 0 && (
              <button
                onClick={handlePrev}
                className="px-3 py-1.5 text-xs font-semibold text-[#7c7e8c] hover:text-[#1e222b] transition flex items-center gap-0.5"
              >
                <ChevronLeft className="w-3.5 h-3.5" /> Back
              </button>
            )}

            <button
              onClick={handleNext}
              className="px-4 py-2 bg-[#1e222b] hover:bg-black text-white text-xs font-bold rounded-xl transition shadow-xs flex items-center gap-1"
            >
              <span>{currentStep === steps.length - 1 ? "Start Researching" : "Next"}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
