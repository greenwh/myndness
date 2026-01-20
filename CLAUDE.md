# Myndness - Mental Wellness PWA

## Model Selection & Complexity Assessment

**Assessment Date:** [2026-01-11]
**Assessed Model:** Sonnet 4.5
**Complexity Score:** [5/10]

**Dimension Breakdown:**
- Data Structure: 7/10
- State Management: 5/10
- Integration: 3/10
- Edge Cases: 6/10
- Reasoning/Algorithms: 5/10

**Recommended Model:** [Sonnet]

**Assessment Rationale:**
 **Use Sonnet for myndness development.** This is a mid-complexity project (5/10) with a comprehensive relational data
  model (17+ entities), strict accessibility requirements (WCAG AA for 64yo user), and clinical context (pacemaker/BP
  monitoring). The local-only architecture (IndexedDB, no backend) and well-defined type system keep complexity
  manageable, making Sonnet ideal. Haiku lacks depth for clinical/accessibility requirements; Opus is overkill for local
   CRUD operations. Phases 4-6 (CBT, mindfulness, reporting) will maintain similar complexity levels.


**Key Monitoring Points:**
  - Accessibility validation: Keyboard navigation, screen reader compatibility (44px targets, focus rings)
  - Data integrity: Verify linked IDs across tables (moodLogs.linkedBpId → bpReadings.id)
  - Activity library stats: Rolling averages must update correctly when activities completed/rated
  - PWA offline behavior: Service worker caching for crisis tools during connectivity loss
  - Medical data validation: BP range enforcement (50-250 systolic, 30-150 diastolic)
  - Build/deploy: GitHub Pages base path (/myndness) routing must work for deep links
  
### Quick Context
- **What**: Mental wellness PWA for managing ADHD, GAD, MDD symptoms
- **User**: 64yo male with pacemaker, needs accessible design
- **Stack**: SvelteKit 2 + Svelte 5, Tailwind CSS, IndexedDB (Dexie), PWA
- **Live**: https://greenwh.github.io/myndness/
- **Status File**: `/home/dad/.claude/plans/eager-popping-manatee.md`

### Common Commands
```bash
# Development
npm run dev              # Start dev server (access at localhost:5173/myndness/)
npm run build            # Build for production
npm run preview          # Preview build (access at localhost:4173/myndness/)

# Deployment (automatic via GitHub Actions on push)
git add -A && git commit -m "message" && git push origin main
```

---

## Project Status (All Phases Complete - Production Ready)

| Phase | Status | Description |
|-------|--------|-------------|
| Phase 0 | ✅ | SvelteKit scaffold, PWA, GitHub Pages |
| Phase 1 | ✅ | Crisis tools (4-7-8 breathing, 5-4-3-2-1 grounding) |
| Phase 2 | ✅ | Core tracking (mood, BP, dashboard) |
| Phase 3 | ✅ | Behavioral Activation (activity planner) |
| Phase 4 | ✅ | CBT Tools (thought records, distortions) |
| Phase 5 | ✅ | Mindfulness (meditation timer, guided practices, history) |
| Phase 6 | ✅ | Insights & Reporting (charts, trends, export) |
| Phase 7 | ✅ | Movement & Polish (tai chi, stretching, onboarding, help)|
| Phase 8A | ✅ | Activities Tracking (exercise logger with ratings) |
| Phase 8B | ✅ | Behavioral Experiments (test beliefs, track outcomes) |
| Phase 8C | ✅ | Anxiety Hierarchy (exposure therapy ladder) |

---

## Architecture Overview

### Routes
```
/                           Dashboard (mood, BP, activities summary)
/crisis                     Crisis flow (breathing → grounding)
/tools                      Tools hub
/tools/breathing            4-7-8 breathing timer
/tools/grounding            5-4-3-2-1 grounding exercise
/tools/cbt                  CBT tools hub
/tools/cbt/thought-record   New thought record (7 steps)
/tools/cbt/thought-record/[id]  Edit existing thought record
/tools/cbt/history          Thought records list
/tools/cbt/distortions      Cognitive distortions reference guide
/tools/cbt/experiment       Behavioral experiments hub
/tools/cbt/experiment/new   New experiment (4 steps)
/tools/cbt/experiment/[id]  Complete/view experiment
/tools/cbt/hierarchy        Anxiety hierarchy hub
/tools/cbt/hierarchy/new    New hierarchy item (4 steps)
/tools/cbt/hierarchy/[id]   Hierarchy item detail & progress
/tools/cbt/hierarchy/[id]/expose  Log exposure attempt
/tools/mindfulness          Mindfulness hub
/tools/mindfulness/timer    Meditation timer (3-20 min)
/tools/mindfulness/breath   Breath awareness practice (5 min)
/tools/mindfulness/body-scan Body scan meditation (5 or 15 min)
/tools/mindfulness/history  Mindfulness session history
/track                      Track hub
/track/mood                 Mood + anxiety logger
/track/bp                   Blood pressure logger
/track/activities           Activities logger (exercise tracking)
/track/activities/history   Activities history (filterable)
/plan                       Plan hub (today's progress, week stats)
/plan/today                 Daily activity planner
/plan/library               Activity library browser
/insights                   Insights dashboard (charts, trends, streaks)
/insights/export            Data export tool (CSV/JSON)
/settings                   Placeholder
```

### Component Structure
```
src/lib/components/
├── activities/      ActivityCard, ActivityLibrary, ActivityPlanner,
│                    ActivityLogger, ActivityHistory
├── breathing/       BreathingTimer, BreathingCircle
├── bp/              BPLogger
├── cbt/             ThoughtRecordForm, ThoughtRecordHistory, DistortionReference,
│                    BehavioralExperimentForm, ExperimentCompletionForm,
│                    BehavioralExperimentHistory, HierarchyItemForm, HierarchyList,
│                    HierarchyDetail, ExposureLogForm, ExposureChart
├── common/          Navigation, ProgressSteps, CharacterCounter, IntensitySlider,
│                    EmotionSelect, DistortionChecklist
├── crisis/          AnxietyHelpButton
├── grounding/       Grounding54321, GroundingStep
├── insights/        DateRangeSelector, MoodTrendChart, ActivityCompletionChart,
│                    MindfulnessChart, BPTrendChart, WeeklyInsights,
│                    MoodCorrelations, StreakTracker
├── mindfulness/     MindfulnessTimer, MindfulnessDisplay, SessionTracker,
│                    BreathAwareness, BodyScan, MindfulnessHistory
└── mood/            MoodLogger, MoodSlider
```

### Database (IndexedDB via Dexie)
- **Types**: `src/lib/db/types.ts` - All interfaces
- **DB**: `src/lib/db/index.ts` - Dexie instance + helpers
- **Active tables**: moodLogs, bpReadings, plannedActivities, activityLibrary, thoughtRecords, mindfulnessSessions, activities, behavioralExperiments, anxietyHierarchy
- **30 pre-seeded activities** across 6 categories
- **Query helpers**:
  - Mood/BP: getMoodLogs(), getBPReadings()
  - Planning: getPlannedActivities(), getActivityLibraryByCategory()
  - CBT: getThoughtRecords(), getThoughtRecordStats(), getIncompleteThoughtRecords()
  - Mindfulness: getMindfulnessSessions(), getMindfulnessMinutes()
  - Activities: getActivities(), getRecentActivities(), getActivityStats()
  - Experiments: getBehavioralExperiments(), getIncompleteExperiments(), getExperimentById(), getExperimentStats()
  - Hierarchy: getAnxietyHierarchy(), getHierarchyItemById(), addExposureAttempt(), getHierarchyStats()

---

## Design Rules (MANDATORY)

### Accessibility (Non-Negotiable)
- **44px minimum** touch targets for all interactive elements
- **16px+ fonts** - no small text
- **WCAG AA contrast** - 4.5:1 minimum
- **Focus indicators** - visible ring on all focusable elements
- **Reduced motion** - respect `prefers-reduced-motion`

### UX for ADHD/Anxiety
- **One task per screen** - never multiple competing actions
- **Auto-save everything** - no lost work ever
- **Exit always available** - can leave any flow anytime
- **No guilt language** - never "you only did X" or "don't forget"
- **Neutral tone** - factual, not patronizing ("3 completed" not "Great job!")

### GitHub Pages Routing
- Base path is `/myndness` (configured in `svelte.config.js`)
- **ALL links must use `{base}` from `$app/paths`**
- 404.html handles SPA routing via sessionStorage trick
- Local preview: `http://localhost:4173/myndness/`

---

## Key Files

| File | Purpose |
|------|---------|
| `USER_GUIDE.md` | Complete user guide for all features |
| `docs-reference/IMPLEMENTATION_GUIDE.md` | Full 7-phase implementation plan |
| `docs-reference/mental_wellness_architecture_analysis.md` | Clinical context, user profile |
| `docs-reference/PHASE_8B_COLDSTART.md` | Phase 8B cold start instructions |
| `docs-reference/PHASE_8C_COLDSTART.md` | Phase 8C cold start instructions |
| `/home/dad/.claude/plans/composed-enchanting-abelson.md` | Phase 8 session status |
| `src/lib/db/types.ts` | All TypeScript interfaces |
| `src/lib/db/index.ts` | Database + query helpers |
| `svelte.config.js` | Base path + adapter config |
| `tailwind.config.js` | Color palette, touch targets |

---

## User Context (Critical)

```
Age: 64 years old
Diagnoses: ADHD-Inattentive, GAD, MDD (moderate), OCD (mild)
Medical: Has pacemaker, monitors blood pressure
         Anxiety causes BP spikes (116/76 → 135/88)
Cognitive: High average IQ (115), normal processing speed (94)
Social: Introverted - NO social features wanted
Background: Military - needs structure
```

**Design implications:**
- Large touch targets (age + potential tremor during anxiety)
- BP tracking is clinically important (pacemaker monitoring)
- Structured approach (military background)
- Visual over text (high perceptual reasoning)
- No social features (introverted preference)

---

## Phase 8 Implementation (Complete)

### Phase 8A: Activities Tracking ✅ COMPLETE
- **Routes**: `/track/activities`, `/track/activities/history`
- **Components**: `ActivityLogger.svelte`, `ActivityHistory.svelte`
- **Features**:
  - Log exercises: type, duration (1-300 min), intensity (light/moderate/vigorous)
  - Optional ratings: enjoyment (0-10), mastery (0-10)
  - Optional details: equipment, location, notes (max 200 chars)
  - Explicit-save pattern with success view
  - History: last 90 days, filterable by type, date-grouped
- **Database**: `activities` table, helpers: getActivities(), getRecentActivities(), getActivityStats()
- **Accessibility**: 44px touch targets, custom range inputs with show/hide pattern for optional ratings

### Phase 8B: Behavioral Experiments ✅ COMPLETE
- **Routes**: `/tools/cbt/experiment` (hub), `/tools/cbt/experiment/new`, `/tools/cbt/experiment/[id]`
- **Components**: BehavioralExperimentForm (multi-step), ExperimentCompletionForm, BehavioralExperimentHistory
- **Features**:
  - 4-step form: Identify belief → Design experiment → Make prediction → Schedule (optional)
  - Auto-save with draft resume (< 24h)
  - Track belief strength before/after (0-100 scale)
  - Optional link to planned activities
  - Visual before → after comparison on completion
- **Pattern**: Multi-step auto-save (like ThoughtRecordForm)
- **Database**: `behavioralExperiments` table with helpers for incomplete tracking

### Phase 8C: Anxiety Hierarchy ✅ COMPLETE
- **Routes**: `/tools/cbt/hierarchy`, `/tools/cbt/hierarchy/new`, `/tools/cbt/hierarchy/[id]`, `/tools/cbt/hierarchy/[id]/expose`
- **Components**: HierarchyItemForm, HierarchyList, HierarchyDetail, ExposureLogForm, ExposureChart
- **Features**:
  - Create fear ladder ranked by SUDS (Subjective Units of Distress 0-100)
  - 4-step item creation: Describe fear → Category → Current distress → Target goal
  - Log exposure attempts: distress before/during/after + duration + notes
  - Chart.js visualization showing habituation over time (three lines)
  - Progress tracking with color-coded distress indicators (green/amber/red)
  - Mark items complete when target reached
  - Filterable list: All / Not Started / In Progress / Completed
- **Pattern**: Hybrid (create=multi-step auto-save, log exposure=explicit save)
- **Database**: `anxietyHierarchy` table with nested `exposureAttempts` array
- **Critical**: Uses `addExposureAttempt()` helper to handle Svelte 5 proxy array spreading

### Future Features (Post-Phase 8)
1. **Anxiety Episodes Tracking**:
   - Interface exists in `db/types.ts` as `AnxietyEpisode`
   - Detailed episode logging with symptoms, interventions, BP correlation
   - Duration tracking, peak anxiety level, effectiveness ratings
   - Currently not accessible from UI

2. **Enhanced Settings**:
   - Basic settings implemented in Phase 7
   - Advanced features (backup frequency, weekly goals) for later


---

## Known Issues & Solutions

### IndexedDB + Svelte 5 Proxies
**Problem**: Svelte 5's `$state()` creates proxy objects that can't be cloned by IndexedDB
**Error**: `DataCloneError: Failed to execute 'add' on 'IDBObjectStore'`
**Solution**: Convert proxy arrays to plain arrays before saving:
```typescript
// ❌ Don't do this
await db.table.add({ items: formData.items });

// ✅ Do this instead
await db.table.add({ items: [...formData.items] });
```

### Dynamic Routes & Prerendering
**Problem**: Dynamic routes like `[id]` can't be prerendered (GitHub Pages static site)
**Solution**: Add `+page.ts` with `export const prerender = false;` to dynamic route folders

---

## Testing Checklist

### Before Committing
- [ ] `npm run build` succeeds without errors
- [ ] All links use `{base}` prefix
- [ ] Touch targets are 44px minimum
- [ ] Auto-save works (check IndexedDB in DevTools)
- [ ] Works offline (test with DevTools Network → Offline)
- [ ] No guilt language in UI text

### After Deploying
- [ ] Live site loads at https://greenwh.github.io/myndness/
- [ ] Deep links work (e.g., /myndness/plan/today)
- [ ] PWA installable on mobile
