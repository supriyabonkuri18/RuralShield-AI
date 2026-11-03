import React, { useMemo } from 'react';
import { PilotLocation } from '../types';
import { computeRiskState, CalculatedRiskState } from '../utils/riskCalculator';
import { GitCompare, CloudLightning, SunMedium, CloudSun, ArrowUpRight, ArrowDownRight, Minus, CheckCircle } from 'lucide-react';

interface ScenarioComparisonProps {
  selectedLocation: PilotLocation;
  currentAnomaly: number;
  onSelectScenarioAnomaly: (anomaly: number) => void;
}

interface ScenarioData {
  id: string;
  name: string;
  anomalyPercentText: string;
  anomalyFactor: number;
  icon: React.ReactNode;
  riskState: CalculatedRiskState;
  floodScoreDiff: number;
  droughtScoreDiff: number;
  description: string;
}

export const ScenarioComparison: React.FC<ScenarioComparisonProps> = ({
  selectedLocation,
  currentAnomaly,
  onSelectScenarioAnomaly,
}) => {
  // Compute comparison states using the exact same calculation engine and thresholds
  const comparisonData = useMemo(() => {
    // 1. Seasonal Baseline (anomaly = 0)
    const baselineState = computeRiskState(selectedLocation, 0);

    // 2. Cloudburst Scenario (+140% rain)
    const cloudburstState = computeRiskState(selectedLocation, 1.4);

    // 3. Severe Dry Spell (-80% rain)
    const drySpellState = computeRiskState(selectedLocation, -0.8);

    const scenarios: ScenarioData[] = [
      {
        id: 'baseline',
        name: 'Seasonal Baseline',
        anomalyPercentText: '0% Scenario Adjustment (Baseline Normal)',
        anomalyFactor: 0,
        icon: <CloudSun className="h-4 w-4 text-emerald-400" />,
        riskState: baselineState,
        floodScoreDiff: 0,
        droughtScoreDiff: 0,
        description: 'Unadjusted station baseline (0% scenario modifier). Reflects synthetic station baseline rainfall, not zero precipitation.',
      },
      {
        id: 'cloudburst',
        name: 'Cloudburst Shock',
        anomalyPercentText: '+140% Precipitation Surge',
        anomalyFactor: 1.4,
        icon: <CloudLightning className="h-4 w-4 text-rose-400" />,
        riskState: cloudburstState,
        floodScoreDiff: cloudburstState.floodScore - baselineState.floodScore,
        droughtScoreDiff: cloudburstState.droughtScore - baselineState.droughtScore,
        description: 'Simulates torrential cloudburst, high catchment runoff, and dyke surcharge under +140% precipitation shock.',
      },
      {
        id: 'dry_spell',
        name: 'Severe Dry Spell',
        anomalyPercentText: '-80% Precipitation Deficit',
        anomalyFactor: -0.8,
        icon: <SunMedium className="h-4 w-4 text-amber-400" />,
        riskState: drySpellState,
        floodScoreDiff: drySpellState.floodScore - baselineState.floodScore,
        droughtScoreDiff: drySpellState.droughtScore - baselineState.droughtScore,
        description: 'Simulates prolonged 24+ day monsoon break, soil desiccation, and acute moisture deficit under -80% anomaly.',
      },
    ];

    return { baselineState, scenarios };
  }, [selectedLocation]);

  const getFloodBadge = (level: string) => {
    switch (level) {
      case 'Critical':
        return 'bg-rose-500/15 text-rose-300 border-rose-500/40';
      case 'Watch':
        return 'bg-orange-500/15 text-orange-300 border-orange-500/40';
      case 'Advisory':
        return 'bg-yellow-500/15 text-yellow-300 border-yellow-500/40';
      default:
        return 'bg-emerald-500/15 text-emerald-300 border-emerald-500/40';
    }
  };

  const getDroughtBadge = (level: string) => {
    switch (level) {
      case 'Severe Drought':
        return 'bg-rose-500/15 text-rose-300 border-rose-500/40';
      case 'Moderate Stress':
        return 'bg-amber-500/15 text-amber-300 border-amber-500/40';
      case 'Mild Deficit':
        return 'bg-yellow-500/15 text-yellow-300 border-yellow-500/40';
      default:
        return 'bg-emerald-500/15 text-emerald-300 border-emerald-500/40';
    }
  };

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 shadow-sm backdrop-blur-sm">
      {/* Panel Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <GitCompare className="h-4 w-4" />
            </div>
            <h3 className="text-sm sm:text-base font-semibold text-white">
              Scenario Comparison
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Compare calculated hydro-climatic response for <span className="text-slate-200 font-medium">{selectedLocation.name}</span> across baseline, flood surge, and drought shock scenarios.
          </p>
        </div>

        <div className="text-[11px] font-mono text-amber-400/90 bg-amber-950/60 px-2 py-1 rounded border border-amber-500/30 self-start sm:self-auto shrink-0">
          Synthetic Illustrative Data
        </div>
      </div>

      {/* 3-Column Comparative Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
        {comparisonData.scenarios.map((scen) => {
          const isActive = Math.abs(currentAnomaly - scen.anomalyFactor) < 0.05;
          const { riskState } = scen;
          const fExp = riskState.floodCalculationExplanation;
          const dExp = riskState.droughtCalculationExplanation;

          return (
            <div
              key={scen.id}
              onClick={() => onSelectScenarioAnomaly(scen.anomalyFactor)}
              className={`rounded-xl border p-4 flex flex-col justify-between transition-all cursor-pointer relative ${
                isActive
                  ? 'bg-slate-950/90 border-emerald-500/60 ring-1 ring-emerald-500/40 shadow-lg'
                  : 'bg-slate-950/50 border-slate-800/80 hover:border-slate-700 hover:bg-slate-950/70'
              }`}
            >
              {/* Active Indicator Pin */}
              {isActive && (
                <div className="absolute top-2.5 right-2.5 flex items-center gap-1 text-[10px] font-mono font-medium text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
                  <CheckCircle className="h-3 w-3" />
                  <span>Active Scenario</span>
                </div>
              )}

              {/* Card Header */}
              <div>
                <div className="flex items-center gap-2 mb-1">
                  {scen.icon}
                  <h4 className="text-sm font-bold text-white tracking-tight">{scen.name}</h4>
                </div>
                <div className="text-xs font-mono text-slate-400">
                  {scen.anomalyPercentText}
                </div>
                <p className="text-[11px] text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                  {scen.description}
                </p>

                {/* Synthetic Inputs Summary Grid */}
                <div className="mt-3 pt-3 border-t border-slate-800/70 grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2 rounded bg-slate-900/80 border border-slate-800/60">
                    <span className="text-[10px] text-slate-400 block">72h Rainfall</span>
                    <span className="font-mono font-semibold text-white text-xs tabular-nums">
                      {riskState.rainfall72h} mm
                    </span>
                    <span className="text-[10px] text-slate-500 block truncate">
                      {scen.id === 'baseline' ? 'Synthetic Baseline' : `Norm: ${riskState.rainfallNormal72h} mm`}
                    </span>
                  </div>

                  <div className="p-2 rounded bg-slate-900/80 border border-slate-800/60">
                    <span className="text-[10px] text-slate-400 block">Soil Saturation</span>
                    <span className="font-mono font-semibold text-white text-xs tabular-nums">
                      {riskState.soilSaturationPercent}%
                    </span>
                    <span className="text-[10px] text-slate-500 block truncate">
                      Freeboard: {riskState.freeboardMarginMeters}m
                    </span>
                  </div>

                  <div className="p-2 rounded bg-slate-900/80 border border-slate-800/60">
                    <span className="text-[10px] text-slate-400 block">SPI-30 Index</span>
                    <span className="font-mono font-semibold text-white text-xs tabular-nums">
                      {riskState.spi30 > 0 ? `+${riskState.spi30}` : riskState.spi30}
                    </span>
                    <span className="text-[10px] text-slate-500 block truncate">
                      {riskState.spi30 <= -1.5 ? 'Severe (≤ -1.5)' : '30d fit proxy'}
                    </span>
                  </div>

                  <div className="p-2 rounded bg-slate-900/80 border border-slate-800/60">
                    <span className="text-[10px] text-slate-400 block">Dry Day Streak</span>
                    <span className="font-mono font-semibold text-white text-xs tabular-nums">
                      {riskState.consecutiveRainlessDays} days
                    </span>
                    <span className="text-[10px] text-slate-500 block truncate">
                      {riskState.consecutiveRainlessDays >= 21 ? 'Severe (≥ 21d)' : 'Rainless count'}
                    </span>
                  </div>
                </div>

                {/* Calculated Indicators & Differences */}
                <div className="mt-3 pt-3 border-t border-slate-800/70 space-y-2 text-xs">
                  {/* Flood Indicator Row */}
                  <div className="p-2 rounded-lg bg-slate-900/60 border border-slate-800/50">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-[10.5px] text-slate-400 block">Flood Risk:</span>
                        <div className="flex flex-wrap items-center gap-1.5 mt-0.5">
                          <span className={`inline-block px-2 py-0.5 rounded text-[10.5px] font-bold border ${getFloodBadge(riskState.floodLevel)}`}>
                            {riskState.floodLevel} ({riskState.floodScore}/100)
                          </span>
                          {fExp.isCapped && (
                            <span className="text-[10px] font-mono text-rose-300 bg-rose-950/70 px-1.5 py-0.2 rounded border border-rose-500/40">
                              Capped at 100 (Raw: {fExp.uncappedScore})
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="text-[10px] text-slate-500 block">vs Baseline</span>
                        {scen.id === 'baseline' ? (
                          <span className="text-[11px] font-mono text-slate-400 font-medium flex items-center justify-end">
                            <Minus className="h-3 w-3 mr-0.5" /> Reference
                          </span>
                        ) : scen.floodScoreDiff > 0 ? (
                          <span className="text-[11px] font-mono text-rose-400 font-bold flex items-center justify-end">
                            <ArrowUpRight className="h-3 w-3 mr-0.5" /> +{scen.floodScoreDiff} pts
                          </span>
                        ) : scen.floodScoreDiff < 0 ? (
                          <span className="text-[11px] font-mono text-emerald-400 font-bold flex items-center justify-end">
                            <ArrowDownRight className="h-3 w-3 mr-0.5" /> {scen.floodScoreDiff} pts
                          </span>
                        ) : (
                          <span className="text-[11px] font-mono text-slate-400 font-medium">0 pts</span>
                        )}
                      </div>
                    </div>

                    {/* Explanatory subtitle for Cloudburst or critical */}
                    {scen.id === 'cloudburst' && (
                      <div className="mt-1.5 pt-1.5 border-t border-slate-800/60 text-[10px] text-slate-400 font-mono">
                        Formula: {fExp.formulaUsed} = {fExp.uncappedScore} &rarr; capped at 100
                      </div>
                    )}
                  </div>

                  {/* Drought Indicator Row */}
                  <div className="p-2 rounded-lg bg-slate-900/60 border border-slate-800/50">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-[10.5px] text-slate-400 block">Drought Stress:</span>
                        <div className="flex flex-wrap items-center gap-1.5 mt-0.5">
                          <span className={`inline-block px-2 py-0.5 rounded text-[10.5px] font-bold border ${getDroughtBadge(riskState.droughtLevel)}`}>
                            {riskState.droughtLevel} ({riskState.droughtScore}/100)
                          </span>
                          {dExp.isCapped && (
                            <span className="text-[10px] font-mono text-rose-300 bg-rose-950/70 px-1.5 py-0.2 rounded border border-rose-500/40">
                              Capped at 100 (Raw: {dExp.uncappedScore})
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="text-[10px] text-slate-500 block">vs Baseline</span>
                        {scen.id === 'baseline' ? (
                          <span className="text-[11px] font-mono text-slate-400 font-medium flex items-center justify-end">
                            <Minus className="h-3 w-3 mr-0.5" /> Reference
                          </span>
                        ) : scen.droughtScoreDiff > 0 ? (
                          <span className="text-[11px] font-mono text-amber-400 font-bold flex items-center justify-end">
                            <ArrowUpRight className="h-3 w-3 mr-0.5" /> +{scen.droughtScoreDiff} pts
                          </span>
                        ) : scen.droughtScoreDiff < 0 ? (
                          <span className="text-[11px] font-mono text-sky-400 font-bold flex items-center justify-end">
                            <ArrowDownRight className="h-3 w-3 mr-0.5" /> {scen.droughtScoreDiff} pts
                          </span>
                        ) : (
                          <span className="text-[11px] font-mono text-slate-400 font-medium">0 pts</span>
                        )}
                      </div>
                    </div>

                    {/* Explanatory subtitle for Severe Dry Spell */}
                    {scen.id === 'dry_spell' && (
                      <div className="mt-1.5 pt-1.5 border-t border-slate-800/60 text-[10px] text-slate-400 font-mono">
                        {riskState.droughtLevel === 'Severe Drought'
                          ? `Trigger satisfied: SPI ${riskState.spi30} (≤-1.5) & Dry Days ${riskState.consecutiveRainlessDays} (≥21)`
                          : `Evaluated: ${riskState.droughtLevel} (${dExp.ruleName})`}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="mt-3 pt-2">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectScenarioAnomaly(scen.anomalyFactor);
                  }}
                  className={`w-full py-1.5 px-3 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-slate-800 text-slate-300 border border-slate-700'
                      : 'bg-emerald-600/80 hover:bg-emerald-600 text-white shadow-sm'
                  }`}
                >
                  {isActive ? 'Currently Active in Dashboard' : `Apply ${scen.name}`}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Disclaimers & Calculation Logic Footnote */}
      <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-[11px] text-slate-500">
        <span>Evaluation engine: All scenario indicators recalculate automatically via physical threshold rules.</span>
        <span className="font-mono text-amber-400/80">
          Synthetic illustrative data · Not official warnings or certified forecasts
        </span>
      </div>
    </div>
  );
};
