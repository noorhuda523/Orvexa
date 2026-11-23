/**
 * NEXORA — Chart.js Centralized Configuration & Design System
 * Light-theme only palette, registered elements, and shared options.
 */
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';

// Register all Chart.js modules
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

/* ─── Nexora Brand Palette ───────────────────────────────────────────────── */
export const CHART_COLORS = {
  primary: '#7047EB',      // Primary Purple
  secondary: '#9A80F5',    // Secondary Purple
  lightPurple: '#EDE7FF',  // Light Purple Fill / Accent
  cyan: '#54C9D1',         // Cyan Accent
  blue: '#5596F5',         // Blue Accent
  green: '#18B88A',        // Success Green
  orange: '#F2A74B',       // Warning Orange
  red: '#EF6474',          // Error / Alert Red
  text: '#19182B',         // Dark text
  muted: '#74758A',        // Muted labels
  border: '#E9E8F1',       // Soft gridlines & card borders
  cardBg: '#FFFFFF',       // Card background
  surface: '#F8F9FC',      // Secondary surface
};

/* ─── Gradient Creation Helper ───────────────────────────────────────────── */
export function createLinearGradient(ctx, colorTop, colorBottom, height = 300) {
  if (!ctx) return colorTop;
  const gradient = ctx.createLinearGradient(0, 0, 0, height);
  gradient.addColorStop(0, colorTop);
  gradient.addColorStop(1, colorBottom);
  return gradient;
}

/* ─── Center Text Plugin for Doughnut Charts ─────────────────────────────── */
export const centerTextPlugin = {
  id: 'centerTextPlugin',
  beforeDraw(chart) {
    if (chart.config.type !== 'doughnut') return;
    const { ctx, chartArea } = chart;
    if (!chartArea) return;

    const centerConfig = chart.config.options?.plugins?.centerText;
    if (!centerConfig || !centerConfig.value) return;

    ctx.save();
    const centerX = (chartArea.left + chartArea.right) / 2;
    const centerY = (chartArea.top + chartArea.bottom) / 2;

    // Value text (large bold)
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = '700 24px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillStyle = CHART_COLORS.text;
    ctx.fillText(centerConfig.value, centerX, centerY - (centerConfig.label ? 10 : 0));

    // Label text (subtle muted)
    if (centerConfig.label) {
      ctx.font = '500 12px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      ctx.fillStyle = CHART_COLORS.muted;
      ctx.fillText(centerConfig.label, centerX, centerY + 14);
    }

    ctx.restore();
  },
};

ChartJS.register(centerTextPlugin);

/* ─── Shared Base Options ────────────────────────────────────────────────── */
export const baseChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  interaction: {
    mode: 'index',
    intersect: false,
  },
  hover: {
    mode: 'index',
    intersect: false,
    animationDuration: 180,
  },
  plugins: {
    legend: {
      display: false, // We use custom interactive header legend pills for clean SaaS UI
    },
    tooltip: {
      enabled: true,
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
        labelColor(context) {
          const color = context.dataset.borderColor || context.dataset.backgroundColor || CHART_COLORS.primary;
          return {
            borderColor: color,
            backgroundColor: color,
            borderWidth: 1,
            borderRadius: 3,
          };
        },
      },
    },
  },
  scales: {
    x: {
      grid: {
        display: false,
        drawBorder: false,
      },
      ticks: {
        color: CHART_COLORS.muted,
        font: {
          family: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          size: 11,
          weight: '500',
        },
        maxRotation: 0,
        autoSkip: true,
        maxTicksLimit: 10,
        padding: 6,
      },
      border: {
        display: false,
      },
    },
    y: {
      grid: {
        color: CHART_COLORS.border,
        drawBorder: false,
        lineWidth: 1,
      },
      ticks: {
        color: CHART_COLORS.muted,
        font: {
          family: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          size: 11,
          weight: '500',
        },
        padding: 8,
        maxTicksLimit: 6,
      },
      border: {
        display: false,
      },
    },
  },
  animation: {
    duration: 850,
    easing: 'easeOutQuart',
  },
  animations: {
    tension: {
      duration: 800,
      easing: 'easeInOutQuad',
    },
    y: {
      duration: 850,
      easing: 'easeOutQuart',
    },
  },
};
