import React from 'react';
import { Sliders, RefreshCw, CloudRain, SunMedium, Waves, CloudLightning } from 'lucide-react';

interface ScenarioSimulatorProps {
  rainfallAnomaly: number; // e.g. -0.8 to 1.8
  onAnomalyChange: (val: number) => void;
  onReset: () => void;
}

export const ScenarioSimulator: React.FC<ScenarioSimulatorProps> = ({
  rainfallAnomaly,
  onAnomalyChange,
  onReset,
}) => {
  const percentage = Math.round(rainfallAnomaly * 100);

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 shadow-sm backdrop-blur-sm">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        {/* Title and context */}
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <Sliders className="h-4 w-4" />
          </div>
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span className="font-semibold text-slate-200 uppercase tracking-wider text-[11px]">
                Scenario Explorer
              </span>
              <span aria-hidden="true">·</span>
              <span className="text-emerald-400 font-mono">Hydro-Climatic Sensitivity</span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Simulate precipitation anomalies to evaluate flood crest warnings and drought stress alerts.
            </p>
          </div>
        </div>

        {/* Quick Presets */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => onAnomalyChange(0)}
            className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-all ${
              percentage === 0
                ? 'bg-slate-700 text-white border border-slate-600 shadow-sm'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 border border-slate-700/60'
            }`}
          >
            <SunMedium className="h-3.5 w-3.5 text-slate-400" />
            <span>Seasonal Baseline (0% Adjustment)</span>
          </button>

          <button
            onClick={() => onAnomalyChange(1.4)}
            className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-all ${
              percentage === 140
                ? 'bg-rose-950/80 text-rose-200 border border-rose-500/50 shadow-sm'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 border border-slate-700/60'
            }`}
          >
            <CloudLightning className="h-3.5 w-3.5 text-rose-400" />
            <span>Cloudburst (+140%)</span>
          </button>

          <button
            onClick={() => onAnomalyChange(-0.8)}
            className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-all ${
              percentage === -80
                ? 'bg-amber-950/80 text-amber-200 border border-amber-500/50 shadow-sm'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 border border-slate-700/60'
            }`}
          >
            <SunMedium className="h-3.5 w-3.5 text-amber-400" />
            <span>Severe Dry Spell (-80%)</span>
          </button>

          <button
            onClick={() => onAnomalyChange(0.4)}
            className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-all ${
              percentage === 40
                ? 'bg-sky-950/80 text-sky-200 border border-sky-500/50 shadow-sm'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 border border-slate-700/60'
            }`}
          >
            <CloudRain className="h-3.5 w-3.5 text-sky-400" />
            <span>Heavy Showers (+40%)</span>
          </button>

          {percentage !== 0 && (
            <button
              onClick={onReset}
              title="Reset to default baseline"
              className="flex items-center gap-1 text-slate-400 hover:text-white px-2 py-1 text-xs transition-colors"
            >
              <RefreshCw className="h-3 w-3" />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* Slider Control */}
      <div className="mt-4 pt-3 border-t border-slate-800/80 flex flex-col sm:flex-row sm:items-center gap-3">
        <div className="flex items-center justify-between sm:w-64 shrink-0 text-xs">
          <span className="text-slate-400">Scenario Adjustment:</span>
          <div className="text-right">
            <span
              className={`font-mono font-semibold tabular-nums text-xs ${
                percentage > 20
                  ? 'text-rose-400'
                  : percentage < -20
                  ? 'text-amber-400'
                  : 'text-emerald-400'
              }`}
            >
              {percentage > 0 ? `+${percentage}%` : percentage === 0 ? '0% (Baseline Normal)' : `${percentage}%`}
            </span>
            <span className="text-[10px] text-slate-500 block">
              {percentage === 0 ? 'Synthetic station baseline series' : 'Simulated rainfall modifier'}
            </span>
          </div>
        </div>

        <div className="flex-1 flex items-center gap-3">
          <span className="text-[11px] text-amber-400/80 shrink-0 font-medium">Dry (-80%)</span>
          <input
            type="range"
            min="-0.8"
            max="1.8"
            step="0.05"
            value={rainfallAnomaly}
            onChange={(e) => onAnomalyChange(parseFloat(e.target.value))}
            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
          />
          <span className="text-[11px] text-rose-400/80 shrink-0 font-medium">Deluge (+180%)</span>
        </div>
      </div>
    </div>
  );
};
