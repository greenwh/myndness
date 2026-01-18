<script lang="ts">
  import { onMount } from 'svelte';
  import { Chart, registerables } from 'chart.js/auto';
  import { getMindfulnessSessions } from '$lib/db';
  import { calculateMindfulnessStreak } from '$lib/utils/statsHelpers';
  import { getDoughnutChartOptions, getColorByIndex } from '$lib/utils/chartHelpers';
  import type { MindfulnessPracticeType } from '$lib/db/types';

  interface Props {
    startDate: string;
    endDate: string;
  }

  let { startDate, endDate }: Props = $props();

  let canvas: HTMLCanvasElement;
  let chart: Chart | null = null;
  let loading = $state(true);
  let isEmpty = $state(false);

  // Stats
  let totalSessions = $state(0);
  let totalMinutes = $state(0);
  let avgDuration = $state(0);
  let currentStreak = $state(0);

  // Register Chart.js components
  Chart.register(...registerables);

  const practiceLabels: Record<MindfulnessPracticeType, string> = {
    'breath-awareness': 'Breath Awareness',
    'body-scan-short': 'Body Scan (Short)',
    'body-scan-full': 'Body Scan (Full)',
    'loving-kindness': 'Loving Kindness',
    'open-awareness': 'Open Awareness',
    'walking-meditation': 'Walking',
    'sound-awareness': 'Sound Awareness',
    other: 'Other'
  };

  async function loadData() {
    loading = true;
    isEmpty = false;

    try {
      // Fetch mindfulness sessions
      const sessions = await getMindfulnessSessions(startDate, endDate);

      // Filter completed sessions
      const completed = sessions.filter((s) => s.completed);

      if (completed.length === 0) {
        isEmpty = true;
        totalSessions = 0;
        totalMinutes = 0;
        avgDuration = 0;
        currentStreak = 0;
        if (chart) {
          chart.destroy();
          chart = null;
        }
        loading = false;
        return;
      }

      // Calculate stats
      totalSessions = completed.length;
      totalMinutes = completed.reduce((sum, s) => sum + (s.durationActual || s.durationPlanned), 0);
      avgDuration = Math.round(totalMinutes / totalSessions);

      // Calculate current streak (using all sessions, not just date range)
      const allSessions = await getMindfulnessSessions('2000-01-01', endDate);
      currentStreak = calculateMindfulnessStreak(allSessions);

      // Group by practice type
      const typeCounts = new Map<MindfulnessPracticeType, number>();
      for (const session of completed) {
        const count = typeCounts.get(session.practiceType) || 0;
        typeCounts.set(session.practiceType, count + 1);
      }

      // Prepare chart data
      const types = Array.from(typeCounts.keys());
      const counts = types.map((type) => typeCounts.get(type)!);

      const chartData = {
        labels: types.map((type) => practiceLabels[type]),
        datasets: [
          {
            label: 'Sessions',
            data: counts,
            backgroundColor: types.map((_, i) => getColorByIndex(i)),
            borderWidth: 0
          }
        ]
      };

      // Create or update chart
      if (chart) {
        chart.data = chartData;
        chart.update();
      } else {
        chart = new Chart(canvas, {
          type: 'doughnut',
          data: chartData,
          options: {
            ...getDoughnutChartOptions(),
            plugins: {
              legend: {
                position: 'right',
                labels: {
                  font: { size: 14 },
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
                    const count = context.parsed;
                    const percentage = ((count / totalSessions) * 100).toFixed(0);
                    return `${count} sessions (${percentage}%)`;
                  }
                }
              }
            }
          }
        });
      }
    } catch (error) {
      console.error('Error loading mindfulness data:', error);
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

<div class="mindfulness-chart">
  <h2 class="chart-title">Mindfulness Practice</h2>

  {#if loading}
    <div class="loading">
      <div class="spinner"></div>
      <p>Loading mindfulness data...</p>
    </div>
  {:else if isEmpty}
    <div class="empty-state">
      <p>No mindfulness sessions for this period</p>
      <p class="help-text">Start a practice session in the Tools section</p>
    </div>
  {:else}
    <!-- Stats Cards -->
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-value">{totalSessions}</div>
        <div class="stat-label">Total Sessions</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">{totalMinutes}</div>
        <div class="stat-label">Total Minutes</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">{avgDuration}</div>
        <div class="stat-label">Avg Duration (min)</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">{currentStreak}</div>
        <div class="stat-label">Current Streak {currentStreak === 1 ? 'Day' : 'Days'}</div>
      </div>
    </div>

    <!-- Doughnut Chart -->
    <div class="chart-container">
      <canvas bind:this={canvas} aria-label="Mindfulness practice type distribution doughnut chart"></canvas>
    </div>
  {/if}
</div>

<style>
  .mindfulness-chart {
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

  .stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 1rem;
    margin-bottom: 1.5rem;
  }

  .stat-card {
    background: #f9fafb;
    padding: 1rem;
    border-radius: 0.5rem;
    text-align: center;
  }

  .stat-value {
    font-size: 2rem;
    font-weight: 700;
    color: #3b82f6;
    margin-bottom: 0.25rem;
  }

  .stat-label {
    font-size: 0.875rem;
    color: #6b7280;
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
