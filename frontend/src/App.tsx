import React, { useState, useEffect } from 'react';
import { api } from './services/api';
import { Announcement, StockEOD, TriggeredAlert, UserSettings } from './types';
import { Header } from './components/Header';
import { Navigation, TabType } from './components/Navigation';
import { FeedPush } from './components/FeedPush';
import { PortfolioView } from './components/PortfolioView';
import { ResearchPull } from './components/ResearchPull';
import { AlertSettingsModal } from './components/AlertSettingsModal';
import { Bell, AlertTriangle, ArrowUpRight, Sparkles } from 'lucide-react';

export function App() {
  const [activeTab, setActiveTab] = useState<TabType>('push');
  const [isMobileFrame, setIsMobileFrame] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Data states
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [stocks, setStocks] = useState<StockEOD[]>([]);
  const [alerts, setAlerts] = useState<TriggeredAlert[]>([]);
  const [loadingFeed, setLoadingFeed] = useState(true);
  const [loadingPortfolio, setLoadingPortfolio] = useState(true);

  // Push Feed filters
  const [windowHours, setWindowHours] = useState(24);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [hideRoutine, setHideRoutine] = useState(false);

  // Pull research target
  const [selectedTickerForResearch, setSelectedTickerForResearch] = useState('TRENT.NS');

  // Settings & Router state
  const [settings, setSettings] = useState<UserSettings>({
    price_threshold_pct: 3.0,
    volume_multiplier: 2.0,
  });
  const [llmMode, setLlmMode] = useState('Deterministic Precision Heuristics');

  // Initial load
  useEffect(() => {
    loadInitialData();
  }, []);

  // Reload feed on filter change
  useEffect(() => {
    loadFeed();
  }, [windowHours, selectedCategory, hideRoutine]);

  const loadInitialData = async () => {
    try {
      // Health / Status
      const health = await api.getHealth().catch(() => null);
      if (health?.llm_status?.active_mode) {
        setLlmMode(health.llm_status.active_mode);
      }

      // Settings
      const settingsRes = await api.getSettings().catch(() => null);
      if (settingsRes?.thresholds) {
        setSettings(settingsRes.thresholds);
      }

      // Portfolio & Alerts
      loadPortfolio();
      loadAlerts();
      loadFeed();
    } catch (err) {
      console.error('Error loading initial data', err);
    }
  };

  const loadFeed = async () => {
    setLoadingFeed(true);
    try {
      const data = await api.getFeed({
        window_hours: windowHours,
        category: selectedCategory,
        hide_routine: hideRoutine,
      });
      setAnnouncements(data.announcements);
    } catch (err) {
      console.error('Error loading feed', err);
    } finally {
      setLoadingFeed(false);
    }
  };

  const loadPortfolio = async () => {
    setLoadingPortfolio(true);
    try {
      const data = await api.getPortfolio();
      setStocks(data.stocks);
    } catch (err) {
      console.error('Error loading portfolio', err);
    } finally {
      setLoadingPortfolio(false);
    }
  };

  const loadAlerts = async () => {
    try {
      const data = await api.getAlerts();
      setAlerts(data.alerts);
    } catch (err) {
      console.error('Error loading alerts', err);
    }
  };

  const handleSaveSettings = async (newSettings: UserSettings) => {
    try {
      const res = await api.updateSettings(newSettings);
      setSettings(res.thresholds);
      if (res.llm_router?.active_mode) {
        setLlmMode(res.llm_router.active_mode);
      }
      // Refresh portfolio to re-evaluate with new thresholds
      loadPortfolio();
      loadAlerts();
    } catch (err) {
      console.error('Error saving settings', err);
    }
  };

  const handleSelectTickerForResearch = (symbol: string) => {
    setSelectedTickerForResearch(symbol);
    setActiveTab('pull');
  };

  return (
    <div className="min-h-screen bg-[#07080c] text-slate-100 flex flex-col items-center justify-start antialiased selection:bg-blue-500 selection:text-white">
      {/* Outer Shell: Simulated Mobile Frame or Full Responsive Width */}
      <div
        className={`w-full min-h-screen transition-all duration-300 flex flex-col ${
          isMobileFrame
            ? 'max-w-[430px] my-4 rounded-[40px] border-[8px] border-slate-800 shadow-2xl overflow-hidden bg-[#090a0f] ring-1 ring-slate-700/50'
            : 'max-w-2xl bg-[#090a0f]'
        }`}
      >
        {/* Header */}
        <Header
          isMobileFrame={isMobileFrame}
          setIsMobileFrame={setIsMobileFrame}
          openSettings={() => setIsSettingsOpen(true)}
          openAlerts={() => setActiveTab('alerts')}
          alertsCount={alerts.length}
          llmMode={llmMode}
        />

        {/* Global Active Alert Banner if triggered */}
        {alerts.length > 0 && activeTab !== 'alerts' && (
          <div 
            onClick={() => setActiveTab('alerts')}
            className="cursor-pointer bg-amber-500/10 border-b border-amber-500/20 px-4 py-2 flex items-center justify-between text-xs transition hover:bg-amber-500/15"
          >
            <div className="flex items-center space-x-2 text-amber-300 font-medium truncate">
              <AlertTriangle className="w-3.5 h-3.5 shrink-0 text-amber-400" />
              <span className="truncate">
                {alerts.length} Triggered Threshold Alerts: {alerts[0].symbol} ({alerts[0].alert_type})
              </span>
            </div>
            <span className="text-[10px] text-amber-400 font-bold shrink-0 ml-2 flex items-center">
              View <ArrowUpRight className="w-3 h-3 ml-0.5" />
            </span>
          </div>
        )}

        {/* Tab Content */}
        <main className="flex-1 px-3.5 pt-3">
          {activeTab === 'push' && (
            <FeedPush
              announcements={announcements}
              loading={loadingFeed}
              windowHours={windowHours}
              setWindowHours={setWindowHours}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              hideRoutine={hideRoutine}
              setHideRoutine={setHideRoutine}
              onSelectTickerForResearch={handleSelectTickerForResearch}
            />
          )}

          {activeTab === 'portfolio' && (
            <PortfolioView
              stocks={stocks}
              loading={loadingPortfolio}
              onSelectTicker={handleSelectTickerForResearch}
            />
          )}

          {activeTab === 'pull' && (
            <ResearchPull
              initialSymbol={selectedTickerForResearch}
              onBackToFeed={() => setActiveTab('push')}
            />
          )}

          {activeTab === 'alerts' && (
            <div className="space-y-4 pb-20">
              <div className="bg-surface border border-surfaceBorder rounded-2xl p-4 flex items-center justify-between">
                <div>
                  <h2 className="text-base font-bold text-white tracking-tight">Active Triggered Alerts</h2>
                  <p className="text-xs text-slate-400">
                    Threshold: Price &gt; ±{settings.price_threshold_pct}% | Volume &gt; {settings.volume_multiplier}x
                  </p>
                </div>
                <button
                  onClick={() => setIsSettingsOpen(true)}
                  className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-medium transition"
                >
                  Adjust
                </button>
              </div>

              {alerts.length === 0 ? (
                <div className="bg-surface border border-surfaceBorder rounded-2xl p-8 text-center space-y-2">
                  <Bell className="w-8 h-8 text-slate-600 mx-auto" />
                  <h3 className="text-sm font-semibold text-slate-300">No Active Breaches</h3>
                  <p className="text-xs text-slate-500">
                    All portfolio stocks are trading within normal volatility and volume bands.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {alerts.map((al) => (
                    <div
                      key={al.id}
                      onClick={() => handleSelectTickerForResearch(al.symbol)}
                      className="bg-surface border border-surfaceBorder hover:border-blue-500/40 rounded-xl p-4 cursor-pointer transition space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className="font-bold text-xs text-white font-mono bg-slate-800 px-2 py-0.5 rounded">
                            {al.symbol}
                          </span>
                          <span className="text-xs font-semibold text-slate-200">
                            {al.company_name}
                          </span>
                        </div>
                        <span className="text-[10px] text-amber-400 bg-amber-400/10 border border-amber-400/20 px-2 py-0.5 rounded font-bold uppercase">
                          {al.alert_type.replace('_', ' ')}
                        </span>
                      </div>

                      <h4 className="text-xs font-semibold text-slate-100">{al.title}</h4>
                      <p className="text-xs text-slate-400 leading-relaxed">{al.description}</p>

                      <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
                        <span className="text-slate-500">{al.timestamp}</span>
                        <span className="text-blue-400 font-semibold flex items-center gap-0.5">
                          Deep Research <ArrowUpRight className="w-3 h-3" />
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </main>

        {/* Bottom Navigation */}
        <Navigation
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          alertsCount={alerts.length}
        />

        {/* Settings & Threshold Controls Modal */}
        <AlertSettingsModal
          isOpen={isSettingsOpen}
          onClose={() => setIsSettingsOpen(false)}
          settings={settings}
          onSaveSettings={handleSaveSettings}
          alerts={alerts}
          llmMode={llmMode}
          onSelectTicker={handleSelectTickerForResearch}
        />
      </div>
    </div>
  );
}

export default App;
