import React, { useMemo } from 'react';
import { Line } from 'react-chartjs-2';
import { CHART_COLORS } from './chartConfig';

export function SparklineChart({
  data = [12, 18, 14, 22, 19, 28, 26, 34, 30, 42],
  color = CHART_COLORS.primary,
  fill = false,
  height = 36,
  width = '100%',
}) {
  const chartData = useMemo(() => {
    return {
      labels: data.map((_, i) => `${i + 1}`),
      datasets: [
        {
          data,
          borderColor: color,
          borderWidth: 2,
          pointRadius: 0,
          pointHoverRadius: 3,
          pointHoverBackgroundColor: color,
          pointHoverBorderColor: '#FFFFFF',
          pointHoverBorderWidth: 1.5,
          tension: 0.4,
          fill: fill ? 'origin' : false,
          backgroundColor: fill ? `${color}20` : 'transparent',
        },
      ],
    };
  }, [data, color, fill]);

  const options = useMemo(() => {
    return {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          enabled: true,
          mode: 'index',
          intersect: false,
          backgroundColor: '#19182B',
          titleColor: '#FFFFFF',
          bodyColor: '#F8F9FC',
          padding: 6,
          cornerRadius: 6,
          displayColors: false,
          callbacks: {
            title: () => '',
            label: (ctx) => `Value: ${ctx.parsed.y}`,
          },
        },
      },
      scales: {
        x: { display: false },
        y: { display: false },
      },
      animation: {
        duration: 600,
        easing: 'easeOutQuad',
      },
    };
  }, []);

  return (
    <div style={{ position: 'relative', width, height }}>
      <Line data={chartData} options={options} />
    </div>
  );
}
