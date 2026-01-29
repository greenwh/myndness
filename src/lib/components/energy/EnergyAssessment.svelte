<!-- src/lib/components/energy/EnergyAssessment.svelte -->
<!-- Morning spoon assessment form - Phase 8 Autism Productivity -->

<script lang="ts">
  import { db } from '$lib/db';
  import type { EnergyLog } from '$lib/db/types';

  // Component state
  let morningSpoons = $state(5);
  let sleepQuality = $state<number | undefined>(undefined);
  let notes = $state('');
  let showSleepQuality = $state(false);
  let saving = $state(false);
  let saved = $state(false);

  // Handle save
  async function handleSave() {
    saving = true;

    const today = new Date().toISOString().split('T')[0];
    const timestamp = new Date().toISOString();

    const energyLog: Omit<EnergyLog, 'id'> = {
      date: today,
      timestamp,
      morningSpoons,
      sleepQuality: showSleepQuality ? sleepQuality : undefined,
      spoonsUsed: 0,
      spoonsRemaining: morningSpoons,
      notes: notes.trim() || undefined
    };

    try {
      await db.energyLogs.add(energyLog);
      saved = true;
    } catch (error) {
      console.error('Failed to save energy log:', error);
      alert('Failed to save. Please try again.');
    } finally {
      saving = false;
    }
  }

  // Reset for new entry
  function handleAnother() {
    saved = false;
    morningSpoons = 5;
    sleepQuality = undefined;
    notes = '';
    showSleepQuality = false;
  }
</script>

{#if saved}
  <!-- Success view -->
  <div class="success-view">
    <div class="success-icon">✓</div>
    <h2 class="text-2xl font-semibold mb-2">Energy Logged</h2>
    <p class="text-lg mb-6">
      You have <span class="font-bold text-teal-600">{morningSpoons} spoons</span> today
    </p>

    <div class="button-group">
      <button
        onclick={handleAnother}
        class="btn btn-secondary"
      >
        Update Assessment
      </button>
      <a
        href="/myndness/plan/today"
        class="btn btn-primary"
      >
        Plan Your Day
      </a>
    </div>
  </div>
{:else}
  <!-- Form view -->
  <div class="form-view">
    <h1 class="text-3xl font-bold mb-2">Morning Energy Assessment</h1>
    <p class="text-gray-600 mb-8">
      How much energy do you have today?
    </p>

    <!-- Main question: How many spoons today? -->
    <div class="form-section mb-8">
      <label class="form-label" for="spoons">
        How many spoons today?
        <span class="text-sm text-gray-500 ml-2">(0 = exhausted, 10 = energized)</span>
      </label>

      <div class="range-container">
        <input
          type="range"
          id="spoons"
          min="0"
          max="10"
          step="1"
          bind:value={morningSpoons}
          class="range-input"
        />
        <div class="range-value">{morningSpoons}</div>
      </div>

      <div class="range-labels">
        <span>Exhausted (0)</span>
        <span>Energized (10)</span>
      </div>
    </div>

    <!-- Optional: Sleep quality -->
    <div class="form-section mb-8">
      {#if !showSleepQuality}
        <button
          onclick={() => showSleepQuality = true}
          class="btn btn-link"
        >
          + Add sleep quality rating
        </button>
      {:else}
        <label class="form-label" for="sleep">
          Sleep Quality
          <span class="text-sm text-gray-500 ml-2">(0 = terrible, 10 = excellent)</span>
        </label>

        <div class="range-container">
          <input
            type="range"
            id="sleep"
            min="0"
            max="10"
            step="1"
            bind:value={sleepQuality}
            class="range-input"
          />
          <div class="range-value">{sleepQuality ?? 5}</div>
        </div>

        <div class="range-labels">
          <span>Terrible (0)</span>
          <span>Excellent (10)</span>
        </div>

        <button
          onclick={() => { showSleepQuality = false; sleepQuality = undefined; }}
          class="btn btn-link text-red-600 mt-2"
        >
          Remove sleep quality
        </button>
      {/if}
    </div>

    <!-- Optional: Notes -->
    <div class="form-section mb-8">
      <label class="form-label" for="notes">
        Notes (optional)
      </label>
      <textarea
        id="notes"
        bind:value={notes}
        placeholder="Any context about your energy today..."
        maxlength="200"
        rows="3"
        class="textarea"
      ></textarea>
      <div class="char-count">
        {notes.length}/200
      </div>
    </div>

    <!-- Actions -->
    <div class="button-group">
      <a
        href="/myndness"
        class="btn btn-secondary"
      >
        Cancel
      </a>
      <button
        onclick={handleSave}
        disabled={saving}
        class="btn btn-primary"
      >
        {saving ? 'Saving...' : 'Save Assessment'}
      </button>
    </div>
  </div>
{/if}

<style>
  .success-view {
    text-align: center;
    padding: 2rem 1rem;
  }

  .success-icon {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    background-color: #14b8a6;
    color: white;
    font-size: 48px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 1.5rem;
  }

  .form-view {
    max-width: 600px;
    margin: 0 auto;
    padding: 1rem;
  }

  .form-section {
    margin-bottom: 2rem;
  }

  .form-label {
    display: block;
    font-size: 1.125rem;
    font-weight: 600;
    margin-bottom: 1rem;
    color: #1f2937;
  }

  .range-container {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 0.5rem;
  }

  .range-input {
    flex: 1;
    height: 44px;
    cursor: pointer;
  }

  .range-value {
    font-size: 2rem;
    font-weight: bold;
    color: #14b8a6;
    min-width: 60px;
    text-align: center;
  }

  .range-labels {
    display: flex;
    justify-content: space-between;
    font-size: 0.875rem;
    color: #6b7280;
    margin-top: 0.5rem;
  }

  .textarea {
    width: 100%;
    padding: 0.75rem;
    border: 2px solid #d1d5db;
    border-radius: 8px;
    font-size: 1rem;
    font-family: inherit;
    resize: vertical;
    min-height: 44px;
  }

  .textarea:focus {
    outline: none;
    border-color: #14b8a6;
    ring: 2px;
    ring-color: #14b8a6;
  }

  .char-count {
    text-align: right;
    font-size: 0.875rem;
    color: #6b7280;
    margin-top: 0.25rem;
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
  }

  .btn-primary {
    background-color: #14b8a6;
    color: white;
    border: none;
  }

  .btn-primary:hover:not(:disabled) {
    background-color: #0d9488;
  }

  .btn-primary:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .btn-secondary {
    background-color: white;
    color: #374151;
    border: 2px solid #d1d5db;
  }

  .btn-secondary:hover {
    background-color: #f3f4f6;
  }

  .btn-link {
    background: none;
    border: none;
    color: #14b8a6;
    text-decoration: underline;
    padding: 0.5rem;
    font-size: 1rem;
    cursor: pointer;
    min-height: 44px;
  }

  .btn-link:hover {
    color: #0d9488;
  }
</style>
