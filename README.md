# Myndness

A personal mental wellness Progressive Web App designed for managing ADHD, GAD, MDD, and autism-related executive function challenges through evidence-based interventions.

**Live**: https://greenwh.github.io/myndness/

## Overview

Myndness is a comprehensive mental wellness companion that combines traditional mental health tools (mood tracking, CBT, mindfulness) with autism-specific productivity features (spoon theory, task breakdown, special interests tracking). Built for a 64-year-old user with ADHD-Inattentive, GAD, MDD, and mild autism, it prioritizes accessibility, executive function support, and capacity management.

## Core Features

### Crisis & Grounding Tools
- **4-7-8 Breathing Timer** - Animated breathing exercise with audio cues
- **5-4-3-2-1 Grounding** - Sensory grounding technique for acute anxiety
- **Floating Crisis Button** - Always-accessible red button on every screen

### Tracking & Monitoring
- **Mood & Anxiety Logger** - Track mood (1-10) and anxiety (0-10) with notes
- **Blood Pressure Logger** - BP tracking with anxiety correlation and pacemaker context
- **Activities Logger** - Exercise tracking with intensity, enjoyment, and mastery ratings
- **Energy/Spoons Assessment** - Daily capacity tracking using spoon theory

### Behavioral Activation
- **Activity Library** - 30+ pre-seeded activities across 6 categories, each with spoon cost (1-10)
- **Daily Planner** - Morning/afternoon/evening time blocks with visual timeline
- **Routine Templates** - Save and reuse daily routines (Weekday, Weekend, Low Energy presets)
- **Transition Warnings** - Gentle 15-minute countdown before time block changes

### Executive Function Support (Autism Productivity)
- **Task Breakdown Tool** - Break overwhelming tasks into micro-steps with templates
  - Pre-seeded templates: Clean kitchen, Do laundry, Morning routine, Write email
  - Step-by-step execution view (one step at a time)
  - Optional timer per step, progress tracking
- **Energy Management** - Spoon theory integration throughout planner
  - Morning capacity assessment
  - Activity filtering by energy cost (low/medium/high)
  - Capacity warnings when over-scheduling
- **Special Interests Tracking** - Positive tracking of hyperfocus time
  - Session logging with mood/energy impact
  - "Time well spent" framing (no guilt)
  - Category tracking (STEM, creative, media, gaming, etc.)

### CBT & Cognitive Tools
- **Thought Records** - 7-step CBT thought challenging process
- **Cognitive Distortions Guide** - Reference for 14 common thinking patterns
- **Behavioral Experiments** - Test beliefs with structured experiments
- **Anxiety Hierarchy** - Exposure therapy ladder with SUDS tracking

### Mindfulness & Practice
- **Meditation Timer** - Customizable timer (3-20 minutes)
- **Guided Practices** - Breath awareness, body scan (5 or 15 min)
- **Session History** - Track mindfulness minutes and mood impact

### Insights & Reporting
- **Mood Trend Charts** - Visualize mood/anxiety patterns over time
- **Activity Impact Analysis** - See which activities improve mood most
- **Streak Tracking** - Celebrate consistency
- **Data Export** - CSV/JSON export for healthcare providers

## Autism Productivity Features (New)

The app now includes comprehensive support for autism-related executive function challenges:

### Spoon Theory Integration
**Why**: Autistic individuals often experience fluctuating energy capacity that's hard to predict. Spoon theory provides a concrete metaphor for daily energy.

- Morning assessment of available "spoons" (0-10 scale)
- Each activity has a spoon cost (1-10) based on cognitive/social/physical demands
- Dashboard widget shows remaining capacity with color-coded gauge (green/amber/red)
- Activity library filters by energy level (low 1-3, medium 4-6, high 7-10)
- Warnings when planning activities that exceed current capacity

### Task Breakdown System
**Why**: Executive dysfunction makes it hard to start tasks because they feel overwhelming as a whole. Breaking them into micro-steps reduces initiation friction.

- Multi-step form to define task and break into actionable steps
- Execution view shows ONE step at a time (reduces overwhelm)
- Optional timer per step with visual countdown
- Progress bar shows completion
- 4 pre-seeded templates for common overwhelming tasks
- Save any breakdown as a reusable template

### Visual Routine Timeline
**Why**: Time blindness and difficulty with transitions are common autistic traits. Visualizing the day helps anticipate changes.

- Horizontal timeline showing morning/afternoon/evening blocks
- Current time indicator (red line)
- Activities displayed proportionally by duration
- Color-coded by category
- Spoon cost shown for each activity

### Transition Support
**Why**: Transitions between activities or time periods can be anxiety-inducing. Advance warning allows mental preparation.

- Gentle 15-minute warning before time block ends
- Shows next upcoming activity
- Dismissible (user control)
- Soft visual design (no harsh alarms)

### Routine Templates
**Why**: Creating a daily plan from scratch requires executive function. Templates bypass this barrier.

- Pre-built templates: Weekday, Weekend, Low Energy Day
- Save today's plan as a template
- One-click apply to any day
- Tracks usage count (shows what works)

### Special Interests Tracking
**Why**: Traditional productivity tools treat special interests as "distractions." This reframes them as valuable recovery time.

- Positive framing: "time well spent"
- Track session type (research, creating, consuming, organizing, etc.)
- Mood and energy impact tracking
- Shows average mood improvement from each interest
- 9 category options (STEM, creative, collection, media, gaming, nature, history, language, other)

## Technology Stack

- **Framework**: SvelteKit 2 with Svelte 5 (runes mode)
- **Styling**: Tailwind CSS
- **Storage**: IndexedDB via Dexie.js (v2 schema, 17 tables)
- **Charts**: Chart.js
- **PWA**: Installable, works fully offline
- **Deployment**: GitHub Pages with SPA routing

## Development

```bash
# Install dependencies
npm install

# Start dev server (access at localhost:5173/myndness/)
npm run dev

# Build for production
npm run build

# Preview production build (access at localhost:4173/myndness/)
npm run preview
```

**Important**: Base path is `/myndness` for GitHub Pages. All internal links must use `{base}` from `$app/paths`.

## Design Principles

### Accessibility (Non-Negotiable)
- **44px minimum** touch targets for all interactive elements
- **16px+ fonts** - no small text
- **WCAG AA contrast** - 4.5:1 minimum
- **Focus indicators** - visible ring on all focusable elements
- **Reduced motion** - respect `prefers-reduced-motion`

### UX for ADHD/Autism
- **One task per screen** - never multiple competing actions
- **Auto-save everything** - no lost work, no "Save" buttons for drafts
- **Explicit save for logging** - immediate feedback, success view pattern
- **Exit always available** - can leave any flow anytime
- **No guilt language** - never "you only did X" or "don't forget"
- **Neutral tone** - factual, not patronizing ("3 completed" not "Great job!")
- **Visual over verbal** - timelines, gauges, progress bars
- **Make invisible visible** - spoons, time passing, capacity

### Privacy & Offline-First
- **No analytics** - zero tracking
- **No cloud sync** - all data stays on device
- **Works offline** - service worker caches everything
- **IndexedDB storage** - reliable client-side persistence

## Database Schema (v2)

### Core Tables (17 total)
- `moodLogs` - Mood and anxiety entries
- `bpReadings` - Blood pressure tracking
- `plannedActivities` - Daily activity planner (includes spoonCost)
- `activityLibrary` - Activity catalog (includes spoonCost)
- `activities` - Exercise logging
- `thoughtRecords` - CBT thought records
- `behavioralExperiments` - CBT experiments
- `anxietyHierarchy` - Exposure therapy ladder
- `mindfulnessSessions` - Meditation tracking

### Autism Productivity Tables (new in v2)
- `energyLogs` - Daily spoon assessments
- `taskBreakdowns` - Task breakdown with steps (includes templates)
- `routineTemplates` - Saved daily routines
- `specialInterests` - Interest catalog
- `interestSessions` - Session logging

### System Tables
- `userProfile` - User demographics and medical context
- `settings` - App preferences

## Project Status

**All phases complete** - production ready:
- ✅ Phase 0: PWA scaffold
- ✅ Phase 1: Crisis tools
- ✅ Phase 2: Core tracking
- ✅ Phase 3: Behavioral activation
- ✅ Phase 4: CBT tools
- ✅ Phase 5: Mindfulness
- ✅ Phase 6: Insights & reporting
- ✅ Phase 7: Movement & polish
- ✅ Phase 8: Activities tracking, experiments, anxiety hierarchy
- ✅ Phase 9: Autism productivity features (spoons, task breakdown, routines, interests)

## User Context

**Target user**: 64-year-old male with:
- ADHD-Inattentive (high IQ, normal processing speed)
- GAD, MDD (moderate), OCD (mild)
- Mild autism (diagnosed, executive function challenges)
- Pacemaker (BP monitoring critical)
- Introverted (no social features)
- Military background (appreciates structure)

**Design implications**:
- Large touch targets (age + potential tremor)
- BP tracking clinically important
- Structured approach preferred
- Visual over text (high perceptual reasoning)
- No social comparison features

## License

Private project - not for redistribution.
