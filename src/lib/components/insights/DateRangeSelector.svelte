<script lang="ts">
  import { subDays, format } from 'date-fns';

  interface Props {
    selected: '7d' | '30d' | '90d' | 'all';
    onchange?: (range: '7d' | '30d' | '90d' | 'all', startDate: string, endDate: string) => void;
  }

  let { selected = $bindable('30d'), onchange }: Props = $props();

  const today = format(new Date(), 'yyyy-MM-dd');

  const ranges = [
    { value: '7d' as const, label: '7 Days' },
    { value: '30d' as const, label: '30 Days' },
    { value: '90d' as const, label: '90 Days' },
    { value: 'all' as const, label: 'All Time' }
  ];

  function handleRangeChange(range: '7d' | '30d' | '90d' | 'all') {
    selected = range;

    let startDate: string;
    const endDate = today;

    switch (range) {
      case '7d':
        startDate = format(subDays(new Date(), 7), 'yyyy-MM-dd');
        break;
      case '30d':
        startDate = format(subDays(new Date(), 30), 'yyyy-MM-dd');
        break;
      case '90d':
        startDate = format(subDays(new Date(), 90), 'yyyy-MM-dd');
        break;
      case 'all':
        startDate = '2000-01-01'; // Far past date to include all data
        break;
    }

    if (onchange) {
      onchange(range, startDate, endDate);
    }
  }
</script>

<div class="date-range-selector">
  <div class="flex gap-2 overflow-x-auto pb-2">
    {#each ranges as range}
      <button
        type="button"
        class="filter-tab"
        class:active={selected === range.value}
        onclick={() => handleRangeChange(range.value)}
      >
        {range.label}
      </button>
    {/each}
  </div>
</div>

<style>
  .date-range-selector {
    position: sticky;
    top: 0;
    z-index: 10;
    background: white;
    padding: 1rem 0;
    margin-bottom: 1.5rem;
    border-bottom: 1px solid #e5e7eb;
  }

  .filter-tab {
    flex-shrink: 0;
    padding: 0.75rem 1.25rem;
    font-size: 1rem;
    font-weight: 500;
    color: #4b5563;
    background: white;
    border: 2px solid #e5e7eb;
    border-radius: 0.5rem;
    cursor: pointer;
    transition: all 0.2s;
    min-height: 44px;
    white-space: nowrap;
  }

  .filter-tab:hover {
    border-color: #3b82f6;
    color: #3b82f6;
  }

  .filter-tab:focus {
    outline: 2px solid #3b82f6;
    outline-offset: 2px;
  }

  .filter-tab.active {
    background: #3b82f6;
    color: white;
    border-color: #3b82f6;
  }

  /* Scrollbar styling for overflow-x-auto */
  .flex {
    scrollbar-width: thin;
    scrollbar-color: #cbd5e1 transparent;
  }

  .flex::-webkit-scrollbar {
    height: 8px;
  }

  .flex::-webkit-scrollbar-track {
    background: transparent;
  }

  .flex::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 4px;
  }

  .flex::-webkit-scrollbar-thumb:hover {
    background: #94a3b8;
  }
</style>
