<script lang="ts">
  import type { Settings } from '$lib/db/types';

  let { value, onChange } = $props<{
    value: Settings['fontSize'];
    onChange: (size: Settings['fontSize']) => void;
  }>();
</script>

<div class="setting-item">
  <label class="setting-label">Font Size</label>
  <div class="radio-group">
    <label class="radio-option">
      <input
        type="radio"
        name="font-size"
        value="normal"
        checked={value === 'normal'}
        onchange={(e) => e.currentTarget.checked && onChange('normal')}
      />
      <span class="radio-label">Normal</span>
    </label>
    <label class="radio-option">
      <input
        type="radio"
        name="font-size"
        value="large"
        checked={value === 'large'}
        onchange={(e) => e.currentTarget.checked && onChange('large')}
      />
      <span class="radio-label">Large</span>
    </label>
    <label class="radio-option">
      <input
        type="radio"
        name="font-size"
        value="extra-large"
        checked={value === 'extra-large'}
        onchange={(e) => e.currentTarget.checked && onChange('extra-large')}
      />
      <span class="radio-label">Extra Large</span>
    </label>
  </div>
</div>

<style>
  .setting-item {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .setting-label {
    font-size: 1rem;
    font-weight: 500;
    color: #374151;
  }

  .radio-group {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .radio-option {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.75rem;
    border: 1px solid #d1d5db;
    border-radius: 8px;
    cursor: pointer;
    min-height: 44px; /* Accessibility: 44px touch target */
    background: white;
  }

  .radio-option:hover {
    background: #f9fafb;
  }

  .radio-option input[type="radio"] {
    width: 20px;
    height: 20px;
    cursor: pointer;
  }

  .radio-option input[type="radio"]:focus {
    outline: 2px solid #3b82f6;
    outline-offset: 2px;
  }

  .radio-label {
    font-size: 1rem;
    color: #111827;
    cursor: pointer;
  }

  /* Dark mode */
  :global(.dark-mode) .setting-label {
    color: #d1d5db;
  }

  :global(.dark-mode) .radio-option {
    background: #374151;
    border-color: #4b5563;
  }

  :global(.dark-mode) .radio-option:hover {
    background: #4b5563;
  }

  :global(.dark-mode) .radio-label {
    color: #f9fafb;
  }
</style>
