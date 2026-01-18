<script lang="ts">
  import { onMount } from 'svelte';
  import { Chart, registerables } from 'chart.js/auto';
  import { db } from '$lib/db';
  import type { ActivityCategory } from '$lib/db/types';
  import { getBarChartOptions, CATEGORY_COLORS } from '$lib/utils/chartHelpers';

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

  const categoryLabels: Record<ActivityCategory, string> = {
    social: '🫂 Social',
    creative: '🎨 Creative',
    physical: '🚴 Physical',
    learning: '📚 Learning',
    mastery: '🔧 Mastery',
    pleasure: '😊 Pleasure'
  };

  async function loadData() {
    loading = true;
    isEmpty = false;

    try {
      // Fetch planned activities for date range
      const activities = await db.plannedActivities
        .where('date')
        .between(startDate, endDate, true, true)
        .toArray();

      if (activities.length === 0) {
        isEmpty = true;
        if (chart) {
          chart.destroy();
          chart = null;
        }
        loading = false;
        return;
      }

      // Group by category and calculate completion rates
      const categoryStats = new Map<
        ActivityCategory,
        { completed: number; total: number }
      >();

      for (const activity of activities) {
        const existing = categoryStats.get(activity.category);
        if (existing) {
          existing.total++;
          if (activity.completed) {
            existing.completed++;
          }
        } else {
          categoryStats.set(activity.category, {
            completed: activity.completed ? 1 : 0,
            total: 1
          });
        }
      }

      // Prepare chart data
      const categories = Array.from(categoryStats.keys()).sort();
      const completionRates = categories.map((cat) => {
        const stats = categoryStats.get(cat)!;
        return (stats.completed / stats.total) * 100;
      });

      const chartData = {
        labels: categories.map((cat) => categoryLabels[cat]),
        datasets: [
          {
            label: 'Completion Rate (%)',
            data: completionRates,
            backgroundColor: categories.map((cat) => CATEGORY_COLORS[cat]),
            borderColor: categories.map((cat) => CATEGORY_COLORS[cat]),
            borderWidth: 0,
            barThickness: 32
          }
        ]
      };

      // Create or update chart
      if (chart) {
        chart.data = chartData;
        chart.update();
      } else {
        chart = new Chart(canvas, {
          type: 'bar',
          data: chartData,
          options: {
            ...getBarChartOptions('y'),
            scales: {
              x: {
                beginAtZero: true,
                max: 100,
                ticks: {
                  font: { size: 14 },
                  callback: (value) => `${value}%`
                },
                title: {
                  display: true,
                  text: 'Completion Rate',
                  font: { size: 16 }
                }
              },
              y: {
                ticks: {
                  font: { size: 14 }
                }
              }
            },
            plugins: {
              legend: {
                display: false
              },
              tooltip: {
                enabled: true,
                titleFont: { size: 16 },
                bodyFont: { size: 14 },
                padding: 12,
                callbacks: {
                  label: (context) => {
                    const category = categories[context.dataIndex];
                    const stats = categoryStats.get(category)!;
                    const rate = context.parsed.x.toFixed(0);
                    return `${stats.completed} of ${stats.total} completed (${rate}%)`;
                  }
                }
              }
            }
          }
        });
      }
    } catch (error) {
      console.error('Error loading activity completion data:', error);
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

<div class="activity-completion-chart">
  <h2 class="chart-title">Activity Completion by Category</h2>

  {#if loading}
    <div class="loading">
      <div class="spinner"></div>
      <p>Loading activity data...</p>
    </div>
  {:else if isEmpty}
    <div class="empty-state">
      <p>No planned activities for this period</p>
      <p class="help-text">Plan activities on the Plan page</p>
    </div>
  {:else}
    <div class="chart-container">
      <canvas bind:this={canvas} aria-label="Activity completion rate horizontal bar chart"></canvas>
    </div>
  {/if}
</div>

<style>
  .activity-completion-chart {
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
