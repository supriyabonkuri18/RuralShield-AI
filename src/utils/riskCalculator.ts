import {
  PilotLocation,
  RiskLevel,
  DroughtLevel,
  DailyRainfallRecord,
  ScoreCalculationExplanation,
  DynamicAdvisory,
} from '../types';

export interface CalculatedRiskState {
  floodScore: number;
  floodLevel: RiskLevel;
  floodTrend: 'rising' | 'steady' | 'receding';
  floodCalculationExplanation: ScoreCalculationExplanation;

  droughtScore: number;
  droughtLevel: DroughtLevel;
  droughtTrend: 'intensifying' | 'steady' | 'alleviating';
  droughtCalculationExplanation: ScoreCalculationExplanation;

  // Windowed Rainfall derived directly from the adjusted 30-day series
  rainfall72h: number;
  rainfallNormal72h: number;
  rainfallAnomalyPercent: number;
  last24hRainfallMm: number;
  total30dActual: number;
  total30dNormal: number;
  total30dAnomalyPercent: number;

  // Real-time calculated physical parameters
  soilSaturationPercent: number; // SSI %
  freeboardMarginMeters: number; // meters
  consecutiveRainlessDays: number;
  spi30: number;
  vegetationConditionIndex: number;

  adjustedDailySeries: DailyRainfallRecord[];
  dynamicAdvisory: DynamicAdvisory;
}

export function computeRiskState(
  location: PilotLocation,
  anomalyFactor: number // -0.8 (-80%) to +1.8 (+180%), 0 = baseline
): CalculatedRiskState {
  const mult = Math.max(0, 1 + anomalyFactor);

  let cumActual = 0;
  let cumNormal = 0;

  // Scaled directly from synthetic baseline:
  // Baseline (mult = 1.0) -> baseline rainfall (e.g. 16.5 mm for Latur)
  // Cloudburst (+140%, mult = 2.4) -> baseline * 2.4 (e.g. 39.6 mm for Latur)
  // Severe Dry Spell (-80%, mult = 0.2) -> baseline * 0.2 (e.g. 3.3 mm for Latur)
  const adjustedDailySeries: DailyRainfallRecord[] = location.historicalDailyRainfall.map(
    (record) => {
      const adjustedActual = Math.round(record.actualMm * mult * 10) / 10;
      cumActual = Math.round((cumActual + adjustedActual) * 10) / 10;
      cumNormal = Math.round((cumNormal + record.normalMm) * 10) / 10;

      return {
        ...record,
        actualMm: adjustedActual,
        accumulatedActual: cumActual,
        accumulatedNormal: cumNormal,
      };
    }
  );

  // 2. Derive windowed metrics directly from the adjusted 30-day series (zero mismatch)
  const len = adjustedDailySeries.length; // 30 days
  const last24hRainfallMm = adjustedDailySeries[len - 1].actualMm;

  // Last 72 hours = Day 28 + Day 29 + Day 30
  const rainfall72h = Math.round(
    (adjustedDailySeries[len - 3].actualMm +
      adjustedDailySeries[len - 2].actualMm +
      adjustedDailySeries[len - 1].actualMm) * 10
  ) / 10;

  const rainfallNormal72h = Math.round(
    (adjustedDailySeries[len - 3].normalMm +
      adjustedDailySeries[len - 2].normalMm +
      adjustedDailySeries[len - 1].normalMm) * 10
  ) / 10;

  const rainfallAnomalyPercent = Math.round(
    ((rainfall72h - rainfallNormal72h) / Math.max(1, rainfallNormal72h)) * 100
  );

  const total30dActual = Math.round(
    adjustedDailySeries.reduce((sum, r) => sum + r.actualMm, 0) * 10
  ) / 10;

  const total30dNormal = Math.round(
    adjustedDailySeries.reduce((sum, r) => sum + r.normalMm, 0) * 10
  ) / 10;

  const total30dAnomalyPercent = Math.round(
    ((total30dActual - total30dNormal) / Math.max(1, total30dNormal)) * 100
  );

  // 3. Dynamic Soil Saturation Index (SSI %)
  const soilSaturationPercent = Math.min(
    99.4,
    Math.max(
      8.0,
      Math.round(
        (anomalyFactor >= 0
          ? location.metrics.soilSaturationPercent + anomalyFactor * 22
          : location.metrics.soilSaturationPercent + anomalyFactor * 16) * 10
      ) / 10
    )
  );

  // 4. Dynamic Freeboard Margin (meters)
  const freeboardMarginMeters = Math.max(
    0.12,
    Math.min(
      8.5,
      Math.round(
        (anomalyFactor >= 0
          ? location.metrics.freeboardMarginMeters - anomalyFactor * 0.75
          : location.metrics.freeboardMarginMeters + Math.abs(anomalyFactor) * 1.6) * 100
      ) / 100
    )
  );

  // 5. Consecutive Rainless Days (CDD)
  // Meteorological standard: standard rainless dry day is actual precipitation < 2.5 mm
  let consecutiveRainlessDays = 0;
  for (let i = len - 1; i >= 0; i--) {
    if (adjustedDailySeries[i].actualMm < 2.5) {
      consecutiveRainlessDays++;
    } else {
      break;
    }
  }

  // Maintain antecedent drought counter if station baseline already had a prolonged dry spell
  if (location.metrics.consecutiveRainlessDays > 20 && anomalyFactor <= 0) {
    consecutiveRainlessDays = Math.max(
      consecutiveRainlessDays,
      location.metrics.consecutiveRainlessDays + (anomalyFactor < 0 ? Math.round(Math.abs(anomalyFactor) * 14) : 0)
    );
  }
  if (anomalyFactor > 0.2) {
    consecutiveRainlessDays = 0;
  }

  // 6. SPI-30 and Vegetation Index
  const spi30 = Math.round(
    (anomalyFactor >= 0
      ? location.metrics.standardizedPrecipitationIndex + anomalyFactor * 1.4
      : location.metrics.standardizedPrecipitationIndex + anomalyFactor * 1.35) * 100
  ) / 100;

  const vegetationConditionIndex = Math.min(
    95,
    Math.max(10, Math.round(location.metrics.vegetationConditionIndex + anomalyFactor * 12))
  );

  // ==========================================
  // 7. PURE RULE-BASED FLOOD SCORE CALCULATION
  // Stated Thresholds:
  // - Critical: SSI >= 85% AND 72h Rain >= 100mm AND Freeboard <= 1.0m
  // - Watch: SSI >= 70% AND 72h Rain >= 60mm AND Freeboard <= 1.8m
  // - Advisory: SSI >= 50% AND 72h Rain >= 35mm
  // - Normal: Otherwise
  // ==========================================
  let floodScore: number;
  let floodLevel: RiskLevel;
  let floodExplanation: ScoreCalculationExplanation;

  const isCriticalFlood = soilSaturationPercent >= 85 && rainfall72h >= 100 && freeboardMarginMeters <= 1.0;
  const isWatchFlood = !isCriticalFlood && soilSaturationPercent >= 70 && rainfall72h >= 60 && freeboardMarginMeters <= 1.8;
  const isAdvisoryFlood = !isCriticalFlood && !isWatchFlood && soilSaturationPercent >= 50 && rainfall72h >= 35;

  if (isCriticalFlood) {
    floodLevel = 'Critical';
    const rawScore = Math.round(82 + (rainfall72h - 100) * 0.12 + (soilSaturationPercent - 85) * 0.40);
    const isCapped = rawScore > 100;
    floodScore = Math.min(100, Math.max(80, rawScore));

    floodExplanation = {
      activeTier: 'Critical Alert',
      ruleName: 'Critical Hydro-Surcharge Rule',
      evaluatedInputs: [
        { label: 'Soil Saturation (SSI)', value: `${soilSaturationPercent}%`, threshold: '≥ 85.0%', met: true },
        { label: '72-Hour Precipitation', value: `${rainfall72h} mm`, threshold: '≥ 100.0 mm', met: true },
        { label: 'River Dyke Freeboard', value: `${freeboardMarginMeters} m`, threshold: '≤ 1.00 m', met: true },
      ],
      formulaUsed: '82 + (Rain72h - 100) × 0.12 + (SSI - 85) × 0.40',
      summaryText: isCapped
        ? `All 3 critical conditions are satisfied (SSI ${soilSaturationPercent}%, 72h rain ${rainfall72h}mm, freeboard ${freeboardMarginMeters}m). Formula yields raw score of ${rawScore}/100, capped at maximum index 100/100. Model triggers Critical Flood Alert stage.`
        : `All 3 critical conditions are satisfied (SSI ${soilSaturationPercent}%, 72h rain ${rainfall72h}mm, freeboard ${freeboardMarginMeters}m). Model triggers Critical Flood Alert stage.`,
      uncappedScore: rawScore,
      isCapped: isCapped,
    };
  } else if (isWatchFlood) {
    floodLevel = 'Watch';
    const rawScore = Math.round(55 + (rainfall72h - 60) * 0.45 + (soilSaturationPercent - 70) * 0.30);
    floodScore = Math.min(79, Math.max(55, rawScore));
    floodExplanation = {
      activeTier: 'Watch Alert',
      ruleName: 'Catchment Saturation Watch Rule',
      evaluatedInputs: [
        { label: 'Soil Saturation (SSI)', value: `${soilSaturationPercent}%`, threshold: '≥ 70.0%', met: soilSaturationPercent >= 70 },
        { label: '72-Hour Precipitation', value: `${rainfall72h} mm`, threshold: '≥ 60.0 mm', met: rainfall72h >= 60 },
        { label: 'River Dyke Freeboard', value: `${freeboardMarginMeters} m`, threshold: '≤ 1.80 m', met: freeboardMarginMeters <= 1.8 },
      ],
      formulaUsed: '55 + (Rain72h - 60) × 0.45 + (SSI - 70) × 0.30',
      summaryText: `Meets elevated catchment watch criteria (SSI ${soilSaturationPercent}%, 72h rain ${rainfall72h}mm, freeboard ${freeboardMarginMeters}m). Model triggers Watch Alert stage.`,
      uncappedScore: rawScore,
      isCapped: false,
    };
  } else if (isAdvisoryFlood) {
    floodLevel = 'Advisory';
    const rawScore = Math.round(35 + (rainfall72h - 35) * 0.60 + (soilSaturationPercent - 50) * 0.25);
    floodScore = Math.min(54, Math.max(35, rawScore));
    floodExplanation = {
      activeTier: 'Advisory Alert',
      ruleName: 'Early Catchment Infiltration Advisory',
      evaluatedInputs: [
        { label: 'Soil Saturation (SSI)', value: `${soilSaturationPercent}%`, threshold: '≥ 50.0%', met: soilSaturationPercent >= 50 },
        { label: '72-Hour Precipitation', value: `${rainfall72h} mm`, threshold: '≥ 35.0 mm', met: rainfall72h >= 35 },
        { label: 'River Dyke Freeboard', value: `${freeboardMarginMeters} m`, threshold: 'Unconstrained', met: true },
      ],
      formulaUsed: '35 + (Rain72h - 35) × 0.60 + (SSI - 50) × 0.25',
      summaryText: `Sub-critical moisture accumulation (SSI ${soilSaturationPercent}%, 72h rain ${rainfall72h}mm). Model triggers Precautionary Advisory stage.`,
      uncappedScore: rawScore,
      isCapped: false,
    };
  } else {
    floodLevel = 'Normal';
    const rawScore = Math.round((rainfall72h / 35) * 22 + (soilSaturationPercent / 50) * 10);
    floodScore = Math.min(34, Math.max(2, rawScore));
    floodExplanation = {
      activeTier: 'Normal (Low Flood Hazard)',
      ruleName: 'Below Advisory Baseline Rule',
      evaluatedInputs: [
        { label: 'Soil Saturation (SSI)', value: `${soilSaturationPercent}%`, threshold: 'Target: < 50.0%', met: soilSaturationPercent < 50 },
        { label: '72-Hour Precipitation', value: `${rainfall72h} mm`, threshold: 'Target: < 35.0 mm', met: rainfall72h < 35 },
        { label: 'River Dyke Freeboard', value: `${freeboardMarginMeters} m`, threshold: 'Safe (> 1.8 m)', met: freeboardMarginMeters > 1.8 },
      ],
      formulaUsed: '(Rain72h / 35) × 22 + (SSI / 50) × 10',
      summaryText: `Current inputs are below watch and critical thresholds. Inundation risk remains in Normal category.`,
      uncappedScore: rawScore,
      isCapped: false,
    };
  }

  // ==========================================
  // 8. PURE RULE-BASED DROUGHT SCORE CALCULATION
  // Stated Thresholds:
  // - Severe Drought: SPI-30 <= -1.5 AND Consecutive Rainless Days >= 21
  // - Moderate Stress: SPI-30 <= -1.0 OR Consecutive Rainless Days >= 14
  // - Mild Deficit: SPI-30 <= -0.5 OR Consecutive Rainless Days >= 7
  // - No Stress: Otherwise
  // ==========================================
  let droughtScore: number;
  let droughtLevel: DroughtLevel;
  let droughtExplanation: ScoreCalculationExplanation;

  const isSevereDrought = spi30 <= -1.5 && consecutiveRainlessDays >= 21;
  const isModerateDrought = !isSevereDrought && (spi30 <= -1.0 || consecutiveRainlessDays >= 14);
  const isMildDrought = !isSevereDrought && !isModerateDrought && (spi30 <= -0.5 || consecutiveRainlessDays >= 7);

  if (isSevereDrought) {
    droughtLevel = 'Severe Drought';
    const rawScore = Math.round(80 + Math.abs(spi30 - -1.5) * 10 + (consecutiveRainlessDays - 21) * 0.50);
    const isCapped = rawScore > 100;
    droughtScore = Math.min(100, Math.max(80, rawScore));

    droughtExplanation = {
      activeTier: 'Severe Drought',
      ruleName: 'Severe Agricultural Drought Rule',
      evaluatedInputs: [
        { label: 'Standardized Precipitation (SPI-30)', value: `${spi30}`, threshold: '≤ -1.50', met: true },
        { label: 'Consecutive Rainless Days', value: `${consecutiveRainlessDays} days`, threshold: '≥ 21 days', met: true },
        { label: 'Soil Saturation (SSI)', value: `${soilSaturationPercent}%`, threshold: 'Depleted (<30%)', met: soilSaturationPercent < 30 },
      ],
      formulaUsed: '80 + |SPI - (-1.5)| × 10 + (DryDays - 21) × 0.50',
      summaryText: isCapped
        ? `Severe drought conditions satisfied (SPI-30 is ${spi30} and rainless streak is ${consecutiveRainlessDays} days). Formula yields raw score of ${rawScore}/100, capped at 100/100. Model triggers Severe Drought Alert stage.`
        : `Severe drought conditions satisfied (SPI-30 is ${spi30} and rainless streak is ${consecutiveRainlessDays} days). Model triggers Severe Drought Alert stage.`,
      uncappedScore: rawScore,
      isCapped: isCapped,
    };
  } else if (isModerateDrought) {
    droughtLevel = 'Moderate Stress';
    const rawScore = Math.round(55 + Math.abs(spi30 - -1.0) * 18 + Math.max(0, consecutiveRainlessDays - 14) * 0.70);
    droughtScore = Math.min(79, Math.max(55, rawScore));
    droughtExplanation = {
      activeTier: 'Moderate Stress',
      ruleName: 'Moderate Moisture Stress Rule',
      evaluatedInputs: [
        { label: 'Standardized Precipitation (SPI-30)', value: `${spi30}`, threshold: '≤ -1.00', met: spi30 <= -1.0 },
        { label: 'Consecutive Rainless Days', value: `${consecutiveRainlessDays} days`, threshold: '≥ 14 days', met: consecutiveRainlessDays >= 14 },
      ],
      formulaUsed: '55 + |SPI - (-1.0)| × 18 + max(0, DryDays - 14) × 0.70',
      summaryText: `Moisture deficit triggers moderate stress (SPI-30 is ${spi30} with ${consecutiveRainlessDays} dry days). Crops face vegetative moisture stress.`,
      uncappedScore: rawScore,
      isCapped: false,
    };
  } else if (isMildDrought) {
    droughtLevel = 'Mild Deficit';
    const rawScore = Math.round(30 + Math.abs(spi30 - -0.5) * 20 + Math.max(0, consecutiveRainlessDays - 7) * 1.50);
    droughtScore = Math.min(54, Math.max(30, rawScore));
    droughtExplanation = {
      activeTier: 'Mild Deficit',
      ruleName: 'Incipient Dry Spell Rule',
      evaluatedInputs: [
        { label: 'Standardized Precipitation (SPI-30)', value: `${spi30}`, threshold: '≤ -0.50', met: spi30 <= -0.5 },
        { label: 'Consecutive Rainless Days', value: `${consecutiveRainlessDays} days`, threshold: '≥ 7 days', met: consecutiveRainlessDays >= 7 },
      ],
      formulaUsed: '30 + |SPI - (-0.5)| × 20 + max(0, DryDays - 7) × 1.50',
      summaryText: `Sub-seasonal dry interval detected (${consecutiveRainlessDays} rainless days). Sub-soil moisture begins depleting.`,
      uncappedScore: rawScore,
      isCapped: false,
    };
  } else {
    droughtLevel = 'No Stress';
    const rawScore = Math.round(Math.max(2, 14 - spi30 * 10));
    droughtScore = Math.min(29, Math.max(2, rawScore));
    droughtExplanation = {
      activeTier: 'No Stress (Adequate Moisture)',
      ruleName: 'Moisture Equilibrium Rule',
      evaluatedInputs: [
        { label: 'Standardized Precipitation (SPI-30)', value: `${spi30}`, threshold: 'Target: > -0.50', met: spi30 > -0.5 },
        { label: 'Consecutive Rainless Days', value: `${consecutiveRainlessDays} days`, threshold: 'Target: < 7 days', met: consecutiveRainlessDays < 7 },
      ],
      formulaUsed: 'max(2, 14 - SPI × 10)',
      summaryText: `Sufficient precipitation frequency and soil moisture levels. No agricultural drought stress indicated.`,
      uncappedScore: rawScore,
      isCapped: false,
    };
  }

  // Trends
  const floodTrend: 'rising' | 'steady' | 'receding' =
    anomalyFactor > 0.1 ? 'rising' : anomalyFactor < -0.2 ? 'receding' : 'steady';

  const droughtTrend: 'intensifying' | 'steady' | 'alleviating' =
    anomalyFactor < -0.1 ? 'intensifying' : anomalyFactor > 0.2 ? 'alleviating' : 'steady';

  // ==========================================
  // 9. DYNAMIC ADVISORY HEADLINE RECALCULATION
  // Generates contextual headlines based on active alert status
  // ==========================================
  let dynamicAdvisory: DynamicAdvisory;

  if (floodLevel === 'Critical') {
    dynamicAdvisory = {
      dominantAlert: 'Critical Flood',
      englishHeadline: `${location.name}: Critical river stage & saturated soil (${soilSaturationPercent}%), freeboard margin compressed to ${freeboardMarginMeters}m (Illustrative Advisory)`,
      hindiHeadline: `${location.name}: तटबंध पर भारी जल दबाव, मिट्टी संतृप्ति ${soilSaturationPercent}% पर पहुंची (सांकेतिक परामर्श)`,
      keyInstruction: 'Relocate grain stores to raised platforms immediately; stage sandbag pallets and country boats along vulnerable dyke stretches.',
    };
  } else if (floodLevel === 'Watch') {
    dynamicAdvisory = {
      dominantAlert: 'Flood Watch',
      englishHeadline: `${location.name}: Elevated 72h precipitation (${rainfall72h}mm), river freeboard margin at ${freeboardMarginMeters}m (Illustrative Advisory)`,
      hindiHeadline: `${location.name}: 72 घंटे में ${rainfall72h}mm वर्षा, तटबंध व जल निकासी चैनलों की निरंतर निगरानी रखें (सांकेतिक परामर्श)`,
      keyInstruction: 'Clear community drainage culverts; move livestock to higher terrain before dusk.',
    };
  } else if (droughtLevel === 'Severe Drought') {
    dynamicAdvisory = {
      dominantAlert: 'Severe Drought',
      englishHeadline: `${location.name}: ${consecutiveRainlessDays} consecutive rainless days with acute sub-surface moisture deficit (SPI: ${spi30}) (Illustrative Advisory)`,
      hindiHeadline: `${location.name}: लगातार ${consecutiveRainlessDays} दिनों से वर्षा का अभाव, फसलों में तीव्र सूखा तनाव (सांकेतिक परामर्श)`,
      keyInstruction: 'Apply straw or crop residue mulching immediately across standing crops; restrict borewell pumping to night drip irrigation.',
    };
  } else if (droughtLevel === 'Moderate Stress') {
    dynamicAdvisory = {
      dominantAlert: 'Moderate Drought',
      englishHeadline: `${location.name}: Developing agricultural moisture deficit (${consecutiveRainlessDays} dry days, SPI: ${spi30}) (Illustrative Advisory)`,
      hindiHeadline: `${location.name}: मध्यम सूखा तनाव की स्थिति, जल संचयन संरचनाओं में पानी सहेजें (सांकेतिक परामर्श)`,
      keyInstruction: 'Schedule supplementary life-saving irrigation for flowering crops; desilt intake channels to village check dams.',
    };
  } else if (floodLevel === 'Advisory') {
    dynamicAdvisory = {
      dominantAlert: 'Precautionary Advisory',
      englishHeadline: `${location.name}: Moderate precipitation accumulation (${rainfall72h}mm / 72h), soil moisture adequate (Illustrative Advisory)`,
      hindiHeadline: `${location.name}: मध्यम वर्षा, खेत में जलनिकासी की सामान्य व्यवस्था बनाए रखें (सांकेतिक परामर्श)`,
      keyInstruction: 'Inspect farm bunds and drainage outlets to avoid localized temporary waterlogging in low-lying plots.',
    };
  } else {
    dynamicAdvisory = {
      dominantAlert: 'Normal Baseline',
      englishHeadline: `${location.name}: Stable hydro-climatological baseline (72h Rain: ${rainfall72h}mm, SPI: ${spi30}) (Illustrative Advisory)`,
      hindiHeadline: `${location.name}: सामान्य मौसमी स्थिति, कोई तात्कालिक बाढ़ या सूखा चेतावनी नहीं (सांकेतिक परामर्श)`,
      keyInstruction: 'Continue routine agricultural operations and maintain village farm ponds and rainwater harvesting recharge points.',
    };
  }

  return {
    floodScore,
    floodLevel,
    floodTrend,
    floodCalculationExplanation: floodExplanation,
    droughtScore,
    droughtLevel,
    droughtTrend,
    droughtCalculationExplanation: droughtExplanation,
    rainfall72h,
    rainfallNormal72h,
    rainfallAnomalyPercent,
    last24hRainfallMm,
    total30dActual,
    total30dNormal,
    total30dAnomalyPercent,
    soilSaturationPercent,
    freeboardMarginMeters,
    consecutiveRainlessDays,
    spi30,
    vegetationConditionIndex,
    adjustedDailySeries,
    dynamicAdvisory,
  };
}
