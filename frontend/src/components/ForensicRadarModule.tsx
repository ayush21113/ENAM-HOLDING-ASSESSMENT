import React from 'react';
import { ForensicAccountingRadar } from '../types';
import { ShieldCheck, AlertTriangle, ShieldAlert, Award, FileSpreadsheet, CheckCircle2 } from 'lucide-react';

interface ForensicRadarModuleProps {
  radar?: ForensicAccountingRadar;
  companyName: string;
}

export const ForensicRadarModule: React.FC<ForensicRadarModuleProps> = ({
  radar,
  companyName
}) => {
  if (!radar) {
    return (
      <div className="py-8 text-center text-xs text-[#7C7E8C]">
        Forensic accounting radar data pending annual report extraction.
      </div>
    );
  }

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'LOW':
        return 'text-[#00875A] bg-[#00D09C]/10 border-[#00D09C]/20';
      case 'MODERATE':
        return 'text-amber-700 bg-amber-50 border-amber-200';
      default:
        return 'text-rose-700 bg-rose-50 border-rose-200';
    }
  };

  const getMetricBadge = (verdict: string) => {
    switch (verdict) {
      case 'SAFE':
        return (
          <span className="text-xs font-bold text-[#00875A] flex items-center space-x-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00875A]"></span>
            <span>SAFE</span>
          </span>
        );
      case 'WATCHLIST':
        return (
          <span className="text-xs font-bold text-amber-600 flex items-center space-x-1">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
            <span>WATCHLIST</span>
          </span>
        );
      default:
        return (
          <span className="text-xs font-bold text-[#EB5B3C] flex items-center space-x-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#EB5B3C]"></span>
            <span>FLAG</span>
          </span>
        );
    }
  };

  return (
    <div className="space-y-4">
      {/* Top Composite Gauge Banner */}
      <div className="p-4 rounded-xl bg-white border border-[#EBECEF] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-[#00D09C]/15 flex items-center justify-center text-[#00875A] shrink-0">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h4 className="text-sm font-bold text-[#1F2937]">Beneish M-Score & Forensic Radar</h4>
              <span className={`text-xs font-bold uppercase tracking-wider flex items-center space-x-1 ${
                radar.manipulation_risk === 'LOW' ? 'text-[#00875A]' : radar.manipulation_risk === 'MODERATE' ? 'text-amber-600' : 'text-[#EB5B3C]'
              }`}>
                <span className={`w-1.5 h-1.5 rounded-full ${
                  radar.manipulation_risk === 'LOW' ? 'bg-[#00875A]' : radar.manipulation_risk === 'MODERATE' ? 'bg-amber-500' : 'bg-[#EB5B3C]'
                }`}></span>
                <span>{radar.manipulation_risk} Risk</span>
              </span>
            </div>
            <p className="text-xs text-[#7C7E8C] mt-0.5">
              Beneish M-Score: <span className="font-bold text-[#1F2937]">{radar.beneish_m_score}</span> (Threshold: &lt; -2.22 is pristine)
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 bg-white px-3 py-1.5 rounded-xl border border-[#EBECEF] self-start sm:self-center">
          <span className="text-xs text-[#7C7E8C]">Earnings Quality:</span>
          <span className="text-sm font-black text-[#00875A]">{radar.composite_health_score}/100</span>
        </div>
      </div>

      {/* 5 Core Forensic Metrics Grid */}
      <div className="space-y-2">
        <h5 className="text-[11px] font-bold uppercase tracking-wider text-[#7C7E8C]">
          Core Accounting Quality Dimensions
        </h5>
        <div className="grid grid-cols-1 gap-2.5">
          {radar.metrics.map((m, idx) => (
            <div 
              key={idx}
              className="p-3 rounded-xl bg-white border border-[#EBECEF] hover:border-[#00D09C]/30 transition-colors space-y-1.5"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-bold text-[#1F2937]">{m.metric_name}</span>
                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-neutral-100 text-neutral-600 font-bold">
                    {m.metric_code}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-semibold text-[#1F2937]">Score: {m.value}</span>
                  {getMetricBadge(m.verdict)}
                </div>
              </div>
              <p className="text-xs text-[#44475B] leading-relaxed">{m.detail}</p>
              <p className="text-[10px] text-[#7C7E8C]">
                Institutional Benchmark: <span className="font-medium text-neutral-600">{m.benchmark}</span>
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Auditor Opinion & Note 34 Audit Strip */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
        {/* Auditor Report */}
        <div className="p-3 rounded-xl bg-white border border-[#EBECEF] space-y-1">
          <div className="flex items-center space-x-1.5 text-xs font-bold text-[#1F2937]">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#00875A]" />
            <span>Statutory Auditor Sign-off</span>
          </div>
          <p className="text-xs text-[#44475B] leading-relaxed">
            {radar.auditor_opinion}
          </p>
        </div>

        {/* Note 34 Related Party */}
        <div className="p-3 rounded-xl bg-white border border-[#EBECEF] space-y-1">
          <div className="flex items-center space-x-1.5 text-xs font-bold text-[#1F2937]">
            <ShieldCheck className="w-3.5 h-3.5 text-[#00875A]" />
            <span>Note 34 (RPT Governance)</span>
          </div>
          <p className="text-xs text-[#44475B] leading-relaxed">
            {radar.rpt_note34_verdict}
          </p>
        </div>
      </div>
    </div>
  );
};
