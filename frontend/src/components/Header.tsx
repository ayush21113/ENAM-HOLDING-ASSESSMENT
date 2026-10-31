import React from 'react';
import { Smartphone, Monitor, Sliders, Bell, Search } from 'lucide-react';
import { FinnLogo } from './FinnLogo';

interface HeaderProps {
  isMobileFrame: boolean;
  setIsMobileFrame: (val: boolean) => void;
  openSettings: () => void;
  openAlerts: () => void;
  alertsCount: number;
  llmMode: string;
  onSearchClick?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  isMobileFrame,
  setIsMobileFrame,
  openSettings,
  openAlerts,
  alertsCount,
  llmMode,
  onSearchClick,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white border-b border-[#ebecef] px-4 py-2.5">
      <div className="flex items-center justify-between">
        {/* Left: Groww-style Logo & Subtitle */}
        <div className="flex items-center space-x-2.5">
          <FinnLogo size={34} />
          <div>
            <div className="flex items-center space-x-1.5">
              <span className="font-extrabold text-base tracking-tight text-[#1e222b]">
                FINN
              </span>
              <span className="text-[10px] font-bold text-[#00875A] bg-[#e8f8f3] px-1.5 py-0.2 rounded">
                ENAM
              </span>
            </div>
          </div>
        </div>

        {/* Center/Search Quick trigger */}
        <div 
          onClick={onSearchClick}
          className="cursor-pointer flex-1 mx-3 bg-[#f5f6f8] hover:bg-[#ebecef] text-[#7c7e8c] rounded-full px-3 py-1.5 text-xs flex items-center space-x-2 transition"
        >
          <Search className="w-3.5 h-3.5 text-[#7c7e8c]" />
          <span className="truncate">Search stocks, filings...</span>
        </div>

        {/* Right Action Icons */}
        <div className="flex items-center space-x-1">
          {/* Alerts Bell */}
          <button
            onClick={openAlerts}
            className="relative p-2 rounded-full hover:bg-[#f5f6f8] text-[#1e222b] transition"
            aria-label="Alerts"
          >
            <Bell className="w-4 h-4 text-[#1e222b]" />
            {alertsCount > 0 && (
              <span className="absolute 1 top-1 right-1 w-2 h-2 bg-[#EB5B3C] rounded-full"></span>
            )}
          </button>

          {/* Settings */}
          <button
            onClick={openSettings}
            className="p-2 rounded-full hover:bg-[#f5f6f8] text-[#1e222b] transition"
            aria-label="Settings"
          >
            <Sliders className="w-4 h-4 text-[#1e222b]" />
          </button>

          {/* Device Frame Switcher */}
          <button
            onClick={() => setIsMobileFrame(!isMobileFrame)}
            title={isMobileFrame ? "Expand View" : "Simulate Phone View"}
            className="hidden md:flex p-2 rounded-full hover:bg-[#f5f6f8] text-[#7c7e8c] transition"
          >
            {isMobileFrame ? <Monitor className="w-4 h-4 text-[#00875A]" /> : <Smartphone className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </header>
  );
};
