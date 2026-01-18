<script lang="ts">
  import { base } from '$app/paths';
  import { format, subDays } from 'date-fns';
  import DateRangeSelector from '$lib/components/insights/DateRangeSelector.svelte';
  import WeeklyInsights from '$lib/components/insights/WeeklyInsights.svelte';
  import MoodTrendChart from '$lib/components/insights/MoodTrendChart.svelte';
  import ActivityCompletionChart from '$lib/components/insights/ActivityCompletionChart.svelte';
  import MindfulnessChart from '$lib/components/insights/MindfulnessChart.svelte';
  import BPTrendChart from '$lib/components/insights/BPTrendChart.svelte';
  import MoodCorrelations from '$lib/components/insights/MoodCorrelations.svelte';
  import StreakTracker from '$lib/components/insights/StreakTracker.svelte';

  // Date range state
  let selectedRange = $state<'7d' | '30d' | '90d' | 'all'>('30d');
  let startDate = $state('');
  let endDate = $state('');

  // Initialize with 30 days
  const today = format(new Date(), 'yyyy-MM-dd');
  startDate = format(subDays(new Date(), 30), 'yyyy-MM-dd');
  endDate = today;

  function handleRangeChange(
    range: '7d' | '30d' | '90d' | 'all',
    newStartDate: string,
    newEndDate: string
  ) {
    selectedRange = range;
    startDate = newStartDate;
    endDate = newEndDate;
  }
</script>

<svelte:head>
  <title>Insights - Myndness</title>
</svelte:head>

<div class="insights-page">
  <header class="page-header">
    <h1 class="page-title">Insights</h1>
    <p class="page-description">
      Understand patterns in your mental wellness journey through data visualization and trend
      analysis
    </p>
  </header>

  <!-- Date Range Selector -->
  <DateRangeSelector bind:selected={selectedRange} onchange={handleRangeChange} />

  <!-- Weekly Insights Summary -->
  <WeeklyInsights {startDate} {endDate} />

  <!-- Charts -->
  <MoodTrendChart {startDate} {endDate} />
  <ActivityCompletionChart {startDate} {endDate} />
  <MindfulnessChart {startDate} {endDate} />
  <BPTrendChart {startDate} {endDate} />

  <!-- Correlations -->
  <MoodCorrelations {startDate} {endDate} />

  <!-- Streaks -->
  <StreakTracker />

  <!-- Export Link -->
  <div class="export-section">
    <a href="{base}/insights/export" class="export-link">
      <span class="export-icon">📥</span>
      <span>Export Your Data</span>
    </a>
  </div>
</div>

<style>
  .insights-page {
    max-width: 1200px;
    margin: 0 auto;
    padding: 1.5rem;
    padding-bottom: 6rem;
  }

  .page-header {
    margin-bottom: 2rem;
  }

  .page-title {
    font-size: 2rem;
    font-weight: 700;
    color: #1f2937;
    margin-bottom: 0.5rem;
  }

  .page-description {
    font-size: 1rem;
    color: #6b7280;
    max-width: 600px;
  }

  .export-section {
    margin-top: 2rem;
    padding: 1.5rem;
    background: white;
    border-radius: 0.75rem;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    text-align: center;
  }

  .export-link {
    display: inline-flex;
    align-items: center;
    gap: 0.75rem;
    padding: 1rem 2rem;
    background: #3b82f6;
    color: white;
    border-radius: 0.5rem;
    text-decoration: none;
    font-size: 1rem;
    font-weight: 600;
    transition: background 0.2s;
    min-height: 44px;
  }

  .export-link:hover {
    background: #2563eb;
  }

  .export-link:focus {
    outline: 2px solid #3b82f6;
    outline-offset: 2px;
  }

  .export-icon {
    font-size: 1.5rem;
  }

  @media (max-width: 768px) {
    .insights-page {
      padding: 1rem;
    }

    .page-title {
      font-size: 1.5rem;
    }
  }
</style>
