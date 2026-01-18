<script lang="ts">
  import { base } from '$app/paths';

  interface Article {
    category: string;
    title: string;
    content: string;
  }

  let searchQuery = $state('');

  const articles: Article[] = [
    {
      category: 'Getting Started',
      title: 'Welcome to Myndness',
      content: `
        <p>Myndness is your personal mental wellness companion designed to help manage anxiety, stress, and mood.</p>
        <p><strong>Main Features:</strong></p>
        <ul>
          <li><strong>Crisis Tools:</strong> Quick access to breathing and grounding exercises</li>
          <li><strong>Tracking:</strong> Monitor mood, anxiety, blood pressure, and activities</li>
          <li><strong>Planning:</strong> Schedule activities with behavioral activation</li>
          <li><strong>CBT Tools:</strong> Thought records and cognitive restructuring</li>
          <li><strong>Mindfulness:</strong> Meditation timer and guided practices</li>
          <li><strong>Movement:</strong> Tai chi and stretching videos</li>
          <li><strong>Insights:</strong> View trends and export your data</li>
        </ul>
        <p>All your data is stored locally on your device for privacy.</p>
      `
    },
    {
      category: 'Getting Started',
      title: 'Navigation',
      content: `
        <p>Use the bottom navigation bar to move between main sections:</p>
        <ul>
          <li><strong>Home:</strong> Dashboard with today's summary</li>
          <li><strong>Track:</strong> Log mood, anxiety, blood pressure</li>
          <li><strong>Plan:</strong> Schedule and complete activities</li>
          <li><strong>Tools:</strong> Access all intervention techniques</li>
          <li><strong>Insights:</strong> View charts and trends</li>
        </ul>
        <p>The floating 🆘 button gives quick access to crisis tools from anywhere in the app.</p>
      `
    },
    {
      category: 'Crisis Tools',
      title: '4-7-8 Breathing',
      content: `
        <p>A calming breathing technique to reduce anxiety quickly.</p>
        <p><strong>How it works:</strong></p>
        <ol>
          <li><strong>Inhale</strong> through your nose for 4 seconds</li>
          <li><strong>Hold</strong> your breath for 7 seconds</li>
          <li><strong>Exhale</strong> through your mouth for 8 seconds</li>
        </ol>
        <p>The visual circle guides your breathing rhythm. Complete 4 rounds for best results.</p>
        <p><strong>When to use:</strong> During anxiety spikes, before bed, or anytime you need to calm down.</p>
      `
    },
    {
      category: 'Crisis Tools',
      title: '5-4-3-2-1 Grounding',
      content: `
        <p>A grounding exercise that uses your five senses to bring you back to the present moment.</p>
        <p><strong>Steps:</strong></p>
        <ol>
          <li>Name <strong>5 things you can see</strong> around you</li>
          <li>Name <strong>4 things you can touch</strong></li>
          <li>Name <strong>3 things you can hear</strong></li>
          <li>Name <strong>2 things you can smell</strong></li>
          <li>Name <strong>1 thing you can taste</strong></li>
        </ol>
        <p><strong>When to use:</strong> During panic attacks, dissociation, or when feeling overwhelmed.</p>
      `
    },
    {
      category: 'Tracking',
      title: 'Mood & Anxiety Logging',
      content: `
        <p>Track your emotional state throughout the day to identify patterns.</p>
        <p><strong>Mood Scale (1-10):</strong></p>
        <ul>
          <li>1-3: Low mood (sad, hopeless, withdrawn)</li>
          <li>4-7: Moderate mood (stable, neutral)</li>
          <li>8-10: Good mood (happy, energized)</li>
        </ul>
        <p><strong>Anxiety Scale (0-10):</strong></p>
        <ul>
          <li>0: No anxiety</li>
          <li>1-3: Mild (slight tension)</li>
          <li>4-6: Moderate (noticeable worry)</li>
          <li>7-10: Severe (intense, overwhelming)</li>
        </ul>
        <p>Add optional notes to remember context. Track multiple times per day to see patterns.</p>
      `
    },
    {
      category: 'Tracking',
      title: 'Blood Pressure Monitoring',
      content: `
        <p>Track your blood pressure readings, especially useful for users with cardiac conditions.</p>
        <p><strong>Recording a reading:</strong></p>
        <ul>
          <li>Enter systolic (top number) and diastolic (bottom number)</li>
          <li>Optionally record heart rate (BPM)</li>
          <li>Note which arm was used and your position</li>
          <li>Mark if taken during/after anxiety or exercise</li>
        </ul>
        <p><strong>Tips:</strong></p>
        <ul>
          <li>Measure at the same time each day</li>
          <li>Rest for 5 minutes before measuring</li>
          <li>Avoid caffeine 30 minutes before</li>
          <li>Link readings to mood logs to track connections</li>
        </ul>
      `
    },
    {
      category: 'Planning',
      title: 'Behavioral Activation',
      content: `
        <p>Plan activities to improve mood and break cycles of avoidance.</p>
        <p><strong>Activity Categories:</strong></p>
        <ul>
          <li><strong>Social:</strong> Connecting with others</li>
          <li><strong>Creative:</strong> Arts, cooking, hobbies</li>
          <li><strong>Physical:</strong> Movement and exercise</li>
          <li><strong>Learning:</strong> Reading, puzzles, education</li>
          <li><strong>Mastery:</strong> Tasks that give a sense of accomplishment</li>
          <li><strong>Pleasure:</strong> Relaxing, enjoyable activities</li>
        </ul>
        <p><strong>How to use:</strong></p>
        <ol>
          <li>Choose activities from the library or add your own</li>
          <li>Schedule them for morning, afternoon, or evening</li>
          <li>Complete the activity and rate enjoyment and mastery (0-10)</li>
          <li>Track how activities affect your mood before and after</li>
        </ol>
        <p>Aim for a balanced mix of activity types each week.</p>
      `
    },
    {
      category: 'CBT Tools',
      title: 'Thought Records',
      content: `
        <p>Challenge unhelpful thoughts using cognitive restructuring.</p>
        <p><strong>7-Step Process:</strong></p>
        <ol>
          <li><strong>Situation:</strong> What happened? (brief description)</li>
          <li><strong>Automatic Thought:</strong> What went through your mind?</li>
          <li><strong>Emotion:</strong> What did you feel? How intense (0-100)?</li>
          <li><strong>Distortions:</strong> Which thinking errors apply?</li>
          <li><strong>Evidence For:</strong> Facts that support the thought</li>
          <li><strong>Evidence Against:</strong> Facts that contradict it</li>
          <li><strong>Balanced Thought:</strong> A more realistic perspective</li>
        </ol>
        <p>Re-rate your emotion intensity after completing the record. You should see a reduction.</p>
        <p><strong>Tip:</strong> Complete within 24 hours of the event for best results.</p>
      `
    },
    {
      category: 'CBT Tools',
      title: 'Common Cognitive Distortions',
      content: `
        <p>Thinking patterns that often maintain anxiety and depression:</p>
        <ul>
          <li><strong>All-or-Nothing:</strong> Seeing things in black and white</li>
          <li><strong>Overgeneralization:</strong> "Always" or "never" thinking</li>
          <li><strong>Mental Filter:</strong> Focusing only on negatives</li>
          <li><strong>Jumping to Conclusions:</strong> Assuming without evidence</li>
          <li><strong>Catastrophizing:</strong> Expecting the worst</li>
          <li><strong>Emotional Reasoning:</strong> "I feel it, so it must be true"</li>
          <li><strong>Should Statements:</strong> Rigid rules about how things "should" be</li>
          <li><strong>Labeling:</strong> "I'm a failure" vs. "I failed at this task"</li>
          <li><strong>Personalization:</strong> Taking blame inappropriately</li>
        </ul>
        <p>Learn to recognize these patterns in your thinking. The Distortions Guide in CBT Tools has full descriptions.</p>
      `
    },
    {
      category: 'Mindfulness',
      title: 'Meditation Timer',
      content: `
        <p>Simple timer for unguided meditation practice.</p>
        <p><strong>Using the timer:</strong></p>
        <ol>
          <li>Choose a duration (3, 5, 10, 15, or 20 minutes)</li>
          <li>Optional: Select a bell sound for start/end</li>
          <li>Sit comfortably and press Start</li>
          <li>Focus on your breath or chosen anchor</li>
          <li>When distracted, gently return attention to breath</li>
        </ol>
        <p><strong>Tips for beginners:</strong></p>
        <ul>
          <li>Start with 3-5 minutes</li>
          <li>Practice at the same time daily</li>
          <li>Don't judge your experience</li>
          <li>Consistency matters more than duration</li>
        </ul>
      `
    },
    {
      category: 'Mindfulness',
      title: 'Guided Practices',
      content: `
        <p>Structured mindfulness exercises for different needs.</p>
        <p><strong>Breath Awareness (5 min):</strong></p>
        <p>Focus attention on the natural rhythm of breathing. Notice sensations without changing your breath.</p>
        <p><strong>Body Scan (5 or 15 min):</strong></p>
        <p>Systematically move attention through different body parts, noticing sensations without judgment.</p>
        <p><strong>Benefits:</strong></p>
        <ul>
          <li>Reduces rumination and worry</li>
          <li>Improves emotional regulation</li>
          <li>Enhances body awareness</li>
          <li>Promotes relaxation</li>
        </ul>
        <p>Track sessions in Mindfulness History to see your practice streaks.</p>
      `
    },
    {
      category: 'Movement',
      title: 'Tai Chi Practice',
      content: `
        <p>Gentle flowing movements that combine physical and mental exercise.</p>
        <p><strong>Video Categories:</strong></p>
        <ul>
          <li><strong>Morning Routine:</strong> Energizing 5-10 minute practices</li>
          <li><strong>Evening Practice:</strong> Calming movements before bed</li>
          <li><strong>Seated Practice:</strong> Full routines from a chair</li>
          <li><strong>Balance Work:</strong> Improve stability (use a chair for support)</li>
        </ul>
        <p><strong>Safety:</strong></p>
        <ul>
          <li>All videos are gentle and pacemaker-safe</li>
          <li>Move slowly and breathe naturally</li>
          <li>Have a chair or wall nearby for balance</li>
          <li>Stop if dizzy or short of breath</li>
        </ul>
      `
    },
    {
      category: 'Movement',
      title: 'Stretching Exercises',
      content: `
        <p>Gentle stretches to release tension and improve flexibility.</p>
        <p><strong>Video Categories:</strong></p>
        <ul>
          <li><strong>Full Body:</strong> Complete 5-10 minute routines</li>
          <li><strong>Neck & Shoulders:</strong> Release upper body tension</li>
          <li><strong>Lower Back & Legs:</strong> Gentle stretches for common pain areas</li>
          <li><strong>Seated Stretches:</strong> Routines from a chair</li>
        </ul>
        <p><strong>Guidelines:</strong></p>
        <ul>
          <li>Never force a stretch - gentle tension is enough</li>
          <li>Hold each stretch for 15-30 seconds</li>
          <li>Breathe naturally throughout</li>
          <li>Warm up with light movement first</li>
          <li>Stop immediately if you feel sharp pain</li>
        </ul>
      `
    },
    {
      category: 'Insights',
      title: 'Charts and Trends',
      content: `
        <p>Visualize your data to identify patterns and progress.</p>
        <p><strong>Available Charts:</strong></p>
        <ul>
          <li><strong>Mood & Anxiety Trends:</strong> Daily averages over time</li>
          <li><strong>Activity Completion:</strong> How many activities completed by category</li>
          <li><strong>Mindfulness Practice:</strong> Sessions, total minutes, streaks</li>
          <li><strong>Blood Pressure:</strong> Systolic/diastolic trends with anxiety markers</li>
        </ul>
        <p><strong>Time Ranges:</strong></p>
        <p>View data for 7 days, 30 days, 90 days, or all time.</p>
        <p><strong>Insights Section:</strong></p>
        <p>See weekly summaries, activity impact on mood, and practice streaks.</p>
      `
    },
    {
      category: 'Insights',
      title: 'Export Your Data',
      content: `
        <p>Download your data for backup or sharing with healthcare providers.</p>
        <p><strong>Export Formats:</strong></p>
        <ul>
          <li><strong>CSV:</strong> Spreadsheet format (one file per data type)</li>
          <li><strong>JSON:</strong> Complete structured data in one file</li>
        </ul>
        <p><strong>Data Types:</strong></p>
        <ul>
          <li>Mood logs</li>
          <li>Blood pressure readings</li>
          <li>Planned activities</li>
          <li>Thought records</li>
          <li>Mindfulness sessions</li>
        </ul>
        <p>All processing happens on your device. No data is uploaded to servers.</p>
        <p><strong>Sharing with providers:</strong></p>
        <p>Export to CSV for easy viewing in spreadsheet apps, or JSON for technical analysis.</p>
      `
    },
    {
      category: 'Settings',
      title: 'Customizing the App',
      content: `
        <p>Adjust the app to your preferences in Settings.</p>
        <p><strong>Appearance:</strong></p>
        <ul>
          <li><strong>Theme:</strong> Light, dark, or system default</li>
          <li><strong>Font Size:</strong> Normal, large, or extra large</li>
          <li><strong>High Contrast:</strong> Increase visibility</li>
          <li><strong>Reduce Motion:</strong> Minimize animations</li>
        </ul>
        <p><strong>Notifications:</strong></p>
        <ul>
          <li>Enable/disable notifications</li>
          <li>Set morning check-in time</li>
          <li>Set evening review time</li>
          <li>Toggle activity reminders</li>
        </ul>
        <p><strong>Profile:</strong></p>
        <ul>
          <li>Age, conditions (optional)</li>
          <li>Pacemaker flag (for safe exercise recommendations)</li>
        </ul>
        <p><strong>Data:</strong></p>
        <ul>
          <li>Export all data</li>
          <li>Clear all data (permanent)</li>
        </ul>
      `
    },
    {
      category: 'Privacy & Data',
      title: 'How Your Data is Stored',
      content: `
        <p>Myndness prioritizes your privacy.</p>
        <p><strong>Local Storage:</strong></p>
        <ul>
          <li>All data is stored in your browser's IndexedDB</li>
          <li>Nothing is uploaded to servers</li>
          <li>Data stays on your device only</li>
          <li>You have complete control</li>
        </ul>
        <p><strong>What this means:</strong></p>
        <ul>
          <li>✓ Your data is private</li>
          <li>✓ Works offline</li>
          <li>✓ No account required</li>
          <li>⚠ Clearing browser data will delete your records</li>
          <li>⚠ Data doesn't sync across devices</li>
        </ul>
        <p><strong>Recommendation:</strong></p>
        <p>Export your data regularly (Settings → Data → Export) to create backups.</p>
      `
    }
  ];

  const filtered = $derived(
    searchQuery.trim() === ''
      ? articles
      : articles.filter(article =>
          article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          article.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
          article.category.toLowerCase().includes(searchQuery.toLowerCase())
        )
  );

  const grouped = $derived(
    filtered.reduce((acc, article) => {
      if (!acc[article.category]) {
        acc[article.category] = [];
      }
      acc[article.category].push(article);
      return acc;
    }, {} as Record<string, Article[]>)
  );

  let expandedArticles = $state<Set<string>>(new Set());

  function toggleArticle(title: string) {
    if (expandedArticles.has(title)) {
      expandedArticles.delete(title);
    } else {
      expandedArticles.add(title);
    }
    expandedArticles = expandedArticles; // Trigger reactivity
  }
</script>

<svelte:head>
  <title>Help - Myndness</title>
</svelte:head>

<div class="help-container">
  <header>
    <h1 class="page-title">Help & Documentation</h1>
    <p class="page-description">Find answers and learn how to use Myndness</p>
  </header>

  <div class="search-container">
    <input
      type="search"
      class="search-input"
      placeholder="Search help articles..."
      bind:value={searchQuery}
      aria-label="Search help articles"
    />
  </div>

  {#if Object.keys(grouped).length === 0}
    <div class="no-results">
      <p>No articles found for "{searchQuery}"</p>
      <button class="clear-search" onclick={() => searchQuery = ''}>
        Clear search
      </button>
    </div>
  {:else}
    {#each Object.entries(grouped) as [category, categoryArticles]}
      <section class="category-section">
        <h2 class="category-title">{category}</h2>
        <div class="articles-list">
          {#each categoryArticles as article}
            <div class="article-card">
              <button
                class="article-header"
                onclick={() => toggleArticle(article.title)}
                aria-expanded={expandedArticles.has(article.title)}
              >
                <h3 class="article-title">{article.title}</h3>
                <span class="expand-icon">
                  {expandedArticles.has(article.title) ? '−' : '+'}
                </span>
              </button>
              {#if expandedArticles.has(article.title)}
                <div class="article-content">
                  {@html article.content}
                </div>
              {/if}
            </div>
          {/each}
        </div>
      </section>
    {/each}
  {/if}

  <div class="help-footer">
    <p class="footer-text">
      Still need help? Review your <a href="{base}/settings">Settings</a> or
      <a href="{base}/">return to Dashboard</a>.
    </p>
  </div>
</div>

<style>
  .help-container {
    max-width: 48rem;
    margin: 0 auto;
    padding: 1.5rem;
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
    margin: 0 0 2rem 0;
  }

  .search-container {
    margin-bottom: 2rem;
  }

  .search-input {
    width: 100%;
    padding: 0.75rem 1rem;
    font-size: 1rem;
    border: 1px solid #d1d5db;
    border-radius: 8px;
    min-height: 44px;
  }

  .search-input:focus {
    outline: 2px solid #3b82f6;
    outline-offset: 2px;
  }

  .no-results {
    text-align: center;
    padding: 3rem 1rem;
  }

  .no-results p {
    color: #6b7280;
    margin: 0 0 1rem 0;
  }

  .clear-search {
    padding: 0.5rem 1rem;
    background: #3b82f6;
    color: white;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    font-size: 1rem;
    min-height: 44px;
  }

  .clear-search:hover {
    background: #2563eb;
  }

  .category-section {
    margin-bottom: 2.5rem;
  }

  .category-title {
    font-size: 1.5rem;
    font-weight: 600;
    color: #111827;
    margin: 0 0 1rem 0;
    padding-bottom: 0.5rem;
    border-bottom: 2px solid #e5e7eb;
  }

  .articles-list {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .article-card {
    background: white;
    border: 1px solid #e5e7eb;
    border-radius: 12px;
    overflow: hidden;
  }

  .article-header {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 1.25rem;
    background: white;
    border: none;
    cursor: pointer;
    text-align: left;
    min-height: 60px;
  }

  .article-header:hover {
    background: #f9fafb;
  }

  .article-header:focus {
    outline: 2px solid #3b82f6;
    outline-offset: -2px;
  }

  .article-title {
    font-size: 1.125rem;
    font-weight: 600;
    color: #111827;
    margin: 0;
  }

  .expand-icon {
    font-size: 1.5rem;
    color: #6b7280;
    flex-shrink: 0;
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .article-content {
    padding: 0 1.25rem 1.25rem 1.25rem;
    color: #374151;
    line-height: 1.6;
  }

  .article-content :global(p) {
    margin: 0 0 1rem 0;
  }

  .article-content :global(p:last-child) {
    margin-bottom: 0;
  }

  .article-content :global(ul),
  .article-content :global(ol) {
    margin: 0 0 1rem 0;
    padding-left: 1.5rem;
  }

  .article-content :global(li) {
    margin: 0.5rem 0;
  }

  .article-content :global(strong) {
    font-weight: 600;
    color: #111827;
  }

  .help-footer {
    margin-top: 3rem;
    padding-top: 2rem;
    border-top: 1px solid #e5e7eb;
    text-align: center;
  }

  .footer-text {
    color: #6b7280;
    margin: 0;
  }

  .footer-text a {
    color: #3b82f6;
    text-decoration: underline;
  }

  .footer-text a:hover {
    color: #2563eb;
  }

  /* Dark mode */
  :global(.dark-mode) .page-title,
  :global(.dark-mode) .category-title,
  :global(.dark-mode) .article-title {
    color: #f9fafb;
  }

  :global(.dark-mode) .page-description,
  :global(.dark-mode) .footer-text {
    color: #9ca3af;
  }

  :global(.dark-mode) .search-input {
    background: #374151;
    border-color: #4b5563;
    color: #f9fafb;
  }

  :global(.dark-mode) .article-card {
    background: #1f2937;
    border-color: #374151;
  }

  :global(.dark-mode) .article-header {
    background: #1f2937;
  }

  :global(.dark-mode) .article-header:hover {
    background: #374151;
  }

  :global(.dark-mode) .article-content {
    color: #d1d5db;
  }

  :global(.dark-mode) .article-content :global(strong) {
    color: #f9fafb;
  }

  :global(.dark-mode) .category-title {
    border-bottom-color: #374151;
  }

  :global(.dark-mode) .help-footer {
    border-top-color: #374151;
  }
</style>
