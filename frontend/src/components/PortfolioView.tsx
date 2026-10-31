import React, { useState } from 'react';
import { StockEOD } from '../types';
import { TrendingUp, TrendingDown, AlertTriangle, ArrowUpRight, Search, Activity } from 'lucide-react';

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
    <div className="space-y-4 pb-20">
      {/* Portfolio Overview Card */}
      <div className="bg-surface border border-surfaceBorder rounded-2xl p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-white tracking-tight">Active Portfolio Universe</h2>
            <p className="text-xs text-slate-400">18 Curated High-Conviction NSE/BSE Companies</p>
          </div>
          <span className="px-2.5 py-1 bg-blue-500/10 text-blue-400 border border-blue-500/20 text-xs font-mono font-semibold rounded-lg">
            {stocks.length} Holdings
          </span>
        </div>

        {/* Search & Sector Filters */}
        <div className="space-y-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-500" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Filter portfolio by ticker or name..."
              className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition"
            />
          </div>

          <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 scrollbar-none text-[11px]">
            {sectors.map((sec) => (
              <button
                key={sec}
                onClick={() => setSelectedSector(sec)}
                className={`px-2.5 py-1 rounded-lg whitespace-nowrap transition font-medium border ${
                  selectedSector === sec
                    ? 'bg-slate-200 text-slate-900 border-white'
                    : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                }`}
              >
                {sec}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Stock Cards List */}
      {loading ? (
        <div className="py-12 flex flex-col items-center justify-center space-y-2">
          <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xs text-slate-400">Fetching EOD Market Data & Volume Multiples...</p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {filteredStocks.map((stock) => {
            const isPositive = stock.change_pct >= 0;
            const isVolumeSpike = stock.volume_multiple >= 2.0;

            return (
              <div
                key={stock.symbol}
                onClick={() => onSelectTicker(stock.symbol)}
                className={`bg-surface border rounded-xl p-3.5 transition-all duration-150 cursor-pointer hover:border-blue-500/50 ${
                  stock.has_active_alert
                    ? 'border-amber-500/40 shadow-sm shadow-amber-500/5'
                    : 'border-surfaceBorder hover:bg-slate-900/40'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-sm text-white font-mono tracking-tight">
                        {stock.symbol.replace('.NS', '')}
                      </span>
                      <span className="text-[10px] text-slate-400 bg-slate-800 px-1.5 py-0.2 rounded font-sans">
                        {stock.market_cap_tier}
                      </span>
                      {stock.has_active_alert && (
                        <span className="text-[10px] text-amber-400 bg-amber-400/10 border border-amber-400/20 px-1.5 py-0.2 rounded font-medium flex items-center gap-1">
                          <AlertTriangle className="w-2.5 h-2.5" />
                          Threshold
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-slate-400 truncate max-w-[170px]">
                      {stock.name} • <span className="text-slate-500">{stock.sector}</span>
                    </div>
                  </div>

                  {/* Price & Change */}
                  <div className="text-right space-y-0.5">
                    <div className="text-sm font-bold text-white font-mono">
                      ₹{stock.price.toLocaleString()}
                    </div>
                    <div
                      className={`text-xs font-semibold font-mono flex items-center justify-end gap-0.5 ${
                        isPositive ? 'text-emerald-400' : 'text-rose-400'
                      }`}
                    >
                      {isPositive ? (
                        <TrendingUp className="w-3 h-3" />
                      ) : (
                        <TrendingDown className="w-3 h-3" />
                      )}
                      {isPositive ? '+' : ''}
                      {stock.change_pct}%
                    </div>
                  </div>
                </div>

                {/* Sub-bar: Volume Multiple & 20D Average */}
                <div className="mt-2.5 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                  <div className="flex items-center space-x-2">
                    <span className="text-slate-500">Vol Multiplier:</span>
                    <span
                      className={`font-mono font-semibold px-1.5 py-0.2 rounded ${
                        isVolumeSpike
                          ? 'bg-amber-400/20 text-amber-300 font-bold'
                          : 'bg-slate-800 text-slate-300'
                      }`}
                    >
                      {stock.volume_multiple}x (20d avg)
                    </span>
                  </div>

                  <span className="text-[10px] text-blue-400 hover:text-blue-300 flex items-center gap-0.5 font-medium">
                    Pull Analysis
                    <ArrowUpRight className="w-3 h-3" />
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
