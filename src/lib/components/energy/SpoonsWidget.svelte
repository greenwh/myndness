<!-- src/lib/components/energy/SpoonsWidget.svelte -->
<!-- Dashboard widget showing remaining energy/spoons - Phase 8 Autism Productivity -->

<script lang="ts">
  import { onMount } from 'svelte';
  import { base } from '$app/paths';
  import { getTodayEnergyLog } from '$lib/db';
  import type { EnergyLog } from '$lib/db/types';

  let energyLog = $state<EnergyLog | undefined>(undefined);
  let loading = $state(true);

  onMount(async () => {
    energyLog = await getTodayEnergyLog();
    loading = false;
  });

  // Calculate percentage for visual gauge
  function getPercentage(): number {
    if (!energyLog) return 0;
    return (energyLog.spoonsRemaining / energyLog.morningSpoons) * 100;
  }

  // Get color based on remaining percentage
  function getGaugeColor(): string {
    const percentage = getPercentage();
    if (percentage > 50) return '#14b8a6'; // Green (teal)
    if (percentage >= 25) return '#f59e0b'; // Amber
    return '#ef4444'; // Red
  }

  // Get status text
  function getStatusText(): string {
    const percentage = getPercentage();
    if (percentage > 75) return 'Good energy';
    if (percentage > 50) return 'Moderate energy';
    if (percentage > 25) return 'Low energy';
    return 'Very low energy';
  }
</script>

<div class="spoons-widget">
  {#if loading}
    <div class="loading">Loading...</div>
  {:else if !energyLog}
    <!-- No energy logged today - prompt to assess -->
    <div class="no-log">
      <h3 class="widget-title">Morning Energy</h3>
      <p class="mb-4">Haven't assessed your energy today</p>
      <a href="{base}/track/energy" class="btn btn-primary">
        Assess Energy
      </a>
    </div>
  {:else}
    <!-- Energy logged - show gauge -->
    <div class="has-log">
      <h3 class="widget-title">Energy Today</h3>

      <!-- Circular gauge -->
      <div class="gauge-container">
        <svg class="gauge" viewBox="0 0 120 120">
          <!-- Background circle -->
          <circle
            cx="60"
            cy="60"
            r="50"
            fill="none"
            stroke="#e5e7eb"
            stroke-width="10"
          />
          <!-- Progress circle -->
          <circle
            cx="60"
            cy="60"
            r="50"
            fill="none"
            stroke={getGaugeColor()}
            stroke-width="10"
            stroke-dasharray="314.159"
            stroke-dashoffset={314.159 - (314.159 * getPercentage()) / 100}
            stroke-linecap="round"
            transform="rotate(-90 60 60)"
            class="progress-circle"
          />
        </svg>

        <div class="gauge-center">
          <div class="spoons-value">{energyLog.spoonsRemaining}</div>
          <div class="spoons-label">/ {energyLog.morningSpoons} spoons</div>
        </div>
      </div>

      <!-- Status text -->
      <div class="status-text" style="color: {getGaugeColor()}">
        {getStatusText()}
      </div>

      <!-- Quick actions -->
      <div class="actions">
        <a href="{base}/track/energy" class="link">Update</a>
        <span class="separator">•</span>
        <a href="{base}/plan/today" class="link">Plan Day</a>
      </div>
    </div>
  {/if}
</div>

<style>
  .spoons-widget {
    background: white;
    border: 2px solid #e5e7eb;
    border-radius: 12px;
    padding: 1.5rem;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  }

  .widget-title {
    font-size: 1.25rem;
    font-weight: 700;
    margin-bottom: 1rem;
    color: #1f2937;
  }

  .loading {
    text-align: center;
    color: #6b7280;
    padding: 1rem;
  }

  .no-log {
    text-align: center;
  }

  .has-log {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .gauge-container {
    position: relative;
    width: 120px;
    height: 120px;
    margin: 1rem 0;
  }

  .gauge {
    width: 100%;
    height: 100%;
  }

  .progress-circle {
    transition: stroke-dashoffset 0.5s ease, stroke 0.3s ease;
  }

  .gauge-center {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    text-align: center;
  }

  .spoons-value {
    font-size: 2rem;
    font-weight: 700;
    color: #1f2937;
    line-height: 1;
  }

  .spoons-label {
    font-size: 0.875rem;
    color: #6b7280;
    margin-top: 0.25rem;
  }

  .status-text {
    font-size: 1rem;
    font-weight: 600;
    margin-bottom: 1rem;
  }

  .actions {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.875rem;
  }

  .link {
    color: #14b8a6;
    text-decoration: none;
    min-height: 44px;
    display: inline-flex;
    align-items: center;
    padding: 0.5rem;
  }

  .link:hover {
    text-decoration: underline;
    color: #0d9488;
  }

  .separator {
    color: #d1d5db;
  }

  .btn {
    min-height: 44px;
    min-width: 44px;
    padding: 0.75rem 1.5rem;
    font-size: 1rem;
    font-weight: 600;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s;
    text-decoration: none;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border: none;
  }

  .btn-primary {
    background-color: #14b8a6;
    color: white;
  }

  .btn-primary:hover {
    background-color: #0d9488;
  }
</style>
