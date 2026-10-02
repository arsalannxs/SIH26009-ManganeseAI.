import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Navigation, NavTab } from './components/Navigation';
import { DashboardView } from './components/DashboardView';
import { ReserveMappingView } from './components/ReserveMappingView';
import { ProductionForecastView } from './components/ProductionForecastView';
import { ShortfallAnalysisView } from './components/ShortfallAnalysisView';
import { DataIndicatorsView } from './components/DataIndicatorsView';
import { ReportsView } from './components/ReportsView';
import { SettingsView } from './components/SettingsView';
import { CopilotDrawer } from './components/CopilotDrawer';
import { DemoModal } from './components/DemoModal';
import { api, ForecastParams } from './services/api';
import {
  MiningArea,
  GeologicalIndicator,
  SatelliteIndicator,
  ProductionRecord,
  ReserveAnalysis,
  ProductionForecast,
  ShortfallAnalysis,
  Recommendation,
  Report
} from './types';
import { Loader2 } from 'lucide-react';

export default function App() {
  const [currentTab, setCurrentTab] = useState<NavTab>('Dashboard');
  const [areas, setAreas] = useState<MiningArea[]>([]);
  const [selectedArea, setSelectedArea] = useState<MiningArea | null>(null);

  // Indicators & Telemetry
  const [geology, setGeology] = useState<GeologicalIndicator[]>([]);
  const [satellite, setSatellite] = useState<SatelliteIndicator[]>([]);
  const [production, setProduction] = useState<ProductionRecord[]>([]);

  // Model & AI Outputs
  const [reserve, setReserve] = useState<ReserveAnalysis | null>(null);
  const [forecast, setForecast] = useState<ProductionForecast | null>(null);
  const [shortfall, setShortfall] = useState<ShortfallAnalysis | null>(null);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [aiExplanation, setAiExplanation] = useState<string>('');
  const [reports, setReports] = useState<Report[]>([]);

  // Simulation / Forecast Parameters
  const [forecastParams, setForecastParams] = useState<ForecastParams>({
    areaId: 'area-a',
    month: 'March 2026',
    expectedWorkingDays: 26,
    equipmentAvailability: 79,
    expectedOreGrade: 41.5,
    weatherCondition: 'Clear',
    blastingSchedule: 'Moderate Delay',
    targetProductionMT: 90000
  });

  // UI state
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [copilotOpen, setCopilotOpen] = useState(false);
  const [demoOpen, setDemoOpen] = useState(false);
  const [generatingReport, setGeneratingReport] = useState(false);

  // Initial Load: Fetch mining areas and seed baseline
  useEffect(() => {
    async function init() {
      try {
        const areaList = await api.getAreas();
        setAreas(areaList);
        if (areaList.length > 0) {
          const defaultArea = areaList[0]; // Area A
          setSelectedArea(defaultArea);
          await loadAreaData(defaultArea.id);
        }
      } catch (err) {
        console.error('Initial data load failed:', err);
      } finally {
        setLoading(false);
      }
    }
    init();
  }, []);

  // Helper to load area data
  async function loadAreaData(areaId: string) {
    try {
      const [geoList, satList, prodList] = await Promise.all([
        api.getGeology(areaId),
        api.getSatellite(areaId),
        api.getProduction(areaId, '6m')
      ]);

      setGeology(geoList);
      setSatellite(satList);
      setProduction(prodList);

      const params: ForecastParams = {
        ...forecastParams,
        areaId,
      };
      setForecastParams(params);

      // Perform reserve analysis and shortfall calculations
      const [resResult, sfResult] = await Promise.all([
        api.analyzeReserve(areaId),
        api.analyzeShortfall(params)
      ]);

      setReserve(resResult);
      setForecast(sfResult.forecast);
      setShortfall(sfResult.shortfall);

      // Load AI explanation and recommendations
      const aiData = await api.getAIExplanation(areaId, params);
      setAiExplanation(aiData.explanation);
      setRecommendations(aiData.recommendations);
    } catch (err) {
      console.error('Failed to load area data:', err);
    }
  }

  // Handle switching active area
  const handleSelectArea = async (area: MiningArea) => {
    setSelectedArea(area);
    setLoading(true);
    await loadAreaData(area.id);
    setLoading(false);
  };

  // Main Action: "ANALYZE AREA"
  const handleAnalyze = async () => {
    if (!selectedArea) return;
    setAnalyzing(true);
    try {
      await loadAreaData(selectedArea.id);
    } finally {
      setAnalyzing(false);
    }
  };

  // Recalculate forecast when slider/input is adjusted
  const handleRecalculateForecast = async () => {
    if (!selectedArea) return;
    setLoading(true);
    try {
      const sfResult = await api.analyzeShortfall(forecastParams);
      setForecast(sfResult.forecast);
      setShortfall(sfResult.shortfall);

      const aiData = await api.getAIExplanation(selectedArea.id, forecastParams);
      setAiExplanation(aiData.explanation);
      setRecommendations(aiData.recommendations);
    } catch (err) {
      console.error('Forecast recalculation failed:', err);
    } finally {
      setLoading(false);
    }
  };

  // Ask Copilot query
  const handleAskCopilot = async (message: string): Promise<string> => {
    if (!selectedArea) return 'Insufficient data available for this analysis.';
    return await api.askCopilot(message, selectedArea.id, forecastParams);
  };

  // Generate Report
  const handleGenerateReport = async (reportType: string) => {
    if (!selectedArea) return;
    setGeneratingReport(true);
    try {
      const newRep = await api.createReport(selectedArea.id, reportType);
      setReports((prev) => [newRep, ...prev]);
    } catch (err) {
      console.error('Failed to create report:', err);
    } finally {
      setGeneratingReport(false);
    }
  };

  if (loading && !selectedArea) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="flex flex-col items-center gap-3 bg-white p-8 rounded-2xl shadow-xs border border-slate-200">
          <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" />
          <div className="font-bold text-slate-800 text-sm">Initializing ManganeseAI System...</div>
          <span className="text-xs text-slate-500">Connecting MOIL geospatial & reserve telemetry</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans text-slate-900 selection:bg-emerald-100 selection:text-emerald-900">
      {/* 1. Header with branding, Area selector, Analyze Area, and Run Demo */}
      <Header
        areas={areas}
        selectedArea={selectedArea}
        onSelectArea={handleSelectArea}
        onAnalyze={handleAnalyze}
        onRunDemo={() => setDemoOpen(true)}
        onToggleCopilot={() => setCopilotOpen(!copilotOpen)}
        copilotOpen={copilotOpen}
        analyzing={analyzing}
      />

      {/* 2. Navigation bar with the 7 designated tabs */}
      <Navigation currentTab={currentTab} onSelectTab={(tab) => setCurrentTab(tab)} />

      {/* 3. Main Views Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {selectedArea && (
          <>
            {currentTab === 'Dashboard' && (
              <DashboardView
                selectedArea={selectedArea}
                reserve={reserve}
                forecast={forecast}
                shortfall={shortfall}
                recommendations={recommendations}
                onAnalyze={handleAnalyze}
                onNavigate={(tab) => setCurrentTab(tab)}
                analyzing={analyzing}
              />
            )}

            {currentTab === 'Reserve Mapping' && (
              <ReserveMappingView
                areas={areas}
                selectedArea={selectedArea}
                onSelectArea={handleSelectArea}
                geology={geology}
                satellite={satellite}
                reserve={reserve}
                onAnalyze={handleAnalyze}
                analyzing={analyzing}
              />
            )}

            {currentTab === 'Production Forecast' && (
              <ProductionForecastView
                selectedArea={selectedArea}
                forecast={forecast}
                productionRecords={production}
                forecastParams={forecastParams}
                onUpdateParams={setForecastParams}
                onRecalculate={handleRecalculateForecast}
                loading={loading}
              />
            )}

            {currentTab === 'Shortfall Analysis' && (
              <ShortfallAnalysisView
                selectedArea={selectedArea}
                shortfall={shortfall}
                forecast={forecast}
                onRunWhatIf={(p) => {
                  setForecastParams({ ...forecastParams, ...p });
                  handleRecalculateForecast();
                }}
              />
            )}

            {currentTab === 'Data & Indicators' && (
              <DataIndicatorsView
                selectedArea={selectedArea}
                geology={geology}
                satellite={satellite}
                production={production}
              />
            )}

            {currentTab === 'Reports' && (
              <ReportsView
                selectedArea={selectedArea}
                reserve={reserve}
                forecast={forecast}
                shortfall={shortfall}
                recommendations={recommendations}
                aiExplanation={aiExplanation}
                reportsList={reports}
                onGenerateReport={handleGenerateReport}
                generating={generatingReport}
              />
            )}

            {currentTab === 'Settings' && <SettingsView />}
          </>
        )}
      </main>

      {/* 4. ManganeseAI Copilot Slide-over Drawer */}
      {selectedArea && (
        <CopilotDrawer
          isOpen={copilotOpen}
          onClose={() => setCopilotOpen(false)}
          selectedArea={selectedArea}
          reserve={reserve}
          forecast={forecast}
          shortfall={shortfall}
          onAskCopilot={handleAskCopilot}
        />
      )}

      {/* 5. Guided Interactive Demo Walkthrough Modal */}
      {selectedArea && (
        <DemoModal
          isOpen={demoOpen}
          onClose={() => setDemoOpen(false)}
          selectedArea={selectedArea}
          reserve={reserve}
          forecast={forecast}
          shortfall={shortfall}
          onNavigateTab={(tab) => setCurrentTab(tab)}
        />
      )}

      {/* 6. Professional Footer */}
      <footer className="bg-white border-t border-slate-200 mt-auto py-4 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-800">ManganeseAI</span>
            <span>•</span>
            <span>Ministry of Steel / MOIL Ltd.</span>
            <span>•</span>
            <span className="text-[10px] font-mono bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded">
              SIH26009
            </span>
          </div>
          <div className="text-[11px] text-slate-400">
            AI-Powered Space Technology & Manganese Production Forecasting Platform
          </div>
        </div>
      </footer>
    </div>
  );
}
