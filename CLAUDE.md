# Myndness - Mental Wellness PWA

## Cold Start Instructions

**Start here when resuming development on this project.**

### Quick Context
- **What**: Mental wellness PWA for managing ADHD, GAD, MDD symptoms
- **User**: 64yo male with pacemaker, needs accessible design
- **Stack**: SvelteKit 2 + Svelte 5, Tailwind CSS, IndexedDB (Dexie), PWA
- **Live**: https://greenwh.github.io/myndness/
- **Status File**: `/home/dad/.claude/plans/eager-popping-manatee.md`

### Before Starting Work
1. Read the status file: `cat /home/dad/.claude/plans/eager-popping-manatee.md`
2. Check current phase and what's next
3. Review docs-reference/ for clinical context if needed

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

## Project Status (Phases 0-3 Complete)

| Phase | Status | Description |
|-------|--------|-------------|
| Phase 0 | ✅ | SvelteKit scaffold, PWA, GitHub Pages |
| Phase 1 | ✅ | Crisis tools (4-7-8 breathing, 5-4-3-2-1 grounding) |
| Phase 2 | ✅ | Core tracking (mood, BP, dashboard) |
| Phase 3 | ✅ | Behavioral Activation (activity planner) |
| Phase 4 | ❌ | CBT Tools (thought records, distortions) |
| Phase 5 | ❌ | Mindfulness (breath awareness, body scan) |
| Phase 6 | ❌ | Insights & Reporting (charts, export) |

---

## Architecture Overview

### Routes
```
/                    Dashboard (mood, BP, activities summary)
/crisis              Crisis flow (breathing → grounding)
/tools               Tools hub
/tools/breathing     4-7-8 breathing timer
/tools/grounding     5-4-3-2-1 grounding exercise
/track               Track hub
/track/mood          Mood + anxiety logger
/track/bp            Blood pressure logger
/plan                Plan hub (today's progress, week stats)
/plan/today          Daily activity planner
/plan/library        Activity library browser
/settings            Placeholder
```

### Component Structure
```
src/lib/components/
├── activities/      ActivityCard, ActivityLibrary, ActivityPlanner
├── breathing/       BreathingTimer, BreathingCircle
├── bp/              BPLogger
├── common/          Navigation
├── crisis/          AnxietyHelpButton
├── grounding/       Grounding54321, GroundingStep
└── mood/            MoodLogger, MoodSlider
```

### Database (IndexedDB via Dexie)
- **Types**: `src/lib/db/types.ts` - All interfaces
- **DB**: `src/lib/db/index.ts` - Dexie instance + helpers
- **Active tables**: moodLogs, bpReadings, plannedActivities, activityLibrary
- **30 pre-seeded activities** across 6 categories

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
| `docs-reference/IMPLEMENTATION_GUIDE.md` | Full 7-phase implementation plan |
| `docs-reference/mental_wellness_architecture_analysis.md` | Clinical context, user profile |
| `/home/dad/.claude/plans/eager-popping-manatee.md` | Current session status |
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

## What's Next (Phase 4: CBT Tools)

### Components to Build
1. `ThoughtRecord.svelte` - Multi-step thought record form
2. `DistortionChecklist.svelte` - 14 cognitive distortions
3. `BehavioralExperiment.svelte` - Test predictions
4. `AnxietyHierarchy.svelte` - Exposure ladder

### Routes to Create
- `/tools/cbt` - CBT tools hub
- `/tools/cbt/thought-record` - New thought record
- `/tools/cbt/history` - Past thought records
- `/tools/cbt/distortions` - Reference guide

### Database
- Types already exist in `types.ts` (ThoughtRecord, CognitiveDistortion, etc.)
- Tables already defined in `index.ts` (thoughtRecords, behavioralExperiments)

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
