import React from 'react';
import { Smartphone, Monitor, ShieldCheck, Zap, Sliders, Bell } from 'lucide-react';

interface HeaderProps {
  isMobileFrame: boolean;
  setIsMobileFrame: (val: boolean) => void;
  openSettings: () => void;
  openAlerts: () => void;
  alertsCount: number;
  llmMode: string;
}

export const Header: React.FC<HeaderProps> = ({
  isMobileFrame,
  setIsMobileFrame,
  openSettings,
  openAlerts,
  alertsCount,
  llmMode,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-[#0c0e15]/90 backdrop-blur-md border-b border-surfaceBorder px-4 py-3 flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center font-bold text-white shadow-lg shadow-blue-500/20">
          F
        </div>
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="font-bold text-base tracking-tight text-white flex items-center">
              FINN
              <span className="ml-1.5 px-1.5 py-0.5 text-[10px] font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded">
                ENAM
              </span>
            </h1>
          </div>
          <p className="text-[11px] text-slate-400 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            Primary Intelligence Layer
          </p>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        {/* Router Mode Pill */}
        <div 
          onClick={openSettings}
          title="Click to configure AI routing & thresholds"
          className="cursor-pointer hidden sm:flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-[11px] bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 border border-slate-700 transition"
        >
          <Zap className="w-3 h-3 text-amber-400" />
          <span className="truncate max-w-[140px]">{llmMode.includes('Multi-Model') ? 'AI Router' : 'Heuristic Tier'}</span>
        </div>

        {/* Triggered Alerts Bell */}
        <button
          onClick={openAlerts}
          className="relative p-2 rounded-lg bg-slate-800/60 hover:bg-slate-700 text-slate-300 transition"
          aria-label="Alerts"
        >
          <Bell className="w-4 h-4" />
          {alertsCount > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-white rounded-full text-[10px] font-bold flex items-center justify-center shadow-lg animate-bounce">
              {alertsCount}
            </span>
          )}
        </button>

        {/* Settings Button */}
        <button
          onClick={openSettings}
          className="p-2 rounded-lg bg-slate-800/60 hover:bg-slate-700 text-slate-300 transition"
          aria-label="Settings"
        >
          <Sliders className="w-4 h-4" />
        </button>

        {/* Desktop Frame Switcher */}
        <button
          onClick={() => setIsMobileFrame(!isMobileFrame)}
          title={isMobileFrame ? "Expand to Full View" : "Simulate Mobile Frame"}
          className="hidden md:flex p-2 rounded-lg bg-slate-800/60 hover:bg-slate-700 text-slate-400 hover:text-white transition"
        >
          {isMobileFrame ? <Monitor className="w-4 h-4 text-blue-400" /> : <Smartphone className="w-4 h-4" />}
        </button>
      </div>
    </header>
  );
};
