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
      badge: "01 · DAILY FEED",
      icon: <Radio className="w-5 h-5 text-[#00D09C]" />,
      title: "Catch what matters today",
      desc: "Skip the filing spam. See big market moves, key announcements, and a 60-second audio brief each morning."
    },
    {
      badge: "02 · WATCHLIST",
      icon: <TrendingUp className="w-5 h-5 text-[#00D09C]" />,
      title: "Your holdings, zero clutter",
      desc: "Track prices live without messy spreadsheets. Get instant heads-up whenever a stock surges or volumes spike."
    },
    {
      badge: "03 · REALITY CHECK",
      icon: <Sparkles className="w-5 h-5 text-[#00D09C]" />,
      title: "Did management keep their word?",
      desc: "We check past concall promises against actual reported numbers, so you know who delivers and who doesn't."
    },
    {
      badge: "04 · AI COPILOT",
      icon: <ShieldAlert className="w-5 h-5 text-[#00D09C]" />,
      title: "Cut through the concall fluff",
      desc: "Jump straight to tough analyst questions, or ask FINN anything and get answers backed by official filings."
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
