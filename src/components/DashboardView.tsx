import React from 'react';
import {
  Sparkles,
  MapPin,
  TrendingDown,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Satellite,
  Compass,
  Cpu
} from 'lucide-react';
import { MiningArea, ReserveAnalysis, ProductionForecast, ShortfallAnalysis, Recommendation } from '../types';

interface DashboardViewProps {
  selectedArea: MiningArea;
  reserve: ReserveAnalysis | null;
  forecast: ProductionForecast | null;
  shortfall: ShortfallAnalysis | null;
  recommendations: Recommendation[];
  onAnalyze: () => void;
  onNavigate: (tab: any) => void;
  analyzing: boolean;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  selectedArea,
  reserve,
  forecast,
  shortfall,
  recommendations,
  onAnalyze,
  onNavigate,
  analyzing
}) => {
  // Risk color helpers
  const getRiskBadge = (risk: string | undefined) => {
    switch (risk) {
      case 'Low':
        return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">Low Risk</span>;
      case 'Moderate':
        return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800">Moderate</span>;
      case 'High':
        return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-orange-100 text-orange-800">High Risk</span>;
      case 'Critical':
        return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-100 text-rose-800">Critical</span>;
      default:
        return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-800">Evaluating</span>;
    }
  };

  const getScoreBadge = (score: number) => {
    if (score >= 80) return 'text-emerald-600 bg-emerald-50 border-emerald-200';
    if (score >= 60) return 'text-amber-600 bg-amber-50 border-amber-200';
    if (score >= 40) return 'text-orange-600 bg-orange-50 border-orange-200';
    return 'text-rose-600 bg-rose-50 border-rose-200';
  };

  return (
    <div className="space-y-6">
      {/* Dashboard Top Title Banner */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">Dashboard</h1>
            <span className="text-xs font-medium px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
              MOIL Belt Monitoring
            </span>
          </div>
          <p className="text-sm text-slate-600 mt-1">
            Reserve & Production Intelligence overview for manganese mineral concessions in Nagpur-Balaghat belt.
          </p>
        </div>

        {/* Selected Area Banner + Quick Action */}
        <div className="flex items-center gap-3 bg-white p-2.5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-500">Active Area:</span>
            <span className="font-semibold text-slate-900 bg-slate-100 px-2 py-0.5 rounded">
              {selectedArea.name}
            </span>
          </div>
          <button
            onClick={onAnalyze}
            disabled={analyzing}
            className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-medium text-xs px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{analyzing ? 'Analyzing...' : 'Analyze Area'}</span>
          </button>
        </div>
      </div>

      {/* 4 Primary Top KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Potential Reserve Zones */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Potential Reserve Zones
            </span>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-600">
              DEMO DATA
            </span>
          </div>
          <div className="my-3">
            <div className="text-3xl font-bold text-slate-900">12</div>
            <div className="text-xs text-emerald-600 font-medium flex items-center gap-1 mt-1">
              <span>+3 Identified by Satellite indices</span>
            </div>
          </div>
          <button
            onClick={() => onNavigate('Reserve Mapping')}
            className="text-xs text-emerald-700 hover:text-emerald-800 font-medium flex items-center gap-1 cursor-pointer pt-2 border-t border-slate-100"
          >
            <span>View reserve map</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        {/* Card 2: Next Month Forecast */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Next Month Forecast
            </span>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-600">
              DEMO DATA
            </span>
          </div>
          <div className="my-3">
            <div className="text-3xl font-bold text-slate-900">
              {forecast ? `${forecast.expectedProductionMT.toLocaleString()} MT` : '82,500 MT'}
            </div>
            <div className="text-xs text-slate-500 font-medium mt-1">
              Target: {forecast ? `${forecast.targetProductionMT.toLocaleString()} MT` : '90,000 MT'}
            </div>
          </div>
          <button
            onClick={() => onNavigate('Production Forecast')}
            className="text-xs text-emerald-700 hover:text-emerald-800 font-medium flex items-center gap-1 cursor-pointer pt-2 border-t border-slate-100"
          >
            <span>Inspect forecast curves</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        {/* Card 3: Shortfall Risk */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Shortfall Risk
            </span>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-600">
              DEMO DATA
            </span>
          </div>
          <div className="my-3">
            <div className="flex items-center gap-2">
              <span className="text-3xl font-bold text-slate-900">
                {shortfall ? shortfall.riskLevel : 'Moderate'}
              </span>
              {getRiskBadge(shortfall?.riskLevel || 'Moderate')}
            </div>
            <div className="text-xs text-amber-700 font-medium flex items-center gap-1 mt-1">
              <TrendingDown className="w-3.5 h-3.5" />
              <span>Gap: {shortfall ? `${shortfall.shortfallMT.toLocaleString()} MT` : '7,500 MT'}</span>
            </div>
          </div>
          <button
            onClick={() => onNavigate('Shortfall Analysis')}
            className="text-xs text-emerald-700 hover:text-emerald-800 font-medium flex items-center gap-1 cursor-pointer pt-2 border-t border-slate-100"
          >
            <span>Run What-If scenario</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        {/* Card 4: Areas Analyzed */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Areas Analyzed
            </span>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-600">
              SYSTEM
            </span>
          </div>
          <div className="my-3">
            <div className="text-3xl font-bold text-slate-900">24</div>
            <div className="text-xs text-slate-500 font-medium mt-1">
              5 active concession blocks in DB
            </div>
          </div>
          <button
            onClick={() => onNavigate('Data & Indicators')}
            className="text-xs text-emerald-700 hover:text-emerald-800 font-medium flex items-center gap-1 cursor-pointer pt-2 border-t border-slate-100"
          >
            <span>Review telemetry sources</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Simple 6-Step Workflow Navigation Strip */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
            ManganeseAI Decision Workflow
          </span>
          <span className="text-xs text-slate-500 hidden sm:inline">
            Follow the streamlined mining intelligence pipeline
          </span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 text-center text-xs">
          <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
            <div className="font-semibold text-slate-900">1. SELECT AREA</div>
            <div className="text-[11px] text-slate-500 truncate">{selectedArea.name}</div>
          </div>
          <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200">
            <div className="font-semibold text-emerald-900">2. ANALYZE AREA</div>
            <div className="text-[11px] text-emerald-700">1-Click AI trigger</div>
          </div>
          <div className="p-2.5 rounded-lg bg-blue-50 border border-blue-200">
            <div className="font-semibold text-blue-900">3. AI/GIS MAPPING</div>
            <div className="text-[11px] text-blue-700">Satellite & Geo</div>
          </div>
          <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
            <div className="font-semibold text-slate-900">4. RESERVE SCORE</div>
            <div className="text-[11px] text-slate-600">{reserve ? `${reserve.potentialScore}/100` : '84/100'}</div>
          </div>
          <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
            <div className="font-semibold text-slate-900">5. FORECAST</div>
            <div className="text-[11px] text-slate-600">{forecast ? `${forecast.expectedProductionMT.toLocaleString()} MT` : '82,500 MT'}</div>
          </div>
          <div className="p-2.5 rounded-lg bg-amber-50 border border-amber-200">
            <div className="font-semibold text-amber-900">6. SHORTFALL</div>
            <div className="text-[11px] text-amber-700">{shortfall?.riskLevel || 'Moderate'}</div>
          </div>
          <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200">
            <div className="font-semibold text-emerald-900">7. RECOMMEND</div>
            <div className="text-[11px] text-emerald-700">Mitigation plan</div>
          </div>
        </div>
      </div>

      {/* Main Analysis Status for Currently Selected Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Reserve & Geological Summary */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Compass className="w-4 h-4 text-emerald-600" />
              <h2 className="font-semibold text-slate-900 text-sm">Reserve Potential Intelligence</h2>
            </div>
            <span className="text-[11px] text-slate-500 font-medium">Model Estimate</span>
          </div>

          <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-200">
            <div>
              <div className="text-xs text-slate-500">Exploration Priority Score</div>
              <div className="text-2xl font-bold text-slate-900 mt-0.5">
                {reserve?.potentialScore || selectedArea.potentialScore} <span className="text-xs text-slate-500 font-normal">/ 100</span>
              </div>
              <div className="text-xs font-semibold text-emerald-700 mt-1">
                {reserve?.potentialCategory || selectedArea.potentialCategory}
              </div>
            </div>
            <div className={`w-14 h-14 rounded-full border-4 flex items-center justify-center font-bold text-base ${getScoreBadge(reserve?.potentialScore || selectedArea.potentialScore)}`}>
              {reserve?.potentialScore || selectedArea.potentialScore}%
            </div>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500">Lithological Formation</span>
              <span className="font-medium text-slate-800 text-right">{selectedArea.formation}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500">Simulated Satellite Index</span>
              <span className="font-medium text-emerald-700">{selectedArea.satelliteIndex} / 100 (Compatible)</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500">Average Manganese Grade</span>
              <span className="font-medium text-slate-800">{selectedArea.averageGradeMn}% Mn</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-500">Estimated Reserve Potential</span>
              <span className="font-medium text-slate-800">
                {selectedArea.estimatedReserveMT ? `${(selectedArea.estimatedReserveMT / 1000000).toFixed(1)} Million MT` : 'Under Evaluation'}
              </span>
            </div>
          </div>

          <div className="pt-2">
            <button
              onClick={() => onNavigate('Reserve Mapping')}
              className="w-full py-2 px-3 text-xs font-semibold rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-center transition-colors cursor-pointer"
            >
              Open Spatial Reserve Map
            </button>
          </div>
        </div>

        {/* Middle Column: Production & Shortfall Status */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Cpu className="w-4 h-4 text-blue-600" />
              <h2 className="font-semibold text-slate-900 text-sm">Production Forecast & Gap</h2>
            </div>
            <span className="text-[11px] text-slate-500 font-medium">Next Month</span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
              <span className="text-slate-500 block">Target Output</span>
              <span className="text-lg font-bold text-slate-900 mt-1 block">
                {forecast ? `${forecast.targetProductionMT.toLocaleString()} MT` : '90,000 MT'}
              </span>
              <span className="text-[10px] text-slate-500">MOIL monthly plan</span>
            </div>
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
              <span className="text-slate-500 block">Model Forecast</span>
              <span className="text-lg font-bold text-slate-900 mt-1 block">
                {forecast ? `${forecast.expectedProductionMT.toLocaleString()} MT` : '82,500 MT'}
              </span>
              <span className="text-[10px] text-emerald-600 font-medium">88% Model confidence</span>
            </div>
          </div>

          <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 text-xs">
            <div className="flex justify-between items-center mb-1">
              <span className="font-semibold text-amber-900">Projected Production Gap</span>
              <span className="font-bold text-amber-800">
                {forecast ? `${forecast.productionGapMT.toLocaleString()} MT` : '7,500 MT'}
              </span>
            </div>
            <p className="text-[11px] text-amber-700 leading-relaxed">
              Main impact factor: Equipment availability (78% vs 85% target benchmark).
            </p>
          </div>

          <div className="pt-2">
            <button
              onClick={() => onNavigate('Production Forecast')}
              className="w-full py-2 px-3 text-xs font-semibold rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 text-center transition-colors cursor-pointer"
            >
              Analyze Monthly Trends & Shifts
            </button>
          </div>
        </div>

        {/* Right Column: AI Explanation & Recommendations */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <h2 className="font-semibold text-slate-900 text-sm">AI Recommendation Engine</h2>
            </div>
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
              Decision Support
            </span>
          </div>

          {recommendations.length > 0 ? (
            <div className="space-y-3">
              {recommendations.slice(0, 2).map((rec, i) => (
                <div key={rec.id || i} className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-slate-900">{rec.action}</span>
                    <span className="text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded bg-slate-200 text-slate-700">
                      {rec.category}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">
                    {rec.rationale}
                  </p>
                  <div className="mt-2 text-[10px] font-medium text-emerald-700">
                    Benefit: {rec.expectedBenefit}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-4 rounded-lg bg-slate-50 text-center text-xs text-slate-500">
              Click &quot;Analyze Area&quot; to compute fresh AI recommendations.
            </div>
          )}

          <div className="pt-2">
            <button
              onClick={() => onNavigate('Shortfall Analysis')}
              className="w-full py-2 px-3 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-center transition-colors cursor-pointer"
            >
              Simulate Operational Mitigations
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
