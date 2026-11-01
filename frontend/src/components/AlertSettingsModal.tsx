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
      <div className="bg-white border border-[#ebecef] rounded-2xl w-full max-w-md max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 border-b border-[#ebecef]">
          <div className="flex items-center space-x-2">
            <Sliders className="w-4 h-4 text-[#00875A]" />
            <h3 className="font-bold text-sm text-[#1e222b]">Settings & Threshold Triggers</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-[#7c7e8c] hover:text-[#1e222b] hover:bg-[#f5f6f8] transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Tabs */}
        <div className="flex border-b border-[#ebecef] bg-[#f5f6f8] p-1 text-xs">
          <button
            onClick={() => setActiveTab('thresholds')}
            className={`flex-1 py-1.5 rounded-lg font-medium transition ${
              activeTab === 'thresholds'
                ? 'bg-white text-[#1e222b] font-bold shadow-xs'
                : 'text-[#7c7e8c] hover:text-[#1e222b]'
            }`}
          >
            Thresholds
          </button>
          <button
            onClick={() => setActiveTab('llm')}
            className={`flex-1 py-1.5 rounded-lg font-medium transition flex items-center justify-center gap-1 ${
              activeTab === 'llm'
                ? 'bg-white text-[#1e222b] font-bold shadow-xs'
                : 'text-[#7c7e8c] hover:text-[#1e222b]'
            }`}
          >
            <Zap className="w-3.5 h-3.5 text-[#00875A]" />
            Model Routing
          </button>
          <button
            onClick={() => setActiveTab('active_alerts')}
            className={`flex-1 py-1.5 rounded-lg font-medium transition flex items-center justify-center gap-1 ${
              activeTab === 'active_alerts'
                ? 'bg-white text-[#1e222b] font-bold shadow-xs'
                : 'text-[#7c7e8c] hover:text-[#1e222b]'
            }`}
          >
            <Bell className="w-3.5 h-3.5 text-[#EB5B3C]" />
            Alerts ({alerts.length})
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 overflow-y-auto space-y-4 flex-1 text-xs">
          {activeTab === 'thresholds' && (
            <div className="space-y-4">
              <div className="space-y-2 bg-[#f5f6f8] p-3.5 rounded-xl border border-[#ebecef]">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-[#1e222b]">Price change threshold</span>
                  <span className="font-mono text-[#00875A] font-bold text-sm">±{priceThresh}%</span>
                </div>
                <input
                  type="range"
                  min="1.0"
                  max="10.0"
                  step="0.5"
                  value={priceThresh}
                  onChange={(e) => setPriceThresh(parseFloat(e.target.value))}
                  className="w-full accent-[#00D09C] cursor-pointer"
                />
                <p className="text-xs text-[#7c7e8c]">
                  Trigger an immediate alert when a portfolio stock swings beyond ±{priceThresh}% in a single day.
                </p>
              </div>

              <div className="space-y-2 bg-[#f5f6f8] p-3.5 rounded-xl border border-[#ebecef]">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-[#1e222b]">Unusual volume threshold</span>
                  <span className="font-mono text-[#00875A] font-bold text-sm">{volThresh}x</span>
                </div>
                <input
                  type="range"
                  min="1.2"
                  max="5.0"
                  step="0.2"
                  value={volThresh}
                  onChange={(e) => setVolThresh(parseFloat(e.target.value))}
                  className="w-full accent-[#00D09C] cursor-pointer"
                />
                <p className="text-xs text-[#7c7e8c]">
                  Flags unusual trading volume when daily traded volume exceeds {volThresh}x its 20-day moving average.
                </p>
              </div>

              <div className="bg-[#f5f6f8] p-3.5 rounded-xl border border-[#ebecef] space-y-1">
                <div className="text-xs font-semibold text-[#1e222b]">
                  Material catalysts watchlist
                </div>
                <p className="text-xs text-[#44475b] leading-relaxed">
                  FINN automatically monitors Tier 1 catalysts: Quarterly Results, C-suite changes, M&A/Demergers, and Rating Actions.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'llm' && (
            <div className="space-y-3.5">
              <div className="bg-[#e8f8f3] border border-[#00D09C]/30 p-3.5 rounded-xl">
                <div className="flex items-center space-x-1.5 font-bold text-[#00875A] text-xs">
                  <Zap className="w-3.5 h-3.5 text-[#00875A]" />
                  <span>Cost-Conscious Model Routing</span>
                </div>
                <p className="text-xs text-[#44475b] mt-1 leading-relaxed">
                  Routine extraction tasks are routed to lightweight or free-tier models (Gemini 2.0 Flash / Groq Llama 3.3), reserving reasoning models solely for deep narrative synthesis.
                </p>
                <div className="mt-2 text-xs text-[#7c7e8c]">
                  Active mode: <strong className="text-[#1e222b] font-semibold">{llmMode}</strong>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#1e222b]">
                  Google Gemini API Key (Gemini 2.0 Flash)
                </label>
                <input
                  type="password"
                  value={geminiKey}
                  onChange={(e) => setGeminiKey(e.target.value)}
                  placeholder="AIzaSy..."
                  className="w-full bg-white border border-[#ebecef] rounded-lg p-2 font-mono text-[#1e222b] placeholder-[#7c7e8c] focus:outline-none focus:border-[#00D09C] text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#1e222b]">
                  Groq API Key (Free tier Llama 3.3)
                </label>
                <input
                  type="password"
                  value={groqKey}
                  onChange={(e) => setGroqKey(e.target.value)}
                  placeholder="gsk_..."
                  className="w-full bg-white border border-[#ebecef] rounded-lg p-2 font-mono text-[#1e222b] placeholder-[#7c7e8c] focus:outline-none focus:border-[#00D09C] text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#1e222b]">
                  OpenAI API Key (Optional)
                </label>
                <input
                  type="password"
                  value={openaiKey}
                  onChange={(e) => setOpenaiKey(e.target.value)}
                  placeholder="sk-..."
                  className="w-full bg-white border border-[#ebecef] rounded-lg p-2 font-mono text-[#1e222b] placeholder-[#7c7e8c] focus:outline-none focus:border-[#00D09C] text-xs"
                />
              </div>
            </div>
          )}

          {activeTab === 'active_alerts' && (
            <div className="space-y-2">
              {alerts.length === 0 ? (
                <div className="text-center py-8 text-[#7c7e8c] space-y-1">
                  <Bell className="w-6 h-6 mx-auto opacity-40" />
                  <p>Zero triggered alerts currently.</p>
                </div>
              ) : (
                alerts.map((al) => {
                  const isPriceSurge = al.alert_type === 'PRICE_SURGE';
                  const isVolume = al.alert_type === 'VOLUME_SPIKE';
                  const alertColor = isPriceSurge ? 'text-[#00875A]' : isVolume ? 'text-amber-600' : 'text-[#EB5B3C]';
                  const dotColor = isPriceSurge ? 'bg-[#00875A]' : isVolume ? 'bg-amber-500' : 'bg-[#EB5B3C]';

                  return (
                    <div
                      key={al.id}
                      onClick={() => {
                        onSelectTicker(al.symbol);
                        onClose();
                      }}
                      className="bg-white border border-[#ebecef] hover:border-[#00D09C] p-3 rounded-xl cursor-pointer transition space-y-1"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-[#1e222b]">{al.symbol.replace('.NS', '')}</span>
                        <span className={`text-[11px] font-bold flex items-center space-x-1 ${alertColor}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`}></span>
                          <span>{al.alert_type.replace('_', ' ')}</span>
                        </span>
                      </div>
                      <div className="text-xs font-semibold text-[#1e222b]">{al.title}</div>
                      <p className="text-xs text-[#44475b] leading-snug">{al.description}</p>
                    </div>
                  );
                })
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-3 border-t border-[#ebecef] flex items-center justify-between bg-[#fafbfd]">
          <span className="text-xs text-[#7c7e8c]">
            {savedSuccess ? (
              <span className="text-[#00875A] font-semibold flex items-center gap-1">
                <Check className="w-3.5 h-3.5" /> Saved
              </span>
            ) : (
              'Live updates across portfolio'
            )}
          </span>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-[#00D09C] hover:bg-[#00B386] text-white rounded-xl text-xs font-bold transition shadow-xs"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};
