# Myndness - Mental Wellness PWA

---

## 🚀 **COLD START - READ THIS FIRST**

**Current Status:** Phase 6 Complete (Insights & Reporting)
**Next Phase:** Phase 7 - Movement & Polish (tai chi, stretching, onboarding, accessibility audit)
**Last Updated:** 2026-01-18

### Quick Resume Instructions
1. **Check live site**: https://greenwh.github.io/myndness/ (verify Phase 6 Insights features work)
2. **Read implementation plan**: `cat docs-reference/IMPLEMENTATION_GUIDE.md` (Phase 7 details)
3. **Start dev server**: `npm run dev` (access at localhost:5173/myndness/)
4. **Review user context below** - 64yo with ADHD, GAD, MDD, pacemaker (accessibility critical)

### What Just Got Built (Phase 6)
✅ **Insights & Reporting** - Data visualization and export system
- **Interactive Charts** (Chart.js with accessibility features):
  - Mood & Anxiety Trends: Dual-line chart with daily aggregated data
  - Activity Completion: Horizontal bar chart by category
  - Mindfulness Practice: Doughnut chart + stats cards (sessions, minutes, avg duration, streak)
  - Blood Pressure Trends: Dual-line chart with anxiety-related markers
  - All charts: 44px touch targets, reduced motion support, color-blind safe palette
- **Insights Dashboard**:
  - Weekly summary cards with neutral tone (no guilt language)
  - Activity impact on mood (before/after analysis)
  - Streak tracker (consecutive days with mindfulness/activities)
  - Date range selector (7d, 30d, 90d, all time)
- **Data Export**:
  - CSV export (multiple files, one per data type)
  - JSON export (single structured file with metadata)
  - Client-side processing (privacy-first, no server upload)
  - Selective export (choose which data types to include)
- **Routes**: `/insights`, `/insights/export`
- **Bundle size**: Chart.js adds ~170KB (acceptable for feature value)

---

## Cold Start Instructions

**Start here when resuming development on this project.**

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

## Project Status (Phases 0-6 Complete)

| Phase | Status | Description |
|-------|--------|-------------|
| Phase 0 | ✅ | SvelteKit scaffold, PWA, GitHub Pages |
| Phase 1 | ✅ | Crisis tools (4-7-8 breathing, 5-4-3-2-1 grounding) |
| Phase 2 | ✅ | Core tracking (mood, BP, dashboard) |
| Phase 3 | ✅ | Behavioral Activation (activity planner) |
| Phase 4 | ✅ | CBT Tools (thought records, distortions) |
| Phase 5 | ✅ | Mindfulness (meditation timer, guided practices, history) |
| Phase 6 | ✅ | **Insights & Reporting (charts, trends, export)** - JUST COMPLETED |
| Phase 7 | 🔜 | **Movement & Polish (tai chi, stretching, onboarding, help)** - NEXT |

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

## What's Next (Phase 7: Movement & Polish)

### Overview
Phase 7 focuses on gentle movement resources and final app polish. This phase prepares the app for long-term use with onboarding, help documentation, and a comprehensive accessibility audit.

### Components to Build

1. **Movement Library** (`/tools/movement` route):
   - `TaiChiLibrary.svelte` - Curated YouTube embeds (5-10 min beginner-friendly tai chi)
   - `StretchingRoutines.svelte` - Links to gentle stretching resources
   - **Clinical safety**: All videos vetted for pacemaker users (no intense cardio, avoid chest focus)
   - Categories: Morning routine, Evening wind-down, Seated stretches, Standing balance

2. **Movement Prompts** (integrated into existing pages):
   - `MovementReminder.svelte` - Gentle suggestions to stand/stretch
   - Trigger: Every 60-90 minutes of app usage
   - Dismissible, non-intrusive (small banner at top)
   - Neutral tone: "Time for a movement break?" (no guilt)

3. **Reminder/Notification System**:
   - Morning check-in notification (optional, user-configured time)
   - Evening review notification (optional, user-configured time)
   - Activity reminder (1 hour before planned activity time)
   - Uses Web Notifications API (requires user permission)
   - All notifications toggleable in Settings

4. **Onboarding Flow** (`/onboarding` route):
   - Welcome screen with app purpose
   - Optional profile setup (age, conditions, pacemaker flag)
   - Accessibility preferences (font size, high contrast, reduced motion)
   - Notification permissions request
   - Quick tour of main features (crisis tools, tracking, planning)
   - Skippable but encourages completion

5. **Help/Documentation System**:
   - `/help` route with FAQ and feature guides
   - Inline help tooltips (? icon) on complex features
   - Video demos embedded for visual learners
   - Search functionality for help articles

6. **Accessibility Audit & Fixes**:
   - Keyboard navigation audit (ensure all features accessible via keyboard)
   - Screen reader testing (NVDA on Windows, VoiceOver on macOS)
   - Color contrast verification (all text meets WCAG AA 4.5:1)
   - Touch target verification (all buttons/links 44px minimum)
   - Focus indicator visibility (ensure :focus rings are visible)
   - Reduced motion compliance (check all animations respect preference)
   - Form label associations (ensure all inputs have proper labels)

7. **Settings Implementation** (`/settings` route):
   - Appearance: Theme (light/dark/system), Font size, High contrast, Reduced motion
   - Notifications: Enable/disable, Morning time, Evening time, Activity reminders
   - Data: Export data, Clear all data (with confirmation), About app
   - Profile: Age, Conditions (optional), Pacemaker flag

### Routes to Create
- `/tools/movement` - Movement library hub
- `/tools/movement/tai-chi` - Tai chi video library
- `/tools/movement/stretching` - Stretching routine links
- `/onboarding` - First-run onboarding flow
- `/help` - Help documentation and FAQ
- Update `/settings` - Implement actual settings (currently placeholder)

### Technical Considerations
- **YouTube embeds**: Use `youtube-nocookie.com` for privacy, lazy load iframes
- **Notifications**: Web Notifications API, graceful degradation if denied
- **Onboarding**: Track completion in IndexedDB, show once on first visit
- **Help search**: Simple client-side search (no external dependencies)
- **Settings persistence**: Store in IndexedDB `settings` table (already exists)

### Accessibility Audit Tools
- **Keyboard**: Tab through entire app, ensure all interactive elements reachable
- **Screen reader**: NVDA (free, Windows) or VoiceOver (built-in, macOS)
- **Color contrast**: Chrome DevTools Lighthouse audit, or WebAIM Contrast Checker
- **Touch targets**: Chrome DevTools mobile emulation, measure with ruler tool
- **Focus indicators**: Visual inspection, ensure :focus styles are visible
- **Reduced motion**: Test with browser setting enabled (`prefers-reduced-motion: reduce`)

### Movement Video Curation Guidelines
- **Duration**: 5-15 minutes (attention span friendly for ADHD)
- **Intensity**: Gentle, suitable for 64yo with pacemaker
- **Style**: Clear instruction, minimal music/distraction
- **Categories**:
  - Tai chi: Yang style 5-minute form, seated tai chi
  - Stretching: Neck/shoulders, lower back, legs, full body
  - Balance: Standing balance (near wall/chair), weight shifting
- **Safety**: Avoid high-intensity, avoid chest-focused exercises, emphasize breathing

### Design Patterns
- **Movement prompts**: Non-modal banner at top, easily dismissed, reappears after 24 hours
- **Onboarding**: Wizard-style multi-step flow, progress indicator, skip button always visible
- **Help articles**: Card-based layout, search box at top, category filters
- **Settings**: Grouped by category, toggle switches for booleans, clear labels

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
