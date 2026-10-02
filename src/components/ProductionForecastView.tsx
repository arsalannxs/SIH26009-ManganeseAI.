import React, { useState } from 'react';
import {
  TrendingUp,
  Calendar,
  Wrench,
  CloudSun,
  Flame,
  ArrowRight,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Info
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  ReferenceLine
} from 'recharts';
import { MiningArea, ProductionRecord, ProductionForecast } from '../types';

interface ProductionForecastViewProps {
  selectedArea: MiningArea;
  forecast: ProductionForecast | null;
  productionRecords: ProductionRecord[];
  forecastParams: {
    expectedWorkingDays: number;
    equipmentAvailability: number;
    expectedOreGrade: number;
    weatherCondition: string;
    blastingSchedule: string;
    targetProductionMT?: number;
  };
  onUpdateParams: (newParams: any) => void;
  onRecalculate: () => void;
  loading: boolean;
}

export const ProductionForecastView: React.FC<ProductionForecastViewProps> = ({
  selectedArea,
  forecast,
  productionRecords,
  forecastParams,
  onUpdateParams,
  onRecalculate,
  loading
}) => {
  const [timeFilter, setTimeFilter] = useState<'7 Days' | '30 Days' | '3 Months' | '6 Months' | '1 Year'>('6 Months');

  // Prepare chart data fusing historical records with the next month's forecast
  const targetMT = forecastParams.targetProductionMT || 90000;
  const forecastMT = forecast ? forecast.expectedProductionMT : 82500;

  // Filter historical data according to selected tab
  let historicalPoints: { name: string; actual?: number; forecast?: number; target: number; type: 'historical' | 'forecast' }[] = [];

  if (timeFilter === '7 Days') {
    historicalPoints = [
      { name: 'Day 1', actual: 3250, target: 3460, type: 'historical' },
      { name: 'Day 2', actual: 3300, target: 3460, type: 'historical' },
      { name: 'Day 3', actual: 3100, target: 3460, type: 'historical' },
      { name: 'Day 4', actual: 3420, target: 3460, type: 'historical' },
      { name: 'Day 5', actual: 3280, target: 3460, type: 'historical' },
      { name: 'Day 6', actual: 3150, target: 3460, type: 'historical' },
      { name: 'Day 7', actual: 3200, target: 3460, type: 'historical' },
      { name: 'Day 8 (F)', forecast: 3170, target: 3460, type: 'forecast' },
    ];
  } else if (timeFilter === '30 Days') {
    historicalPoints = [
      { name: 'Wk 1', actual: 21500, target: 22500, type: 'historical' },
      { name: 'Wk 2', actual: 22100, target: 22500, type: 'historical' },
      { name: 'Wk 3', actual: 20400, target: 22500, type: 'historical' },
      { name: 'Wk 4', actual: 20100, target: 22500, type: 'historical' },
      { name: 'Wk 5 (F)', forecast: 20625, target: 22500, type: 'forecast' },
    ];
  } else if (timeFilter === '3 Months') {
    historicalPoints = [
      { name: 'Dec 2025', actual: 93200, target: 92000, type: 'historical' },
      { name: 'Jan 2026', actual: 89800, target: 92000, type: 'historical' },
      { name: 'Feb 2026', actual: 84100, target: 90000, type: 'historical' },
      { name: 'Mar 2026 (Forecast)', forecast: forecastMT, target: targetMT, type: 'forecast' },
    ];
  } else if (timeFilter === '1 Year') {
    historicalPoints = [
      { name: 'Apr 25', actual: 86000, target: 90000, type: 'historical' },
      { name: 'Jun 25', actual: 84500, target: 90000, type: 'historical' },
      { name: 'Aug 25', actual: 78000, target: 88000, type: 'historical' },
      { name: 'Oct 25', actual: 86400, target: 90000, type: 'historical' },
      { name: 'Dec 25', actual: 93200, target: 92000, type: 'historical' },
      { name: 'Feb 26', actual: 84100, target: 90000, type: 'historical' },
      { name: 'Mar 26 (Forecast)', forecast: forecastMT, target: targetMT, type: 'forecast' },
    ];
  } else {
    // 6 Months (Default)
    historicalPoints = [
      { name: 'Sep 2025', actual: 81200, target: 88000, type: 'historical' },
      { name: 'Oct 2025', actual: 86400, target: 90000, type: 'historical' },
      { name: 'Nov 2025', actual: 91500, target: 90000, type: 'historical' },
      { name: 'Dec 2025', actual: 93200, target: 92000, type: 'historical' },
      { name: 'Jan 2026', actual: 89800, target: 92000, type: 'historical' },
      { name: 'Feb 2026', actual: 84100, target: 90000, type: 'historical' },
      { name: 'Mar 2026 (Forecast)', forecast: forecastMT, target: targetMT, type: 'forecast' },
    ];
  }

  const currentProductionMT = 84100;
  const expectedProductionMT = forecast ? forecast.expectedProductionMT : 82500;
  const targetProductionMT = targetMT;
  const gapMT = Math.max(0, targetProductionMT - expectedProductionMT);
  const shortfallRisk = forecast ? forecast.shortfallRisk : 'Moderate';

  return (
    <div className="space-y-6">
      {/* Title & Scope Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-3 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">Production Forecasting</h1>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
              DEMO DATA
            </span>
          </div>
          <p className="text-sm text-slate-600 mt-1">
            Machine learning forecast modeling operational throughput for {selectedArea.name}.
          </p>
        </div>

        {/* Status Indicator */}
        <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-slate-200 text-xs">
          <span className="text-slate-500">Forecast Status:</span>
          <span className={`font-bold px-2 py-0.5 rounded ${
            shortfallRisk === 'Low' ? 'bg-emerald-100 text-emerald-800' :
            shortfallRisk === 'Moderate' ? 'bg-amber-100 text-amber-800' :
            'bg-rose-100 text-rose-800'
          }`}>
            {shortfallRisk} Shortfall Risk
          </span>
        </div>
      </div>

      {/* 4 Primary Output Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Current Production */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
            Current Production
          </span>
          <div className="text-2xl font-bold text-slate-900 mt-1">
            {currentProductionMT.toLocaleString()} MT
          </div>
          <span className="text-xs text-slate-500 mt-1 block">February 2026 Actual Dispatch</span>
        </div>

        {/* Card 2: Expected Production */}
        <div className="bg-white p-4 rounded-xl border border-emerald-200 bg-emerald-50/30 shadow-xs">
          <span className="text-xs font-semibold text-emerald-800 uppercase tracking-wider block">
            Expected Production
          </span>
          <div className="text-2xl font-bold text-emerald-950 mt-1">
            {expectedProductionMT.toLocaleString()} MT
          </div>
          <span className="text-xs text-emerald-700 mt-1 block">March 2026 Model Estimate</span>
        </div>

        {/* Card 3: Target Production */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
            Target Production
          </span>
          <div className="text-2xl font-bold text-slate-900 mt-1">
            {targetProductionMT.toLocaleString()} MT
          </div>
          <span className="text-xs text-slate-500 mt-1 block">MOIL Monthly Operational Plan</span>
        </div>

        {/* Card 4: Production Gap */}
        <div className={`p-4 rounded-xl border shadow-xs ${
          gapMT > 0 ? 'bg-amber-50/50 border-amber-200' : 'bg-emerald-50 border-emerald-200'
        }`}>
          <span className="text-xs font-semibold text-amber-900 uppercase tracking-wider block">
            Production Gap
          </span>
          <div className="text-2xl font-bold text-amber-950 mt-1">
            {gapMT.toLocaleString()} MT
          </div>
          <span className="text-xs text-amber-700 mt-1 block">
            {gapMT > 0 ? `${((gapMT / targetProductionMT) * 100).toFixed(1)}% Projected Deficit` : 'Target Achievable'}
          </span>
        </div>
      </div>

      {/* Main Grid: Forecast Chart (Left) + Interactive Model Inputs (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Interactive Production Forecast Line Chart */}
        <div className="lg:col-span-8 bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-base font-bold text-slate-900">Historical Dispatch vs Forecasted Production</h2>
              <span className="text-xs text-slate-500">Metric Tonnes (MT) Manganese Ore Output</span>
            </div>

            {/* Time Filter Pills */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg text-xs font-medium self-start sm:self-auto">
              {(['7 Days', '30 Days', '3 Months', '6 Months', '1 Year'] as const).map((filter) => (
                <button
                  key={filter}
                  onClick={() => setTimeFilter(filter)}
                  className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                    timeFilter === filter
                      ? 'bg-white text-slate-900 font-semibold shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>

          {/* Recharts Line Chart */}
          <div className="w-full h-[320px] pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={historicalPoints} margin={{ top: 10, right: 20, left: 10, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 11, fill: '#64748b' }}
                  tickLine={false}
                  axisLine={{ stroke: '#cbd5e1' }}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: '#64748b' }}
                  tickLine={false}
                  axisLine={{ stroke: '#cbd5e1' }}
                  domain={['dataMin - 5000', 'dataMax + 5000']}
                  tickFormatter={(val) => `${(val / 1000).toFixed(0)}k`}
                />
                <Tooltip
                  formatter={(value: any, name: any) => [
                    `${Number(value).toLocaleString()} MT`,
                    name === 'actual' ? 'Historical Dispatch' : name === 'forecast' ? 'Model Forecast' : 'Target'
                  ]}
                  contentStyle={{ backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '12px' }}
                />
                <Legend
                  verticalAlign="top"
                  height={36}
                  formatter={(value) => (
                    <span className="text-xs text-slate-700 capitalize">
                      {value === 'actual' ? 'Historical Production' : value === 'forecast' ? 'Forecast Production' : 'Target Production'}
                    </span>
                  )}
                />
                <Line
                  type="monotone"
                  dataKey="target"
                  stroke="#94a3b8"
                  strokeDasharray="5 5"
                  strokeWidth={2}
                  dot={false}
                  name="target"
                />
                <Line
                  type="monotone"
                  dataKey="actual"
                  stroke="#2563eb"
                  strokeWidth={2.5}
                  dot={{ r: 4, fill: '#2563eb' }}
                  activeDot={{ r: 6 }}
                  name="actual"
                />
                <Line
                  type="monotone"
                  dataKey="forecast"
                  stroke="#059669"
                  strokeWidth={3}
                  strokeDasharray="4 2"
                  dot={{ r: 6, fill: '#059669', stroke: '#ffffff', strokeWidth: 2 }}
                  name="forecast"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-100">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-600 inline-block"></span>
              <span>Dashed green indicator represents March 2026 model forecast estimate.</span>
            </span>
            <span className="italic">Confidence Interval: ±4.2%</span>
          </div>
        </div>

        {/* Right Column: Model Inputs & Forecasting Factors */}
        <div className="lg:col-span-4 bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
          <div className="pb-3 border-b border-slate-100">
            <h2 className="text-sm font-bold text-slate-900">Forecast Input Parameters</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Adjust operational variables to simulate production outcome.
            </p>
          </div>

          <div className="space-y-3 text-xs">
            {/* Working Days */}
            <div>
              <div className="flex justify-between font-medium text-slate-700 mb-1">
                <span>Expected Working Days:</span>
                <span className="font-bold text-slate-900">{forecastParams.expectedWorkingDays} days</span>
              </div>
              <input
                type="range"
                min="18"
                max="30"
                value={forecastParams.expectedWorkingDays}
                onChange={(e) => onUpdateParams({ ...forecastParams, expectedWorkingDays: Number(e.target.value) })}
                className="w-full accent-emerald-600 cursor-pointer"
              />
              <span className="text-[10px] text-slate-400">Baseline calendar: 26 active operating days</span>
            </div>

            {/* Equipment Availability */}
            <div>
              <div className="flex justify-between font-medium text-slate-700 mb-1">
                <span>Equipment Availability:</span>
                <span className="font-bold text-slate-900">{forecastParams.equipmentAvailability}%</span>
              </div>
              <input
                type="range"
                min="60"
                max="98"
                value={forecastParams.equipmentAvailability}
                onChange={(e) => onUpdateParams({ ...forecastParams, equipmentAvailability: Number(e.target.value) })}
                className="w-full accent-emerald-600 cursor-pointer"
              />
              <span className="text-[10px] text-slate-400">Target benchmark: ≥ 85% availability</span>
            </div>

            {/* Expected Ore Grade */}
            <div>
              <div className="flex justify-between font-medium text-slate-700 mb-1">
                <span>Expected Ore Grade (% Mn):</span>
                <span className="font-bold text-slate-900">{forecastParams.expectedOreGrade}%</span>
              </div>
              <input
                type="range"
                min="30"
                max="48"
                step="0.5"
                value={forecastParams.expectedOreGrade}
                onChange={(e) => onUpdateParams({ ...forecastParams, expectedOreGrade: Number(e.target.value) })}
                className="w-full accent-emerald-600 cursor-pointer"
              />
              <span className="text-[10px] text-slate-400">High Grade: ≥ 42%, Standard: 38-42%</span>
            </div>

            {/* Weather Condition */}
            <div>
              <label htmlFor="forecast-weather" className="font-medium text-slate-700 block mb-1">Weather Condition:</label>
              <select
                id="forecast-weather"
                value={forecastParams.weatherCondition}
                onChange={(e) => onUpdateParams({ ...forecastParams, weatherCondition: e.target.value })}
                className="w-full p-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:ring-1 focus:ring-emerald-500 font-medium"
              >
                <option value="Clear">Clear / Standard Operating Conditions</option>
                <option value="Light Rain">Light Rain (Minor haul road speed reduction)</option>
                <option value="Heavy Monsoon">Heavy Monsoon (Bench flooding risks)</option>
                <option value="Extreme Heat">Extreme Heat (&gt;42°C Afternoon thermal shift)</option>
              </select>
            </div>

            {/* Blasting Schedule */}
            <div>
              <label htmlFor="forecast-blasting" className="font-medium text-slate-700 block mb-1">Blasting Schedule:</label>
              <select
                id="forecast-blasting"
                value={forecastParams.blastingSchedule}
                onChange={(e) => onUpdateParams({ ...forecastParams, blastingSchedule: e.target.value })}
                className="w-full p-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:ring-1 focus:ring-emerald-500 font-medium"
              >
                <option value="On Schedule">On Schedule (Immediate rock clearance)</option>
                <option value="Moderate Delay">Moderate Delay (6-12 hr face backlog)</option>
                <option value="Severe Delay">Severe Delay (&gt;24 hr explosive clearance)</option>
              </select>
            </div>

            {/* Recalculate Button */}
            <button
              onClick={onRecalculate}
              disabled={loading}
              className="w-full py-2.5 px-4 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer mt-2"
            >
              {loading ? 'Recalculating...' : 'Recalculate Forecast'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
