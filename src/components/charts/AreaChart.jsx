import React, { useMemo, useRef } from 'react';
import { Line } from 'react-chartjs-2';
import { baseChartOptions, CHART_COLORS, createLinearGradient } from './chartConfig';

export function AreaChart({
  data,
  height = 260,
  options = {},
  gradient = true,
  xTitle,
  yTitle,
  onDataClick,
}) {
  const chartRef = useRef(null);

  const chartData = useMemo(() => {
    if (!data || !data.datasets) return data;

    // Apply smooth curves and subtle gradient fill if requested
    const enhancedDatasets = data.datasets.map((dataset, idx) => {
      const color = dataset.borderColor || (idx === 0 ? CHART_COLORS.secondary : CHART_COLORS.cyan);
      return {
        tension: 0.38,
        pointRadius: 3.5,
        pointHoverRadius: 7,
        pointBackgroundColor: color,
        pointBorderColor: '#FFFFFF',
        pointBorderWidth: 2,
        pointHoverBackgroundColor: '#FFFFFF',
        pointHoverBorderColor: color,
        pointHoverBorderWidth: 3,
        borderWidth: 2.4,
        fill: true,
        backgroundColor: (context) => {
          if (!gradient) return dataset.backgroundColor || 'rgba(112, 71, 235, 0.12)';
          const ctx = context.chart.ctx;
          const topColor = idx === 0 ? 'rgba(139, 117, 245, 0.32)' : 'rgba(84, 201, 209, 0.28)';
          const btmColor = idx === 0 ? 'rgba(139, 117, 245, 0.01)' : 'rgba(84, 201, 209, 0.01)';
          return createLinearGradient(ctx, topColor, btmColor, height);
        },
        ...dataset,
        borderColor: color,
      };
    });

    return {
      ...data,
      datasets: enhancedDatasets,
    };
  }, [data, gradient, height]);

  const mergedOptions = useMemo(() => {
    return {
      ...baseChartOptions,
      ...options,
      scales: {
        x: {
          ...baseChartOptions.scales.x,
          ...(options.scales?.x || {}),
          title: xTitle ? { display: true, text: xTitle, color: CHART_COLORS.muted } : undefined,
        },
        y: {
          ...baseChartOptions.scales.y,
          ...(options.scales?.y || {}),
          title: yTitle ? { display: true, text: yTitle, color: CHART_COLORS.muted } : undefined,
        },
      },
      plugins: {
        ...baseChartOptions.plugins,
        ...(options.plugins || {}),
      },
    };
  }, [options, xTitle, yTitle]);

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
      const label = chartData.labels?.[index];
      const value = chartData.datasets?.[datasetIndex]?.data?.[index];
      const dataset = chartData.datasets?.[datasetIndex];
      onDataClick({ index, datasetIndex, label, value, dataset });
    }
  };

  if (!chartData || !chartData.datasets || chartData.datasets.length === 0) {
    return null;
  }

  return (
    <div style={{ position: 'relative', width: '100%', height, cursor: onDataClick ? 'pointer' : 'default' }}>
      <Line ref={chartRef} data={chartData} options={mergedOptions} onClick={handleClick} />
    </div>
  );
}
