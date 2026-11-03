/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { PILOT_LOCATIONS } from './data/pilotLocations';
import { PilotLocation } from './types';
import { computeRiskState } from './utils/riskCalculator';
import { Header } from './components/Header';
import { DisclaimerBanner } from './components/DisclaimerBanner';
import { ScenarioSimulator } from './components/ScenarioSimulator';
import { ScenarioComparison } from './components/ScenarioComparison';
import { LocationSelector } from './components/LocationSelector';
import { IndiaMap } from './components/IndiaMap';
import { RiskIndicatorGauges } from './components/RiskIndicatorGauges';
import { RainfallPanel } from './components/RainfallPanel';
import { PreparednessMatrix } from './components/PreparednessMatrix';
import { MethodologyExplainer } from './components/MethodologyExplainer';
import { ExportModal } from './components/ExportModal';
import { ShieldCheck, Info, MapPin, ExternalLink, Radio } from 'lucide-react';

export default function App() {
  const [selectedLocation, setSelectedLocation] = useState<PilotLocation>(PILOT_LOCATIONS[0]);
  const [rainfallAnomaly, setRainfallAnomaly] = useState<number>(0);
  const [activeSection, setActiveSection] = useState<string>('dashboard');
  const [isExportOpen, setIsExportOpen] = useState<boolean>(false);
  const [isMethodologyOpen, setIsMethodologyOpen] = useState<boolean>(false);

  // Dynamically compute risk state based on selected station & interactive scenario slider
  const riskState = useMemo(() => {
    return computeRiskState(selectedLocation, rainfallAnomaly);
  }, [selectedLocation, rainfallAnomaly]);

  const handleScrollTo = (sectionId: string) => {
    setActiveSection(sectionId);
    if (sectionId === 'how-it-works' || sectionId === 'methodology') {
      setIsMethodologyOpen(true);
    }
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500/30 selection:text-emerald-200">
      {/* 1. Header (Strict Top Bar Contract) */}
      <Header
        onExportClick={() => setIsExportOpen(true)}
        activeSection={activeSection}
        setActiveSection={handleScrollTo}
      />

      {/* 2. Persistent Visible Disclaimer Banner */}
      <DisclaimerBanner />

      {/* 3. Main Dashboard Workspace */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* System Masthead / Dashboard */}
        <div id="dashboard" className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-2">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
              <span className="text-emerald-400 font-semibold uppercase tracking-wider">
                RuralShield AI
              </span>
              <span aria-hidden="true">·</span>
              <span>Flood & Drought Early Warning Platform</span>
              <span aria-hidden="true">·</span>
              <span className="text-slate-400">Illustrative Data Model</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mt-1">
              Flood & Drought Risk Dashboard
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-3xl leading-relaxed">
              Monitoring antecedent hydro-climatological pressure, soil moisture desiccation, and river stage across vulnerable Indian agro-climatic basins using synthetic illustrative models.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto shrink-0 text-xs">
            <span className="text-slate-400">Active Station:</span>
            <span className="px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 text-white font-medium flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5 text-emerald-400" />
              <span>{selectedLocation.name}</span>
            </span>
          </div>
        </div>

        {/* Interactive Scenario Simulator / Scenario Explorer */}
        <div id="scenarios">
          <ScenarioSimulator
            rainfallAnomaly={rainfallAnomaly}
            onAnomalyChange={setRainfallAnomaly}
            onReset={() => setRainfallAnomaly(0)}
          />
        </div>

        {/* Compact Scenario Comparison Matrix */}
        <ScenarioComparison
          selectedLocation={selectedLocation}
          currentAnomaly={rainfallAnomaly}
          onSelectScenarioAnomaly={(anomaly) => setRainfallAnomaly(anomaly)}
        />

        {/* Location Selector */}
        <LocationSelector
          locations={PILOT_LOCATIONS}
          selectedLocation={selectedLocation}
          onSelectLocation={(loc) => setSelectedLocation(loc)}
        />

        {/* Dual Primary Section: Monitoring Locations (Map & Risk Indicators) */}
        <div id="locations" className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Map Column */}
          <div className="lg:col-span-5 flex flex-col">
            <IndiaMap
              locations={PILOT_LOCATIONS}
              selectedLocation={selectedLocation}
              onSelectLocation={(loc) => setSelectedLocation(loc)}
              floodScore={riskState.floodScore}
              droughtScore={riskState.droughtScore}
            />
          </div>

          {/* Risk Indicators Column */}
          <div className="lg:col-span-7 flex flex-col justify-between">
            <RiskIndicatorGauges
              riskState={riskState}
              location={selectedLocation}
            />
          </div>
        </div>

        {/* Rainfall Telemetry & Historical Comparison Panel */}
        <div id="rainfall">
          <RainfallPanel
            dailyRecords={riskState.adjustedDailySeries}
            locationName={selectedLocation.name}
            rainfall72h={riskState.rainfall72h}
            rainfallNormal72h={riskState.rainfallNormal72h}
            last24hRainfallMm={riskState.last24hRainfallMm}
          />
        </div>

        {/* Community Preparedness Action Matrix */}
        <div id="preparedness">
          <PreparednessMatrix
            location={selectedLocation}
            riskState={riskState}
            onOpenExport={() => setIsExportOpen(true)}
          />
        </div>

        {/* Technical Methodology & Alert Criteria Explainer / How It Works */}
        <div id="how-it-works">
          <MethodologyExplainer
            isOpen={isMethodologyOpen}
            onToggle={() => setIsMethodologyOpen((prev) => !prev)}
          />
        </div>
      </main>

      {/* 4. Footer */}
      <footer className="w-full border-t border-slate-900 bg-slate-950 py-8 text-xs text-slate-500">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-emerald-500" />
            <span className="font-semibold text-slate-300">RuralShield AI</span>
            <span>· Flood & Drought Early Warning Platform</span>
          </div>

          <div className="flex items-center gap-4 text-[11px] text-slate-400">
            <span>Calibrated Synthetic Proxy Data</span>
            <span aria-hidden="true">·</span>
            <a
              href="https://mausam.imd.gov.in"
              target="_blank"
              rel="noreferrer"
              className="hover:text-slate-300 transition-colors"
            >
              IMD Official Portal
            </a>
            <span aria-hidden="true">·</span>
            <a
              href="https://cwc.gov.in"
              target="_blank"
              rel="noreferrer"
              className="hover:text-slate-300 transition-colors"
            >
              CWC Flood Monitoring
            </a>
          </div>
        </div>
      </footer>

      {/* Printable Community Bulletin Modal */}
      <ExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        location={selectedLocation}
        riskState={riskState}
      />
    </div>
  );
}
