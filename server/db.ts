import bcrypt from 'bcryptjs';
import {
  User,
  MiningArea,
  GeologicalIndicator,
  SatelliteIndicator,
  ProductionRecord,
  EquipmentStatus,
  WeatherRecord,
  BlastingRecord,
  ReserveAnalysis,
  ProductionForecast,
  ShortfallAnalysis,
  Report,
  Recommendation
} from './types';

// In-memory persistent state for prototype with complete seed data
class Database {
  users: User[] = [];
  miningAreas: MiningArea[] = [];
  geologicalIndicators: GeologicalIndicator[] = [];
  satelliteIndicators: SatelliteIndicator[] = [];
  productionRecords: ProductionRecord[] = [];
  equipmentStatuses: EquipmentStatus[] = [];
  weatherRecords: WeatherRecord[] = [];
  blastingRecords: BlastingRecord[] = [];
  reserveAnalyses: ReserveAnalysis[] = [];
  productionForecasts: ProductionForecast[] = [];
  shortfallAnalyses: ShortfallAnalysis[] = [];
  reports: Report[] = [];

  constructor() {
    this.seed();
  }

  private seed() {
    // 1. Users
    const salt = bcrypt.genSaltSync(10);
    this.users = [
      {
        id: 'usr-1',
        name: 'Dr. Ramesh Sharma',
        email: 'ramesh.sharma@moil.nic.in',
        role: 'mining_engineer',
        createdAt: '2026-01-10T08:00:00Z',
      },
      {
        id: 'usr-2',
        name: 'Ananya Verma',
        email: 'ananya.verma@moil.nic.in',
        role: 'geologist',
        createdAt: '2026-01-12T09:30:00Z',
      },
      {
        id: 'usr-3',
        name: 'Vikram Singh',
        email: 'vikram.singh@moil.nic.in',
        role: 'production_manager',
        createdAt: '2026-02-01T10:00:00Z',
      }
    ];

    // 2. Mining Areas (Nagpur-Bhandara-Balaghat Manganese Belt)
    this.miningAreas = [
      {
        id: 'area-a',
        code: 'MN-BLK-A',
        name: 'Area A (Mansar East Extension)',
        state: 'Maharashtra',
        district: 'Nagpur',
        sizeSqKm: 14.8,
        latitude: 21.3986,
        longitude: 79.2741,
        activeStatus: 'exploration_target',
        isExistingMine: false,
        potentialCategory: 'High Potential',
        potentialScore: 84,
        estimatedReserveMT: 4200000,
        averageGradeMn: 41.5,
        description: 'Highly prospective manganese horizon characterized by Gondite rock formations, intense surface pyrolusite indicators, and anomalous SWIR satellite band reflectance.',
        formation: 'Sausar Group (Mansar Formation)',
        satelliteIndex: 86
      },
      {
        id: 'area-b',
        code: 'MN-BLK-B',
        name: 'Area B (Dongri Buzurg South)',
        state: 'Maharashtra',
        district: 'Bhandara',
        sizeSqKm: 22.4,
        latitude: 21.5452,
        longitude: 79.7042,
        activeStatus: 'active_mine',
        isExistingMine: true,
        potentialCategory: 'High Potential',
        potentialScore: 89,
        estimatedReserveMT: 6800000,
        averageGradeMn: 44.2,
        description: 'Premier operating opencast-to-underground manganese pit with high-grade dioxide ore bodies, strong geophysical anomaly continuations, and high mechanization.',
        formation: 'Sausar Group (Bichua Formation)',
        satelliteIndex: 88
      },
      {
        id: 'area-c',
        code: 'MN-BLK-C',
        name: 'Area C (Gumgaon Deep Horizon)',
        state: 'Maharashtra',
        district: 'Nagpur',
        sizeSqKm: 11.2,
        latitude: 21.3789,
        longitude: 79.0345,
        activeStatus: 'under_evaluation',
        isExistingMine: true,
        potentialCategory: 'Moderate Potential',
        potentialScore: 68,
        estimatedReserveMT: 2900000,
        averageGradeMn: 37.8,
        description: 'Underground manganese operation exploring deeper strike continuity with moderate surface expression masked by black cotton soil overburden.',
        formation: 'Sausar Group (Lohangi Formation)',
        satelliteIndex: 65
      },
      {
        id: 'area-d',
        code: 'MN-BLK-D',
        name: 'Area D (Kandri West Prospect)',
        state: 'Maharashtra',
        district: 'Nagpur',
        sizeSqKm: 8.5,
        latitude: 21.4190,
        longitude: 79.2612,
        activeStatus: 'exploration_target',
        isExistingMine: false,
        potentialCategory: 'Moderate Potential',
        potentialScore: 62,
        estimatedReserveMT: 1850000,
        averageGradeMn: 36.4,
        description: 'Greenfield exploration block adjacent to Kandri ridge; favorable structural fold axis with moderate remote-sensing signature.',
        formation: 'Sausar Group (Mansar Formation)',
        satelliteIndex: 61
      },
      {
        id: 'area-e',
        code: 'MN-BLK-E',
        name: 'Area E (Tirodi Outlier Sector)',
        state: 'Madhya Pradesh',
        district: 'Balaghat',
        sizeSqKm: 18.0,
        latitude: 21.6872,
        longitude: 79.7124,
        activeStatus: 'greenfield_potential',
        isExistingMine: false,
        potentialCategory: 'Low Potential',
        potentialScore: 42,
        estimatedReserveMT: 950000,
        averageGradeMn: 32.1,
        description: 'Remote peripheral block with scattered pegmatitic intrusions and lower manganese ore continuity; recommended for secondary survey prioritization.',
        formation: 'Tirodi Gneissic Complex',
        satelliteIndex: 44
      }
    ];

    // 3. Geological Indicators
    this.geologicalIndicators = [
      // Area A
      {
        id: 'geo-a-1',
        areaId: 'area-a',
        indicator: 'Geological Formation',
        value: 'Favorable (Mansar Mica-Schist / Gondite)',
        numericScore: 88,
        impact: 'High',
        status: 'Favorable',
        description: 'Classic Gonditic metasedimentary lithology hosting primary braunite and hollandite ore bands.',
        confidence: 90
      },
      {
        id: 'geo-a-2',
        areaId: 'area-a',
        indicator: 'Surface Mineral Indicators',
        value: 'High (Pyrolusite float & gossan)',
        numericScore: 85,
        impact: 'High',
        status: 'Favorable',
        description: 'Widespread manganese float ore on ridge crests with oxidized dark gossanous capping.',
        confidence: 88
      },
      {
        id: 'geo-a-3',
        areaId: 'area-a',
        indicator: 'Terrain & Elevation',
        value: 'Moderate (Gentle undulating ridges)',
        numericScore: 78,
        impact: 'Medium',
        status: 'Moderate',
        description: 'Elevated topography provides dry pit bench development with minimal monsoon water logging.',
        confidence: 85
      },
      {
        id: 'geo-a-4',
        areaId: 'area-a',
        indicator: 'Historical Core Boreholes',
        value: 'Positive (5 of 6 drill intersections)',
        numericScore: 86,
        impact: 'High',
        status: 'Favorable',
        description: 'Subsurface core logs reveal 3.2m to 5.4m thick ore body down to 140m depth.',
        confidence: 92
      },

      // Area B
      {
        id: 'geo-b-1',
        areaId: 'area-b',
        indicator: 'Geological Formation',
        value: 'Highly Favorable (Bichua Dolomite/Braunite)',
        numericScore: 94,
        impact: 'High',
        status: 'Favorable',
        description: 'Superb massive oxide mineralization with high dioxide battery-grade characteristics.',
        confidence: 95
      },
      {
        id: 'geo-b-2',
        areaId: 'area-b',
        indicator: 'Structural Fold Axis',
        value: 'Favorable (Synclinal keel zone)',
        numericScore: 89,
        impact: 'High',
        status: 'Favorable',
        description: 'Tight synclinal structure concentrates thickened manganese lens along plunge.',
        confidence: 91
      },

      // Area C
      {
        id: 'geo-c-1',
        areaId: 'area-c',
        indicator: 'Geological Formation',
        value: 'Moderate (Calc-silicate Lohangi marble)',
        numericScore: 70,
        impact: 'Medium',
        status: 'Moderate',
        description: 'Intercalated braunite in calcitic marble; requires magnetic separation beneficiation.',
        confidence: 76
      },
      {
        id: 'geo-c-2',
        areaId: 'area-c',
        indicator: 'Surface Overburden Thickness',
        value: 'High Overburden (14m - 22m alluvium)',
        numericScore: 58,
        impact: 'High',
        status: 'Moderate',
        description: 'Thick black soil cover limits open-cast stripping ratio; prefers shaft access.',
        confidence: 82
      },

      // Area D
      {
        id: 'geo-d-1',
        areaId: 'area-d',
        indicator: 'Geological Formation',
        value: 'Moderate (Quartzite-Mica Schist transition)',
        numericScore: 66,
        impact: 'Medium',
        status: 'Moderate',
        description: 'Discontinuous manganese lenses along quartzite contact zone.',
        confidence: 74
      },

      // Area E
      {
        id: 'geo-e-1',
        areaId: 'area-e',
        indicator: 'Geological Formation',
        value: 'Unfavorable (Granitoid / Pegmatite gneiss)',
        numericScore: 40,
        impact: 'High',
        status: 'Unfavorable',
        description: 'High degree of feldspathic intrusion and metamorphic remobilization.',
        confidence: 84
      }
    ];

    // 4. Satellite Indicators (Simulated Remote Sensing Datasets)
    this.satelliteIndicators = [
      // Area A
      {
        id: 'sat-a-1',
        areaId: 'area-a',
        indicator: 'Surface Reflectance & SWIR Index',
        value: 'High Compatible (SWIR Band 11/12 absorption)',
        sensorType: 'Sentinel-2 MSI (Simulated)',
        numericScore: 87,
        impact: 'High',
        status: 'Compatible',
        description: 'Diagnostic spectral absorption curve for manganese oxyhydroxides at 2.20 µm.',
        bandInfo: 'B11/B12 Band Ratio > 1.48',
        dateCaptured: '2026-02-18'
      },
      {
        id: 'sat-a-2',
        areaId: 'area-a',
        indicator: 'Vegetation Stress Anomaly (NDVI)',
        value: 'Anomalous (Stressed canopy zone)',
        sensorType: 'Landsat-8 OLI (Simulated)',
        numericScore: 83,
        impact: 'Medium',
        status: 'Compatible',
        description: 'Trace metal concentration in subsoil creates localized physiological chlorophyll reduction.',
        bandInfo: 'NDVI drop of 0.22 over ore strike',
        dateCaptured: '2026-02-14'
      },
      {
        id: 'sat-a-3',
        areaId: 'area-a',
        indicator: 'DEM Ridge Lineation & Fracture Density',
        value: 'Compatible (NW-SE fault lineament)',
        sensorType: 'ALOS PALSAR DEM (Simulated)',
        numericScore: 80,
        impact: 'High',
        status: 'Compatible',
        description: 'Steep break-in-slope correlates with regional manganese strike trend.',
        bandInfo: 'Lineament density: 2.4 km/km²',
        dateCaptured: '2026-01-30'
      },

      // Area B
      {
        id: 'sat-b-1',
        areaId: 'area-b',
        indicator: 'Thermal Infrared Emissivity (TIR)',
        value: 'High Thermal Inertia Signature',
        sensorType: 'ASTER TIR (Simulated)',
        numericScore: 91,
        impact: 'High',
        status: 'Compatible',
        description: 'Dense manganese-bearing strata retain distinct diurnal thermal signature compared to host country rock.',
        bandInfo: 'TIR Bands 10-14 thermal inertia anomaly',
        dateCaptured: '2026-02-22'
      },

      // Area C
      {
        id: 'sat-c-1',
        areaId: 'area-c',
        indicator: 'Land Cover & Overburden Reflectance',
        value: 'Partially Masked by Cropland Cover',
        sensorType: 'Sentinel-2 MSI (Simulated)',
        numericScore: 62,
        impact: 'Medium',
        status: 'Moderate',
        description: 'Agricultural land cover creates moderate spectral interference requiring multi-temporal winter imagery.',
        bandInfo: 'Agricultural crop interference index: 44%',
        dateCaptured: '2026-02-10'
      },

      // Area D
      {
        id: 'sat-d-1',
        areaId: 'area-d',
        indicator: 'Mineral Alteration Index',
        value: 'Moderate (Dispersed iron-manganese mix)',
        sensorType: 'Sentinel-2 MSI (Simulated)',
        numericScore: 64,
        impact: 'Medium',
        status: 'Moderate',
        description: 'Mixed hematite/pyrolusite signature with moderate confidence.',
        bandInfo: 'Iron/Mn oxide composite ratio: 1.15',
        dateCaptured: '2026-02-05'
      },

      // Area E
      {
        id: 'sat-e-1',
        areaId: 'area-e',
        indicator: 'SWIR Spectral Response',
        value: 'Inconclusive / Barren Quartz signature',
        sensorType: 'Sentinel-2 MSI (Simulated)',
        numericScore: 38,
        impact: 'High',
        status: 'Inconclusive',
        description: 'Dominant silica absorption; no characteristic manganese absorption peaks detected.',
        bandInfo: 'SWIR ratio < 0.95',
        dateCaptured: '2026-01-20'
      }
    ];

    // 5. Production Records (Monthly & Daily Historicals)
    const months = [
      { m: '2025-09', target: 88000, actual: 81200, uptime: 78, weather: 'Heavy Monsoon', delays: 38, days: 24 },
      { m: '2025-10', target: 90000, actual: 86400, uptime: 82, weather: 'Light Rain', delays: 19, days: 26 },
      { m: '2025-11', target: 90000, actual: 91500, uptime: 89, weather: 'Clear', delays: 8, days: 26 },
      { m: '2025-12', target: 92000, actual: 93200, uptime: 91, weather: 'Clear', delays: 6, days: 27 },
      { m: '2026-01', target: 92000, actual: 89800, uptime: 86, weather: 'Clear', delays: 14, days: 26 },
      { m: '2026-02', target: 90000, actual: 84100, uptime: 79, weather: 'Extreme Heat', delays: 22, days: 24 },
    ];

    months.forEach((item, idx) => {
      this.productionRecords.push({
        id: `prod-rec-a-${idx}`,
        areaId: 'area-a',
        date: `${item.m}-28`,
        month: item.m,
        targetMT: item.target,
        actualMT: item.actual,
        oreGradePercent: 41.2 + (idx % 3) * 0.4,
        equipmentUptimePercent: item.uptime,
        weatherCondition: item.weather as any,
        blastingDelaysHours: item.delays,
        workingDays: item.days,
        notes: `Regular monthly bench dispatch report for ${item.m}`
      });

      this.productionRecords.push({
        id: `prod-rec-b-${idx}`,
        areaId: 'area-b',
        date: `${item.m}-28`,
        month: item.m,
        targetMT: 110000,
        actualMT: 108500 + (idx % 2 === 0 ? 3000 : -2500),
        oreGradePercent: 44.5,
        equipmentUptimePercent: 88 + (idx % 4),
        weatherCondition: item.weather as any,
        blastingDelaysHours: Math.max(4, item.delays - 8),
        workingDays: item.days,
        notes: `Dongri Buzurg mechanized dispatch for ${item.m}`
      });
    });

    // 6. Equipment Statuses
    this.equipmentStatuses = [
      {
        id: 'eq-a-1',
        areaId: 'area-a',
        equipmentType: 'Hydraulic Excavator / Shovel (3.2 m³)',
        totalCount: 6,
        operationalCount: 4,
        underMaintenanceCount: 2,
        availabilityPercent: 66.7
      },
      {
        id: 'eq-a-2',
        areaId: 'area-a',
        equipmentType: 'Heavy Mining Dumpers (35T / 45T)',
        totalCount: 24,
        operationalCount: 19,
        underMaintenanceCount: 5,
        availabilityPercent: 79.2
      },
      {
        id: 'eq-a-3',
        areaId: 'area-a',
        equipmentType: 'Rotary Blast Hole Drill Rigs (150mm)',
        totalCount: 4,
        operationalCount: 3,
        underMaintenanceCount: 1,
        availabilityPercent: 75.0
      },
      {
        id: 'eq-a-4',
        areaId: 'area-a',
        equipmentType: 'Mobile Crushing & Screening Plant',
        totalCount: 2,
        operationalCount: 2,
        underMaintenanceCount: 0,
        availabilityPercent: 100.0
      }
    ];

    // 7. Weather Records
    this.weatherRecords = [
      {
        id: 'w-a-1',
        areaId: 'area-a',
        forecastDate: '2026-03-01',
        rainfallMm: 0,
        temperatureC: 34,
        condition: 'Clear Sky / High Insolation',
        impactLevel: 'Low'
      },
      {
        id: 'w-a-2',
        areaId: 'area-a',
        forecastDate: '2026-03-02',
        rainfallMm: 2,
        temperatureC: 36,
        condition: 'Warm / Light Dust Storm',
        impactLevel: 'Low'
      },
      {
        id: 'w-a-3',
        areaId: 'area-a',
        forecastDate: '2026-03-03',
        rainfallMm: 24,
        temperatureC: 28,
        condition: 'Thunderstorm / Wet Pit Benches',
        impactLevel: 'Medium'
      }
    ];

    // 8. Blasting Records
    this.blastingRecords = [
      {
        id: 'blast-a-1',
        areaId: 'area-a',
        blastDate: '2026-02-26',
        status: 'Completed',
        rockFragmentation: 'Optimal',
        delayHours: 1.5,
        plannedTonnageMT: 28000
      },
      {
        id: 'blast-a-2',
        areaId: 'area-a',
        blastDate: '2026-03-04',
        status: 'Planned',
        rockFragmentation: 'Optimal',
        delayHours: 0,
        plannedTonnageMT: 32000
      }
    ];
  }

  // Helper getters
  getAreas(): MiningArea[] {
    return this.miningAreas;
  }

  getAreaById(id: string): MiningArea | undefined {
    return this.miningAreas.find(a => a.id === id || a.code.toLowerCase() === id.toLowerCase());
  }

  getGeologyByArea(areaId: string): GeologicalIndicator[] {
    return this.geologicalIndicators.filter(g => g.areaId === areaId);
  }

  getSatelliteByArea(areaId: string): SatelliteIndicator[] {
    return this.satelliteIndicators.filter(s => s.areaId === areaId);
  }

  getProduction(areaId?: string, range: string = '6m'): ProductionRecord[] {
    let records = this.productionRecords;
    if (areaId) {
      records = records.filter(p => p.areaId === areaId);
    }
    return records.sort((a, b) => a.date.localeCompare(b.date));
  }

  getEquipment(areaId: string): EquipmentStatus[] {
    return this.equipmentStatuses.filter(e => e.areaId === areaId);
  }

  getWeather(areaId: string): WeatherRecord[] {
    return this.weatherRecords.filter(w => w.areaId === areaId);
  }

  getBlasting(areaId: string): BlastingRecord[] {
    return this.blastingRecords.filter(b => b.areaId === areaId);
  }

  saveReport(report: Report): Report {
    this.reports.unshift(report);
    return report;
  }

  getReports(): Report[] {
    return this.reports;
  }
}

export const db = new Database();
