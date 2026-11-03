import React, { useState, useEffect } from 'react';
import { api } from './services/api';
import { Announcement, StockEOD, TriggeredAlert, UserSettings, ICMemoResponse } from './types';
import { INITIAL_STOCKS, INITIAL_ANNOUNCEMENTS, INITIAL_ALERTS } from './services/seedData';
import { Header } from './components/Header';
import { Navigation, TabType } from './components/Navigation';
import { TodayView } from './components/TodayView';
import { WatchlistView } from './components/WatchlistView';
import { ResearchView } from './components/ResearchView';
import { AlertsView } from './components/AlertsView';
import { AskFinnSheet } from './components/AskFinnSheet';
import { AlertSettingsModal } from './components/AlertSettingsModal';
import { ICMemoModal } from './components/ICMemoModal';
import { UserGuideModal } from './components/UserGuideModal';

export function App() {
  const [activeTab, setActiveTab] = useState<TabType>('today');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isGuideOpen, setIsGuideOpen] = useState(false);

  // Contextual Ask FINN Sheet
  const [askFinnState, setAskFinnState] = useState<{
    isOpen: boolean;
    symbol: string;
    contextTitle?: string;
  }>({
    isOpen: false,
    symbol: 'TRENT.NS',
  });

  // IC Memo Modal
  const [isICMemoOpen, setIsICMemoOpen] = useState(false);
  const [memoData, setMemoData] = useState<ICMemoResponse | null>(null);
  const [memoLoading, setMemoLoading] = useState(false);

  // Core Data - Stale-While-Revalidate: Instant paint on 0ms with background live sync
  const [announcements, setAnnouncements] = useState<Announcement[]>(INITIAL_ANNOUNCEMENTS);
  const [stocks, setStocks] = useState<StockEOD[]>(INITIAL_STOCKS);
  const [alerts, setAlerts] = useState<TriggeredAlert[]>(INITIAL_ALERTS);
  const [loadingFeed, setLoadingFeed] = useState(false);
  const [loadingPortfolio, setLoadingPortfolio] = useState(false);

  // Selected Ticker for Research drilldown
  const [selectedTickerForResearch, setSelectedTickerForResearch] = useState('TRENT.NS');

  // Settings state
  const [settings, setSettings] = useState<UserSettings>({
    price_threshold_pct: 3.0,
    volume_multiplier: 2.0,
  });
  const [llmMode, setLlmMode] = useState('Heuristic Mode');

  useEffect(() => {
    // 1. First-time user tour detection via localStorage
    try {
      const hasSeen = localStorage.getItem('finn_user_guide_seen');
      if (!hasSeen) {
        setIsGuideOpen(true);
      }
    } catch (e) {
      console.warn('LocalStorage unavailable', e);
    }

    // 2. Parallel background synchronization
    loadPortfolio();
    loadAlerts();
    loadFeed();
    loadHealthAndSettings();
  }, []);

  const handleCloseGuide = () => {
    setIsGuideOpen(false);
    try {
      localStorage.setItem('finn_user_guide_seen', 'true');
    } catch {}
  };

  const handleOpenGuide = () => {
    setIsGuideOpen(true);
  };

  const loadHealthAndSettings = async () => {
    try {
      const [health, settingsRes] = await Promise.all([
        api.getHealth().catch(() => null),
        api.getSettings().catch(() => null),
      ]);
      if (health?.llm_status?.active_mode) {
        setLlmMode(health.llm_status.active_mode);
      }
      if (settingsRes?.thresholds) {
        setSettings(settingsRes.thresholds);
      }
    } catch (e) {
      console.warn('Metadata sync fallback active', e);
    }
  };

  const loadFeed = async () => {
    setLoadingFeed(true);
    try {
      const data = await api.getFeed({
        window_hours: 48,
        category: 'all',
        hide_routine: false,
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

  const handleOpenICMemo = async () => {
    setIsICMemoOpen(true);
    if (!memoData) {
      setMemoLoading(true);
      try {
        const resp = await api.getICMemo();
        setMemoData(resp);
      } catch (e) {
        console.error('Failed to load IC Memo', e);
      } finally {
        setMemoLoading(false);
      }
    }
  };

  const handleSelectTickerForResearch = (symbol: string) => {
    setSelectedTickerForResearch(symbol);
    setActiveTab('research');
  };

  const handleOpenAskFinn = (symbol: string, contextTitle?: string) => {
    setAskFinnState({
      isOpen: true,
      symbol,
      contextTitle,
    });
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

  return (
    <div className="min-h-screen bg-[#f5f6f8] text-[#1e222b] flex flex-col items-center justify-start antialiased selection:bg-[#00875A]/20">
      {/* 390x844 Mobile Shell */}
      <div className="w-full min-h-screen max-w-md flex flex-col bg-[#f5f6f8] shadow-sm relative">
        {/* Simplified Header */}
        <Header
          openSettings={() => setIsSettingsOpen(true)}
          onSearchClick={() => setActiveTab('watchlist')}
          onOpenGuide={handleOpenGuide}
        />

        {/* Destination Content */}
        <main className="flex-1 px-4 pt-3">
          {activeTab === 'today' && (
            <TodayView
              announcements={announcements}
              stocks={stocks}
              loading={loadingFeed}
              onSelectTicker={handleSelectTickerForResearch}
              onOpenICMemo={handleOpenICMemo}
              onAskFinn={handleOpenAskFinn}
            />
          )}

          {activeTab === 'watchlist' && (
            <WatchlistView
              stocks={stocks}
              loading={loadingPortfolio}
              onSelectTicker={handleSelectTickerForResearch}
            />
          )}

          {activeTab === 'research' && (
            <ResearchView
              initialSymbol={selectedTickerForResearch}
              onAskFinn={handleOpenAskFinn}
              onBackToWatchlist={() => setActiveTab('watchlist')}
            />
          )}

          {activeTab === 'alerts' && (
            <AlertsView
              alerts={alerts}
              settings={settings}
              onOpenSettings={() => setIsSettingsOpen(true)}
              onSelectTicker={handleSelectTickerForResearch}
            />
          )}
        </main>

        {/* Clean 4-Tab Bottom Navigation */}
        <Navigation
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          alertsCount={alerts.length}
        />

        {/* Contextual Ask FINN Bottom Sheet */}
        <AskFinnSheet
          isOpen={askFinnState.isOpen}
          onClose={() => setAskFinnState((prev) => ({ ...prev, isOpen: false }))}
          symbol={askFinnState.symbol}
          contextTitle={askFinnState.contextTitle}
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

        {/* Pre-Market IC Memo Modal */}
        <ICMemoModal
          isOpen={isICMemoOpen}
          onClose={() => setIsICMemoOpen(false)}
          memo={memoData}
          loading={memoLoading}
          onRegenerate={handleOpenICMemo}
        />

        {/* First-Time User Guide & Product Tour Modal */}
        <UserGuideModal
          isOpen={isGuideOpen}
          onClose={handleCloseGuide}
        />
      </div>
    </div>
  );
}

export default App;
