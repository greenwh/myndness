<!-- src/routes/track/activities/+page.svelte -->
<script lang="ts">
  import { base } from '$app/paths';
  import ActivityLogger from '$lib/components/activities/ActivityLogger.svelte';
</script>

<svelte:head>
  <title>Log Activity - Myndness</title>
</svelte:head>

<div class="container">
  <!-- Header -->
  <div class="header">
    <div class="flex items-center gap-4 mb-2">
      <a href="{base}/track" class="back-button" aria-label="Back to Track hub">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
      </a>
      <h1 class="text-3xl font-bold text-gray-900">Log Activity</h1>
    </div>
    <p class="text-base text-gray-600 ml-10">
      Track your exercises and physical activities
    </p>
  </div>

  <!-- View History Link -->
  <div class="mb-6">
    <a href="{base}/track/activities/history" class="history-link">
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      View History
    </a>
  </div>

  <!-- Logger Component -->
  <div class="card">
    <ActivityLogger />
  </div>
</div>

<style>
  .container {
    @apply max-w-2xl mx-auto px-4 py-6;
  }

  .header {
    @apply mb-6;
  }

  .back-button {
    @apply text-gray-600 hover:text-gray-900 focus:outline-none focus:ring-2
           focus:ring-indigo-500 focus:ring-offset-2 rounded-lg p-1
           min-w-[44px] min-h-[44px] flex items-center justify-center;
  }

  .history-link {
    @apply inline-flex items-center gap-2 text-base text-indigo-600 hover:text-indigo-800
           focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 rounded-lg
           px-4 py-2 min-h-[44px];
  }

  .card {
    @apply bg-white rounded-lg shadow-sm border border-gray-200 p-6;
  }
</style>
