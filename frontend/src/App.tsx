import React, { useState, useEffect } from 'react';
import { api } from './services/api';
import { Announcement, StockEOD, TriggeredAlert, UserSettings } from './types';
import { Header } from './components/Header';
import { Navigation, TabType } from './components/Navigation';
import { FeedPush } from './components/FeedPush';
import { PortfolioView } from './components/PortfolioView';
import { ResearchPull } from './components/ResearchPull';
import { CopilotView } from './components/CopilotView';
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
  const [llmMode, setLlmMode] = useState('Heuristic Mode');

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
    <div className="min-h-screen bg-[#f5f6f8] text-[#1e222b] flex flex-col items-center justify-start antialiased">
      {/* Outer Shell: Simulated Mobile Frame or Full View */}
      <div
        className={`w-full min-h-screen transition-all duration-200 flex flex-col bg-white ${
          isMobileFrame
            ? 'max-w-[430px] my-6 rounded-[36px] border-[8px] border-[#ebecef] shadow-2xl overflow-hidden'
            : 'max-w-2xl border-x border-[#ebecef]'
        }`}
      >
        {/* Header (Groww style) */}
        <Header
          isMobileFrame={isMobileFrame}
          setIsMobileFrame={setIsMobileFrame}
          openSettings={() => setIsSettingsOpen(true)}
          openAlerts={() => setActiveTab('alerts')}
          alertsCount={alerts.length}
          llmMode={llmMode}
          onSearchClick={() => setActiveTab('pull')}
        />

        {/* Global Active Alert Banner if triggered */}
        {alerts.length > 0 && activeTab !== 'alerts' && (
          <div 
            onClick={() => setActiveTab('alerts')}
            className="cursor-pointer bg-[#fff9f6] border-b border-[#fde8e1] px-4 py-2 flex items-center justify-between text-xs transition hover:bg-[#fdf1ee]"
          >
            <div className="flex items-center space-x-2 text-[#eb5b3c] font-medium truncate">
              <AlertTriangle className="w-3.5 h-3.5 shrink-0 text-[#eb5b3c]" />
              <span className="truncate">
                {alerts.length} Triggered Alerts: {alerts[0].symbol} ({alerts[0].alert_type.replace('_', ' ')})
              </span>
            </div>
            <span className="text-xs font-bold text-[#eb5b3c] shrink-0 ml-2 flex items-center">
              View <ArrowUpRight className="w-3 h-3 ml-0.5" />
            </span>
          </div>
        )}

        {/* Tab Content */}
        <main className="flex-1 px-4 pt-3 bg-[#f5f6f8]">
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

          {activeTab === 'copilot' && (
            <CopilotView />
          )}

          {activeTab === 'pull' && (
            <ResearchPull
              initialSymbol={selectedTickerForResearch}
              onBackToFeed={() => setActiveTab('push')}
            />
          )}

          {activeTab === 'alerts' && (
            <div className="space-y-3 pb-24">
              <div className="bg-white border border-[#ebecef] rounded-2xl p-4 flex items-center justify-between shadow-xs">
                <div>
                  <h2 className="text-base font-bold text-[#1e222b] tracking-tight">Active Threshold Alerts</h2>
                  <p className="text-xs text-[#7c7e8c] mt-0.5">
                    Price &gt; ±{settings.price_threshold_pct}% • Volume &gt; {settings.volume_multiplier}x 20-DMA
                  </p>
                </div>
                <button
                  onClick={() => setIsSettingsOpen(true)}
                  className="text-xs font-bold text-[#00875A] hover:underline transition"
                >
                  Adjust Triggers
                </button>
              </div>

              {alerts.length === 0 ? (
                <div className="bg-white border border-[#ebecef] rounded-2xl p-8 text-center space-y-2 shadow-xs">
                  <Bell className="w-8 h-8 text-[#7c7e8c] mx-auto opacity-50" />
                  <h3 className="text-sm font-semibold text-[#1e222b]">No active alerts</h3>
                  <p className="text-xs text-[#7c7e8c]">
                    All portfolio stocks are trading within normal volatility and volume bands.
                  </p>
                </div>
              ) : (
                <div className="bg-white rounded-2xl border border-[#ebecef] shadow-xs overflow-hidden divide-y divide-[#f5f6f8]">
                  {alerts.map((al) => {
                    const isPriceSurge = al.alert_type === 'PRICE_SURGE';
                    const isVolume = al.alert_type === 'VOLUME_SPIKE';
                    const alertColor = isPriceSurge ? 'text-[#00875A]' : isVolume ? 'text-amber-600' : 'text-[#EB5B3C]';
                    const dotColor = isPriceSurge ? 'bg-[#00875A]' : isVolume ? 'bg-amber-500' : 'bg-[#EB5B3C]';

                    return (
                      <div
                        key={al.id}
                        onClick={() => handleSelectTickerForResearch(al.symbol)}
                        className="p-4 cursor-pointer hover:bg-[#fafbfd] transition space-y-1.5"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <span className="font-bold text-xs text-[#1e222b] tracking-tight">
                              {al.symbol.replace('.NS', '').replace('.BO', '')}
                            </span>
                            <span className="text-xs text-[#7c7e8c]">•</span>
                            <span className="text-xs text-[#7c7e8c] font-medium">
                              {al.company_name}
                            </span>
                          </div>
                          
                          {/* Clean unboxed alert badge with subtle indicator dot (NO bulky background boxes!) */}
                          <span className={`text-xs font-bold flex items-center space-x-1.5 ${alertColor}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`}></span>
                            <span>{al.alert_type.replace('_', ' ')}</span>
                          </span>
                        </div>

                        <h4 className="text-xs font-semibold text-[#1e222b]">{al.title}</h4>
                        <p className="text-xs text-[#7c7e8c] leading-relaxed">{al.description}</p>

                        <div className="pt-1 flex items-center justify-between text-[11px]">
                          <span className="text-[#7c7e8c]">{al.timestamp}</span>
                          <span className="text-[#00875A] font-semibold flex items-center gap-0.5 hover:underline">
                            Deep Research <ArrowUpRight className="w-3 h-3" />
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </main>

        {/* Bottom Navigation (Groww Style) */}
        <Navigation
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          alertsCount={alerts.length}
        />

        {/* Settings Modal */}
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
