import React from 'react';
import { Newspaper, PieChart, Search, Bell, Sparkles } from 'lucide-react';

export type TabType = 'push' | 'portfolio' | 'copilot' | 'pull' | 'alerts';

interface NavigationProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  alertsCount: number;
}

export const Navigation: React.FC<NavigationProps> = ({
  activeTab,
  setActiveTab,
  alertsCount,
}) => {
  const tabs = [
    { id: 'push' as TabType, label: 'Feed', icon: Newspaper },
    { id: 'portfolio' as TabType, label: 'Holdings', icon: PieChart },
    { id: 'copilot' as TabType, label: 'AI Copilot', icon: Sparkles, isAi: true },
    { id: 'pull' as TabType, label: 'Research', icon: Search },
    { id: 'alerts' as TabType, label: 'Alerts', icon: Bell, badge: alertsCount },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 max-w-md mx-auto md:max-w-none bg-white border-t border-[#ebecef] py-2 px-3 shadow-sm">
      <div className="flex items-center justify-around max-w-md mx-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center py-1 px-2 relative transition ${
                isActive
                  ? 'text-[#00875A]'
                  : 'text-[#7c7e8c] hover:text-[#1e222b]'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-2'} ${tab.isAi && !isActive ? 'text-[#00D09C]' : ''}`} />
                {tab.badge !== undefined && tab.badge > 0 && (
                  <span className="absolute -top-1 -right-2 px-1 py-0.2 bg-[#EB5B3C] text-white rounded-full text-[9px] font-bold min-w-[14px] text-center">
                    {tab.badge}
                  </span>
                )}
                {tab.isAi && (
                  <span className="absolute -top-1 -right-2.5 px-1 py-0.2 bg-[#00D09C] text-white rounded-full text-[8px] font-extrabold uppercase">
                    AI
                  </span>
                )}
              </div>
              <span className={`text-[10px] mt-1 tracking-tight ${isActive ? 'font-bold' : 'font-medium'}`}>
                {tab.label}
              </span>
              {isActive && (
                <span className="w-1 h-1 rounded-full bg-[#00D09C] mt-0.5"></span>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
