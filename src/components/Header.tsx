import React, { useState } from 'react';
import { ShieldCheck, FileText, Menu, X } from 'lucide-react';

interface HeaderProps {
  onExportClick: () => void;
  activeSection: string;
  setActiveSection: (section: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  onExportClick,
  activeSection,
  setActiveSection,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'locations', label: 'Monitoring Locations' },
    { id: 'scenarios', label: 'Scenario Explorer' },
    { id: 'preparedness', label: 'Preparedness Guidance' },
    { id: 'how-it-works', label: 'How It Works' },
  ];

  const handleNavClick = (id: string) => {
    setActiveSection(id);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-slate-950/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-2.5 sm:px-6 lg:px-8">
        {/* Brand & Subtitle */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => handleNavClick('dashboard')}
            className="flex items-center gap-2.5 text-left group focus:outline-none focus:ring-1 focus:ring-emerald-500 rounded-lg p-0.5"
            aria-label="RuralShield AI Home"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 group-hover:bg-emerald-500/20 group-hover:border-emerald-500/40 transition-colors">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-base sm:text-lg tracking-tight text-white group-hover:text-emerald-300 transition-colors whitespace-nowrap leading-tight">
                RuralShield AI
              </span>
              <span className="text-[11px] sm:text-xs font-medium text-slate-400 whitespace-nowrap leading-tight">
                Flood & Drought Risk Monitoring
              </span>
            </div>
          </button>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-5 xl:gap-6 text-xs sm:text-sm font-medium text-slate-300">
          {navItems.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNavClick(item.id)}
                className={`whitespace-nowrap transition-colors py-1 hover:text-emerald-400 ${
                  isActive
                    ? 'text-emerald-400 font-semibold border-b-2 border-emerald-400'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Action Button & Mobile Toggle */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <button
            type="button"
            onClick={onExportClick}
            className="flex items-center gap-1.5 sm:gap-2 rounded-lg bg-emerald-600 px-2.5 py-1.5 sm:px-3 sm:py-2 text-xs font-semibold text-white shadow-sm hover:bg-emerald-500 transition-colors whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-emerald-400"
          >
            <FileText className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Advisory Bulletin</span>
            <span className="sm:hidden">Bulletin</span>
          </button>

          {/* Mobile Menu Hamburger Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="lg:hidden flex h-8 w-8 items-center justify-center rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-400"
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-800/80 bg-slate-950/98 px-4 py-3 space-y-1 animate-fadeIn">
          {navItems.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNavClick(item.id)}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                  isActive
                    ? 'bg-emerald-500/10 text-emerald-400 font-semibold'
                    : 'text-slate-300 hover:bg-slate-900 hover:text-white'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
};
