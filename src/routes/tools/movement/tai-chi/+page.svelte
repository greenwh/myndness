<svelte:head>
  <title>Tai Chi - Myndness</title>
</svelte:head>

<div class="space-y-6">
  <header>
    <h1 class="text-2xl font-semibold text-gray-900">Tai Chi</h1>
    <p class="text-gray-600">Gentle flowing movements for balance, flexibility, and calm</p>
  </header>

  <!-- Morning Routine -->
  <section class="category-section">
    <h2 class="category-title">Morning Routine</h2>
    <p class="category-description">Gentle practices to start your day</p>
    <div class="video-grid">
      <div class="video-card">
        <div class="video-wrapper">
          <iframe
            loading="lazy"
            src="https://www.youtube-nocookie.com/embed/vwqUMXaU0Hk"
            title="5-Minute Tai Chi for Beginners"
            frameborder="0"
            allow="accelerometer; encrypted-media; gyroscope"
            allowfullscreen
          ></iframe>
        </div>
        <h3 class="video-title">5-Minute Tai Chi for Beginners</h3>
        <p class="video-description">Simple, gentle morning practice</p>
      </div>

      <div class="video-card">
        <div class="video-wrapper">
          <iframe
            loading="lazy"
            src="https://www.youtube-nocookie.com/embed/w8y5l8I5Phs"
            title="10-Minute Tai Chi for Energy"
            frameborder="0"
            allow="accelerometer; encrypted-media; gyroscope"
            allowfullscreen
          ></iframe>
        </div>
        <h3 class="video-title">10-Minute Morning Flow</h3>
        <p class="video-description">Energizing yet gentle practice</p>
      </div>
    </div>
  </section>

  <!-- Evening Practice -->
  <section class="category-section">
    <h2 class="category-title">Evening Practice</h2>
    <p class="category-description">Calm movements to wind down</p>
    <div class="video-grid">
      <div class="video-card">
        <div class="video-wrapper">
          <iframe
            loading="lazy"
            src="https://www.youtube-nocookie.com/embed/6w7IS8_UzHM"
            title="Tai Chi for Relaxation"
            frameborder="0"
            allow="accelerometer; encrypted-media; gyroscope"
            allowfullscreen
          ></iframe>
        </div>
        <h3 class="video-title">Calming Evening Practice</h3>
        <p class="video-description">Gentle movements for relaxation</p>
      </div>
    </div>
  </section>

  <!-- Seated Practice -->
  <section class="category-section">
    <h2 class="category-title">Seated Practice</h2>
    <p class="category-description">Gentle tai chi you can do sitting down</p>
    <div class="video-grid">
      <div class="video-card">
        <div class="video-wrapper">
          <iframe
            loading="lazy"
            src="https://www.youtube-nocookie.com/embed/S6xW8zMqtYk"
            title="Seated Tai Chi"
            frameborder="0"
            allow="accelerometer; encrypted-media; gyroscope"
            allowfullscreen
          ></iframe>
        </div>
        <h3 class="video-title">Seated Tai Chi Routine</h3>
        <p class="video-description">Full practice from a chair</p>
      </div>

      <div class="video-card">
        <div class="video-wrapper">
          <iframe
            loading="lazy"
            src="https://www.youtube-nocookie.com/embed/cP26mr5Y3zE"
            title="Chair Tai Chi for Seniors"
            frameborder="0"
            allow="accelerometer; encrypted-media; gyroscope"
            allowfullscreen
          ></iframe>
        </div>
        <h3 class="video-title">Chair Tai Chi</h3>
        <p class="video-description">Gentle movements for all abilities</p>
      </div>
    </div>
  </section>

  <!-- Balance Practice -->
  <section class="category-section">
    <h2 class="category-title">Balance & Stability</h2>
    <p class="category-description">Gentle balance work (have a chair nearby for support)</p>
    <div class="video-grid">
      <div class="video-card">
        <div class="video-wrapper">
          <iframe
            loading="lazy"
            src="https://www.youtube-nocookie.com/embed/Yc7T2s_DdVg"
            title="Tai Chi for Balance"
            frameborder="0"
            allow="accelerometer; encrypted-media; gyroscope"
            allowfullscreen
          ></iframe>
        </div>
        <h3 class="video-title">Tai Chi Balance Exercises</h3>
        <p class="video-description">Improve stability with gentle movements</p>
      </div>
    </div>
  </section>

  <!-- Safety Note -->
  <div class="safety-note">
    <h3 class="font-medium text-sm text-gray-700 mb-2">Practice Tips</h3>
    <ul class="text-sm text-gray-600 space-y-2">
      <li>• Start with shorter videos (5 minutes) and gradually build up</li>
      <li>• Have a chair or wall nearby for balance support</li>
      <li>• Move slowly and breathe naturally</li>
      <li>• Stop if you feel dizzy, short of breath, or any discomfort</li>
      <li>• These videos are gentle and suitable for users with pacemakers</li>
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
