import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { BriefingResponse } from '../types';
import { Play, Pause, RotateCcw, Volume2, Sparkles, ChevronDown, ChevronUp, Radio } from 'lucide-react';

export const MorningBriefingCard: React.FC = () => {
  const [briefing, setBriefing] = useState<BriefingResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [supported, setSupported] = useState(true);

  useEffect(() => {
    loadBriefing();
    if (typeof window !== 'undefined' && !('speechSynthesis' in window)) {
      setSupported(false);
    }
  }, []);

  const loadBriefing = async () => {
    try {
      const data = await api.getBriefing();
      setBriefing(data);
    } catch (e) {
      console.error('Failed to load morning briefing', e);
    } finally {
      setLoading(false);
    }
  };

  const handlePlayToggle = () => {
    if (!briefing || !window.speechSynthesis) return;

    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
    } else {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(briefing.script);
      utterance.rate = 1.05;
      utterance.pitch = 1.0;
      utterance.onend = () => setIsPlaying(false);
      utterance.onerror = () => setIsPlaying(false);
      window.speechSynthesis.speak(utterance);
      setIsPlaying(true);
    }
  };

  const handleRestart = () => {
    if (!briefing || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(briefing.script);
    utterance.rate = 1.05;
    utterance.onend = () => setIsPlaying(false);
    utterance.onerror = () => setIsPlaying(false);
    window.speechSynthesis.speak(utterance);
    setIsPlaying(true);
  };

  if (loading || !briefing) return null;

  return (
    <div className="bg-gradient-to-r from-[#00D09C]/10 via-[#00D09C]/5 to-transparent rounded-2xl p-4 border border-[#00D09C]/25 shadow-xs transition space-y-3">
      {/* Header Line */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-7 h-7 rounded-full bg-[#00D09C] flex items-center justify-center text-white shadow-xs">
            <Radio className="w-3.5 h-3.5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <span className="text-xs font-bold text-[#1e222b]">60-Sec Morning Briefing</span>
              <span className="text-[10px] font-bold text-[#00875A] bg-white px-1.5 py-0.2 rounded border border-[#00D09C]/30">
                AI Voice
              </span>
            </div>
            <span className="text-[11px] text-[#7c7e8c]">
              {briefing.tier1_count} Tier-1 Filings • {briefing.catalysts_count} High-Conviction Catalysts
            </span>
          </div>
        </div>

        {/* Audio Action Button */}
        <div className="flex items-center space-x-1.5">
          {isPlaying && (
            <button
              onClick={handleRestart}
              className="p-1.5 rounded-full hover:bg-white text-[#7c7e8c] hover:text-[#1e222b] transition"
              title="Restart"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          )}

          <button
            onClick={handlePlayToggle}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition shadow-xs ${
              isPlaying
                ? 'bg-[#EB5B3C] text-white hover:bg-[#d64b2d]'
                : 'bg-[#00D09C] text-white hover:bg-[#00B386]'
            }`}
          >
            {isPlaying ? (
              <>
                <Pause className="w-3.5 h-3.5 fill-current" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Listen</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Dynamic Animated Soundwave when playing */}
      {isPlaying && (
        <div className="flex items-center justify-center space-x-1 py-1">
          <span className="text-[10px] font-semibold text-[#00875A] mr-2">Speaking briefing:</span>
          {[40, 70, 30, 90, 60, 100, 50, 80, 45, 95, 30, 75, 40].map((h, i) => (
            <div
              key={i}
              className="w-1 bg-[#00D09C] rounded-full animate-bounce"
              style={{
                height: `${h * 0.16}px`,
                animationDelay: `${(i % 5) * 0.1}s`,
                animationDuration: '0.6s'
              }}
            />
          ))}
        </div>
      )}

      {/* Script Preview / Expand */}
      <div className="pt-2 border-t border-[#00D09C]/15 flex items-center justify-between text-xs">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center space-x-1 text-[#00875A] font-semibold hover:underline"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>{isExpanded ? 'Hide Briefing Transcript' : 'Read Full Executive Transcript'}</span>
          {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>

        <span className="text-[10px] text-[#7c7e8c] font-mono">
          {briefing.timestamp}
        </span>
      </div>

      {isExpanded && (
        <div className="bg-white/80 rounded-xl p-3 border border-[#ebecef] text-xs text-[#1e222b] leading-relaxed space-y-2 animate-in fade-in duration-200">
          <div className="font-semibold text-[#00875A] flex items-center gap-1.5">
            <Volume2 className="w-3.5 h-3.5" />
            Synthesized Audio Script
          </div>
          <p className="italic text-[#44475b]">
            "{briefing.script}"
          </p>
        </div>
      )}
    </div>
  );
};
