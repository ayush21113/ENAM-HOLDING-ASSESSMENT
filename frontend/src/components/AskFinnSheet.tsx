import React, { useState } from 'react';
import { api } from '../services/api';
import { X, Send, BookOpen, Sparkles, ArrowRight } from 'lucide-react';

interface AskFinnSheetProps {
  isOpen: boolean;
  onClose: () => void;
  symbol?: string;
  contextTitle?: string;
}

interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  sources?: Array<{ title: string; type: string; date: string; url: string }>;
  timestamp: string;
}

export const AskFinnSheet: React.FC<AskFinnSheetProps> = ({
  isOpen,
  onClose,
  symbol = 'TRENT.NS',
  contextTitle,
}) => {
  const cleanSymbol = symbol.replace('.NS', '').replace('.BO', '');
  const [queryInput, setQueryInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);

  const suggestedPrompts = [
    `Audit ${cleanSymbol}'s guidance vs actual delivery`,
    `Why did operating margins change this quarter?`,
    `Summarize committed capex & expansion plans`,
    `Any red flags in Note 34 or auditor footnotes?`,
  ];

  const handleSend = async (customPrompt?: string) => {
    const textToSend = customPrompt || queryInput;
    if (!textToSend.trim() || loading) return;

    const userMsg: Message = {
      id: String(Date.now()),
      sender: 'user',
      text: textToSend.trim(),
      timestamp: 'Just now',
    };

    setMessages((prev) => [...prev, userMsg]);
    setQueryInput('');
    setLoading(true);

    try {
      const resp = await api.askCopilot(cleanSymbol, userMsg.text);
      const assistantMsg: Message = {
        id: String(Date.now() + 1),
        sender: 'assistant',
        text: resp.answer,
        sources: resp.sources,
        timestamp: 'Just now',
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: String(Date.now() + 1),
          sender: 'assistant',
          text: `Unable to query primary sources right now. Please verify your connection or model settings.`,
          timestamp: 'Just now',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 backdrop-blur-xs transition-opacity duration-200">
      {/* Backdrop click to dismiss */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Sheet Container */}
      <div className="relative w-full max-w-lg bg-white rounded-t-3xl max-h-[85vh] flex flex-col shadow-2xl z-10 overflow-hidden animate-in slide-in-from-bottom duration-200">
        {/* Grab Handle & Header */}
        <div className="pt-3 pb-2 px-4 border-b border-[#ebecef] flex items-center justify-between">
          <div>
            <div className="w-10 h-1 bg-[#ebecef] rounded-full mx-auto mb-2" />
            <div className="flex items-center space-x-1.5">
              <span className="text-xs font-bold text-[#1e222b]">
                Ask FINN
              </span>
              <span className="text-xs text-[#7c7e8c]">•</span>
              <span className="text-xs font-semibold text-[#00875A] font-mono">
                {cleanSymbol}
              </span>
            </div>
            <p className="text-[11px] text-[#7c7e8c]">
              {contextTitle || 'Primary disclosures & concall transcripts'}
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-[#f5f6f8] text-[#7c7e8c] transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Message Stream */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-[220px]">
          {messages.length === 0 ? (
            <div className="space-y-3 py-2">
              <div className="text-xs font-medium text-[#7c7e8c]">
                Suggested questions for {cleanSymbol}:
              </div>
              <div className="space-y-1.5">
                {suggestedPrompts.map((prompt, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSend(prompt)}
                    className="w-full text-left p-2.5 rounded-xl bg-[#f5f6f8] hover:bg-[#ebecef] text-xs text-[#1e222b] transition flex items-center justify-between group"
                  >
                    <span>{prompt}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#7c7e8c] group-hover:text-[#1e222b] shrink-0 ml-2" />
                  </button>
                ))}
              </div>
            </div>
          ) : (
            messages.map((m) => (
              <div
                key={m.id}
                className={`flex flex-col ${
                  m.sender === 'user' ? 'items-end' : 'items-start'
                }`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed ${
                    m.sender === 'user'
                      ? 'bg-[#1e222b] text-white rounded-br-xs'
                      : 'bg-[#f5f6f8] text-[#1e222b] rounded-bl-xs space-y-2'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{m.text}</p>

                  {m.sources && m.sources.length > 0 && (
                    <div className="pt-2 border-t border-[#ebecef] space-y-1">
                      <span className="text-[10px] font-semibold text-[#7c7e8c] flex items-center gap-1">
                        <BookOpen className="w-3 h-3 text-[#00875A]" /> Sources cited:
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {m.sources.map((s, idx) => (
                          <span
                            key={idx}
                            className="text-[10px] bg-white border border-[#ebecef] text-[#1e222b] px-2 py-0.5 rounded font-mono"
                          >
                            {s.title}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}

          {loading && (
            <div className="flex items-center space-x-2 text-xs text-[#7c7e8c] py-2">
              <div className="w-4 h-4 border-2 border-[#00D09C] border-t-transparent rounded-full animate-spin" />
              <span>Grounded analysis in progress...</span>
            </div>
          )}
        </div>

        {/* Query Input */}
        <div className="p-3 border-t border-[#ebecef] bg-white safe-area-pb">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center space-x-2"
          >
            <input
              type="text"
              value={queryInput}
              onChange={(e) => setQueryInput(e.target.value)}
              placeholder={`Ask anything about ${cleanSymbol}...`}
              className="flex-1 bg-[#f5f6f8] rounded-xl px-3.5 py-2.5 text-xs text-[#1e222b] placeholder-[#7c7e8c] focus:outline-none focus:bg-white focus:ring-1 focus:ring-[#00875A] transition"
            />
            <button
              type="submit"
              disabled={!queryInput.trim() || loading}
              className="p-2.5 bg-[#00875A] hover:bg-[#00704A] disabled:opacity-40 text-white rounded-xl transition shrink-0"
              aria-label="Send"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
