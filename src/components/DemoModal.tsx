import React, { useState, useEffect } from 'react';
import {
  X,
  PlayCircle,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  MapPin,
  Compass,
  Satellite,
  Cpu,
  AlertTriangle,
  Lightbulb,
  FileCheck
} from 'lucide-react';
import { MiningArea, ReserveAnalysis, ProductionForecast, ShortfallAnalysis } from '../types';

interface DemoModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedArea: MiningArea;
  reserve: ReserveAnalysis | null;
  forecast: ProductionForecast | null;
  shortfall: ShortfallAnalysis | null;
  onNavigateTab: (tab: any) => void;
}

export const DemoModal: React.FC<DemoModalProps> = ({
  isOpen,
  onClose,
  selectedArea,
  reserve,
  forecast,
  shortfall,
  onNavigateTab
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [autoPlay, setAutoPlay] = useState(false);

  const steps = [
    {
      num: 1,
      title: 'Select Concession Block (Area A)',
      tab: 'Reserve Mapping',
      icon: MapPin,
      content: 'Selected Area A (Mansar East Extension) in the Sausar manganese fold belt, Nagpur District. Spanning 14.8 sq km with Gondite lithological horizons.'
    },
    {
      num: 2,
      title: 'Display Interactive Spatial Map',
      tab: 'Reserve Mapping',
      icon: Compass,
      content: 'The spatial GIS canvas displays concession boundary polygons with color-coded classification: High Potential (Green), Moderate (Yellow), and Low (Red).'
    },
    {
      num: 3,
      title: 'Analyze Geological Surface Indicators',
      tab: 'Data & Indicators',
      icon: Compass,
      content: 'Identified Gondite mica-schist formation (Score: 88/100) and prominent pyrolusite-braunite float ore capping along elevated ridge structures.'
    },
    {
      num: 4,
      title: 'Analyze Simulated Satellite Indicators',
      tab: 'Reserve Mapping',
      icon: Satellite,
      content: 'Processed Sentinel-2 SWIR band ratios showing diagnostic 2.2µm absorption for manganese oxyhydroxides combined with negative NDVI vegetation stress anomalies.'
    },
    {
      num: 5,
      title: 'Generate Reserve Potential Score',
      tab: 'Dashboard',
      icon: Sparkles,
      content: `The AI/ML fusion engine computes a Reserve Potential Score of ${reserve?.potentialScore || 84}/100 ("High Potential"), ranking Area A as a top tier Exploration Priority.`
    },
    {
      num: 6,
      title: 'Evaluate Historical Production Records',
      tab: 'Production Forecast',
      icon: Cpu,
      content: 'Analyzed 6 months of historical weighbridge dispatch trends. February actual dispatch reached 84,100 MT with 79% equipment mechanical availability.'
    },
    {
      num: 7,
      title: 'Generate Next Month Production Forecast',
      tab: 'Production Forecast',
      icon: Cpu,
      content: `Target for next month is 90,000 MT. Machine learning model predicts expected dispatch of ${forecast?.expectedProductionMT.toLocaleString() || '82,500'} MT based on planned shifts.`
    },
    {
      num: 8,
      title: 'Calculate Production Gap & Risk',
      tab: 'Production Forecast',
      icon: AlertTriangle,
      content: `Identified a projected production deficit gap of ${forecast?.productionGapMT.toLocaleString() || '7,500'} MT (8.3% shortfall), classified under "Moderate Shortfall Risk".`
    },
    {
      num: 9,
      title: 'Decompose Shortfall Root Factors',
      tab: 'Shortfall Analysis',
      icon: AlertTriangle,
      content: 'Shortfall driver decomposition indicates: Equipment Downtime is the primary bottleneck (48% impact), followed by Weather/Heat (24%) and Blasting Delay (18%).'
    },
    {
      num: 10,
      title: 'Synthesize AI Explanation ("Why This Area?")',
      tab: 'Dashboard',
      icon: Sparkles,
      content: 'Google Gemini generates an explainable domain briefing explaining how Gondite lithology correlates with remote-sensing SWIR signatures to validate priority.'
    },
    {
      num: 11,
      title: 'Deliver Actionable Engineering Recommendations',
      tab: 'Reports',
      icon: Lightbulb,
      content: 'Action 1: Prioritize core diamond drilling along eastern synclinal axis. Action 2: Raise HEMM availability to ≥85% to recover up to 65% of the projected shortfall!'
    }
  ];

  // Auto-play timer
  useEffect(() => {
    let timer: any;
    if (autoPlay && isOpen) {
      timer = setInterval(() => {
        setCurrentStep((prev) => {
          if (prev < steps.length) return prev + 1;
          setAutoPlay(false);
          return prev;
        });
      }, 4000);
    }
    return () => clearInterval(timer);
  }, [autoPlay, isOpen, steps.length]);

  if (!isOpen) return null;

  const current = steps[currentStep - 1];
  const StepIcon = current.icon;

  const handleStepJump = (stepNum: number) => {
    setCurrentStep(stepNum);
    onNavigateTab(steps[stepNum - 1].tab);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Top Header */}
        <div className="bg-slate-900 text-white p-4 sm:p-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center text-slate-950 font-bold">
              <PlayCircle className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm sm:text-base">ManganeseAI Guided Demo</span>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-400 text-slate-950 px-2 py-0.5 rounded-full">
                  SIH DEMO / SIMULATION MODE
                </span>
              </div>
              <span className="text-xs text-slate-400">
                11-Step end-to-end reserve intelligence & shortfall walkthrough
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors cursor-pointer p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Progress Bar */}
        <div className="bg-slate-100 px-4 py-2 border-b border-slate-200 flex items-center justify-between text-xs">
          <span className="font-semibold text-slate-700">
            Step {currentStep} of {steps.length}: <span className="text-emerald-700">{current.title}</span>
          </span>
          <button
            onClick={() => setAutoPlay(!autoPlay)}
            className={`px-2 py-0.5 rounded text-[11px] font-semibold cursor-pointer border ${
              autoPlay
                ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-50'
            }`}
          >
            {autoPlay ? 'Pause Auto-Play' : 'Auto-Play (4s/step)'}
          </button>
        </div>

        {/* Progress Dots Bar */}
        <div className="flex px-4 pt-3 gap-1">
          {steps.map((s) => (
            <div
              key={s.num}
              onClick={() => handleStepJump(s.num)}
              className={`h-1.5 flex-1 rounded-full cursor-pointer transition-colors ${
                s.num === currentStep
                  ? 'bg-emerald-600'
                  : s.num < currentStep
                  ? 'bg-emerald-300'
                  : 'bg-slate-200'
              }`}
            />
          ))}
        </div>

        {/* Modal Body Content */}
        <div className="p-6 space-y-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 shrink-0">
              <StepIcon className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-400 uppercase">Stage {current.num}</span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                  Target View: {current.tab}
                </span>
              </div>
              <h3 className="text-lg font-bold text-slate-900">{current.title}</h3>
              <p className="text-sm text-slate-600 leading-relaxed pt-1">
                {current.content}
              </p>
            </div>
          </div>

          <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs flex items-center justify-between">
            <span className="text-slate-500">Jump to application screen:</span>
            <button
              onClick={() => {
                onNavigateTab(current.tab);
                onClose();
              }}
              className="font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 cursor-pointer"
            >
              <span>Inspect on {current.tab} tab</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Modal Footer Controls */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <button
            onClick={() => handleStepJump(Math.max(1, currentStep - 1))}
            disabled={currentStep === 1}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-slate-700 text-xs font-semibold hover:bg-slate-100 disabled:opacity-40 cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>

          <span className="text-xs text-slate-500 font-medium">
            {currentStep} / {steps.length}
          </span>

          {currentStep < steps.length ? (
            <button
              onClick={() => handleStepJump(currentStep + 1)}
              className="flex items-center gap-1 px-4 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 cursor-pointer shadow-xs"
            >
              <span>Next Stage</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={onClose}
              className="flex items-center gap-1 px-4 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 cursor-pointer shadow-xs"
            >
              <span>Finish Demo</span>
              <CheckCircle2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
