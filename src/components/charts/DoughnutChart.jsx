import React, { useMemo, useRef } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { CHART_COLORS } from './chartConfig';

export function DoughnutChart({
  data,
  height = 240,
  options = {},
  centerValue,
  centerLabel,
  cutout = '74%',
  onDataClick,
}) {
  const chartRef = useRef(null);

  const mergedOptions = useMemo(() => {
    return {
      responsive: true,
      maintainAspectRatio: false,
      cutout,
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          backgroundColor: '#FFFFFF',
          titleColor: '#19182B',
          bodyColor: '#19182B',
          borderColor: '#E9E8F1',
          borderWidth: 1,
          padding: { top: 10, bottom: 10, left: 14, right: 14 },
          cornerRadius: 10,
          boxPadding: 6,
          usePointStyle: true,
          titleFont: {
            family: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            size: 12,
            weight: '700',
          },
          bodyFont: {
            family: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            size: 12,
            weight: '500',
          },
          animation: {
            duration: 180,
          },
          callbacks: {
            label(context) {
              const label = context.label || '';
              const value = context.parsed || 0;
              const total = context.dataset.data.reduce((acc, cur) => acc + cur, 0);
              const percentage = total > 0 ? Math.round((value / total) * 100) : 0;
              return ` ${label}: ${value} (${percentage}%)`;
            },
          },
        },
        centerText: {
          value: centerValue,
          label: centerLabel,
        },
      },
      animation: {
        animateScale: true,
        animateRotate: true,
        duration: 900,
        easing: 'easeOutQuart',
      },
      ...options,
    };
  }, [centerValue, centerLabel, cutout, options]);

  const handleClick = (event) => {
    if (!onDataClick || !chartRef.current) return;
    const elements = chartRef.current.getElementsAtEventForMode(
      event.nativeEvent,
      'nearest',
      { intersect: true },
      false
    );
    if (elements.length > 0) {
      const { index, datasetIndex } = elements[0];
      const label = data.labels?.[index];
      const value = data.datasets?.[datasetIndex]?.data?.[index];
      const dataset = data.datasets?.[datasetIndex];
      onDataClick({ index, datasetIndex, label, value, dataset });
    }
  };

  if (!data || !data.datasets || data.datasets.length === 0) {
    return null;
  }

  return (
    <div style={{ position: 'relative', width: '100%', height, cursor: onDataClick ? 'pointer' : 'default' }}>
      <Doughnut ref={chartRef} data={data} options={mergedOptions} onClick={handleClick} />
    </div>
  );
}
