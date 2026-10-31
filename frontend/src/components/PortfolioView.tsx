import React, { useState } from 'react';
import { StockEOD } from '../types';
import { TrendingUp, TrendingDown, AlertTriangle, ArrowUpRight, Search } from 'lucide-react';

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
      <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-card space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-gray-900 tracking-tight">Portfolio universe</h2>
            <p className="text-xs text-gray-500">18 high-conviction listed holdings</p>
          </div>
          <span className="px-2.5 py-1 bg-gray-100 text-gray-800 border border-gray-200 text-xs font-mono font-medium rounded">
            {stocks.length} holdings
          </span>
        </div>

        {/* Search & Sector Filters */}
        <div className="space-y-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search ticker or company name..."
              className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-9 pr-3 py-2 text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:bg-white focus:border-blue-800 transition"
            />
          </div>

          <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
            {sectors.map((sec) => (
              <button
                key={sec}
                onClick={() => setSelectedSector(sec)}
                className={`px-2.5 py-1 rounded-full whitespace-nowrap transition font-medium border text-xs ${
                  selectedSector === sec
                    ? 'bg-gray-900 text-white border-gray-900'
                    : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
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
          <div className="w-5 h-5 border-2 border-blue-800 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xs text-gray-500 font-medium">Fetching price and volume data...</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filteredStocks.map((stock) => {
            const isPositive = stock.change_pct >= 0;
            const isVolumeSpike = stock.volume_multiple >= 2.0;

            return (
              <div
                key={stock.symbol}
                onClick={() => onSelectTicker(stock.symbol)}
                className={`bg-white border rounded-xl p-3.5 transition-all duration-150 cursor-pointer shadow-card hover:border-gray-300 ${
                  stock.has_active_alert
                    ? 'border-amber-300 bg-amber-50/20'
                    : 'border-gray-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-sm text-gray-900 font-mono tracking-tight">
                        {stock.symbol.replace('.NS', '')}
                      </span>
                      <span className="text-xs text-gray-500 bg-gray-100 px-1.5 py-0.2 rounded">
                        {stock.market_cap_tier}
                      </span>
                      {stock.has_active_alert && (
                        <span className="text-xs text-amber-800 bg-amber-50 border border-amber-200 px-1.5 py-0.2 rounded font-medium flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3" />
                          Threshold alert
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-gray-500 truncate max-w-[180px]">
                      {stock.name} • {stock.sector}
                    </div>
                  </div>

                  {/* Price & Change */}
                  <div className="text-right space-y-0.5">
                    <div className="text-sm font-bold text-gray-900 font-mono">
                      ₹{stock.price.toLocaleString()}
                    </div>
                    <div
                      className={`text-xs font-semibold font-mono flex items-center justify-end gap-0.5 ${
                        isPositive ? 'text-emerald-700' : 'text-red-700'
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

                {/* Sub-bar */}
                <div className="mt-2 pt-2 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
                  <div className="flex items-center space-x-2">
                    <span>Volume multiple:</span>
                    <span
                      className={`font-mono px-1.5 py-0.2 rounded ${
                        isVolumeSpike
                          ? 'bg-amber-100 text-amber-900 font-bold'
                          : 'bg-gray-100 text-gray-700 font-medium'
                      }`}
                    >
                      {stock.volume_multiple}x 20d avg
                    </span>
                  </div>

                  <span className="text-xs text-blue-900 font-medium flex items-center gap-0.5">
                    Research
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
