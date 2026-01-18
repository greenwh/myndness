<script lang="ts">
  import type { Settings } from '$lib/db/types';

  let { value, onChange } = $props<{
    value: Settings['theme'];
    onChange: (theme: Settings['theme']) => void;
  }>();
</script>

<div class="setting-item">
  <label for="theme-select" class="setting-label">Theme</label>
  <select
    id="theme-select"
    class="setting-select"
    value={value}
    onchange={(e) => onChange(e.currentTarget.value as Settings['theme'])}
  >
    <option value="light">Light</option>
    <option value="dark">Dark</option>
    <option value="system">System Default</option>
  </select>
</div>

<style>
  .setting-item {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .setting-label {
    font-size: 1rem;
    font-weight: 500;
    color: #374151;
  }

  .setting-select {
    padding: 0.75rem;
    font-size: 1rem;
    border: 1px solid #d1d5db;
    border-radius: 8px;
    background: white;
    color: #111827;
    cursor: pointer;
    min-height: 44px; /* Accessibility: 44px touch target */
  }

  .setting-select:focus {
    outline: 2px solid #3b82f6;
    outline-offset: 2px;
  }

  /* Dark mode */
  :global(.dark-mode) .setting-label {
    color: #d1d5db;
  }

  :global(.dark-mode) .setting-select {
    background: #374151;
    border-color: #4b5563;
    color: #f9fafb;
  }
</style>
