import React, { useState } from 'react';
import { StockEOD } from '../types';
import { TrendingUp, TrendingDown, ArrowUpRight, Search } from 'lucide-react';

interface PortfolioViewProps {
  stocks: StockEOD[];
  loading: boolean;
  onSelectTicker: (symbol: string) => void;
}

export const PortfolioView: React.FC<PortfolioViewProps> = ({
  stocks,
  loading,
  onSelectTicker,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSector, setSelectedSector] = useState<string>('All');

  const sectors = ['All', ...Array.from(new Set(stocks.map((s) => s.sector)))];

  const filteredStocks = stocks.filter((stock) => {
    const matchesSearch =
      stock.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
      stock.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSector = selectedSector === 'All' || stock.sector === selectedSector;
    return matchesSearch && matchesSector;
  });

  return (
    <div className="space-y-3 pb-24">
      {/* 1. GROWW-STYLE PORTFOLIO HEADER */}
      <div className="bg-white rounded-2xl p-4 border border-[#ebecef] shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-[11px] text-[#7c7e8c] font-medium uppercase tracking-wider">
              Holdings & Watchlist
            </div>
            <div className="text-xl font-bold text-[#1e222b] font-mono mt-0.5 flex items-baseline space-x-1.5">
              <span>{stocks.length} Companies</span>
              <span className="text-xs font-normal text-[#00875A]">
                • NSE / BSE Listed
              </span>
            </div>
          </div>
          <span className="px-2.5 py-1 bg-[#f5f6f8] text-[#1e222b] text-xs font-semibold rounded-lg">
            High Conviction
          </span>
        </div>

        {/* Search Input */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-[#7c7e8c]" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search company or ticker..."
            className="w-full bg-[#f5f6f8] rounded-xl pl-9 pr-3 py-2 text-xs text-[#1e222b] placeholder-[#7c7e8c] focus:outline-none focus:bg-white focus:ring-1 focus:ring-[#00D09C] transition"
          />
        </div>

        {/* Sector Filter Chips */}
        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
          {sectors.map((sec) => (
            <button
              key={sec}
              onClick={() => setSelectedSector(sec)}
              className={`px-3 py-1 rounded-full whitespace-nowrap transition font-medium text-xs ${
                selectedSector === sec
                  ? 'bg-[#1e222b] text-white shadow-xs'
                  : 'bg-[#f5f6f8] text-[#7c7e8c] hover:bg-[#ebecef] hover:text-[#1e222b]'
              }`}
            >
              {sec}
            </button>
          ))}
        </div>
      </div>

      {/* 2. GROWW-STYLE STOCK LIST (Clean rows with dividers, NOT boxy cards!) */}
      {loading ? (
        <div className="py-16 flex flex-col items-center justify-center space-y-2">
          <div className="w-5 h-5 border-2 border-[#00D09C] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xs text-[#7c7e8c] font-medium">Fetching live prices & volumes...</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-[#ebecef] shadow-xs overflow-hidden divide-y divide-[#f5f6f8]">
          <div className="px-4 py-2.5 bg-[#fafbfd] border-b border-[#f5f6f8] flex items-center justify-between text-[11px] text-[#7c7e8c] font-medium">
            <span>Company</span>
            <span>Market Price (1D)</span>
          </div>

          {filteredStocks.map((stock) => {
            const isPositive = stock.change_pct >= 0;
            const isVolumeSpike = stock.volume_multiple >= 2.0;
            const initials = stock.symbol.replace('.NS', '').slice(0, 2);

            return (
              <div
                key={stock.symbol}
                onClick={() => onSelectTicker(stock.symbol)}
                className="p-4 flex items-center justify-between cursor-pointer hover:bg-[#fcfdfd] transition"
              >
                {/* Left: Stock Avatar & Name */}
                <div className="flex items-center space-x-3 min-w-0">
                  <div className="w-10 h-10 rounded-full bg-[#f5f6f8] text-[#1e222b] flex items-center justify-center font-bold text-xs shrink-0 font-mono">
                    {initials}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center space-x-1.5">
                      <span className="font-bold text-sm text-[#1e222b] font-mono tracking-tight">
                        {stock.symbol.replace('.NS', '')}
                      </span>
                      {stock.has_active_alert && (
                        <span className="w-1.5 h-1.5 rounded-full bg-[#EB5B3C]"></span>
                      )}
                    </div>
                    <div className="text-xs text-[#7c7e8c] truncate max-w-[150px]">
                      {stock.name}
                    </div>
                  </div>
                </div>

                {/* Right: Price, Change, Volume Multiple */}
                <div className="text-right shrink-0 space-y-0.5">
                  <div className="text-sm font-bold text-[#1e222b] font-mono">
                    ₹{stock.price.toLocaleString()}
                  </div>
                  <div className="flex items-center justify-end space-x-1.5">
                    <span
                      className={`text-xs font-semibold font-mono flex items-center ${
                        isPositive ? 'text-[#00875A]' : 'text-[#EB5B3C]'
                      }`}
                    >
                      {isPositive ? '+' : ''}{stock.change_pct}%
                    </span>
                    {isVolumeSpike && (
                      <span className="text-[10px] font-bold text-amber-800 bg-amber-50 px-1.5 py-0.2 rounded font-mono">
                        {stock.volume_multiple}x vol
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
