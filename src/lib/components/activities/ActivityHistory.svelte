<!-- src/lib/components/activities/ActivityHistory.svelte -->
<script lang="ts">
  import { onMount } from 'svelte';
  import { getRecentActivities } from '$lib/db';
  import type { Activity } from '$lib/db/types';

  let activities: Activity[] = $state([]);
  let loading = $state(true);
  let filter: 'all' | string = $state('all');

  // Group activities by date
  const groupedActivities = $derived(activities.reduce((groups, activity) => {
    const date = activity.date;
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(activity);
    return groups;
  }, {} as Record<string, Activity[]>));

  // Get unique types for filter
  const activityTypes = $derived(Array.from(new Set(activities.map(a => a.type))).sort());

  // Filtered activities
  const filteredGrouped = $derived(filter === 'all'
    ? groupedActivities
    : Object.entries(groupedActivities).reduce((acc, [date, acts]) => {
        const filtered = acts.filter(a => a.type === filter);
        if (filtered.length > 0) {
          acc[date] = filtered;
        }
        return acc;
      }, {} as Record<string, Activity[]>));

  onMount(async () => {
    await loadActivities();
  });

  async function loadActivities() {
    loading = true;
    try {
      activities = await getRecentActivities(90); // Last 90 days
    } catch (error) {
      console.error('Error loading activities:', error);
    } finally {
      loading = false;
    }
  }

  function formatDate(dateStr: string): string {
    const date = new Date(dateStr);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric'
      });
    }
  }

  function formatTime(timestamp: string): string {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  }

  function getIntensityColor(intensity?: string): string {
    switch (intensity) {
      case 'light':
        return 'bg-green-100 text-green-800';
      case 'moderate':
        return 'bg-yellow-100 text-yellow-800';
      case 'vigorous':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }
</script>

<div class="activity-history">
  <!-- Filter -->
  {#if activityTypes.length > 0}
    <div class="filter-section">
      <label for="filter" class="filter-label">Filter by type:</label>
      <select
        id="filter"
        bind:value={filter}
        class="filter-select"
      >
        <option value="all">All Activities</option>
        {#each activityTypes as type}
          <option value={type}>{type.charAt(0).toUpperCase() + type.slice(1)}</option>
        {/each}
      </select>
    </div>
  {/if}

  {#if loading}
    <div class="loading">
      <p>Loading activities...</p>
    </div>
  {:else if activities.length === 0}
    <div class="empty-state">
      <svg class="empty-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
      </svg>
      <h2 class="empty-title">No Activities Yet</h2>
      <p class="empty-description">
        Start logging your exercises and activities to track your progress.
      </p>
    </div>
  {:else if Object.keys(filteredGrouped).length === 0}
    <div class="empty-state">
      <p class="text-gray-600 text-base">No activities found for the selected filter.</p>
    </div>
  {:else}
    <div class="activities-list">
      {#each Object.entries(filteredGrouped).sort((a, b) => b[0].localeCompare(a[0])) as [date, dayActivities]}
        <div class="date-group">
          <h3 class="date-header">{formatDate(date)}</h3>
          <div class="activities-grid">
            {#each dayActivities as activity}
              <div class="activity-card">
                <div class="activity-header">
                  <div>
                    <h4 class="activity-type">{activity.type}</h4>
                    <p class="activity-time">{formatTime(activity.timestamp)}</p>
                  </div>
                  {#if activity.intensity}
                    <span class="intensity-badge {getIntensityColor(activity.intensity)}">
                      {activity.intensity}
                    </span>
                  {/if}
                </div>

                <div class="activity-details">
                  <div class="detail-item">
                    <svg class="detail-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{activity.duration} min</span>
                  </div>

                  {#if activity.enjoyment !== undefined || activity.mastery !== undefined}
                    <div class="ratings">
                      {#if activity.enjoyment !== undefined}
                        <div class="rating-item">
                          <span class="rating-label">Enjoyment:</span>
                          <span class="rating-value">{activity.enjoyment}/10</span>
                        </div>
                      {/if}
                      {#if activity.mastery !== undefined}
                        <div class="rating-item">
                          <span class="rating-label">Mastery:</span>
                          <span class="rating-value">{activity.mastery}/10</span>
                        </div>
                      {/if}
                    </div>
                  {/if}

                  {#if activity.equipment || activity.location}
                    <div class="meta-info">
                      {#if activity.equipment}
                        <div class="meta-item">
                          <svg class="meta-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                          </svg>
                          <span>{activity.equipment}</span>
                        </div>
                      {/if}
                      {#if activity.location}
                        <div class="meta-item">
                          <svg class="meta-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          <span>{activity.location}</span>
                        </div>
                      {/if}
                    </div>
                  {/if}

                  {#if activity.notes}
                    <p class="activity-notes">{activity.notes}</p>
                  {/if}
                </div>
              </div>
            {/each}
          </div>
        </div>
      {/each}
    </div>
  {/if}
</div>

<style>
  .activity-history {
    @apply space-y-4;
  }

  .filter-section {
    @apply flex items-center gap-3 mb-6;
  }

  .filter-label {
    @apply text-base font-medium text-gray-700;
  }

  .filter-select {
    @apply px-4 py-2 border border-gray-300 rounded-lg text-base
           focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent
           min-h-[44px];
  }

  .loading {
    @apply text-center py-12;
  }

  .empty-state {
    @apply text-center py-12 px-4;
  }

  .empty-icon {
    @apply w-16 h-16 text-gray-400 mx-auto mb-4;
  }

  .empty-title {
    @apply text-xl font-semibold text-gray-900 mb-2;
  }

  .empty-description {
    @apply text-base text-gray-600;
  }

  .activities-list {
    @apply space-y-8;
  }

  .date-group {
    @apply space-y-3;
  }

  .date-header {
    @apply text-lg font-semibold text-gray-900 sticky top-0 bg-white py-2 z-10;
  }

  .activities-grid {
    @apply space-y-3;
  }

  .activity-card {
    @apply bg-white border border-gray-200 rounded-lg p-4 shadow-sm;
  }

  .activity-header {
    @apply flex items-start justify-between mb-3;
  }

  .activity-type {
    @apply text-base font-semibold text-gray-900 capitalize;
  }

  .activity-time {
    @apply text-sm text-gray-500 mt-1;
  }

  .intensity-badge {
    @apply px-3 py-1 rounded-full text-xs font-medium uppercase tracking-wide;
  }

  .activity-details {
    @apply space-y-3;
  }

  .detail-item {
    @apply flex items-center gap-2 text-base text-gray-700;
  }

  .detail-icon {
    @apply w-5 h-5 text-gray-500;
  }

  .ratings {
    @apply flex gap-4 text-sm text-gray-700;
  }

  .rating-item {
    @apply flex items-center gap-1;
  }

  .rating-label {
    @apply text-gray-600;
  }

  .rating-value {
    @apply font-medium text-indigo-600;
  }

  .meta-info {
    @apply flex flex-wrap gap-3 text-sm text-gray-600;
  }

  .meta-item {
    @apply flex items-center gap-1;
  }

  .meta-icon {
    @apply w-4 h-4 text-gray-500;
  }

  .activity-notes {
    @apply text-sm text-gray-700 bg-gray-50 rounded p-3 mt-2;
  }
</style>
