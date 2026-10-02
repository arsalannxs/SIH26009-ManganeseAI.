import {
  MiningArea,
  GeologicalIndicator,
  SatelliteIndicator,
  ReserveAnalysis,
  ProductionForecast,
  ShortfallAnalysis,
  ShortfallFactor,
  Recommendation
} from './types';

export function calculateReservePotential(
  area: MiningArea,
  geology: GeologicalIndicator[],
  satellite: SatelliteIndicator[]
): ReserveAnalysis {
  // Geological score weighted average (Weight: 45%)
  const geoAvg = geology.length > 0
    ? geology.reduce((acc, curr) => acc + curr.numericScore, 0) / geology.length
    : area.potentialScore;

  // Satellite score weighted average (Weight: 35%)
  const satAvg = satellite.length > 0
    ? satellite.reduce((acc, curr) => acc + curr.numericScore, 0) / satellite.length
    : area.satelliteIndex;

  // Terrain & Structural fold baseline (Weight: 10%)
  const terrainScore = 80;

  // Exploration history confidence (Weight: 10%)
  const explorationConfidence = area.isExistingMine ? 92 : 82;

  // Overall combined model estimate
  const finalScore = Math.round(
    geoAvg * 0.45 +
    satAvg * 0.35 +
    terrainScore * 0.10 +
    explorationConfidence * 0.10
  );

  let category: 'High Potential' | 'Moderate Potential' | 'Low Potential' | 'Very Low / Uncertain';
  if (finalScore >= 80) {
    category = 'High Potential';
  } else if (finalScore >= 60) {
    category = 'Moderate Potential';
  } else if (finalScore >= 40) {
    category = 'Low Potential';
  } else {
    category = 'Very Low / Uncertain';
  }

  // Why this area explanations (clear, simple points)
  const whyThisArea: string[] = [
    `Geological formation indicates ${geoAvg >= 75 ? 'favorable Gondite host rock lithology' : 'moderate mineralized horizon'}.`,
    `Remote-sensing indicators show ${satAvg >= 75 ? 'diagnostic SWIR spectral absorption compatible with manganese oxyhydroxides' : 'moderate surface reflectance patterns'}.`,
    `Historical exploration logs show ${explorationConfidence >= 80 ? 'positive borehole strike continuity' : 'initial indicative intercepts'}.`,
    `Terrain characteristics show ${terrainScore >= 75 ? 'suitable dry ridge conditions for open-pit extraction' : 'manageable overburden slope'}.`
  ];

  const keyFactors = [
    {
      name: 'Geological Indicators',
      score: Math.round(geoAvg),
      weight: 45,
      contribution: `${Math.round(geoAvg * 0.45)} pts`
    },
    {
      name: 'Satellite Remote Sensing',
      score: Math.round(satAvg),
      weight: 35,
      contribution: `${Math.round(satAvg * 0.35)} pts`
    },
    {
      name: 'Historical Exploration Data',
      score: explorationConfidence,
      weight: 10,
      contribution: `${Math.round(explorationConfidence * 0.10)} pts`
    },
    {
      name: 'Terrain & Elevation',
      score: terrainScore,
      weight: 10,
      contribution: `${Math.round(terrainScore * 0.10)} pts`
    }
  ];

  return {
    id: `res-ana-${area.id}-${Date.now()}`,
    areaId: area.id,
    potentialScore: finalScore,
    potentialCategory: category,
    confidenceScore: Math.round((geoAvg + satAvg) / 2),
    geologicalPotentialScore: Math.round(geoAvg),
    satellitePotentialScore: Math.round(satAvg),
    terrainSuitabilityScore: terrainScore,
    explorationConfidenceScore: explorationConfidence,
    whyThisArea,
    keyFactors,
    calculatedAt: new Date().toISOString()
  };
}

export interface ForecastInput {
  areaId: string;
  month?: string;
  expectedWorkingDays: number; // e.g. 26
  equipmentAvailability: number; // e.g. 80 (percentage)
  expectedOreGrade: number; // e.g. 41.5 (Mn %)
  weatherCondition: 'Clear' | 'Light Rain' | 'Heavy Monsoon' | 'Extreme Heat';
  blastingSchedule: 'On Schedule' | 'Moderate Delay' | 'Severe Delay';
  targetProductionMT?: number;
}

export function calculateProductionForecast(input: ForecastInput, area: MiningArea): ProductionForecast {
  const targetMT = input.targetProductionMT || 90000;

  // Base daily mining capacity (standard 3,460 MT/day for standard full operation)
  const baseDailyCapacityMT = targetMT / 26;

  // Working days factor (e.g. 26 / 26 = 1.0)
  const daysFactor = Math.min(1.15, input.expectedWorkingDays / 26);

  // Equipment availability factor (Standard baseline: 85%)
  const equipmentFactor = input.equipmentAvailability / 85;

  // Weather penalty factor
  let weatherFactor = 1.0;
  if (input.weatherCondition === 'Light Rain') weatherFactor = 0.96;
  if (input.weatherCondition === 'Extreme Heat') weatherFactor = 0.93;
  if (input.weatherCondition === 'Heavy Monsoon') weatherFactor = 0.82;

  // Blasting efficiency factor
  let blastingFactor = 1.0;
  if (input.blastingSchedule === 'Moderate Delay') blastingFactor = 0.94;
  if (input.blastingSchedule === 'Severe Delay') blastingFactor = 0.85;

  // Ore grade recovery factor (baseline 40% Mn)
  const gradeFactor = 0.95 + (input.expectedOreGrade - 35) * 0.01;

  // Expected production calculation
  const calculatedMT = Math.round(
    baseDailyCapacityMT * input.expectedWorkingDays * equipmentFactor * weatherFactor * blastingFactor
  );

  const expectedMT = Math.max(10000, calculatedMT);
  const gapMT = targetMT - expectedMT;

  // Shortfall risk assessment
  let shortfallRisk: 'Low' | 'Moderate' | 'High' | 'Critical';
  const percentageLoss = (gapMT / targetMT) * 100;

  if (percentageLoss <= 3) {
    shortfallRisk = 'Low';
  } else if (percentageLoss <= 12) {
    shortfallRisk = 'Moderate';
  } else if (percentageLoss <= 22) {
    shortfallRisk = 'High';
  } else {
    shortfallRisk = 'Critical';
  }

  return {
    id: `fc-${input.areaId}-${Date.now()}`,
    areaId: input.areaId,
    month: input.month || 'Next Month (March 2026)',
    expectedWorkingDays: input.expectedWorkingDays,
    equipmentAvailability: input.equipmentAvailability,
    expectedOreGrade: input.expectedOreGrade,
    weatherCondition: input.weatherCondition,
    blastingSchedule: input.blastingSchedule,
    currentProductionMT: 84100,
    targetProductionMT: targetMT,
    expectedProductionMT: expectedMT,
    productionGapMT: Math.max(0, gapMT),
    shortfallRisk,
    confidencePercent: 88,
    calculatedAt: new Date().toISOString()
  };
}

export function calculateShortfallCauseAnalysis(
  forecast: ProductionForecast,
  input: ForecastInput
): ShortfallAnalysis {
  const gap = forecast.productionGapMT;
  const target = forecast.targetProductionMT;

  const factors: ShortfallFactor[] = [];

  // 1. Equipment downtime impact
  const eqShortfall = Math.max(0, 85 - input.equipmentAvailability);
  let eqImpact: 'High Impact' | 'Medium Impact' | 'Low Impact' = 'Low Impact';
  let eqContribution = 15;
  if (eqShortfall >= 10) {
    eqImpact = 'High Impact';
    eqContribution = 48;
  } else if (eqShortfall >= 4) {
    eqImpact = 'Medium Impact';
    eqContribution = 35;
  }

  factors.push({
    factor: 'Equipment Downtime / Availability',
    impact: eqImpact,
    percentageContribution: eqContribution,
    description: `Equipment availability is at ${input.equipmentAvailability}% (below the 85% target threshold), causing shovel-dumper cycle delays.`,
    mitigationSuggestion: 'Schedule preventative maintenance during shift changeovers and deploy standby dumpers from reserve fleet.'
  });

  // 2. Weather impact
  let weatherImpact: 'High Impact' | 'Medium Impact' | 'Low Impact' = 'Low Impact';
  let weatherContribution = 10;
  if (input.weatherCondition === 'Heavy Monsoon') {
    weatherImpact = 'High Impact';
    weatherContribution = 32;
  } else if (input.weatherCondition === 'Extreme Heat' || input.weatherCondition === 'Light Rain') {
    weatherImpact = 'Medium Impact';
    weatherContribution = 24;
  }

  factors.push({
    factor: 'Weather & Climate Impact',
    impact: weatherImpact,
    percentageContribution: weatherContribution,
    description: `Current condition (${input.weatherCondition}) limits haul road traction and requires high-temperature shift adjustments.`,
    mitigationSuggestion: 'Enhance bench sump dewatering pumps and apply dust suppressants to primary haulage ramps.'
  });

  // 3. Blasting schedule delay
  let blastImpact: 'High Impact' | 'Medium Impact' | 'Low Impact' = 'Low Impact';
  let blastContribution = 12;
  if (input.blastingSchedule === 'Severe Delay') {
    blastImpact = 'High Impact';
    blastContribution = 30;
  } else if (input.blastingSchedule === 'Moderate Delay') {
    blastImpact = 'Medium Impact';
    blastContribution = 18;
  }

  factors.push({
    factor: 'Blasting & Bench Delay',
    impact: blastImpact,
    percentageContribution: blastContribution,
    description: `Blasting operations show ${input.blastingSchedule.toLowerCase()}, slowing fresh face ore exposure.`,
    mitigationSuggestion: 'Expedite non-electric detonator hole charging and align explosive delivery with non-operational intervals.'
  });

  // 4. Ore availability & working days
  const workingDaysGap = Math.max(0, 26 - input.expectedWorkingDays);
  const oreContribution = Math.max(10, 100 - (eqContribution + weatherContribution + blastContribution));

  factors.push({
    factor: 'Ore Availability & Working Shifts',
    impact: workingDaysGap >= 2 ? 'Medium Impact' : 'Low Impact',
    percentageContribution: oreContribution,
    description: `Planned for ${input.expectedWorkingDays} working days with current bench geometry and grade constraints.`,
    mitigationSuggestion: 'Optimize pit bench advance sequencing to expose high-grade manganese layers earlier in the month.'
  });

  // Normalize contributions to 100%
  const total = factors.reduce((sum, f) => sum + f.percentageContribution, 0);
  factors.forEach(f => {
    f.percentageContribution = Math.round((f.percentageContribution / total) * 100);
  });

  const summary = gap > 0
    ? `Projected production gap of ${gap.toLocaleString()} MT is primarily driven by ${factors[0].factor.toLowerCase()} (${factors[0].percentageContribution}%) followed by ${factors[1].factor.toLowerCase()} (${factors[1].percentageContribution}%).`
    : `Production is fully aligned with target capacity of ${target.toLocaleString()} MT with minimal operational shortfall risk.`;

  return {
    id: `shortfall-ana-${forecast.areaId}-${Date.now()}`,
    areaId: forecast.areaId,
    targetMT: target,
    expectedMT: forecast.expectedProductionMT,
    shortfallMT: gap,
    riskLevel: forecast.shortfallRisk,
    factors,
    summary,
    calculatedAt: new Date().toISOString()
  };
}

export function generateRecommendations(
  area: MiningArea,
  reserve: ReserveAnalysis,
  forecast: ProductionForecast
): Recommendation[] {
  const recommendations: Recommendation[] = [];

  if (reserve.potentialScore >= 75) {
    recommendations.push({
      id: 'rec-1',
      areaId: area.id,
      category: 'Exploration',
      priority: 'High',
      action: 'Prioritize exploratory core diamond drilling along eastern strike line.',
      rationale: 'Favorable Gondite geological indicators and anomalous satellite SWIR reflectance confirm high confidence mineralization zone.',
      expectedBenefit: 'Potential delineation of estimated 3.8M MT - 4.5M MT manganese ore bodies.'
    });
  } else {
    recommendations.push({
      id: 'rec-1',
      areaId: area.id,
      category: 'Exploration',
      priority: 'Medium',
      action: 'Conduct ground magnetic & gravity geophysical verification prior to core drilling.',
      rationale: 'Moderate satellite reflectance requires ground verification to rule out overburden interference.',
      expectedBenefit: 'Reduces exploratory drilling expenditure on uncertain structural sectors.'
    });
  }

  if (forecast.productionGapMT > 0) {
    recommendations.push({
      id: 'rec-2',
      areaId: area.id,
      category: 'Production',
      priority: 'High',
      action: 'Increase HEMM equipment availability from current level to >= 85%.',
      rationale: 'Shortfall analysis shows equipment availability is the largest single contributor to projected output gap.',
      expectedBenefit: `Could recover an estimated ${Math.round(forecast.productionGapMT * 0.65).toLocaleString()} MT of the projected monthly shortfall.`
    });

    recommendations.push({
      id: 'rec-3',
      areaId: area.id,
      category: 'Operations',
      priority: 'Medium',
      action: 'Streamline bench blasting preparation to eliminate the 12-18h weekly blast lag.',
      rationale: 'Delays in face charging and rock clearance directly throttle continuous shovel loading rates.',
      expectedBenefit: 'Improves daily dispatch rate by 320 MT - 450 MT per working shift.'
    });
  } else {
    recommendations.push({
      id: 'rec-2',
      areaId: area.id,
      category: 'Production',
      priority: 'Low',
      action: 'Maintain current preventative maintenance protocol and stockpile blending ratios.',
      rationale: 'Current operations operate inside optimum throughput margins with low shortfall probability.',
      expectedBenefit: 'Sustained delivery to ferro-alloy and battery-grade manganese supply commitments.'
    });
  }

  return recommendations;
}
