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
} from '../types';

export interface ForecastParams {
  areaId: string;
  month?: string;
  expectedWorkingDays: number;
  equipmentAvailability: number;
  expectedOreGrade: number;
  weatherCondition: string;
  blastingSchedule: string;
  targetProductionMT?: number;
}

export const api = {
  // Areas
  async getAreas(): Promise<MiningArea[]> {
    const res = await fetch('/api/areas');
    if (!res.ok) throw new Error('Failed to fetch mining areas');
    const data = await res.json();
    return data.areas;
  },

  async getArea(id: string): Promise<MiningArea> {
    const res = await fetch(`/api/areas/${id}`);
    if (!res.ok) throw new Error('Failed to fetch area details');
    const data = await res.json();
    return data.area;
  },

  // Indicators
  async getGeology(areaId: string): Promise<GeologicalIndicator[]> {
    const res = await fetch(`/api/areas/${areaId}/geology`);
    if (!res.ok) throw new Error('Failed to fetch geology indicators');
    const data = await res.json();
    return data.indicators;
  },

  async getSatellite(areaId: string): Promise<SatelliteIndicator[]> {
    const res = await fetch(`/api/areas/${areaId}/satellite`);
    if (!res.ok) throw new Error('Failed to fetch satellite indicators');
    const data = await res.json();
    return data.indicators;
  },

  // Production
  async getProduction(areaId?: string, range: string = '6m'): Promise<ProductionRecord[]> {
    const url = areaId
      ? `/api/production?areaId=${areaId}&range=${range}`
      : `/api/production?range=${range}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Failed to fetch production records');
    const data = await res.json();
    return data.records;
  },

  // Analysis
  async analyzeReserve(areaId: string): Promise<ReserveAnalysis> {
    const res = await fetch('/api/analysis/reserve', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ areaId })
    });
    if (!res.ok) throw new Error('Failed to analyze reserve potential');
    const data = await res.json();
    return data.reserveAnalysis;
  },

  async calculateForecast(params: ForecastParams): Promise<ProductionForecast> {
    const res = await fetch('/api/analysis/forecast', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params)
    });
    if (!res.ok) throw new Error('Failed to calculate forecast');
    const data = await res.json();
    return data.forecast;
  },

  async analyzeShortfall(params: ForecastParams): Promise<{ shortfall: ShortfallAnalysis; forecast: ProductionForecast }> {
    const res = await fetch('/api/analysis/shortfall', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params)
    });
    if (!res.ok) throw new Error('Failed to analyze shortfall');
    return await res.json();
  },

  // AI
  async getAIExplanation(areaId: string, forecastInput: ForecastParams): Promise<{
    explanation: string;
    reserve: ReserveAnalysis;
    forecast: ProductionForecast;
    shortfall: ShortfallAnalysis;
    recommendations: Recommendation[];
  }> {
    const res = await fetch('/api/ai/explain', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ areaId, forecastInput })
    });
    if (!res.ok) throw new Error('Failed to generate AI explanation');
    return await res.json();
  },

  async askCopilot(message: string, areaId: string, forecastInput: ForecastParams): Promise<string> {
    const res = await fetch('/api/ai/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, areaId, forecastInput })
    });
    if (!res.ok) throw new Error('Failed to ask Copilot');
    const data = await res.json();
    return data.reply;
  },

  // Reports
  async getReports(): Promise<Report[]> {
    const res = await fetch('/api/reports');
    if (!res.ok) throw new Error('Failed to fetch reports');
    const data = await res.json();
    return data.reports;
  },

  async createReport(areaId: string, reportType: string, title?: string): Promise<Report> {
    const res = await fetch('/api/reports', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ areaId, reportType, title })
    });
    if (!res.ok) throw new Error('Failed to create report');
    const data = await res.json();
    return data.report;
  },

  // Demo
  async runDemo(): Promise<any> {
    const res = await fetch('/api/demo/run', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });
    if (!res.ok) throw new Error('Failed to run demo simulation');
    return await res.json();
  }
};
