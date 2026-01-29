# Myndness Autism Productivity Features - Implementation Plan

**Created:** 2026-01-28
**Focus:** Mild autism + productivity/motivation support
**Task List:** myndness-autism-support (22 tasks)

---

## Overview

This plan focuses on **5 big-ticket productivity features** for someone with mild autism who struggles with productivity and motivation. Unlike the original proposal (which leaned toward crisis management), this focuses on **daily enablement**.

### Features

| # | Feature | Purpose |
|---|---------|---------|
| 1 | **Task Breakdown Tool** | Executive function support - break overwhelming tasks into micro-steps |
| 2 | **Energy/Spoons Tracker** | Capacity management - prevent burnout through pacing |
| 3 | **Enhanced Routine Visualizer** | Structure - visual timeline with transition warnings |
| 4 | **Time Perception Aids** | Awareness - countdown timers, hyperfocus alerts |
| 5 | **Special Interest Tracking** | Motivation - validate interests as valuable, track positive impact |

---

## Implementation Phases

### Phase 1: Foundation (Tasks 1-3)
**Database schema and core infrastructure**

```
[1] Database types for all features
 └─► [2] Dexie tables + query helpers
      └─► [3] Add spoonCost to activity library
```

| Task | Description |
|------|-------------|
| #1 | Add TypeScript interfaces: EnergyLog, TaskBreakdown, RoutineTemplate, SpecialInterest, InterestSession |
| #2 | Add Dexie tables, indexes, query helpers for all new entities |
| #3 | Migrate existing activity library to include spoonCost (1-10) per activity |

---

### Phase 2: Energy/Spoons System (Tasks 4-7)
**Core capacity management - enables task matching**

```
         [3] spoonCost migration
              │
    ┌─────────┴─────────┐
    ▼                   ▼
[4] Morning          [6] Activity library
    assessment           spoon display
    │                   │
    ▼                   │
[5] Dashboard      ─────┤
    widget              │
    │                   │
    └───────┬───────────┘
            ▼
       [7] Planner spoon integration
```

| Task | Description |
|------|-------------|
| #4 | Morning spoon assessment form (/track/energy) - "How many spoons today?" (0-10) |
| #5 | Dashboard widget showing remaining spoons with color-coded gauge |
| #6 | Activity library: display spoon cost, filter by energy level, context-aware suggestions |
| #7 | Activity planner: show total spoons needed, running count, over-scheduling warnings |

**Key UX:** When adding activities, show "You have 5 spoons, this costs 3" warnings.

---

### Phase 3: Task Breakdown Tool (Tasks 8-10)
**Executive function support for overwhelming tasks**

```
[2] Database ready
 │
 ▼
[8] Multi-step creation form
 │
 ├──────────────────────┐
 ▼                      ▼
[9] Execution view    [14] Timer (Phase 5)
 │                      │
 └──────────┬───────────┘
            ▼
      [10] Hub + templates
```

| Task | Description |
|------|-------------|
| #8 | 3-step form: Define task → Break into steps (with durations) → Review |
| #9 | Execution view: one step at a time, progress bar, optional timer, "Done" button per step |
| #10 | Hub page: in-progress tasks, pre-seeded templates, user templates, history |

**Templates include:** Clean kitchen (6 steps), Do laundry (5 steps), Morning routine (7 steps), Write an email (4 steps)

---

### Phase 4: Enhanced Routine Visualizer (Tasks 11-13)
**Visual structure and transition support**

```
     [3] spoonCost migration
      │
      ▼
[11] Horizontal timeline
      │
      ├───────────────────┐
      ▼                   ▼
[12] Transition      [7] Planner integration (Phase 2)
     countdown            │
      │                   │
      └───────┬───────────┘
              ▼
        [13] Templates system
```

| Task | Description |
|------|-------------|
| #11 | Horizontal timeline showing morning→afternoon→evening with proportional activity blocks, current time indicator |
| #12 | Transition countdown: "Next activity (Shower) in 10 minutes" with configurable warnings (15/10/5 min) |
| #13 | Routine templates: pre-built (Weekday, Weekend, Low Energy), save today as template, apply template to day |

---

### Phase 5: Time Perception Aids (Tasks 14-16)
**Making time visible and concrete**

```
[2] Database ready
 │
 ▼
[14] Visual countdown timer component
 │
 ├─────────────────┬──────────────────┐
 ▼                 ▼                  ▼
[9] Task       [15] Time          [16] Hyperfocus
    execution      remaining          alerts
                   display
```

| Task | Description |
|------|-------------|
| #14 | Reusable VisualTimer component: circular countdown, color changes (green→amber→red), multiple sizes |
| #15 | Activity time remaining display: "Morning: 2h 30m remaining", day progress bar, time until next activity |
| #16 | Hyperfocus alerts: gentle check-in after 60 min in activity, "You've been on X for Y minutes", extend/transition options |

---

### Phase 6: Special Interest Tracking (Tasks 17-19)
**Positive, validating tracking**

```
[2] Database ready       [14] Timer
 │                         │
 ▼                         │
[17] Interest hub          │
 │                         │
 └──────────┬──────────────┘
            ▼
      [18] Session logging
            │
            ▼
      [19] History + insights
```

| Task | Description |
|------|-------------|
| #17 | Interest hub: active interests, add new, category (STEM/Creative/Collection/etc.), positive framing |
| #18 | Session logging: duration, type (research/creating/consuming), optional mood/energy before/after |
| #19 | History + insights: charts showing mood impact, session patterns, "This interest typically improves your mood by X" |

**Key framing:** "Time well spent" - never guilt about interest time.

---

### Phase 7: Integration (Tasks 20-22)
**Navigation, settings, testing**

```
[7] Planner ──┐
[10] Breakdown │
[13] Templates ├──► [20] Navigation + routes
[16] Hyperfocus│         │
[19] Interests ┘         ▼
                   [21] Settings
                         │
                         ▼
                   [22] Testing + docs
```

| Task | Description |
|------|-------------|
| #20 | Add all new routes to navigation, hub pages, dashboard integration |
| #21 | Settings: enable/disable features, configure thresholds (spoon warnings, hyperfocus timing) |
| #22 | Testing checklist, accessibility validation, documentation updates |

---

## New Routes

```
/track/energy                 Morning spoon assessment
/tools/breakdown              Task breakdown hub
/tools/breakdown/new          Create new breakdown
/tools/breakdown/[id]         Execute breakdown
/plan/templates               Routine templates
/track/interests              Special interests hub
/track/interests/[id]         Interest detail + history
/track/interests/[id]/log     Log session
```

---

## Database Schema Summary

### New Tables

| Table | Purpose | Key Fields |
|-------|---------|------------|
| energyLogs | Daily spoon tracking | date, morningSpoons, spoonsUsed, sleepQuality |
| taskBreakdowns | Task breakdown with steps | taskName, steps[], status, isTemplate |
| routineTemplates | Saved routine patterns | name, activities[], tags, timesUsed |
| specialInterests | Interest tracking | name, category, startedDate, currentlyActive |
| interestSessions | Session logging | interestId, duration, type, moodBefore/After |

### Modified Tables

| Table | Change |
|-------|--------|
| activityLibrary | Add `spoonCost: number` (1-10) |
| plannedActivities | Add `spoonCost: number` |

---

## New Components

### Energy System
- `EnergyAssessment.svelte` - Morning spoon form
- `SpoonsWidget.svelte` - Dashboard gauge

### Task Breakdown
- `TaskBreakdownForm.svelte` - Multi-step creation
- `TaskExecution.svelte` - Step-by-step execution

### Routine Visualizer
- `RoutineTimeline.svelte` - Horizontal timeline
- `TransitionCountdown.svelte` - Next activity warning

### Time Perception
- `VisualTimer.svelte` - Reusable countdown (all sizes)
- `TimeRemaining.svelte` - Human-readable remaining time
- `HyperfocusAlert.svelte` - Gentle check-in

### Special Interests
- `InterestCard.svelte` - Interest display
- `InterestSessionForm.svelte` - Log session
- `InterestDetail.svelte` - History + insights

---

## Execution Order

To start implementing, work through unblocked tasks in order:

1. **Start with Task #1** - Database types (no dependencies)
2. Then **#2** - Dexie tables (blocked by #1)
3. Then **#3** - spoonCost migration (blocked by #2)
4. Then work on parallel branches:
   - Energy path: #4 → #5 → #7
   - Library path: #6
   - Task breakdown path: #8
   - Timeline path: #11
   - Timer path: #14
   - Interests path: #17

Use `TaskList` command to see current state and available tasks.

---

## Design Principles

Carried forward from existing myndness:

- **44px minimum touch targets** (accessibility)
- **16px+ fonts** (no small text)
- **Auto-save multi-step forms** (500ms debounce)
- **Explicit save for quick logging** (success view pattern)
- **Neutral, non-judgmental tone** (no guilt language)
- **One task per screen** (reduces overwhelm)
- **Exit always available** (user control)

New for autism productivity:

- **Visual over verbal** (timelines, gauges, progress bars)
- **Gentle reminders, not alarms** (hyperfocus alerts are dismissible)
- **Validate, don't shame** (special interests are valuable)
- **Make invisible visible** (spoons, time passing, capacity)
- **Reduce decisions** (templates, suggestions, defaults)

---

## Success Metrics

After implementation, look for:

1. User can assess morning capacity in < 30 seconds
2. Activity planner prevents over-scheduling before it happens
3. Complex tasks get started (task breakdown reduces initiation friction)
4. Transitions are anticipated (countdown reduces transition anxiety)
5. Time blindness is mitigated (visual timers, elapsed time visible)
6. Special interests are tracked positively (mood correlation visible)

---

**Document Version:** 1.0
**Status:** Ready to implement
**First Task:** #1 - Database Schema - Add types for all 5 autism productivity features
