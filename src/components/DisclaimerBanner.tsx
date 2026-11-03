import React, { useState } from 'react';
import { AlertTriangle, ChevronDown, ChevronUp, Info } from 'lucide-react';

export const DisclaimerBanner: React.FC = () => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="w-full border-b border-amber-500/30 bg-amber-950/60 text-amber-200">
      <div className="mx-auto max-w-7xl px-4 py-2.5 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div className="flex items-start gap-2.5">
            <AlertTriangle className="h-4 w-4 shrink-0 text-amber-400 mt-0.5" />
            <div className="text-xs leading-relaxed text-amber-200/95">
              <span className="font-bold text-amber-300">PUBLIC INFORMATION NOTICE — NOT AN OFFICIAL WARNING SYSTEM:</span>{' '}
              All rainfall, soil saturation (SSI), river freeboard, drought indicators, and advisories displayed on this platform are{' '}
              <span className="font-semibold text-amber-100">synthetic illustrative data, not live observations, official warnings, or validated forecasts</span>. 
              For life-safety decisions, always refer to authorized state and national disaster agencies.
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
            <button
              onClick={() => setExpanded(!expanded)}
              className="flex items-center gap-1 text-xs text-amber-300 hover:text-amber-200 font-semibold underline underline-offset-2 transition-colors cursor-pointer"
            >
              <span>{expanded ? 'Hide Source Details' : 'Official Sources & Data Notice'}</span>
              {expanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
            </button>
          </div>
        </div>

        {expanded && (
          <div className="mt-3 pt-3 border-t border-amber-500/20 text-xs text-amber-200/80 space-y-2">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="p-3 rounded-lg bg-amber-950/80 border border-amber-500/30">
                <div className="font-semibold text-amber-300 mb-1 flex items-center gap-1.5">
                  <Info className="h-3.5 w-3.5 text-amber-400" />
                  Statutory Warnings
                </div>
                <p className="text-[11px] leading-normal text-amber-200/80">
                  For certified flood stage bulletins, evacuation notices, and real-time weather advisories in India, consult official agencies:
                  <span className="block mt-1.5 font-medium text-amber-300">
                    · India Meteorological Department (IMD)
                    <br />
                    · Central Water Commission (CWC Flood Forecast)
                    <br />
                    · National & State Disaster Management Authorities (NDMA/SDMA)
                  </span>
                </p>
              </div>

              <div className="p-3 rounded-lg bg-amber-950/80 border border-amber-500/30">
                <div className="font-semibold text-amber-300 mb-1">Synthetic Data Notice</div>
                <p className="text-[11px] leading-normal text-amber-200/80">
                  All baseline normals and time-series records are synthetic demonstration models designed to test early warning calculation workflows without fabricating live radar or station measurements.
                </p>
              </div>

              <div className="p-3 rounded-lg bg-amber-950/80 border border-amber-500/30">
                <div className="font-semibold text-amber-300 mb-1">Simulated Advisory Guidance</div>
                <p className="text-[11px] leading-normal text-amber-200/80">
                  All agricultural, community, and loudspeaker broadcast texts are mock educational examples illustrating how an automated warning dispatch system would formulate community instructions.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
