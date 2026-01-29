<!-- src/routes/track/energy/+page.svelte -->
<!-- Morning Energy Assessment Page -->

<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { base } from '$app/paths';
  import EnergyAssessment from '$lib/components/energy/EnergyAssessment.svelte';
  import { getTodayEnergyLog } from '$lib/db';

  let alreadyLogged = $state(false);
  let loading = $state(true);

  onMount(async () => {
    // Check if energy already logged today
    const todayLog = await getTodayEnergyLog();
    if (todayLog) {
      alreadyLogged = true;
    }
    loading = false;
  });
</script>

<svelte:head>
  <title>Morning Energy Assessment - Myndness</title>
</svelte:head>

<main class="container">
  {#if loading}
    <div class="loading">Loading...</div>
  {:else if alreadyLogged}
    <div class="already-logged">
      <h2 class="text-2xl font-semibold mb-4">Already Logged Today</h2>
      <p class="mb-6">
        You've already logged your energy for today. You can update it by logging again.
      </p>
      <div class="button-group">
        <a href="{base}/" class="btn btn-secondary">Back to Dashboard</a>
        <button
          onclick={() => alreadyLogged = false}
          class="btn btn-primary"
        >
          Update Energy Log
        </button>
      </div>
    </div>
  {:else}
    <EnergyAssessment />
  {/if}
</main>

<style>
  .container {
    max-width: 800px;
    margin: 0 auto;
    padding: 2rem 1rem;
  }

  .loading {
    text-align: center;
    padding: 3rem;
    font-size: 1.25rem;
    color: #6b7280;
  }

  .already-logged {
    text-align: center;
    padding: 2rem;
  }

  .button-group {
    display: flex;
    gap: 1rem;
    justify-content: center;
    margin-top: 2rem;
  }

  .btn {
    min-height: 44px;
    min-width: 44px;
    padding: 0.75rem 2rem;
    font-size: 1.125rem;
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

  .btn-secondary {
    background-color: white;
    color: #374151;
    border: 2px solid #d1d5db;
  }

  .btn-secondary:hover {
    background-color: #f3f4f6;
  }
</style>
