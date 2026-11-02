import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { CatalystCalendarEvent } from '../types';
import { Calendar, PhoneCall, ChevronDown, ChevronUp, Clock, CheckCircle } from 'lucide-react';

interface CatalystCalendarProps {
  onSelectTicker?: (symbol: string) => void;
}

export const CatalystCalendarWidget: React.FC<CatalystCalendarProps> = ({ onSelectTicker }) => {
  const [events, setEvents] = useState<CatalystCalendarEvent[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCalendar();
  }, []);

  const loadCalendar = async () => {
    try {
      const data = await api.getCalendar();
      setEvents(data.events);
    } catch (err) {
      console.error('Failed to load catalyst calendar', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading || events.length === 0) return null;

  return (
    <div className="bg-white rounded-2xl p-4 border border-[#ebecef] shadow-xs space-y-3">
      {/* Header Line */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-full bg-[#f5f6f8] flex items-center justify-center text-[#00875A]">
            <Calendar className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <span className="text-xs font-bold text-[#1e222b]">Upcoming Catalyst & Concall Calendar</span>
              <span className="text-[10px] font-bold text-[#00875A] bg-[#e8f8f3] px-1.5 py-0.2 rounded">
                Quartr Sync
              </span>
            </div>
            <div className="text-[11px] text-[#7c7e8c]">
              Next 14 Days • {events.length} Key Portfolio Events
            </div>
          </div>
        </div>

        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-1.5 rounded-lg hover:bg-[#f5f6f8] text-[#7c7e8c] hover:text-[#1e222b] transition flex items-center space-x-1 text-xs font-medium"
        >
          <span>{isExpanded ? 'Collapse' : 'View Schedule'}</span>
          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {/* Primary Highlight Banner: Next Immediate Concall */}
      <div 
        onClick={() => onSelectTicker && onSelectTicker(events[0].symbol)}
        className="cursor-pointer bg-[#f5f6f8] hover:bg-[#ebecef] p-3 rounded-xl transition flex items-start justify-between space-x-3"
      >
        <div className="flex items-start space-x-2.5 min-w-0">
          <div className="w-2 h-2 rounded-full bg-[#00D09C] mt-1.5 shrink-0 animate-ping"></div>
          <div className="min-w-0">
            <div className="flex items-center space-x-2">
              <span className="font-bold text-xs text-[#1e222b] font-mono">{events[0].symbol.replace('.NS', '')}</span>
              <span className="text-xs text-[#7c7e8c] truncate">{events[0].company_name}</span>
            </div>
            <div className="text-xs font-semibold text-[#1e222b] mt-0.5">
              {events[0].details}
            </div>
            <div className="text-[11px] text-[#00875A] mt-0.5 font-medium flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {events[0].date} at {events[0].time}
            </div>
          </div>
        </div>
        <span className="shrink-0 text-xs font-semibold text-[#00875A] flex items-center space-x-1">
          <span className="w-1.5 h-1.5 rounded-full bg-[#00875A]"></span>
          <span>{events[0].status}</span>
        </span>
      </div>

      {/* Expanded Full Schedule Drawer */}
      {isExpanded && (
        <div className="divide-y divide-[#f5f6f8] border-t border-[#f5f6f8] pt-2 space-y-2">
          {events.slice(1).map((ev, idx) => (
            <div 
              key={idx}
              onClick={() => onSelectTicker && onSelectTicker(ev.symbol)}
              className="pt-2 flex items-start justify-between cursor-pointer hover:bg-[#fafbfd] p-1.5 rounded-lg transition"
            >
              <div className="min-w-0 space-y-0.5">
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-xs text-[#1e222b] font-mono">{ev.symbol.replace('.NS', '')}</span>
                  <span className="text-[11px] text-[#7c7e8c] truncate">{ev.company_name}</span>
                </div>
                <div className="text-xs text-[#1e222b] font-medium leading-snug">
                  {ev.details}
                </div>
                <div className="text-[10px] text-[#7c7e8c]">
                  <strong>Watchpoints:</strong> {ev.key_watchpoints}
                </div>
              </div>
              <div className="text-right shrink-0 ml-2">
                <span className="text-xs font-bold text-[#1e222b] font-mono block">{ev.date}</span>
                <span className="text-[10px] text-[#7c7e8c]">{ev.time}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
