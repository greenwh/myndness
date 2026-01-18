<script lang="ts">
  import { goto } from '$app/navigation';
  import { base } from '$app/paths';
  import { completeOnboarding, updateUserProfile, updateSettings } from '$lib/db';
  import { requestNotificationPermission } from '$lib/utils/notificationHelpers';
  import type { UserProfile, Settings } from '$lib/db/types';

  let currentStep = $state(1);
  const totalSteps = 4;

  // Form data
  let profileData = $state<Partial<UserProfile>>({
    age: undefined,
    conditions: [],
    hasPacemaker: false
  });

  let settingsData = $state<Partial<Settings>>({
    fontSize: 'large',
    highContrast: false,
    notificationsEnabled: false
  });

  let conditionsText = $state('');

  async function handleNext() {
    if (currentStep < totalSteps) {
      currentStep++;
    } else {
      await handleComplete();
    }
  }

  function handleBack() {
    if (currentStep > 1) {
      currentStep--;
    }
  }

  async function handleSkip() {
    await updateUserProfile({ onboardingSkipped: true });
    goto(`${base}/`);
  }

  async function handleComplete() {
    // Parse conditions
    if (conditionsText) {
      const conditions = conditionsText
        .split(',')
        .map(c => c.trim())
        .filter(c => c.length > 0);
      profileData.conditions = conditions;
    }

    // Save profile
    await updateUserProfile(profileData);

    // Save settings
    await updateSettings(settingsData);

    // Mark onboarding complete
    await completeOnboarding();

    // Redirect to dashboard
    goto(`${base}/`);
  }

  async function handleRequestNotifications() {
    const permission = await requestNotificationPermission();
    if (permission === 'granted') {
      settingsData.notificationsEnabled = true;
    }
  }
</script>

<svelte:head>
  <title>Welcome - Myndness</title>
</svelte:head>

<div class="onboarding-container">
  <!-- Progress Indicator -->
  <div class="progress-container">
    <div class="progress-bar">
      {#each Array(totalSteps) as _, i}
        <div class="progress-step {i < currentStep ? 'active' : ''} {i === currentStep - 1 ? 'current' : ''}">
          {i + 1}
        </div>
      {/each}
    </div>
  </div>

  <!-- Step Content -->
  <div class="step-container">
    {#if currentStep === 1}
      <!-- Welcome Step -->
      <div class="step-content">
        <h1 class="step-title">Welcome to Myndness</h1>
        <p class="step-description">
          Your personal mental wellness companion for managing anxiety, stress, and mood.
        </p>
        <div class="feature-list">
          <div class="feature-item">
            <span class="feature-icon">🌬️</span>
            <div>
              <h3 class="feature-title">Crisis Tools</h3>
              <p class="feature-text">Breathing exercises and grounding techniques</p>
            </div>
          </div>
          <div class="feature-item">
            <span class="feature-icon">📊</span>
            <div>
              <h3 class="feature-title">Track Progress</h3>
              <p class="feature-text">Monitor mood, anxiety, blood pressure, and activities</p>
            </div>
          </div>
          <div class="feature-item">
            <span class="feature-icon">🧠</span>
            <div>
              <h3 class="feature-title">CBT Tools</h3>
              <p class="feature-text">Challenge unhelpful thoughts and patterns</p>
            </div>
          </div>
          <div class="feature-item">
            <span class="feature-icon">🧘</span>
            <div>
              <h3 class="feature-title">Mindfulness</h3>
              <p class="feature-text">Meditation, movement, and gentle exercises</p>
            </div>
          </div>
        </div>
      </div>
    {:else if currentStep === 2}
      <!-- Profile Step -->
      <div class="step-content">
        <h1 class="step-title">About You</h1>
        <p class="step-description">Help us personalize your experience (all optional)</p>

        <div class="form-group">
          <label for="age-input" class="form-label">Age</label>
          <input
            id="age-input"
            type="number"
            class="form-input"
            bind:value={profileData.age}
            placeholder="Optional"
            min="1"
            max="120"
          />
        </div>

        <div class="form-group">
          <label for="conditions-input" class="form-label">Conditions</label>
          <textarea
            id="conditions-input"
            class="form-textarea"
            bind:value={conditionsText}
            placeholder="e.g., ADHD, GAD, MDD (comma separated)"
            rows="3"
          ></textarea>
          <p class="form-help">Helps us recommend appropriate exercises and tools</p>
        </div>

        <div class="form-group">
          <label class="checkbox-label">
            <input
              type="checkbox"
              class="checkbox-input"
              bind:checked={profileData.hasPacemaker}
            />
            <span>I have a pacemaker or cardiac monitor</span>
          </label>
          <p class="form-help">We'll recommend safe movement exercises</p>
        </div>
      </div>
    {:else if currentStep === 3}
      <!-- Accessibility Step -->
      <div class="step-content">
        <h1 class="step-title">Accessibility</h1>
        <p class="step-description">Customize how the app looks</p>

        <div class="form-group">
          <label class="form-label">Font Size</label>
          <div class="radio-group">
            <label class="radio-label">
              <input
                type="radio"
                name="font-size"
                value="normal"
                bind:group={settingsData.fontSize}
              />
              <span>Normal</span>
            </label>
            <label class="radio-label">
              <input
                type="radio"
                name="font-size"
                value="large"
                bind:group={settingsData.fontSize}
              />
              <span>Large (Recommended)</span>
            </label>
            <label class="radio-label">
              <input
                type="radio"
                name="font-size"
                value="extra-large"
                bind:group={settingsData.fontSize}
              />
              <span>Extra Large</span>
            </label>
          </div>
        </div>

        <div class="form-group">
          <label class="checkbox-label">
            <input
              type="checkbox"
              class="checkbox-input"
              bind:checked={settingsData.highContrast}
            />
            <span>High Contrast Mode</span>
          </label>
          <p class="form-help">Increase contrast for better visibility</p>
        </div>
      </div>
    {:else if currentStep === 4}
      <!-- Notifications Step -->
      <div class="step-content">
        <h1 class="step-title">Stay Connected</h1>
        <p class="step-description">Optional daily check-ins and reminders</p>

        {#if 'Notification' in window}
          {#if Notification.permission === 'default'}
            <div class="notification-prompt">
              <p class="prompt-text">
                Enable notifications to receive gentle reminders for morning check-ins,
                evening reviews, and planned activities.
              </p>
              <button class="btn-primary" onclick={handleRequestNotifications}>
                Enable Notifications
              </button>
              <p class="prompt-note">You can change this later in Settings</p>
            </div>
          {:else if Notification.permission === 'granted'}
            <div class="notification-success">
              <p class="success-text">✓ Notifications enabled</p>
              <p class="success-note">You can customize notification times in Settings</p>
            </div>
          {:else}
            <div class="notification-denied">
              <p class="denied-text">
                Notifications are currently blocked. You can enable them later in your
                browser settings.
              </p>
            </div>
          {/if}
        {:else}
          <div class="notification-unavailable">
            <p class="unavailable-text">
              Notifications are not supported in this browser.
            </p>
          </div>
        {/if}

        <div class="feature-preview">
          <h3 class="preview-title">What You'll Find</h3>
          <ul class="preview-list">
            <li>🆘 Crisis tools (breathing, grounding) - always one tap away</li>
            <li>📊 Mood & BP tracking</li>
            <li>📅 Activity planning with behavioral activation</li>
            <li>🧠 CBT thought records</li>
            <li>🧘 Mindfulness & movement practices</li>
            <li>📈 Insights and data export</li>
          </ul>
        </div>
      </div>
    {/if}
  </div>

  <!-- Navigation Buttons -->
  <div class="button-container">
    <button class="btn-skip" onclick={handleSkip}>
      Skip for now
    </button>

    <div class="nav-buttons">
      {#if currentStep > 1}
        <button class="btn-secondary" onclick={handleBack}>
          Back
        </button>
      {/if}
      <button class="btn-primary" onclick={handleNext}>
        {currentStep === totalSteps ? 'Get Started' : 'Next'}
      </button>
    </div>
  </div>
</div>

<style>
  .onboarding-container {
    max-width: 32rem;
    margin: 0 auto;
    padding: 2rem 1rem;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
  }

  .progress-container {
    margin-bottom: 3rem;
  }

  .progress-bar {
    display: flex;
    justify-content: center;
    gap: 1rem;
  }

  .progress-step {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: #e5e7eb;
    color: #9ca3af;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 600;
    transition: all 0.3s;
  }

  .progress-step.active {
    background: #3b82f6;
    color: white;
  }

  .progress-step.current {
    transform: scale(1.1);
    box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.2);
  }

  .step-container {
    flex: 1;
    margin-bottom: 2rem;
  }

  .step-content {
    background: white;
    border-radius: 12px;
    padding: 2rem;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  }

  .step-title {
    font-size: 1.75rem;
    font-weight: 600;
    color: #111827;
    margin: 0 0 0.5rem 0;
  }

  .step-description {
    font-size: 1rem;
    color: #6b7280;
    margin: 0 0 2rem 0;
  }

  /* Feature List */
  .feature-list {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  .feature-item {
    display: flex;
    gap: 1rem;
    align-items: flex-start;
  }

  .feature-icon {
    font-size: 2rem;
    flex-shrink: 0;
  }

  .feature-title {
    font-size: 1.125rem;
    font-weight: 600;
    color: #111827;
    margin: 0 0 0.25rem 0;
  }

  .feature-text {
    font-size: 0.95rem;
    color: #6b7280;
    margin: 0;
  }

  /* Form Elements */
  .form-group {
    margin-bottom: 1.5rem;
  }

  .form-label {
    display: block;
    font-size: 1rem;
    font-weight: 500;
    color: #374151;
    margin-bottom: 0.5rem;
  }

  .form-input,
  .form-textarea {
    width: 100%;
    padding: 0.75rem;
    font-size: 1rem;
    border: 1px solid #d1d5db;
    border-radius: 8px;
    min-height: 44px;
  }

  .form-input:focus,
  .form-textarea:focus {
    outline: 2px solid #3b82f6;
    outline-offset: 2px;
  }

  .form-help {
    font-size: 0.9rem;
    color: #6b7280;
    margin: 0.5rem 0 0 0;
  }

  .checkbox-label {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    cursor: pointer;
    min-height: 44px;
  }

  .checkbox-input {
    width: 24px;
    height: 24px;
    cursor: pointer;
  }

  .radio-group {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .radio-label {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.75rem;
    border: 1px solid #d1d5db;
    border-radius: 8px;
    cursor: pointer;
    min-height: 44px;
  }

  .radio-label:has(input:checked) {
    border-color: #3b82f6;
    background: #eff6ff;
  }

  .radio-label input {
    width: 20px;
    height: 20px;
    cursor: pointer;
  }

  /* Notification States */
  .notification-prompt,
  .notification-success,
  .notification-denied,
  .notification-unavailable {
    padding: 1.5rem;
    border-radius: 8px;
    margin-bottom: 2rem;
  }

  .notification-prompt {
    background: #eff6ff;
    border: 1px solid #bfdbfe;
  }

  .notification-success {
    background: #d1fae5;
    border: 1px solid #86efac;
  }

  .notification-denied,
  .notification-unavailable {
    background: #fef2f2;
    border: 1px solid #fecaca;
  }

  .prompt-text,
  .success-text,
  .denied-text,
  .unavailable-text {
    margin: 0 0 1rem 0;
    color: #111827;
  }

  .prompt-note,
  .success-note {
    font-size: 0.9rem;
    color: #6b7280;
    margin: 0.5rem 0 0 0;
  }

  .feature-preview {
    margin-top: 2rem;
  }

  .preview-title {
    font-size: 1.125rem;
    font-weight: 600;
    color: #111827;
    margin: 0 0 1rem 0;
  }

  .preview-list {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .preview-list li {
    font-size: 0.95rem;
    color: #6b7280;
    line-height: 1.5;
  }

  /* Buttons */
  .button-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 1rem;
  }

  .nav-buttons {
    display: flex;
    gap: 1rem;
  }

  .btn-primary,
  .btn-secondary,
  .btn-skip {
    padding: 0.75rem 1.5rem;
    font-size: 1rem;
    font-weight: 500;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    min-height: 44px;
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

  .btn-skip {
    background: transparent;
    color: #6b7280;
    text-decoration: underline;
  }

  .btn-skip:hover {
    color: #111827;
  }

  .btn-primary:focus,
  .btn-secondary:focus,
  .btn-skip:focus {
    outline: 2px solid #3b82f6;
    outline-offset: 2px;
  }
</style>
