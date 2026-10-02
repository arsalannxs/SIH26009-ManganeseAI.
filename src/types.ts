export interface MiningArea {
  id: string;
  code: string;
  name: string;
  state: string;
  district: string;
  sizeSqKm: number;
  latitude: number;
  longitude: number;
  activeStatus: 'active_mine' | 'exploration_target' | 'greenfield_potential' | 'under_evaluation';
  isExistingMine: boolean;
  potentialCategory: 'High Potential' | 'Moderate Potential' | 'Low Potential' | 'Very Low / Uncertain';
  potentialScore: number;
  estimatedReserveMT?: number;
  averageGradeMn: number;
  description: string;
  formation: string;
  satelliteIndex: number;
}

export interface GeologicalIndicator {
  id: string;
  areaId: string;
  indicator: string;
  value: string;
  numericScore: number;
  impact: 'High' | 'Medium' | 'Low';
  status: 'Favorable' | 'Moderate' | 'Unfavorable';
  description: string;
  confidence: number;
}

export interface SatelliteIndicator {
  id: string;
  areaId: string;
  indicator: string;
  value: string;
  sensorType: string;
  numericScore: number;
  impact: 'High' | 'Medium' | 'Low';
  status: 'Compatible' | 'Moderate' | 'Inconclusive';
  description: string;
  bandInfo?: string;
  dateCaptured: string;
}

export interface ProductionRecord {
  id: string;
  areaId: string;
  date: string;
  month: string;
  targetMT: number;
  actualMT: number;
  oreGradePercent: number;
  equipmentUptimePercent: number;
  weatherCondition: 'Clear' | 'Light Rain' | 'Heavy Monsoon' | 'Extreme Heat';
  blastingDelaysHours: number;
  workingDays: number;
  notes?: string;
}

export interface ReserveAnalysis {
  id: string;
  areaId: string;
  potentialScore: number;
  potentialCategory: 'High Potential' | 'Moderate Potential' | 'Low Potential' | 'Very Low / Uncertain';
  confidenceScore: number;
  geologicalPotentialScore: number;
  satellitePotentialScore: number;
  terrainSuitabilityScore: number;
  explorationConfidenceScore: number;
  whyThisArea: string[];
  keyFactors: {
    name: string;
    score: number;
    weight: number;
    contribution: string;
  }[];
  calculatedAt: string;
}

export interface ProductionForecast {
  id: string;
  areaId: string;
  month: string;
  expectedWorkingDays: number;
  equipmentAvailability: number;
  expectedOreGrade: number;
  weatherCondition: string;
  blastingSchedule: string;
  currentProductionMT: number;
  targetProductionMT: number;
  expectedProductionMT: number;
  productionGapMT: number;
  shortfallRisk: 'Low' | 'Moderate' | 'High' | 'Critical';
  confidencePercent: number;
  calculatedAt: string;
}

export interface ShortfallFactor {
  factor: string;
  impact: 'High Impact' | 'Medium Impact' | 'Low Impact';
  percentageContribution: number;
  description: string;
  mitigationSuggestion: string;
}

export interface ShortfallAnalysis {
  id: string;
  areaId: string;
  targetMT: number;
  expectedMT: number;
  shortfallMT: number;
  riskLevel: 'Low' | 'Moderate' | 'High' | 'Critical';
  factors: ShortfallFactor[];
  summary: string;
  calculatedAt: string;
}

export interface Recommendation {
  id: string;
  areaId: string;
  category: 'Exploration' | 'Production' | 'Maintenance' | 'Operations';
  priority: 'High' | 'Medium' | 'Low';
  action: string;
  rationale: string;
  expectedBenefit: string;
}

export interface Report {
  id: string;
  title: string;
  areaId: string;
  areaName: string;
  reportType: string;
  content: {
    summary: string;
    reservePotential?: ReserveAnalysis;
    productionForecast?: ProductionForecast;
    shortfallAnalysis?: ShortfallAnalysis;
    recommendations: Recommendation[];
  };
  generatedBy: string;
  createdAt: string;
}
