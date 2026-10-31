import React, { useState } from 'react';
import { api } from '../services/api';
import { CopilotResponse } from '../types';
import { 
  Sparkles, Send, Bot, User, ExternalLink, 
  ShieldCheck, ArrowRight, CornerDownRight, CheckCircle2 
} from 'lucide-react';

interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  sources?: Array<{ title: string; type: string; date: string; url: string }>;
  model?: string;
  timestamp: string;
}

export const CopilotView: React.FC = () => {
  const [selectedSymbol, setSelectedSymbol] = useState('TRENT');
  const [queryInput, setQueryInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      text: `Hello, Partner. I am FINN, your Primary Research Copilot. I analyze corporate disclosures, quarterly concalls, and annual reports to give you verifiable financial answers with zero hallucination. Select a stock and query anything.`,
      timestamp: 'Just now',
    },
  ]);

  const stockList = [
    'TRENT',
    'DIXON',
    'TATAMOTORS',
    'RELIANCE',
    'ZOMATO',
    'HDFCBANK',
    'POLYCAB',
    'HAL',
    'PERSISTENT',
    'KAYNES'
  ];

  const quickPrompts = [
    { label: '🎯 Audit Guidance vs Reality', prompt: 'Audit management guidance across the last 4 quarters versus actual delivered numbers.' },
    { label: '⚠️ Scan Red Flags & Footnotes', prompt: 'Scan Note 34 on Related Party Transactions, Contingent Liabilities, and Auditor qualifications.' },
    { label: '💰 CFO vs PAT Cash Conversion', prompt: 'Analyze cash flow quality: Does Operating Cash Flow exceed Net Profit or is there working capital divergence?' },
    { label: '🏭 Capex & Capacity Timelines', prompt: 'What are the committed capex outlays and commercialization timelines for new facilities?' },
    { label: '👔 C-Suite Pedigree Audit', prompt: 'Detail recent C-Suite management changes, former roles, and pedigree highlights.' }
  ];

  const handleSend = async (customPrompt?: string) => {
    const textToSend = customPrompt || queryInput;
    if (!textToSend.trim() || loading) return;

    const userMsg: Message = {
      id: String(Date.now()),
      sender: 'user',
      text: `[${selectedSymbol}] ${textToSend.trim()}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!customPrompt) setQueryInput('');
    setLoading(true);

    try {
      const resp: CopilotResponse = await api.askCopilot(selectedSymbol, textToSend.trim());
      const botMsg: Message = {
        id: String(Date.now() + 1),
        sender: 'assistant',
        text: resp.answer,
        sources: resp.sources,
        model: resp.model,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch (err: any) {
      const errorMsg: Message = {
        id: String(Date.now() + 1),
        sender: 'assistant',
        text: `Error processing query: ${err.message || 'Please check your connection'}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-3 pb-24">
      {/* 1. Header Card (Groww Style) */}
      <div className="bg-white rounded-2xl p-4 border border-[#ebecef] shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-full bg-[#00D09C] flex items-center justify-center text-white shadow-xs">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <h3 className="font-bold text-sm text-[#1e222b]">FINN Primary Copilot</h3>
                <span className="text-[10px] font-bold text-[#00875A] bg-[#e8f8f3] px-2 py-0.5 rounded-full">
                  Primary Grounded
                </span>
              </div>
              <p className="text-[11px] text-[#7c7e8c]">
                Concall Transcripts • Annual Reports • BSE/NSE Disclosures
              </p>
            </div>
          </div>
        </div>

        {/* Stock Selector Chips */}
        <div>
          <div className="text-[11px] text-[#7c7e8c] font-medium mb-1.5">
            Target Company:
          </div>
          <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
            {stockList.map((sym) => (
              <button
                key={sym}
                onClick={() => setSelectedSymbol(sym)}
                className={`px-3 py-1.5 rounded-full font-mono font-medium text-xs transition ${
                  selectedSymbol === sym
                    ? 'bg-[#1e222b] text-white shadow-xs font-bold'
                    : 'bg-[#f5f6f8] text-[#7c7e8c] hover:bg-[#ebecef] hover:text-[#1e222b]'
                }`}
              >
                {sym}
              </button>
            ))}
          </div>
        </div>

        {/* Quick Audit Pills */}
        <div className="pt-2 border-t border-[#f5f6f8]">
          <div className="text-[11px] text-[#7c7e8c] font-medium mb-1.5">
            Quick Forensic Queries:
          </div>
          <div className="flex flex-wrap gap-1.5">
            {quickPrompts.map((p, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(p.prompt)}
                disabled={loading}
                className="bg-[#f5f6f8] hover:bg-[#ebecef] text-[#1e222b] px-2.5 py-1 rounded-lg text-xs font-medium transition flex items-center space-x-1"
              >
                <span>{p.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 2. Chat Stream */}
      <div className="space-y-3">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${
              msg.sender === 'user' ? 'items-end' : 'items-start'
            }`}
          >
            <div
              className={`max-w-[90%] md:max-w-[80%] rounded-2xl p-3.5 text-xs leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-[#1e222b] text-white rounded-br-none shadow-xs font-medium'
                  : 'bg-white border border-[#ebecef] text-[#1e222b] rounded-bl-none shadow-xs'
              }`}
            >
              {msg.sender === 'assistant' && (
                <div className="flex items-center justify-between border-b border-[#f5f6f8] pb-1.5 mb-2 text-[11px]">
                  <span className="font-bold text-[#00875A] flex items-center gap-1">
                    <Bot className="w-3.5 h-3.5" />
                    FINN Primary Intelligence
                  </span>
                  {msg.model && (
                    <span className="text-[10px] text-[#7c7e8c] truncate max-w-[160px]">
                      {msg.model}
                    </span>
                  )}
                </div>
              )}

              <div className="whitespace-pre-line text-xs">
                {msg.text}
              </div>

              {/* Cited Primary Sources */}
              {msg.sources && msg.sources.length > 0 && (
                <div className="mt-3 pt-2.5 border-t border-[#f5f6f8] space-y-1.5">
                  <div className="text-[10px] font-bold text-[#7c7e8c] uppercase tracking-wider flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-[#00875A]" />
                    Primary Sources Cited
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                    {msg.sources.map((s, idx) => (
                      <a
                        key={idx}
                        href={s.url}
                        target="_blank"
                        rel="noreferrer"
                        className="bg-[#f5f6f8] hover:bg-[#ebecef] p-2 rounded-lg flex items-center justify-between text-[11px] text-[#1e222b] transition group"
                      >
                        <div className="truncate mr-2">
                          <div className="font-semibold truncate">{s.title}</div>
                          <div className="text-[10px] text-[#7c7e8c]">{s.type} • {s.date}</div>
                        </div>
                        <ExternalLink className="w-3 h-3 text-[#7c7e8c] group-hover:text-[#00875A] shrink-0" />
                      </a>
                    ))}
                  </div>
                </div>
              )}

              <div
                className={`text-[9px] mt-1.5 text-right ${
                  msg.sender === 'user' ? 'text-white/60' : 'text-[#7c7e8c]'
                }`}
              >
                {msg.timestamp}
              </div>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex items-center space-x-2 p-3 bg-white border border-[#ebecef] rounded-2xl w-fit text-xs text-[#7c7e8c] shadow-xs">
            <div className="w-3.5 h-3.5 border-2 border-[#00D09C] border-t-transparent rounded-full animate-spin"></div>
            <span>Analyzing concall transcripts and footnotes for {selectedSymbol}...</span>
          </div>
        )}
      </div>

      {/* 3. Input Form Fixed at bottom */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="relative flex items-center bg-white rounded-2xl border border-[#ebecef] p-1.5 shadow-sm"
      >
        <input
          type="text"
          value={queryInput}
          onChange={(e) => setQueryInput(e.target.value)}
          placeholder={`Ask anything about ${selectedSymbol}'s concalls, guidance, or red flags...`}
          className="w-full bg-transparent pl-3 pr-12 py-2 text-xs text-[#1e222b] placeholder-[#7c7e8c] focus:outline-none font-medium"
        />
        <button
          type="submit"
          disabled={loading || !queryInput.trim()}
          className="absolute right-2 p-2 bg-[#00D09C] hover:bg-[#00B386] disabled:opacity-40 text-white rounded-xl transition shadow-xs"
        >
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>
    </div>
  );
};
