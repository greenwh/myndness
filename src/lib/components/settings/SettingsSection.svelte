<script lang="ts">
  let { title, description, children } = $props();
</script>

<section class="settings-section">
  <div class="section-header">
    <h2 class="section-title">{title}</h2>
    {#if description}
      <p class="section-description">{description}</p>
    {/if}
  </div>
  <div class="section-content">
    {@render children()}
  </div>
</section>

<style>
  .settings-section {
    background: white;
    border: 1px solid #e5e7eb;
    border-radius: 12px;
    padding: 1.5rem;
    margin-bottom: 1.5rem;
  }

  .section-header {
    margin-bottom: 1.25rem;
    padding-bottom: 1rem;
    border-bottom: 1px solid #e5e7eb;
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
    margin: 0;
  }

  .section-content {
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
  }

  /* Dark mode support (to be implemented) */
  :global(.dark-mode) .settings-section {
    background: #1f2937;
    border-color: #374151;
  }

  :global(.dark-mode) .section-header {
    border-bottom-color: #374151;
  }

  :global(.dark-mode) .section-title {
    color: #f9fafb;
  }

  :global(.dark-mode) .section-description {
    color: #9ca3af;
  }
</style>
