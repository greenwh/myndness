<script lang="ts">
  import { onMount } from 'svelte';
  import { format, subDays } from 'date-fns';
  import { getMindfulnessSessions, db } from '$lib/db';
  import { calculateMindfulnessStreak, calculateActivityStreak } from '$lib/utils/statsHelpers';

  let mindfulnessStreak = $state(0);
  let activityStreak = $state(0);
  let loading = $state(true);

  async function loadStreaks() {
    loading = true;

    try {
      const today = format(new Date(), 'yyyy-MM-dd');
      const startDate = format(subDays(new Date(), 365), 'yyyy-MM-dd'); // Look back 1 year max

      // Fetch data
      const sessions = await getMindfulnessSessions(startDate, today);
      const activities = await db.plannedActivities
        .where('date')
        .between(startDate, today, true, true)
        .toArray();

      // Calculate streaks
      mindfulnessStreak = calculateMindfulnessStreak(sessions);
      activityStreak = calculateActivityStreak(activities);
    } catch (error) {
      console.error('Error loading streaks:', error);
    } finally {
      loading = false;
    }
  }

  onMount(() => {
    loadStreaks();
  });
</script>

<div class="streak-tracker">
  <h2 class="section-title">Current Streaks</h2>

  {#if loading}
    <div class="loading">
      <div class="spinner"></div>
      <p>Loading streaks...</p>
    </div>
  {:else}
    <div class="streaks-grid">
      <!-- Mindfulness Streak -->
      <div class="streak-card">
        <div class="streak-icon">🧘</div>
        <div class="streak-content">
          <div class="streak-title">Mindfulness Practice</div>
          <div class="streak-value">
            <span class="streak-number">{mindfulnessStreak}</span>
            <span class="streak-label">{mindfulnessStreak === 1 ? 'Day' : 'Days'}</span>
          </div>
          <div class="streak-message">
            {#if mindfulnessStreak === 0}
              <span class="neutral">Start a new streak today</span>
            {:else if mindfulnessStreak === 1}
              <span class="positive">Great start! Keep it going</span>
            {:else}
              <span class="positive">Streak in progress</span>
            {/if}
          </div>
        </div>
      </div>

      <!-- Activity Streak -->
      <div class="streak-card">
        <div class="streak-icon">✅</div>
        <div class="streak-content">
          <div class="streak-title">Completed Activities</div>
          <div class="streak-value">
            <span class="streak-number">{activityStreak}</span>
            <span class="streak-label">{activityStreak === 1 ? 'Day' : 'Days'}</span>
          </div>
          <div class="streak-message">
            {#if activityStreak === 0}
              <span class="neutral">Start a new streak today</span>
            {:else if activityStreak === 1}
              <span class="positive">Great start! Keep it going</span>
            {:else}
              <span class="positive">Streak in progress</span>
            {/if}
          </div>
        </div>
      </div>
    </div>

    <div class="streak-note">
      <p>
        A streak counts consecutive days with at least one completed session or activity.
        Streaks reset if you miss a day.
      </p>
    </div>
  {/if}
</div>

<style>
  .streak-tracker {
    background: white;
    padding: 1.5rem;
    border-radius: 0.75rem;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    margin-bottom: 1.5rem;
  }

  .section-title {
    font-size: 1.25rem;
    font-weight: 600;
    color: #1f2937;
    margin-bottom: 1.5rem;
  }

  .streaks-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 1.5rem;
    margin-bottom: 1rem;
  }

  .streak-card {
    background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
    padding: 1.5rem;
    border-radius: 0.75rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  .streak-icon {
    font-size: 3rem;
    margin-bottom: 1rem;
  }

  .streak-content {
    width: 100%;
  }

  .streak-title {
    font-size: 0.875rem;
    font-weight: 600;
    color: #6b7280;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    margin-bottom: 1rem;
  }

  .streak-value {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 1rem;
  }

  .streak-number {
    font-size: 4rem;
    font-weight: 700;
    color: #3b82f6;
    line-height: 1;
  }

  .streak-label {
    font-size: 1rem;
    color: #6b7280;
    margin-top: 0.25rem;
  }

  .streak-message {
    font-size: 0.875rem;
  }

  .streak-message .positive {
    color: #166534;
    font-weight: 500;
  }

  .streak-message .neutral {
    color: #6b7280;
  }

  .streak-note {
    padding: 1rem;
    background: #f9fafb;
    border-radius: 0.5rem;
    border-left: 4px solid #3b82f6;
  }

  .streak-note p {
    font-size: 0.875rem;
    color: #6b7280;
    margin: 0;
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
</style>
