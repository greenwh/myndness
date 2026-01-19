<svelte:head>
  <title>Tai Chi - Myndness</title>
</svelte:head>

<div class="space-y-6">
  <header>
    <h1 class="text-2xl font-semibold text-gray-900">Tai Chi</h1>
    <p class="text-gray-600">Gentle flowing movements for balance, flexibility, and calm</p>
  </header>

  <!-- Recommended Channels -->
  <section class="info-section">
    <h2 class="section-title">Recommended YouTube Channels</h2>
    <p class="section-description">Trusted sources for gentle, beginner-friendly tai chi instruction</p>
    <div class="channel-list">
      <a
        href="https://www.youtube.com/@drpaullamtaichiproductions"
        target="_blank"
        rel="noopener noreferrer"
        class="channel-card"
      >
        <span class="channel-icon">▶️</span>
        <div>
          <h3 class="channel-name">Tai Chi for Health </h3>
          <p class="channel-description">Dr. Paul Lam's official channel - evidence-based programs</p>
        </div>
      </a>

      <a
        href="https://www.youtube.com/@TaiChiOnline"
        target="_blank"
        rel="noopener noreferrer"
        class="channel-card"
      >
        <span class="channel-icon">▶️</span>
        <div>
          <h3 class="channel-name">Tai Chi Online</h3>
          <p class="channel-description">Comprehensive lessons for all levels</p>
        </div>
      </a>

      <a
        href="https://www.youtube.com/@YoQiYoga"
        target="_blank"
        rel="noopener noreferrer"
        class="channel-card"
      >
        <span class="channel-icon">▶️</span>
        <div>
          <h3 class="channel-name">YoQi Yoga & Qigong</h3>
          <p class="channel-description">Gentle qigong and tai chi flows</p>
        </div>
      </a>
    </div>
  </section>

  <!-- Search Suggestions -->
  <section class="info-section">
    <h2 class="section-title">Find Videos by Topic</h2>
    <p class="section-description">Click to search YouTube for specific practices</p>
    <div class="search-grid">
      <a
        href="https://www.youtube.com/results?search_query=gentle+tai+chi+for+beginners+5+minutes"
        target="_blank"
        rel="noopener noreferrer"
        class="search-card"
      >
        <span class="search-emoji">🌅</span>
        <div>
          <h3 class="search-title">Morning Routine</h3>
          <p class="search-description">Short, gentle practices to start your day</p>
        </div>
      </a>

      <a
        href="https://www.youtube.com/results?search_query=seated+tai+chi+for+seniors"
        target="_blank"
        rel="noopener noreferrer"
        class="search-card"
      >
        <span class="search-emoji">🪑</span>
        <div>
          <h3 class="search-title">Seated Practice</h3>
          <p class="search-description">Full routines from a chair</p>
        </div>
      </a>

      <a
        href="https://www.youtube.com/results?search_query=tai+chi+for+balance+seniors"
        target="_blank"
        rel="noopener noreferrer"
        class="search-card"
      >
        <span class="search-emoji">⚖️</span>
        <div>
          <h3 class="search-title">Balance Work</h3>
          <p class="search-description">Improve stability with gentle movements</p>
        </div>
      </a>

      <a
        href="https://www.youtube.com/results?search_query=evening+tai+chi+relaxation"
        target="_blank"
        rel="noopener noreferrer"
        class="search-card"
      >
        <span class="search-emoji">🌙</span>
        <div>
          <h3 class="search-title">Evening Practice</h3>
          <p class="search-description">Calming movements to wind down</p>
        </div>
      </a>
    </div>
  </section>

  <!-- Practice Tips -->
  <section class="info-section">
    <h2 class="section-title">Practice Tips</h2>
    <div class="tips-content">
      <h3 class="tips-subtitle">What to Look For in Videos</h3>
      <ul class="tips-list">
        <li>Duration: 5-15 minutes for beginners</li>
        <li>Pace: Slow, with clear explanations</li>
        <li>Instructor: Calm, encouraging tone</li>
        <li>Style: Yang style is most common for beginners</li>
      </ul>

      <h3 class="tips-subtitle">Safety Guidelines</h3>
      <ul class="tips-list">
        <li>Start with shorter videos (5 minutes) and gradually build up</li>
        <li>Have a chair or wall nearby for balance support</li>
        <li>Move slowly and breathe naturally</li>
        <li>Stop if you feel dizzy, short of breath, or any discomfort</li>
        <li>These gentle practices are suitable for users with pacemakers</li>
      </ul>

      <h3 class="tips-subtitle">Getting Started</h3>
      <ul class="tips-list">
        <li>Watch a video once through before attempting</li>
        <li>Don't worry about perfection - focus on gentle movement</li>
        <li>Practice at the same time each day for best results</li>
        <li>Start with seated practices if balance is a concern</li>
      </ul>
    </div>
  </section>

  <!-- External Link Notice -->
  <div class="external-notice">
    <p>
      <strong>Note:</strong> Links open YouTube in a new tab. YouTube content is not controlled
      by Myndness. Choose videos that feel comfortable for your fitness level.
    </p>
  </div>
</div>

<style>
  .info-section {
    background: white;
    border: 1px solid #e5e7eb;
    border-radius: 12px;
    padding: 1.5rem;
    margin-bottom: 1.5rem;
  }

  .section-title {
    font-size: 1.25rem;
    font-weight: 600;
    color: #111827;
    margin: 0 0 0.5rem 0;
  }

  .section-description {
    font-size: 0.95rem;
    color: #6b7280;
    margin: 0 0 1.25rem 0;
  }

  /* Channel Cards */
  .channel-list {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .channel-card {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1rem;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    text-decoration: none;
    transition: all 0.2s;
    min-height: 60px;
  }

  .channel-card:hover {
    border-color: #3b82f6;
    background: #f9fafb;
  }

  .channel-card:focus {
    outline: 2px solid #3b82f6;
    outline-offset: 2px;
  }

  .channel-icon {
    font-size: 1.5rem;
    flex-shrink: 0;
  }

  .channel-name {
    font-size: 1rem;
    font-weight: 600;
    color: #111827;
    margin: 0 0 0.25rem 0;
  }

  .channel-description {
    font-size: 0.9rem;
    color: #6b7280;
    margin: 0;
  }

  /* Search Cards */
  .search-grid {
    display: grid;
    gap: 1rem;
  }

  @media (min-width: 640px) {
    .search-grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  .search-card {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1rem;
    background: #f9fafb;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    text-decoration: none;
    transition: all 0.2s;
    min-height: 80px;
  }

  .search-card:hover {
    border-color: #3b82f6;
    background: white;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  }

  .search-card:focus {
    outline: 2px solid #3b82f6;
    outline-offset: 2px;
  }

  .search-emoji {
    font-size: 2rem;
    flex-shrink: 0;
  }

  .search-title {
    font-size: 1rem;
    font-weight: 600;
    color: #111827;
    margin: 0 0 0.25rem 0;
  }

  .search-description {
    font-size: 0.9rem;
    color: #6b7280;
    margin: 0;
  }

  /* Tips Content */
  .tips-content {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  .tips-subtitle {
    font-size: 1rem;
    font-weight: 600;
    color: #111827;
    margin: 0 0 0.75rem 0;
  }

  .tips-list {
    list-style: disc;
    margin: 0;
    padding-left: 1.5rem;
    color: #374151;
  }

  .tips-list li {
    margin: 0.5rem 0;
    line-height: 1.5;
  }

  /* External Notice */
  .external-notice {
    background: #eff6ff;
    border: 1px solid #bfdbfe;
    border-radius: 8px;
    padding: 1rem;
  }

  .external-notice p {
    margin: 0;
    font-size: 0.9rem;
    color: #1e40af;
    line-height: 1.5;
  }

  /* Dark mode */
  :global(.dark-mode) .info-section {
    background: #1f2937;
    border-color: #374151;
  }

  :global(.dark-mode) .section-title,
  :global(.dark-mode) .channel-name,
  :global(.dark-mode) .search-title,
  :global(.dark-mode) .tips-subtitle {
    color: #f9fafb;
  }

  :global(.dark-mode) .section-description,
  :global(.dark-mode) .channel-description,
  :global(.dark-mode) .search-description {
    color: #9ca3af;
  }

  :global(.dark-mode) .channel-card {
    border-color: #374151;
    background: transparent;
  }

  :global(.dark-mode) .channel-card:hover {
    background: #374151;
  }

  :global(.dark-mode) .search-card {
    background: #374151;
    border-color: #4b5563;
  }

  :global(.dark-mode) .search-card:hover {
    background: #4b5563;
  }

  :global(.dark-mode) .tips-list {
    color: #d1d5db;
  }

  :global(.dark-mode) .external-notice {
    background: #1e3a5f;
    border-color: #2563eb;
  }

  :global(.dark-mode) .external-notice p {
    color: #93c5fd;
  }
</style>
