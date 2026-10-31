import React, { useState, useEffect } from 'react';
import { api } from './services/api';
import { Announcement, StockEOD, TriggeredAlert, UserSettings } from './types';
import { Header } from './components/Header';
import { Navigation, TabType } from './components/Navigation';
import { FeedPush } from './components/FeedPush';
import { PortfolioView } from './components/PortfolioView';
import { ResearchPull } from './components/ResearchPull';
import { AlertSettingsModal } from './components/AlertSettingsModal';
import { Bell, AlertTriangle, ArrowUpRight } from 'lucide-react';

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
  const [llmMode, setLlmMode] = useState('Deterministic Heuristic Mode');

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
      const health = await api.getHealth().catch(() => null);
      if (health?.llm_status?.active_mode) {
        setLlmMode(health.llm_status.active_mode);
      }

      const settingsRes = await api.getSettings().catch(() => null);
      if (settingsRes?.thresholds) {
        setSettings(settingsRes.thresholds);
      }

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
    <div className="min-h-screen bg-gray-100 text-gray-900 flex flex-col items-center justify-start antialiased selection:bg-blue-100">
      {/* Outer Shell: Simulated Mobile Frame or Full View */}
      <div
        className={`w-full min-h-screen transition-all duration-200 flex flex-col bg-white shadow-subtle ${
          isMobileFrame
            ? 'max-w-[430px] my-6 rounded-[36px] border-[8px] border-gray-300 shadow-2xl overflow-hidden'
            : 'max-w-2xl border-x border-gray-200'
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
            className="cursor-pointer bg-amber-50 border-b border-amber-200 px-4 py-2.5 flex items-center justify-between text-xs transition hover:bg-amber-100/70"
          >
            <div className="flex items-center space-x-2 text-amber-900 font-medium truncate">
              <AlertTriangle className="w-4 h-4 shrink-0 text-amber-700" />
              <span className="truncate">
                {alerts.length} active alerts: {alerts[0].symbol} ({alerts[0].alert_type.replace('_', ' ')})
              </span>
            </div>
            <span className="text-xs font-semibold text-amber-800 shrink-0 ml-2 flex items-center">
              Review <ArrowUpRight className="w-3.5 h-3.5 ml-0.5" />
            </span>
          </div>
        )}

        {/* Tab Content */}
        <main className="flex-1 px-4 pt-4 bg-[#f8f9fa]">
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
              <div className="bg-white border border-gray-200 rounded-xl p-4 flex items-center justify-between shadow-card">
                <div>
                  <h2 className="text-base font-bold text-gray-900 tracking-tight">Active alerts</h2>
                  <p className="text-xs text-gray-500">
                    Thresholds: Price &gt; ±{settings.price_threshold_pct}% | Volume &gt; {settings.volume_multiplier}x
                  </p>
                </div>
                <button
                  onClick={() => setIsSettingsOpen(true)}
                  className="px-2.5 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded text-xs font-medium border border-gray-200 transition"
                >
                  Adjust
                </button>
              </div>

              {alerts.length === 0 ? (
                <div className="bg-white border border-gray-200 rounded-xl p-8 text-center space-y-2 shadow-card">
                  <Bell className="w-8 h-8 text-gray-400 mx-auto" />
                  <h3 className="text-sm font-semibold text-gray-900">No active alerts</h3>
                  <p className="text-xs text-gray-500">
                    All portfolio holdings are trading within normal price and volume boundaries.
                  </p>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {alerts.map((al) => (
                    <div
                      key={al.id}
                      onClick={() => handleSelectTickerForResearch(al.symbol)}
                      className="bg-white border border-gray-200 hover:border-gray-300 rounded-xl p-4 cursor-pointer transition space-y-2 shadow-card"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className="font-bold text-xs text-gray-900 font-mono bg-gray-100 px-2 py-0.5 rounded border border-gray-200">
                            {al.symbol}
                          </span>
                          <span className="text-xs font-semibold text-gray-800">
                            {al.company_name}
                          </span>
                        </div>
                        <span className="text-xs text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded font-medium">
                          {al.alert_type.replace('_', ' ')}
                        </span>
                      </div>

                      <h4 className="text-xs font-semibold text-gray-900">{al.title}</h4>
                      <p className="text-xs text-gray-600 leading-relaxed">{al.description}</p>

                      <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-xs">
                        <span className="text-gray-400">{al.timestamp}</span>
                        <span className="text-blue-900 font-semibold flex items-center gap-0.5">
                          Pull research <ArrowUpRight className="w-3 h-3" />
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

        {/* Settings & Controls Modal */}
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
