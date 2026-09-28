import React, { useState } from 'react';

export default function ModuleRibbon({
  modules,
  activeModuleId,
  onSelectModule,
  onGoHome,
  standardMode = 'standard',
  onSelectStandardMode,
  onOpenUploadModal,
  hasCustomStandards = false,
  onShowWarning
}) {
  const [isShaking, setIsShaking] = useState(false);
  const activeModule = modules.find(m => m.id === activeModuleId);

  const triggerShake = () => {
    setIsShaking(true);
    setTimeout(() => setIsShaking(false), 500);
  };

  const handleToggleClick = (e) => {
    e?.stopPropagation?.();
    if (standardMode === 'standard') {
      if (!hasCustomStandards) {
        triggerShake();
        if (onShowWarning) {
          onShowWarning('File must be uploaded and validated before Custom Standards can be activated. Please upload your standards document first.');
        }
        return;
      }
      onSelectStandardMode('custom');
    } else {
      onSelectStandardMode('standard');
    }
  };

  const handleCustomClick = (e) => {
    e?.stopPropagation?.();
    if (!hasCustomStandards) {
      triggerShake();
      if (onShowWarning) {
        onShowWarning('File must be uploaded and validated before Custom Standards can be activated. Please upload your standards document first.');
      }
      return;
    }
    onSelectStandardMode('custom');
  };

  const handleIndustrialClick = (e) => {
    e?.stopPropagation?.();
    onSelectStandardMode('standard');
  };

  return (
    <nav className="dark-sub-ribbon" aria-label="Module Navigation Ribbon">
      <div className="dark-sub-ribbon-inner">
        {/* Back Button */}
        <button
          className="ribbon-back-button"
          onClick={onGoHome}
          title="Back to Overview"
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
          <span>Back</span>
        </button>

        <div className="ribbon-v-divider"></div>

        {/* Module Pill Tabs */}
        <div className="ribbon-tabs-list">
          {modules.map((mod) => {
            const isActive = mod.id === activeModuleId;
            return (
              <button
                key={mod.id}
                onClick={() => onSelectModule(mod.id)}
                className={`ribbon-tab-btn ${isActive ? 'active' : ''}`}
                aria-pressed={isActive}
              >
                {mod.name}
              </button>
            );
          })}
        </div>

        {/* Right Area: Status Badge + Industrial vs. Custom Standards Switch + Upload Button */}
        <div className="ribbon-right-controls">
          {activeModule && (
            <div className="ribbon-status-area">
              <span className="ribbon-status-label">Status:</span>
              <span className={`pill-badge ${activeModule.status === 'Critical' ? 'badge-critical' : activeModule.status === 'Healthy' ? 'badge-healthy' : 'badge-at-risk'}`}>
                {activeModule.status}
              </span>
            </div>
          )}

          {/* Upload / Update Custom Standards Trigger */}
          <button
            type="button"
            className="btn-ribbon-upload"
            onClick={onOpenUploadModal}
            title={hasCustomStandards ? "Update Custom Standards CSV" : "Upload Custom Standards CSV"}
            aria-label={hasCustomStandards ? "Update Custom Standards CSV" : "Upload Custom Standards CSV"}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="17 8 12 3 7 8"></polyline>
              <line x1="12" y1="3" x2="12" y2="15"></line>
            </svg>
            <span>{hasCustomStandards ? 'Update Standards' : 'Upload Standards'}</span>
          </button>

          {/* External Labels: Industrial Standards & Custom Standards with Toggle Switch */}
          <div
            className="standards-toggle-wrapper"
            aria-label="Standards Selector"
            onClick={handleToggleClick}
            style={{ cursor: 'pointer' }}
          >
            <span
              className={`standards-toggle-label ${standardMode === 'standard' ? 'active' : ''}`}
              onClick={handleIndustrialClick}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.stopPropagation();
                  handleIndustrialClick(e);
                }
              }}
              title="Industrial Standards"
            >
              Industrial Standards
            </span>

            <button
              type="button"
              className={`standards-switch-btn ${standardMode === 'custom' ? 'checked' : ''} ${!hasCustomStandards ? 'is-locked' : ''} ${isShaking ? 'shake-anim' : ''}`}
              onClick={handleToggleClick}
              role="switch"
              aria-checked={standardMode === 'custom'}
              title={hasCustomStandards ? "Toggle between Industrial and Custom Standards" : "Upload Custom Standards document to enable Custom mode"}
              aria-label="Toggle between Industrial Standards and Custom Standards"
            >
              <span className="standards-switch-thumb"></span>
            </button>

            <span
              className={`standards-toggle-label ${standardMode === 'custom' ? 'active' : ''} ${!hasCustomStandards ? 'is-locked' : ''}`}
              onClick={handleCustomClick}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.stopPropagation();
                  handleCustomClick(e);
                }
              }}
              title={hasCustomStandards ? 'Custom Standards Active' : 'Custom Standards (Upload required)'}
            >
              Custom Standards
            </span>
          </div>
        </div>
      </div>
    </nav>
  );
}

