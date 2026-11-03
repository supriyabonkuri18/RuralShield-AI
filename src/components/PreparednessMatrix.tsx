import React, { useState } from 'react';
import { PilotLocation } from '../types';
import { CalculatedRiskState } from '../utils/riskCalculator';
import {
  LifeBuoy,
  Volume2,
  VolumeX,
  CheckCircle2,
  Clock,
  Filter,
  AlertTriangle,
  CloudRain,
  Sun,
  ShieldCheck,
  FileText,
} from 'lucide-react';

interface PreparednessMatrixProps {
  location: PilotLocation;
  riskState: CalculatedRiskState;
  onOpenExport: () => void;
}

interface GuidanceAction {
  id: string;
  title: string;
  action: string;
  targetAudience: string;
  timeframe: string;
  priority: string;
}

const DEFAULT_FLOOD_ITEMS: GuidanceAction[] = [
  {
    id: 'gen-fl-1',
    targetAudience: 'Gram Panchayat',
    title: 'Inspect Stream Bunds & Culverts',
    action: 'Mobilize volunteer squads to inspect low-lying field bunds, clear drainage obstructions, and stage sandbags.',
    timeframe: 'Next 12 hours',
    priority: 'Immediate',
  },
  {
    id: 'gen-fl-2',
    targetAudience: 'Farmers',
    title: 'Elevate Harvested Grain & Seedlings',
    action: 'Store harvested grain and seed sacks on raised wooden or bamboo platforms at least 1.5m above ground level.',
    timeframe: 'Immediate',
    priority: 'Immediate',
  },
  {
    id: 'gen-fl-3',
    targetAudience: 'Households',
    title: 'Move Livestock to Higher Ground',
    action: 'Untether cattle and relocate animals to higher community terrain with dry fodder and clean drinking water.',
    timeframe: 'Within 24 hours',
    priority: 'Precautionary',
  },
  {
    id: 'gen-fl-4',
    targetAudience: 'Self-Help Groups',
    title: 'Chlorinate Water Supplies & Distribute ORS',
    action: 'Disinfect shallow handpumps, distribute water purification tablets, and prepare clean drinking water stores.',
    timeframe: 'Next 24-48 hours',
    priority: 'Precautionary',
  },
];

const DEFAULT_DROUGHT_ITEMS: GuidanceAction[] = [
  {
    id: 'gen-dr-1',
    targetAudience: 'Farmers',
    title: 'Apply Crop Residue / Straw Mulching',
    action: 'Spread straw or sugarcane trash across standing crop furrows to reduce soil evaporation and conserve root moisture.',
    timeframe: 'Immediate',
    priority: 'Immediate',
  },
  {
    id: 'gen-dr-2',
    targetAudience: 'Gram Panchayat',
    title: 'Prioritize Drinking Water & Regulate Pumping',
    action: 'Restrict heavy agricultural tube-well draw down and safeguard village community drinking water reserves.',
    timeframe: 'Next 24 hours',
    priority: 'Immediate',
  },
  {
    id: 'gen-dr-3',
    targetAudience: 'Households',
    title: 'Protect Fodder Stocks & Prevent Distress Sales',
    action: 'Organize community dry fodder banks and avoid emergency livestock sales by activating cattle support protocols.',
    timeframe: 'Next 3-5 days',
    priority: 'Precautionary',
  },
  {
    id: 'gen-dr-4',
    targetAudience: 'Farmers',
    title: 'Transition to Night-Time Furrow Irrigation',
    action: 'Irrigate fields exclusively during evening and night hours to minimize solar evaporative water loss.',
    timeframe: 'Ongoing',
    priority: 'Precautionary',
  },
];

const NORMAL_CONDITIONS_ITEMS: GuidanceAction[] = [
  {
    id: 'norm-1',
    targetAudience: 'Gram Panchayat',
    title: 'Routine Drainage & Culvert Maintenance',
    action: 'Inspect and desilt village storm drains, check dams, and inlet culverts before seasonal weather shifts.',
    timeframe: 'Seasonal Routine',
    priority: 'Routine',
  },
  {
    id: 'norm-2',
    targetAudience: 'Farmers',
    title: 'Maintain Seed Bank & Soil Health',
    action: 'Verify village seed stocks for flood-tolerant (e.g. Swarna Sub-1) and drought-hardy varieties; complete soil health tests.',
    timeframe: 'Pre-Sowing',
    priority: 'Routine',
  },
  {
    id: 'norm-3',
    targetAudience: 'Households',
    title: 'Sanitary Well Ring & Water Store Inspection',
    action: 'Inspect masonry around open dugwells, clean rainwater harvesting roof catchments, and check household water filters.',
    timeframe: 'Monthly',
    priority: 'Routine',
  },
  {
    id: 'norm-4',
    targetAudience: 'Self-Help Groups',
    title: 'Community First-Aid & Emergency Contact Drills',
    action: 'Review emergency medicine kits, update vulnerable elder registers, and test village warning loudspeaker systems.',
    timeframe: 'Quarterly',
    priority: 'Routine',
  },
];

export const PreparednessMatrix: React.FC<PreparednessMatrixProps> = ({
  location,
  riskState,
  onOpenExport,
}) => {
  const [selectedAudienceFilter, setSelectedAudienceFilter] = useState<string>('all');
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [completedItems, setCompletedItems] = useState<Record<string, boolean>>({});

  const toggleComplete = (id: string) => {
    setCompletedItems((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleToggleAudio = () => {
    if (!isPlayingAudio) {
      setIsPlayingAudio(true);
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(riskState.dynamicAdvisory.englishHeadline);
        utterance.rate = 0.95;
        utterance.onend = () => setIsPlayingAudio(false);
        utterance.onerror = () => setIsPlayingAudio(false);
        window.speechSynthesis.speak(utterance);
      } else {
        setTimeout(() => setIsPlayingAudio(false), 4000);
      }
    } else {
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
    }
  };

  // Resolve Flood Actions
  const locationFloodItems = location.preparednessItems.filter(
    (item) => item.applicableRisk === 'flood' || item.applicableRisk === 'both'
  );
  const rawFloodActions: GuidanceAction[] =
    locationFloodItems.length > 0
      ? locationFloodItems.map((item) => ({
          id: item.id,
          title: item.title,
          action: item.action,
          targetAudience: item.targetAudience,
          timeframe: item.timeframe,
          priority: item.priority,
        }))
      : DEFAULT_FLOOD_ITEMS;

  // Resolve Drought Actions
  const locationDroughtItems = location.preparednessItems.filter(
    (item) => item.applicableRisk === 'drought' || item.applicableRisk === 'both'
  );
  const rawDroughtActions: GuidanceAction[] =
    locationDroughtItems.length > 0
      ? locationDroughtItems.map((item) => ({
          id: item.id,
          title: item.title,
          action: item.action,
          targetAudience: item.targetAudience,
          timeframe: item.timeframe,
          priority: item.priority,
        }))
      : DEFAULT_DROUGHT_ITEMS;

  // Normal Actions
  const rawNormalActions: GuidanceAction[] = NORMAL_CONDITIONS_ITEMS;

  // Filter by Role
  const filterByAudience = (items: GuidanceAction[]) => {
    if (selectedAudienceFilter === 'all') return items;
    return items.filter((item) => item.targetAudience === selectedAudienceFilter);
  };

  const floodActions = filterByAudience(rawFloodActions);
  const droughtActions = filterByAudience(rawDroughtActions);
  const normalActions = filterByAudience(rawNormalActions);

  // Status badge styling helper
  const getFloodBadgeStyle = (level: string) => {
    switch (level) {
      case 'Critical':
        return 'bg-rose-500/20 text-rose-300 border-rose-500/40';
      case 'Watch':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
      case 'Advisory':
        return 'bg-sky-500/20 text-sky-300 border-sky-500/40';
      default:
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
    }
  };

  const getDroughtBadgeStyle = (level: string) => {
    switch (level) {
      case 'Severe Drought':
        return 'bg-rose-500/20 text-rose-300 border-rose-500/40';
      case 'Moderate Stress':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
      case 'Mild Deficit':
        return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/40';
      default:
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
    }
  };

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 sm:p-6 shadow-sm backdrop-blur-sm">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <LifeBuoy className="h-4 w-4" />
            </div>
            <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
              Preparedness Guidance
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
            Actionable community resilience guidance for rural Indian communities (illustrative educational examples; not official emergency instructions).
          </p>
        </div>

        {/* Audio Broadcast Simulation Box */}
        <div className="flex items-center gap-2 shrink-0 self-start md:self-auto">
          <button
            type="button"
            onClick={handleToggleAudio}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              isPlayingAudio
                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 animate-pulse'
                : 'bg-emerald-600 text-white hover:bg-emerald-500 shadow-sm'
            }`}
          >
            {isPlayingAudio ? <VolumeX className="h-3.5 w-3.5" /> : <Volume2 className="h-3.5 w-3.5" />}
            <span>{isPlayingAudio ? 'Stop PA Broadcast' : 'Simulate PA Broadcast'}</span>
          </button>

          <button
            type="button"
            onClick={onOpenExport}
            className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium text-slate-300 bg-slate-950 border border-slate-800 hover:text-white hover:border-slate-700 transition-colors"
          >
            <FileText className="h-3.5 w-3.5 text-emerald-400" />
            <span>Bulletin</span>
          </button>
        </div>
      </div>

      {/* Broadcast Text Kicker Banner */}
      <div className="my-4 p-4 rounded-xl bg-slate-950/70 border border-slate-800/80 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="space-y-1">
          <div className="text-[11px] font-mono uppercase tracking-wider text-amber-400 flex flex-wrap items-center gap-2">
            <span className="font-semibold">Simulated Village PA Broadcast</span>
            <span aria-hidden="true">·</span>
            <span className="text-slate-400">{location.name}, {location.state}</span>
            <span aria-hidden="true">·</span>
            <span className="rounded bg-amber-500/10 px-2 py-0.5 text-amber-300 border border-amber-500/20 text-[10px]">
              Illustrative Educational Example
            </span>
          </div>
          <div className="text-sm font-semibold text-slate-200">
            "{riskState.dynamicAdvisory.englishHeadline}"
          </div>
          <div className="text-xs text-slate-400 font-sans">
            हिंदी: {riskState.dynamicAdvisory.hindiHeadline}
          </div>
        </div>

        <div className="text-xs text-slate-400 md:text-right shrink-0 border-t md:border-t-0 md:border-l border-slate-800/80 pt-2 md:pt-0 md:pl-4">
          <span className="block text-[11px] font-mono uppercase text-slate-500">Key Simulated Action:</span>
          <span className="text-slate-200 font-medium">{riskState.dynamicAdvisory.keyInstruction}</span>
        </div>
      </div>

      {/* Role Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 my-4 pb-3 border-b border-slate-800/80">
        <div className="text-xs text-slate-300 font-medium">
          Organized by Risk Condition &bull; <span className="text-slate-400 font-normal">Check items to track completed measures</span>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-400">
          <Filter className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
          <label htmlFor="preparedness-role-filter" className="shrink-0 text-slate-300 font-medium">
            Role Filter:
          </label>
          <select
            id="preparedness-role-filter"
            value={selectedAudienceFilter}
            onChange={(e) => setSelectedAudienceFilter(e.target.value)}
            className="rounded-lg border border-slate-800 bg-slate-950 px-3 py-1.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer"
          >
            <option value="all">All Stakeholders</option>
            <option value="Farmers">Farmers (Kisan)</option>
            <option value="Gram Panchayat">Gram Panchayat (Panchayat Council)</option>
            <option value="Households">Households & Livestock Keepers</option>
            <option value="Self-Help Groups">Self-Help Groups (SHGs / Health)</option>
          </select>
        </div>
      </div>

      {/* Three Condition Cards: Flood, Drought, Normal */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mt-4">
        {/* Card 1: Flood Conditions */}
        <div className="rounded-xl border border-sky-500/25 bg-slate-950/70 p-4 sm:p-5 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-sky-500/10 text-sky-400 border border-sky-500/20">
                  <CloudRain className="h-4 w-4" />
                </div>
                <h4 className="text-sm font-bold text-white tracking-tight">
                  Flood Conditions
                </h4>
              </div>
              <span
                className={`text-[10px] font-mono px-2 py-0.5 rounded border ${getFloodBadgeStyle(
                  riskState.floodLevel
                )}`}
              >
                {riskState.floodLevel}
              </span>
            </div>

            <p className="text-[11px] text-slate-400 mt-2 leading-relaxed">
              Inundation protection, embankment safety, and emergency asset relocation.
            </p>

            {/* Action Bullets */}
            <div className="space-y-2.5 mt-3.5">
              {floodActions.map((item) => {
                const isDone = !!completedItems[item.id];
                return (
                  <div
                    key={item.id}
                    onClick={() => toggleComplete(item.id)}
                    className={`rounded-lg border p-3 transition-all cursor-pointer select-none flex items-start gap-2.5 ${
                      isDone
                        ? 'bg-slate-900/30 border-slate-800/40 opacity-60'
                        : 'bg-slate-900/70 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <button
                      type="button"
                      aria-label={`Mark ${item.title} as completed`}
                      className={`mt-0.5 h-4 w-4 rounded flex items-center justify-center shrink-0 transition-colors ${
                        isDone
                          ? 'bg-emerald-500 text-slate-950'
                          : 'border border-slate-700 bg-slate-950 text-transparent hover:border-slate-500'
                      }`}
                    >
                      <CheckCircle2 className="h-3 w-3" />
                    </button>

                    <div className="flex-1 min-w-0">
                      <div className={`text-xs font-semibold leading-tight ${isDone ? 'line-through text-slate-400' : 'text-slate-100'}`}>
                        {item.title}
                      </div>
                      <p className="text-[11px] text-slate-400 mt-1 leading-normal">
                        {item.action}
                      </p>
                      <div className="mt-2 flex flex-wrap items-center gap-1.5 text-[10px] font-mono">
                        <span className="rounded bg-slate-800 px-1.5 py-0.5 text-slate-300">
                          {item.targetAudience}
                        </span>
                        <span className="text-slate-500">•</span>
                        <span className="text-slate-400 flex items-center gap-1">
                          <Clock className="h-2.5 w-2.5" />
                          {item.timeframe}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}

              {floodActions.length === 0 && (
                <div className="py-6 text-center text-[11px] text-slate-500">
                  No flood actions match the selected role.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Card 2: Drought Conditions */}
        <div className="rounded-xl border border-amber-500/25 bg-slate-950/70 p-4 sm:p-5 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  <Sun className="h-4 w-4" />
                </div>
                <h4 className="text-sm font-bold text-white tracking-tight">
                  Drought Conditions
                </h4>
              </div>
              <span
                className={`text-[10px] font-mono px-2 py-0.5 rounded border ${getDroughtBadgeStyle(
                  riskState.droughtLevel
                )}`}
              >
                {riskState.droughtLevel}
              </span>
            </div>

            <p className="text-[11px] text-slate-400 mt-2 leading-relaxed">
              Soil moisture retention, groundwater management, and crop wilt protection.
            </p>

            {/* Action Bullets */}
            <div className="space-y-2.5 mt-3.5">
              {droughtActions.map((item) => {
                const isDone = !!completedItems[item.id];
                return (
                  <div
                    key={item.id}
                    onClick={() => toggleComplete(item.id)}
                    className={`rounded-lg border p-3 transition-all cursor-pointer select-none flex items-start gap-2.5 ${
                      isDone
                        ? 'bg-slate-900/30 border-slate-800/40 opacity-60'
                        : 'bg-slate-900/70 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <button
                      type="button"
                      aria-label={`Mark ${item.title} as completed`}
                      className={`mt-0.5 h-4 w-4 rounded flex items-center justify-center shrink-0 transition-colors ${
                        isDone
                          ? 'bg-emerald-500 text-slate-950'
                          : 'border border-slate-700 bg-slate-950 text-transparent hover:border-slate-500'
                      }`}
                    >
                      <CheckCircle2 className="h-3 w-3" />
                    </button>

                    <div className="flex-1 min-w-0">
                      <div className={`text-xs font-semibold leading-tight ${isDone ? 'line-through text-slate-400' : 'text-slate-100'}`}>
                        {item.title}
                      </div>
                      <p className="text-[11px] text-slate-400 mt-1 leading-normal">
                        {item.action}
                      </p>
                      <div className="mt-2 flex flex-wrap items-center gap-1.5 text-[10px] font-mono">
                        <span className="rounded bg-slate-800 px-1.5 py-0.5 text-slate-300">
                          {item.targetAudience}
                        </span>
                        <span className="text-slate-500">•</span>
                        <span className="text-slate-400 flex items-center gap-1">
                          <Clock className="h-2.5 w-2.5" />
                          {item.timeframe}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}

              {droughtActions.length === 0 && (
                <div className="py-6 text-center text-[11px] text-slate-500">
                  No drought actions match the selected role.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Card 3: Normal Conditions */}
        <div className="rounded-xl border border-emerald-500/25 bg-slate-950/70 p-4 sm:p-5 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <ShieldCheck className="h-4 w-4" />
                </div>
                <h4 className="text-sm font-bold text-white tracking-tight">
                  Normal Conditions
                </h4>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded border bg-emerald-500/20 text-emerald-300 border-emerald-500/40">
                Seasonal Baseline
              </span>
            </div>

            <p className="text-[11px] text-slate-400 mt-2 leading-relaxed">
              Routine infrastructure upkeep, seed bank resilience, and baseline drills.
            </p>

            {/* Action Bullets */}
            <div className="space-y-2.5 mt-3.5">
              {normalActions.map((item) => {
                const isDone = !!completedItems[item.id];
                return (
                  <div
                    key={item.id}
                    onClick={() => toggleComplete(item.id)}
                    className={`rounded-lg border p-3 transition-all cursor-pointer select-none flex items-start gap-2.5 ${
                      isDone
                        ? 'bg-slate-900/30 border-slate-800/40 opacity-60'
                        : 'bg-slate-900/70 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <button
                      type="button"
                      aria-label={`Mark ${item.title} as completed`}
                      className={`mt-0.5 h-4 w-4 rounded flex items-center justify-center shrink-0 transition-colors ${
                        isDone
                          ? 'bg-emerald-500 text-slate-950'
                          : 'border border-slate-700 bg-slate-950 text-transparent hover:border-slate-500'
                      }`}
                    >
                      <CheckCircle2 className="h-3 w-3" />
                    </button>

                    <div className="flex-1 min-w-0">
                      <div className={`text-xs font-semibold leading-tight ${isDone ? 'line-through text-slate-400' : 'text-slate-100'}`}>
                        {item.title}
                      </div>
                      <p className="text-[11px] text-slate-400 mt-1 leading-normal">
                        {item.action}
                      </p>
                      <div className="mt-2 flex flex-wrap items-center gap-1.5 text-[10px] font-mono">
                        <span className="rounded bg-slate-800 px-1.5 py-0.5 text-slate-300">
                          {item.targetAudience}
                        </span>
                        <span className="text-slate-500">•</span>
                        <span className="text-slate-400 flex items-center gap-1">
                          <Clock className="h-2.5 w-2.5" />
                          {item.timeframe}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}

              {normalActions.length === 0 && (
                <div className="py-6 text-center text-[11px] text-slate-500">
                  No baseline actions match the selected role.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Visible Statutory Advisory Notice */}
      <div className="mt-5 pt-3.5 border-t border-slate-800/80 flex items-start gap-2.5 text-xs text-slate-400">
        <AlertTriangle className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong className="text-slate-300">Public Safety Notice:</strong> All broadcasts, checklists, and preparedness protocols shown on this platform are <span className="text-slate-200 font-medium">illustrative educational examples</span>, not official emergency instructions. During actual hazard situations, always follow mandatory directives, evacuation warnings, and advisories issued by your local District Administration, District Disaster Management Authority (DDMA), and State Disaster Management Authority (SDMA).
        </p>
      </div>
    </div>
  );
};
