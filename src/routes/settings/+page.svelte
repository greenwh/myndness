<script lang="ts">
  import { onMount } from 'svelte';
  import { base } from '$app/paths';
  import { getSettings, updateSettings, getUserProfile, updateUserProfile } from '$lib/db';
  import { requestNotificationPermission } from '$lib/utils/notificationHelpers';
  import type { Settings, UserProfile } from '$lib/db/types';
  import SettingsSection from '$lib/components/settings/SettingsSection.svelte';
  import ThemeSelector from '$lib/components/settings/ThemeSelector.svelte';
  import FontSizeSelector from '$lib/components/settings/FontSizeSelector.svelte';
  import TimePickerInput from '$lib/components/settings/TimePickerInput.svelte';

  let settings = $state<Settings | null>(null);
  let profile = $state<UserProfile | null>(null);
  let saveStatus = $state<'idle' | 'saving' | 'saved'>('idle');
  let showClearConfirm = $state(false);
  let notificationPermission = $state<NotificationPermission>('default');

  onMount(async () => {
    settings = await getSettings();
    profile = await getUserProfile();

    if ('Notification' in window) {
      notificationPermission = Notification.permission;
    }
  });

  async function handleSettingsChange(updates: Partial<Settings>) {
    saveStatus = 'saving';
    await updateSettings(updates);
    settings = await getSettings();
    saveStatus = 'saved';
    setTimeout(() => saveStatus = 'idle', 2000);

    // Apply changes immediately
    applySettings();
  }

  async function handleProfileChange(updates: Partial<UserProfile>) {
    saveStatus = 'saving';
    await updateUserProfile(updates);
    profile = await getUserProfile();
    saveStatus = 'saved';
    setTimeout(() => saveStatus = 'idle', 2000);
  }

  async function handleRequestNotifications() {
    const permission = await requestNotificationPermission();
    notificationPermission = permission;

    if (permission === 'granted') {
      await handleSettingsChange({ notificationsEnabled: true });
    }
  }

  function applySettings() {
    if (!settings) return;

    const html = document.documentElement;

    // Theme
    html.classList.remove('dark-mode');
    if (settings.theme === 'dark') {
      html.classList.add('dark-mode');
    } else if (settings.theme === 'system') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (prefersDark) html.classList.add('dark-mode');
    }

    // Font size
    html.classList.remove('font-large', 'font-extra-large');
    if (settings.fontSize === 'large') {
      html.classList.add('font-large');
    } else if (settings.fontSize === 'extra-large') {
      html.classList.add('font-extra-large');
    }

    // High contrast
    html.classList.toggle('high-contrast', settings.highContrast);
  }

  async function handleClearData() {
    if (confirm('Are you sure you want to clear ALL data? This cannot be undone.')) {
      const { db } = await import('$lib/db');
      await db.delete();
      location.reload();
    }
  }

  function conditionsText(profile: UserProfile | null): string {
    if (!profile?.conditions || profile.conditions.length === 0) return '';
    return profile.conditions.join(', ');
  }

  async function handleConditionsChange(text: string) {
    const conditions = text
      .split(',')
      .map(c => c.trim())
      .filter(c => c.length > 0);
    await handleProfileChange({ conditions });
  }
</script>

<svelte:head>
  <title>Settings - Myndness</title>
</svelte:head>

<div class="page-container">
  <header class="page-header">
    <h1 class="page-title">Settings</h1>
    <p class="page-description">Customize your experience</p>
  </header>

  {#if saveStatus !== 'idle'}
    <div class="save-status {saveStatus}">
      {saveStatus === 'saving' ? 'Saving...' : 'Saved ✓'}
    </div>
  {/if}

  {#if settings && profile}
    <!-- Appearance Section -->
    <SettingsSection title="Appearance" description="Customize how the app looks">
      {#snippet children()}
        <ThemeSelector
          value={settings.theme}
          onChange={(theme) => handleSettingsChange({ theme })}
        />

        <FontSizeSelector
          value={settings.fontSize}
          onChange={(fontSize) => handleSettingsChange({ fontSize })}
        />

        <div class="setting-item">
          <label class="toggle-label">
            <input
              type="checkbox"
              class="toggle-input"
              checked={settings.highContrast}
              onchange={(e) => handleSettingsChange({ highContrast: e.currentTarget.checked })}
            />
            <span class="toggle-text">High Contrast Mode</span>
          </label>
          <p class="setting-help">Increase contrast for better visibility</p>
        </div>

        <div class="setting-item">
          <label class="toggle-label">
            <input
              type="checkbox"
              class="toggle-input"
              checked={settings.reducedMotion}
              onchange={(e) => handleSettingsChange({ reducedMotion: e.currentTarget.checked })}
            />
            <span class="toggle-text">Reduce Motion</span>
          </label>
          <p class="setting-help">Minimize animations and transitions</p>
        </div>
      {/snippet}
    </SettingsSection>

    <!-- Notifications Section -->
    <SettingsSection title="Notifications" description="Manage reminders and check-ins">
      {#snippet children()}
        {#if notificationPermission === 'default'}
          <div class="notification-prompt">
            <p class="prompt-text">Enable notifications to receive daily check-ins and reminders</p>
            <button class="btn-primary" onclick={handleRequestNotifications}>
              Enable Notifications
            </button>
          </div>
        {:else if notificationPermission === 'denied'}
          <div class="notification-denied">
            <p class="denied-text">Notifications are blocked. To enable them, please update your browser settings.</p>
          </div>
        {:else}
          <div class="setting-item">
            <label class="toggle-label">
              <input
                type="checkbox"
                class="toggle-input"
                checked={settings.notificationsEnabled}
                onchange={(e) => handleSettingsChange({ notificationsEnabled: e.currentTarget.checked })}
              />
              <span class="toggle-text">Enable Notifications</span>
            </label>
          </div>

          {#if settings.notificationsEnabled}
            <TimePickerInput
              label="Morning Check-in"
              value={settings.morningCheckInTime}
              onChange={(time) => handleSettingsChange({ morningCheckInTime: time })}
            />

            <TimePickerInput
              label="Evening Review"
              value={settings.eveningReviewTime}
              onChange={(time) => handleSettingsChange({ eveningReviewTime: time })}
            />

            <div class="setting-item">
              <label class="toggle-label">
                <input
                  type="checkbox"
                  class="toggle-input"
                  checked={settings.activityReminders}
                  onchange={(e) => handleSettingsChange({ activityReminders: e.currentTarget.checked })}
                />
                <span class="toggle-text">Activity Reminders</span>
              </label>
              <p class="setting-help">Remind me 1 hour before planned activities</p>
            </div>
          {/if}
        {/if}
      {/snippet}
    </SettingsSection>

    <!-- Profile Section -->
    <SettingsSection title="Profile" description="Your personal information">
      {#snippet children()}
        <div class="setting-item">
          <label for="age-input" class="setting-label">Age</label>
          <input
            id="age-input"
            type="number"
            class="setting-input"
            value={profile.age || ''}
            placeholder="Optional"
            min="1"
            max="120"
            oninput={(e) => {
              const value = e.currentTarget.value;
              handleProfileChange({ age: value ? parseInt(value, 10) : undefined });
            }}
          />
        </div>

        <div class="setting-item">
          <label for="conditions-input" class="setting-label">Conditions</label>
          <textarea
            id="conditions-input"
            class="setting-textarea"
            value={conditionsText(profile)}
            placeholder="e.g., ADHD, GAD, MDD (comma separated)"
            rows="3"
            oninput={(e) => handleConditionsChange(e.currentTarget.value)}
          ></textarea>
          <p class="setting-help">Separate multiple conditions with commas</p>
        </div>

        <div class="setting-item">
          <label class="toggle-label">
            <input
              type="checkbox"
              class="toggle-input"
              checked={profile.hasPacemaker}
              onchange={(e) => handleProfileChange({ hasPacemaker: e.currentTarget.checked })}
            />
            <span class="toggle-text">I have a pacemaker</span>
          </label>
          <p class="setting-help">Helps us recommend safe movement exercises</p>
        </div>

        <div class="setting-item">
          <label class="toggle-label">
            <input
              type="checkbox"
              class="toggle-input"
              checked={profile.hasCardiacMonitor}
              onchange={(e) => handleProfileChange({ hasCardiacMonitor: e.currentTarget.checked })}
            />
            <span class="toggle-text">I have a cardiac monitor</span>
          </label>
        </div>
      {/snippet}
    </SettingsSection>

    <!-- Data Section -->
    <SettingsSection title="Data" description="Manage your data">
      {#snippet children()}
        <div class="setting-item">
          <a href="{base}/insights/export" class="btn-secondary">
            Export Data
          </a>
          <p class="setting-help">Download your data as CSV or JSON</p>
        </div>

        <div class="setting-item">
          <button class="btn-danger" onclick={handleClearData}>
            Clear All Data
          </button>
          <p class="setting-help">Permanently delete all tracked data</p>
        </div>

        <div class="app-info">
          <p class="info-text">Myndness Mental Wellness Companion</p>
          <p class="info-text">Version 1.0.0</p>
          <p class="info-text">All data stored locally on your device</p>
        </div>
      {/snippet}
    </SettingsSection>
  {:else}
    <div class="loading">Loading settings...</div>
  {/if}
</div>

<style>
  .page-container {
    max-width: 48rem;
    margin: 0 auto;
    padding: 1.5rem;
  }

  .page-header {
    margin-bottom: 2rem;
  }

  .page-title {
    font-size: 2rem;
    font-weight: 600;
    color: #111827;
    margin: 0 0 0.5rem 0;
  }

  .page-description {
    font-size: 1rem;
    color: #6b7280;
    margin: 0;
  }

  .save-status {
    position: fixed;
    top: 1rem;
    right: 1rem;
    padding: 0.75rem 1.25rem;
    border-radius: 8px;
    font-weight: 500;
    z-index: 50;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }

  .save-status.saving {
    background: #fef3c7;
    color: #92400e;
  }

  .save-status.saved {
    background: #d1fae5;
    color: #065f46;
  }

  .loading {
    text-align: center;
    padding: 3rem;
    color: #6b7280;
  }

  /* Setting items */
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

  .setting-input,
  .setting-textarea {
    padding: 0.75rem;
    font-size: 1rem;
    border: 1px solid #d1d5db;
    border-radius: 8px;
    background: white;
    color: #111827;
    min-height: 44px;
  }

  .setting-input:focus,
  .setting-textarea:focus {
    outline: 2px solid #3b82f6;
    outline-offset: 2px;
  }

  .setting-help {
    font-size: 0.9rem;
    color: #6b7280;
    margin: 0;
  }

  /* Toggle */
  .toggle-label {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    cursor: pointer;
    min-height: 44px;
  }

  .toggle-input {
    width: 44px;
    height: 24px;
    cursor: pointer;
  }

  .toggle-input:focus {
    outline: 2px solid #3b82f6;
    outline-offset: 2px;
  }

  .toggle-text {
    font-size: 1rem;
    font-weight: 500;
    color: #111827;
  }

  /* Buttons */
  .btn-primary,
  .btn-secondary,
  .btn-danger {
    padding: 0.75rem 1.5rem;
    font-size: 1rem;
    font-weight: 500;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    min-height: 44px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    text-decoration: none;
  }

  .btn-primary {
    background: #3b82f6;
    color: white;
  }

  .btn-primary:hover {
    background: #2563eb;
  }

  .btn-secondary {
    background: #f3f4f6;
    color: #111827;
  }

  .btn-secondary:hover {
    background: #e5e7eb;
  }

  .btn-danger {
    background: #fef2f2;
    color: #dc2626;
    border: 1px solid #fecaca;
  }

  .btn-danger:hover {
    background: #fee2e2;
  }

  /* Notification prompt */
  .notification-prompt {
    padding: 1rem;
    background: #eff6ff;
    border: 1px solid #bfdbfe;
    border-radius: 8px;
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .prompt-text {
    margin: 0;
    color: #1e40af;
  }

  .notification-denied {
    padding: 1rem;
    background: #fef2f2;
    border: 1px solid #fecaca;
    border-radius: 8px;
  }

  .denied-text {
    margin: 0;
    color: #991b1b;
  }

  /* App info */
  .app-info {
    padding-top: 1rem;
    border-top: 1px solid #e5e7eb;
  }

  .info-text {
    font-size: 0.9rem;
    color: #6b7280;
    margin: 0.25rem 0;
  }

  /* Dark mode */
  :global(.dark-mode) .page-title {
    color: #f9fafb;
  }

  :global(.dark-mode) .page-description,
  :global(.dark-mode) .setting-help,
  :global(.dark-mode) .info-text {
    color: #9ca3af;
  }

  :global(.dark-mode) .setting-label,
  :global(.dark-mode) .toggle-text {
    color: #d1d5db;
  }

  :global(.dark-mode) .setting-input,
  :global(.dark-mode) .setting-textarea {
    background: #374151;
    border-color: #4b5563;
    color: #f9fafb;
  }

  :global(.dark-mode) .btn-secondary {
    background: #374151;
    color: #f9fafb;
  }

  :global(.dark-mode) .btn-secondary:hover {
    background: #4b5563;
  }

  :global(.dark-mode) .app-info {
    border-top-color: #374151;
  }
</style>
