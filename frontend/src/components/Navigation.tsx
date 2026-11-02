import React from 'react';
import { Compass, TrendingUp, Search, Bell } from 'lucide-react';

export type TabType = 'today' | 'watchlist' | 'research' | 'alerts';

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
    { id: 'today' as TabType, label: 'Today', icon: Compass },
    { id: 'watchlist' as TabType, label: 'Watchlist', icon: TrendingUp },
    { id: 'research' as TabType, label: 'Research', icon: Search },
    { id: 'alerts' as TabType, label: 'Alerts', icon: Bell, badge: alertsCount },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 max-w-md mx-auto md:max-w-none bg-white border-t border-[#ebecef] py-2 px-6 shadow-sm safe-area-pb">
      <div className="flex items-center justify-around max-w-md mx-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center py-1 px-3 relative transition-colors duration-150 ${
                isActive
                  ? 'text-[#00875A]'
                  : 'text-[#7c7e8c] hover:text-[#1e222b]'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-[1.75]'}`} />
                {tab.badge !== undefined && tab.badge > 0 && (
                  <span className="absolute -top-1 -right-2 px-1 py-0.2 bg-[#EB5B3C] text-white rounded-full text-[9px] font-bold min-w-[14px] text-center leading-tight">
                    {tab.badge}
                  </span>
                )}
              </div>
              <span className={`text-[10px] mt-1 tracking-tight ${isActive ? 'font-bold' : 'font-medium'}`}>
                {tab.label}
              </span>
              {isActive && (
                <span className="w-1 h-1 rounded-full bg-[#00875A] mt-0.5"></span>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
