<script lang="ts">
  import { onMount } from 'svelte';
  import { Chart, registerables } from 'chart.js/auto';
  import { getBPReadings } from '$lib/db';
  import { aggregateBPByDay } from '$lib/utils/statsHelpers';
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
      // Fetch BP readings
      const readings = await getBPReadings(startDate, endDate);

      if (readings.length === 0) {
        isEmpty = true;
        if (chart) {
          chart.destroy();
          chart = null;
        }
        loading = false;
        return;
      }

      // Aggregate by day
      const dailyData = aggregateBPByDay(readings);

      // Prepare chart data
      const chartData = {
        labels: dailyData.map((d) => formatChartDate(new Date(d.date))),
        datasets: [
          {
            label: 'Systolic',
            data: dailyData.map((d) => d.avgSystolic),
            borderColor: CHART_COLORS.blue,
            backgroundColor: CHART_COLORS.blue + '20',
            pointStyle: 'rect',
            pointRadius: 6,
            pointHoverRadius: 8,
            pointHitRadius: 22, // 44px touch target
            tension: 0.3
          },
          {
            label: 'Diastolic',
            data: dailyData.map((d) => d.avgDiastolic),
            borderColor: CHART_COLORS.red,
            backgroundColor: CHART_COLORS.red + '20',
            pointStyle: 'rectRot',
            pointRadius: 6,
            pointHoverRadius: 8,
            pointHitRadius: 22, // 44px touch target
            tension: 0.3
          }
        ]
      };

      // Highlight anxiety-related days with different point colors
      const anxietyIndices = dailyData
        .map((d, i) => (d.hasAnxietyRelated ? i : -1))
        .filter((i) => i >= 0);

      if (anxietyIndices.length > 0) {
        // Add yellow background to anxiety-related points
        chartData.datasets[0].pointBackgroundColor = dailyData.map((d) =>
          d.hasAnxietyRelated ? CHART_COLORS.yellow : CHART_COLORS.blue
        );
        chartData.datasets[1].pointBackgroundColor = dailyData.map((d) =>
          d.hasAnxietyRelated ? CHART_COLORS.yellow : CHART_COLORS.red
        );
      }

      // Create or update chart
      if (chart) {
        chart.data = chartData;
        chart.update();
      } else {
        chart = new Chart(canvas, {
          type: 'line',
          data: chartData,
          options: {
            ...getLineChartOptions('mmHg'),
            scales: {
              y: {
                beginAtZero: false,
                min: 40,
                max: 200,
                title: {
                  display: true,
                  text: 'Blood Pressure (mmHg)',
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
            },
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
                    const value = context.parsed.y;
                    return `${label}: ${value} mmHg`;
                  },
                  afterLabel: (context) => {
                    const index = context.dataIndex;
                    if (dailyData[index].hasAnxietyRelated) {
                      return '⚠️ Anxiety-related reading';
                    }
                    return '';
                  }
                }
              },
              annotation: {
                annotations: {
                  normalSystolic: {
                    type: 'line',
                    yMin: 120,
                    yMax: 120,
                    borderColor: CHART_COLORS.gray,
                    borderWidth: 1,
                    borderDash: [5, 5],
                    label: {
                      content: 'Normal (120)',
                      enabled: true,
                      position: 'end'
                    }
                  },
                  normalDiastolic: {
                    type: 'line',
                    yMin: 80,
                    yMax: 80,
                    borderColor: CHART_COLORS.gray,
                    borderWidth: 1,
                    borderDash: [5, 5],
                    label: {
                      content: 'Normal (80)',
                      enabled: true,
                      position: 'start'
                    }
                  }
                }
              }
            }
          }
        });
      }
    } catch (error) {
      console.error('Error loading BP trend data:', error);
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

<div class="bp-trend-chart">
  <h2 class="chart-title">Blood Pressure Trends</h2>

  {#if loading}
    <div class="loading">
      <div class="spinner"></div>
      <p>Loading BP data...</p>
    </div>
  {:else if isEmpty}
    <div class="empty-state">
      <p>No BP readings for this period</p>
      <p class="help-text">Track your blood pressure on the Track page</p>
    </div>
  {:else}
    <div class="legend-note">
      <span class="legend-item"><span class="dot anxiety"></span> Anxiety-related reading</span>
    </div>
    <div class="chart-container">
      <canvas bind:this={canvas} aria-label="Blood pressure trend line chart"></canvas>
    </div>
  {/if}
</div>

<style>
  .bp-trend-chart {
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

  .legend-note {
    display: flex;
    gap: 1rem;
    margin-bottom: 1rem;
    font-size: 0.875rem;
    color: #6b7280;
  }

  .legend-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .dot {
    width: 12px;
    height: 12px;
    border-radius: 50%;
  }

  .dot.anxiety {
    background: #eab308;
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
