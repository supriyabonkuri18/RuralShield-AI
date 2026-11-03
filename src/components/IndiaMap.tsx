import React, { useState, useMemo } from 'react';
import { PilotLocation } from '../types';
import { computeRiskState } from '../utils/riskCalculator';
import { MapPin, Droplets, Sun } from 'lucide-react';

interface IndiaMapProps {
  locations: PilotLocation[];
  selectedLocation: PilotLocation;
  onSelectLocation: (loc: PilotLocation) => void;
  floodScore: number;
  droughtScore: number;
}

export const IndiaMap: React.FC<IndiaMapProps> = ({
  locations,
  selectedLocation,
  onSelectLocation,
  floodScore,
  droughtScore,
}) => {
  const [hoveredLocation, setHoveredLocation] = useState<PilotLocation | null>(null);

  // Compute calculated baseline risk for each station using the pure risk calculator (no hardcoding)
  const baselineMap = useMemo(() => {
    const map: Record<string, { flood: number; drought: number }> = {};
    locations.forEach((l) => {
      const state = computeRiskState(l, 0);
      map[l.id] = { flood: state.floodScore, drought: state.droughtScore };
    });
    return map;
  }, [locations]);

  return (
    <div className="relative rounded-2xl border border-slate-800 bg-slate-900/80 p-5 shadow-sm backdrop-blur-sm flex flex-col h-full min-h-[460px]">
      {/* Header zone */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4 pb-3 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-semibold text-white">Monitoring Locations</h2>
            <span className="text-xs text-slate-500">·</span>
            <span className="text-xs text-slate-400 font-mono">Agro-Climatic Basins</span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Six vulnerable agricultural basins configured with synthetic illustrative data. Click any location to inspect.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 text-[11px]">
          <div className="flex items-center gap-1.5 text-slate-300">
            <span className="h-2.5 w-2.5 rounded-full bg-rose-500 inline-block"></span>
            <span>Critical Flood</span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-300">
            <span className="h-2.5 w-2.5 rounded-full bg-amber-500 inline-block"></span>
            <span>Drought Stress</span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-300">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 inline-block"></span>
            <span>Normal</span>
          </div>
        </div>
      </div>

      {/* SVG Map Canvas */}
      <div className="relative flex-1 w-full flex items-center justify-center overflow-hidden rounded-xl bg-slate-950/60 border border-slate-800/60 p-2">
        <svg
          viewBox="0 0 1000 1100"
          className="w-full h-full max-h-[520px] select-none"
          style={{ filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.5))' }}
        >
          <defs>
            <linearGradient id="indiaLand" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1e293b" />
              <stop offset="100%" stopColor="#0f172a" />
            </linearGradient>

            <pattern id="topoGrid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.02)" strokeWidth="1" />
            </pattern>
          </defs>

          {/* Background Grid */}
          <rect width="1000" height="1100" fill="url(#topoGrid)" />

          {/* India Geographic Outline Path */}
          <path
            d="M 330 80 
               C 360 85, 380 120, 390 145 
               C 420 150, 470 170, 480 200 
               C 500 230, 560 240, 580 250 
               C 620 255, 680 260, 710 270
               C 740 275, 780 260, 810 245
               C 850 250, 920 270, 940 310
               C 950 340, 930 380, 910 400
               C 880 430, 840 435, 830 420
               C 800 420, 780 390, 760 390
               C 740 410, 720 440, 730 480
               C 740 520, 700 550, 680 570
               C 650 600, 620 640, 600 680
               C 580 720, 540 780, 500 840
               C 470 890, 450 940, 430 980
               C 415 970, 395 910, 390 860
               C 385 810, 360 760, 350 710
               C 340 660, 330 610, 310 560
               C 290 530, 240 520, 210 500
               C 170 480, 150 450, 160 410
               C 180 370, 210 360, 230 340
               C 230 310, 250 270, 260 240
               C 270 200, 290 160, 310 120
               Z"
            fill="url(#indiaLand)"
            stroke="#334155"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />

          {/* Regional River Traces */}
          <path
            d="M 940 300 Q 890 320 850 345 T 780 375 T 725 460"
            fill="none"
            stroke="#38bdf8"
            strokeWidth="2.8"
            strokeDasharray="4 2"
            opacity="0.6"
          />
          <text x="830" y="335" fill="#38bdf8" fontSize="13" opacity="0.75" className="font-mono">
            Brahmaputra
          </text>

          <path
            d="M 380 220 Q 480 290 560 350 T 670 430 T 730 490"
            fill="none"
            stroke="#38bdf8"
            strokeWidth="2.5"
            strokeDasharray="3 2"
            opacity="0.55"
          />
          <text x="510" y="325" fill="#38bdf8" fontSize="13" opacity="0.7" className="font-mono">
            Ganga Basin
          </text>

          <path
            d="M 330 540 Q 440 580 520 620 T 610 650"
            fill="none"
            stroke="#38bdf8"
            strokeWidth="2"
            strokeDasharray="3 2"
            opacity="0.45"
          />
          <text x="440" y="570" fill="#38bdf8" fontSize="12" opacity="0.65" className="font-mono">
            Godavari
          </text>

          <path
            d="M 520 510 Q 580 535 630 555"
            fill="none"
            stroke="#38bdf8"
            strokeWidth="2"
            strokeDasharray="2 2"
            opacity="0.5"
          />

          <text x="140" y="700" fill="#475569" fontSize="14" letterSpacing="3" className="font-mono uppercase opacity-50">
            Arabian Sea
          </text>
          <text x="710" y="720" fill="#475569" fontSize="14" letterSpacing="3" className="font-mono uppercase opacity-50">
            Bay of Bengal
          </text>

          {/* Pilot Location Markers */}
          {locations.map((loc) => {
            const isSelected = loc.id === selectedLocation.id;
            const isHovered = hoveredLocation?.id === loc.id;
            
            const cx = (loc.svgMapPosition.x / 100) * 1000;
            const cy = (loc.svgMapPosition.y / 100) * 1100;

            const curFlood = isSelected ? floodScore : baselineMap[loc.id]?.flood || 0;
            const curDrought = isSelected ? droughtScore : baselineMap[loc.id]?.drought || 0;

            const isFlood = curFlood >= 75;
            const isDrought = curDrought >= 55;
            
            const markerColor = isFlood ? '#f43f5e' : isDrought ? '#f59e0b' : '#10b981';

            return (
              <g
                key={loc.id}
                onClick={() => onSelectLocation(loc)}
                onMouseEnter={() => setHoveredLocation(loc)}
                onMouseLeave={() => setHoveredLocation(null)}
                className="cursor-pointer transition-transform duration-200"
              >
                {/* Active Selection Ping */}
                {isSelected && (
                  <>
                    <circle
                      cx={cx}
                      cy={cy}
                      r="26"
                      fill={markerColor}
                      opacity="0.25"
                      className="animate-ping"
                      style={{ transformOrigin: `${cx}px ${cy}px` }}
                    />
                    <circle
                      cx={cx}
                      cy={cy}
                      r="18"
                      fill="none"
                      stroke={markerColor}
                      strokeWidth="2.5"
                      strokeDasharray="4 2"
                    />
                  </>
                )}

                {/* Outer Ring */}
                <circle
                  cx={cx}
                  cy={cy}
                  r={isSelected ? '12' : isHovered ? '11' : '9'}
                  fill="#0f172a"
                  stroke={markerColor}
                  strokeWidth={isSelected ? '3.5' : '2.5'}
                  className="transition-all duration-200"
                />

                {/* Inner Dot */}
                <circle
                  cx={cx}
                  cy={cy}
                  r={isSelected ? '5' : '4'}
                  fill={markerColor}
                />

                {/* Location Label on Map */}
                <g transform={`translate(${cx + 14}, ${cy + 4})`}>
                  <rect
                    x="-4"
                    y="-13"
                    width={loc.name.length * 8.2 + 8}
                    height="18"
                    rx="4"
                    fill="rgba(15, 23, 42, 0.9)"
                    stroke={isSelected ? markerColor : 'rgba(51, 65, 85, 0.8)'}
                    strokeWidth={isSelected ? '1.5' : '0.8'}
                  />
                  <text
                    x="2"
                    y="0"
                    fill={isSelected ? '#ffffff' : '#cbd5e1'}
                    fontSize="11.5"
                    fontWeight={isSelected ? '700' : '500'}
                    className="select-none tracking-tight font-sans"
                  >
                    {loc.name}
                  </text>
                </g>
              </g>
            );
          })}
        </svg>

        {/* Hover / Active Detail Overlay Card */}
        {(hoveredLocation || selectedLocation) && (
          <div className="absolute bottom-3 left-3 right-3 sm:left-auto sm:right-3 sm:max-w-xs rounded-xl border border-slate-700/80 bg-slate-900/95 p-3 shadow-xl backdrop-blur-md text-xs pointer-events-none">
            {(() => {
              const active = hoveredLocation || selectedLocation;
              const isSelected = active.id === selectedLocation.id;
              const displayFlood = isSelected ? floodScore : baselineMap[active.id]?.flood || 0;
              const displayDrought = isSelected ? droughtScore : baselineMap[active.id]?.drought || 0;

              return (
                <div>
                  <div className="flex items-center justify-between pb-1.5 border-b border-slate-800">
                    <div>
                      <div className="font-semibold text-white text-sm flex items-center gap-1.5">
                        <MapPin className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                        <span>{active.name}</span>
                      </div>
                      <div className="text-[11px] text-slate-400">
                        {active.district}, {active.state}
                      </div>
                    </div>
                    <span className="text-[10px] text-amber-400 font-mono bg-amber-950/60 px-1.5 py-0.5 rounded border border-amber-500/30">
                      Synthetic
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 mt-2 pt-1">
                    <div className="p-1.5 rounded bg-slate-800/60 border border-slate-700/50">
                      <div className="flex items-center gap-1 text-[11px] text-slate-400">
                        <Droplets className="h-3 w-3 text-sky-400" />
                        <span>Flood Index</span>
                      </div>
                      <div className="text-base font-bold tabular-nums text-white mt-0.5">
                        {displayFlood}
                        <span className="text-[10px] font-normal text-slate-400">/100</span>
                      </div>
                    </div>

                    <div className="p-1.5 rounded bg-slate-800/60 border border-slate-700/50">
                      <div className="flex items-center gap-1 text-[11px] text-slate-400">
                        <Sun className="h-3 w-3 text-amber-400" />
                        <span>Drought Stress</span>
                      </div>
                      <div className="text-base font-bold tabular-nums text-white mt-0.5">
                        {displayDrought}
                        <span className="text-[10px] font-normal text-slate-400">/100</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-2 text-[11px] text-slate-400 flex items-center justify-between">
                    <span>Basin: {active.basin.split(' ')[0]}</span>
                    <span>Elev: {active.elevationMeters}m</span>
                  </div>
                </div>
              );
            })()}
          </div>
        )}
      </div>

      {/* Footer Pilot Switcher Chips */}
      <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
        <span className="text-slate-400 shrink-0 text-[11px] font-medium mr-1">Select Location:</span>
        {locations.map((loc) => {
          const isSelected = loc.id === selectedLocation.id;
          return (
            <button
              key={loc.id}
              onClick={() => onSelectLocation(loc)}
              className={`whitespace-nowrap shrink-0 px-2.5 py-1 rounded-md text-xs font-medium transition-all cursor-pointer ${
                isSelected
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  : 'bg-slate-800/70 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-700/50'
              }`}
            >
              {loc.name.split(' ')[0]}
            </button>
          );
        })}
      </div>
    </div>
  );
};
