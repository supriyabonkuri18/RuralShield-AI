import { PilotLocation, DailyRainfallRecord } from '../types';

// Exact 30-day monitoring timeline leading up to demo date (Nov 02, 2026)
// Day 1 = Oct 04, Day 28 = Oct 31, Day 29 = Nov 01, Day 30 = Nov 02 (today)
export const DEMO_DATE_STRINGS = [
  'Oct 04', 'Oct 05', 'Oct 06', 'Oct 07', 'Oct 08', 'Oct 09', 'Oct 10', 'Oct 11', 'Oct 12', 'Oct 13',
  'Oct 14', 'Oct 15', 'Oct 16', 'Oct 17', 'Oct 18', 'Oct 19', 'Oct 20', 'Oct 21', 'Oct 22', 'Oct 23',
  'Oct 24', 'Oct 25', 'Oct 26', 'Oct 27', 'Oct 28', 'Oct 29', 'Oct 30', 'Oct 31', 'Nov 01', 'Nov 02'
];

function generateRainfallSeries(
  baseActual: number[],
  baseNormal: number[]
): DailyRainfallRecord[] {
  const records: DailyRainfallRecord[] = [];
  let cumActual = 0;
  let cumNormal = 0;

  for (let i = 0; i < 30; i++) {
    const dateStr = DEMO_DATE_STRINGS[i];
    const actual = baseActual[i] !== undefined ? Math.round(baseActual[i] * 10) / 10 : 0;
    const normal = baseNormal[i] !== undefined ? Math.round(baseNormal[i] * 10) / 10 : 2.0;

    cumActual += actual;
    cumNormal += normal;

    records.push({
      date: dateStr,
      actualMm: actual,
      normalMm: normal,
      accumulatedActual: Math.round(cumActual * 10) / 10,
      accumulatedNormal: Math.round(cumNormal * 10) / 10,
      temperatureMaxC: Math.round(27 + Math.cos(i / 4) * 4),
      humidityPercent: Math.min(98, Math.max(35, Math.round(65 + (actual > 10 ? 25 : -15) + Math.sin(i) * 5))),
    });
  }

  return records;
}

export const PILOT_LOCATIONS: PilotLocation[] = [
  {
    id: 'majuli-assam',
    name: 'Majuli Island',
    vernacularName: 'মাজুলী দ্বীপ',
    district: 'Majuli',
    state: 'Assam',
    agroZone: 'Eastern Himalayan Brahmaputra Alluvial Plain',
    basin: 'Brahmaputra River Basin',
    subCatchment: 'Subansiri-Kherkatia River Confluence',
    coordinates: { lat: 26.95, lng: 94.22 },
    svgMapPosition: { x: 88.5, y: 35.5 },
    elevationMeters: 84,
    populationAtRisk: '167,000 rural residents across 243 villages',
    dominantCrops: ['Bao Deepwater Paddy', 'Mustard', 'Black Gram', 'Sugarcane'],
    soilType: 'Recent Alluvium (Silt-Loam, High Inundation Sensitivity)',
    primaryRiskType: 'Flood Dominant',
    metrics: {
      soilSaturationPercent: 93.4, // Baseline SSI (%)
      catchmentRunoffIndex: 0.88,
      freeboardMarginMeters: 0.65, // Baseline freeboard (m)
      consecutiveRainlessDays: 0,
      standardizedPrecipitationIndex: 2.24,
      soilMoistureAnomalyPercent: 48.5,
      vegetationConditionIndex: 82,
      groundwaterDepthMeters: 1.2,
      reservoirStoragePercent: 98,
    },
    preparednessItems: [
      {
        id: 'maj-1',
        category: 'infrastructure',
        targetAudience: 'Gram Panchayat',
        title: 'Inspect Kamlabari-Garamur Dyke Embankment',
        action: 'Deploy village volunteer squads with sandbags and bamboo porcupines to reinforce scour spots on eastern embankment.',
        timeframe: 'Next 6-12 hours',
        priority: 'Immediate',
        applicableRisk: 'flood',
      },
      {
        id: 'maj-2',
        category: 'farming',
        targetAudience: 'Farmers',
        title: 'Elevate Post-Harvest Paddy & Seedlings',
        action: 'Shift harvested winter grain and seed sacks to elevated bamboo machans (chang-ghar) at least 1.5m above ground level.',
        timeframe: 'Immediate',
        priority: 'Immediate',
        applicableRisk: 'flood',
      },
      {
        id: 'maj-3',
        category: 'livestock',
        targetAudience: 'Households',
        title: 'Move Cattle to Elevated Community Highland (Chapori)',
        action: 'Relocate buffaloes and cattle to designated flood shelter highland; preserve dry paddy straw bundles in waterproof plastic wrap.',
        timeframe: 'Within 24 hours',
        priority: 'Precautionary',
        applicableRisk: 'flood',
      },
      {
        id: 'maj-4',
        category: 'health_sanitation',
        targetAudience: 'Self-Help Groups',
        title: 'Disinfect Community Handpumps & Water Storage',
        action: 'Cap vulnerable shallow borewells; distribute halogen/chlorine tablets and stock clean firewood for mandatory boiling of drinking water.',
        timeframe: 'Next 24-48 hours',
        priority: 'Precautionary',
        applicableRisk: 'flood',
      },
    ],
    // 30 days: Oct 04 to Nov 02. Last 3 days: [41.9, 52.0, 74.5] sum = 168.4. Last day = 74.5 (Peak downpour date: Nov 02).
    historicalDailyRainfall: generateRainfallSeries(
      [6.0, 4.0, 8.0, 5.0, 2.0, 10.0, 14.0, 18.0, 16.0, 8.0, 6.0, 4.0, 5.0, 8.0, 12.0, 18.0, 24.0, 32.0, 28.0, 22.0, 18.0, 16.0, 24.0, 36.0, 42.0, 40.0, 20.0, 41.9, 52.0, 74.5],
      [10.0, 10.0, 10.5, 10.5, 10.5, 10.5, 10.5, 10.5, 10.5, 10.5, 10.5, 10.5, 10.5, 10.5, 10.5, 10.5, 10.5, 10.5, 10.5, 10.5, 10.5, 10.5, 10.5, 10.5, 10.5, 10.5, 10.5, 12.5, 12.8, 12.9]
    ),
  },

  {
    id: 'latur-maharashtra',
    name: 'Latur (Marathwada)',
    vernacularName: 'लातूर (मराठवाडा)',
    district: 'Latur',
    state: 'Maharashtra',
    agroZone: 'Western Plateau Semi-Arid Rain Shadow',
    basin: 'Godavari Basin',
    subCatchment: 'Manjara River Upper Sub-basin',
    coordinates: { lat: 18.40, lng: 76.56 },
    svgMapPosition: { x: 42.0, y: 58.5 },
    elevationMeters: 631,
    populationAtRisk: '280,000 smallholders dependent on rainfed agriculture',
    dominantCrops: ['Soybean', 'Pigeon Pea (Tur)', 'Sugarcane', 'Jowar (Sorghum)'],
    soilType: 'Deep Black Cotton Soil (Vertisol, Shrink-Swell Cracking)',
    primaryRiskType: 'Drought Dominant',
    metrics: {
      soilSaturationPercent: 24.5,
      catchmentRunoffIndex: 0.15,
      freeboardMarginMeters: 4.8,
      consecutiveRainlessDays: 0,
      standardizedPrecipitationIndex: -0.85,
      soilMoistureAnomalyPercent: -42.0,
      vegetationConditionIndex: 32,
      groundwaterDepthMeters: 16.2,
      reservoirStoragePercent: 22,
    },
    preparednessItems: [
      {
        id: 'lat-1',
        category: 'farming',
        targetAudience: 'Farmers',
        title: 'Apply Biomass / Crop Residue Mulching',
        action: 'Cover standing soybean and pigeon pea furrows with sugarcane trash or crushed straw (5 tonnes/ha) to retard soil evaporation.',
        timeframe: 'Immediate',
        priority: 'Immediate',
        applicableRisk: 'drought',
      },
      {
        id: 'lat-2',
        category: 'infrastructure',
        targetAudience: 'Gram Panchayat',
        title: 'Enforce Groundwater Pumping Rationing',
        action: 'Regulate community borewell draw down; suspend open-furrow flooding of sugarcane; prioritize drinking water security reserves.',
        timeframe: 'Next 24 hours',
        priority: 'Immediate',
        applicableRisk: 'drought',
      },
      {
        id: 'lat-3',
        category: 'farming',
        targetAudience: 'Farmers',
        title: 'Foliar Spray of 2% Potassium Nitrate (KNO3)',
        action: 'Spray 2% KNO3 or 1% urea in early morning hours to mitigate moisture stress induced wilting in pulse crops.',
        timeframe: 'Within 48 hours',
        priority: 'Precautionary',
        applicableRisk: 'drought',
      },
      {
        id: 'lat-4',
        category: 'livestock',
        targetAudience: 'Households',
        title: 'Fodder Bank Mobilization & Silage Storage',
        action: 'Form village fodder cooperatives; allocate sorghum stalk reserves and prevent distress cattle sales by activating cattle camp plans.',
        timeframe: 'Next 3-5 days',
        priority: 'Medium Term',
        applicableRisk: 'drought',
      },
    ],
    // 30 days: Oct 04 to Nov 02. Synthetic demonstration baseline (not actual historical observation).
    // Last 3 days: [3.5, 5.0, 8.0] mm totaling synthetic 72h baseline of 16.5 mm. Last day = 8.0 mm.
    historicalDailyRainfall: generateRainfallSeries(
      [0.0, 0.0, 0.0, 0.0, 0.0, 1.2, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 3.5, 5.0, 8.0],
      [10.0, 9.0, 8.5, 8.0, 7.5, 7.0, 6.5, 6.0, 5.5, 5.0, 5.0, 5.0, 5.0, 5.0, 5.0, 5.0, 5.0, 5.0, 5.0, 5.0, 5.0, 5.0, 5.0, 5.0, 5.0, 5.0, 5.0, 5.5, 5.5, 5.5]
    ),
  },

  {
    id: 'mahoba-bundelkhand',
    name: 'Mahoba (Bundelkhand)',
    vernacularName: 'महोबा (बुंदेलखंड)',
    district: 'Mahoba',
    state: 'Uttar Pradesh',
    agroZone: 'Central Plateau & Hill Semi-Arid Zone',
    basin: 'Ganga Basin / Yamuna Sub-system',
    subCatchment: 'Betwa-Dhasan River Inter-basin Catchment',
    coordinates: { lat: 25.29, lng: 79.87 },
    svgMapPosition: { x: 48.0, y: 39.5 },
    elevationMeters: 214,
    populationAtRisk: '215,000 marginal farmers in rocky granite topography',
    dominantCrops: ['Gram (Chickpea)', 'Lentil (Masoor)', 'Mustard', 'Sesame'],
    soilType: 'Mixed Red and Black Soils (Rakar and Mar Soils, Low Retention)',
    primaryRiskType: 'Drought Dominant',
    metrics: {
      soilSaturationPercent: 24.5,
      catchmentRunoffIndex: 0.05,
      freeboardMarginMeters: 5.2,
      consecutiveRainlessDays: 26,
      standardizedPrecipitationIndex: -1.78,
      soilMoistureAnomalyPercent: -54.2,
      vegetationConditionIndex: 29,
      groundwaterDepthMeters: 14.2,
      reservoirStoragePercent: 22,
    },
    preparednessItems: [
      {
        id: 'mah-1',
        category: 'farming',
        targetAudience: 'Farmers',
        title: 'Adopt Broad-Bed Furrow (BBF) Cultivation',
        action: 'Form raised bed furrows before chickpea sowing to conserve residual dew and scarce winter rain in root zones.',
        timeframe: 'Next 48 hours',
        priority: 'Immediate',
        applicableRisk: 'drought',
      },
      {
        id: 'mah-2',
        category: 'infrastructure',
        targetAudience: 'Gram Panchayat',
        title: 'Desilt Village Khet Talab (Farm Ponds) & Inflow Drains',
        action: 'Clear silt from traditional Chandela tank inlet channels under MGNREGS; seal check dam seepages to retain runoff.',
        timeframe: 'Next 3-7 days',
        priority: 'Immediate',
        applicableRisk: 'drought',
      },
      {
        id: 'mah-3',
        category: 'farming',
        targetAudience: 'Farmers',
        title: 'Switch to Drought-Resistant Pulse Seed Varieties',
        action: 'Substitute moisture-sensitive crops with drought-hardy chickpea (JG-14, RVG-202) and short-duration mustard.',
        timeframe: 'Next 5 days',
        priority: 'Precautionary',
        applicableRisk: 'drought',
      },
      {
        id: 'mah-4',
        category: 'health_sanitation',
        targetAudience: 'Households',
        title: 'Safeguard Potable Drinking Water Points',
        action: 'Test fluoride and TDS levels in deep handpumps; cover open village dugwells to prevent contamination and rapid evaporative loss.',
        timeframe: 'Within 1 week',
        priority: 'Precautionary',
        applicableRisk: 'drought',
      },
    ],
    // 30 days: Oct 04 to Nov 02. Last 3 days: [1.1, 1.0, 0.0] sum = 2.1 mm. Peak day: Oct 07 (3.0 mm).
    historicalDailyRainfall: generateRainfallSeries(
      [0.0, 0.0, 0.0, 3.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 2.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 1.1, 1.0, 0.0],
      [6.0, 5.5, 5.5, 5.0, 5.0, 4.5, 4.5, 4.0, 4.0, 3.5, 3.5, 3.5, 3.5, 3.5, 3.5, 3.5, 3.5, 3.5, 3.5, 3.5, 3.5, 3.5, 3.5, 3.5, 3.5, 3.5, 3.5, 4.8, 5.0, 5.0]
    ),
  },

  {
    id: 'kuttanad-kerala',
    name: 'Kuttanad (Alappuzha)',
    vernacularName: 'കുട്ടനാട് (ആലപ്പുഴ)',
    district: 'Alappuzha',
    state: 'Kerala',
    agroZone: 'West Coast Below-Sea-Level Delta',
    basin: 'Pamba, Meenachil & Achankovil River Basin',
    subCatchment: 'Vembanad Wetland System',
    coordinates: { lat: 9.35, lng: 76.40 },
    svgMapPosition: { x: 39.0, y: 84.5 },
    elevationMeters: -1.5,
    populationAtRisk: '190,000 residents living in low-lying dyked polders (padasekharams)',
    dominantCrops: ['Kayal Paddy (Puncha Crop)', 'Coconut', 'Inland Fishery / Duckery'],
    soilType: 'Acid Saline Alluvial Kari / Kayal Soils (Peaty, Organic Clay)',
    primaryRiskType: 'Flood Dominant',
    metrics: {
      soilSaturationPercent: 96.0,
      catchmentRunoffIndex: 0.92,
      freeboardMarginMeters: 0.42,
      consecutiveRainlessDays: 0,
      standardizedPrecipitationIndex: 1.84,
      soilMoistureAnomalyPercent: 52.0,
      vegetationConditionIndex: 78,
      groundwaterDepthMeters: 0.2,
      reservoirStoragePercent: 94,
    },
    preparednessItems: [
      {
        id: 'kut-1',
        category: 'infrastructure',
        targetAudience: 'Gram Panchayat',
        title: 'Maintain 24/7 Dewatering Engine Pump Sets',
        action: 'Ensure uninterrupted fuel supply for high-capacity petti & para diesel pumps; clear water hyacinth clogging intake channels.',
        timeframe: 'Immediate',
        priority: 'Immediate',
        applicableRisk: 'flood',
      },
      {
        id: 'kut-2',
        category: 'farming',
        targetAudience: 'Farmers',
        title: 'Armour Outer Polder Bunds (Padasekhara Varamb)',
        action: 'Stack geo-textile bags and coconut leaf thatch along weakened outer bund corners exposed to boat wake and current wash.',
        timeframe: 'Next 12 hours',
        priority: 'Immediate',
        applicableRisk: 'flood',
      },
      {
        id: 'kut-3',
        category: 'health_sanitation',
        targetAudience: 'Households',
        title: 'Anchor Drinking Water Tanks & Disinfect Cisterns',
        action: 'Fasten plastic rainwater harvesting storage tanks to house pillars to prevent floating off; chlorinate boiling stores.',
        timeframe: 'Next 24 hours',
        priority: 'Precautionary',
        applicableRisk: 'flood',
      },
      {
        id: 'kut-4',
        category: 'livestock',
        targetAudience: 'Households',
        title: 'Secure Duck Pens and Aquaculture Net Cages',
        action: 'Install 1.5m perimeter overflow netting over fish ponds and tether duck floats to prevent escape during high backwater surges.',
        timeframe: 'Within 24 hours',
        priority: 'Precautionary',
        applicableRisk: 'flood',
      },
    ],
    // 30 days: Oct 04 to Nov 02. Last 3 days: [32.2, 36.0, 46.0] sum = 114.2 mm. Peak day: Nov 02 (46.0 mm).
    historicalDailyRainfall: generateRainfallSeries(
      [4.0, 6.0, 8.0, 2.0, 5.0, 10.0, 12.0, 14.0, 8.0, 16.0, 22.0, 28.0, 16.0, 8.0, 4.0, 6.0, 12.0, 18.0, 14.0, 10.0, 12.0, 24.0, 32.0, 38.0, 34.0, 26.0, 30.0, 32.2, 36.0, 46.0],
      [14.0, 12.0, 12.0, 10.0, 10.0, 9.0, 9.0, 8.0, 8.0, 8.0, 7.0, 7.0, 6.0, 6.0, 6.0, 5.0, 5.0, 5.0, 5.0, 4.0, 4.0, 4.0, 4.0, 3.0, 3.0, 3.0, 3.0, 17.0, 17.5, 17.5]
    ),
  },

  {
    id: 'kalahandi-odisha',
    name: 'Karlapat (Kalahandi)',
    vernacularName: 'କାର୍ଲାପାଟ (କଳାହାଣ୍ଡି)',
    district: 'Kalahandi',
    state: 'Odisha',
    agroZone: 'Eastern Ghat Highlands & Tel Basin',
    basin: 'Mahanadi Basin',
    subCatchment: 'Tel River & Hati Nullah Catchment',
    coordinates: { lat: 19.89, lng: 83.15 },
    svgMapPosition: { x: 57.5, y: 54.0 },
    elevationMeters: 270,
    populationAtRisk: '145,000 tribal and marginal farming families',
    dominantCrops: ['Upland Paddy', 'Cotton', 'Ragi (Finger Millet)', 'Arhar (Pigeon Pea)'],
    soilType: 'Red Loam and Sandy Clay (Lateritic, Low Organic Carbon)',
    primaryRiskType: 'Dual Vulnerability',
    metrics: {
      soilSaturationPercent: 42.0,
      catchmentRunoffIndex: 0.35,
      freeboardMarginMeters: 3.1,
      consecutiveRainlessDays: 14,
      standardizedPrecipitationIndex: -0.92,
      soilMoistureAnomalyPercent: -32.5,
      vegetationConditionIndex: 44,
      groundwaterDepthMeters: 9.8,
      reservoirStoragePercent: 48,
    },
    preparednessItems: [
      {
        id: 'kal-1',
        category: 'farming',
        targetAudience: 'Farmers',
        title: 'Provide Critical Supplementary Irrigation to Upland Rice',
        action: 'Pump residual water from farm ponds into alternate furrows to save paddy crop entering panicle initiation stage.',
        timeframe: 'Next 24-48 hours',
        priority: 'Immediate',
        applicableRisk: 'drought',
      },
      {
        id: 'kal-2',
        category: 'infrastructure',
        targetAudience: 'Gram Panchayat',
        title: 'Clear Forest Stream Intake Check Dams',
        action: 'Remove boulders and vegetative debris from hill stream diversion weirs (chuan/bandha) to capture upcoming hill showers.',
        timeframe: 'Next 3 days',
        priority: 'Precautionary',
        applicableRisk: 'both',
      },
      {
        id: 'kal-3',
        category: 'farming',
        targetAudience: 'Farmers',
        title: 'Stagger Ragi (Millets) Intercropping',
        action: 'Maintain finger millet and cowpea border crops as drought contingency insurance against potential late-season rain failure.',
        timeframe: 'Within 1 week',
        priority: 'Precautionary',
        applicableRisk: 'drought',
      },
      {
        id: 'kal-4',
        category: 'livestock',
        targetAudience: 'Households',
        title: 'Vaccinate Livestock against Hemorrhagic Septicemia',
        action: 'Mobilize animal husbandry camp for seasonal vaccination following erratic weather shifts between dry spells and sudden showers.',
        timeframe: 'Within 10 days',
        priority: 'Medium Term',
        applicableRisk: 'both',
      },
    ],
    // 30 days: Oct 04 to Nov 02. Last 3 days: [5.6, 7.0, 2.0] sum = 14.6 mm. Peak day: Oct 08 (34.0 mm).
    historicalDailyRainfall: generateRainfallSeries(
      [2.0, 0.0, 0.0, 18.0, 34.0, 12.0, 0.0, 0.0, 0.0, 4.0, 10.0, 0.0, 0.0, 0.0, 0.0, 0.0, 2.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 2.0, 4.0, 5.6, 7.0, 2.0],
      [8.0, 8.0, 8.0, 7.0, 7.0, 6.0, 6.0, 5.0, 5.0, 5.0, 4.0, 4.0, 4.0, 3.0, 3.0, 3.0, 2.0, 2.0, 2.0, 2.0, 2.0, 2.0, 2.0, 2.0, 2.0, 2.0, 2.0, 8.0, 8.1, 8.1]
    ),
  },

  {
    id: 'sundarbans-bengal',
    name: 'Gosaba (Sundarbans)',
    vernacularName: 'গোসাবা (সুন্দরবন)',
    district: 'South 24 Parganas',
    state: 'West Bengal',
    agroZone: 'Coastal Saline Gangetic Estuary',
    basin: 'Lower Gangetic Delta',
    subCatchment: 'Matla & Bidya Estuarine System',
    coordinates: { lat: 22.16, lng: 88.80 },
    svgMapPosition: { x: 73.0, y: 48.5 },
    elevationMeters: 3.5,
    populationAtRisk: '124,000 islanders protected by vulnerable mud dykes',
    dominantCrops: ['Saline-tolerant Aman Paddy (Dudheswar)', 'Betel Vine (Paan)', 'Brackish Tiger Prawn'],
    soilType: 'Heavy Saline Marine Silt Clay (High Electrical Conductivity EC)',
    primaryRiskType: 'Flood Dominant',
    metrics: {
      soilSaturationPercent: 95.8,
      catchmentRunoffIndex: 0.94,
      freeboardMarginMeters: 0.55,
      consecutiveRainlessDays: 0,
      standardizedPrecipitationIndex: 2.12,
      soilMoistureAnomalyPercent: 62.4,
      vegetationConditionIndex: 72,
      groundwaterDepthMeters: 0.8,
      reservoirStoragePercent: 96,
    },
    preparednessItems: [
      {
        id: 'sun-1',
        category: 'infrastructure',
        targetAudience: 'Gram Panchayat',
        title: 'Patrol Earthen Ring Bunds on Bidya Riverfront',
        action: 'Organize round-the-clock dyke vigil teams; plug crab holes and piping seepages with tarpaulins and mud packing.',
        timeframe: 'Immediate',
        priority: 'Immediate',
        applicableRisk: 'flood',
      },
      {
        id: 'sun-2',
        category: 'farming',
        targetAudience: 'Farmers',
        title: 'Raise Freshwater Pond Perimeters (Pukur Par)',
        action: 'Build 1-foot mud embankments around freshwater village tanks to prevent saline river water overflow that ruins drinking water and crops.',
        timeframe: 'Next 12 hours',
        priority: 'Immediate',
        applicableRisk: 'flood',
      },
      {
        id: 'sun-3',
        category: 'livestock',
        targetAudience: 'Households',
        title: 'Evacuate Livestock to Multi-Purpose Cyclone Shelter',
        action: 'Lead goats, cows, and poultry to first-floor ramps of nearest cyclone/flood shelter; pack dry hay bales in high lofts.',
        timeframe: 'Within 24 hours',
        priority: 'Precautionary',
        applicableRisk: 'flood',
      },
      {
        id: 'sun-4',
        category: 'health_sanitation',
        targetAudience: 'Self-Help Groups',
        title: 'Stage Bleaching Powder and ORS Sachets',
        action: 'Distribute oral rehydration salts and water-purifying drops; ensure pregnant women and elderly are registered for priority shelter transport.',
        timeframe: 'Next 24 hours',
        priority: 'Immediate',
        applicableRisk: 'flood',
      },
    ],
    // 30 days: Oct 04 to Nov 02. Last 3 days: [38.8, 45.0, 68.2] sum = 152.0 mm. Peak day: Nov 02 (68.2 mm).
    historicalDailyRainfall: generateRainfallSeries(
      [2.0, 4.0, 6.0, 10.0, 14.0, 8.0, 4.0, 2.0, 4.0, 8.0, 14.0, 18.0, 12.0, 8.0, 10.0, 22.0, 34.0, 28.0, 18.0, 24.0, 36.0, 42.0, 38.0, 28.0, 34.0, 46.0, 28.0, 38.8, 45.0, 68.2],
      [6.0, 6.0, 5.0, 5.0, 5.0, 4.0, 4.0, 4.0, 3.0, 3.0, 3.0, 3.0, 2.0, 2.0, 2.0, 2.0, 2.0, 2.0, 2.0, 2.0, 2.0, 2.0, 2.0, 2.0, 2.0, 2.0, 2.0, 14.5, 15.0, 15.0]
    ),
  },
];
