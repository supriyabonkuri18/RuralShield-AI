import React, { useState } from 'react';
import { CalculatedRiskState } from '../utils/riskCalculator';
import { PilotLocation } from '../types';
import {
  Waves,
  Sun,
  TrendingUp,
  TrendingDown,
  Minus,
  Activity,
  Calculator,
  ChevronDown,
  ChevronUp,
  Check,
  X,
} from 'lucide-react';

interface RiskIndicatorGaugesProps {
  riskState: CalculatedRiskState;
  location: PilotLocation;
}

export const RiskIndicatorGauges: React.FC<RiskIndicatorGaugesProps> = ({
  riskState,
  location,
}) => {
  const [showFloodCalc, setShowFloodCalc] = useState(true);
  const [showDroughtCalc, setShowDroughtCalc] = useState(true);

  const floodCircumference = 2 * Math.PI * 45;
  const floodDashOffset = floodCircumference - (riskState.floodScore / 100) * floodCircumference;

  const droughtCircumference = 2 * Math.PI * 45;
  const droughtDashOffset = droughtCircumference - (riskState.droughtScore / 100) * droughtCircumference;

  const getFloodColor = (score: number) => {
    if (score >= 75) return { stroke: '#f43f5e', text: 'text-rose-400', bg: 'bg-rose-500/10', border: 'border-rose-500/40' };
    if (score >= 55) return { stroke: '#fb923c', text: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/40' };
    if (score >= 35) return { stroke: '#facc15', text: 'text-amber-300', bg: 'bg-amber-500/10', border: 'border-amber-500/40' };
    return { stroke: '#10b981', text: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/40' };
  };

  const getDroughtColor = (score: number) => {
    if (score >= 75) return { stroke: '#f43f5e', text: 'text-rose-400', bg: 'bg-rose-500/10', border: 'border-rose-500/40' };
    if (score >= 55) return { stroke: '#f59e0b', text: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/40' };
    if (score >= 30) return { stroke: '#facc15', text: 'text-yellow-300', bg: 'bg-yellow-500/10', border: 'border-yellow-500/40' };
    return { stroke: '#10b981', text: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/40' };
  };

  const floodTheme = getFloodColor(riskState.floodScore);
  const droughtTheme = getDroughtColor(riskState.droughtScore);

  const fExp = riskState.floodCalculationExplanation;
  const dExp = riskState.droughtCalculationExplanation;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* 1. FLOOD RISK INDICATOR CARD */}
      <div className={`rounded-2xl border ${floodTheme.border} bg-slate-900/80 p-6 shadow-sm backdrop-blur-sm flex flex-col justify-between`}>
        <div>
          {/* Header */}
          <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-500/10 text-sky-400 border border-sky-500/20">
                <Waves className="h-5 w-5" />
              </div>
              <div>
                <div className="text-xs font-semibold uppercase tracking-wider text-sky-400 font-mono">
                  Indicator 01 · Hydro-Surge
                </div>
                <h3 className="text-lg font-bold text-white tracking-tight">Flood Early Warning Indicator</h3>
              </div>
            </div>

            <div className="text-right">
              <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${floodTheme.bg} ${floodTheme.text} border ${floodTheme.border}`}>
                {riskState.floodLevel} Alert
              </span>
              <div className="flex items-center justify-end gap-1 text-[11px] text-slate-400 mt-1">
                <span>Trend:</span>
                {riskState.floodTrend === 'rising' ? (
                  <span className="text-rose-400 flex items-center font-medium">
                    <TrendingUp className="h-3 w-3 mr-0.5" /> Rapid Rising
                  </span>
                ) : riskState.floodTrend === 'receding' ? (
                  <span className="text-emerald-400 flex items-center font-medium">
                    <TrendingDown className="h-3 w-3 mr-0.5" /> Receding
                  </span>
                ) : (
                  <span className="text-slate-400 flex items-center">
                    <Minus className="h-3 w-3 mr-0.5" /> Steady
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Gauge and Core Metrics */}
          <div className="py-5 flex flex-col sm:flex-row items-center justify-around gap-6">
            {/* Circular Gauge */}
            <div className="relative flex items-center justify-center">
              <svg className="h-36 w-36 -rotate-90 transform" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  className="stroke-slate-800"
                  strokeWidth="8"
                  fill="transparent"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  stroke={floodTheme.stroke}
                  strokeWidth="8"
                  strokeDasharray={floodCircumference}
                  strokeDashoffset={floodDashOffset}
                  strokeLinecap="round"
                  fill="transparent"
                  className="transition-all duration-500 ease-out"
                />
              </svg>

              <div className="absolute flex flex-col items-center justify-center text-center">
                <span className="text-3xl font-extrabold tabular-nums tracking-tight text-white font-mono">
                  {riskState.floodScore}
                </span>
                <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">
                  Index / 100
                </span>
              </div>
            </div>

            {/* Sub-parameters Telemetry Grid */}
            <div className="flex-1 w-full grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800">
                <span className="text-slate-400 block text-[11px]">72h Rain (Synthetic)</span>
                <span className="font-mono font-bold text-white text-sm tabular-nums">
                  {riskState.rainfall72h} mm
                </span>
                <span className="text-[10px] text-slate-500 block truncate">
                  Normal: {riskState.rainfallNormal72h} mm
                </span>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800">
                <span className="text-slate-400 block text-[11px]">Soil Saturation (SSI)</span>
                <span className={`font-mono font-bold text-sm tabular-nums ${riskState.soilSaturationPercent >= 85 ? 'text-rose-400' : 'text-slate-200'}`}>
                  {riskState.soilSaturationPercent}%
                </span>
                <span className="text-[10px] text-slate-500 block">
                  Critical: &ge;85.0%
                </span>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800">
                <span className="text-slate-400 block text-[11px]">Freeboard (Synthetic)</span>
                <span className={`font-mono font-bold text-sm tabular-nums ${riskState.freeboardMarginMeters <= 1.0 ? 'text-rose-400' : 'text-slate-200'}`}>
                  {riskState.freeboardMarginMeters} m
                </span>
                <span className="text-[10px] text-slate-500 block">
                  Breach Risk: &le;1.00 m
                </span>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800">
                <span className="text-slate-400 block text-[11px]">Catchment Runoff</span>
                <span className="font-mono font-bold text-white text-sm tabular-nums">
                  {location.metrics.catchmentRunoffIndex}
                </span>
                <span className="text-[10px] text-slate-500 block">
                  Slope proxy scale
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* How this score was calculated section */}
        <div className="mt-2 pt-3 border-t border-slate-800/80 bg-slate-950/60 p-3.5 rounded-xl text-xs">
          <div className="flex items-center justify-between mb-2">
            <button
              onClick={() => setShowFloodCalc(!showFloodCalc)}
              className="flex items-center gap-1.5 font-semibold text-sky-400 hover:text-sky-300 transition-colors cursor-pointer"
            >
              <Calculator className="h-3.5 w-3.5" />
              <span>How this score was calculated</span>
              {showFloodCalc ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
            </button>
            <span className="text-[10px] font-mono text-slate-400">
              Evaluated: {fExp.activeTier}
            </span>
          </div>

          {showFloodCalc && (
            <div className="space-y-2 pt-1 border-t border-slate-800/60 text-[11px]">
              <div className="text-slate-300 font-medium">
                Rule: <span className="text-white font-semibold">{fExp.ruleName}</span>
              </div>

              {/* Threshold Comparison Table */}
              <div className="space-y-1 bg-slate-900/80 p-2 rounded-lg border border-slate-800">
                {fExp.evaluatedInputs.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-400">{item.label}:</span>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-medium text-white">{item.value}</span>
                      <span className="text-slate-500 font-mono">(Threshold: {item.threshold})</span>
                      {item.met ? (
                        <span className="text-rose-400 flex items-center" title="Threshold Met">
                          <Check className="h-3 w-3" />
                        </span>
                      ) : (
                        <span className="text-slate-500 flex items-center" title="Not Met">
                          <Minus className="h-3 w-3" />
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap justify-between items-center text-[11px] pt-1 text-slate-400 gap-1">
                <span>Formula: <code className="font-mono text-slate-300">{fExp.formulaUsed}</code></span>
                <span className="font-bold font-mono text-white text-xs">
                  {fExp.isCapped ? (
                    <span className="text-rose-300">
                      Score: 100/100 <span className="text-slate-400 font-normal text-[10px]">(Uncapped: {fExp.uncappedScore}/100, capped at 100)</span>
                    </span>
                  ) : (
                    <span>Score: {riskState.floodScore}/100</span>
                  )}
                </span>
              </div>

              <p className="text-[10.5px] leading-relaxed text-slate-400 pt-0.5">
                {fExp.summaryText}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* 2. DROUGHT RISK INDICATOR CARD */}
      <div className={`rounded-2xl border ${droughtTheme.border} bg-slate-900/80 p-6 shadow-sm backdrop-blur-sm flex flex-col justify-between`}>
        <div>
          {/* Header */}
          <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                <Sun className="h-5 w-5" />
              </div>
              <div>
                <div className="text-xs font-semibold uppercase tracking-wider text-amber-400 font-mono">
                  Indicator 02 · Moisture Stress
                </div>
                <h3 className="text-lg font-bold text-white tracking-tight">Drought Stress Indicator</h3>
              </div>
            </div>

            <div className="text-right">
              <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${droughtTheme.bg} ${droughtTheme.text} border ${droughtTheme.border}`}>
                {riskState.droughtLevel}
              </span>
              <div className="flex items-center justify-end gap-1 text-[11px] text-slate-400 mt-1">
                <span>Trend:</span>
                {riskState.droughtTrend === 'intensifying' ? (
                  <span className="text-rose-400 flex items-center font-medium">
                    <TrendingUp className="h-3 w-3 mr-0.5" /> Deficit Deepening
                  </span>
                ) : riskState.droughtTrend === 'alleviating' ? (
                  <span className="text-emerald-400 flex items-center font-medium">
                    <TrendingDown className="h-3 w-3 mr-0.5" /> Recharging
                  </span>
                ) : (
                  <span className="text-slate-400 flex items-center">
                    <Minus className="h-3 w-3 mr-0.5" /> Constant
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Gauge and Core Metrics */}
          <div className="py-5 flex flex-col sm:flex-row items-center justify-around gap-6">
            {/* Circular Gauge */}
            <div className="relative flex items-center justify-center">
              <svg className="h-36 w-36 -rotate-90 transform" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  className="stroke-slate-800"
                  strokeWidth="8"
                  fill="transparent"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  stroke={droughtTheme.stroke}
                  strokeWidth="8"
                  strokeDasharray={droughtCircumference}
                  strokeDashoffset={droughtDashOffset}
                  strokeLinecap="round"
                  fill="transparent"
                  className="transition-all duration-500 ease-out"
                />
              </svg>

              <div className="absolute flex flex-col items-center justify-center text-center">
                <span className="text-3xl font-extrabold tabular-nums tracking-tight text-white font-mono">
                  {riskState.droughtScore}
                </span>
                <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">
                  Index / 100
                </span>
              </div>
            </div>

            {/* Sub-parameters Telemetry Grid */}
            <div className="flex-1 w-full grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800">
                <span className="text-slate-400 block text-[11px]">SPI-30 Index (Synthetic)</span>
                <span className={`font-mono font-bold text-sm tabular-nums ${riskState.spi30 <= -1.5 ? 'text-rose-400' : 'text-slate-200'}`}>
                  {riskState.spi30 > 0 ? `+${riskState.spi30}` : riskState.spi30}
                </span>
                <span className="text-[10px] text-slate-500 block">
                  Severe: &le; -1.50
                </span>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800">
                <span className="text-slate-400 block text-[11px]">Rainless Dry Days</span>
                <span className={`font-mono font-bold text-sm tabular-nums ${riskState.consecutiveRainlessDays >= 21 ? 'text-amber-400' : 'text-slate-200'}`}>
                  {riskState.consecutiveRainlessDays} days
                </span>
                <span className="text-[10px] text-slate-500 block">
                  Severe: &ge; 21 days
                </span>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800">
                <span className="text-slate-400 block text-[11px]">Vegetation Index (VCI)</span>
                <span className={`font-mono font-bold text-sm tabular-nums ${riskState.vegetationConditionIndex < 35 ? 'text-amber-400' : 'text-emerald-400'}`}>
                  {riskState.vegetationConditionIndex}%
                </span>
                <span className="text-[10px] text-slate-500 block">
                  Canopy moisture proxy
                </span>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800">
                <span className="text-slate-400 block text-[11px]">Water Table (Synthetic)</span>
                <span className="font-mono font-bold text-white text-sm tabular-nums">
                  {location.metrics.groundwaterDepthMeters} m
                </span>
                <span className="text-[10px] text-slate-500 block">
                  Below ground level
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* How this score was calculated section */}
        <div className="mt-2 pt-3 border-t border-slate-800/80 bg-slate-950/60 p-3.5 rounded-xl text-xs">
          <div className="flex items-center justify-between mb-2">
            <button
              onClick={() => setShowDroughtCalc(!showDroughtCalc)}
              className="flex items-center gap-1.5 font-semibold text-amber-400 hover:text-amber-300 transition-colors cursor-pointer"
            >
              <Calculator className="h-3.5 w-3.5" />
              <span>How this score was calculated</span>
              {showDroughtCalc ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
            </button>
            <span className="text-[10px] font-mono text-slate-400">
              Evaluated: {dExp.activeTier}
            </span>
          </div>

          {showDroughtCalc && (
            <div className="space-y-2 pt-1 border-t border-slate-800/60 text-[11px]">
              <div className="text-slate-300 font-medium">
                Rule: <span className="text-white font-semibold">{dExp.ruleName}</span>
              </div>

              {/* Threshold Comparison Table */}
              <div className="space-y-1 bg-slate-900/80 p-2 rounded-lg border border-slate-800">
                {dExp.evaluatedInputs.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-400">{item.label}:</span>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-medium text-white">{item.value}</span>
                      <span className="text-slate-500 font-mono">(Threshold: {item.threshold})</span>
                      {item.met ? (
                        <span className="text-rose-400 flex items-center" title="Threshold Met">
                          <Check className="h-3 w-3" />
                        </span>
                      ) : (
                        <span className="text-slate-500 flex items-center" title="Not Met">
                          <Minus className="h-3 w-3" />
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap justify-between items-center text-[11px] pt-1 text-slate-400 gap-1">
                <span>Formula: <code className="font-mono text-slate-300">{dExp.formulaUsed}</code></span>
                <span className="font-bold font-mono text-white text-xs">
                  {dExp.isCapped ? (
                    <span className="text-rose-300">
                      Score: 100/100 <span className="text-slate-400 font-normal text-[10px]">(Uncapped: {dExp.uncappedScore}/100, capped at 100)</span>
                    </span>
                  ) : (
                    <span>Score: {riskState.droughtScore}/100</span>
                  )}
                </span>
              </div>

              <p className="text-[10.5px] leading-relaxed text-slate-400 pt-0.5">
                {dExp.summaryText}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
