import React, { useState } from 'react';
import {
  AlertTriangle,
  Sliders,
  CheckCircle2,
  TrendingDown,
  Info,
  Sparkles,
  ArrowRight,
  ShieldAlert,
  Zap
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell
} from 'recharts';
import { MiningArea, ShortfallAnalysis, ProductionForecast } from '../types';

interface ShortfallAnalysisViewProps {
  selectedArea: MiningArea;
  shortfall: ShortfallAnalysis | null;
  forecast: ProductionForecast | null;
  onRunWhatIf: (scenarioParams: any) => void;
}

export const ShortfallAnalysisView: React.FC<ShortfallAnalysisViewProps> = ({
  selectedArea,
  shortfall,
  forecast,
  onRunWhatIf
}) => {
  // What-If Simulator Interactive State
  const [eqAvail, setEqAvail] = useState(80);
  const [workingDays, setWorkingDays] = useState(26);
  const [weatherCondition, setWeatherCondition] = useState('Clear');
  const [blastingDelay, setBlastingDelay] = useState('Moderate Delay');
  const [targetCapacity, setTargetCapacity] = useState(90000);

  // Dynamic Simulator Calculation for Scenario
  const baseDailyCapacity = targetCapacity / 26;
  const eqFactor = eqAvail / 85;
  const weatherFactor = weatherCondition === 'Heavy Monsoon' ? 0.82 : weatherCondition === 'Extreme Heat' ? 0.93 : 1.0;
  const blastFactor = blastingDelay === 'Severe Delay' ? 0.85 : blastingDelay === 'Moderate Delay' ? 0.94 : 1.0;

  const simExpectedMT = Math.round(baseDailyCapacity * workingDays * eqFactor * weatherFactor * blastFactor);
  const simGapMT = Math.max(0, targetCapacity - simExpectedMT);
  const simLossPercent = (simGapMT / targetCapacity) * 100;

  let simRisk: 'Low' | 'Moderate' | 'High' | 'Critical' = 'Low';
  if (simLossPercent > 22) simRisk = 'Critical';
  else if (simLossPercent > 12) simRisk = 'High';
  else if (simLossPercent > 3) simRisk = 'Moderate';

  // Factors data for Bar Chart
  const factorsData = shortfall?.factors.map(f => ({
    name: f.factor.split('/')[0].trim(),
    contribution: f.percentageContribution,
    impact: f.impact,
    color: f.impact === 'High Impact' ? '#dc2626' : f.impact === 'Medium Impact' ? '#d97706' : '#2563eb'
  })) || [
    { name: 'Equipment Downtime', contribution: 48, impact: 'High Impact', color: '#dc2626' },
    { name: 'Weather / Climate', contribution: 24, impact: 'Medium Impact', color: '#d97706' },
    { name: 'Blasting Schedule', contribution: 18, impact: 'Medium Impact', color: '#d97706' },
    { name: 'Working Days & Ore', contribution: 10, impact: 'Low Impact', color: '#2563eb' },
  ];

  return (
    <div className="space-y-6">
      {/* Title & Disclaimer Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-3 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">Production Shortfall Analysis & Simulation</h1>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800">
              MODEL ESTIMATE
            </span>
          </div>
          <p className="text-sm text-slate-600 mt-1">
            Root-cause factor decomposition and interactive What-If scenario model for {selectedArea.name}.
          </p>
        </div>

        {/* Current Shortfall Summary Badge */}
        <div className="flex items-center gap-3 bg-white px-3 py-2 rounded-xl border border-slate-200 shadow-xs text-xs">
          <span className="text-slate-500">Baseline Risk:</span>
          <span className={`font-bold px-2.5 py-0.5 rounded ${
            (shortfall?.riskLevel || 'Moderate') === 'Low' ? 'bg-emerald-100 text-emerald-800' :
            (shortfall?.riskLevel || 'Moderate') === 'Moderate' ? 'bg-amber-100 text-amber-800' :
            'bg-rose-100 text-rose-800'
          }`}>
            {shortfall?.riskLevel || 'Moderate'}
          </span>
          <span className="text-slate-400">|</span>
          <span className="font-semibold text-slate-900">
            Deficit: {shortfall ? shortfall.shortfallMT.toLocaleString() : '7,500'} MT
          </span>
        </div>
      </div>

      {/* Cause Decomposition Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Factors Contribution Bar Chart & Detail List */}
        <div className="lg:col-span-6 bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-base font-bold text-slate-900">Shortfall Cause Decomposition</h2>
              <span className="text-xs text-slate-500">Percentage contribution to projected production gap</span>
            </div>
            <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-slate-100 text-slate-600">
              Normalized (100%)
            </span>
          </div>

          {/* Recharts Horizontal Bar Chart */}
          <div className="w-full h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={factorsData} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                <XAxis type="number" domain={[0, 60]} tickFormatter={(val) => `${val}%`} tick={{ fontSize: 11, fill: '#64748b' }} />
                <YAxis dataKey="name" type="category" width={110} tick={{ fontSize: 11, fill: '#334155' }} />
                <Tooltip
                  formatter={(val: any) => [`${val}% Contribution`, 'Shortfall Driver']}
                  contentStyle={{ backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '12px' }}
                />
                <Bar dataKey="contribution" radius={[0, 4, 4, 0]}>
                  {factorsData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Factor Items Breakdown */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            {shortfall?.factors.map((f, i) => (
              <div key={i} className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900">{f.factor}</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    f.impact === 'High Impact' ? 'bg-rose-100 text-rose-800' :
                    f.impact === 'Medium Impact' ? 'bg-amber-100 text-amber-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {f.impact} ({f.percentageContribution}%)
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  {f.description}
                </p>
                <div className="text-[10px] font-medium text-emerald-700 pt-0.5">
                  Action: {f.mitigationSuggestion}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: What-If Scenario Simulator */}
        <div className="lg:col-span-6 bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Sliders className="w-4 h-4 text-emerald-600" />
              <h2 className="text-base font-bold text-slate-900">What-If Scenario Simulator</h2>
            </div>
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
              Live Reactive
            </span>
          </div>

          {/* Interactive Simulation Sliders */}
          <div className="space-y-4 text-xs">
            {/* Equipment Availability */}
            <div>
              <div className="flex justify-between font-semibold text-slate-800 mb-1">
                <span>Equipment Availability:</span>
                <span className="text-emerald-700 font-bold">{eqAvail}%</span>
              </div>
              <input
                type="range"
                min="65"
                max="95"
                value={eqAvail}
                onChange={(e) => setEqAvail(Number(e.target.value))}
                className="w-full accent-emerald-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-0.5">
                <span>65% (Downtime heavy)</span>
                <span>85% (Target)</span>
                <span>95% (Optimized)</span>
              </div>
            </div>

            {/* Working Days */}
            <div>
              <div className="flex justify-between font-semibold text-slate-800 mb-1">
                <span>Working Days in Month:</span>
                <span className="text-slate-900 font-bold">{workingDays} Days</span>
              </div>
              <input
                type="range"
                min="20"
                max="28"
                value={workingDays}
                onChange={(e) => setWorkingDays(Number(e.target.value))}
                className="w-full accent-emerald-600 cursor-pointer"
              />
            </div>

            {/* Weather Impact */}
            <div>
              <label htmlFor="sim-weather" className="font-semibold text-slate-800 block mb-1">Weather Impact:</label>
              <select
                id="sim-weather"
                value={weatherCondition}
                onChange={(e) => setWeatherCondition(e.target.value)}
                className="w-full p-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 font-medium text-xs focus:ring-1 focus:ring-emerald-500"
              >
                <option value="Clear">Clear Skies (Zero Weather Penalty)</option>
                <option value="Extreme Heat">Extreme Heat / Dust (7% Throttling)</option>
                <option value="Heavy Monsoon">Heavy Monsoon (18% Haulage Disruption)</option>
              </select>
            </div>

            {/* Blasting Delay */}
            <div>
              <label htmlFor="sim-blasting" className="font-semibold text-slate-800 block mb-1">Blasting Turnaround:</label>
              <select
                id="sim-blasting"
                value={blastingDelay}
                onChange={(e) => setBlastingDelay(e.target.value)}
                className="w-full p-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 font-medium text-xs focus:ring-1 focus:ring-emerald-500"
              >
                <option value="On Schedule">On Schedule (Immediate rock exposure)</option>
                <option value="Moderate Delay">Moderate Delay (6% cycle penalty)</option>
                <option value="Severe Delay">Severe Delay (15% cycle penalty)</option>
              </select>
            </div>
          </div>

          {/* Dynamic Scenario Outcome Comparison */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
              Simulated Scenario Outcome
            </span>

            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="p-2.5 rounded-lg bg-white border border-slate-200">
                <span className="text-slate-500 text-[10px] block">Simulated Output</span>
                <span className="text-base font-bold text-slate-900 mt-0.5 block">
                  {simExpectedMT.toLocaleString()} MT
                </span>
              </div>
              <div className="p-2.5 rounded-lg bg-white border border-slate-200">
                <span className="text-slate-500 text-[10px] block">Simulated Gap</span>
                <span className={`text-base font-bold mt-0.5 block ${simGapMT > 0 ? 'text-amber-600' : 'text-emerald-600'}`}>
                  {simGapMT.toLocaleString()} MT
                </span>
              </div>
              <div className="p-2.5 rounded-lg bg-white border border-slate-200">
                <span className="text-slate-500 text-[10px] block">Simulated Risk</span>
                <span className={`text-xs font-bold px-2 py-0.5 rounded mt-1 inline-block ${
                  simRisk === 'Low' ? 'bg-emerald-100 text-emerald-800' :
                  simRisk === 'Moderate' ? 'bg-amber-100 text-amber-800' :
                  'bg-rose-100 text-rose-800'
                }`}>
                  {simRisk}
                </span>
              </div>
            </div>

            {/* Scenario Comparative Insight */}
            <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 leading-relaxed">
              <span className="font-bold">Scenario Insight: </span>
              {eqAvail >= 90 ? (
                <span>By raising equipment availability to {eqAvail}%, output reaches {simExpectedMT.toLocaleString()} MT, virtually eliminating the operational shortfall gap!</span>
              ) : (
                <span>Increasing equipment availability from {eqAvail}% to 90% would recover approximately {Math.round(targetCapacity * 0.1).toLocaleString()} MT of manganese ore dispatch.</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
