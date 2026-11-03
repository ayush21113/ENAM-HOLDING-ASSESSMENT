import React, { useState } from 'react';
import { StockEOD } from '../types';
import { Search } from 'lucide-react';

interface WatchlistViewProps {
  stocks: StockEOD[];
  loading: boolean;
  onSelectTicker: (symbol: string) => void;
}

export const WatchlistView: React.FC<WatchlistViewProps> = ({
  stocks,
  loading,
  onSelectTicker,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = stocks.filter((s) => {
    const q = searchTerm.toLowerCase();
    return s.symbol.toLowerCase().includes(q) || s.name.toLowerCase().includes(q);
  });

  return (
    <div className="space-y-3 pb-24 max-w-md mx-auto">
      {/* Header & Quick Search */}
      <div className="space-y-2 pt-1">
        <div className="flex items-center justify-between px-0.5">
          <h1 className="text-base font-bold text-[#1e222b] tracking-tight">Watchlist</h1>
          <span className="text-xs text-[#7c7e8c] font-medium font-mono">
            {stocks.length} holdings
          </span>
        </div>

        {/* Minimal Contextual Search */}
        <div className="relative flex items-center">
          <Search className="w-4 h-4 absolute left-3 text-[#7c7e8c] pointer-events-none" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search company or ticker..."
            className="w-full bg-white border border-[#ebecef] rounded-xl pl-10 pr-3 py-2 text-xs text-[#1e222b] placeholder-[#7c7e8c] focus:outline-none focus:border-[#00875A] transition"
          />
        </div>
      </div>

      {/* Clean Scannable Stock List */}
      {loading ? (
        <div className="py-16 text-center text-xs text-[#7c7e8c]">
          Fetching latest market prices...
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-xl border border-[#ebecef] p-8 text-center text-xs text-[#7c7e8c]">
          No companies found matching "{searchTerm}".
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-[#ebecef] divide-y divide-[#f5f6f8] overflow-hidden">
          {filtered.map((stock) => {
            const isPositive = stock.change_pct >= 0;
            const isVolumeSpike = stock.volume_multiple >= 2.0;

            return (
              <div
                key={stock.symbol}
                onClick={() => onSelectTicker(stock.symbol)}
                className="p-3.5 flex items-center justify-between cursor-pointer hover:bg-[#fafbfd] transition active:bg-[#f5f6f8]"
              >
                {/* Left: Ticker & Company */}
                <div className="min-w-0 pr-2">
                  <div className="font-bold text-xs text-[#1e222b] font-mono tracking-tight">
                    {stock.symbol.replace('.NS', '')}
                  </div>
                  <div className="text-xs text-[#7c7e8c] truncate max-w-[180px]">
                    {stock.name}
                  </div>
                </div>

                {/* Right: Price & Move */}
                <div className="text-right shrink-0">
                  <div className="text-xs font-bold font-mono text-[#1e222b]">
                    ₹{stock.price.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </div>

                  <div className="flex items-center justify-end space-x-1.5 pt-0.5">
                    <span
                      className={`text-[11px] font-semibold font-mono ${
                        isPositive ? 'text-[#00875A]' : 'text-[#EB5B3C]'
                      }`}
                    >
                      {isPositive ? '+' : ''}{stock.change_pct}%
                    </span>

                    {/* Only show meaningful state indicator when abnormal */}
                    {isVolumeSpike && (
                      <span className="text-[10px] font-bold text-amber-600 font-mono">
                        · {stock.volume_multiple}x vol
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
