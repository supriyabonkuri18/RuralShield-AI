import React from 'react';
import { PilotLocation } from '../types';
import { CalculatedRiskState } from '../utils/riskCalculator';
import { X, Printer, ShieldAlert } from 'lucide-react';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  location: PilotLocation;
  riskState: CalculatedRiskState;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  location,
  riskState,
}) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-3xl rounded-2xl border border-slate-700 bg-slate-900 text-slate-100 shadow-2xl p-6 sm:p-8 my-8">
        {/* Modal Controls */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 print:hidden">
          <div className="flex items-center gap-2 text-xs font-mono uppercase text-emerald-400">
            <ShieldAlert className="h-4 w-4" />
            <span>Community Warning Bulletin Generator</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-500 transition-colors cursor-pointer"
            >
              <Printer className="h-3.5 w-3.5" />
              <span>Print Bulletin</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Printable Bulletin Document Canvas */}
        <div className="mt-4 p-6 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 print:bg-white print:text-black print:border-black print:p-0">
          {/* Bulletin Masthead */}
          <div className="text-center pb-4 border-b-2 border-slate-800 print:border-black">
            <span className="text-[11px] font-mono uppercase tracking-wider text-amber-400 print:text-gray-700 font-bold">
              COMMUNITY EARLY WARNING ADVISORY BULLETIN · SYNTHETIC ILLUSTRATIVE DATA
            </span>
            <h2 className="text-2xl font-bold tracking-tight text-white print:text-black mt-1">
              RuralShield AI — Early Warning System
            </h2>
            <div className="text-xs text-slate-400 print:text-gray-700 mt-1 flex items-center justify-center gap-3">
              <span>Station: <strong>{location.name}</strong> ({location.district}, {location.state})</span>
              <span>·</span>
              <span>Timeline: <strong>Oct 04 – Nov 02, 2026</strong></span>
              <span>·</span>
              <span>Basin: <strong>{location.basin}</strong></span>
            </div>
          </div>

          {/* Prototype Watermark Notice */}
          <div className="my-3 p-2.5 rounded bg-amber-950/40 border border-amber-500/30 text-amber-200 text-xs text-center print:bg-gray-100 print:text-black print:border-gray-400">
            <strong>PUBLIC INFORMATION NOTICE:</strong> All values are synthetic illustrative data, not live observations, official warnings, or validated forecasts. Consult IMD, CWC, or SDMA for official emergency directives.
          </div>

          {/* Risk State Overview Grid */}
          <div className="grid grid-cols-2 gap-4 my-4">
            <div className="p-3.5 rounded-lg border border-slate-800 bg-slate-900/60 print:bg-gray-50 print:border-gray-300">
              <div className="text-xs font-mono uppercase text-sky-400 print:text-blue-700 font-semibold">
                Flood Risk Stage (Synthetic)
              </div>
              <div className="text-2xl font-black mt-1 text-white print:text-black">
                {riskState.floodLevel} Alert
              </div>
              <div className="text-xs text-slate-400 print:text-gray-700 mt-2 space-y-0.5">
                <div>Model Index: <strong>{riskState.floodScore}/100</strong></div>
                <div>72h Rain (Oct 31–Nov 02): <strong>{riskState.rainfall72h} mm</strong> (Normal: {riskState.rainfallNormal72h} mm)</div>
                <div>Latest 24h (Nov 02): <strong>{riskState.last24hRainfallMm} mm</strong></div>
                <div>Soil Saturation (SSI): <strong>{riskState.soilSaturationPercent}%</strong></div>
                <div>Dyke Freeboard: <strong>{riskState.freeboardMarginMeters} m</strong></div>
              </div>
            </div>

            <div className="p-3.5 rounded-lg border border-slate-800 bg-slate-900/60 print:bg-gray-50 print:border-gray-300">
              <div className="text-xs font-mono uppercase text-amber-400 print:text-amber-800 font-semibold">
                Drought Stress Status (Synthetic)
              </div>
              <div className="text-2xl font-black mt-1 text-white print:text-black">
                {riskState.droughtLevel}
              </div>
              <div className="text-xs text-slate-400 print:text-gray-700 mt-2 space-y-0.5">
                <div>Model Index: <strong>{riskState.droughtScore}/100</strong></div>
                <div>30d Total Rain: <strong>{riskState.total30dActual} mm</strong> (Normal: {riskState.total30dNormal} mm)</div>
                <div>SPI-30 Index: <strong>{riskState.spi30}</strong></div>
                <div>Rainless Dry Days: <strong>{riskState.consecutiveRainlessDays} days</strong></div>
                <div>Vegetation Index (VCI): <strong>{riskState.vegetationConditionIndex}%</strong></div>
              </div>
            </div>
          </div>

          {/* Localized Advisory */}
          <div className="p-3 rounded-lg border border-slate-800 bg-slate-900/40 my-3 print:bg-gray-50 print:border-gray-300 text-xs">
            <div className="font-semibold text-slate-200 print:text-black">Village Public Audio & Broadcast Guidance:</div>
            <div className="text-slate-300 print:text-gray-800 font-medium mt-1">"{riskState.dynamicAdvisory.englishHeadline}"</div>
            <div className="text-slate-400 print:text-gray-600 mt-0.5">हिंदी: {riskState.dynamicAdvisory.hindiHeadline}</div>
          </div>

          {/* Priority Action Checklist */}
          <div className="mt-4">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-300 print:text-black mb-2">
              Preparedness Directives for Gram Panchayat (Illustrative Guidance)
            </div>
            <div className="space-y-2 text-xs">
              {location.preparednessItems.map((item, idx) => (
                <div key={idx} className="flex items-start gap-2 p-2 rounded bg-slate-900/50 print:bg-transparent border border-slate-800/80 print:border-gray-200">
                  <span className="font-bold font-mono text-emerald-400 print:text-black">
                    [{idx + 1}]
                  </span>
                  <div>
                    <span className="font-semibold text-slate-200 print:text-black">{item.title}</span>
                    <span className="text-slate-400 print:text-gray-600"> ({item.targetAudience} · {item.timeframe}): </span>
                    <span className="text-slate-300 print:text-gray-800">{item.action}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bulletin Footer & Signature Line */}
          <div className="mt-6 pt-4 border-t border-slate-800 print:border-black flex justify-between items-center text-[11px] text-slate-400 print:text-gray-600 font-mono">
            <span>Generated by RuralShield AI · Flood & Drought Risk Platform</span>
            <span>Ref ID: RS-SYNTH-{location.id.toUpperCase()}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
