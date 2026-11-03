import React, { useState } from 'react';
import { DailyRainfallRecord } from '../types';
import { CloudRain, ArrowUpRight, ArrowDownRight, Info, Clock, Calendar } from 'lucide-react';

interface RainfallPanelProps {
  dailyRecords: DailyRainfallRecord[];
  locationName: string;
  rainfall72h: number;
  rainfallNormal72h: number;
  last24hRainfallMm: number;
}

export const RainfallPanel: React.FC<RainfallPanelProps> = ({
  dailyRecords,
  locationName,
  rainfall72h,
  rainfallNormal72h,
  last24hRainfallMm,
}) => {
  const [viewMode, setViewMode] = useState<'14d' | '30d' | 'cumulative'>('14d');
  const [hoveredDay, setHoveredDay] = useState<DailyRainfallRecord | null>(null);

  // Filter series based on mode
  const displayedRecords = viewMode === '14d' ? dailyRecords.slice(-14) : dailyRecords;

  // Aggregate 30-day metrics derived directly from the active series
  const totalActual = Math.round(dailyRecords.reduce((acc, r) => acc + r.actualMm, 0) * 10) / 10;
  const totalNormal = Math.round(dailyRecords.reduce((acc, r) => acc + r.normalMm, 0) * 10) / 10;
  const anomalyPercent = Math.round(((totalActual - totalNormal) / Math.max(1, totalNormal)) * 100);

  const peakDay = dailyRecords.reduce(
    (max, r) => (r.actualMm > max.actualMm ? r : max),
    dailyRecords[0] || { actualMm: 0, date: '-' }
  );

  const maxRainfallVal = Math.max(
    30,
    ...displayedRecords.map((r) => Math.max(r.actualMm, r.normalMm))
  );

  const maxCumVal = Math.max(
    100,
    ...dailyRecords.map((r) => Math.max(r.accumulatedActual, r.accumulatedNormal))
  );

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 shadow-sm backdrop-blur-sm">
      {/* Panel Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-sky-500/10 text-sky-400 border border-sky-500/20">
              <CloudRain className="h-4 w-4" />
            </div>
            <h3 className="text-base font-semibold text-white">
              Precipitation Trends & Historical Comparison
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Illustrative 30-day precipitation series (Oct 04 – Nov 02, 2026) vs synthetic baseline profile for {locationName}.
          </p>
        </div>

        {/* View Switcher Controls */}
        <div className="flex items-center gap-1 p-1 bg-slate-950/80 rounded-lg border border-slate-800 shrink-0 self-start sm:self-auto">
          <button
            onClick={() => setViewMode('14d')}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer ${
              viewMode === '14d'
                ? 'bg-slate-800 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Last 14 Days (Oct 20–Nov 02)
          </button>
          <button
            onClick={() => setViewMode('30d')}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer ${
              viewMode === '30d'
                ? 'bg-slate-800 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            30-Day Window (Oct 04–Nov 02)
          </button>
          <button
            onClick={() => setViewMode('cumulative')}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer ${
              viewMode === 'cumulative'
                ? 'bg-slate-800 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Cumulative Curve
          </button>
        </div>
      </div>

      {/* Explicit Windowed Metrics Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 my-5">
        {/* 30-Day Window */}
        <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-0.5">
            <span>30-Day Window</span>
            <span className="text-[10px] text-slate-500 font-mono">Oct 04–Nov 02</span>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-xl font-bold font-mono tabular-nums text-white">
              {totalActual} mm
            </span>
            <span className="text-xs text-slate-500 font-mono">
              / {totalNormal} normal
            </span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
            <span>Anomaly:</span>
            <span
              className={`font-semibold font-mono ${
                anomalyPercent > 15
                  ? 'text-sky-400'
                  : anomalyPercent < -15
                  ? 'text-amber-400'
                  : 'text-emerald-400'
              }`}
            >
              {anomalyPercent > 0 ? `+${anomalyPercent}%` : `${anomalyPercent}%`}
            </span>
          </div>
        </div>

        {/* 72-Hour Window */}
        <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-0.5">
            <span>72-Hour Window</span>
            <span className="text-[10px] text-slate-500 font-mono">Oct 31–Nov 02</span>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-xl font-bold font-mono tabular-nums text-white">
              {rainfall72h} mm
            </span>
            <span className="text-xs text-slate-500 font-mono">
              / {rainfallNormal72h} normal
            </span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Last 3 days sum matches indicator
          </div>
        </div>

        {/* Latest 24-Hour Window */}
        <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-0.5">
            <span>Latest 24-Hour</span>
            <span className="text-[10px] text-slate-500 font-mono">Nov 02 (Today)</span>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-xl font-bold font-mono tabular-nums text-white">
              {last24hRainfallMm} mm
            </span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Most recent daily observation
          </div>
        </div>

        {/* Peak 24h Downpour */}
        <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-0.5">
            <span>Peak 24h Downpour</span>
            <span className="text-[10px] text-emerald-400 font-mono">{peakDay.date}</span>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-xl font-bold font-mono tabular-nums text-white">
              {peakDay.actualMm} mm
            </span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1 truncate">
            Highest single-day in 30d timeline
          </div>
        </div>
      </div>

      {/* Interactive Chart Canvas */}
      {viewMode === 'cumulative' ? (
        <div className="relative pt-4 pb-2">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-3 px-1">
            <span>Cumulative Precipitation Mass Balance (Oct 04 – Nov 02, 2026)</span>
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5 text-sky-400">
                <span className="h-0.5 w-4 bg-sky-400 inline-block"></span>
                <span>Synthetic Observed (mm)</span>
              </span>
              <span className="flex items-center gap-1.5 text-slate-400">
                <span className="h-0.5 w-4 bg-slate-500 border-t border-dashed inline-block"></span>
                <span>Synthetic Normal Baseline</span>
              </span>
            </div>
          </div>

          <div className="relative h-64 w-full bg-slate-950/40 rounded-xl p-4 border border-slate-800/60 flex flex-col justify-end">
            <svg viewBox="0 0 800 240" className="w-full h-full overflow-visible">
              <defs>
                <linearGradient id="cumGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {[0, 0.25, 0.5, 0.75, 1].map((pct, idx) => {
                const y = 220 - pct * 190;
                const val = Math.round(pct * maxCumVal);
                return (
                  <g key={idx}>
                    <line x1="40" y1={y} x2="780" y2={y} stroke="#334155" strokeWidth="0.8" strokeDasharray="3 3" opacity="0.5" />
                    <text x="32" y={y + 4} fill="#64748b" fontSize="10" textAnchor="end" className="font-mono">
                      {val}
                    </text>
                  </g>
                );
              })}

              <polyline
                fill="none"
                stroke="#64748b"
                strokeWidth="2"
                strokeDasharray="4 3"
                points={dailyRecords
                  .map((r, i) => {
                    const x = 50 + (i / 29) * 720;
                    const y = 220 - (r.accumulatedNormal / maxCumVal) * 190;
                    return `${x},${y}`;
                  })
                  .join(' ')}
              />

              <polygon
                fill="url(#cumGradient)"
                points={`50,220 ${dailyRecords
                  .map((r, i) => {
                    const x = 50 + (i / 29) * 720;
                    const y = 220 - (r.accumulatedActual / maxCumVal) * 190;
                    return `${x},${y}`;
                  })
                  .join(' ')} ${50 + 720},220`}
              />

              <polyline
                fill="none"
                stroke="#38bdf8"
                strokeWidth="2.8"
                points={dailyRecords
                  .map((r, i) => {
                    const x = 50 + (i / 29) * 720;
                    const y = 220 - (r.accumulatedActual / maxCumVal) * 190;
                    return `${x},${y}`;
                  })
                  .join(' ')}
              />

              {dailyRecords.map((r, i) => {
                const x = 50 + (i / 29) * 720;
                const y = 220 - (r.accumulatedActual / maxCumVal) * 190;
                return (
                  <circle
                    key={i}
                    cx={x}
                    cy={y}
                    r={i % 5 === 0 ? '4' : '2'}
                    fill="#0f172a"
                    stroke="#38bdf8"
                    strokeWidth="2"
                  />
                );
              })}
            </svg>
          </div>
        </div>
      ) : (
        <div className="relative pt-3 pb-2">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-3 px-1">
            <span className="text-[11px] font-mono">Daily Rainfall (mm/day) — Synthetic Demonstration Series</span>
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5 text-sky-400">
                <span className="h-3 w-3 rounded-xs bg-sky-500 inline-block"></span>
                <span>Synthetic Observed (mm)</span>
              </span>
              <span className="flex items-center gap-1.5 text-slate-400">
                <span className="h-3 w-3 rounded-xs bg-slate-700 border border-slate-600 inline-block"></span>
                <span>Synthetic Baseline Normal</span>
              </span>
            </div>
          </div>

          <div className="relative h-64 w-full bg-slate-950/40 rounded-xl p-4 border border-slate-800/60 flex items-end justify-between gap-1 sm:gap-2">
            {displayedRecords.map((record, index) => {
              const actualHeightPct = (record.actualMm / maxRainfallVal) * 100;
              const normalHeightPct = (record.normalMm / maxRainfallVal) * 100;
              const isHovered = hoveredDay?.date === record.date;

              return (
                <div
                  key={index}
                  onMouseEnter={() => setHoveredDay(record)}
                  onMouseLeave={() => setHoveredDay(null)}
                  className="flex-1 h-full flex flex-col justify-end items-center group cursor-pointer relative"
                >
                  {isHovered && (
                    <div className="absolute bottom-full mb-3 z-30 rounded-lg border border-slate-700 bg-slate-900/95 p-2.5 shadow-xl backdrop-blur-md text-xs w-48 pointer-events-none">
                      <div className="font-semibold text-white border-b border-slate-800 pb-1 mb-1.5 flex items-center justify-between">
                        <span>{record.date}, 2026</span>
                        <span className="text-[10px] text-amber-400 font-mono">Synthetic</span>
                      </div>
                      <div className="space-y-1 text-[11px]">
                        <div className="flex justify-between">
                          <span className="text-slate-400">Observed:</span>
                          <span className="font-mono font-bold text-sky-400">{record.actualMm} mm</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Normal Baseline:</span>
                          <span className="font-mono text-slate-300">{record.normalMm} mm</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Difference:</span>
                          <span className={`font-mono font-bold ${record.actualMm >= record.normalMm ? 'text-emerald-400' : 'text-amber-400'}`}>
                            {record.actualMm - record.normalMm > 0 ? `+` : ''}
                            {Math.round((record.actualMm - record.normalMm) * 10) / 10} mm
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="w-full flex items-end justify-center gap-0.5 sm:gap-1 h-[82%] relative">
                    <div
                      style={{ height: `${Math.max(4, normalHeightPct)}%` }}
                      className="w-1/2 rounded-t-xs bg-slate-700/60 border border-slate-600/40 transition-all duration-300 group-hover:bg-slate-600"
                    />

                    <div
                      style={{ height: `${Math.max(4, actualHeightPct)}%` }}
                      className={`w-1/2 rounded-t-xs transition-all duration-300 ${
                        record.actualMm > record.normalMm * 1.5
                          ? 'bg-rose-500 shadow-sm shadow-rose-500/20'
                          : record.actualMm > 0
                          ? 'bg-sky-500 shadow-sm shadow-sky-500/20'
                          : 'bg-slate-800/40'
                      } ${isHovered ? 'brightness-125' : ''}`}
                    />
                  </div>

                  <div className="text-[10px] text-slate-400 font-mono mt-2 truncate w-full text-center">
                    {record.date.split(' ')[1]}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Dataset & Methodology Legend Footnote */}
      <div className="mt-4 pt-3 border-t border-slate-800/80 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs text-slate-500">
        <div className="flex items-center gap-1.5">
          <Info className="h-3.5 w-3.5 text-slate-400" />
          <span>Timeline bounds: Oct 04 – Nov 02, 2026. Synthetic illustrative model series.</span>
        </div>
        <div className="font-mono text-[11px] text-amber-400/80">
          Synthetic illustrative data · Not live official gauge observations
        </div>
      </div>
    </div>
  );
};
