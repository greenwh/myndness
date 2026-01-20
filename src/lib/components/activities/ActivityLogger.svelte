<!-- src/lib/components/activities/ActivityLogger.svelte -->
<script lang="ts">
  import { db } from '$lib/db';
  import type { Activity, ExerciseType } from '$lib/db/types';
  import CharacterCounter from '$lib/components/common/CharacterCounter.svelte';

  let saveStatus: 'idle' | 'saving' | 'saved' | 'error' = 'idle';
  let errorMessage = '';
  let savedActivity: Activity | null = null;

  // Form data
  let type: ExerciseType | 'other' = 'cycling';
  let customType = '';
  let duration: number | '' = '';
  let intensity: 'light' | 'moderate' | 'vigorous' = 'moderate';
  let enjoyment: number | undefined = undefined;
  let mastery: number | undefined = undefined;
  let showEnjoyment = false;
  let showMastery = false;
  let equipment = '';
  let location = '';
  let notes = '';

  // Validation
  $: isValid =
    (type !== 'other' || customType.trim().length > 0) &&
    duration !== '' &&
    duration >= 1 &&
    duration <= 300;

  const exerciseTypes: { value: ExerciseType | 'other'; label: string }[] = [
    { value: 'cycling', label: 'Cycling' },
    { value: 'resistance-bands', label: 'Resistance Bands' },
    { value: 'stretching', label: 'Stretching' },
    { value: 'tai-chi', label: 'Tai Chi' },
    { value: 'walking', label: 'Walking' },
    { value: 'yoga', label: 'Yoga' },
    { value: 'swimming', label: 'Swimming' },
    { value: 'other', label: 'Other' }
  ];

  async function saveActivity() {
    if (!isValid) return;

    saveStatus = 'saving';
    errorMessage = '';

    try {
      const now = new Date();
      const activity: Omit<Activity, 'id'> = {
        date: now.toISOString().split('T')[0],
        timestamp: now.toISOString(),
        type: type === 'other' ? customType.trim() : type,
        duration: duration as number,
        intensity,
        enjoyment: enjoyment !== undefined ? enjoyment : undefined,
        mastery: mastery !== undefined ? mastery : undefined,
        equipment: equipment.trim() || undefined,
        location: location.trim() || undefined,
        notes: notes.trim() || undefined
      };

      const id = await db.activities.add(activity);
      savedActivity = { ...activity, id };
      saveStatus = 'saved';
    } catch (error) {
      console.error('Error saving activity:', error);
      saveStatus = 'error';
      errorMessage = 'Failed to save activity. Please try again.';
    }
  }

  function resetForm() {
    type = 'cycling';
    customType = '';
    duration = '';
    intensity = 'moderate';
    enjoyment = undefined;
    mastery = undefined;
    showEnjoyment = false;
    showMastery = false;
    equipment = '';
    location = '';
    notes = '';
    savedActivity = null;
    saveStatus = 'idle';
    errorMessage = '';
  }
</script>

{#if saveStatus === 'saved' && savedActivity}
  <!-- Success View -->
  <div class="success-view">
    <div class="success-icon">
      <svg class="w-16 h-16 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    </div>
    <h2 class="text-2xl font-semibold text-gray-900 mb-2">Activity Logged</h2>
    <div class="success-details">
      <p class="text-lg text-gray-700">
        <strong>{savedActivity.type}</strong>
      </p>
      <p class="text-gray-600">{savedActivity.duration} minutes • {savedActivity.intensity} intensity</p>
      {#if savedActivity.enjoyment !== undefined || savedActivity.mastery !== undefined}
        <div class="mt-3 text-gray-600">
          {#if savedActivity.enjoyment !== undefined}
            <p>Enjoyment: {savedActivity.enjoyment}/10</p>
          {/if}
          {#if savedActivity.mastery !== undefined}
            <p>Mastery: {savedActivity.mastery}/10</p>
          {/if}
        </div>
      {/if}
    </div>
    <button
      on:click={resetForm}
      class="btn-primary mt-6"
    >
      Log Another Activity
    </button>
  </div>
{:else}
  <!-- Form View -->
  <form on:submit|preventDefault={saveActivity} class="space-y-6">
    <!-- Exercise Type -->
    <div>
      <label for="type" class="block text-lg font-medium text-gray-900 mb-2">
        Exercise Type <span class="text-red-600">*</span>
      </label>
      <select
        id="type"
        bind:value={type}
        class="input-field"
        required
      >
        {#each exerciseTypes as option}
          <option value={option.value}>{option.label}</option>
        {/each}
      </select>
    </div>

    <!-- Custom Type (if other) -->
    {#if type === 'other'}
      <div>
        <label for="customType" class="block text-lg font-medium text-gray-900 mb-2">
          Specify Exercise Type <span class="text-red-600">*</span>
        </label>
        <input
          type="text"
          id="customType"
          bind:value={customType}
          class="input-field"
          placeholder="e.g., Tennis, Rowing, Dancing"
          required
        />
        {#if type === 'other' && customType.trim().length === 0}
          <p class="mt-1 text-sm text-red-600">Please specify the exercise type</p>
        {/if}
      </div>
    {/if}

    <!-- Duration -->
    <div>
      <label for="duration" class="block text-lg font-medium text-gray-900 mb-2">
        Duration (minutes) <span class="text-red-600">*</span>
      </label>
      <input
        type="number"
        id="duration"
        bind:value={duration}
        class="input-field"
        min="1"
        max="300"
        placeholder="e.g., 30"
        required
      />
      {#if duration !== '' && (duration < 1 || duration > 300)}
        <p class="mt-1 text-sm text-red-600">Duration must be between 1 and 300 minutes</p>
      {/if}
    </div>

    <!-- Intensity -->
    <fieldset>
      <legend class="block text-lg font-medium text-gray-900 mb-3">
        Intensity
      </legend>
      <div class="grid grid-cols-3 gap-3" role="group" aria-label="Select intensity level">
        <button
          type="button"
          on:click={() => intensity = 'light'}
          class="intensity-btn {intensity === 'light' ? 'intensity-btn-active' : ''}"
        >
          Light
        </button>
        <button
          type="button"
          on:click={() => intensity = 'moderate'}
          class="intensity-btn {intensity === 'moderate' ? 'intensity-btn-active' : ''}"
        >
          Moderate
        </button>
        <button
          type="button"
          on:click={() => intensity = 'vigorous'}
          class="intensity-btn {intensity === 'vigorous' ? 'intensity-btn-active' : ''}"
        >
          Vigorous
        </button>
      </div>
    </fieldset>

    <!-- Optional Ratings -->
    <div class="border-t border-gray-200 pt-6">
      <h3 class="text-lg font-medium text-gray-900 mb-4">Optional Ratings</h3>

      <!-- Enjoyment -->
      <div class="mb-6">
        {#if !showEnjoyment}
          <button
            type="button"
            on:click={() => { showEnjoyment = true; enjoyment = 5; }}
            class="add-rating-btn"
          >
            + Add Enjoyment Rating
          </button>
        {:else}
          <div role="group" aria-labelledby="enjoyment-label">
            <div class="flex items-center justify-between mb-2">
              <label id="enjoyment-label" for="enjoyment" class="text-base font-medium text-gray-700">
                How much did you enjoy this?
              </label>
              <span class="text-2xl font-bold text-indigo-600">{enjoyment}/10</span>
            </div>
            <div class="flex items-center gap-3 mb-2">
              <span class="text-sm text-gray-600">Not at all</span>
              <input
                type="range"
                id="enjoyment"
                bind:value={enjoyment}
                min="0"
                max="10"
                step="1"
                class="rating-slider flex-1"
                aria-label="Enjoyment rating from 0 to 10"
              />
              <span class="text-sm text-gray-600">Very much</span>
            </div>
            <button
              type="button"
              on:click={() => { showEnjoyment = false; enjoyment = undefined; }}
              class="text-sm text-gray-600 hover:text-gray-800"
            >
              Remove rating
            </button>
          </div>
        {/if}
      </div>

      <!-- Mastery -->
      <div>
        {#if !showMastery}
          <button
            type="button"
            on:click={() => { showMastery = true; mastery = 5; }}
            class="add-rating-btn"
          >
            + Add Mastery Rating
          </button>
        {:else}
          <div role="group" aria-labelledby="mastery-label">
            <div class="flex items-center justify-between mb-2">
              <label id="mastery-label" for="mastery" class="text-base font-medium text-gray-700">
                Sense of mastery/accomplishment?
              </label>
              <span class="text-2xl font-bold text-indigo-600">{mastery}/10</span>
            </div>
            <div class="flex items-center gap-3 mb-2">
              <span class="text-sm text-gray-600">None</span>
              <input
                type="range"
                id="mastery"
                bind:value={mastery}
                min="0"
                max="10"
                step="1"
                class="rating-slider flex-1"
                aria-label="Mastery rating from 0 to 10"
              />
              <span class="text-sm text-gray-600">High</span>
            </div>
            <button
              type="button"
              on:click={() => { showMastery = false; mastery = undefined; }}
              class="text-sm text-gray-600 hover:text-gray-800"
            >
              Remove rating
            </button>
          </div>
        {/if}
      </div>
    </div>

    <!-- Optional Details -->
    <div class="border-t border-gray-200 pt-6">
      <h3 class="text-lg font-medium text-gray-900 mb-4">Optional Details</h3>

      <!-- Equipment -->
      <div class="mb-4">
        <label for="equipment" class="block text-base font-medium text-gray-700 mb-2">
          Equipment Used
        </label>
        <input
          type="text"
          id="equipment"
          bind:value={equipment}
          class="input-field"
          placeholder="e.g., Stationary bike, resistance bands"
        />
      </div>

      <!-- Location -->
      <div class="mb-4">
        <label for="location" class="block text-base font-medium text-gray-700 mb-2">
          Location
        </label>
        <input
          type="text"
          id="location"
          bind:value={location}
          class="input-field"
          placeholder="e.g., Home, Gym, Park"
        />
      </div>

      <!-- Notes -->
      <div>
        <label for="notes" class="block text-base font-medium text-gray-700 mb-2">
          Notes
        </label>
        <CharacterCounter bind:value={notes} maxLength={200} placeholder="Any additional notes..." />
      </div>
    </div>

    <!-- Error Message -->
    {#if errorMessage}
      <div class="error-message">
        {errorMessage}
      </div>
    {/if}

    <!-- Save Button -->
    <div class="pt-4">
      <button
        type="submit"
        disabled={!isValid || saveStatus === 'saving'}
        class="btn-primary w-full"
      >
        {saveStatus === 'saving' ? 'Saving...' : 'Save Activity'}
      </button>
    </div>
  </form>
{/if}

<style>
  .success-view {
    @apply text-center py-8 px-4;
  }

  .success-icon {
    @apply flex justify-center mb-4;
  }

  .success-details {
    @apply bg-gray-50 rounded-lg p-4 mb-4;
  }

  .intensity-btn {
    @apply py-3 px-4 border-2 border-gray-300 rounded-lg text-base font-medium text-gray-700
           bg-white hover:border-indigo-500 hover:text-indigo-700 transition-colors
           min-h-[44px] focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2;
  }

  .intensity-btn-active {
    @apply border-indigo-600 bg-indigo-50 text-indigo-700;
  }

  .input-field {
    @apply w-full px-4 py-3 text-base border border-gray-300 rounded-lg
           focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent
           min-h-[44px];
  }

  .btn-primary {
    @apply bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium text-base
           hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2
           disabled:opacity-50 disabled:cursor-not-allowed
           min-h-[44px] transition-colors;
  }

  .error-message {
    @apply bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-base;
  }

  .add-rating-btn {
    @apply text-indigo-600 hover:text-indigo-800 text-base font-medium
           focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 rounded-lg
           px-4 py-2 min-h-[44px] transition-colors;
  }

  .rating-slider {
    @apply w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer;
    accent-color: #4f46e5; /* indigo-600 */
  }

  .rating-slider::-webkit-slider-thumb {
    @apply appearance-none w-11 h-11 bg-white border-4 border-indigo-600 rounded-full cursor-pointer;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  }

  .rating-slider::-moz-range-thumb {
    @apply w-11 h-11 bg-white border-4 border-indigo-600 rounded-full cursor-pointer;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  }

  .rating-slider:focus {
    outline: none;
    ring: 2px;
    ring-color: #4f46e5;
    ring-offset: 2px;
  }
</style>
