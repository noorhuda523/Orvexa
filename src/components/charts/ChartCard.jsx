import React from 'react';
import { LuCircleAlert } from 'react-icons/lu';
import '../../styles/charts.css';

export function ChartSkeleton({ height = 220 }) {
  return (
    <div className="nx-chart-skeleton" style={{ height }} />
  );
}

export function ChartEmptyState({
  title = 'No Data Available',
  subtitle = 'There is no recorded telemetry for this time interval.',
  icon: Icon = LuCircleAlert,
  height = 220,
}) {
  return (
    <div className="nx-chart-empty" style={{ height }}>
      <div className="nx-chart-empty-icon">
        <Icon size={20} />
      </div>
      <p className="nx-chart-empty-title">{title}</p>
      <p className="nx-chart-empty-sub">{subtitle}</p>
    </div>
  );
}

export function ChartCard({
  title,
  subtitle,
  actions,
  children,
  loading = false,
  empty = false,
  emptyTitle,
  emptySubtitle,
  height = 260,
  className = '',
  style = {},
}) {
  return (
    <div className={`nx-chart-card ${className}`} style={style}>
      {(title || actions) && (
        <div className="nx-chart-card-header">
          <div className="nx-chart-card-title-group">
            {title && <h3 className="nx-chart-card-title">{title}</h3>}
            {subtitle && <p className="nx-chart-card-subtitle">{subtitle}</p>}
          </div>
          {actions && <div className="nx-chart-card-actions">{actions}</div>}
        </div>
      )}
      <div className="nx-chart-body" style={{ height }}>
        {loading ? (
          <ChartSkeleton height={height} />
        ) : empty ? (
          <ChartEmptyState title={emptyTitle} subtitle={emptySubtitle} height={height} />
        ) : (
          children
        )}
      </div>
    </div>
  );
}
