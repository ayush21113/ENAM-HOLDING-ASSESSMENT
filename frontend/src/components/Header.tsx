import React from 'react';
import { Smartphone, Monitor, Sliders, Bell } from 'lucide-react';

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
    <header className="sticky top-0 z-30 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 rounded-lg bg-blue-900 flex items-center justify-center font-semibold text-white text-sm shadow-subtle">
          F
        </div>
        <div>
          <div className="flex items-center space-x-2">
            <span className="font-bold text-base tracking-tight text-gray-900">
              FINN
            </span>
            <span className="text-xs font-medium text-gray-600 bg-gray-100 border border-gray-200 px-2 py-0.5 rounded">
              ENAM Holdings
            </span>
          </div>
          <p className="text-xs text-gray-500 font-medium">
            Primary Investment Intelligence
          </p>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        {/* Router Status Badge */}
        <button 
          onClick={openSettings}
          title="Configure thresholds & model routing"
          className="hidden sm:flex items-center space-x-1.5 px-2.5 py-1 rounded-md text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-200 transition font-medium"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-blue-700"></span>
          <span className="truncate max-w-[140px]">{llmMode.includes('Multi-Model') ? 'AI Router' : 'Heuristic Mode'}</span>
        </button>

        {/* Alerts Bell */}
        <button
          onClick={openAlerts}
          className="relative p-2 rounded-lg bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-700 transition"
          aria-label="Alerts"
        >
          <Bell className="w-4 h-4" />
          {alertsCount > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-600 text-white rounded-full text-xs font-bold flex items-center justify-center">
              {alertsCount}
            </span>
          )}
        </button>

        {/* Settings Button */}
        <button
          onClick={openSettings}
          className="p-2 rounded-lg bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-700 transition"
          aria-label="Settings"
        >
          <Sliders className="w-4 h-4" />
        </button>

        {/* Device Viewport Switcher */}
        <button
          onClick={() => setIsMobileFrame(!isMobileFrame)}
          title={isMobileFrame ? "Expand to Full Page" : "Simulate Mobile Screen"}
          className="hidden md:flex p-2 rounded-lg bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-600 transition"
        >
          {isMobileFrame ? <Monitor className="w-4 h-4 text-blue-800" /> : <Smartphone className="w-4 h-4" />}
        </button>
      </div>
    </header>
  );
};
