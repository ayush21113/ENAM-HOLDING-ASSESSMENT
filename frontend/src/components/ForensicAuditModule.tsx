import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { ForensicReport } from '../types';
import { ShieldCheck, AlertTriangle, CheckCircle, FileText, HelpCircle, ShieldAlert } from 'lucide-react';

interface ForensicAuditModuleProps {
  symbol: string;
}

export const ForensicAuditModule: React.FC<ForensicAuditModuleProps> = ({ symbol }) => {
  const [report, setReport] = useState<ForensicReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadForensicReport();
  }, [symbol]);

  const loadForensicReport = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getForensicRedFlags(symbol);
      setReport(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load forensic audit');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="py-8 flex flex-col items-center justify-center space-y-2">
        <div className="w-5 h-5 border-2 border-[#00D09C] border-t-transparent rounded-full animate-spin"></div>
        <p className="text-xs text-[#7c7e8c] font-medium">Auditing footnotes, auditor reports & RPTs...</p>
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="p-4 bg-red-50 text-red-700 rounded-xl text-xs">
        Failed to load forensic analysis.
      </div>
    );
  }

  const getHealthBadge = (health: string) => {
    switch (health) {
      case 'PRISTINE':
        return (
          <span className="flex items-center space-x-1.5 text-xs font-semibold text-[#00875A]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00875A]"></span>
            <span>Pristine Governance</span>
          </span>
        );
      case 'MONITOR':
        return (
          <span className="flex items-center space-x-1.5 text-xs font-semibold text-amber-600">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
            <span>Monitor Items</span>
          </span>
        );
      default:
        return (
          <span className="flex items-center space-x-1.5 text-xs font-semibold text-[#EB5B3C]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#EB5B3C]"></span>
            <span>Elevated Risk</span>
          </span>
        );
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'clean':
        return <CheckCircle className="w-4 h-4 text-[#00875A] shrink-0 mt-0.5" />;
      case 'monitor':
        return <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />;
      default:
        return <ShieldAlert className="w-4 h-4 text-[#EB5B3C] shrink-0 mt-0.5" />;
    }
  };

  return (
    <div className="space-y-3">
      {/* Overview Card */}
      <div className="bg-[#f5f6f8] rounded-xl p-3.5 flex items-center justify-between">
        <div>
          <div className="text-[11px] text-[#7c7e8c] font-medium">Forensic Integrity Score</div>
          <div className="text-sm font-bold text-[#1e222b] mt-0.5">
            Statutory Footnote & Governance Audit
          </div>
        </div>
        {getHealthBadge(report.overall_health)}
      </div>

      {/* Flags List (Groww clean list rows) */}
      <div className="divide-y divide-[#f5f6f8] border border-[#ebecef] rounded-xl overflow-hidden bg-white">
        {report.flags.map((flag, idx) => (
          <div key={idx} className="p-3.5 flex items-start space-x-3 hover:bg-[#fafbfd] transition">
            {getSeverityIcon(flag.severity)}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h5 className="text-xs font-bold text-[#1e222b]">{flag.title}</h5>
                <span className={`text-xs font-semibold flex items-center space-x-1 uppercase tracking-wider ${
                  flag.severity === 'clean' 
                    ? 'text-[#00875A]' 
                    : flag.severity === 'monitor'
                    ? 'text-amber-600'
                    : 'text-[#EB5B3C]'
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${
                    flag.severity === 'clean' ? 'bg-[#00875A]' : flag.severity === 'monitor' ? 'bg-amber-500' : 'bg-[#EB5B3C]'
                  }`}></span>
                  <span>{flag.severity}</span>
                </span>
              </div>
              <p className="text-xs text-[#44475b] leading-relaxed mt-1">
                {flag.detail}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="p-2.5 bg-blue-50/60 rounded-xl text-[11px] text-blue-900 flex items-start space-x-2">
        <FileText className="w-3.5 h-3.5 shrink-0 mt-0.5 text-blue-700" />
        <span>
          <strong>Source Methodology:</strong> Verified against Note 34 (Related Party Disclosures), Independent Auditor's Report in FY26 Annual Report, and Cash Flow reconciliation under Ind AS 7.
        </span>
      </div>
    </div>
  );
};
