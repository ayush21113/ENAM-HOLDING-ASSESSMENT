import React, { useState } from 'react';
import { UserSettings, TriggeredAlert } from '../types';
import { 
  X, Sliders, Key, Zap, Shield, Bell, Check, 
  Volume2, TrendingUp, AlertTriangle, ArrowRight 
} from 'lucide-react';

interface AlertSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: UserSettings;
  onSaveSettings: (settings: UserSettings) => Promise<void>;
  alerts: TriggeredAlert[];
  llmMode: string;
  onSelectTicker: (symbol: string) => void;
}

export const AlertSettingsModal: React.FC<AlertSettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onSaveSettings,
  alerts,
  llmMode,
  onSelectTicker,
}) => {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState<'thresholds' | 'llm' | 'active_alerts'>('thresholds');
  const [priceThresh, setPriceThresh] = useState(settings.price_threshold_pct || 3.0);
  const [volThresh, setVolThresh] = useState(settings.volume_multiplier || 2.0);
  const [geminiKey, setGeminiKey] = useState(settings.gemini_api_key || '');
  const [groqKey, setGroqKey] = useState(settings.groq_api_key || '');
  const [openaiKey, setOpenaiKey] = useState(settings.openai_api_key || '');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = async () => {
    await onSaveSettings({
      price_threshold_pct: priceThresh,
      volume_multiplier: volThresh,
      gemini_api_key: geminiKey || undefined,
      groq_api_key: groqKey || undefined,
      openai_api_key: openaiKey || undefined,
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#0f121a] border border-surfaceBorder rounded-2xl w-full max-w-md max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 border-b border-surfaceBorder">
          <div className="flex items-center space-x-2">
            <Sliders className="w-4 h-4 text-blue-400" />
            <h3 className="font-bold text-sm text-white">System & Alert Controls</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Tabs */}
        <div className="flex border-b border-surfaceBorder bg-slate-950/50 p-1 text-xs">
          <button
            onClick={() => setActiveTab('thresholds')}
            className={`flex-1 py-1.5 rounded-lg font-medium transition ${
              activeTab === 'thresholds'
                ? 'bg-slate-800 text-white font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Thresholds
          </button>
          <button
            onClick={() => setActiveTab('llm')}
            className={`flex-1 py-1.5 rounded-lg font-medium transition flex items-center justify-center gap-1 ${
              activeTab === 'llm'
                ? 'bg-slate-800 text-white font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Zap className="w-3 h-3 text-amber-400" />
            AI Routing
          </button>
          <button
            onClick={() => setActiveTab('active_alerts')}
            className={`flex-1 py-1.5 rounded-lg font-medium transition flex items-center justify-center gap-1 ${
              activeTab === 'active_alerts'
                ? 'bg-slate-800 text-white font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Bell className="w-3 h-3 text-rose-400" />
            Alerts ({alerts.length})
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 overflow-y-auto space-y-4 flex-1 text-xs">
          {activeTab === 'thresholds' && (
            <div className="space-y-4">
              <div className="space-y-2 bg-slate-900/80 p-3 rounded-xl border border-slate-800">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-white">Daily Price Move Threshold</span>
                  <span className="font-mono text-blue-400 font-bold text-sm">±{priceThresh}%</span>
                </div>
                <input
                  type="range"
                  min="1.0"
                  max="10.0"
                  step="0.5"
                  value={priceThresh}
                  onChange={(e) => setPriceThresh(parseFloat(e.target.value))}
                  className="w-full accent-blue-500 cursor-pointer"
                />
                <p className="text-[11px] text-slate-400">
                  Trigger an immediate alert when a portfolio stock swings beyond ±{priceThresh}% in a single session.
                </p>
              </div>

              <div className="space-y-2 bg-slate-900/80 p-3 rounded-xl border border-slate-800">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-white">Unusual Volume Multiplier</span>
                  <span className="font-mono text-amber-400 font-bold text-sm">{volThresh}x</span>
                </div>
                <input
                  type="range"
                  min="1.2"
                  max="5.0"
                  step="0.2"
                  value={volThresh}
                  onChange={(e) => setVolThresh(parseFloat(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer"
                />
                <p className="text-[11px] text-slate-400">
                  Flags unusual accumulation/distribution when daily traded volume exceeds {volThresh}x its 20-day moving average.
                </p>
              </div>

              <div className="bg-slate-900/50 p-3 rounded-xl border border-slate-800 space-y-1.5">
                <div className="text-[11px] font-bold text-slate-300 uppercase tracking-wide">
                  Material Announcement Watchlist
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  FINN automatically monitors Tier 1 catalysts: Quarterly Results, Board Appointments/Resignations, M&A/Demergers, and Rating Actions.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'llm' && (
            <div className="space-y-3.5">
              <div className="bg-blue-950/20 border border-blue-500/30 p-3 rounded-xl">
                <div className="flex items-center space-x-1.5 font-bold text-blue-400">
                  <Zap className="w-3.5 h-3.5" />
                  <span>Cost-Conscious Model Routing</span>
                </div>
                <p className="text-[11px] text-slate-300 mt-1 leading-relaxed">
                  FINN routes lightweight tasks (table extraction, classification) to fast free-tier models (Gemini 2.0 Flash / Groq Llama 3.3), reserving reasoning models solely for deep narrative synthesis.
                </p>
                <div className="mt-2 text-[10px] text-slate-400">
                  Status: <strong className="text-white">{llmMode}</strong>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-semibold text-slate-300">
                  Google Gemini API Key (Free Tier supported)
                </label>
                <input
                  type="password"
                  value={geminiKey}
                  onChange={(e) => setGeminiKey(e.target.value)}
                  placeholder="AIzaSy..."
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 font-mono text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 text-xs"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-semibold text-slate-300">
                  Groq API Key (Free Tier supported)
                </label>
                <input
                  type="password"
                  value={groqKey}
                  onChange={(e) => setGroqKey(e.target.value)}
                  placeholder="gsk_..."
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 font-mono text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 text-xs"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-semibold text-slate-300">
                  OpenAI API Key (Optional)
                </label>
                <input
                  type="password"
                  value={openaiKey}
                  onChange={(e) => setOpenaiKey(e.target.value)}
                  placeholder="sk-..."
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 font-mono text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 text-xs"
                />
              </div>

              <p className="text-[10px] text-slate-500 italic">
                * Zero keys required: FINN operates 100% reliably out-of-the-box using built-in deterministic heuristics & pre-computed models.
              </p>
            </div>
          )}

          {activeTab === 'active_alerts' && (
            <div className="space-y-2.5">
              {alerts.length === 0 ? (
                <div className="text-center py-8 text-slate-500">
                  <Bell className="w-6 h-6 mx-auto mb-1 opacity-50" />
                  No threshold breaches currently triggered.
                </div>
              ) : (
                alerts.map((al) => (
                  <div
                    key={al.id}
                    onClick={() => {
                      onSelectTicker(al.symbol);
                      onClose();
                    }}
                    className="bg-slate-900 border border-slate-800 hover:border-blue-500/40 p-3 rounded-xl cursor-pointer transition space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-white font-mono">{al.symbol}</span>
                      <span className="text-[10px] text-amber-400 bg-amber-400/10 border border-amber-400/20 px-1.5 py-0.2 rounded font-semibold">
                        {al.alert_type.replace('_', ' ')}
                      </span>
                    </div>
                    <div className="text-xs font-semibold text-slate-200">{al.title}</div>
                    <p className="text-[11px] text-slate-400 leading-snug">{al.description}</p>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-3 border-t border-surfaceBorder flex items-center justify-between bg-slate-950/80">
          <span className="text-[10px] text-slate-500">
            {savedSuccess ? (
              <span className="text-emerald-400 font-semibold flex items-center gap-1">
                <Check className="w-3 h-3" /> Preferences Saved
              </span>
            ) : (
              'Changes apply live across portfolio'
            )}
          </span>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold transition"
          >
            Apply Settings
          </button>
        </div>
      </div>
    </div>
  );
};
