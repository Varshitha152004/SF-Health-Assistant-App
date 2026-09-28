import React from 'react';
import { CriticalTriangleIcon, RiskTriangleIcon } from './CriticalTriangleIcon';

// Icon mapping helper matching the screenshot's rounded colored icon squares
function ModuleIcon({ type }) {
  switch (type) {
    case 'users': // Employee Central (blue)
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
          <circle cx="9" cy="7" r="4"></circle>
          <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
          <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
        </svg>
      );
    case 'briefcase': // Recruitment (purple)
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
          <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
        </svg>
      );
    case 'user-plus': // Onboarding (green)
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
          <circle cx="8.5" cy="7" r="4"></circle>
          <line x1="20" y1="8" x2="20" y2="14"></line>
          <line x1="23" y1="11" x2="17" y2="11"></line>
        </svg>
      );
    case 'user-minus': // Offboarding (orange)
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
          <circle cx="8.5" cy="7" r="4"></circle>
          <line x1="23" y1="11" x2="17" y2="11"></line>
        </svg>
      );
    default:
      return null;
  }
}

export default function HomeDashboard({ modules, onSelectModule }) {
  // Compute executive metrics for Swiss business summary
  const criticalCount = modules.filter(m => m.status === 'Critical').length;
  const atRiskCount = modules.filter(m => m.status === 'At Risk').length;
  const totalMetrics = modules.reduce((acc, m) => acc + (m.benchmarks ? m.benchmarks.length : 0), 0);

  return (
    <div className="module-analysis-page home-dashboard-page">
      {/* Background Soft Wave Ribbon matching ModuleAnalysisView */}
      <div className="page-header-wave-bg" aria-hidden="true">
        <svg viewBox="0 0 1440 360" fill="none" preserveAspectRatio="none" className="header-wave-svg">
          {/* Layer 1: Broad soft blue ambient wave */}
          <path
            d="M0,40 C280,120 440,30 720,95 C1000,160 1200,80 1440,110 L1440,0 L0,0 Z"
            fill="url(#homeWaveGrad1)"
            opacity="0.8"
          />
          {/* Layer 2: Deeper flowing periwinkle ribbon */}
          <path
            d="M0,110 C220,180 480,90 760,150 C1040,210 1260,110 1440,160 L1440,0 L0,0 Z"
            fill="url(#homeWaveGrad2)"
            opacity="0.6"
          />
          {/* Layer 3: Cyan-blue accent swell */}
          <path
            d="M0,80 C360,160 620,60 920,120 C1220,180 1340,120 1440,100 L1440,0 L0,0 Z"
            fill="url(#homeWaveGrad3)"
            opacity="0.45"
          />
          <defs>
            <linearGradient id="homeWaveGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#bfdbfe" stopOpacity="0.9" />
              <stop offset="45%" stopColor="#c7d2fe" stopOpacity="0.65" />
              <stop offset="100%" stopColor="#e0e7ff" stopOpacity="0.25" />
            </linearGradient>
            <linearGradient id="homeWaveGrad2" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#93c5fd" stopOpacity="0.8" />
              <stop offset="50%" stopColor="#a5b4fc" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#e0f2fe" stopOpacity="0.1" />
            </linearGradient>
            <linearGradient id="homeWaveGrad3" x1="30%" y1="0%" x2="80%" y2="100%">
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
              Module Health Overview
            </h1>
          </div>
          <p className="report-subtitle">
            Real-time benchmark comparisons, SLA tracking, and diagnostic insights across your core SAP SuccessFactors modules.
          </p>
        </div>

        {/* Smooth Executive KPI Banner Strip */}
        <div className="swiss-kpi-strip" role="region" aria-label="Executive KPI Summary">
          <div className="kpi-strip-cell">
            <span className="kpi-cell-label">Active Modules</span>
            <div className="kpi-cell-val-row">
              <span className="kpi-cell-value">{modules.length}</span>
            </div>
            <span className="kpi-cell-sub">Core Human Resources Scope</span>
          </div>
          <div className="kpi-strip-divider"></div>
          <div className="kpi-strip-cell">
            <span className="kpi-cell-label">Critical Alerts</span>
            <div className="kpi-cell-val-row">
              <span className="kpi-cell-value text-critical">{criticalCount}</span>
              <div className="kpi-cell-mini-icon">
                <CriticalTriangleIcon size={18} />
              </div>
            </div>
            <span className="kpi-cell-sub">Immediate Attention Needed</span>
          </div>
          <div className="kpi-strip-divider"></div>
          <div className="kpi-strip-cell">
            <span className="kpi-cell-label">At-Risk Processes</span>
            <div className="kpi-cell-val-row">
              <span className="kpi-cell-value text-at-risk">{atRiskCount}</span>
              <div className="kpi-cell-mini-icon">
                <RiskTriangleIcon size={18} />
              </div>
            </div>
            <span className="kpi-cell-sub">SLA Variance Identified</span>
          </div>
          <div className="kpi-strip-divider"></div>
          <div className="kpi-strip-cell">
            <span className="kpi-cell-label">Monitored Metrics</span>
            <div className="kpi-cell-val-row">
              <span className="kpi-cell-value">{totalMetrics}</span>
              <div className="kpi-cell-mini-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <circle cx="12" cy="12" r="10" fill="#10b981" stroke="#059669" strokeWidth="1" />
                  <polyline points="8 12.5 11 15.5 16.5 9" stroke="#ffffff" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </div>
            <span className="kpi-cell-sub">Benchmark Comparisons</span>
          </div>
        </div>

        {/* 4 Smooth Module Cards Grid */}
        <div className="module-cards-row">
          {modules.map((mod) => {
            const isCritical = mod.status === 'Critical';
            return (
              <div 
                key={mod.id} 
                className={`overview-card card-theme-${mod.id}`}
                onClick={() => onSelectModule(mod.id)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && onSelectModule(mod.id)}
              >
                {/* Card Header: Module Title on Left, Icon on Right */}
                <div className="card-top-meta">
                  <h3 className="card-module-title">{mod.name}</h3>
                  <div 
                    className={`card-icon-box card-icon-${mod.id}`} 
                  >
                    <ModuleIcon type={mod.iconType} />
                  </div>
                </div>

                {/* Short Description */}
                <p className="card-module-desc">{mod.description}</p>

                {/* KPI Count Micro-pill */}
                <div className="card-kpi-count-tag">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <line x1="18" y1="20" x2="18" y2="10"></line>
                    <line x1="12" y1="20" x2="12" y2="4"></line>
                    <line x1="6" y1="20" x2="6" y2="14"></line>
                  </svg>
                  <span>{mod.benchmarks?.length || 0} Benchmark Metrics</span>
                </div>

                {/* Footer: Status Pill on left, View Analysis link on right */}
                <div className="card-bottom-actions">
                  <span className={`pill-badge ${isCritical ? 'badge-critical' : mod.status === 'Healthy' ? 'badge-healthy' : 'badge-at-risk'}`}>
                    <span>{mod.status}</span>
                  </span>

                  <span 
                    className="view-analysis-link"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectModule(mod.id);
                    }}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.stopPropagation();
                        onSelectModule(mod.id);
                      }
                    }}
                  >
                    <span>View Analysis</span>
                    <svg className="view-arrow-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                      <polyline points="12 5 19 12 12 19"></polyline>
                    </svg>
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
