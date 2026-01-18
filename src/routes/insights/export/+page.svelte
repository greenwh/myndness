<script lang="ts">
  import { base } from '$app/paths';
  import { format, subDays } from 'date-fns';
  import DateRangeSelector from '$lib/components/insights/DateRangeSelector.svelte';
  import { getMoodLogs, getBPReadings, getMindfulnessSessions, getThoughtRecords, db } from '$lib/db';
  import type { ExportData } from '$lib/db/types';
  import { exportToJSON, exportAllAsCSV, generateFilename } from '$lib/utils/exportHelpers';

  // Date range state
  let selectedRange = $state<'7d' | '30d' | '90d' | 'all'>('30d');
  let startDate = $state('');
  let endDate = $state('');

  // Data type selections
  let includeMoodLogs = $state(true);
  let includeBPReadings = $state(true);
  let includeActivities = $state(true);
  let includeMindfulness = $state(true);
  let includeThoughtRecords = $state(true);

  // Export format
  let exportFormat = $state<'csv' | 'json'>('csv');

  // UI state
  let isExporting = $state(false);
  let exportSuccess = $state(false);
  let exportMessage = $state('');

  // Initialize with 30 days
  const today = format(new Date(), 'yyyy-MM-dd');
  startDate = format(subDays(new Date(), 30), 'yyyy-MM-dd');
  endDate = today;

  function handleRangeChange(
    range: '7d' | '30d' | '90d' | 'all',
    newStartDate: string,
    newEndDate: string
  ) {
    selectedRange = range;
    startDate = newStartDate;
    endDate = newEndDate;
  }

  async function handleExport() {
    isExporting = true;
    exportSuccess = false;
    exportMessage = '';

    try {
      // Fetch selected data
      const exportData: ExportData = {
        exportDate: new Date().toISOString(),
        exportVersion: '1.0',
        dateRange: { start: startDate, end: endDate },
        moodLogs: includeMoodLogs ? await getMoodLogs(startDate, endDate) : [],
        anxietyEpisodes: [], // Not implemented in UI yet
        bpReadings: includeBPReadings ? await getBPReadings(startDate, endDate) : [],
        activities: [], // Old activity type - not used
        plannedActivities: includeActivities
          ? await db.plannedActivities
              .where('date')
              .between(startDate, endDate, true, true)
              .toArray()
          : [],
        thoughtRecords: includeThoughtRecords ? await getThoughtRecords(startDate, endDate) : [],
        behavioralExperiments: [], // Not implemented in UI yet
        mindfulnessSessions: includeMindfulness
          ? await getMindfulnessSessions(startDate, endDate)
          : [],
        summary: []
      };

      // Export based on format
      if (exportFormat === 'json') {
        const filename = generateFilename('myndness_export', 'json');
        exportToJSON(exportData, filename);
        exportMessage = `Export complete: ${filename}`;
      } else {
        exportAllAsCSV(exportData);
        exportMessage = 'Export complete: Multiple CSV files downloaded';
      }

      exportSuccess = true;

      // Clear message after 5 seconds
      setTimeout(() => {
        exportSuccess = false;
        exportMessage = '';
      }, 5000);
    } catch (error) {
      console.error('Export error:', error);
      exportMessage = 'Export failed. Please try again.';
    } finally {
      isExporting = false;
    }
  }
</script>

<svelte:head>
  <title>Export Data - Myndness</title>
</svelte:head>

<div class="export-page">
  <header class="page-header">
    <a href="{base}/insights" class="back-link">← Back to Insights</a>
    <h1 class="page-title">Export Your Data</h1>
    <p class="page-description">
      Download your mental wellness data for backup or external analysis. All data is processed
      on your device and never uploaded to a server.
    </p>
  </header>

  <!-- Privacy Notice -->
  <div class="privacy-notice">
    <div class="notice-icon">🔒</div>
    <div class="notice-content">
      <div class="notice-title">Privacy First</div>
      <div class="notice-text">
        All data processing happens on your device. Your exported files are generated in your
        browser and never sent to any server.
      </div>
    </div>
  </div>

  <!-- Date Range Selector -->
  <div class="export-section">
    <h2 class="section-title">Select Date Range</h2>
    <DateRangeSelector bind:selected={selectedRange} onchange={handleRangeChange} />
  </div>

  <!-- Data Type Selection -->
  <div class="export-section">
    <h2 class="section-title">Select Data to Export</h2>
    <div class="checkbox-group">
      <label class="checkbox-label">
        <input type="checkbox" bind:checked={includeMoodLogs} />
        <span>Mood Logs</span>
      </label>
      <label class="checkbox-label">
        <input type="checkbox" bind:checked={includeBPReadings} />
        <span>Blood Pressure Readings</span>
      </label>
      <label class="checkbox-label">
        <input type="checkbox" bind:checked={includeActivities} />
        <span>Planned Activities</span>
      </label>
      <label class="checkbox-label">
        <input type="checkbox" bind:checked={includeMindfulness} />
        <span>Mindfulness Sessions</span>
      </label>
      <label class="checkbox-label">
        <input type="checkbox" bind:checked={includeThoughtRecords} />
        <span>Thought Records</span>
      </label>
    </div>
  </div>

  <!-- Format Selection -->
  <div class="export-section">
    <h2 class="section-title">Select Export Format</h2>
    <div class="radio-group">
      <label class="radio-label">
        <input type="radio" name="format" value="csv" bind:group={exportFormat} />
        <span class="radio-content">
          <span class="radio-title">CSV (Spreadsheet)</span>
          <span class="radio-description">
            Best for analyzing data in Excel or Google Sheets. Exports one file per data type.
          </span>
        </span>
      </label>
      <label class="radio-label">
        <input type="radio" name="format" value="json" bind:group={exportFormat} />
        <span class="radio-content">
          <span class="radio-title">JSON (Structured)</span>
          <span class="radio-description">
            Best for backups or importing into other apps. Single file with all data.
          </span>
        </span>
      </label>
    </div>
  </div>

  <!-- Export Button -->
  <div class="export-action">
    <button
      type="button"
      class="export-button"
      onclick={handleExport}
      disabled={isExporting ||
        (!includeMoodLogs &&
          !includeBPReadings &&
          !includeActivities &&
          !includeMindfulness &&
          !includeThoughtRecords)}
    >
      {#if isExporting}
        <span class="button-spinner"></span>
        <span>Exporting...</span>
      {:else}
        <span class="button-icon">📥</span>
        <span>Export Data</span>
      {/if}
    </button>
  </div>

  <!-- Success Message -->
  {#if exportSuccess}
    <div class="success-message">
      <span class="success-icon">✓</span>
      <span>{exportMessage}</span>
    </div>
  {/if}
</div>

<style>
  .export-page {
    max-width: 800px;
    margin: 0 auto;
    padding: 1.5rem;
    padding-bottom: 6rem;
  }

  .page-header {
    margin-bottom: 2rem;
  }

  .back-link {
    display: inline-block;
    color: #3b82f6;
    text-decoration: none;
    margin-bottom: 1rem;
    font-size: 1rem;
  }

  .back-link:hover {
    text-decoration: underline;
  }

  .page-title {
    font-size: 2rem;
    font-weight: 700;
    color: #1f2937;
    margin-bottom: 0.5rem;
  }

  .page-description {
    font-size: 1rem;
    color: #6b7280;
  }

  .privacy-notice {
    background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
    padding: 1.5rem;
    border-radius: 0.75rem;
    margin-bottom: 2rem;
    display: flex;
    gap: 1rem;
    align-items: flex-start;
  }

  .notice-icon {
    font-size: 2rem;
    flex-shrink: 0;
  }

  .notice-content {
    flex: 1;
  }

  .notice-title {
    font-size: 1rem;
    font-weight: 600;
    color: #1e40af;
    margin-bottom: 0.25rem;
  }

  .notice-text {
    font-size: 0.875rem;
    color: #1e3a8a;
  }

  .export-section {
    background: white;
    padding: 1.5rem;
    border-radius: 0.75rem;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    margin-bottom: 1.5rem;
  }

  .section-title {
    font-size: 1.25rem;
    font-weight: 600;
    color: #1f2937;
    margin-bottom: 1.5rem;
  }

  .checkbox-group {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .checkbox-label {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    font-size: 1rem;
    color: #1f2937;
    cursor: pointer;
    padding: 0.75rem;
    border-radius: 0.5rem;
    transition: background 0.2s;
  }

  .checkbox-label:hover {
    background: #f9fafb;
  }

  .checkbox-label input[type='checkbox'] {
    width: 24px;
    height: 24px;
    cursor: pointer;
  }

  .radio-group {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .radio-label {
    display: flex;
    align-items: flex-start;
    gap: 0.75rem;
    padding: 1rem;
    border: 2px solid #e5e7eb;
    border-radius: 0.5rem;
    cursor: pointer;
    transition: all 0.2s;
  }

  .radio-label:hover {
    border-color: #3b82f6;
  }

  .radio-label:has(input:checked) {
    border-color: #3b82f6;
    background: #eff6ff;
  }

  .radio-label input[type='radio'] {
    width: 24px;
    height: 24px;
    margin-top: 0.25rem;
    cursor: pointer;
  }

  .radio-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  .radio-title {
    font-size: 1rem;
    font-weight: 600;
    color: #1f2937;
  }

  .radio-description {
    font-size: 0.875rem;
    color: #6b7280;
  }

  .export-action {
    margin-top: 2rem;
    text-align: center;
  }

  .export-button {
    display: inline-flex;
    align-items: center;
    gap: 0.75rem;
    padding: 1rem 2rem;
    background: #3b82f6;
    color: white;
    border: none;
    border-radius: 0.5rem;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.2s;
    min-height: 44px;
  }

  .export-button:hover:not(:disabled) {
    background: #2563eb;
  }

  .export-button:focus {
    outline: 2px solid #3b82f6;
    outline-offset: 2px;
  }

  .export-button:disabled {
    background: #9ca3af;
    cursor: not-allowed;
  }

  .button-icon {
    font-size: 1.5rem;
  }

  .button-spinner {
    width: 20px;
    height: 20px;
    border: 3px solid rgba(255, 255, 255, 0.3);
    border-top-color: white;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .button-spinner {
      animation: none;
    }
  }

  .success-message {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 1rem 1.5rem;
    background: #dcfce7;
    color: #166534;
    border-radius: 0.5rem;
    margin-top: 1.5rem;
    font-size: 1rem;
    font-weight: 500;
  }

  .success-icon {
    font-size: 1.5rem;
    font-weight: 700;
  }

  @media (max-width: 768px) {
    .export-page {
      padding: 1rem;
    }

    .page-title {
      font-size: 1.5rem;
    }
  }
</style>
