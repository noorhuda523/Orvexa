import React, { useMemo, useRef } from 'react';
import { Line } from 'react-chartjs-2';
import { baseChartOptions, CHART_COLORS } from './chartConfig';

export function LineChart({
  data,
  height = 260,
  options = {},
  xTitle,
  yTitle,
  onDataClick,
}) {
  const chartRef = useRef(null);

  const enhancedData = useMemo(() => {
    if (!data || !data.datasets) return data;
    return {
      ...data,
      datasets: data.datasets.map((dataset, idx) => {
        const color = dataset.borderColor || (idx === 0 ? CHART_COLORS.primary : CHART_COLORS.green);
        return {
          tension: 0.36,
          pointRadius: 3.5,
          pointHoverRadius: 7,
          pointBackgroundColor: color,
          pointBorderColor: '#FFFFFF',
          pointBorderWidth: 2,
          pointHoverBackgroundColor: '#FFFFFF',
          pointHoverBorderColor: color,
          pointHoverBorderWidth: 3,
          borderWidth: 2.4,
          ...dataset,
        };
      }),
    };
  }, [data]);

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
      const label = enhancedData.labels?.[index];
      const value = enhancedData.datasets?.[datasetIndex]?.data?.[index];
      const dataset = enhancedData.datasets?.[datasetIndex];
      onDataClick({ index, datasetIndex, label, value, dataset });
    }
  };

  if (!enhancedData || !enhancedData.datasets || enhancedData.datasets.length === 0) {
    return null;
  }

  return (
    <div style={{ position: 'relative', width: '100%', height, cursor: onDataClick ? 'pointer' : 'default' }}>
      <Line ref={chartRef} data={enhancedData} options={mergedOptions} onClick={handleClick} />
    </div>
  );
}
