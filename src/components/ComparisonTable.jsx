import React, { useState } from 'react';

export default function ComparisonTable({
  module,
  standardMode = 'standard',
  onSelectMetric,
  customStandardsMap = {}
}) {
  const { benchmarks = [] } = module || {};
  const [filterMode, setFilterMode] = useState('all'); // 'all' | 'critical' | 'at-risk' | 'healthy'

  const isCustom = standardMode === 'custom';

  const criticalBenchmarks = benchmarks.filter((b) => b.status === 'Critical');
  const atRiskBenchmarks = benchmarks.filter((b) => b.status === 'At Risk');
  const healthyBenchmarks = benchmarks.filter((b) => b.status === 'Healthy');

  const criticalCount = criticalBenchmarks.length;
  const atRiskCount = atRiskBenchmarks.length;
  const healthyCount = healthyBenchmarks.length;

  // Filtered rows for table display
  const displayRows = benchmarks.filter((row) => {
    if (filterMode === 'critical') return row.status === 'Critical';
    if (filterMode === 'at-risk') return row.status === 'At Risk';
    if (filterMode === 'healthy') return row.status === 'Healthy';
    return true;
  });

  const getBadgeClass = (status) => {
    const s = String(status || '').trim().toLowerCase();
    if (s === 'critical') return 'badge-critical';
    if (s === 'at risk' || s === 'at-risk' || s === 'risk') return 'badge-at-risk';
    if (s === 'healthy') return 'badge-healthy';
    return 'badge-at-risk';
  };

  const getVarianceClass = (status) => {
    const s = String(status || '').trim().toLowerCase();
    if (s === 'critical') return 'variance-critical';
    if (s === 'at risk' || s === 'at-risk' || s === 'risk') return 'variance-at-risk';
    if (s === 'healthy') return 'variance-healthy';
    return 'variance-at-risk';
  };

  return (
    <div className="comparison-card-panel">
      {/* Header with Title and Filter Pills */}
      <div className="comparison-card-header">
        <div className="comparison-card-title-group">
          <div className="comparison-scale-icon" aria-hidden="true">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 6h18" />
              <path d="M12 3v18" />
              <path d="m19 6 3 6a3 3 0 0 1-6 0l3-6" />
              <path d="m5 6 3 6a3 3 0 0 1-6 0l3-6" />
              <path d="M8 21h8" />
            </svg>
          </div>
          <h2 className="comparison-card-title">
            {isCustom ? 'Company vs. Custom Standards' : 'Company vs. Industry Standards'}
          </h2>
        </div>

        {/* Filter Pills */}
        <div className="comparison-filter-pills" role="tablist" aria-label="Filter Metrics">
          <button
            type="button"
            className={`comp-filter-pill ${filterMode === 'all' ? 'is-active' : ''}`}
            onClick={() => setFilterMode('all')}
          >
            All ({benchmarks.length})
          </button>
          <button
            type="button"
            className={`comp-filter-pill pill-critical ${filterMode === 'critical' ? 'is-active' : ''}`}
            onClick={() => setFilterMode('critical')}
          >
            Critical ({criticalCount})
          </button>
          <button
            type="button"
            className={`comp-filter-pill pill-at-risk ${filterMode === 'at-risk' ? 'is-active' : ''}`}
            onClick={() => setFilterMode('at-risk')}
          >
            At Risk ({atRiskCount})
          </button>
          <button
            type="button"
            className={`comp-filter-pill pill-healthy ${filterMode === 'healthy' ? 'is-active' : ''}`}
            onClick={() => setFilterMode('healthy')}
          >
            Healthy ({healthyCount})
          </button>
        </div>
      </div>

      {/* Benchmark Comparison Table */}
      <div className="enterprise-table-container">
        <table className="enterprise-benchmark-table">
          <thead>
            <tr>
              <th scope="col" className="col-metric-name">METRIC NAME</th>
              <th scope="col" className="col-company">OUR COMPANY</th>
              <th scope="col" className="col-standard">
                {isCustom ? 'CUSTOM STANDARD' : 'INDUSTRY STANDARD'}
              </th>
              <th scope="col" className="col-status text-center">HEALTH STATUS</th>
              <th scope="col" className="col-variance text-center">VARIANCE</th>
              <th scope="col" className="col-analysis text-right">ANALYSIS</th>
            </tr>
          </thead>
          <tbody>
            {displayRows.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', padding: '24px', color: '#64748b' }}>
                  No metrics match the selected filter.
                </td>
              </tr>
            ) : (
              displayRows.map((row, idx) => {
                const customStdVal = customStandardsMap[row.metric.toLowerCase().trim()];
                const displayStandard = (isCustom && customStdVal) ? customStdVal : row.standard;

                const isHealthy = String(row.status || '').trim().toLowerCase() === 'healthy';

                return (
                  <tr
                    key={idx}
                    className={`benchmark-data-row ${isHealthy ? 'row-healthy' : 'row-actionable'}`}
                    onClick={isHealthy ? undefined : () => onSelectMetric && onSelectMetric(row)}
                    role={isHealthy ? undefined : 'button'}
                    tabIndex={isHealthy ? undefined : 0}
                    onKeyDown={(e) => {
                      if (!isHealthy && (e.key === 'Enter' || e.key === ' ')) {
                        e.preventDefault();
                        onSelectMetric && onSelectMetric(row);
                      }
                    }}
                    title={isHealthy ? undefined : `Click to open Deep Dive Diagnostic Plan for ${row.metric}`}
                  >
                    {/* Metric Name: Clean, premium typography without lock/icon boxes */}
                    <td className="cell-metric-name">
                      <div className="metric-text-group">
                        <span className="metric-name-title">{row.metric}</span>
                        <span className="metric-category-tag">{row.category}</span>
                      </div>
                    </td>

                    {/* Our Company */}
                    <td className="cell-company">
                      <span className="company-metric-value">{row.company}</span>
                    </td>

                    {/* Industry / Custom Standard */}
                    <td className="cell-standard">
                      <span className="standard-metric-value">{displayStandard}</span>
                    </td>

                    {/* Health Status */}
                    <td className="cell-status text-center">
                      <span className={`pill-badge ${getBadgeClass(row.status)}`}>
                        <span>{row.status}</span>
                      </span>
                    </td>

                    {/* Variance */}
                    <td className="cell-variance text-center">
                      <span className={`variance-tag ${getVarianceClass(row.status)}`}>
                        {row.variance}
                      </span>
                    </td>

                    {/* Analysis Action: Only Critical and At Risk show Deep Dive; Healthy shows On Target */}
                    <td className="cell-analysis text-right">
                      {isHealthy ? (
                        <span className="metric-on-target-tag">
                          <span className="on-target-check">✓</span>
                          <span>On Target</span>
                        </span>
                      ) : (
                        <button
                          type="button"
                          className="btn-deep-dive"
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectMetric && onSelectMetric(row);
                          }}
                          title={`Deep Dive into ${row.metric}`}
                        >
                          <span>Deep Dive</span>
                          <span className="deep-dive-arrow">→</span>
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
