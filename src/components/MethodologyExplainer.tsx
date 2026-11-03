import React, { useState } from 'react';
import {
  ChevronDown,
  ChevronUp,
  Layers,
  Activity,
  BookOpen,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Info,
} from 'lucide-react';

interface MethodologyExplainerProps {
  isOpen?: boolean;
  onToggle?: () => void;
}

export const MethodologyExplainer: React.FC<MethodologyExplainerProps> = ({
  isOpen,
  onToggle,
}) => {
  const [internalExpanded, setInternalExpanded] = useState<boolean>(false);
  const isExpanded = isOpen !== undefined ? isOpen : internalExpanded;
  const handleToggle = onToggle || (() => setInternalExpanded((prev) => !prev));

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/80 shadow-sm backdrop-blur-sm transition-all duration-200 overflow-hidden">
      {/* Expandable Header Toggle Button */}
      <button
        type="button"
        onClick={handleToggle}
        className="w-full flex items-center justify-between p-5 sm:p-6 text-left hover:bg-slate-800/40 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
        aria-expanded={isExpanded}
      >
        <div className="flex items-start sm:items-center gap-3.5">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <BookOpen className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono uppercase tracking-wider text-emerald-400 font-medium">
                Reference Specification
              </span>
              <span className="text-[10px] rounded bg-slate-800 px-2 py-0.5 text-slate-400 font-mono">
                {isExpanded ? 'Expanded' : 'Collapsed by default'}
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight mt-0.5">
              Technical Methodology & Alert Criteria
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 line-clamp-1 sm:line-clamp-none">
              Physical alert triggers, hydro-climatic concepts, scoring formulas, and synthetic data scope.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0 ml-4">
          <span className="hidden sm:inline text-xs font-medium text-slate-400">
            {isExpanded ? 'Hide Details' : 'View Criteria'}
          </span>
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-800 border border-slate-700 text-slate-300">
            {isExpanded ? (
              <ChevronUp className="h-4 w-4 text-emerald-400" />
            ) : (
              <ChevronDown className="h-4 w-4 text-slate-300" />
            )}
          </div>
        </div>
      </button>

      {/* Collapsible Content */}
      {isExpanded && (
        <div className="p-5 sm:p-8 pt-2 sm:pt-4 border-t border-slate-800/80 space-y-8 animate-fadeIn">
          {/* Section Overview Lead */}
          <div className="rounded-xl bg-slate-950/60 p-4 border border-slate-800/70 text-xs text-slate-300 leading-relaxed">
            <p>
              RuralShield AI utilizes multi-criteria physical thresholds to categorize flood inundation and agricultural drought risks, coupled with continuous score calculation formulas. The sections below document the exact criteria, define key hydro-meteorological concepts, and clarify the distinction between qualifying thresholds and continuous score formulas.
            </p>
          </div>

          {/* Grid of Alert Criteria: Flood & Drought */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 1. Flood Alert Criteria */}
            <div className="rounded-xl border border-sky-500/20 bg-slate-950/60 p-5 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
                <div className="flex items-center gap-2 text-sky-400 font-semibold text-sm">
                  <Layers className="h-4 w-4" />
                  <span>Flood Alert Criteria & Scoring</span>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-sky-950/60 text-sky-300 border border-sky-800/40">
                  Hydro-Surge
                </span>
              </div>

              {/* Threshold Tiers */}
              <div className="space-y-3">
                <div className="text-xs font-semibold text-slate-200">
                  Qualifying Alert Thresholds:
                </div>

                {/* Critical */}
                <div className="rounded-lg bg-slate-900/90 p-3 border border-rose-500/30 space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-semibold text-rose-400">
                    <span>Critical Flood Alert Trigger</span>
                    <span className="text-[11px] font-mono text-rose-300">Score &ge; 80 / 100</span>
                  </div>
                  <div className="text-[11px] text-slate-300 leading-normal">
                    Triggered when <span className="text-white font-medium">all three</span> physical conditions are met simultaneously:
                  </div>
                  <div className="font-mono text-[11px] text-slate-200 bg-slate-950 p-2 rounded border border-slate-800 space-y-0.5">
                    <div>• Soil Saturation (SSI) &ge; 85.0%</div>
                    <div>• 72-Hour Precipitation &ge; 100.0 mm</div>
                    <div>• River Dyke Freeboard &le; 1.00 m</div>
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Indicates severe river surcharge with acute threat of dyke overtopping (e.g. Majuli baseline).
                  </div>
                </div>

                {/* Watch */}
                <div className="rounded-lg bg-slate-900/90 p-3 border border-amber-500/30 space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-semibold text-amber-400">
                    <span>Flood Watch Trigger</span>
                    <span className="text-[11px] font-mono text-amber-300">Score: 55 – 79 / 100</span>
                  </div>
                  <div className="text-[11px] text-slate-300 leading-normal">
                    Triggered when critical conditions are not met, but:
                  </div>
                  <div className="font-mono text-[11px] text-slate-200 bg-slate-950 p-2 rounded border border-slate-800 space-y-0.5">
                    <div>• Soil Saturation (SSI) &ge; 70.0%</div>
                    <div>• 72-Hour Precipitation &ge; 60.0 mm</div>
                    <div>• River Dyke Freeboard &le; 1.80 m</div>
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Indicates elevated catchment saturation and rapid runoff accumulation.
                  </div>
                </div>

                {/* Advisory & Normal */}
                <div className="rounded-lg bg-slate-900/50 p-2.5 border border-slate-800 text-[11px] text-slate-400 space-y-1">
                  <div>
                    <strong className="text-slate-300">Precautionary Advisory:</strong> SSI &ge; 50.0% AND 72h Rain &ge; 35.0 mm (Score: 35–54).
                  </div>
                  <div>
                    <strong className="text-slate-300">Normal Baseline:</strong> Inputs below advisory thresholds (Score: 2–34).
                  </div>
                </div>
              </div>

              {/* Score Calculation Formula Distinction */}
              <div className="pt-2 border-t border-slate-800/80">
                <div className="text-xs font-semibold text-slate-200 mb-1.5 flex items-center gap-1.5">
                  <Info className="h-3.5 w-3.5 text-sky-400" />
                  <span>How Displayed Flood Scores Are Calculated</span>
                </div>
                <div className="text-[11px] text-slate-400 leading-relaxed mb-2">
                  Alert thresholds above decide the status tier. Within each tier, the numerical score is calculated directly from 72h rainfall and SSI:
                </div>
                <div className="rounded-lg bg-slate-900 p-2.5 border border-slate-800 font-mono text-[10.5px] text-slate-300 space-y-1">
                  <div>
                    <span className="text-rose-400">Critical:</span> 82 + (Rain72h - 100) × 0.12 + (SSI - 85) × 0.40 <span className="text-slate-400">[capped at 100]</span>
                  </div>
                  <div>
                    <span className="text-amber-400">Watch:</span> 55 + (Rain72h - 60) × 0.45 + (SSI - 70) × 0.30
                  </div>
                  <div>
                    <span className="text-blue-400">Advisory:</span> 35 + (Rain72h - 35) × 0.60 + (SSI - 50) × 0.25
                  </div>
                  <div>
                    <span className="text-emerald-400">Normal:</span> (Rain72h / 35) × 22 + (SSI / 50) × 10
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Drought Alert Criteria */}
            <div className="rounded-xl border border-amber-500/20 bg-slate-950/60 p-5 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
                <div className="flex items-center gap-2 text-amber-400 font-semibold text-sm">
                  <Activity className="h-4 w-4" />
                  <span>Drought Alert Criteria & Scoring</span>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-950/60 text-amber-300 border border-amber-800/40">
                  Moisture Stress
                </span>
              </div>

              {/* Threshold Tiers */}
              <div className="space-y-3">
                <div className="text-xs font-semibold text-slate-200">
                  Qualifying Alert Thresholds:
                </div>

                {/* Severe */}
                <div className="rounded-lg bg-slate-900/90 p-3 border border-rose-500/30 space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-semibold text-rose-400">
                    <span>Severe Drought Alert Trigger</span>
                    <span className="text-[11px] font-mono text-rose-300">Score &ge; 80 / 100</span>
                  </div>
                  <div className="text-[11px] text-slate-300 leading-normal">
                    Triggered when <span className="text-white font-medium">both</span> conditions are met simultaneously:
                  </div>
                  <div className="font-mono text-[11px] text-slate-200 bg-slate-950 p-2 rounded border border-slate-800 space-y-0.5">
                    <div>• Standardized Precipitation Index (SPI-30) &le; -1.50</div>
                    <div>• Consecutive Rainless Days (CDD) &ge; 21 days</div>
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Indicates severe agro-meteorological desiccation with acute crop wilt risk (e.g. Latur under severe dry spell).
                  </div>
                </div>

                {/* Moderate */}
                <div className="rounded-lg bg-slate-900/90 p-3 border border-amber-500/30 space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-semibold text-amber-400">
                    <span>Moderate Moisture Stress Trigger</span>
                    <span className="text-[11px] font-mono text-amber-300">Score: 55 – 79 / 100</span>
                  </div>
                  <div className="text-[11px] text-slate-300 leading-normal">
                    Triggered when severe criteria are not met, but:
                  </div>
                  <div className="font-mono text-[11px] text-slate-200 bg-slate-950 p-2 rounded border border-slate-800 space-y-0.5">
                    <div>• SPI-30 &le; -1.00 OR Consecutive Rainless Days &ge; 14 days</div>
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Indicates emerging sub-surface soil moisture deficit and vegetative stress.
                  </div>
                </div>

                {/* Mild & Normal */}
                <div className="rounded-lg bg-slate-900/50 p-2.5 border border-slate-800 text-[11px] text-slate-400 space-y-1">
                  <div>
                    <strong className="text-slate-300">Mild Deficit:</strong> SPI-30 &le; -0.50 OR Rainless Days &ge; 7 days (Score: 30–54).
                  </div>
                  <div>
                    <strong className="text-slate-300">No Stress:</strong> SPI-30 &gt; -0.50 AND Rainless Days &lt; 7 days (Score: 2–29).
                  </div>
                </div>
              </div>

              {/* Score Calculation Formula Distinction */}
              <div className="pt-2 border-t border-slate-800/80">
                <div className="text-xs font-semibold text-slate-200 mb-1.5 flex items-center gap-1.5">
                  <Info className="h-3.5 w-3.5 text-amber-400" />
                  <span>How Displayed Drought Scores Are Calculated</span>
                </div>
                <div className="text-[11px] text-slate-400 leading-relaxed mb-2">
                  Alert thresholds determine the drought tier. Within each tier, the score is calculated directly from SPI-30 and CDD:
                </div>
                <div className="rounded-lg bg-slate-900 p-2.5 border border-slate-800 font-mono text-[10.5px] text-slate-300 space-y-1">
                  <div>
                    <span className="text-rose-400">Severe:</span> 80 + |SPI - (-1.5)| × 10 + (DryDays - 21) × 0.50 <span className="text-slate-400">[capped at 100]</span>
                  </div>
                  <div>
                    <span className="text-amber-400">Moderate:</span> 55 + |SPI - (-1.0)| × 18 + max(0, DryDays - 14) × 0.70
                  </div>
                  <div>
                    <span className="text-yellow-400">Mild:</span> 30 + |SPI - (-0.5)| × 20 + max(0, DryDays - 7) × 1.50
                  </div>
                  <div>
                    <span className="text-emerald-400">No Stress:</span> max(2, 14 - SPI × 10)
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 3. Model Concepts & Definitions */}
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-emerald-400" />
                <span>Model Concepts & Parameter Definitions</span>
              </div>
              <span className="text-xs text-slate-400">
                Distinction between active score inputs vs conceptual metrics
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Concept 1: API */}
              <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-sky-400 font-mono">API</span>
                  <span className="text-[10px] rounded px-1.5 py-0.5 bg-slate-800 text-slate-400 font-mono">
                    Conceptual Framework
                  </span>
                </div>
                <div className="text-xs font-semibold text-white">Antecedent Precipitation Index</div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  A hydrological index representing cumulative prior rainfall decayed exponentially over time:
                  <span className="block font-mono text-[10px] text-slate-300 mt-1 bg-slate-900 p-1.5 rounded">
                    API_t = P_t + (k × API_t-1)  [k ≈ 0.85]
                  </span>
                </p>
                <div className="text-[10px] text-slate-400 border-t border-slate-800/80 pt-1.5">
                  <strong className="text-slate-300">Implementation Note:</strong> Foundational hydrological concept for catchment wetness. The active scoring engine directly calculates from the explicit 72h windowed rainfall and SSI.
                </div>
              </div>

              {/* Concept 2: SSI */}
              <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-sky-400 font-mono">SSI</span>
                  <span className="text-[10px] rounded px-1.5 py-0.5 bg-emerald-950 text-emerald-400 border border-emerald-800/50 font-mono">
                    Active Score Input
                  </span>
                </div>
                <div className="text-xs font-semibold text-white">Soil Saturation Index (%)</div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  The fraction of available soil pore space currently filled with moisture between wilting point and field saturation:
                  <span className="block font-mono text-[10px] text-slate-300 mt-1 bg-slate-900 p-1.5 rounded">
                    SSI = [(θ_current - θ_wilting) / (θ_sat - θ_wilting)] × 100
                  </span>
                </p>
                <div className="text-[10px] text-slate-400 border-t border-slate-800/80 pt-1.5">
                  <strong className="text-slate-300">Implementation Note:</strong> Directly evaluated in flood alert criteria (&ge;85% Critical, &ge;70% Watch) and directly used in flood score formulas.
                </div>
              </div>

              {/* Concept 3: Freeboard */}
              <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-sky-400 font-mono">Freeboard</span>
                  <span className="text-[10px] rounded px-1.5 py-0.5 bg-emerald-950 text-emerald-400 border border-emerald-800/50 font-mono">
                    Active Alert Gate
                  </span>
                </div>
                <div className="text-xs font-semibold text-white">River Dyke Freeboard Margin (m)</div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  The remaining safety clearance between the current river surface stage and the embankment dyke crest:
                  <span className="block font-mono text-[10px] text-slate-300 mt-1 bg-slate-900 p-1.5 rounded">
                    Freeboard = Dyke_Crest_Height - River_Stage
                  </span>
                </p>
                <div className="text-[10px] text-slate-400 border-t border-slate-800/80 pt-1.5">
                  <strong className="text-slate-300">Implementation Note:</strong> Evaluated as a physical prerequisite for flood alert levels (&le;1.0m for Critical, &le;1.8m for Watch).
                </div>
              </div>

              {/* Concept 4: SPI-30 */}
              <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-400 font-mono">SPI-30</span>
                  <span className="text-[10px] rounded px-1.5 py-0.5 bg-emerald-950 text-emerald-400 border border-emerald-800/50 font-mono">
                    Active Score Input
                  </span>
                </div>
                <div className="text-xs font-semibold text-white">Standardized Precipitation Index</div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  A normalized statistical metric quantifying precipitation deficit or surplus over a 30-day accumulation window:
                  <span className="block font-mono text-[10px] text-slate-300 mt-1 bg-slate-900 p-1.5 rounded">
                    SPI_30 = [Rain_30d - μ_baseline] / σ_baseline
                  </span>
                </p>
                <div className="text-[10px] text-slate-400 border-t border-slate-800/80 pt-1.5">
                  <strong className="text-slate-300">Implementation Note:</strong> Directly evaluated in drought alert criteria (&le; -1.5 for Severe, &le; -1.0 for Moderate) and used in drought score formulas.
                </div>
              </div>

              {/* Concept 5: SMA */}
              <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-400 font-mono">SMA</span>
                  <span className="text-[10px] rounded px-1.5 py-0.5 bg-slate-800 text-slate-400 font-mono">
                    Conceptual Framework
                  </span>
                </div>
                <div className="text-xs font-semibold text-white">Soil Moisture Anomaly (%)</div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  The percentage deviation of root-zone moisture from historical long-term calendar norms:
                  <span className="block font-mono text-[10px] text-slate-300 mt-1 bg-slate-900 p-1.5 rounded">
                    SMA = [(θ_obs - θ_mean_historical) / θ_mean_historical] × 100
                  </span>
                </p>
                <div className="text-[10px] text-slate-400 border-t border-slate-800/80 pt-1.5">
                  <strong className="text-slate-300">Implementation Note:</strong> Agronomic reference concept. The active scoring engine uses SPI-30 and CDD as primary mathematical inputs.
                </div>
              </div>

              {/* Concept 6: CDD */}
              <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-400 font-mono">CDD</span>
                  <span className="text-[10px] rounded px-1.5 py-0.5 bg-emerald-950 text-emerald-400 border border-emerald-800/50 font-mono">
                    Active Score Input
                  </span>
                </div>
                <div className="text-xs font-semibold text-white">Consecutive Dry Days</div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  The count of consecutive successive days with daily rainfall below the meteorological dry-day threshold (&lt; 2.5 mm):
                  <span className="block font-mono text-[10px] text-slate-300 mt-1 bg-slate-900 p-1.5 rounded">
                    CDD = Trailing count where P_daily &lt; 2.5 mm
                  </span>
                </p>
                <div className="text-[10px] text-slate-400 border-t border-slate-800/80 pt-1.5">
                  <strong className="text-slate-300">Implementation Note:</strong> Directly evaluated in drought alert criteria (&ge;21 days for Severe, &ge;14 days for Moderate) and used in drought score formulas.
                </div>
              </div>
            </div>
          </div>

          {/* 4. Data Sources and Limitations */}
          <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-5 space-y-3">
            <div className="flex items-center gap-2 text-emerald-400 font-semibold text-sm">
              <ShieldCheck className="h-4 w-4" />
              <span>Data Sources, Provenance & Operational Limitations</span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              All displayed precipitation values, soil saturation indices (SSI), river freeboard margins, standardized precipitation indices (SPI-30), and community advisories are <strong className="text-white">synthetic demonstration data</strong>, not live telemetry observations, official government warnings, or validated weather forecasts.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-400 pt-1">
              <div className="rounded-lg bg-slate-900/80 p-3 border border-slate-800 space-y-1.5">
                <div className="font-semibold text-slate-200">Demonstration Objectives:</div>
                <p className="text-[11px] leading-relaxed">
                  RuralShield AI illustrates how multi-source hydro-meteorological indicators can be evaluated dynamically against rigorous physical thresholds to generate localized, bilingual community preparedness guidance for rural Indian panchayats.
                </p>
              </div>

              <div className="rounded-lg bg-slate-900/80 p-3 border border-slate-800 space-y-1.5">
                <div className="font-semibold text-slate-200">Official Warning Channels:</div>
                <p className="text-[11px] leading-relaxed">
                  For real-world disaster management, evacuation, or life-safety decisions, communities and administrators must always consult authorized statutory bodies including the <a href="https://mausam.imd.gov.in" target="_blank" rel="noreferrer" className="text-emerald-400 underline hover:text-emerald-300">India Meteorological Department (IMD)</a>, <a href="https://cwc.gov.in" target="_blank" rel="noreferrer" className="text-emerald-400 underline hover:text-emerald-300">Central Water Commission (CWC)</a>, and relevant State Disaster Management Authorities (SDMA).
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
