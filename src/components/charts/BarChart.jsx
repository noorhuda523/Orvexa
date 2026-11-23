import React, { useMemo, useRef } from 'react';
import { Bar } from 'react-chartjs-2';
import { baseChartOptions, CHART_COLORS } from './chartConfig';

export function BarChart({
  data,
  height = 260,
  options = {},
  stacked = false,
  xTitle,
  yTitle,
  onDataClick,
}) {
  const chartRef = useRef(null);

  const chartData = useMemo(() => {
    if (!data || !data.datasets) return data;
    const enhanced = data.datasets.map((dataset) => ({
      borderRadius: stacked ? 4 : 6,
      borderSkipped: false,
      maxBarThickness: 32,
      hoverBorderWidth: 1.5,
      hoverBorderColor: '#7047EB',
      ...dataset,
    }));
    return { ...data, datasets: enhanced };
  }, [data, stacked]);

  const mergedOptions = useMemo(() => {
    return {
      ...baseChartOptions,
      ...options,
      animation: {
        duration: 800,
        easing: 'easeOutQuart',
      },
      animations: {
        y: {
          duration: 750,
          easing: 'easeOutQuart',
        },
      },
      scales: {
        x: {
          ...baseChartOptions.scales.x,
          stacked,
          ...(options.scales?.x || {}),
          title: xTitle ? { display: true, text: xTitle, color: CHART_COLORS.muted } : undefined,
        },
        y: {
          ...baseChartOptions.scales.y,
          stacked,
          ...(options.scales?.y || {}),
          title: yTitle ? { display: true, text: yTitle, color: CHART_COLORS.muted } : undefined,
        },
      },
      plugins: {
        ...baseChartOptions.plugins,
        ...(options.plugins || {}),
      },
    };
  }, [options, stacked, xTitle, yTitle]);

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
      <Bar ref={chartRef} data={chartData} options={mergedOptions} onClick={handleClick} />
    </div>
  );
}
