import type { ExportData } from '$lib/db/types';
import { format } from 'date-fns';

/**
 * Converts data to CSV format
 * Handles nested objects by flattening them
 */
export function convertToCSV(data: any[], headers?: string[]): string {
  if (data.length === 0) return '';

  // Auto-detect headers from first object if not provided
  const csvHeaders = headers || Object.keys(data[0]);

  // Build header row
  const headerRow = csvHeaders.join(',');

  // Build data rows
  const rows = data.map((item) => {
    return csvHeaders
      .map((header) => {
        let value = item[header];

        // Handle nested objects and arrays
        if (typeof value === 'object' && value !== null) {
          value = JSON.stringify(value);
        }

        // Handle null/undefined
        if (value === null || value === undefined) {
          value = '';
        }

        // Escape quotes and wrap in quotes if contains comma or quote
        const stringValue = String(value);
        if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
          return `"${stringValue.replace(/"/g, '""')}"`;
        }

        return stringValue;
      })
      .join(',');
  });

  return [headerRow, ...rows].join('\n');
}

/**
 * Exports data to CSV file and triggers browser download
 */
export function exportToCSV(data: any[], filename: string, headers?: string[]): void {
  const csv = convertToCSV(data, headers);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  downloadFile(blob, filename);
}

/**
 * Exports data to JSON file with metadata
 */
export function exportToJSON(data: ExportData, filename: string): void {
  const json = JSON.stringify(data, null, 2);
  const blob = new Blob([json], { type: 'application/json;charset=utf-8;' });
  downloadFile(blob, filename);
}

/**
 * Triggers browser download of a Blob
 */
function downloadFile(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.style.display = 'none';

  document.body.appendChild(link);
  link.click();

  // Cleanup
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Generates a timestamped filename
 */
export function generateFilename(prefix: string, extension: 'csv' | 'json'): string {
  const timestamp = format(new Date(), 'yyyy-MM-dd_HHmm');
  return `${prefix}_${timestamp}.${extension}`;
}

/**
 * Formats ExportData for CSV export by data type
 * Returns separate CSV strings for each data type
 */
export function prepareExportForCSV(exportData: ExportData): Record<string, string> {
  const csvExports: Record<string, string> = {};

  // Mood Logs
  if (exportData.moodLogs.length > 0) {
    csvExports.moodLogs = convertToCSV(exportData.moodLogs, [
      'id',
      'date',
      'timestamp',
      'mood',
      'anxiety',
      'notes',
      'isAnxietyEpisode',
      'linkedBpId',
      'linkedEpisodeId'
    ]);
  }

  // BP Readings
  if (exportData.bpReadings.length > 0) {
    csvExports.bpReadings = convertToCSV(exportData.bpReadings, [
      'id',
      'date',
      'timestamp',
      'systolic',
      'diastolic',
      'heartRate',
      'arm',
      'position',
      'isAnxietyRelated',
      'isPostExercise',
      'isPostMedication',
      'linkedEpisodeId',
      'notes'
    ]);
  }

  // Planned Activities
  if (exportData.plannedActivities.length > 0) {
    csvExports.plannedActivities = convertToCSV(exportData.plannedActivities, [
      'id',
      'date',
      'createdAt',
      'activity',
      'category',
      'timeBlock',
      'estimatedDuration',
      'completed',
      'completedAt',
      'actualDuration',
      'enjoyment',
      'mastery',
      'moodBefore',
      'moodAfter',
      'notes'
    ]);
  }

  // Mindfulness Sessions
  if (exportData.mindfulnessSessions.length > 0) {
    csvExports.mindfulnessSessions = convertToCSV(exportData.mindfulnessSessions, [
      'id',
      'date',
      'timestamp',
      'practiceType',
      'durationPlanned',
      'durationActual',
      'moodBefore',
      'anxietyBefore',
      'moodAfter',
      'anxietyAfter',
      'focusQuality',
      'restlessness',
      'completed',
      'notes'
    ]);
  }

  // Thought Records
  if (exportData.thoughtRecords.length > 0) {
    csvExports.thoughtRecords = convertToCSV(exportData.thoughtRecords, [
      'id',
      'date',
      'timestamp',
      'situation',
      'automaticThought',
      'emotion',
      'emotionIntensity',
      'distortions',
      'evidenceFor',
      'evidenceAgainst',
      'balancedThought',
      'outcomeEmotion',
      'outcomeIntensity',
      'isComplete',
      'theme',
      'notes'
    ]);
  }

  return csvExports;
}

/**
 * Downloads multiple CSV files (one per data type) as a zip would require additional library.
 * Instead, we'll download them sequentially with slight delays.
 */
export function exportAllAsCSV(exportData: ExportData): void {
  const csvExports = prepareExportForCSV(exportData);

  let delay = 0;
  for (const [type, csvContent] of Object.entries(csvExports)) {
    setTimeout(() => {
      const filename = generateFilename(`myndness_${type}`, 'csv');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      downloadFile(blob, filename);
    }, delay);
    delay += 500; // 500ms delay between downloads to avoid browser blocking
  }
}
