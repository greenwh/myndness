// src/lib/utils/notificationHelpers.ts
// Web Notifications API helpers

import type { Settings } from '$lib/db/types';

/**
 * Request notification permission from user
 */
export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (!('Notification' in window)) {
    console.warn('Notifications not supported in this browser');
    return 'denied';
  }
  return await Notification.requestPermission();
}

/**
 * Schedule a notification to appear after a delay
 */
export function scheduleNotification(title: string, body: string, delayMs: number): void {
  if (!('Notification' in window) || Notification.permission !== 'granted') {
    return;
  }

  setTimeout(() => {
    new Notification(title, {
      body,
      icon: '/myndness/icons/icon-192.png',
      badge: '/myndness/icons/icon-72.png',
      requireInteraction: false
    });
  }, delayMs);
}

/**
 * Schedule daily notifications based on settings
 */
export function scheduleDailyNotifications(settings: Settings): void {
  if (!settings.notificationsEnabled) return;

  const now = new Date();

  // Schedule morning check-in
  if (settings.morningCheckInTime) {
    const [hours, minutes] = settings.morningCheckInTime.split(':').map(Number);
    const next = new Date(now);
    next.setHours(hours, minutes, 0, 0);

    // If time has passed today, schedule for tomorrow
    if (next < now) {
      next.setDate(next.getDate() + 1);
    }

    const delay = next.getTime() - now.getTime();
    scheduleNotification(
      'Morning Check-in',
      'How are you feeling today?',
      delay
    );
  }

  // Schedule evening review
  if (settings.eveningReviewTime) {
    const [hours, minutes] = settings.eveningReviewTime.split(':').map(Number);
    const next = new Date(now);
    next.setHours(hours, minutes, 0, 0);

    // If time has passed today, schedule for tomorrow
    if (next < now) {
      next.setDate(next.getDate() + 1);
    }

    const delay = next.getTime() - now.getTime();
    scheduleNotification(
      'Evening Review',
      'Take a moment to reflect on your day.',
      delay
    );
  }
}

/**
 * Check if notifications are supported and granted
 */
export function areNotificationsAvailable(): boolean {
  return 'Notification' in window && Notification.permission === 'granted';
}
