<script lang="ts">
  import { onMount } from 'svelte';
  import { Chart, registerables } from 'chart.js/auto';
  import { getMoodLogs } from '$lib/db';
  import { aggregateMoodByDay } from '$lib/utils/statsHelpers';
  import { getLineChartOptions, CHART_COLORS, formatChartDate } from '$lib/utils/chartHelpers';

  interface Props {
    startDate: string;
    endDate: string;
  }

  let { startDate, endDate }: Props = $props();

  let canvas: HTMLCanvasElement;
  let chart: Chart | null = null;
  let loading = $state(true);
  let isEmpty = $state(false);

  // Register Chart.js components
  Chart.register(...registerables);

  async function loadData() {
    loading = true;
    isEmpty = false;

    try {
      // Fetch raw mood logs
      const moodLogs = await getMoodLogs(startDate, endDate);

      if (moodLogs.length === 0) {
        isEmpty = true;
        if (chart) {
          chart.destroy();
          chart = null;
        }
        loading = false;
        return;
      }

      // Aggregate by day for better performance
      const dailyData = aggregateMoodByDay(moodLogs);

      // Prepare chart data
      const chartData = {
        labels: dailyData.map((d) => formatChartDate(new Date(d.date))),
        datasets: [
          {
            label: 'Mood',
            data: dailyData.map((d) => d.avgMood),
            borderColor: CHART_COLORS.blue,
            backgroundColor: CHART_COLORS.blue + '20',
            pointStyle: 'circle',
            pointRadius: 6,
            pointHoverRadius: 8,
            pointHitRadius: 22, // 44px touch target
            tension: 0.3
          },
          {
            label: 'Anxiety',
            data: dailyData.map((d) => d.avgAnxiety),
            borderColor: CHART_COLORS.red,
            backgroundColor: CHART_COLORS.red + '20',
            pointStyle: 'triangle',
            pointRadius: 6,
            pointHoverRadius: 8,
            pointHitRadius: 22, // 44px touch target
            tension: 0.3
          }
        ]
      };

      // Create or update chart
      if (chart) {
        chart.data = chartData;
        chart.update();
      } else {
        chart = new Chart(canvas, {
          type: 'line',
          data: chartData,
          options: {
            ...getLineChartOptions('Rating (1-10)'),
            plugins: {
              legend: {
                labels: {
                  font: { size: 16 },
                  padding: 12,
                  usePointStyle: true
                }
              },
              tooltip: {
                enabled: true,
                titleFont: { size: 16 },
                bodyFont: { size: 14 },
                padding: 12,
                callbacks: {
                  label: (context) => {
                    const label = context.dataset.label || '';
                    const value = context.parsed.y.toFixed(1);
                    return `${label}: ${value}/10`;
                  }
                }
              }
            }
          }
        });
      }
    } catch (error) {
      console.error('Error loading mood trend data:', error);
    } finally {
      loading = false;
    }
  }

  // Load data when startDate or endDate changes
  $effect(() => {
    if (startDate && endDate) {
      loadData();
    }
  });

  // Cleanup on destroy
  onMount(() => {
    return () => {
      if (chart) {
        chart.destroy();
      }
    };
  });
</script>

<div class="mood-trend-chart">
  <h2 class="chart-title">Mood & Anxiety Trends</h2>

  {#if loading}
    <div class="loading">
      <div class="spinner"></div>
      <p>Loading mood data...</p>
    </div>
  {:else if isEmpty}
    <div class="empty-state">
      <p>No mood data for this period</p>
      <p class="help-text">Start tracking your mood on the Track page</p>
    </div>
  {:else}
    <div class="chart-container">
      <canvas bind:this={canvas} aria-label="Mood and anxiety trend line chart"></canvas>
    </div>
  {/if}
</div>

<style>
  .mood-trend-chart {
    background: white;
    padding: 1.5rem;
    border-radius: 0.75rem;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    margin-bottom: 1.5rem;
  }

  .chart-title {
    font-size: 1.25rem;
    font-weight: 600;
    color: #1f2937;
    margin-bottom: 1.5rem;
  }

  .chart-container {
    position: relative;
    width: 100%;
    max-height: 400px;
  }

  .loading {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 3rem 1rem;
  }

  .spinner {
    width: 48px;
    height: 48px;
    border: 4px solid #e5e7eb;
    border-top-color: #3b82f6;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
    margin-bottom: 1rem;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .spinner {
      animation: none;
      border-top-color: #3b82f6;
    }
  }

  .loading p {
    color: #6b7280;
    font-size: 1rem;
  }

  .empty-state {
    padding: 3rem 1rem;
    text-align: center;
    color: #6b7280;
  }

  .empty-state p {
    font-size: 1rem;
    margin-bottom: 0.5rem;
  }

  .help-text {
    font-size: 0.875rem;
    color: #9ca3af;
  }
</style>
