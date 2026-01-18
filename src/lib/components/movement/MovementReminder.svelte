<script lang="ts">
  import { onMount } from 'svelte';
  import { base } from '$app/paths';
  import { shouldShowMovementReminder, dismissMovementReminder } from '$lib/utils/movementTracking';

  let show = $state(false);

  onMount(() => {
    // Check every 5 minutes if reminder should show
    const interval = setInterval(() => {
      show = shouldShowMovementReminder();
    }, 5 * 60 * 1000);

    return () => clearInterval(interval);
  });

  function handleDismiss() {
    dismissMovementReminder();
    show = false;
  }
</script>

{#if show}
  <div class="movement-reminder">
    <div class="reminder-content">
      <span class="reminder-icon">🚶</span>
      <p class="reminder-text">Time for a movement break?</p>
    </div>
    <div class="reminder-actions">
      <a href="{base}/tools/movement" class="reminder-link">
        View exercises
      </a>
      <button class="reminder-dismiss" onclick={handleDismiss} aria-label="Dismiss movement reminder">
        ✕
      </button>
    </div>
  </div>
{/if}

<style>
  .movement-reminder {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    background: #fef3c7;
    border-bottom: 1px solid #fbbf24;
    padding: 0.75rem 1rem;
    z-index: 90;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  .reminder-content {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  .reminder-icon {
    font-size: 1.25rem;
  }

  .reminder-text {
    margin: 0;
    font-size: 1rem;
    font-weight: 500;
    color: #92400e;
  }

  .reminder-actions {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  .reminder-link {
    padding: 0.5rem 1rem;
    background: #fbbf24;
    color: #78350f;
    font-size: 0.95rem;
    font-weight: 500;
    border-radius: 6px;
    text-decoration: none;
    min-height: 44px;
    display: inline-flex;
    align-items: center;
  }

  .reminder-link:hover {
    background: #f59e0b;
  }

  .reminder-link:focus {
    outline: 2px solid #78350f;
    outline-offset: 2px;
  }

  .reminder-dismiss {
    padding: 0.5rem;
    background: transparent;
    border: none;
    color: #92400e;
    font-size: 1.25rem;
    cursor: pointer;
    min-width: 44px;
    min-height: 44px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: 6px;
  }

  .reminder-dismiss:hover {
    background: rgba(0, 0, 0, 0.05);
  }

  .reminder-dismiss:focus {
    outline: 2px solid #78350f;
    outline-offset: 2px;
  }

  /* Dark mode */
  :global(.dark-mode) .movement-reminder {
    background: #78350f;
    border-bottom-color: #92400e;
  }

  :global(.dark-mode) .reminder-text {
    color: #fef3c7;
  }

  :global(.dark-mode) .reminder-link {
    background: #92400e;
    color: #fef3c7;
  }

  :global(.dark-mode) .reminder-link:hover {
    background: #a16207;
  }

  :global(.dark-mode) .reminder-dismiss {
    color: #fef3c7;
  }

  :global(.dark-mode) .reminder-dismiss:hover {
    background: rgba(255, 255, 255, 0.1);
  }
</style>
