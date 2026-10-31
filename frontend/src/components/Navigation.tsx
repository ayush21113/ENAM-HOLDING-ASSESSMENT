import React from 'react';
import { Radio, PieChart, Search, Bell } from 'lucide-react';

export type TabType = 'push' | 'portfolio' | 'pull' | 'alerts';

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
    { id: 'push' as TabType, label: 'Push Feed', icon: Radio },
    { id: 'portfolio' as TabType, label: 'Portfolio', icon: PieChart },
    { id: 'pull' as TabType, label: 'Research (Pull)', icon: Search },
    { id: 'alerts' as TabType, label: 'Alerts', icon: Bell, badge: alertsCount },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 max-w-md mx-auto md:max-w-none bg-[#0c0e15]/95 backdrop-blur-md border-t border-surfaceBorder py-2 px-3">
      <div className="flex items-center justify-around max-w-md mx-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center py-1 px-3 relative rounded-xl transition ${
                isActive
                  ? 'text-blue-400 font-semibold scale-105'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-2'}`} />
                {tab.badge !== undefined && tab.badge > 0 && (
                  <span className="absolute -top-1.5 -right-2 px-1 py-0.2 bg-rose-500 text-white rounded-full text-[9px] font-bold min-w-[14px] text-center">
                    {tab.badge}
                  </span>
                )}
              </div>
              <span className="text-[11px] mt-1 tracking-tight">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
