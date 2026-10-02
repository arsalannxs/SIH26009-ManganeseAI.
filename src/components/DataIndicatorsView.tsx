import React, { useState } from 'react';
import {
  Database,
  Satellite,
  Compass,
  Layers,
  Wrench,
  CloudSun,
  Flame,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  RefreshCw
} from 'lucide-react';
import { MiningArea, GeologicalIndicator, SatelliteIndicator, ProductionRecord } from '../types';

interface DataIndicatorsViewProps {
  selectedArea: MiningArea;
  geology: GeologicalIndicator[];
  satellite: SatelliteIndicator[];
  production: ProductionRecord[];
}

export const DataIndicatorsView: React.FC<DataIndicatorsViewProps> = ({
  selectedArea,
  geology,
  satellite,
  production
}) => {
  const [activeCategory, setActiveCategory] = useState<'all' | 'geology' | 'satellite' | 'production' | 'equipment' | 'weather'>('all');

  const dataSources = [
    {
      category: 'Geological Data',
      source: 'Geological Survey of India (GSI) & MOIL Core Drilling Borehole Logs',
      lastUpdated: '2026-02-28',
      status: 'Verified (Field Validated)',
      type: 'DEMO DATA',
      itemsCount: `${geology.length} Strata Intercepts`,
      badgeColor: 'bg-emerald-100 text-emerald-800'
    },
    {
      category: 'Satellite Remote Sensing Data',
      source: 'ESA Copernicus Sentinel-2 MSI & USGS Landsat-8 OLI (Simulated Bands)',
      lastUpdated: '2026-02-24',
      status: 'Active Optical & SWIR Feed',
      type: 'SIMULATED SATELLITE DATA',
      itemsCount: `${satellite.length} Spectral Alteration Indices`,
      badgeColor: 'bg-blue-100 text-blue-800'
    },
    {
      category: 'Production Dispatch Data',
      source: 'MOIL SAP ERP / Weighbridge Dispatch Telemetry',
      lastUpdated: '2026-02-28',
      status: 'Monthly & Daily Reconciled',
      type: 'DEMO DATA',
      itemsCount: `${production.length} Monthly Records`,
      badgeColor: 'bg-emerald-100 text-emerald-800'
    },
    {
      category: 'Equipment Fleet Telemetry',
      source: 'HEMM Fleet Management System (Excavators, Dumpers, Drill Rigs)',
      lastUpdated: '2026-03-01 06:00 IST',
      status: 'Shift Telematics Feed',
      type: 'DEMO DATA',
      itemsCount: '36 Heavy Mining Machines',
      badgeColor: 'bg-amber-100 text-amber-800'
    },
    {
      category: 'Meteorological & Weather Data',
      source: 'India Meteorological Department (IMD) Nagpur / Balaghat Station',
      lastUpdated: '2026-03-01 12:00 IST',
      status: 'Real-time Precipitation Sensor',
      type: 'DEMO DATA',
      itemsCount: '7-Day Forecast',
      badgeColor: 'bg-emerald-100 text-emerald-800'
    },
    {
      category: 'Operational Blasting Schedule',
      source: 'DGMS Licensed Pit Explosive Loading Log',
      lastUpdated: '2026-02-26',
      status: 'Active Shift Blast Register',
      type: 'DEMO DATA',
      itemsCount: 'Weekly Blast Program',
      badgeColor: 'bg-emerald-100 text-emerald-800'
    },
  ];

  return (
    <div className="space-y-6">
      {/* Title Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-3 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">Data & Indicator Sources</h1>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
              SYNTHETIC / DEMO ENVIRONMENT
            </span>
          </div>
          <p className="text-sm text-slate-600 mt-1">
            Auditable registry of geological, space remote sensing, and operational feeds informing the model.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs bg-white px-3 py-1.5 rounded-lg border border-slate-200">
          <span className="text-slate-500">Selected Concession:</span>
          <span className="font-bold text-slate-900">{selectedArea.name}</span>
        </div>
      </div>

      {/* Data Source Category Registry Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <span className="font-bold text-sm text-slate-900">Integrated Data Pipeline Directory</span>
          <span className="text-xs text-slate-500">6 Connected Data Ingestion Streams</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-100 text-slate-600 uppercase font-semibold text-[11px] border-b border-slate-200">
              <tr>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Data Source & System</th>
                <th className="px-4 py-3">Last Updated</th>
                <th className="px-4 py-3">Feed Status</th>
                <th className="px-4 py-3">Dataset Type</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {dataSources.map((ds, index) => (
                <tr key={index} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3 font-semibold text-slate-900">{ds.category}</td>
                  <td className="px-4 py-3 text-slate-600 max-w-xs">{ds.source}</td>
                  <td className="px-4 py-3 font-mono text-slate-500">{ds.lastUpdated}</td>
                  <td className="px-4 py-3">
                    <span className="flex items-center gap-1.5 font-medium text-emerald-700">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{ds.status}</span>
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${ds.badgeColor}`}>
                      {ds.type}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Raw Indicators for Currently Selected Area */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Geological Indicators Table */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Compass className="w-4 h-4 text-emerald-600" />
              <h2 className="font-bold text-slate-900 text-sm">Geological Indicators ({selectedArea.name})</h2>
            </div>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
              GSI / MOIL Core Logs
            </span>
          </div>

          <div className="space-y-2 text-xs">
            {geology.map((g) => (
              <div key={g.id} className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-slate-900">{g.indicator}</span>
                  <span className="font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 text-[10px]">
                    {g.status} ({g.numericScore}/100)
                  </span>
                </div>
                <div className="text-slate-700 font-medium text-[11px]">{g.value}</div>
                <p className="text-[11px] text-slate-500 leading-relaxed">{g.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Satellite Remote-Sensing Indicators Table */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Satellite className="w-4 h-4 text-blue-600" />
              <h2 className="font-bold text-slate-900 text-sm">Satellite Remote Sensing ({selectedArea.name})</h2>
            </div>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-blue-100 text-blue-800">
              SIMULATED SATELLITE DATA
            </span>
          </div>

          <div className="space-y-2 text-xs">
            {satellite.map((s) => (
              <div key={s.id} className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-slate-900">{s.indicator}</span>
                  <span className="font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200 text-[10px]">
                    {s.status} ({s.numericScore}/100)
                  </span>
                </div>
                <div className="text-slate-700 font-medium text-[11px]">{s.value}</div>
                <div className="text-[10px] text-slate-500 font-mono">Sensor: {s.sensorType} | {s.bandInfo || 'Band Ratio'}</div>
                <p className="text-[11px] text-slate-500 leading-relaxed">{s.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
