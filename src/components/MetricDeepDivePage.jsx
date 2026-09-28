import React, { useEffect, useState, useRef } from 'react';
import { getBrdPlan } from '../utils/brdPlanData';
import { generateMetricBrdPdf } from '../utils/pdfGenerator';
import { CriticalTriangleIcon, RiskTriangleIcon } from './CriticalTriangleIcon';

export default function MetricDeepDivePage({
  metric,
  module,
  onBack,
  standardMode = 'standard',
  customStandardsMap = {}
}) {
  const [activeSection, setActiveSection] = useState('section-overview');
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const contentScrollRef = useRef(null);
  const isAutoScrollingRef = useRef(false);
  const scrollTimeoutRef = useRef(null);

  // Lock outer window scrolling so left panel and workspace header stay 100% fixed
  useEffect(() => {
    document.body.classList.add('deepdive-active');
    document.documentElement.classList.add('deepdive-active');
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });

    return () => {
      document.body.classList.remove('deepdive-active');
      document.documentElement.classList.remove('deepdive-active');
    };
  }, []);

  // When entering the deep dive page or switching metrics, reset scroll to top
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    if (contentScrollRef.current) {
      contentScrollRef.current.scrollTop = 0;
    }
  }, [metric]);

  // Keyboard navigation: Escape key returns back to Diagnostic Report page
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onBack && onBack();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
    };
  }, [onBack]);

  // Active section tracking on scroll (only when user manually scrolls content pane)
  const handleScroll = () => {
    if (isAutoScrollingRef.current) return;
    if (!contentScrollRef.current) return;
    const container = contentScrollRef.current;
    const containerTop = container.getBoundingClientRect().top;

    const sections = [
      'section-overview',
      'section-root-cause',
      'section-trend',
      'section-impact',
      'section-overcome',
      'section-execution',
      'section-systems',
      'section-references'
    ];

    for (let i = sections.length - 1; i >= 0; i--) {
      const el = document.getElementById(sections[i]);
      if (el) {
        const rect = el.getBoundingClientRect();
        if (rect.top - containerTop <= 120) {
          setActiveSection(sections[i]);
          break;
        }
      }
    }
  };

  // Scroll to section when clicked on left navigation item
  const scrollToSection = (sectionId) => {
    setActiveSection(sectionId);
    const container = contentScrollRef.current;
    const targetEl = document.getElementById(sectionId);
    if (targetEl && container) {
      isAutoScrollingRef.current = true;
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);

      const containerRect = container.getBoundingClientRect();
      const targetRect = targetEl.getBoundingClientRect();
      const targetScrollTop = targetRect.top - containerRect.top + container.scrollTop - 14;

      container.scrollTo({ top: Math.max(0, targetScrollTop), behavior: 'smooth' });

      scrollTimeoutRef.current = setTimeout(() => {
        isAutoScrollingRef.current = false;
      }, 700);
    }
  };

  // If user scrolls mouse wheel over left panel, redirect scroll to the right content pane
  const handleNavWheel = (e) => {
    if (contentScrollRef.current) {
      contentScrollRef.current.scrollTop += e.deltaY;
    }
  };

  if (!metric) return null;

  const { detailedAnalysis, metric: metricName, category, company, standard, status, variance } = metric;
  const brdPlan = getBrdPlan(metric);

  const isCritical = status === 'Critical';
  const customStdVal = customStandardsMap?.[metricName?.toLowerCase()?.trim()];
  const displayStandard = (standardMode === 'custom' && customStdVal) ? customStdVal : standard;

  const handleDownloadPDF = () => {
    setIsDownloading(true);
    setTimeout(() => {
      try {
        generateMetricBrdPdf(metric);
        setIsDownloading(false);
        setDownloadSuccess(true);
        setTimeout(() => setDownloadSuccess(false), 3000);
      } catch (err) {
        console.error('PDF Generation Error:', err);
        setIsDownloading(false);
      }
    }, 350);
  };

  const navItems = [
    { id: 'section-overview', label: 'Overview' },
    { id: 'section-root-cause', label: 'Root Cause' },
    { id: 'section-trend', label: 'Trend Analysis' },
    { id: 'section-impact', label: 'Impact' },
    { id: 'section-overcome', label: 'How to Overcome' },
    { id: 'section-execution', label: 'Execution Plan' },
    { id: 'section-systems', label: 'Related Systems' },
    { id: 'section-references', label: 'References' }
  ];

  // Default quarterly trend points if not defined
  const trendPoints = detailedAnalysis?.trendAnalysis?.points || [
    { period: 'Q1', value: '3.6 Hours' },
    { period: 'Q2', value: '3.7 Hours' },
    { period: 'Q3', value: '4.5 Hours' },
    { period: 'Q4 (Current)', value: company || '4.2 Hours' }
  ];

  return (
    <div className="enterprise-deepdive-fullpage">
      {/* Compact Dark Navy Enterprise Header spanning full width */}
      <header className="workspace-header">
        <div className="workspace-header-left">
          {/* Status Icon: Red Triangle for Critical, Yellow Triangle for At-Risk */}
          <div className={`workspace-status-icon ${isCritical ? 'status-icon-critical' : 'status-icon-at-risk'}`}>
            {isCritical ? (
              <CriticalTriangleIcon size={34} />
            ) : (
              <RiskTriangleIcon size={34} />
            )}
          </div>

          <div className="workspace-header-text">
            <div className="workspace-eyebrow">
              <span>{(category || 'SECURITY & IAM SLA').toUpperCase()}</span>
              <span className="eyebrow-dot">•</span>
              <span>DIAGNOSTIC ROOT CAUSE &amp; TREND DEEP DIVE</span>
            </div>
            <h1 className="workspace-main-title">
              {metricName}
            </h1>
          </div>
        </div>

        <div className="workspace-header-right">
          <span className={`workspace-status-badge ${isCritical ? 'badge-critical-style' : 'badge-at-risk-style'}`}>
            {status}
          </span>
          <button
            type="button"
            className="workspace-close-btn"
            onClick={onBack}
            aria-label="Back to Diagnostic Report"
            title="Back to Diagnostic Report (Esc)"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
      </header>

      {/* INTERIOR BODY: Left Contextual Navigation + Independently Scrollable Main Pane */}
      <div className="workspace-body-layout">
            {/* Left Contextual Navigation Panel - 100% Fixed */}
            <nav className="workspace-nav-panel" aria-label="Diagnostic Navigation" onWheel={handleNavWheel}>
              <div className="workspace-nav-list">
                {navItems.map((item) => {
                  const isActive = activeSection === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      className={`workspace-nav-item ${isActive ? 'active' : ''}`}
                      onClick={() => scrollToSection(item.id)}
                      aria-current={isActive ? 'true' : undefined}
                    >
                      <span className="nav-item-text">{item.label}</span>
                      {!isActive && (
                        <svg className="nav-item-chevron" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="9 18 15 12 9 6"></polyline>
                        </svg>
                      )}
                    </button>
                  );
                })}
              </div>
            </nav>

            {/* Main Content Area (Scrollable Independently) */}
            <main
              className="workspace-content-pane"
              ref={contentScrollRef}
              onScroll={handleScroll}
            >
              {/* TOP KPI COMPARISON SECTION */}
              <section id="section-overview" className="workspace-section kpi-comparison-strip">
                <div className="kpi-info-cell">
                  <span className="kpi-cell-label">CURRENT COMPANY VALUE</span>
                  <span className="kpi-cell-value company-val">{company}</span>
                </div>

                <div className="kpi-cell-separator" aria-hidden="true"></div>

                <div className="kpi-info-cell">
                  <span className="kpi-cell-label">BENCHMARK STANDARD</span>
                  <span className="kpi-cell-value standard-val">{displayStandard}</span>
                </div>

                <div className="kpi-cell-separator" aria-hidden="true"></div>

                <div className="kpi-info-cell">
                  <span className="kpi-cell-label">VARIANCE GAP</span>
                  <span className={`kpi-cell-value variance-val ${isCritical ? 'critical-text' : 'at-risk-text'}`}>
                    {isCritical && <span className="variance-arrow">↑ </span>}
                    {variance}
                  </span>
                </div>
              </section>

              {detailedAnalysis ? (
                <>
                  {/* SECTION 01 — WHY IS IT HAPPENING? */}
                  <section id="section-root-cause" className="workspace-section enterprise-section-block">
                    <div className="section-header-row">
                      <div className="section-seq-circle">01</div>
                      <div className="section-title-wrap">
                        <h2 className="section-heading">Why Is It Happening?</h2>
                        <p className="section-subheading">Root Cause Analysis &amp; Architecture Bottlenecks</p>
                      </div>
                    </div>
                    <div className="section-body-text">
                      <p>{detailedAnalysis.whyItHappens}</p>
                    </div>
                  </section>

                  {/* SECTION 02 — TREND ANALYSIS */}
                  <section id="section-trend" className="workspace-section enterprise-section-block">
                    <div className="section-header-row">
                      <div className="section-seq-circle">02</div>
                      <div className="section-title-wrap">
                        <h2 className="section-heading">Trend Analysis</h2>
                        <p className="section-subheading">Quarterly Progression &amp; Performance Trajectory</p>
                      </div>
                    </div>
                    <div className="section-body-text">
                      <p className="trend-summary-copy">
                        {detailedAnalysis.trendAnalysis?.summary ||
                          'Average revocation time has consistently breached the 1-hour critical audit standard across all 4 quarters.'}
                      </p>

                      {/* 4 Compact Enterprise Metric Cells Side-by-Side */}
                      <div className="quarterly-metric-strip">
                        {trendPoints.map((pt, pIdx) => (
                          <div key={pIdx} className="quarterly-metric-cell">
                            <span className="quarter-label">{pt.period}</span>
                            <span className="quarter-value">{pt.value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </section>

                  {/* SECTION 03 — BUSINESS IMPACT */}
                  <section id="section-impact" className="workspace-section enterprise-section-block">
                    <div className="section-header-row">
                      <div className="section-seq-circle">03</div>
                      <div className="section-title-wrap">
                        <h2 className="section-heading">How Is It Affecting the Business?</h2>
                        <p className="section-subheading">Downstream SLA, Payroll &amp; Operational Impact</p>
                      </div>
                    </div>
                    <div className="section-body-text">
                      <p>{detailedAnalysis.howItEffects}</p>
                    </div>
                  </section>

                  {/* SECTION 04 — HOW TO OVERCOME */}
                  <section id="section-overcome" className="workspace-section enterprise-section-block">
                    <div className="section-header-row">
                      <div className="section-seq-circle">04</div>
                      <div className="section-title-wrap">
                        <div className="section-title-tag-row">
                          <h2 className="section-heading">How to Overcome</h2>
                          <span className="brd-action-tag">BRD PLAN OF ACTION</span>
                        </div>
                        <p className="section-subheading">
                          Resource allocation and execution roadmap to eliminate variance gap.
                        </p>
                      </div>
                    </div>

                    {/* Balanced Manpower & Timeline Information Blocks */}
                    <div className="resource-allocation-grid">
                      <div className="resource-col">
                        <h3 className="resource-group-label">MANPOWER REQUIRED</h3>
                        <div className="resource-roles-list">
                          {brdPlan?.workforceRequired?.map((wf, wIdx) => (
                            <div key={wIdx} className="resource-role-item">
                              <span className="role-spec">
                                <strong>{wf.count}×</strong> {wf.role}
                              </span>
                              <span className="role-hours-badge">{wf.hours}</span>
                            </div>
                          )) || (
                            <>
                              <div className="resource-role-item">
                                <span className="role-spec"><strong>1×</strong> SAP BTP Event Mesh / Cloud Integration Architect</span>
                                <span className="role-hours-badge">40 Person-Hours</span>
                              </div>
                              <div className="resource-role-item">
                                <span className="role-spec"><strong>1×</strong> Enterprise IAM &amp; IT Security Engineer</span>
                                <span className="role-hours-badge">30 Person-Hours</span>
                              </div>
                              <div className="resource-role-item">
                                <span className="role-spec"><strong>1×</strong> IT Audit &amp; Compliance Officer</span>
                                <span className="role-hours-badge">15 Person-Hours</span>
                              </div>
                            </>
                          )}
                        </div>
                      </div>

                      <div className="resource-col-divider" aria-hidden="true"></div>

                      <div className="timeline-effort-col">
                        <h3 className="resource-group-label">EST. TIMELINE &amp; EFFORT</h3>
                        <div className="timeline-summary-block">
                          <div className="timeline-primary-metric">
                            <span className="timeline-duration">{brdPlan?.timeline || '2 Weeks'}</span>
                            <span className="timeline-cycle-note">{brdPlan?.sprintCycle || 'Sprint Cycle 1'}</span>
                          </div>
                          <div className="effort-hours-strip">
                            <span className="effort-hours-label">Total Effort:</span>
                            <span className="effort-hours-value">{brdPlan?.totalEffortHours || 85} Total Hours</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </section>

                  {/* EXECUTION PLAN & WORKSTREAMS */}
                  <section id="section-execution" className="workspace-section enterprise-section-block">
                    <div className="section-header-row">
                      <div className="section-title-wrap no-circle">
                        <h2 className="section-heading uppercase-title">EXECUTION PLAN &amp; WORKSTREAMS</h2>
                        <p className="section-subheading">Step-by-step remediation milestones and engineering tasks.</p>
                      </div>
                    </div>

                    <div className="execution-workstreams-list">
                      {(detailedAnalysis.howToOvercome || []).map((step, sIdx) => (
                        <div key={sIdx} className="execution-workstream-row">
                          <span className="workstream-seq">{String(sIdx + 1).padStart(2, '0')}</span>
                          <div className="workstream-desc">{step}</div>
                        </div>
                      ))}
                    </div>
                  </section>

                  {/* TARGET OUTCOME BANNER */}
                  {brdPlan?.expectedOutcome && (
                    <div className="target-outcome-banner">
                      <span className="target-outcome-label">TARGET OUTCOME</span>
                      <p className="target-outcome-copy">“{brdPlan.expectedOutcome}”</p>
                    </div>
                  )}

                  {/* RELATED SYSTEMS & INTEGRATIONS */}
                  <section id="section-systems" className="workspace-section enterprise-section-block">
                    <div className="section-header-row">
                      <div className="section-title-wrap no-circle">
                        <h2 className="section-heading uppercase-title">RELATED SYSTEMS &amp; INTEGRATIONS</h2>
                        <p className="section-subheading">Connected infrastructure nodes impacted by this metric.</p>
                      </div>
                    </div>
                    <div className="enterprise-tags-row">
                      <span className="system-pill-tag">SAP SuccessFactors Core</span>
                      <span className="system-pill-tag">SAP BTP Event Mesh</span>
                      <span className="system-pill-tag">Microsoft Active Directory (AD)</span>
                      <span className="system-pill-tag">Okta Identity Cloud</span>
                      <span className="system-pill-tag">SAP Integration Suite</span>
                    </div>
                  </section>

                  {/* REFERENCES & GOVERNANCE */}
                  <section id="section-references" className="workspace-section enterprise-section-block">
                    <div className="section-header-row">
                      <div className="section-title-wrap no-circle">
                        <h2 className="section-heading uppercase-title">REFERENCES &amp; GOVERNANCE</h2>
                        <p className="section-subheading">Enterprise compliance standards and regulatory guidelines.</p>
                      </div>
                    </div>
                    <ul className="references-clean-list">
                      <li>SOC-2 Type II Trust Services Criteria CC6.1 (Logical Access &amp; Revocation Controls)</li>
                      <li>ISO/IEC 27001:2022 Annex A.9.2.6 (Removal or Adjustment of Access Rights)</li>
                      <li>SAP SuccessFactors Implementation Benchmark Governance Framework v4.2</li>
                    </ul>
                  </section>
                </>
              ) : (
                <div className="healthy-state-workspace-message">
                  <p>This metric is operating within standard enterprise benchmark tolerances.</p>
                </div>
              )}
            </main>
          </div>

          {/* FOOTER: Fixed Enterprise Footer */}
          <footer className="workspace-footer">
            <div className="workspace-footer-left">
              <span>SAP SuccessFactors Enterprise Diagnostic Intelligence</span>
              <span className="footer-dot">•</span>
              <span>BRD Implementation Plan</span>
            </div>

            <div className="workspace-footer-right">
              <button
                type="button"
                className={`btn-enterprise-download ${downloadSuccess ? 'downloaded' : ''}`}
                onClick={handleDownloadPDF}
                disabled={isDownloading}
                title="Download Business Requirements Document (PDF)"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                  <polyline points="7 10 12 15 17 10"></polyline>
                  <line x1="12" y1="15" x2="12" y2="3"></line>
                </svg>
                <span>
                  {downloadSuccess
                    ? 'Downloaded (PDF) ✓'
                    : isDownloading
                      ? 'Generating PDF...'
                      : 'Download BRD Plan (PDF)'}
                </span>
              </button>
            </div>
          </footer>
    </div>
  );
}
