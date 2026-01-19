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

## Project Status (Phases 0-6 Complete)

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
/tools/mindfulness          Mindfulness hub
/tools/mindfulness/timer    Meditation timer (3-20 min)
/tools/mindfulness/breath   Breath awareness practice (5 min)
/tools/mindfulness/body-scan Body scan meditation (5 or 15 min)
/tools/mindfulness/history  Mindfulness session history
/track                      Track hub
/track/mood                 Mood + anxiety logger
/track/bp                   Blood pressure logger
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
├── activities/      ActivityCard, ActivityLibrary, ActivityPlanner
├── breathing/       BreathingTimer, BreathingCircle
├── bp/              BPLogger
├── cbt/             ThoughtRecordForm, ThoughtRecordHistory, DistortionReference
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
- **Active tables**: moodLogs, bpReadings, plannedActivities, activityLibrary, thoughtRecords, mindfulnessSessions
- **30 pre-seeded activities** across 6 categories
- **Query helpers**: getMoodLogs(), getPlannedActivities(), getThoughtRecords(), getThoughtRecordStats(), getMindfulnessSessions(), getMindfulnessMinutes()

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

## Future Enhancements (Post-Phase 7)

The following features have placeholder UI ("Coming Soon") but are **NOT part of Phase 7**. They are designed in `db/types.ts` but not yet implemented. Consider these for Phase 8 or beyond:

### Advanced CBT Tools (Phase 8 candidate)
1. **Behavioral Experiments** (`/tools/cbt/experiment`):
   - Test beliefs with real-world experiments
   - Interface exists in `db/types.ts` as `BehavioralExperiment`
   - Tracks hypothesis → experiment → outcome → revised belief
   - Links to planned activities for execution

2. **Anxiety Hierarchy** (`/tools/cbt/hierarchy`):
   - Build exposure ladder to gradually face fears
   - Interface exists in `db/types.ts` as `AnxietyHierarchyItem`
   - Tracks SUDS ratings (0-100) before/during/after exposures
   - Progressive desensitization approach

### Additional Features (Future)
3. **Activities on Track Page**:
   - Currently shows "Coming Soon"
   - Unclear if this is duplicate of Plan page or different feature
   - May track completed activities separate from planned activities
   - Needs requirement clarification

4. **Anxiety Episodes Tracking**:
   - Interface exists in `db/types.ts` as `AnxietyEpisode`
   - Detailed episode logging with symptoms, interventions, BP correlation
   - Duration tracking, peak anxiety level, effectiveness ratings
   - Currently not accessible from UI

5. **Enhanced Settings**:
   - Will be partially implemented in Phase 7
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
