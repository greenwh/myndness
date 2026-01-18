<script lang="ts">
  import { getMoodLogs, getBPReadings, getMindfulnessSessions, db } from '$lib/db';
  import { getWeeklyInsights } from '$lib/utils/statsHelpers';
  import type { WeeklyInsights as Insights } from '$lib/utils/statsHelpers';

  interface Props {
    startDate: string;
    endDate: string;
  }

  let { startDate, endDate }: Props = $props();

  let insights = $state<Insights | null>(null);
  let loading = $state(true);

  const categoryLabels: Record<string, string> = {
    social: 'social activities',
    creative: 'creative activities',
    physical: 'physical activities',
    learning: 'learning activities',
    mastery: 'mastery tasks',
    pleasure: 'pleasurable activities'
  };

  async function loadInsights() {
    loading = true;

    try {
      // Fetch all data for the period
      const moodLogs = await getMoodLogs(startDate, endDate);
      const bpReadings = await getBPReadings(startDate, endDate);
      const mindfulnessSessions = await getMindfulnessSessions(startDate, endDate);
      const activities = await db.plannedActivities
        .where('date')
        .between(startDate, endDate, true, true)
        .toArray();

      // Calculate insights
      insights = getWeeklyInsights(moodLogs, activities, mindfulnessSessions, bpReadings);
    } catch (error) {
      console.error('Error loading insights:', error);
    } finally {
      loading = false;
    }
  }

  // Reload when dates change
  $effect(() => {
    if (startDate && endDate) {
      loadInsights();
    }
  });
</script>

<div class="weekly-insights">
  <h2 class="section-title">Summary</h2>

  {#if loading}
    <div class="loading">
      <div class="spinner"></div>
      <p>Calculating insights...</p>
    </div>
  {:else if insights}
    <div class="insights-grid">
      <!-- Mood Insight -->
      {#if insights.moodEntries > 0}
        <div class="insight-card">
          <div class="icon">😊</div>
          <div class="insight-content">
            <div class="insight-title">Mood</div>
            <div class="insight-text">
              Average mood {insights.avgMood?.toFixed(1)}/10 across {insights.moodEntries}
              {insights.moodEntries === 1 ? 'entry' : 'entries'}
            </div>
            {#if insights.avgAnxiety !== undefined}
              <div class="insight-subtext">
                Average anxiety {insights.avgAnxiety.toFixed(1)}/10
              </div>
            {/if}
          </div>
        </div>
      {/if}

      <!-- Activities Insight -->
      {#if insights.activitiesPlanned > 0}
        <div class="insight-card">
          <div class="icon">✅</div>
          <div class="insight-content">
            <div class="insight-title">Activities</div>
            <div class="insight-text">
              Completed {insights.activitiesCompleted} of {insights.activitiesPlanned} planned activities
            </div>
            <div class="insight-subtext">{insights.completionRate.toFixed(0)}% completion rate</div>
          </div>
        </div>
      {/if}

      <!-- Mindfulness Insight -->
      {#if insights.mindfulnessSessions > 0}
        <div class="insight-card">
          <div class="icon">🧘</div>
          <div class="insight-content">
            <div class="insight-title">Mindfulness</div>
            <div class="insight-text">
              {insights.mindfulnessSessions}
              {insights.mindfulnessSessions === 1 ? 'session' : 'sessions'},
              {insights.totalMindfulnessMinutes} minutes total
            </div>
            {#if insights.avgSessionDuration}
              <div class="insight-subtext">
                Average {insights.avgSessionDuration.toFixed(0)} minutes per session
              </div>
            {/if}
          </div>
        </div>
      {/if}

      <!-- BP Insight -->
      {#if insights.bpReadings > 0}
        <div class="insight-card">
          <div class="icon">❤️</div>
          <div class="insight-content">
            <div class="insight-title">Blood Pressure</div>
            <div class="insight-text">
              Average {insights.avgSystolic}/{insights.avgDiastolic} mmHg
            </div>
            <div class="insight-subtext">
              {insights.bpReadings} {insights.bpReadings === 1 ? 'reading' : 'readings'} recorded
            </div>
          </div>
        </div>
      {/if}

      <!-- Pattern Insight -->
      {#if insights.bestCategory && insights.bestCategoryImpact && insights.bestCategoryImpact > 0}
        <div class="insight-card highlight">
          <div class="icon">💡</div>
          <div class="insight-content">
            <div class="insight-title">Pattern</div>
            <div class="insight-text">
              Mood improved most after {categoryLabels[insights.bestCategory] || insights.bestCategory}
            </div>
            <div class="insight-subtext">
              Average improvement: +{insights.bestCategoryImpact.toFixed(1)} points
            </div>
          </div>
        </div>
      {/if}
    </div>
  {:else}
    <div class="empty-state">
      <p>No data available for this period</p>
    </div>
  {/if}
</div>

<style>
  .weekly-insights {
    margin-bottom: 1.5rem;
  }

  .section-title {
    font-size: 1.5rem;
    font-weight: 600;
    color: #1f2937;
    margin-bottom: 1rem;
  }

  .insights-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 1rem;
  }

  .insight-card {
    background: white;
    padding: 1.25rem;
    border-radius: 0.75rem;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    display: flex;
    gap: 1rem;
    align-items: flex-start;
  }

  .insight-card.highlight {
    background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
  }

  .icon {
    font-size: 2rem;
    flex-shrink: 0;
  }

  .insight-content {
    flex: 1;
  }

  .insight-title {
    font-size: 0.875rem;
    font-weight: 600;
    color: #6b7280;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    margin-bottom: 0.5rem;
  }

  .insight-text {
    font-size: 1rem;
    color: #1f2937;
    font-weight: 500;
    margin-bottom: 0.25rem;
  }

  .insight-subtext {
    font-size: 0.875rem;
    color: #6b7280;
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
</style>
