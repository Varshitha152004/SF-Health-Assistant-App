import React from 'react';
import MetricDeepDivePage from './MetricDeepDivePage';

export default function MetricAnalysisModal({ metric, onClose, module, standardMode, customStandardsMap }) {
  if (!metric) return null;
  return (
    <MetricDeepDivePage
      metric={metric}
      module={module}
      onBack={onClose}
      standardMode={standardMode}
      customStandardsMap={customStandardsMap}
    />
  );
}
