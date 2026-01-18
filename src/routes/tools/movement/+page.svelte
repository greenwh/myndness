<script lang="ts">
  import { base } from '$app/paths';
</script>

<svelte:head>
  <title>Movement - Myndness</title>
</svelte:head>

<div class="space-y-6">
  <header>
    <h1 class="text-2xl font-semibold text-gray-900">Movement</h1>
    <p class="text-gray-600">Gentle movement practices for body and mind</p>
  </header>

  <div class="tools-grid">
    <a href="{base}/tools/movement/tai-chi" class="tool-card">
      <div class="tool-icon" style="background-color: #dcfce7">
        <span class="tool-emoji">🥋</span>
      </div>
      <div class="tool-content">
        <h2 class="tool-title">Tai Chi</h2>
        <p class="tool-description">
          Gentle flowing movements for balance, flexibility, and calm
        </p>
        <span class="tool-duration">5-15 min</span>
      </div>
      <svg class="tool-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
      </svg>
    </a>

    <a href="{base}/tools/movement/stretching" class="tool-card">
      <div class="tool-icon" style="background-color: #fef3c7">
        <span class="tool-emoji">🧘</span>
      </div>
      <div class="tool-content">
        <h2 class="tool-title">Stretching</h2>
        <p class="tool-description">
          Gentle stretches to release tension and improve flexibility
        </p>
        <span class="tool-duration">5-10 min</span>
      </div>
      <svg class="tool-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
      </svg>
    </a>
  </div>

  <div class="safety-note">
    <h3 class="font-medium text-sm text-gray-700 mb-2">Safety Note</h3>
    <p class="text-sm text-gray-600">
      All movements are gentle and suitable for most fitness levels. If you have a pacemaker or
      cardiac monitor, these exercises avoid chest-focused movements and intense cardio. Stop if you
      feel dizzy, short of breath, or experience any discomfort.
    </p>
  </div>
</div>

<style>
  .tools-grid {
    display: grid;
    gap: 1rem;
  }

  .tool-card {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1.25rem;
    background: white;
    border: 1px solid #e5e7eb;
    border-radius: 12px;
    text-decoration: none;
    transition: all 0.2s;
    min-height: 88px; /* Accessibility: 44px x 2 for larger target */
  }

  .tool-card:hover {
    border-color: #3b82f6;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  }

  .tool-card:focus {
    outline: 2px solid #3b82f6;
    outline-offset: 2px;
  }

  .tool-icon {
    flex-shrink: 0;
    width: 56px;
    height: 56px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 12px;
  }

  .tool-emoji {
    font-size: 2rem;
  }

  .tool-content {
    flex: 1;
  }

  .tool-title {
    font-size: 1.125rem;
    font-weight: 600;
    color: #111827;
    margin: 0 0 0.25rem 0;
  }

  .tool-description {
    font-size: 0.9rem;
    color: #6b7280;
    margin: 0 0 0.25rem 0;
    line-height: 1.4;
  }

  .tool-duration {
    font-size: 0.85rem;
    color: #9ca3af;
  }

  .tool-chevron {
    flex-shrink: 0;
    width: 20px;
    height: 20px;
    color: #9ca3af;
  }

  .safety-note {
    background: #eff6ff;
    border: 1px solid #bfdbfe;
    border-radius: 12px;
    padding: 1rem;
  }

  .safety-note h3 {
    color: #1e40af;
    margin: 0 0 0.5rem 0;
  }

  .safety-note p {
    color: #1e40af;
    margin: 0;
    line-height: 1.5;
  }

  /* Dark mode */
  :global(.dark-mode) .tool-card {
    background: #1f2937;
    border-color: #374151;
  }

  :global(.dark-mode) .tool-card:hover {
    border-color: #3b82f6;
  }

  :global(.dark-mode) .tool-title {
    color: #f9fafb;
  }

  :global(.dark-mode) .tool-description {
    color: #9ca3af;
  }

  :global(.dark-mode) .safety-note {
    background: #1e3a5f;
    border-color: #2563eb;
  }

  :global(.dark-mode) .safety-note h3,
  :global(.dark-mode) .safety-note p {
    color: #93c5fd;
  }
</style>
