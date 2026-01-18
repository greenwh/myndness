<svelte:head>
  <title>Stretching - Myndness</title>
</svelte:head>

<div class="space-y-6">
  <header>
    <h1 class="text-2xl font-semibold text-gray-900">Stretching</h1>
    <p class="text-gray-600">Gentle stretches to release tension and improve flexibility</p>
  </header>

  <!-- Full Body -->
  <section class="category-section">
    <h2 class="category-title">Full Body Routines</h2>
    <p class="category-description">Complete stretching sequences</p>
    <div class="video-grid">
      <div class="video-card">
        <div class="video-wrapper">
          <iframe
            loading="lazy"
            src="https://www.youtube-nocookie.com/embed/g_tea8ZNk5A"
            title="10-Minute Daily Stretching Routine"
            frameborder="0"
            allow="accelerometer; encrypted-media; gyroscope"
            allowfullscreen
          ></iframe>
        </div>
        <h3 class="video-title">10-Minute Daily Routine</h3>
        <p class="video-description">Gentle full-body stretch</p>
      </div>

      <div class="video-card">
        <div class="video-wrapper">
          <iframe
            loading="lazy"
            src="https://www.youtube-nocookie.com/embed/L_xrDAtykMI"
            title="5-Minute Morning Stretch"
            frameborder="0"
            allow="accelerometer; encrypted-media; gyroscope"
            allowfullscreen
          ></iframe>
        </div>
        <h3 class="video-title">5-Minute Morning Stretch</h3>
        <p class="video-description">Quick energizing routine</p>
      </div>
    </div>
  </section>

  <!-- Upper Body -->
  <section class="category-section">
    <h2 class="category-title">Neck & Shoulders</h2>
    <p class="category-description">Release tension in upper body</p>
    <div class="video-grid">
      <div class="video-card">
        <div class="video-wrapper">
          <iframe
            loading="lazy"
            src="https://www.youtube-nocookie.com/embed/X3-gKPNyrTA"
            title="Neck and Shoulder Stretches"
            frameborder="0"
            allow="accelerometer; encrypted-media; gyroscope"
            allowfullscreen
          ></iframe>
        </div>
        <h3 class="video-title">Neck & Shoulder Relief</h3>
        <p class="video-description">Gentle stretches for tension</p>
      </div>

      <div class="video-card">
        <div class="video-wrapper">
          <iframe
            loading="lazy"
            src="https://www.youtube-nocookie.com/embed/Uj0bhZZh3xo"
            title="Upper Back Stretches"
            frameborder="0"
            allow="accelerometer; encrypted-media; gyroscope"
            allowfullscreen
          ></iframe>
        </div>
        <h3 class="video-title">Upper Back Stretches</h3>
        <p class="video-description">Release upper back tension</p>
      </div>
    </div>
  </section>

  <!-- Lower Body -->
  <section class="category-section">
    <h2 class="category-title">Lower Back & Legs</h2>
    <p class="category-description">Gentle stretches for lower body</p>
    <div class="video-grid">
      <div class="video-card">
        <div class="video-wrapper">
          <iframe
            loading="lazy"
            src="https://www.youtube-nocookie.com/embed/4BOTvaRaDjI"
            title="Lower Back Stretches"
            frameborder="0"
            allow="accelerometer; encrypted-media; gyroscope"
            allowfullscreen
          ></iframe>
        </div>
        <h3 class="video-title">Lower Back Relief</h3>
        <p class="video-description">Gentle stretches for back pain</p>
      </div>

      <div class="video-card">
        <div class="video-wrapper">
          <iframe
            loading="lazy"
            src="https://www.youtube-nocookie.com/embed/1vM4XX3RbLk"
            title="Leg Stretches for Flexibility"
            frameborder="0"
            allow="accelerometer; encrypted-media; gyroscope"
            allowfullscreen
          ></iframe>
        </div>
        <h3 class="video-title">Leg Stretches</h3>
        <p class="video-description">Improve leg flexibility</p>
      </div>
    </div>
  </section>

  <!-- Seated Stretches -->
  <section class="category-section">
    <h2 class="category-title">Seated Stretches</h2>
    <p class="category-description">Stretches you can do sitting down</p>
    <div class="video-grid">
      <div class="video-card">
        <div class="video-wrapper">
          <iframe
            loading="lazy"
            src="https://www.youtube-nocookie.com/embed/KEjiXtb2hRg"
            title="Chair Stretches"
            frameborder="0"
            allow="accelerometer; encrypted-media; gyroscope"
            allowfullscreen
          ></iframe>
        </div>
        <h3 class="video-title">Chair Stretching Routine</h3>
        <p class="video-description">Full routine from a chair</p>
      </div>
    </div>
  </section>

  <!-- Safety Note -->
  <div class="safety-note">
    <h3 class="font-medium text-sm text-gray-700 mb-2">Stretching Guidelines</h3>
    <ul class="text-sm text-gray-600 space-y-2">
      <li>• Never force a stretch - gentle tension is enough</li>
      <li>• Breathe naturally and slowly throughout each stretch</li>
      <li>• Hold stretches for 15-30 seconds</li>
      <li>• Stop immediately if you feel sharp pain</li>
      <li>• Warm up with light movement before stretching</li>
      <li>• These stretches are safe for users with pacemakers</li>
    </ul>
  </div>
</div>

<style>
  .category-section {
    margin-bottom: 2rem;
  }

  .category-title {
    font-size: 1.25rem;
    font-weight: 600;
    color: #111827;
    margin: 0 0 0.25rem 0;
  }

  .category-description {
    font-size: 0.95rem;
    color: #6b7280;
    margin: 0 0 1rem 0;
  }

  .video-grid {
    display: grid;
    gap: 1.5rem;
  }

  @media (min-width: 640px) {
    .video-grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  .video-card {
    background: white;
    border: 1px solid #e5e7eb;
    border-radius: 12px;
    overflow: hidden;
  }

  .video-wrapper {
    position: relative;
    padding-bottom: 56.25%; /* 16:9 aspect ratio */
    height: 0;
    overflow: hidden;
  }

  .video-wrapper iframe {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }

  .video-title {
    font-size: 1rem;
    font-weight: 600;
    color: #111827;
    margin: 0;
    padding: 1rem 1rem 0.5rem 1rem;
  }

  .video-description {
    font-size: 0.9rem;
    color: #6b7280;
    margin: 0;
    padding: 0 1rem 1rem 1rem;
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

  .safety-note ul {
    color: #1e40af;
    margin: 0;
    padding: 0;
    list-style: none;
  }

  .safety-note li {
    line-height: 1.5;
  }

  /* Dark mode */
  :global(.dark-mode) .category-title,
  :global(.dark-mode) .video-title {
    color: #f9fafb;
  }

  :global(.dark-mode) .category-description,
  :global(.dark-mode) .video-description {
    color: #9ca3af;
  }

  :global(.dark-mode) .video-card {
    background: #1f2937;
    border-color: #374151;
  }

  :global(.dark-mode) .safety-note {
    background: #1e3a5f;
    border-color: #2563eb;
  }

  :global(.dark-mode) .safety-note h3,
  :global(.dark-mode) .safety-note ul {
    color: #93c5fd;
  }
</style>
