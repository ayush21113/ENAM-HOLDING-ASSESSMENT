import React from 'react';
import { TriggeredAlert, UserSettings } from '../types';
import { Bell, ArrowUpRight, Sliders } from 'lucide-react';

interface AlertsViewProps {
  alerts: TriggeredAlert[];
  settings: UserSettings;
  onOpenSettings: () => void;
  onSelectTicker: (symbol: string) => void;
}

export const AlertsView: React.FC<AlertsViewProps> = ({
  alerts,
  settings,
  onOpenSettings,
  onSelectTicker,
}) => {
  return (
    <div className="space-y-3 pb-24 max-w-md mx-auto">
      {/* Header with trigger adjustment */}
      <div className="flex items-center justify-between pt-1 px-0.5">
        <div>
          <h1 className="text-base font-bold text-[#1e222b] tracking-tight">Alerts Inbox</h1>
          <p className="text-xs text-[#7c7e8c]">
            {alerts.length} active triggers (Price &gt; ±{settings.price_threshold_pct}%, Vol &gt; {settings.volume_multiplier}x)
          </p>
        </div>

        <button
          onClick={onOpenSettings}
          className="text-xs font-semibold text-[#00875A] hover:underline flex items-center gap-1"
        >
          <Sliders className="w-3 h-3" />
          <span>Adjust</span>
        </button>
      </div>

      {/* Inbox List */}
      {alerts.length === 0 ? (
        <div className="bg-white rounded-xl border border-[#ebecef] p-10 text-center text-xs text-[#7c7e8c] space-y-2">
          <Bell className="w-6 h-6 text-[#7c7e8c] mx-auto opacity-40" />
          <p className="font-semibold text-[#1e222b]">Inbox Zero</p>
          <p>All portfolio stocks are within your threshold volatility bands.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-[#ebecef] divide-y divide-[#f5f6f8] overflow-hidden">
          {alerts.map((al) => {
            const isPrice = al.alert_type.includes('PRICE');
            const isVol = al.alert_type.includes('VOLUME');

            return (
              <div
                key={al.id}
                onClick={() => onSelectTicker(al.symbol)}
                className="p-3.5 space-y-1.5 hover:bg-[#fafbfd] cursor-pointer transition active:bg-[#f5f6f8]"
              >
                {/* 1. Header: WHAT & WHEN */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1.5">
                    <span className="font-bold text-xs text-[#1e222b] font-mono">
                      {al.symbol.replace('.NS', '')}
                    </span>
                    <span className="text-xs text-[#7c7e8c]">·</span>
                    <span className="text-xs text-[#7c7e8c]">
                      {al.company_name}
                    </span>
                  </div>

                  <span className="text-[11px] text-[#7c7e8c]">
                    {al.timestamp}
                  </span>
                </div>

                {/* 2. WHAT HAPPENED */}
                <div className="text-xs font-semibold text-[#1e222b]">
                  {al.title}
                </div>

                {/* 3. WHY IT MATTERS */}
                <p className="text-xs text-[#44475b] leading-relaxed">
                  {al.description}
                </p>

                {/* 4. WHAT TO DO NEXT */}
                <div className="pt-1 flex items-center justify-between text-[11px]">
                  <span className={`font-semibold flex items-center gap-1 ${
                    isPrice ? 'text-[#00875A]' : isVol ? 'text-amber-700' : 'text-[#1e222b]'
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${
                      isPrice ? 'bg-[#00875A]' : isVol ? 'bg-amber-500' : 'bg-neutral-500'
                    }`} />
                    <span>{al.alert_type.replace('_', ' ')}</span>
                  </span>

                  <span className="text-[#00875A] font-semibold flex items-center gap-0.5 hover:underline">
                    Investigate <ArrowUpRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
