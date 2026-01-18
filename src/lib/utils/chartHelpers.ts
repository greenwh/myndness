import { Chart, type ChartOptions, type ChartData } from 'chart.js/auto';

/**
 * Color-blind safe palette with high contrast
 */
export const CHART_COLORS = {
  blue: '#3b82f6',
  amber: '#f59e0b',
  purple: '#a855f7',
  green: '#22c55e',
  red: '#ef4444',
  gray: '#6b7280',
  yellow: '#eab308'
};

/**
 * Activity category colors matching the app theme
 */
export const CATEGORY_COLORS: Record<string, string> = {
  physical: CHART_COLORS.blue,
  social: CHART_COLORS.purple,
  creative: CHART_COLORS.amber,
  mindful: CHART_COLORS.green,
  nature: CHART_COLORS.green,
  learning: CHART_COLORS.purple
};

/**
 * Detects if user has reduced motion preference
 */
export function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Base chart options with accessibility features
 * - 16px+ fonts for readability
 * - 44px touch targets (hitRadius: 22)
 * - Reduced motion support
 * - High contrast colors
 */
export function getBaseChartOptions(reducedMotion: boolean = prefersReducedMotion()): ChartOptions {
  return {
    responsive: true,
    maintainAspectRatio: true,
    aspectRatio: 2,
    plugins: {
      legend: {
        labels: {
          font: { size: 16 },
          padding: 12,
          usePointStyle: true // Shapes for color-blind users
        }
      },
      tooltip: {
        enabled: true,
        titleFont: { size: 16 },
        bodyFont: { size: 14 },
        padding: 12
      }
    },
    elements: {
      point: {
        radius: 6,        // Visual size
        hitRadius: 22,    // 44px touch target
        hoverRadius: 8
      },
      line: {
        borderWidth: 3    // Thicker for visibility
      },
      bar: {
        borderWidth: 0
      }
    },
    animation: {
      duration: reducedMotion ? 0 : 750
    }
  };
}

/**
 * Options specific to line charts (mood, BP trends)
 */
export function getLineChartOptions(
  yAxisLabel: string = '',
  reducedMotion: boolean = prefersReducedMotion()
): ChartOptions<'line'> {
  const base = getBaseChartOptions(reducedMotion);

  return {
    ...base,
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: !!yAxisLabel,
          text: yAxisLabel,
          font: { size: 16 }
        },
        ticks: {
          font: { size: 14 }
        }
      },
      x: {
        ticks: {
          font: { size: 14 }
        }
      }
    }
  };
}

/**
 * Options specific to bar charts (activity completion)
 */
export function getBarChartOptions(
  indexAxis: 'x' | 'y' = 'x',
  reducedMotion: boolean = prefersReducedMotion()
): ChartOptions<'bar'> {
  const base = getBaseChartOptions(reducedMotion);

  return {
    ...base,
    indexAxis,
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          font: { size: 14 }
        }
      },
      x: {
        ticks: {
          font: { size: 14 }
        }
      }
    }
  };
}

/**
 * Options specific to doughnut charts (mindfulness practice types)
 */
export function getDoughnutChartOptions(
  reducedMotion: boolean = prefersReducedMotion()
): ChartOptions<'doughnut'> {
  const base = getBaseChartOptions(reducedMotion);

  return {
    ...base,
    aspectRatio: 1.5,
    plugins: {
      ...base.plugins,
      legend: {
        ...base.plugins?.legend,
        position: 'right'
      }
    }
  };
}

/**
 * Generates a color from the palette based on index
 */
export function getColorByIndex(index: number): string {
  const colors = Object.values(CHART_COLORS);
  return colors[index % colors.length];
}

/**
 * Formats a date for chart labels (e.g., "Jan 15")
 */
export function formatChartDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(date);
}

/**
 * Formats a number with one decimal place
 */
export function formatNumber(value: number): string {
  return value.toFixed(1);
}
