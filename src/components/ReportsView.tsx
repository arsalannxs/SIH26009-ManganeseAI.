import React, { useState } from 'react';
import {
  FileText,
  Download,
  Printer,
  Sparkles,
  CheckCircle2,
  Calendar,
  Layers,
  ShieldCheck,
  Share2
} from 'lucide-react';
import { MiningArea, ReserveAnalysis, ProductionForecast, ShortfallAnalysis, Recommendation, Report } from '../types';

interface ReportsViewProps {
  selectedArea: MiningArea;
  reserve: ReserveAnalysis | null;
  forecast: ProductionForecast | null;
  shortfall: ShortfallAnalysis | null;
  recommendations: Recommendation[];
  aiExplanation?: string;
  reportsList: Report[];
  onGenerateReport: (type: string) => Promise<void>;
  generating: boolean;
}

export const ReportsView: React.FC<ReportsViewProps> = ({
  selectedArea,
  reserve,
  forecast,
  shortfall,
  recommendations,
  aiExplanation,
  reportsList,
  onGenerateReport,
  generating
}) => {
  const [selectedReportType, setSelectedReportType] = useState<string>('Comprehensive Mining Intelligence Report');
  const [activeTab, setActiveTab] = useState<'preview' | 'archive'>('preview');

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadText = () => {
    const reportText = `
================================================================================
MANGANESE AI - OFFICIAL MINING INTELLIGENCE REPORT
MINISTRY OF STEEL | MOIL LTD. (SIH26009)
================================================================================

Report Type: ${selectedReportType}
Generated Date: ${new Date().toLocaleString()}
Target Concession: ${selectedArea.name} (${selectedArea.code})
State/District: ${selectedArea.state}, ${selectedArea.district}
Area Footprint: ${selectedArea.sizeSqKm} sq km
Lithological Sequence: ${selectedArea.formation}

--------------------------------------------------------------------------------
1. RESERVE POTENTIAL INTELLIGENCE (MODEL ESTIMATE)
--------------------------------------------------------------------------------
Reserve Potential Score: ${reserve?.potentialScore || selectedArea.potentialScore} / 100
Classification: ${reserve?.potentialCategory || selectedArea.potentialCategory}
Geological Potential Score: ${reserve?.geologicalPotentialScore || 88} / 100
Simulated Satellite Index: ${reserve?.satellitePotentialScore || selectedArea.satelliteIndex} / 100
Estimated Reserve: ${selectedArea.estimatedReserveMT ? (selectedArea.estimatedReserveMT / 1000000).toFixed(2) + ' Million MT' : 'Under Evaluation'}
Average Grade: ${selectedArea.averageGradeMn}% Mn

Why This Area:
${(reserve?.whyThisArea || [
  'Favorable Gondite rock formation sequence with manganese oxide concentration.',
  'Compatible Sentinel-2 SWIR band absorption curves reflecting pyrolusite.',
  'Historical exploration boreholes confirm thick grade intersections.',
  'Stable topography facilitates opencast bench advancement.'
]).map((line, i) => `${i + 1}. ${line}`).join('\n')}

--------------------------------------------------------------------------------
2. PRODUCTION FORECAST & SHORTFALL PREDICTION
--------------------------------------------------------------------------------
Target Production: ${forecast?.targetProductionMT.toLocaleString() || '90,000'} MT
Expected Production: ${forecast?.expectedProductionMT.toLocaleString() || '82,500'} MT
Projected Deficit / Gap: ${forecast?.productionGapMT.toLocaleString() || '7,500'} MT
Shortfall Risk Level: ${shortfall?.riskLevel || forecast?.shortfallRisk || 'Moderate'}

Primary Shortfall Factors:
${(shortfall?.factors || [
  { factor: 'Equipment Downtime / Availability', impact: 'High Impact', percentageContribution: 48 },
  { factor: 'Weather / Climate', impact: 'Medium Impact', percentageContribution: 24 },
  { factor: 'Blasting Schedule', impact: 'Medium Impact', percentageContribution: 18 },
  { factor: 'Ore Availability & Working Shifts', impact: 'Low Impact', percentageContribution: 10 },
]).map(f => `• ${f.factor}: ${f.impact} (${f.percentageContribution}%)`).join('\n')}

--------------------------------------------------------------------------------
3. AI EXPLANATION & SUMMARY
--------------------------------------------------------------------------------
${aiExplanation || 'The AI/ML reserve intelligence model confirms high exploration priority for this block based on concordant geological and space remote-sensing indicators. Operational shortfall is largely attributed to equipment availability falls below the 85% availability benchmark.'}

--------------------------------------------------------------------------------
4. ACTIONABLE DECISION-SUPPORT RECOMMENDATIONS
--------------------------------------------------------------------------------
${recommendations.map((r, i) => `${i + 1}. [${r.priority} Priority - ${r.category}] ${r.action}
   Rationale: ${r.rationale}
   Expected Benefit: ${r.expectedBenefit}`).join('\n\n')}

================================================================================
DISCLAIMER: Prototype model estimate prepared for SIH 2026. Data contains simulated remote-sensing indices.
================================================================================
    `;

    const blob = new Blob([reportText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `ManganeseAI_Report_${selectedArea.code}_${Date.now()}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Title Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-3 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">Intelligence Reports & Audits</h1>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
              SIH26009
            </span>
          </div>
          <p className="text-sm text-slate-600 mt-1">
            Export official reserve mapping, production forecasts, and shortfall mitigation dossiers.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleDownloadText}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-medium transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download Report (.txt)</span>
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-medium transition-colors cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Dossier</span>
          </button>
        </div>
      </div>

      {/* Report Generation Configuration Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <label htmlFor="report-type" className="text-xs font-semibold text-slate-600 shrink-0">Select Template:</label>
          <select
            id="report-type"
            value={selectedReportType}
            onChange={(e) => setSelectedReportType(e.target.value)}
            className="p-2 rounded-lg bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          >
            <option value="Comprehensive Mining Intelligence Report">Comprehensive Mining Intelligence Report</option>
            <option value="Area Analysis Report">Area Analysis & Reserve Potential Report</option>
            <option value="Production Forecast Report">Production Forecast & Trend Report</option>
            <option value="Shortfall Analysis Report">Production Shortfall & Root-Cause Report</option>
          </select>
        </div>

        <button
          onClick={() => onGenerateReport(selectedReportType)}
          disabled={generating}
          className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white text-xs font-bold px-4 py-2 rounded-lg transition-colors cursor-pointer shadow-xs disabled:opacity-75"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>{generating ? 'Compiling Dossier...' : 'Generate Fresh Report'}</span>
        </button>
      </div>

      {/* Printable Report Preview Document */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6 max-w-4xl mx-auto print:border-none print:shadow-none print:p-0">
        {/* Document Header */}
        <div className="border-b-2 border-slate-900 pb-4 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold tracking-wider uppercase text-emerald-700">
              <span>Ministry of Steel • MOIL Limited</span>
              <span>•</span>
              <span>SIH 2026</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mt-1">{selectedReportType}</h2>
            <div className="text-xs text-slate-500 mt-0.5">
              Concession: <span className="font-semibold text-slate-800">{selectedArea.name} ({selectedArea.code})</span> • {selectedArea.district}, {selectedArea.state}
            </div>
          </div>

          <div className="text-right text-xs text-slate-500 space-y-0.5">
            <div>Doc Ref: <span className="font-mono text-slate-800">MN-AI-2026-{selectedArea.code}</span></div>
            <div>Date: <span className="font-medium text-slate-800">{new Date().toLocaleDateString()}</span></div>
            <div>Status: <span className="font-semibold text-emerald-700">Model Certified</span></div>
          </div>
        </div>

        {/* Section 1: Executive Summary */}
        <div className="space-y-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 border-b border-slate-200 pb-1">
            1. Executive Summary & AI Findings
          </h3>
          <p className="text-xs text-slate-700 leading-relaxed">
            {aiExplanation || `This intelligence dossier summarizes reserve potential and operational production risk for ${selectedArea.name}. Combining space-borne multi-spectral remote sensing with Gondite lithological horizons, the area presents a Reserve Potential Score of ${reserve?.potentialScore || selectedArea.potentialScore}/100. Production modeling forecasts ${forecast?.expectedProductionMT.toLocaleString() || '82,500'} MT against the planned target of ${forecast?.targetProductionMT.toLocaleString() || '90,000'} MT with a ${shortfall?.riskLevel || 'Moderate'} shortfall risk.`}
          </p>
        </div>

        {/* Section 2: Key Indicators Table */}
        <div className="space-y-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 border-b border-slate-200 pb-1">
            2. Reserve Potential & Key Indicators (Model Estimate)
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
              <span className="text-slate-500 block text-[10px]">Reserve Score</span>
              <span className="text-xl font-bold text-slate-900 mt-0.5 block">{reserve?.potentialScore || selectedArea.potentialScore}/100</span>
              <span className="text-[10px] text-emerald-700 font-semibold">{reserve?.potentialCategory || selectedArea.potentialCategory}</span>
            </div>
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
              <span className="text-slate-500 block text-[10px]">Lithology</span>
              <span className="font-bold text-slate-900 mt-1 block truncate">{selectedArea.formation}</span>
              <span className="text-[10px] text-slate-500">Sausar Series</span>
            </div>
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
              <span className="text-slate-500 block text-[10px]">Simulated Satellite SWIR</span>
              <span className="text-xl font-bold text-blue-700 mt-0.5 block">{selectedArea.satelliteIndex}/100</span>
              <span className="text-[10px] text-blue-600">Sentinel-2 Compatible</span>
            </div>
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
              <span className="text-slate-500 block text-[10px]">Ore Grade</span>
              <span className="text-xl font-bold text-slate-900 mt-0.5 block">{selectedArea.averageGradeMn}% Mn</span>
              <span className="text-[10px] text-slate-500">Medium-to-High</span>
            </div>
          </div>
        </div>

        {/* Section 3: Production Forecast & Shortfall Breakdown */}
        <div className="space-y-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 border-b border-slate-200 pb-1">
            3. Production Forecast & Operational Shortfall Risk
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
              <span className="text-slate-500 block text-[10px]">Target Production</span>
              <span className="text-lg font-bold text-slate-900 mt-0.5 block">{forecast?.targetProductionMT.toLocaleString() || '90,000'} MT</span>
            </div>
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
              <span className="text-slate-500 block text-[10px]">Expected Production</span>
              <span className="text-lg font-bold text-emerald-800 mt-0.5 block">{forecast?.expectedProductionMT.toLocaleString() || '82,500'} MT</span>
            </div>
            <div className="p-3 rounded-lg bg-amber-50 border border-amber-200">
              <span className="text-amber-900 block text-[10px]">Projected Shortfall Gap</span>
              <span className="text-lg font-bold text-amber-950 mt-0.5 block">{forecast?.productionGapMT.toLocaleString() || '7,500'} MT ({shortfall?.riskLevel || 'Moderate'})</span>
            </div>
          </div>

          <div className="mt-2 text-xs">
            <span className="font-semibold text-slate-800 block mb-1">Root-Cause Driver Contributions:</span>
            <div className="space-y-1">
              {(shortfall?.factors || [
                { factor: 'Equipment Downtime / Availability', impact: 'High Impact', percentageContribution: 48 },
                { factor: 'Weather / Climate', impact: 'Medium Impact', percentageContribution: 24 },
                { factor: 'Blasting Schedule', impact: 'Medium Impact', percentageContribution: 18 },
                { factor: 'Ore Availability & Working Shifts', impact: 'Low Impact', percentageContribution: 10 },
              ]).map((f, i) => (
                <div key={i} className="flex justify-between items-center py-1 border-b border-slate-100 text-slate-600">
                  <span>{f.factor}</span>
                  <span className="font-bold text-slate-900">{f.impact} ({f.percentageContribution}%)</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Section 4: Actionable Recommendations */}
        <div className="space-y-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 border-b border-slate-200 pb-1">
            4. Prioritized Engineering Recommendations
          </h3>
          <div className="space-y-2">
            {recommendations.map((rec, i) => (
              <div key={i} className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs">
                <div className="flex items-center justify-between font-bold text-slate-900 mb-1">
                  <span>{i + 1}. {rec.action}</span>
                  <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-slate-200 text-slate-800">
                    {rec.category} • {rec.priority} Priority
                  </span>
                </div>
                <div className="text-slate-600 text-[11px] leading-relaxed">{rec.rationale}</div>
                <div className="text-emerald-700 font-medium text-[10px] mt-1">Expected Benefit: {rec.expectedBenefit}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Document Footer */}
        <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row justify-between items-center text-[10px] text-slate-400">
          <span>ManganeseAI SIH26009 • Automated Decision Support Platform</span>
          <span>Sign-off: Mining Planning & Reserve Exploration Board, MOIL</span>
        </div>
      </div>
    </div>
  );
};
