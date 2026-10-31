import React, { useState } from 'react';
import { UserSettings, TriggeredAlert } from '../types';
import { X, Sliders, Zap, Bell, Check } from 'lucide-react';

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
      <div className="bg-white border border-gray-200 rounded-2xl w-full max-w-md max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <Sliders className="w-4 h-4 text-blue-900" />
            <h3 className="font-bold text-sm text-gray-900">Settings & threshold triggers</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Tabs */}
        <div className="flex border-b border-gray-200 bg-gray-50 p-1 text-xs">
          <button
            onClick={() => setActiveTab('thresholds')}
            className={`flex-1 py-1.5 rounded-lg font-medium transition ${
              activeTab === 'thresholds'
                ? 'bg-white text-gray-900 font-semibold shadow-subtle'
                : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            Thresholds
          </button>
          <button
            onClick={() => setActiveTab('llm')}
            className={`flex-1 py-1.5 rounded-lg font-medium transition flex items-center justify-center gap-1 ${
              activeTab === 'llm'
                ? 'bg-white text-gray-900 font-semibold shadow-subtle'
                : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            <Zap className="w-3.5 h-3.5 text-blue-900" />
            Model routing
          </button>
          <button
            onClick={() => setActiveTab('active_alerts')}
            className={`flex-1 py-1.5 rounded-lg font-medium transition flex items-center justify-center gap-1 ${
              activeTab === 'active_alerts'
                ? 'bg-white text-gray-900 font-semibold shadow-subtle'
                : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            <Bell className="w-3.5 h-3.5 text-red-600" />
            Alerts ({alerts.length})
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 overflow-y-auto space-y-4 flex-1 text-xs">
          {activeTab === 'thresholds' && (
            <div className="space-y-4">
              <div className="space-y-2 bg-gray-50 p-3.5 rounded-xl border border-gray-200">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-gray-900">Price change threshold</span>
                  <span className="font-mono text-gray-900 font-bold text-sm">±{priceThresh}%</span>
                </div>
                <input
                  type="range"
                  min="1.0"
                  max="10.0"
                  step="0.5"
                  value={priceThresh}
                  onChange={(e) => setPriceThresh(parseFloat(e.target.value))}
                  className="w-full accent-blue-900 cursor-pointer"
                />
                <p className="text-xs text-gray-500">
                  Trigger an immediate alert when a portfolio stock swings beyond ±{priceThresh}% in a single day.
                </p>
              </div>

              <div className="space-y-2 bg-gray-50 p-3.5 rounded-xl border border-gray-200">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-gray-900">Unusual volume threshold</span>
                  <span className="font-mono text-gray-900 font-bold text-sm">{volThresh}x</span>
                </div>
                <input
                  type="range"
                  min="1.2"
                  max="5.0"
                  step="0.2"
                  value={volThresh}
                  onChange={(e) => setVolThresh(parseFloat(e.target.value))}
                  className="w-full accent-blue-900 cursor-pointer"
                />
                <p className="text-xs text-gray-500">
                  Flags unusual trading volume when daily traded volume exceeds {volThresh}x its 20-day moving average.
                </p>
              </div>

              <div className="bg-gray-50 p-3.5 rounded-xl border border-gray-200 space-y-1">
                <div className="text-xs font-semibold text-gray-800">
                  Material catalysts watchlist
                </div>
                <p className="text-xs text-gray-600 leading-relaxed">
                  FINN automatically monitors Tier 1 catalysts: Quarterly Results, C-suite changes, M&A/Demergers, and Rating Actions.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'llm' && (
            <div className="space-y-3.5">
              <div className="bg-blue-50/60 border border-blue-200 p-3.5 rounded-xl">
                <div className="flex items-center space-x-1.5 font-bold text-blue-900 text-xs">
                  <Zap className="w-3.5 h-3.5 text-blue-800" />
                  <span>Cost-conscious model routing</span>
                </div>
                <p className="text-xs text-gray-700 mt-1 leading-relaxed">
                  Routine extraction tasks are routed to lightweight or free-tier models (Gemini 2.0 Flash / Groq Llama 3.3), reserving reasoning models solely for deep narrative synthesis.
                </p>
                <div className="mt-2 text-xs text-gray-600">
                  Active mode: <strong className="text-gray-900 font-semibold">{llmMode}</strong>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-700">
                  Google Gemini API Key (Free tier supported)
                </label>
                <input
                  type="password"
                  value={geminiKey}
                  onChange={(e) => setGeminiKey(e.target.value)}
                  placeholder="AIzaSy..."
                  className="w-full bg-white border border-gray-200 rounded-lg p-2 font-mono text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-800 text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-700">
                  Groq API Key (Free tier supported)
                </label>
                <input
                  type="password"
                  value={groqKey}
                  onChange={(e) => setGroqKey(e.target.value)}
                  placeholder="gsk_..."
                  className="w-full bg-white border border-gray-200 rounded-lg p-2 font-mono text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-800 text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-700">
                  OpenAI API Key (Optional)
                </label>
                <input
                  type="password"
                  value={openaiKey}
                  onChange={(e) => setOpenaiKey(e.target.value)}
                  placeholder="sk-..."
                  className="w-full bg-white border border-gray-200 rounded-lg p-2 font-mono text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-800 text-xs"
                />
              </div>

              <p className="text-xs text-gray-500 italic">
                * Zero keys required: FINN operates out-of-the-box using built-in deterministic heuristics & pre-computed models.
              </p>
            </div>
          )}

          {activeTab === 'active_alerts' && (
            <div className="space-y-2.5">
              {alerts.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  <Bell className="w-6 h-6 mx-auto mb-1 opacity-40" />
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
                    className="bg-gray-50 border border-gray-200 hover:border-gray-300 p-3 rounded-xl cursor-pointer transition space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-gray-900 font-mono">{al.symbol}</span>
                      <span className="text-xs text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded font-medium">
                        {al.alert_type.replace('_', ' ')}
                      </span>
                    </div>
                    <div className="text-xs font-semibold text-gray-800">{al.title}</div>
                    <p className="text-xs text-gray-600 leading-snug">{al.description}</p>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-3 border-t border-gray-200 flex items-center justify-between bg-gray-50">
          <span className="text-xs text-gray-500">
            {savedSuccess ? (
              <span className="text-emerald-700 font-semibold flex items-center gap-1">
                <Check className="w-3.5 h-3.5" /> Saved
              </span>
            ) : (
              'Live updates across portfolio'
            )}
          </span>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-gray-900 hover:bg-gray-800 text-white rounded-lg text-xs font-semibold transition"
          >
            Save changes
          </button>
        </div>
      </div>
    </div>
  );
};
