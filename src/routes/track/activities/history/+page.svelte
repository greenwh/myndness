<!-- src/routes/track/activities/history/+page.svelte -->
<script lang="ts">
  import { base } from '$app/paths';
  import ActivityHistory from '$lib/components/activities/ActivityHistory.svelte';
</script>

<svelte:head>
  <title>Activity History - Myndness</title>
</svelte:head>

<div class="container">
  <!-- Header -->
  <div class="header">
    <div class="flex items-center gap-4 mb-2">
      <a href="{base}/track/activities" class="back-button" aria-label="Back to Log Activity">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
      </a>
      <h1 class="text-3xl font-bold text-gray-900">Activity History</h1>
    </div>
    <p class="text-base text-gray-600 ml-10">
      Review your past exercises and activities
    </p>
  </div>

  <!-- Log New Button -->
  <div class="mb-6">
    <a href="{base}/track/activities" class="log-button">
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
      </svg>
      Log New Activity
    </a>
  </div>

  <!-- History Component -->
  <div class="card">
    <ActivityHistory />
  </div>
</div>

<style>
  .container {
    @apply max-w-4xl mx-auto px-4 py-6;
  }

  .header {
    @apply mb-6;
  }

  .back-button {
    @apply text-gray-600 hover:text-gray-900 focus:outline-none focus:ring-2
           focus:ring-indigo-500 focus:ring-offset-2 rounded-lg p-1
           min-w-[44px] min-h-[44px] flex items-center justify-center;
  }

  .log-button {
    @apply inline-flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg
           text-base font-medium hover:bg-indigo-700
           focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2
           min-h-[44px];
  }

  .card {
    @apply bg-white rounded-lg shadow-sm border border-gray-200 p-6;
  }
</style>
