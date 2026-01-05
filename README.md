# Myndness

A personal mental wellness Progressive Web App designed for managing ADHD, GAD, and MDD symptoms through evidence-based interventions.

**Live**: https://greenwh.github.io/myndness/

## Features

### Crisis Tools (Phase 1)
- **4-7-8 Breathing Timer** - Animated breathing exercise with audio cues
- **5-4-3-2-1 Grounding** - Sensory grounding technique for acute anxiety
- **Floating Crisis Button** - Always-accessible red button on every screen

### Core Tracking (Phase 2)
- **Mood Logger** - Track mood (1-10) and anxiety (0-10) with notes
- **BP Logger** - Blood pressure tracking with anxiety correlation flag
- **Dashboard** - Today's entries at a glance

### Behavioral Activation (Phase 3)
- **Activity Library** - 30 pre-seeded activities across 6 categories
- **Daily Planner** - Morning/afternoon/evening time blocks
- **Completion Tracking** - Enjoyment and mastery ratings
- **Progress Visualization** - Circular completion ring

### Coming Soon
- Phase 4: CBT Tools (thought records, cognitive distortions)
- Phase 5: Mindfulness (breath awareness, body scan)
- Phase 6: Insights & Reporting (charts, PDF export)

## Technology

- **Framework**: SvelteKit 2 with Svelte 5
- **Styling**: Tailwind CSS
- **Storage**: IndexedDB via Dexie.js (fully offline)
- **PWA**: Installable, works offline
- **Deployment**: GitHub Pages

## Development

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

**Note**: Access dev/preview at `localhost:PORT/myndness/` (base path required)

## Design Principles

- **Accessibility First** - 44px touch targets, 16px+ fonts, WCAG AA contrast
- **ADHD-Friendly** - One task per screen, auto-save everything
- **No Guilt Language** - Neutral, factual tone
- **Offline-First** - All data stored locally in IndexedDB
- **Privacy** - No analytics, no cloud sync, all data stays on device

## License

Private project - not for redistribution.
