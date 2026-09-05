import React, { useState } from 'react';
import { MedLensProvider, useMedLens } from './context/MedLensContext';
import { DisclaimerBanner } from './components/layout/DisclaimerBanner';
import { AppHeader } from './components/layout/AppHeader';
import { AppNavigation } from './components/layout/AppNavigation';
import { DashboardOverview } from './components/dashboard/DashboardOverview';
import { PatientProfileView } from './components/profile/PatientProfileView';
import { ReportsView } from './components/reports/ReportsView';
import { LabResultsView } from './components/labs/LabResultsView';
import { MedicationsView } from './components/medications/MedicationsView';
import { ConditionsView } from './components/conditions/ConditionsView';
import { TimelineView } from './components/timeline/TimelineView';
import { ComparisonView } from './components/comparison/ComparisonView';
import { PatientSummaryView } from './components/summary/PatientSummaryView';
import { SourceAuditDrawer } from './components/provenance/SourceAuditDrawer';
import { ReviewQueueModal } from './components/review/ReviewQueueModal';
import { ReportUploadModal } from './components/reports/ReportUploadModal';

const AppContent: React.FC = () => {
  const { activeTab } = useMedLens();
  const [globalSearch, setGlobalSearch] = useState('');

  const renderActiveView = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardOverview />;
      case 'profile':
        return <PatientProfileView />;
      case 'reports':
        return <ReportsView />;
      case 'labs':
        return <LabResultsView />;
      case 'medications':
        return <MedicationsView />;
      case 'conditions':
        return <ConditionsView />;
      case 'timeline':
        return <TimelineView />;
      case 'comparison':
        return <ComparisonView />;
      case 'summary':
        return <PatientSummaryView />;
      default:
        return <DashboardOverview />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-100/70 flex flex-col selection:bg-teal-700 selection:text-white">
      {/* Non-diagnostic clinical safety disclaimer */}
      <DisclaimerBanner />

      {/* Primary header & patient identity banner */}
      <AppHeader searchQuery={globalSearch} onSearchChange={setGlobalSearch} />

      {/* Navigation tabs */}
      <AppNavigation />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {renderActiveView()}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-4 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-800">MedLens</span>
            <span>•</span>
            <span>AI-Powered Clinical Information Intelligence</span>
            <span>•</span>
            <span className="font-mono text-[11px] text-teal-800 bg-teal-50 px-1.5 py-0.2 rounded border border-teal-200">
              Provenance-First Architecture
            </span>
          </div>
          <div className="text-[11px] text-slate-400">
            Strictly an organization and comprehension tool. Not for medical diagnosis or clinical intervention.
          </div>
        </div>
      </footer>

      {/* Global Modals & Slide-over Drawers */}
      <SourceAuditDrawer />
      <ReviewQueueModal />
      <ReportUploadModal />
    </div>
  );
};

export function App() {
  return (
    <MedLensProvider>
      <AppContent />
    </MedLensProvider>
  );
}

export default App;
