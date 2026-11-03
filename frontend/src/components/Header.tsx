import React from 'react';
import { Sliders, Search, HelpCircle } from 'lucide-react';
import { FinnLogo } from './FinnLogo';

interface HeaderProps {
  openSettings: () => void;
  onSearchClick: () => void;
  onOpenGuide: () => void;
  activeTabTitle?: string;
}

export const Header: React.FC<HeaderProps> = ({
  openSettings,
  onSearchClick,
  onOpenGuide,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-sm border-b border-[#ebecef] px-4 py-2.5">
      <div className="flex items-center justify-between">
        {/* Left: Minimal Pulse Brand */}
        <div className="flex items-center space-x-2">
          <FinnLogo size={28} />
          <div className="flex items-center space-x-1.5">
            <span className="font-extrabold text-sm tracking-tight text-[#1e222b]">
              PULSE
            </span>
            <span className="text-[10px] text-[#7c7e8c] font-medium">
              · ENAM
            </span>
          </div>
        </div>

        {/* Right: Quick Contextual Actions */}
        <div className="flex items-center space-x-1">
          <button
            onClick={onSearchClick}
            className="p-2 rounded-full hover:bg-[#f5f6f8] text-[#7c7e8c] hover:text-[#1e222b] transition"
            aria-label="Search"
            title="Search Companies"
          >
            <Search className="w-4 h-4" />
          </button>

          <button
            onClick={onOpenGuide}
            className="p-2 rounded-full hover:bg-[#f5f6f8] text-[#7c7e8c] hover:text-[#00875A] transition"
            aria-label="User Guide"
            title="Product Tour & Guide"
          >
            <HelpCircle className="w-4 h-4" />
          </button>

          <button
            onClick={openSettings}
            className="p-2 rounded-full hover:bg-[#f5f6f8] text-[#7c7e8c] hover:text-[#1e222b] transition"
            aria-label="Settings"
            title="Settings & Thresholds"
          >
            <Sliders className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
