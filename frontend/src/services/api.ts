import { 
  Announcement, 
  StockEOD, 
  TriggeredAlert, 
  ResearchPullResponse, 
  UserSettings,
  BriefingResponse,
  ForensicReport,
  CopilotResponse,
  CatalystCalendarEvent,
  ICMemoResponse 
} from '../types';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8000/api';

export const api = {
  async getHealth() {
    const res = await fetch(`${API_BASE}/health`);
    return res.json();
  },

  async getPortfolio(): Promise<{ count: number; stocks: StockEOD[]; active_alerts_count: number }> {
    const res = await fetch(`${API_BASE}/portfolio`);
    if (!res.ok) throw new Error('Failed to fetch portfolio data');
    return res.json();
  },

  async getFeed(params: {
    window_hours?: number;
    ticker?: string;
    category?: string;
    hide_routine?: boolean;
  }): Promise<{ window_hours: number; count: number; announcements: Announcement[]; categories_breakdown: Record<string, number> }> {
    const query = new URLSearchParams();
    if (params.window_hours) query.append('window_hours', params.window_hours.toString());
    if (params.ticker) query.append('ticker', params.ticker);
    if (params.category) query.append('category', params.category);
    if (params.hide_routine !== undefined) query.append('hide_routine', params.hide_routine.toString());

    const res = await fetch(`${API_BASE}/feed?${query.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch feed digest');
    return res.json();
  },

  async getAlerts(): Promise<{ count: number; alerts: TriggeredAlert[] }> {
    const res = await fetch(`${API_BASE}/alerts`);
    if (!res.ok) throw new Error('Failed to fetch alerts');
    return res.json();
  },

  async getResearchPull(symbol: string): Promise<ResearchPullResponse> {
    const res = await fetch(`${API_BASE}/research/${encodeURIComponent(symbol)}`);
    if (!res.ok) throw new Error(`Failed to fetch research for ${symbol}`);
    return res.json();
  },

  async getSettings(): Promise<{ thresholds: UserSettings; llm_router: any }> {
    const res = await fetch(`${API_BASE}/settings`);
    if (!res.ok) throw new Error('Failed to fetch settings');
    return res.json();
  },

  async updateSettings(settings: UserSettings): Promise<any> {
    const res = await fetch(`${API_BASE}/settings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings),
    });
    if (!res.ok) throw new Error('Failed to update settings');
    return res.json();
  },

  async classifyText(title: string, content: string): Promise<{ category: string; tier: number; is_material: boolean }> {
    const res = await fetch(`${API_BASE}/classify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, content }),
    });
    if (!res.ok) throw new Error('Failed to classify text');
    return res.json();
  },

  async getBriefing(): Promise<BriefingResponse> {
    const res = await fetch(`${API_BASE}/ai/briefing`);
    if (!res.ok) throw new Error('Failed to fetch AI briefing');
    return res.json();
  },

  async askCopilot(symbol: string, query: string): Promise<CopilotResponse> {
    const res = await fetch(`${API_BASE}/ai/copilot`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ symbol, query }),
    });
    if (!res.ok) throw new Error('Failed to query Copilot');
    return res.json();
  },

  async getForensicRedFlags(symbol: string): Promise<ForensicReport> {
    const res = await fetch(`${API_BASE}/ai/redflags/${encodeURIComponent(symbol)}`);
    if (!res.ok) throw new Error(`Failed to fetch red flags for ${symbol}`);
    return res.json();
  },

  async getCalendar(): Promise<{ count: number; events: CatalystCalendarEvent[] }> {
    const res = await fetch(`${API_BASE}/catalysts/calendar`);
    if (!res.ok) throw new Error('Failed to fetch catalyst calendar');
    return res.json();
  },

  async getICMemo(): Promise<ICMemoResponse> {
    const res = await fetch(`${API_BASE}/ai/ic-memo`);
    if (!res.ok) throw new Error('Failed to generate IC Morning Memo');
    return res.json();
  }
};
