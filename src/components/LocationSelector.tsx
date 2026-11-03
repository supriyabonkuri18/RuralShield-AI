import React from 'react';
import { PilotLocation } from '../types';
import { MapPin, Mountain, Users, Sprout, Layers, Compass } from 'lucide-react';

interface LocationSelectorProps {
  locations: PilotLocation[];
  selectedLocation: PilotLocation;
  onSelectLocation: (loc: PilotLocation) => void;
}

export const LocationSelector: React.FC<LocationSelectorProps> = ({
  locations,
  selectedLocation,
  onSelectLocation,
}) => {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 shadow-sm backdrop-blur-sm">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase font-mono tracking-wider text-emerald-400">
              Regional Monitoring Station
            </span>
            <span className="text-xs text-slate-500">·</span>
            <span className="text-xs text-slate-400 font-mono">Illustrative Pilot Site</span>
          </div>
          <div className="flex items-baseline gap-3 mt-1">
            <h1 className="text-2xl font-bold tracking-tight text-white">
              {selectedLocation.name}
            </h1>
            <span className="text-sm font-medium text-slate-400">
              ({selectedLocation.vernacularName})
            </span>
          </div>
          <div className="text-xs text-slate-400 mt-1 flex flex-wrap items-center gap-x-2 gap-y-1">
            <span>{selectedLocation.district} District</span>
            <span aria-hidden="true">·</span>
            <span>{selectedLocation.state}</span>
            <span aria-hidden="true">·</span>
            <span>{selectedLocation.agroZone}</span>
          </div>
        </div>

        {/* Dropdown Selector */}
        <div className="shrink-0 w-full md:w-72">
          <label htmlFor="station-select" className="block text-xs font-medium text-slate-400 mb-1.5">
            Select Monitoring Location:
          </label>
          <div className="relative">
            <select
              id="station-select"
              value={selectedLocation.id}
              onChange={(e) => {
                const found = locations.find((l) => l.id === e.target.value);
                if (found) onSelectLocation(found);
              }}
              className="w-full appearance-none rounded-lg border border-slate-700 bg-slate-800 px-3.5 py-2.5 text-sm font-medium text-white shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer"
            >
              {locations.map((loc) => (
                <option key={loc.id} value={loc.id} className="bg-slate-900 text-white">
                  {loc.name} — {loc.state} ({loc.primaryRiskType})
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-400">
              <Compass className="h-4 w-4" />
            </div>
          </div>
        </div>
      </div>

      {/* Agro-ecological & Basin Metadata Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
        <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
          <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
            <Layers className="h-3.5 w-3.5 text-sky-400" />
            <span>River Catchment</span>
          </div>
          <div className="text-sm font-semibold text-white truncate" title={selectedLocation.basin}>
            {selectedLocation.basin}
          </div>
          <div className="text-[11px] text-slate-400 truncate mt-0.5" title={selectedLocation.subCatchment}>
            {selectedLocation.subCatchment}
          </div>
        </div>

        <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
          <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
            <Mountain className="h-3.5 w-3.5 text-indigo-400" />
            <span>Terrain & Elevation</span>
          </div>
          <div className="text-sm font-semibold text-white tabular-nums">
            {selectedLocation.elevationMeters} m ASL
          </div>
          <div className="text-[11px] text-slate-400 truncate mt-0.5" title={selectedLocation.soilType}>
            {selectedLocation.soilType.split('(')[0]}
          </div>
        </div>

        <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
          <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
            <Sprout className="h-3.5 w-3.5 text-emerald-400" />
            <span>Dominant Cropping</span>
          </div>
          <div className="text-sm font-semibold text-white truncate" title={selectedLocation.dominantCrops.join(', ')}>
            {selectedLocation.dominantCrops[0]}
          </div>
          <div className="text-[11px] text-slate-400 truncate mt-0.5">
            + {selectedLocation.dominantCrops.slice(1).join(', ')}
          </div>
        </div>

        <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
          <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
            <Users className="h-3.5 w-3.5 text-amber-400" />
            <span>Population at Risk</span>
          </div>
          <div className="text-sm font-semibold text-white truncate" title={selectedLocation.populationAtRisk}>
            {selectedLocation.populationAtRisk.split(' ')[0]}
          </div>
          <div className="text-[11px] text-slate-400 truncate mt-0.5">
            Marginal rural smallholders
          </div>
        </div>
      </div>
    </div>
  );
};
