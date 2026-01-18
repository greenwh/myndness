// src/lib/utils/movementTracking.ts
// Movement reminder tracking

const REMINDER_INTERVAL = 75 * 60 * 1000; // 75 minutes
const STORAGE_KEY = 'movementReminderLastShown';

/**
 * Check if movement reminder should be shown
 */
export function shouldShowMovementReminder(): boolean {
  const lastShown = sessionStorage.getItem(STORAGE_KEY);
  if (!lastShown) return false;

  const lastShownTime = parseInt(lastShown, 10);
  const now = Date.now();
  return (now - lastShownTime) > REMINDER_INTERVAL;
}

/**
 * Dismiss movement reminder and update timestamp
 */
export function dismissMovementReminder(): void {
  sessionStorage.setItem(STORAGE_KEY, Date.now().toString());
}

/**
 * Initialize movement tracking on app start
 */
export function initMovementTracking(): void {
  if (!sessionStorage.getItem(STORAGE_KEY)) {
    sessionStorage.setItem(STORAGE_KEY, Date.now().toString());
  }
}
