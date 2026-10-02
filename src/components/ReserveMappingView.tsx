import React, { useState } from 'react';
import {
  MapPin,
  Layers,
  Sparkles,
  Info,
  Compass,
  Satellite,
  CheckCircle2,
  AlertTriangle,
  ZoomIn,
  Eye,
  Filter
} from 'lucide-react';
import { MiningArea, GeologicalIndicator, SatelliteIndicator, ReserveAnalysis } from '../types';

interface ReserveMappingViewProps {
  areas: MiningArea[];
  selectedArea: MiningArea;
  onSelectArea: (area: MiningArea) => void;
  geology: GeologicalIndicator[];
  satellite: SatelliteIndicator[];
  reserve: ReserveAnalysis | null;
  onAnalyze: () => void;
  analyzing: boolean;
}

export const ReserveMappingView: React.FC<ReserveMappingViewProps> = ({
  areas,
  selectedArea,
  onSelectArea,
  geology,
  satellite,
  reserve,
  onAnalyze,
  analyzing
}) => {
  // Layer toggles
  const [showSatelliteHeatmap, setShowSatelliteHeatmap] = useState(true);
  const [showBoreholes, setShowBoreholes] = useState(true);
  const [showGeologicalFaults, setShowGeologicalFaults] = useState(true);

  // Map zone coloring
  const getZoneColor = (area: MiningArea) => {
    if (area.isExistingMine) return { fill: 'rgba(59, 130, 246, 0.25)', stroke: '#2563eb', label: 'Existing Mine' };
    if (area.potentialScore >= 80) return { fill: 'rgba(16, 185, 129, 0.25)', stroke: '#059669', label: 'High Potential' };
    if (area.potentialScore >= 60) return { fill: 'rgba(245, 158, 11, 0.25)', stroke: '#d97706', label: 'Moderate Potential' };
    return { fill: 'rgba(239, 68, 68, 0.25)', stroke: '#dc2626', label: 'Low Potential' };
  };

  // Coordinates mapping to SVG viewport (X: 80-720, Y: 60-440)
  const mapCoordinates = [
    { id: 'area-a', x: 260, y: 190, r: 52, shape: 'M 210,160 C 270,140 320,180 300,230 C 270,260 220,240 210,160 Z' },
    { id: 'area-b', x: 520, y: 150, r: 64, shape: 'M 460,110 C 540,100 580,160 560,200 C 510,220 460,190 460,110 Z' },
    { id: 'area-c', x: 170, y: 280, r: 44, shape: 'M 130,250 C 210,240 220,310 180,330 C 140,330 120,290 130,250 Z' },
    { id: 'area-d', x: 280, y: 110, r: 38, shape: 'M 250,80 C 310,75 320,130 280,140 C 240,140 240,95 250,80 Z' },
    { id: 'area-e', x: 570, y: 280, r: 50, shape: 'M 520,250 C 610,240 630,310 590,340 C 530,340 510,290 520,250 Z' },
  ];

  return (
    <div className="space-y-6">
      {/* Title & Satellite Disclaimer Banner */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-3 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">Reserve Mapping & GIS Intelligence</h1>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800">
              SIMULATED SATELLITE DATA
            </span>
          </div>
          <p className="text-sm text-slate-600 mt-1">
            Space-borne multi-spectral remote sensing (Sentinel-2 / Landsat-8) fused with regional Gondite geological strata.
          </p>
        </div>

        {/* Map Legend */}
        <div className="flex flex-wrap items-center gap-3 bg-white p-2.5 rounded-lg border border-slate-200 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-emerald-500 inline-block border border-emerald-600"></span>
            <span className="text-slate-700 font-medium">High Potential</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-amber-500 inline-block border border-amber-600"></span>
            <span className="text-slate-700 font-medium">Moderate</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-rose-500 inline-block border border-rose-600"></span>
            <span className="text-slate-700 font-medium">Low / Uncertain</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-blue-500 inline-block border border-blue-600"></span>
            <span className="text-slate-700 font-medium">Existing Mine</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Interactive Map (Left) + Area Analysis Panel (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Interactive GIS Map */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200 shadow-xs p-4 flex flex-col justify-between">
          {/* Map Controls Top Bar */}
          <div className="flex items-center justify-between pb-3 mb-2 border-b border-slate-100">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
              <Compass className="w-4 h-4 text-emerald-600" />
              <span>Nagpur-Bhandara-Balaghat Manganese Concession Grid</span>
            </div>

            {/* Layer Filter Toggles */}
            <div className="flex items-center gap-2 text-xs">
              <button
                onClick={() => setShowSatelliteHeatmap(!showSatelliteHeatmap)}
                className={`px-2.5 py-1 rounded text-[11px] font-medium transition-colors cursor-pointer border ${
                  showSatelliteHeatmap
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-300 font-semibold'
                    : 'bg-slate-50 text-slate-500 border-slate-200'
                }`}
              >
                SWIR Heatmap
              </button>
              <button
                onClick={() => setShowBoreholes(!showBoreholes)}
                className={`px-2.5 py-1 rounded text-[11px] font-medium transition-colors cursor-pointer border ${
                  showBoreholes
                    ? 'bg-blue-50 text-blue-800 border-blue-300 font-semibold'
                    : 'bg-slate-50 text-slate-500 border-slate-200'
                }`}
              >
                Boreholes
              </button>
              <button
                onClick={() => setShowGeologicalFaults(!showGeologicalFaults)}
                className={`px-2.5 py-1 rounded text-[11px] font-medium transition-colors cursor-pointer border ${
                  showGeologicalFaults
                    ? 'bg-purple-50 text-purple-800 border-purple-300 font-semibold'
                    : 'bg-slate-50 text-slate-500 border-slate-200'
                }`}
              >
                Fault Lines
              </button>
            </div>
          </div>

          {/* SVG Map Canvas */}
          <div className="relative w-full h-[380px] sm:h-[420px] bg-slate-50 rounded-lg border border-slate-200 overflow-hidden flex items-center justify-center">
            {/* Background Grid Pattern */}
            <svg className="w-full h-full" viewBox="0 0 760 440">
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#e2e8f0" strokeWidth="1" />
                </pattern>
                {/* Gradient for SWIR satellite mineral anomaly */}
                <radialGradient id="swirAnomalyA" cx="35%" cy="45%" r="65%">
                  <stop offset="0%" stopColor="#10b981" stopOpacity="0.45" />
                  <stop offset="60%" stopColor="#059669" stopOpacity="0.15" />
                  <stop offset="100%" stopColor="#059669" stopOpacity="0" />
                </radialGradient>
                <radialGradient id="swirAnomalyB" cx="65%" cy="35%" r="70%">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.4" />
                  <stop offset="60%" stopColor="#2563eb" stopOpacity="0.15" />
                  <stop offset="100%" stopColor="#2563eb" stopOpacity="0" />
                </radialGradient>
              </defs>

              <rect width="760" height="440" fill="url(#grid)" />

              {/* Simulated Satellite SWIR Reflectance Heatmap Overlay */}
              {showSatelliteHeatmap && (
                <g className="transition-opacity duration-300">
                  <circle cx="260" cy="190" r="110" fill="url(#swirAnomalyA)" />
                  <circle cx="520" cy="150" r="130" fill="url(#swirAnomalyB)" />
                  <ellipse cx="170" cy="280" rx="70" ry="50" fill="#f59e0b" fillOpacity="0.15" />
                </g>
              )}

              {/* Regional Geological Fault Lines / Sausar Shear Zone */}
              {showGeologicalFaults && (
                <g stroke="#9333ea" strokeWidth="2" strokeDasharray="6 4" opacity="0.6">
                  <path d="M 60,320 Q 240,210 440,160 T 720,100" fill="none" />
                  <path d="M 120,380 Q 320,260 560,190 T 740,160" fill="none" />
                  <text x="360" y="145" fill="#7e22ce" fontSize="10" fontWeight="600">Sausar Synclinal Shear Axis</text>
                </g>
              )}

              {/* Mining Area Polygons */}
              {areas.map((area) => {
                const geom = mapCoordinates.find(m => m.id === area.id);
                if (!geom) return null;
                const colors = getZoneColor(area);
                const isSelected = selectedArea.id === area.id;

                return (
                  <g
                    key={area.id}
                    onClick={() => onSelectArea(area)}
                    className="cursor-pointer transition-transform duration-200"
                  >
                    <path
                      d={geom.shape}
                      fill={colors.fill}
                      stroke={colors.stroke}
                      strokeWidth={isSelected ? 3.5 : 2}
                      strokeDasharray={isSelected ? 'none' : 'none'}
                      className="hover:opacity-90 transition-all"
                    />

                    {/* Centered Area Node Pin */}
                    <circle
                      cx={geom.x}
                      cy={geom.y}
                      r={isSelected ? 10 : 8}
                      fill={isSelected ? '#0f172a' : colors.stroke}
                      stroke="#ffffff"
                      strokeWidth="2.5"
                      className="shadow-sm"
                    />

                    {/* Area Label */}
                    <text
                      x={geom.x}
                      y={geom.y - 14}
                      textAnchor="middle"
                      fill="#0f172a"
                      fontSize="11"
                      fontWeight={isSelected ? "bold" : "600"}
                      className="pointer-events-none select-none"
                    >
                      {area.code}
                    </text>
                    <text
                      x={geom.x}
                      y={geom.y + 24}
                      textAnchor="middle"
                      fill="#475569"
                      fontSize="9"
                      className="pointer-events-none select-none font-medium"
                    >
                      Score: {area.potentialScore}/100
                    </text>
                  </g>
                );
              })}

              {/* Exploration Borehole Drill Points */}
              {showBoreholes && (
                <g>
                  {/* Area A Boreholes */}
                  <circle cx="240" cy="180" r="3.5" fill="#047857" stroke="#ffffff" strokeWidth="1" />
                  <circle cx="270" cy="175" r="3.5" fill="#047857" stroke="#ffffff" strokeWidth="1" />
                  <circle cx="280" cy="205" r="3.5" fill="#047857" stroke="#ffffff" strokeWidth="1" />
                  <circle cx="250" cy="215" r="3.5" fill="#047857" stroke="#ffffff" strokeWidth="1" />
                  <circle cx="295" cy="190" r="3.5" fill="#047857" stroke="#ffffff" strokeWidth="1" />

                  {/* Area B Boreholes */}
                  <circle cx="500" cy="140" r="3.5" fill="#1d4ed8" stroke="#ffffff" strokeWidth="1" />
                  <circle cx="530" cy="155" r="3.5" fill="#1d4ed8" stroke="#ffffff" strokeWidth="1" />
                  <circle cx="545" cy="130" r="3.5" fill="#1d4ed8" stroke="#ffffff" strokeWidth="1" />

                  {/* Area C Boreholes */}
                  <circle cx="160" cy="275" r="3.5" fill="#b45309" stroke="#ffffff" strokeWidth="1" />
                  <circle cx="185" cy="290" r="3.5" fill="#b45309" stroke="#ffffff" strokeWidth="1" />
                </g>
              )}

              {/* North Arrow and Scale Bar */}
              <g transform="translate(700, 40)">
                <circle cx="0" cy="0" r="14" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1.5" />
                <path d="M 0,-10 L 4,3 L 0,0 L -4,3 Z" fill="#dc2626" />
                <path d="M 0,10 L 4,-3 L 0,0 L -4,-3 Z" fill="#64748b" />
                <text x="0" y="-13" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#0f172a">N</text>
              </g>

              <g transform="translate(30, 410)">
                <rect width="100" height="4" fill="#0f172a" />
                <text x="0" y="-6" fontSize="9" fill="#475569" fontWeight="500">0</text>
                <text x="50" y="-6" fontSize="9" fill="#475569" fontWeight="500">5 km</text>
                <text x="100" y="-6" fontSize="9" fill="#475569" fontWeight="500">10 km</text>
              </g>
            </svg>

            {/* Selected Area Overlay Tag */}
            <div className="absolute bottom-3 right-3 bg-white/95 backdrop-blur-xs px-3 py-1.5 rounded-lg border border-slate-200 text-xs shadow-xs">
              <span className="text-slate-500 font-medium">Selected: </span>
              <span className="font-bold text-slate-900">{selectedArea.name}</span>
            </div>
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-500 pt-3">
            <span>Click any polygon on map to inspect block telemetry</span>
            <span className="italic">GCS WGS84 • Projected UTM Zone 44N</span>
          </div>
        </div>

        {/* Right Column: Area Details & AI Reserve Potential Panel */}
        <div className="lg:col-span-5 bg-white rounded-xl border border-slate-200 shadow-xs p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <div>
              <span className="text-xs uppercase tracking-wider font-semibold text-slate-500">
                Area Intelligence Inspector
              </span>
              <h2 className="text-lg font-bold text-slate-900 mt-0.5">{selectedArea.name}</h2>
            </div>
            <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
              {selectedArea.code}
            </span>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
              <span className="text-slate-500">Concession Area Size</span>
              <div className="text-base font-bold text-slate-900 mt-0.5">{selectedArea.sizeSqKm} sq km</div>
              <span className="text-[10px] text-slate-500">Lat: {selectedArea.latitude.toFixed(3)}, Lon: {selectedArea.longitude.toFixed(3)}</span>
            </div>
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
              <span className="text-slate-500">Status Classification</span>
              <div className="text-base font-bold text-slate-900 mt-0.5 capitalize">
                {selectedArea.isExistingMine ? 'Operating Mine' : 'Exploration Block'}
              </div>
              <span className="text-[10px] text-emerald-700 font-medium">{selectedArea.averageGradeMn}% Average Mn Grade</span>
            </div>
          </div>

          {/* Reserve Potential Score Card */}
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-emerald-900">AI Reserve Potential Score</span>
                <div className="text-3xl font-extrabold text-emerald-900">
                  {reserve ? reserve.potentialScore : selectedArea.potentialScore}
                  <span className="text-sm font-normal text-emerald-700"> / 100</span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-200 text-emerald-900 inline-block">
                  {reserve ? reserve.potentialCategory : selectedArea.potentialCategory}
                </span>
                <div className="text-[10px] text-emerald-800 mt-1">Exploration Priority</div>
              </div>
            </div>
            <p className="text-xs text-emerald-800/90 leading-relaxed pt-1 border-t border-emerald-200/80">
              Model estimate synthesized from Gondite lithological indicators, Sentinel-2 remote-sensing reflectance, and core drilling assays.
            </p>
          </div>

          {/* Geological & Satellite Indicators Preview */}
          <div className="space-y-2">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-700 flex justify-between">
              <span>Key Surface & Subsurface Indicators</span>
              <span className="text-slate-500 font-normal">Impact Status</span>
            </div>

            <div className="space-y-1.5 text-xs">
              {geology.slice(0, 2).map((geo) => (
                <div key={geo.id} className="flex justify-between items-center p-2 rounded bg-slate-50 border border-slate-100">
                  <div>
                    <span className="font-semibold text-slate-800 block">{geo.indicator}</span>
                    <span className="text-[11px] text-slate-500">{geo.value}</span>
                  </div>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                    {geo.status}
                  </span>
                </div>
              ))}

              {satellite.slice(0, 1).map((sat) => (
                <div key={sat.id} className="flex justify-between items-center p-2 rounded bg-slate-50 border border-slate-100">
                  <div>
                    <span className="font-semibold text-slate-800 block">{sat.indicator}</span>
                    <span className="text-[11px] text-slate-500">{sat.value}</span>
                  </div>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-blue-100 text-blue-800">
                    {sat.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Simple "WHY THIS AREA?" Section */}
          <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 text-xs space-y-2">
            <div className="font-bold text-slate-900 flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-emerald-600" />
              <span>WHY THIS AREA? (Model Interpretation)</span>
            </div>
            <ul className="space-y-1 text-slate-600 list-disc list-inside text-[11px] leading-relaxed">
              <li>Geological formation: Favorable Gondite rock sequence in {selectedArea.formation}.</li>
              <li>Remote sensing: SWIR spectral index ({selectedArea.satelliteIndex}/100) indicates manganese oxyhydroxide presence.</li>
              <li>Topography: Moderate dry ridge terrain suitable for open-cast bench advancement.</li>
              <li>Exploration history: Core drill logs show thick mineralized intersections.</li>
            </ul>
          </div>

          {/* Primary Action Button */}
          <button
            onClick={onAnalyze}
            disabled={analyzing}
            className="w-full py-2.5 px-4 rounded-lg bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold text-sm shadow-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <Sparkles className={`w-4 h-4 ${analyzing ? 'animate-spin' : ''}`} />
            <span>{analyzing ? 'ANALYZING RESERVE & PRODUCTION...' : 'ANALYZE THIS AREA'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
