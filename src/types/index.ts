export type RiskLevel = 'Normal' | 'Advisory' | 'Watch' | 'Critical';
export type DroughtLevel = 'No Stress' | 'Mild Deficit' | 'Moderate Stress' | 'Severe Drought';

export interface DailyRainfallRecord {
  date: string;
  actualMm: number;
  normalMm: number;
  accumulatedActual: number;
  accumulatedNormal: number;
  temperatureMaxC: number;
  humidityPercent: number;
}

export interface PreparednessItem {
  id: string;
  category: 'farming' | 'livestock' | 'infrastructure' | 'health_sanitation';
  targetAudience: 'Farmers' | 'Gram Panchayat' | 'Households' | 'Self-Help Groups';
  title: string;
  action: string;
  timeframe: string;
  priority: 'Immediate' | 'Precautionary' | 'Medium Term';
  applicableRisk: 'flood' | 'drought' | 'both';
}

export interface ScoreCalculationExplanation {
  activeTier: string;
  ruleName: string;
  evaluatedInputs: {
    label: string;
    value: string;
    threshold: string;
    met: boolean;
  }[];
  formulaUsed: string;
  summaryText: string;
  uncappedScore?: number;
  isCapped?: boolean;
}

export interface DynamicAdvisory {
  englishHeadline: string;
  hindiHeadline: string;
  keyInstruction: string;
  dominantAlert: string;
}

export interface PilotLocation {
  id: string;
  name: string;
  vernacularName: string;
  district: string;
  state: string;
  agroZone: string;
  basin: string;
  subCatchment: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  svgMapPosition: {
    x: number;
    y: number;
  };
  elevationMeters: number;
  populationAtRisk: string;
  dominantCrops: string[];
  soilType: string;
  primaryRiskType: 'Flood Dominant' | 'Drought Dominant' | 'Dual Vulnerability';
  
  // Baseline physical telemetry inputs (NOT hardcoded risk scores)
  metrics: {
    soilSaturationPercent: number; // Baseline SSI (%)
    catchmentRunoffIndex: number; // Slope factor (0-1)
    freeboardMarginMeters: number; // Baseline freeboard (m)
    consecutiveRainlessDays: number; // Baseline dry day counter
    standardizedPrecipitationIndex: number; // Baseline SPI-30
    soilMoistureAnomalyPercent: number; // Baseline SMA %
    vegetationConditionIndex: number; // Baseline VCI 0-100
    groundwaterDepthMeters: number; // Baseline water table depth
    reservoirStoragePercent: number; // Baseline reservoir storage %
  };
  
  historicalDailyRainfall: DailyRainfallRecord[];
  preparednessItems: PreparednessItem[];
}

export type ScenarioPreset = 'baseline' | 'cloudburst' | 'drought_spell' | 'moderate_monsoon';
