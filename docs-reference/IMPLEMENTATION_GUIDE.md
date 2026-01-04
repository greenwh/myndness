# Mental Wellness Companion PWA - Implementation Guide for Claude Code

## Overview

Build a Progressive Web App for a 64-year-old male managing:
- ADHD-Inattentive (Mild)
- Generalized Anxiety Disorder
- Major Depressive Disorder (Moderate, Recurrent)
- OCD (Mild, Fair Insight)

**Goal**: Non-medication symptom management through evidence-based interventions (Behavioral Activation, CBT, Mindfulness, Breathing exercises).

**Critical Context**: User has a pacemaker and monitors BP. Anxiety episodes cause BP spikes (116/76 → 135/88). App must be accessible during acute anxiety.

---

## Technology Stack

```
Framework:      SvelteKit 2.x with Svelte 5
Styling:        Tailwind CSS 3.x
Database:       IndexedDB via Dexie.js 4.x
PWA:            @vite-pwa/sveltekit
Charts:         Chart.js 4.x
Dates:          date-fns
PDF Export:     jsPDF (later phase)
```

---

## Project Setup Commands

```bash
# Create SvelteKit project
npm create svelte@latest mental-wellness-pwa
# Select: Skeleton project, TypeScript, ESLint, Prettier

cd mental-wellness-pwa

# Install dependencies
npm install dexie@4 chart.js date-fns

# Install dev dependencies
npm install -D @vite-pwa/sveltekit tailwindcss postcss autoprefixer

# Initialize Tailwind
npx tailwindcss init -p
```

---

## File Structure

```
mental-wellness-pwa/
├── src/
│   ├── lib/
│   │   ├── db/
│   │   │   ├── index.ts              # Dexie database initialization
│   │   │   ├── types.ts              # TypeScript interfaces
│   │   │   └── seed.ts               # Initial data (activity library)
│   │   ├── components/
│   │   │   ├── common/
│   │   │   │   ├── Button.svelte
│   │   │   │   ├── Card.svelte
│   │   │   │   ├── Modal.svelte
│   │   │   │   ├── Slider.svelte
│   │   │   │   ├── Toast.svelte
│   │   │   │   └── Navigation.svelte
│   │   │   ├── breathing/
│   │   │   │   ├── BreathingTimer.svelte
│   │   │   │   ├── BreathingCircle.svelte
│   │   │   │   └── BreathingSelector.svelte
│   │   │   ├── grounding/
│   │   │   │   ├── Grounding54321.svelte
│   │   │   │   └── GroundingStep.svelte
│   │   │   ├── mood/
│   │   │   │   ├── MoodLogger.svelte
│   │   │   │   ├── MoodSlider.svelte
│   │   │   │   └── MoodChart.svelte
│   │   │   ├── bp/
│   │   │   │   ├── BPLogger.svelte
│   │   │   │   └── BPChart.svelte
│   │   │   ├── activities/
│   │   │   │   ├── ActivityPlanner.svelte
│   │   │   │   ├── ActivityCard.svelte
│   │   │   │   ├── ActivityLibrary.svelte
│   │   │   │   └── ActivityLogger.svelte
│   │   │   ├── cbt/
│   │   │   │   ├── ThoughtRecord.svelte
│   │   │   │   ├── DistortionChecklist.svelte
│   │   │   │   ├── BehavioralExperiment.svelte
│   │   │   │   └── AnxietyHierarchy.svelte
│   │   │   ├── mindfulness/
│   │   │   │   ├── BreathAwareness.svelte
│   │   │   │   ├── BodyScan.svelte
│   │   │   │   └── SessionTimer.svelte
│   │   │   ├── insights/
│   │   │   │   ├── MoodTrends.svelte
│   │   │   │   ├── ActivityImpact.svelte
│   │   │   │   ├── BPCorrelation.svelte
│   │   │   │   └── WeeklySummary.svelte
│   │   │   └── crisis/
│   │   │       ├── AnxietyHelpButton.svelte
│   │   │       └── CrisisFlow.svelte
│   │   ├── stores/
│   │   │   ├── mood.ts
│   │   │   ├── activities.ts
│   │   │   ├── settings.ts
│   │   │   └── crisis.ts
│   │   └── utils/
│   │       ├── dateHelpers.ts
│   │       ├── statsHelpers.ts
│   │       └── exportHelpers.ts
│   ├── routes/
│   │   ├── +layout.svelte
│   │   ├── +page.svelte              # Dashboard
│   │   ├── track/
│   │   │   ├── +page.svelte          # Track hub
│   │   │   ├── mood/+page.svelte
│   │   │   ├── bp/+page.svelte
│   │   │   ├── activity/+page.svelte
│   │   │   └── episode/+page.svelte
│   │   ├── plan/
│   │   │   ├── +page.svelte          # BA planner
│   │   │   ├── today/+page.svelte
│   │   │   ├── library/+page.svelte
│   │   │   └── schedule/+page.svelte
│   │   ├── tools/
│   │   │   ├── +page.svelte          # Tools hub
│   │   │   ├── breathing/+page.svelte
│   │   │   ├── grounding/+page.svelte
│   │   │   ├── cbt/
│   │   │   │   ├── +page.svelte
│   │   │   │   ├── thought-record/+page.svelte
│   │   │   │   ├── experiment/+page.svelte
│   │   │   │   └── hierarchy/+page.svelte
│   │   │   └── mindfulness/+page.svelte
│   │   ├── insights/
│   │   │   ├── +page.svelte
│   │   │   └── export/+page.svelte
│   │   ├── settings/
│   │   │   └── +page.svelte
│   │   └── crisis/
│   │       └── +page.svelte          # Emergency anxiety flow
│   ├── service-worker.ts
│   └── app.html
├── static/
│   ├── icons/                        # PWA icons (192, 512)
│   ├── audio/                        # Optional chimes for breathing
│   └── manifest.webmanifest
├── svelte.config.js
├── vite.config.ts
├── tailwind.config.js
├── postcss.config.js
├── tsconfig.json
└── package.json
```

---

## Implementation Phases

### Phase 1: Foundation + Crisis Tools (Priority: HIGHEST)

**Goal**: Working PWA with breathing timer and grounding exercise within first session.

1. Project scaffold with SvelteKit
2. Tailwind configuration with accessibility tokens
3. PWA configuration (manifest, service worker)
4. IndexedDB setup with Dexie
5. Basic layout with navigation
6. **4-7-8 Breathing Timer** (animated circle, phase indicators)
7. **5-4-3-2-1 Grounding Exercise** (step-by-step flow)
8. Floating "Anxiety Help" button (always visible)
9. Crisis flow page connecting breathing → grounding

### Phase 2: Core Tracking

1. Mood logging (1-10 mood, 0-10 anxiety, notes)
2. BP logging (systolic, diastolic, optional HR, anxiety flag)
3. Activity logging (type, duration, enjoyment 0-10, mastery 0-10)
4. Anxiety episode logging (start/end, symptoms, triggers, interventions used)
5. Dashboard with today's entries
6. Basic mood trend chart (7-day line graph)

### Phase 3: Behavioral Activation

1. Activity library with categories (social, creative, physical, learning, mastery, pleasure)
2. Daily activity planner (morning/afternoon/evening blocks)
3. Activity suggestions based on library
4. Completion tracking with enjoyment/mastery ratings
5. Activity-mood correlation view
6. Weekly activity summary

### Phase 4: CBT Tools

1. Thought record form:
   - Situation (200 char)
   - Automatic thought
   - Emotion + intensity (0-100)
   - Cognitive distortions checklist
   - Evidence for/against
   - Balanced thought
   - Outcome intensity re-rating
2. Thought record history/review
3. Behavioral experiments module
4. Anxiety hierarchy builder
5. Distortion reference guide

### Phase 5: Mindfulness

1. Breath awareness timer (2, 5, 10 minute options)
2. Body scan guide (text-based, 3 and 10 minute versions)
3. Session logging with before/after mood
4. Streak tracking
5. Mindfulness session history

### Phase 6: Insights & Reporting

1. Weekly insights dashboard
2. Mood trends (7/14/30/90 days)
3. BP correlation with anxiety
4. Activity impact analysis
5. Pattern detection (day-of-week, time-of-day)
6. PDF report generation
7. CSV/JSON data export

### Phase 7: Movement & Polish

1. Tai chi video library (YouTube embeds)
2. Stretching routine links
3. Movement prompts (stand/stretch breaks)
4. Reminder/notification system
5. Accessibility audit and fixes
6. Onboarding flow
7. Help/documentation

---

## Critical Implementation Details

### Accessibility Requirements (NON-NEGOTIABLE)

```css
/* Minimum standards */
- Font size: 16px minimum, scalable to 24px
- Touch targets: 44x44px minimum
- Color contrast: WCAG AA (4.5:1 for text)
- Focus indicators: Visible, high contrast
- Reduced motion: Respect prefers-reduced-motion
- Screen reader: Proper ARIA labels
```

### User Profile Context

```typescript
// This user's specific characteristics to accommodate:
const USER_CONTEXT = {
  age: 64,
  diagnoses: ['ADHD-Inattentive', 'GAD', 'MDD', 'OCD-mild'],
  cognitiveProfile: {
    iq: 115, // High average
    processingSpeed: 94, // Average - don't rush
    workingMemory: 114, // High average
    perceptualReasoning: 119 // High average - visual works well
  },
  medical: {
    hasPacemaker: true,
    monitorsBloodPressure: true,
    anxietyBPRange: { baseline: '116/76', spike: '135/88' }
  },
  preferences: {
    socialInteraction: 'introverted', // No social features
    structure: 'high need', // Military background
    cognitiveLoad: 'minimize' // One task per screen
  }
};
```

### Design Language

```css
/* Color palette */
:root {
  /* Primary - calming blue */
  --color-primary-50: #eff6ff;
  --color-primary-100: #dbeafe;
  --color-primary-500: #3b82f6;
  --color-primary-600: #2563eb;
  --color-primary-700: #1d4ed8;
  
  /* Success - completion green */
  --color-success-500: #22c55e;
  --color-success-600: #16a34a;
  
  /* Warning - attention amber */
  --color-warning-500: #f59e0b;
  --color-warning-600: #d97706;
  
  /* Danger - crisis red (use sparingly) */
  --color-danger-500: #ef4444;
  --color-danger-600: #dc2626;
  
  /* Neutral */
  --color-gray-50: #fafafa;
  --color-gray-100: #f4f4f5;
  --color-gray-200: #e4e4e7;
  --color-gray-500: #71717a;
  --color-gray-700: #3f3f46;
  --color-gray-900: #18181b;
  
  /* Backgrounds */
  --bg-primary: #fafaf9;
  --bg-card: #ffffff;
  --bg-elevated: #ffffff;
  
  /* Text */
  --text-primary: #1a1a2e;
  --text-secondary: #52525b;
  --text-muted: #a1a1aa;
  
  /* Breathing exercise colors */
  --breath-inhale: linear-gradient(135deg, #3b82f6, #60a5fa);
  --breath-hold: linear-gradient(135deg, #8b5cf6, #a78bfa);
  --breath-exhale: linear-gradient(135deg, #10b981, #34d399);
  
  /* Spacing scale */
  --space-1: 0.25rem;
  --space-2: 0.5rem;
  --space-3: 0.75rem;
  --space-4: 1rem;
  --space-6: 1.5rem;
  --space-8: 2rem;
  --space-12: 3rem;
  
  /* Typography */
  --font-sans: 'Inter', system-ui, -apple-system, sans-serif;
  --font-size-sm: 0.875rem;
  --font-size-base: 1rem;
  --font-size-lg: 1.125rem;
  --font-size-xl: 1.25rem;
  --font-size-2xl: 1.5rem;
  --font-size-3xl: 1.875rem;
  
  /* Border radius */
  --radius-sm: 0.375rem;
  --radius-md: 0.5rem;
  --radius-lg: 0.75rem;
  --radius-xl: 1rem;
  --radius-full: 9999px;
  
  /* Shadows */
  --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1);
  --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1);
}
```

### Tone of Voice

```
DO:
- "You completed 3 activities today" (neutral, factual)
- "Would you like to try a breathing exercise?" (inviting)
- "Your BP reading has been saved" (confirmation)
- "Take your time" (supportive)

DON'T:
- "Great job!" (patronizing)
- "You only completed 1 activity" (guilt-inducing)
- "⚠️ HIGH ANXIETY DETECTED" (alarming)
- "Don't forget to..." (nagging)
```

---

## Key Component Specifications

### 4-7-8 Breathing Timer

```typescript
interface BreathingConfig {
  inhale: number;  // 4 seconds
  hold: number;    // 7 seconds
  exhale: number;  // 8 seconds
  rounds: number;  // Default 4, adjustable
}

// Animation: Circle expands during inhale, holds, contracts during exhale
// Audio: Optional gentle chime at phase transitions
// Visual: Phase name + countdown, round indicator
// Exit: Always allow early exit without judgment
```

### 5-4-3-2-1 Grounding

```typescript
interface GroundingStep {
  sense: 'see' | 'hear' | 'touch' | 'smell' | 'taste';
  count: 5 | 4 | 3 | 2 | 1;
  prompt: string;
  inputs: string[];  // User fills in what they notice
}

// Flow: One sense at a time, large text, calming colors
// Progress: Clear "Step 2 of 5" indicator
// Completion: Option to save as note or discard
```

### Mood Logger

```typescript
interface MoodEntry {
  id?: number;
  date: string;           // YYYY-MM-DD
  timestamp: string;      // ISO datetime
  mood: number;           // 1-10
  anxiety: number;        // 0-10
  notes?: string;         // Optional, 500 char max
  isAnxietyEpisode: boolean;
  linkedBpId?: number;    // If BP was taken at same time
}

// UI: Large sliders with labels at each end
// Mood: "Very Low" (1) to "Excellent" (10)
// Anxiety: "None" (0) to "Severe" (10)
// Auto-save after each field change
```

### Activity Planner (Behavioral Activation)

```typescript
interface PlannedActivity {
  id?: number;
  date: string;
  activity: string;
  category: 'social' | 'creative' | 'physical' | 'learning' | 'mastery' | 'pleasure';
  timeBlock: 'morning' | 'afternoon' | 'evening';
  completed: boolean;
  enjoyment?: number;     // 0-10, filled after completion
  mastery?: number;       // 0-10, filled after completion
  moodBefore?: number;
  moodAfter?: number;
  notes?: string;
}

// Pre-populated activity library with suggestions
// Quick-add from library or custom entry
// Easy check-off with optional ratings
```

### Thought Record (CBT)

```typescript
interface ThoughtRecord {
  id?: number;
  date: string;
  timestamp: string;
  
  // Step 1: Situation
  situation: string;              // What happened? (200 char)
  
  // Step 2: Automatic thought
  automaticThought: string;       // What went through your mind?
  
  // Step 3: Emotion
  emotion: 'anxious' | 'sad' | 'angry' | 'guilty' | 'ashamed' | 'frustrated' | 'hopeless' | 'other';
  emotionOther?: string;
  emotionIntensity: number;       // 0-100
  
  // Step 4: Distortions
  distortions: CognitiveDistortion[];
  
  // Step 5: Evidence
  evidenceFor: string;
  evidenceAgainst: string;
  
  // Step 6: Balanced thought
  balancedThought: string;
  
  // Step 7: Outcome
  outcomeIntensity: number;       // 0-100 re-rating
}

type CognitiveDistortion = 
  | 'all-or-nothing'      // Black and white thinking
  | 'overgeneralization'  // Always/never patterns
  | 'mental-filter'       // Focusing only on negatives
  | 'catastrophizing'     // Worst-case thinking
  | 'mind-reading'        // Assuming others' thoughts
  | 'should-statements'   // Rigid rules
  | 'personalization'     // Taking blame inappropriately
  | 'emotional-reasoning' // Feelings as facts
  | 'fortune-telling'     // Predicting negative outcomes
  | 'labeling';           // Global negative labels

// UI: Multi-step form, one section at a time
// Progress bar showing completion
// Save draft functionality
```

---

## Database Schema (Dexie.js)

```typescript
// src/lib/db/index.ts
import Dexie, { type Table } from 'dexie';
import type {
  MoodLog,
  AnxietyEpisode,
  BPReading,
  Activity,
  PlannedActivity,
  ActivityLibraryItem,
  ThoughtRecord,
  BehavioralExperiment,
  AnxietyHierarchyItem,
  MindfulnessSession,
  UserProfile,
  Settings
} from './types';

export class MentalWellnessDB extends Dexie {
  moodLogs!: Table<MoodLog>;
  anxietyEpisodes!: Table<AnxietyEpisode>;
  bpReadings!: Table<BPReading>;
  activities!: Table<Activity>;
  plannedActivities!: Table<PlannedActivity>;
  activityLibrary!: Table<ActivityLibraryItem>;
  thoughtRecords!: Table<ThoughtRecord>;
  behavioralExperiments!: Table<BehavioralExperiment>;
  anxietyHierarchy!: Table<AnxietyHierarchyItem>;
  mindfulnessSessions!: Table<MindfulnessSession>;
  userProfile!: Table<UserProfile>;
  settings!: Table<Settings>;

  constructor() {
    super('MentalWellnessDB');
    
    this.version(1).stores({
      moodLogs: '++id, date, timestamp',
      anxietyEpisodes: '++id, startTime, endTime, date',
      bpReadings: '++id, date, timestamp, linkedEpisodeId',
      activities: '++id, date, type, completed',
      plannedActivities: '++id, date, timeBlock, completed',
      activityLibrary: '++id, name, category',
      thoughtRecords: '++id, date, timestamp',
      behavioralExperiments: '++id, date, completed',
      anxietyHierarchy: '++id, situation, distressRating',
      mindfulnessSessions: '++id, date, practiceType',
      userProfile: '++id',
      settings: '++id'
    });
  }
}

export const db = new MentalWellnessDB();
```

---

## Service Worker Configuration

```typescript
// vite.config.ts
import { sveltekit } from '@sveltejs/kit/vite';
import { SvelteKitPWA } from '@vite-pwa/sveltekit';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [
    sveltekit(),
    SvelteKitPWA({
      srcDir: 'src',
      mode: 'production',
      strategies: 'generateSW',
      registerType: 'autoUpdate',
      manifest: {
        name: 'Mental Wellness Companion',
        short_name: 'Wellness',
        description: 'Personal mental wellness tracking and intervention tools',
        theme_color: '#2563eb',
        background_color: '#fafaf9',
        display: 'standalone',
        orientation: 'portrait',
        scope: '/',
        start_url: '/',
        icons: [
          {
            src: '/icons/icon-192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/icons/icon-512.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: '/icons/icon-512-maskable.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,webp,woff,woff2}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365 // 1 year
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          }
        ]
      }
    })
  ]
});
```

---

## Testing Checklist

### Accessibility
- [ ] All interactive elements have focus states
- [ ] Color contrast meets WCAG AA
- [ ] Touch targets are 44x44px minimum
- [ ] Screen reader announces all content
- [ ] Reduced motion preference respected
- [ ] Font sizes adjustable

### Offline Functionality
- [ ] App loads when offline
- [ ] All data persists in IndexedDB
- [ ] Breathing timer works offline
- [ ] Grounding exercise works offline
- [ ] Data entry works offline
- [ ] Charts render from cached data

### Crisis Tools
- [ ] Anxiety Help button visible on all screens
- [ ] Breathing timer animates smoothly
- [ ] Phase transitions are clear
- [ ] Can exit any exercise at any time
- [ ] Episode logging captures all data

### Data Integrity
- [ ] Mood logs save correctly
- [ ] BP readings save with anxiety flag
- [ ] Activities track enjoyment/mastery
- [ ] Thought records save all fields
- [ ] Export produces valid JSON/CSV

---

## Notes for Implementation

1. **Start with Phase 1 completely working** before moving to Phase 2. The user needs functional crisis tools immediately.

2. **Auto-save everything**. With ADHD, losing work is frustrating and demotivating.

3. **No guilt language**. This user has moderate depression - any hint of "you should have done more" is harmful.

4. **One task per screen**. The ADHD diagnosis means cognitive load must be minimized.

5. **Large touch targets**. User is 64 with potential motor considerations.

6. **Test offline early and often**. This must work without network.

7. **The breathing timer is the most important component**. It will be used during acute anxiety. It must be rock solid.

8. **BP correlation is clinically important**. The user has a pacemaker and their cardiologist may want this data.

9. **Social features are explicitly NOT wanted**. User is introverted per personality assessment.

10. **Export for healthcare providers** is important for eventual therapy/psychiatry integration.
