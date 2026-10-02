import React, { useState } from 'react';
import {
  Settings,
  Shield,
  Sliders,
  Cpu,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  User,
  Database
} from 'lucide-react';

export const SettingsView: React.FC = () => {
  const [geoWeight, setGeoWeight] = useState(45);
  const [satWeight, setSatWeight] = useState(35);
  const [terrainWeight, setTerrainWeight] = useState(10);
  const [expWeight, setExpWeight] = useState(10);
  const [targetUptime, setTargetUptime] = useState(85);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Title Header */}
      <div className="pb-3 border-b border-slate-200">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Platform Settings & Model Configurations</h1>
        <p className="text-sm text-slate-600 mt-1">
          Manage reserve intelligence weighting criteria, operational thresholds, and system credentials.
        </p>
      </div>

      {saved && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center gap-2 text-xs text-emerald-800 font-semibold">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Model calibration settings updated successfully.</span>
        </div>
      )}

      {/* Model Weights Configuration Card */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-emerald-600" />
            <h2 className="font-bold text-slate-900 text-sm">Reserve Potential Scoring Model Weights</h2>
          </div>
          <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
            Total: {geoWeight + satWeight + terrainWeight + expWeight}%
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <div className="flex justify-between font-medium text-slate-700 mb-1">
              <span>Geological Lithology & Assays:</span>
              <span className="font-bold text-slate-900">{geoWeight}%</span>
            </div>
            <input
              type="range"
              min="20"
              max="60"
              value={geoWeight}
              onChange={(e) => setGeoWeight(Number(e.target.value))}
              className="w-full accent-emerald-600 cursor-pointer"
            />
          </div>

          <div>
            <div className="flex justify-between font-medium text-slate-700 mb-1">
              <span>Satellite Remote Sensing (SWIR/NDVI):</span>
              <span className="font-bold text-slate-900">{satWeight}%</span>
            </div>
            <input
              type="range"
              min="15"
              max="50"
              value={satWeight}
              onChange={(e) => setSatWeight(Number(e.target.value))}
              className="w-full accent-emerald-600 cursor-pointer"
            />
          </div>

          <div>
            <div className="flex justify-between font-medium text-slate-700 mb-1">
              <span>Historical Borehole Exploration Logs:</span>
              <span className="font-bold text-slate-900">{expWeight}%</span>
            </div>
            <input
              type="range"
              min="5"
              max="25"
              value={expWeight}
              onChange={(e) => setExpWeight(Number(e.target.value))}
              className="w-full accent-emerald-600 cursor-pointer"
            />
          </div>

          <div>
            <div className="flex justify-between font-medium text-slate-700 mb-1">
              <span>DEM Terrain & Slope Stability:</span>
              <span className="font-bold text-slate-900">{terrainWeight}%</span>
            </div>
            <input
              type="range"
              min="5"
              max="20"
              value={terrainWeight}
              onChange={(e) => setTerrainWeight(Number(e.target.value))}
              className="w-full accent-emerald-600 cursor-pointer"
            />
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-lg transition-colors cursor-pointer"
          >
            Save Model Configuration
          </button>
        </div>
      </div>

      {/* Operational Thresholds Card */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
          <Cpu className="w-4 h-4 text-blue-600" />
          <h2 className="font-bold text-slate-900 text-sm">Production Target Benchmarks</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <div className="flex justify-between font-medium text-slate-700 mb-1">
              <span>Equipment Target Availability:</span>
              <span className="font-bold text-slate-900">{targetUptime}%</span>
            </div>
            <input
              type="range"
              min="70"
              max="95"
              value={targetUptime}
              onChange={(e) => setTargetUptime(Number(e.target.value))}
              className="w-full accent-blue-600 cursor-pointer"
            />
            <span className="text-[10px] text-slate-500">DGMS and MOIL standard operational threshold</span>
          </div>

          <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
            <span className="font-bold text-slate-800">AI Model Version</span>
            <div className="text-[11px] text-slate-600">Google Gemini 3.8 Flash (`gemini-3.8-flash`)</div>
            <div className="text-[10px] text-emerald-700 font-semibold">Active Server-Side Proxy</div>
          </div>
        </div>
      </div>

      {/* User Session & Role */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-3">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
          <User className="w-4 h-4 text-slate-700" />
          <h2 className="font-bold text-slate-900 text-sm">Active Session & Role</h2>
        </div>

        <div className="flex items-center justify-between text-xs">
          <div>
            <div className="font-bold text-slate-900">Dr. Ramesh Sharma</div>
            <div className="text-slate-500">ramesh.sharma@moil.nic.in</div>
          </div>
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
            Senior Mining Engineer
          </span>
        </div>
      </div>
    </div>
  );
};
