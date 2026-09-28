import React, { useState } from 'react';
import Navbar from './components/Navbar';
import ModuleRibbon from './components/ModuleRibbon';
import HomeDashboard from './components/HomeDashboard';
import ModuleAnalysisView from './components/ModuleAnalysisView';
import MetricDeepDivePage from './components/MetricDeepDivePage';
import ConnectSystemModal from './components/ConnectSystemModal';
import UploadCustomStandardsModal from './components/UploadCustomStandardsModal';
import ToastNotification from './components/ToastNotification';
import { SF_MODULES } from './data/modulesData';
import './index.css';

export default function App() {
  // activeModuleId: null indicates Overview/Home, string ID indicates module analysis view (null by default for Module Health Overview)
  const [activeModuleId, setActiveModuleId] = useState(null);
  const [selectedMetric, setSelectedMetric] = useState(null);

  // Benchmark Standards Toggle: 'standard' | 'custom' (defaults to 'standard' until custom standards CSV is imported)
  const [customStandardsMap, setCustomStandardsMap] = useState({});
  const [standardMode, setStandardMode] = useState('standard');

  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [toast, setToast] = useState(null);

  // System Connection State
  const [isSystemConnected, setIsSystemConnected] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [connectedSystemDetails, setConnectedSystemDetails] = useState(null);

  const activeModule = SF_MODULES.find((m) => m.id === activeModuleId) || null;
  const hasCustomStandards = Object.keys(customStandardsMap).length > 0;

  const handleSelectModule = (moduleId) => {
    setActiveModuleId(moduleId);
    setSelectedMetric(null);
  };

  const handleGoHome = () => {
    setActiveModuleId(null);
    setSelectedMetric(null);
  };

  const handleSelectStandardMode = (mode) => {
    if (mode === 'custom' && !hasCustomStandards) {
      handleShowWarning();
      return;
    }
    setStandardMode(mode);
  };

  const handleShowWarning = (msg) => {
    setToast({
      id: Date.now(),
      type: 'warning',
      message: msg || 'No Custom Standards uploaded. Please upload a Custom Standards CSV first before switching to custom mode.'
    });
  };

  const handleImportCustomStandards = (newStandardsMap) => {
    const updated = { ...customStandardsMap, ...newStandardsMap };
    setCustomStandardsMap(updated);
    setStandardMode('custom');
    try {
      localStorage.setItem('sf_custom_standards_map', JSON.stringify(updated));
    } catch {}
    setToast({
      id: Date.now(),
      type: 'success',
      message: `Custom standards successfully imported (${Object.keys(newStandardsMap).length} metrics updated). Switched to Custom Standards view.`
    });
  };

  const handleConnectSuccess = (details) => {
    setIsSystemConnected(true);
    setConnectedSystemDetails(details);
  };

  const handleDisconnect = () => {
    setIsSystemConnected(false);
    setConnectedSystemDetails(null);
  };

  return (
    <div className="app-container">
      {/* 1. Dark Top Header with YASH Logo & Success Factors Title */}
      <Navbar
        onGoHome={handleGoHome}
        onOpenConnectSystem={() => setIsModalOpen(true)}
        isConnected={isSystemConnected}
      />

      {/* 2. Sub-Ribbon: Shown when inside a module and NOT on the deep dive page */}
      {activeModule && !selectedMetric && (
        <ModuleRibbon
          modules={SF_MODULES}
          activeModuleId={activeModuleId}
          onSelectModule={handleSelectModule}
          onGoHome={handleGoHome}
          standardMode={standardMode}
          onSelectStandardMode={handleSelectStandardMode}
          onOpenUploadModal={() => setIsUploadModalOpen(true)}
          hasCustomStandards={hasCustomStandards}
          onShowWarning={handleShowWarning}
        />
      )}

      {/* 3. Main View Area: Render Full-Page Workspace for Deep Dive OR Standard Viewport */}
      {selectedMetric ? (
        <MetricDeepDivePage
          metric={selectedMetric}
          module={activeModule}
          onBack={() => {
            setSelectedMetric(null);
            window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
          }}
          standardMode={standardMode}
          customStandardsMap={customStandardsMap}
        />
      ) : (
        <main className="content-viewport">
          {activeModule ? (
            <ModuleAnalysisView
              module={activeModule}
              standardMode={standardMode}
              customStandardsMap={customStandardsMap}
              onSelectMetric={setSelectedMetric}
            />
          ) : (
            <HomeDashboard
              modules={SF_MODULES}
              onSelectModule={handleSelectModule}
            />
          )}
        </main>
      )}

      {/* 4. Connect SAP SuccessFactors System Modal */}
      <ConnectSystemModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        isConnected={isSystemConnected}
        onConnect={handleConnectSuccess}
        onDisconnect={handleDisconnect}
      />

      {/* 5. Upload Custom Standards CSV Modal */}
      <UploadCustomStandardsModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onImport={handleImportCustomStandards}
        module={activeModule}
      />

      {/* 6. Toast Notification (bottom-right) */}
      <ToastNotification
        toast={toast}
        onClose={() => setToast(null)}
      />
    </div>
  );
}

