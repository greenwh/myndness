<script lang="ts">
  let { label, value, onChange } = $props<{
    label: string;
    value: string | undefined;
    onChange: (time: string) => void;
  }>();
</script>

<div class="setting-item">
  <label for={`time-${label}`} class="setting-label">{label}</label>
  <input
    id={`time-${label}`}
    type="time"
    class="time-input"
    value={value || ''}
    oninput={(e) => onChange(e.currentTarget.value)}
  />
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

  .time-input {
    padding: 0.75rem;
    font-size: 1rem;
    border: 1px solid #d1d5db;
    border-radius: 8px;
    background: white;
    color: #111827;
    min-height: 44px; /* Accessibility: 44px touch target */
  }

  .time-input:focus {
    outline: 2px solid #3b82f6;
    outline-offset: 2px;
  }

  /* Dark mode */
  :global(.dark-mode) .setting-label {
    color: #d1d5db;
  }

  :global(.dark-mode) .time-input {
    background: #374151;
    border-color: #4b5563;
    color: #f9fafb;
    color-scheme: dark;
  }
</style>
