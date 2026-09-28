import React from 'react';

/**
 * Enterprise warning triangle SVG icons matching the user's provided symbols:
 * - Critical: Solid red rounded triangle with white exclamation mark
 * - Risk: Solid amber-yellow rounded triangle with white exclamation mark
 */

const CRITICAL_RED = '#e62025';
const RISK_YELLOW = '#fab828';

function WarningTriangle({ color, size = 18, className = '', style = {} }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      className={className}
      aria-hidden="true"
      style={{ display: 'inline-block', verticalAlign: 'middle', flexShrink: 0, ...style }}
    >
      {/* Solid rounded triangle body */}
      <path
        d="M 50 8
           C 54.5 8, 58.5 12, 61 17
           L 94.5 76.5
           C 97.5 82, 95.5 89, 89 89
           L 11 89
           C 4.5 89, 2.5 82, 5.5 76.5
           L 39 17
           C 41.5 12, 45.5 8, 50 8 Z"
        fill={color}
      />
      {/* Tapered rounded upper bar of exclamation mark */}
      <path
        d="M 44.5 35
           C 44.5 31.8, 47 29, 50 29
           C 53 29, 55.5 31.8, 55.5 35
           L 53.6 57
           C 53.6 59.2, 52 61, 50 61
           C 48 61, 46.4 59.2, 46.4 57 Z"
        fill="#ffffff"
      />
      {/* Lower circular dot */}
      <circle cx="50" cy="74.5" r="6.2" fill="#ffffff" />
    </svg>
  );
}

export function CriticalTriangleIcon({ size = 18, className = '', style = {} }) {
  return <WarningTriangle color={CRITICAL_RED} size={size} className={className} style={style} />;
}

export function RiskTriangleIcon({ size = 18, className = '', style = {} }) {
  return <WarningTriangle color={RISK_YELLOW} size={size} className={className} style={style} />;
}

export default CriticalTriangleIcon;
