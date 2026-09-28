import React, { useState, useEffect } from 'react';
import GenAIReport from './GenAIReport';
import ComparisonTable from './ComparisonTable';
import MetricDeepDivePage from './MetricDeepDivePage';
import { CriticalTriangleIcon, RiskTriangleIcon } from './CriticalTriangleIcon';

export default function ModuleAnalysisView({
  module,
  standardMode = 'custom',
  customStandardsMap = {},
  onSelectMetric
}) {
  if (!module) return null;

  const { benchmarks = [], aiReport, name } = module;

  const criticalMetrics = benchmarks.filter((b) => b.status === 'Critical');
  const atRiskMetrics = benchmarks.filter((b) => b.status === 'At Risk');
  const healthyMetrics = benchmarks.filter((b) => b.status === 'Healthy');

  const criticalCount = criticalMetrics.length;
  const atRiskCount = atRiskMetrics.length;
  const healthyCount = healthyMetrics.length;

  const summaryText = aiReport?.summary ||
    `${name} processes show critical security exposure with Access & Asset Revocation taking 4.2 hours (standard ≤ 1.0 hour). Automated webhook de-provisioning via SAP BTP Event Mesh is required immediately to ensure SOC-2 compliance.`;

  return (
    <div className="module-analysis-page">
      {/* Background Soft Blue Ethereal Wave (Matching Reference Design) */}
      <div className="page-header-wave-bg" aria-hidden="true">
        <svg viewBox="0 0 1440 360" fill="none" preserveAspectRatio="none" className="header-wave-svg">
          {/* Layer 1: Broad soft blue ambient wave */}
          <path
            d="M0,40 C280,120 440,30 720,95 C1000,160 1200,80 1440,110 L1440,0 L0,0 Z"
            fill="url(#waveGrad1)"
            opacity="0.8"
          />
          {/* Layer 2: Deeper flowing periwinkle ribbon */}
          <path
            d="M0,110 C220,180 480,90 760,150 C1040,210 1260,110 1440,160 L1440,0 L0,0 Z"
            fill="url(#waveGrad2)"
            opacity="0.6"
          />
          {/* Layer 3: Cyan-blue accent swell */}
          <path
            d="M0,80 C360,160 620,60 920,120 C1220,180 1340,120 1440,100 L1440,0 L0,0 Z"
            fill="url(#waveGrad3)"
            opacity="0.45"
          />
          <defs>
            <linearGradient id="waveGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#bfdbfe" stopOpacity="0.9" />
              <stop offset="45%" stopColor="#c7d2fe" stopOpacity="0.65" />
              <stop offset="100%" stopColor="#e0e7ff" stopOpacity="0.25" />
            </linearGradient>
            <linearGradient id="waveGrad2" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#93c5fd" stopOpacity="0.8" />
              <stop offset="50%" stopColor="#a5b4fc" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#e0f2fe" stopOpacity="0.1" />
            </linearGradient>
            <linearGradient id="waveGrad3" x1="30%" y1="0%" x2="80%" y2="100%">
              <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.4" />
              <stop offset="60%" stopColor="#818cf8" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#c084fc" stopOpacity="0.05" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      <div className="module-analysis-content-wrap">
        {/* Page Main Heading */}
        <div className="report-header-block">
          <div className="report-title-row">
            <h1 className="report-main-title">
              AI Diagnostic Report
            </h1>
          </div>
          <p className="report-subtitle">
            Analyze your SuccessFactors configuration against SAP best practices and industry standards.
          </p>
        </div>

        {/* Executive Summary & 3 KPI Cards Area */}
        <section className="executive-summary-section" aria-label="Executive Summary and KPI Highlights">
          {/* Left: Premium Executive Summary Card */}
          <div className="executive-summary-card">
            <div className="exec-card-left-icon">
              <div className="exec-icon-box">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="16" y1="13" x2="8" y2="13" />
                  <line x1="16" y1="17" x2="8" y2="17" />
                  <polyline points="10 9 9 9 8 9" />
                </svg>
              </div>
            </div>

            <div className="exec-card-content">
              <div className="exec-card-heading-tag">
                EXECUTIVE SUMMARY • {criticalCount} CRITICAL, {atRiskCount} AT RISK
              </div>
              <p className="exec-card-body-text">
                {summaryText}
              </p>
            </div>
          </div>

          {/* Right: Three KPI Status Cards */}
          <div className="executive-kpi-cards-grid">
            {/* Card 1: Critical Issue - Red Alert Triangle */}
            <div className="kpi-status-card kpi-card-critical">
              <div className="kpi-icon-bubble bubble-critical">
                <CriticalTriangleIcon size={18} />
              </div>
              <div className="kpi-card-val-number">{criticalCount}</div>
              <div className="kpi-card-title">Critical Issue{criticalCount !== 1 ? 's' : ''}</div>
              <div className="kpi-card-subtitle">Requires immediate action</div>
            </div>

            {/* Card 2: At Risk Issues - Amber Warning Triangle */}
            <div className="kpi-status-card kpi-card-at-risk">
              <div className="kpi-icon-bubble bubble-at-risk">
                <RiskTriangleIcon size={18} />
              </div>
              <div className="kpi-card-val-number">{atRiskCount}</div>
              <div className="kpi-card-title">At Risk Issue{atRiskCount !== 1 ? 's' : ''}</div>
              <div className="kpi-card-subtitle">Need attention</div>
            </div>

            {/* Card 3: Healthy / Safe Metric - Success Checkmark */}
            <div className="kpi-status-card kpi-card-healthy">
              <div className="kpi-icon-bubble bubble-healthy">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <circle cx="12" cy="12" r="10" fill="#10b981" stroke="#059669" strokeWidth="1" />
                  <polyline points="8 12.5 11 15.5 16.5 9" stroke="#ffffff" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div className="kpi-card-val-number">{healthyCount}</div>
              <div className="kpi-card-title">Healthy Metric{healthyCount !== 1 ? 's' : ''}</div>
              <div className="kpi-card-subtitle">Performing well</div>
            </div>
          </div>
        </section>

        {/* Two-Column Layout: Left (Issues Identified) vs Right (Company vs Standards Table) */}
        <div className="analysis-view-grid">
          {/* Left Column: Issues Identified (Cards 01, 02, 03) */}
          <section className="analysis-grid-col" aria-label="Issues Identified">
            <GenAIReport
              module={module}
              onSelectMetric={onSelectMetric}
            />
          </section>

          {/* Right Column: Company vs. Custom Standards */}
          <section className="analysis-grid-col" aria-label="Company vs Standards">
            <ComparisonTable
              module={module}
              standardMode={standardMode}
              onSelectMetric={onSelectMetric}
              customStandardsMap={customStandardsMap}
            />
          </section>
        </div>
      </div>
    </div>
  );
}
