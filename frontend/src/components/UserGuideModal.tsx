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
      desc: "Filters out 80% routine compliance noise to surface critical breakouts and Tier-1 earnings deltas."
    },
    {
      badge: "Step 2 of 4 · Portfolio & Alerts",
      icon: <TrendingUp className="w-5 h-5 text-[#00D09C]" />,
      title: "Clean Watchlist",
      desc: "Tracks 18 Indian holdings with live prices, alerting instantly on ±3% swings or >2x volume spikes."
    },
    {
      badge: "Step 3 of 4 · Core USP",
      icon: <Sparkles className="w-5 h-5 text-[#00D09C]" />,
      title: "Narrative vs Reality Audit",
      desc: "Matches management promises from 4 quarters ago against actual reported numbers with Batting Average."
    },
    {
      badge: "Step 4 of 4 · Forensics & Copilot",
      icon: <ShieldAlert className="w-5 h-5 text-[#00D09C]" />,
      title: "Hot Seat & AI Copilot",
      desc: "Highlights unscripted concall analyst grilling with tone detection, backed by primary-source AI Q&A."
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="w-full max-w-sm bg-white rounded-2xl shadow-xl border border-[#ebecef] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-[#f5f6f8] flex items-center justify-between bg-[#fafbfd]">
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

        {/* Content Body: Max 2 lines */}
        <div className="p-5 space-y-2">
          <h2 className="text-base font-bold text-[#1e222b] tracking-tight">
            {s.title}
          </h2>
          <p className="text-xs text-[#525666] leading-relaxed">
            {s.desc}
          </p>
        </div>

        {/* Footer with Step Dots & Controls */}
        <div className="px-5 py-3.5 border-t border-[#f5f6f8] bg-[#fafbfd] flex items-center justify-between">
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
                className="px-2.5 py-1.5 text-xs font-semibold text-[#7c7e8c] hover:text-[#1e222b] transition flex items-center gap-0.5"
              >
                <ChevronLeft className="w-3.5 h-3.5" /> Back
              </button>
            )}

            <button
              onClick={handleNext}
              className="px-3.5 py-1.5 bg-[#1e222b] hover:bg-black text-white text-xs font-bold rounded-xl transition shadow-xs flex items-center gap-1"
            >
              <span>{currentStep === steps.length - 1 ? "Get Started" : "Next"}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
