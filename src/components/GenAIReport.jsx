import React, { useState } from 'react';

export default function GenAIReport({ module, onSelectMetric }) {
  const { benchmarks = [] } = module || {};

  // Filter Critical and At Risk metrics for the Issues Identified list
  const issueMetrics = benchmarks.filter(
    (b) => (b.status === 'Critical' || b.status === 'At Risk') && b.detailedAnalysis
  );

  // Manage accordion state: collapsed by default
  const [expandedIndex, setExpandedIndex] = useState(null);

  const toggleMetric = (idx) => {
    setExpandedIndex(expandedIndex === idx ? null : idx);
  };

  return (
    <div className="issues-identified-container">
      {/* Header with Title and Active Variances badge */}
      <div className="issues-column-header">
        <div className="issues-header-left">
          <div className="issues-header-icon-wrap" aria-hidden="true">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
              <polyline points="10 9 9 9 8 9" />
            </svg>
          </div>
          <h2 className="issues-column-title">Issues Identified</h2>
        </div>

        <div className="variances-pill-badge">
          {issueMetrics.length} Active Variances
        </div>
      </div>

      {/* List of Issue Cards */}
      {issueMetrics.length === 0 ? (
        <div className="healthy-state-report-callout">
          <div className="healthy-icon-pill">✓</div>
          <div>
            <h4 className="healthy-title">All Module Benchmarks Healthy</h4>
            <p className="healthy-desc">
              Every tracked metric in this module is operating within established SLA parameters. No active variances detected.
            </p>
          </div>
        </div>
      ) : (
        <div className="issue-cards-stack">
          {issueMetrics.map((metricRow, idx) => {
            const isCritical = metricRow.status === 'Critical';
            const isExpanded = expandedIndex === idx;
            const actions = metricRow.detailedAnalysis?.howToOvercome || [];
            const cardNumber = String(idx + 1).padStart(2, '0');

            return (
              <div
                key={idx}
                className={`issue-item-card ${isCritical ? 'issue-card-critical' : 'issue-card-at-risk'} ${isExpanded ? 'is-expanded' : ''}`}
              >
                {/* Main Card Header & Description Area */}
                <div className="issue-card-top-layout">
                  {/* Left Column: Number badge */}
                  <div className="issue-card-left-badge-col">
                    <div className={`issue-number-badge ${isCritical ? 'badge-num-critical' : 'badge-num-at-risk'}`}>
                      {cardNumber}
                    </div>
                  </div>

                  {/* Right Column: Title, Badge, Description */}
                  <div className="issue-card-main-col">
                    <div className="issue-card-title-row">
                      <h3 className="issue-metric-name">{metricRow.metric}</h3>
                      <span className={`pill-badge ${isCritical ? 'badge-critical' : 'badge-at-risk'}`}>
                        <span>{metricRow.status}</span>
                      </span>
                    </div>

                    <p className="issue-locus-desc">
                      {metricRow.detailedAnalysis?.whereItHappens || `${metricRow.category} processes within SuccessFactors.`}
                    </p>
                  </div>
                </div>

                {/* Bottom Full-Width Expandable Action Bar */}
                <button
                  type="button"
                  className={`issue-expand-bar-btn ${isExpanded ? 'is-open' : ''}`}
                  onClick={() => toggleMetric(idx)}
                  aria-expanded={isExpanded}
                >
                  <span className="expand-bar-text">
                    {isExpanded ? 'Why it is happening & Suggestions to improve' : 'Why it is happening & Suggestions to improve'}
                  </span>
                  <span className={`expand-chevron-icon ${isExpanded ? 'chevron-rotated' : ''}`} aria-hidden="true">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </span>
                </button>

                {/* Smooth Expandable Body: Root Cause & Suggestions */}
                {isExpanded && (
                  <div className="issue-expanded-drawer">
                    {/* Root Cause Section */}
                    <div className="drawer-subcard drawer-why-section">
                      <div className="drawer-subcard-header">
                        <span className="drawer-icon" aria-hidden="true">🔍</span>
                        <h4 className="drawer-subcard-title">Why It is Happening (Root Cause)</h4>
                      </div>
                      <p className="drawer-subcard-text">
                        {metricRow.detailedAnalysis?.whyItHappens}
                      </p>
                    </div>

                    {/* Suggestions Section */}
                    {actions.length > 0 && (
                      <div className="drawer-subcard drawer-how-section">
                        <div className="drawer-subcard-header">
                          <span className="drawer-icon" aria-hidden="true">💡</span>
                          <h4 className="drawer-subcard-title">Suggestions to Improve</h4>
                        </div>
                        <ul className="drawer-suggestions-list">
                          {actions.map((action, aIdx) => (
                            <li key={aIdx} className="drawer-suggestion-item">
                              <span className="drawer-step-num">{aIdx + 1}</span>
                              <span className="drawer-step-text">{action}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
