<script lang="ts">
  import { db } from '$lib/db';
  import { calculateActivityImpact } from '$lib/utils/statsHelpers';
  import type { ActivityImpact } from '$lib/utils/statsHelpers';
  import type { ActivityCategory } from '$lib/db/types';

  interface Props {
    startDate: string;
    endDate: string;
  }

  let { startDate, endDate }: Props = $props();

  let impacts = $state<ActivityImpact[]>([]);
  let loading = $state(true);

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

    try {
      const activities = await db.plannedActivities
        .where('date')
        .between(startDate, endDate, true, true)
        .toArray();

      impacts = calculateActivityImpact(activities);
    } catch (error) {
      console.error('Error loading mood correlations:', error);
    } finally {
      loading = false;
    }
  }

  function getImpactColor(change: number): string {
    if (change > 0.5) return 'positive';
    if (change < -0.5) return 'negative';
    return 'neutral';
  }

  function getImpactIcon(change: number): string {
    if (change > 0.5) return '↑';
    if (change < -0.5) return '↓';
    return '→';
  }

  // Reload when dates change
  $effect(() => {
    if (startDate && endDate) {
      loadData();
    }
  });
</script>

<div class="mood-correlations">
  <h2 class="section-title">Activity Impact on Mood</h2>

  {#if loading}
    <div class="loading">
      <div class="spinner"></div>
      <p>Analyzing correlations...</p>
    </div>
  {:else if impacts.length === 0}
    <div class="empty-state">
      <p>No completed activities with mood ratings</p>
      <p class="help-text">Track your mood before and after activities to see patterns</p>
    </div>
  {:else}
    <div class="correlations-grid">
      {#each impacts as impact}
        <div class="correlation-card">
          <div class="category-header">
            <span class="category-name">{categoryLabels[impact.category]}</span>
            <span class="sample-size">Based on {impact.count} {impact.count === 1 ? 'activity' : 'activities'}</span>
          </div>

          <div class="mood-change">
            <div class="before-after">
              <div class="mood-value">
                <span class="label">Before</span>
                <span class="value">{impact.avgMoodBefore.toFixed(1)}</span>
              </div>
              <div class="arrow" class:positive={impact.moodChange > 0.5} class:negative={impact.moodChange < -0.5}>
                {getImpactIcon(impact.moodChange)}
              </div>
              <div class="mood-value">
                <span class="label">After</span>
                <span class="value">{impact.avgMoodAfter.toFixed(1)}</span>
              </div>
            </div>

            <div class="impact-badge {getImpactColor(impact.moodChange)}">
              {#if impact.moodChange > 0}
                +{impact.moodChange.toFixed(1)}
              {:else}
                {impact.moodChange.toFixed(1)}
              {/if}
              points
            </div>
          </div>
        </div>
      {/each}
    </div>
  {/if}
</div>

<style>
  .mood-correlations {
    margin-bottom: 1.5rem;
  }

  .section-title {
    font-size: 1.5rem;
    font-weight: 600;
    color: #1f2937;
    margin-bottom: 1rem;
  }

  .correlations-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 1rem;
  }

  .correlation-card {
    background: white;
    padding: 1.25rem;
    border-radius: 0.75rem;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  }

  .category-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
    padding-bottom: 0.75rem;
    border-bottom: 1px solid #e5e7eb;
  }

  .category-name {
    font-size: 1rem;
    font-weight: 600;
    color: #1f2937;
  }

  .sample-size {
    font-size: 0.75rem;
    color: #9ca3af;
  }

  .mood-change {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .before-after {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
  }

  .mood-value {
    display: flex;
    flex-direction: column;
    align-items: center;
    flex: 1;
  }

  .mood-value .label {
    font-size: 0.75rem;
    color: #6b7280;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    margin-bottom: 0.25rem;
  }

  .mood-value .value {
    font-size: 1.5rem;
    font-weight: 700;
    color: #1f2937;
  }

  .arrow {
    font-size: 2rem;
    font-weight: 700;
    color: #6b7280;
  }

  .arrow.positive {
    color: #22c55e;
  }

  .arrow.negative {
    color: #ef4444;
  }

  .impact-badge {
    text-align: center;
    padding: 0.5rem 1rem;
    border-radius: 0.5rem;
    font-size: 0.875rem;
    font-weight: 600;
  }

  .impact-badge.positive {
    background: #dcfce7;
    color: #166534;
  }

  .impact-badge.negative {
    background: #fee2e2;
    color: #991b1b;
  }

  .impact-badge.neutral {
    background: #f3f4f6;
    color: #4b5563;
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
