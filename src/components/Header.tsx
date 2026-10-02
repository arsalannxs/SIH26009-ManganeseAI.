import React from 'react';
import {
  Layers,
  Sparkles,
  PlayCircle,
  MessageSquareCode,
  MapPin,
  ChevronDown,
  RefreshCw,
  Info
} from 'lucide-react';
import { MiningArea } from '../types';

interface HeaderProps {
  areas: MiningArea[];
  selectedArea: MiningArea | null;
  onSelectArea: (area: MiningArea) => void;
  onAnalyze: () => void;
  onRunDemo: () => void;
  onToggleCopilot: () => void;
  copilotOpen: boolean;
  analyzing: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  areas,
  selectedArea,
  onSelectArea,
  onAnalyze,
  onRunDemo,
  onToggleCopilot,
  copilotOpen,
  analyzing
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo & Branding */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-10 h-10 rounded-lg bg-emerald-600 flex items-center justify-center text-white font-bold shadow-xs">
              <Layers className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-xl tracking-tight text-slate-900">ManganeseAI</span>
                <span className="text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  SIH26009
                </span>
                <span className="text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                  DEMO DATA
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium hidden sm:block">
                AI-Powered Manganese Reserve & Production Intelligence • MOIL Ltd. / Ministry of Steel
              </p>
            </div>
          </div>

          {/* Area Selector & Primary Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Quick Area Dropdown */}
            <div className="relative">
              <label htmlFor="area-select" className="sr-only">Select Area</label>
              <div className="flex items-center bg-slate-100 hover:bg-slate-200/80 rounded-lg px-3 py-1.5 text-xs sm:text-sm font-medium text-slate-800 transition-colors border border-slate-200">
                <MapPin className="w-4 h-4 text-emerald-600 mr-1.5 shrink-0" />
                <select
                  id="area-select"
                  className="bg-transparent pr-5 text-slate-900 focus:outline-none cursor-pointer font-medium appearance-none"
                  value={selectedArea?.id || ''}
                  onChange={(e) => {
                    const found = areas.find(a => a.id === e.target.value);
                    if (found) onSelectArea(found);
                  }}
                >
                  {areas.map(area => (
                    <option key={area.id} value={area.id}>
                      {area.name} ({area.code})
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-slate-500 pointer-events-none -ml-4" />
              </div>
            </div>

            {/* Main Action: ANALYZE AREA */}
            <button
              onClick={onAnalyze}
              disabled={analyzing}
              title="Execute full AI/GIS Reserve and Production Shortfall analysis"
              className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-semibold text-xs sm:text-sm px-3 sm:px-4 py-2 rounded-lg shadow-sm transition-all focus:ring-2 focus:ring-emerald-500 focus:ring-offset-1 disabled:opacity-75 cursor-pointer"
            >
              <Sparkles className={`w-4 h-4 ${analyzing ? 'animate-spin' : ''}`} />
              <span>{analyzing ? 'ANALYZING...' : 'ANALYZE AREA'}</span>
            </button>

            {/* RUN DEMO Button */}
            <button
              onClick={onRunDemo}
              className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs sm:text-sm px-3 sm:px-3.5 py-2 rounded-lg shadow-sm transition-colors cursor-pointer"
              title="Launch interactive 11-step hackathon simulation"
            >
              <PlayCircle className="w-4 h-4" />
              <span className="hidden md:inline">RUN DEMO</span>
              <span className="md:hidden">DEMO</span>
            </button>

            {/* ManganeseAI Copilot Toggle */}
            <button
              onClick={onToggleCopilot}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg font-medium text-xs sm:text-sm border transition-colors cursor-pointer ${
                copilotOpen
                  ? 'bg-slate-900 text-white border-slate-900'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border-slate-300'
              }`}
              title="Open ManganeseAI Copilot assistant"
            >
              <MessageSquareCode className="w-4 h-4 text-emerald-500" />
              <span className="hidden lg:inline">Copilot</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
