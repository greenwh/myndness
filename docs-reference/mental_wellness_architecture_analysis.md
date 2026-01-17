# Mental Wellness Companion App: Architecture Analysis & Recommendation

## Executive Summary

Based on my analysis of your psychological evaluation, conversation history, and the comprehensive spec, I recommend a **Progressive Web App (PWA) built with SvelteKit + IndexedDB** as the optimal architecture. This approach prioritizes privacy (local-first data), offline capability (critical for anxiety interventions), and accessibility—all essential for a 64-year-old user managing ADHD-Inattentive, GAD, MDD, and mild OCD without immediate medication.

---

## Part 1: Clinical Context Analysis

### Your Specific Diagnoses (from psych eval)

| Diagnosis | Severity | Key App Implications |
|-----------|----------|---------------------|
| **ADHD-Inattentive, Mild** | Mild | Need for structure, external reminders, minimal cognitive load, simple interfaces |
| **GAD (Generalized Anxiety Disorder)** | Not specified | Continuous worry management, breathing interventions, grounding techniques |
| **MDD, Recurrent Episode** | Moderate | Behavioral activation as primary intervention, mood tracking for patterns |
| **OCD, Mild** | Mild, Fair Insight | Thought records for obsessive concerns (daughters' wellbeing), exposure hierarchy |

### Clinical Strengths to Leverage

From your WAIS-IV results:
- **High Average IQ (115)**: You can handle sophisticated CBT tools if presented clearly
- **Strong Perceptual Reasoning (119)**: Visual representations (charts, animations) will be effective
- **High Average Working Memory (114)**: Can engage with multi-step exercises
- **Average Processing Speed (94)**: Interface should not rush; allow time for completion

### Key Clinical Priorities for Non-Medication Management

Based on evidence synthesis from my research:

1. **Behavioral Activation (BA)** — Most critical. Research shows BA is as effective as full CBT for depression and is particularly effective for older adults. A 2024 meta-analysis confirms BA increases engagement in rewarding activities and breaks the depression cycle.

2. **Mindfulness-Based Stress Reduction (MBSR)** — Meta-analyses show MBSR reduces office systolic BP by ~6.6 mmHg and diastolic by ~2.5 mmHg—relevant given your anxiety-related BP spikes (116/76 → 135/88). Also effective for worry and cognitive function in older adults.

3. **CBT Thought Records** — Essential for your obsessive concerns about your daughters and catastrophizing patterns identified in your MMPI-2.

4. **Grounding/Breathing** — Immediate intervention during anxiety episodes; research supports 4-7-8 breathing for vagal tone activation.

---

## Part 2: Terminology Definitions

### Clinical Terms Made Precise

**Mindfulness** (as used in this app context):
> The practice of intentionally directing attention to present-moment experience (sensations, thoughts, emotions) with an attitude of curiosity rather than judgment. In MBSR, this is operationalized through specific techniques: breath awareness (focusing on inhalation/exhalation sensations), body scan (systematically attending to physical sensations from feet to head), and noting (silently labeling experiences as "thinking," "feeling," "hearing").

**Behavioral Activation**:
> A structured approach where you identify activities that provide either pleasure (enjoyment) or mastery (sense of accomplishment), schedule them in advance, complete them regardless of initial mood state, and track their impact. The mechanism: depression reduces activity → reduced activity removes positive reinforcement → mood worsens. BA reverses this by systematically restoring activity-reward connections.

**Cognitive Behavioral Therapy (CBT)**:
> A structured psychotherapy that identifies the connections between situations, automatic thoughts, emotions, and behaviors. In app form, this means:
> - **Thought Records**: Capturing the situation → automatic thought → emotion → identifying distortions → generating balanced alternatives
> - **Behavioral Experiments**: Testing beliefs empirically rather than accepting them
> - **Exposure Hierarchy**: Gradual, planned confrontation with anxiety-producing situations

**Grounding Techniques**:
> Methods to interrupt dissociation or acute anxiety by forcing attention onto immediate sensory experience. The 5-4-3-2-1 technique systematically engages all five senses (5 things seen, 4 heard, 3 touched, 2 smelled, 1 tasted) to anchor consciousness in the present moment.

**Cognitive Distortions** (relevant to your profile):
> - *Catastrophizing*: Predicting the worst outcome (e.g., daughters unable to care for themselves)
> - *Mind-reading*: Assuming you know others' thoughts without evidence
> - *Should statements*: Rigid rules about how things must be
> - *All-or-nothing thinking*: Black-and-white evaluation without gradation

**Vagal Tone**:
> The activity level of the vagus nerve, which regulates heart rate, breathing, and the parasympathetic "rest and digest" system. Slow paced breathing (typically 6 breaths/minute) stimulates vagal activity, lowering heart rate and blood pressure. This is why breathing exercises work physiologically, not just psychologically.

---

## Part 3: PWA Recommendation & Justification

### Why PWA Over Tauri

| Factor | PWA | Tauri Desktop |
|--------|-----|---------------|
| **Offline capability** | ✅ Service workers + IndexedDB | ✅ Native filesystem |
| **Privacy (local-only)** | ✅ IndexedDB never leaves device | ✅ SQLite on local disk |
| **Cross-device access** | ✅ Any device with browser | ❌ One computer only |
| **Installation** | ✅ Optional, no app store | ❌ Manual install required |
| **Anxiety access** | ✅ Phone in pocket, instant | ❌ Must be at desktop |
| **BP tracking location** | ✅ Wherever you measure BP | ❌ Desktop only |
| **Development velocity** | ✅ Single codebase | ⚠️ Rust + web hybrid |
| **Future therapy sharing** | ✅ Export/share easily | ⚠️ File-based sharing |

**Critical insight**: Anxiety episodes don't wait for you to be at your desktop. A PWA on your phone gives you instant access to breathing exercises when you need them.

### iOS Considerations

iOS Safari has PWA limitations (50MB storage cap, 7-day cache retention). However:
- Your data will likely stay well under 50MB (text-based)
- Regular app usage resets the cache timer
- Core functionality (breathing timers, grounding) works without storage
- Can export data periodically as backup

---

## Part 4: Recommended Technology Stack

### Core Stack

```
┌─────────────────────────────────────────────────────────────┐
│                    SvelteKit PWA                            │
├─────────────────────────────────────────────────────────────┤
│  Frontend: Svelte 5 (runes) + SvelteKit                     │
│  Styling: Tailwind CSS + Custom design system               │
│  State: Svelte stores + IndexedDB (Dexie.js wrapper)        │
│  Charts: Chart.js or Lightweight Apache ECharts             │
│  Audio: Native HTML5 Audio API                              │
│  PWA: @vite-pwa/sveltekit                                   │
│  PDF Export: jsPDF                                          │
│  Animations: Svelte transitions + CSS animations            │
└─────────────────────────────────────────────────────────────┘
```

### Why SvelteKit?

1. **Simplicity**: Svelte compiles to vanilla JS—no virtual DOM overhead
2. **Built-in PWA support**: Native service worker integration
3. **File-based routing**: Matches your mental model from database work
4. **Small bundle size**: Fast loading even on slow connections
5. **Excellent accessibility primitives**: Essential for 64+ users

### Why IndexedDB (via Dexie.js)?

- **Local-only by default**: Data never leaves your device
- **Structured storage**: Supports your relational mental model
- **Large capacity**: Chrome allows 60% of disk space
- **Async/non-blocking**: Won't freeze UI during writes
- **Dexie.js**: Provides a clean Promise-based API, like a mini ORM

---

## Part 5: Revised Feature Priority Matrix

Based on clinical evidence and your specific diagnoses:

### Tier 1: MVP (Weeks 1-3) — Foundation + Immediate Crisis Tools

| Feature | Clinical Rationale | Technical Complexity |
|---------|-------------------|---------------------|
| **4-7-8 Breathing Timer** | Immediate vagal activation during anxiety | Low |
| **5-4-3-2-1 Grounding** | Dissociation/anxiety interruption | Low |
| **Daily Mood Log** (1-10 + anxiety 0-10) | Baseline tracking | Low |
| **BP Entry** (with anxiety flag) | Monitor cardiac correlation | Low |
| **PWA Shell** (offline, installable) | Always-available access | Medium |
| **Simple Dashboard** | Single entry point | Medium |

### Tier 2: Core Therapy Tools (Weeks 4-6) — BA + CBT

| Feature | Clinical Rationale | Technical Complexity |
|---------|-------------------|---------------------|
| **Behavioral Activation Planner** | Primary depression intervention | Medium |
| **Activity Library** (with enjoyment/mastery) | BA reward tracking | Medium |
| **Thought Record (simplified)** | OCD/worry intervention | Medium |
| **Cognitive Distortion Reference** | Psychoeducation | Low |
| **Activity-Mood Correlation View** | Reinforce BA benefits | Medium |

### Tier 3: Mindfulness + Advanced CBT (Weeks 7-9)

| Feature | Clinical Rationale | Technical Complexity |
|---------|-------------------|---------------------|
| **Guided Body Scan** (text + optional audio) | MBSR core practice | Medium |
| **Breath Awareness Timer** | Mindfulness practice | Low |
| **Anxiety Hierarchy Builder** | Exposure prep for OCD | Medium |
| **Behavioral Experiments** | Test catastrophic beliefs | Medium |
| **Weekly Insights Dashboard** | Pattern recognition | High |

### Tier 4: Polish + Movement (Weeks 10-12)

| Feature | Clinical Rationale | Technical Complexity |
|---------|-------------------|---------------------|
| **Tai Chi Video Integration** | Exercise + mindfulness | Low |
| **PDF Report Generator** | Provider communication | High |
| **Reminder System** | ADHD accommodation | Medium |
| **Streak/Progress Tracking** | Motivation | Low |

### Explicitly Deprioritized

- **Bluetooth BP**: Future enhancement, adds complexity
- **AI Insights**: Can add later, not evidence-based MVP essential
- **Social Features**: Privacy risk, not aligned with your social introversion
- **Medication Tracking**: You're exploring non-med management first

---

## Part 6: Revised Data Model

### IndexedDB Schema (Dexie.js)

```javascript
// db.js
import Dexie from 'dexie';

export const db = new Dexie('MentalWellnessDB');

db.version(1).stores({
  // Core tracking
  moodLogs: '++id, date, timestamp',
  anxietyEpisodes: '++id, startTime, endTime, date',
  
  // Health metrics
  bpReadings: '++id, date, timestamp, linkedEpisodeId',
  activities: '++id, date, type, completed',
  
  // CBT tools
  thoughtRecords: '++id, date, situation',
  behavioralExperiments: '++id, date, hypothesis, completed',
  anxietyHierarchy: '++id, situation, distressRating',
  
  // Behavioral Activation
  plannedActivities: '++id, date, timeBlock, completed',
  activityLibrary: '++id, name, category',
  
  // Mindfulness
  mindfulnessSessions: '++id, date, practiceType',
  
  // User data
  userProfile: '++id',
  settings: '++id'
});
```

### Key Data Structures

```typescript
// Types for clarity
interface MoodLog {
  id?: number;
  date: string;          // ISO date
  timestamp: string;     // ISO datetime
  mood: number;          // 1-10
  anxiety: number;       // 0-10
  notes?: string;
  isAnxietyEpisode: boolean;
  linkedBpId?: number;
}

interface AnxietyEpisode {
  id?: number;
  startTime: string;
  endTime?: string;
  durationMinutes?: number;
  symptoms: string[];    // ['racing_thoughts', 'chest_tightness', ...]
  triggers?: string;
  interventionsUsed: string[];  // ['breathing_478', 'grounding_54321']
  interventionEffectiveness: Record<string, number>; // {breathing_478: 7}
  bpDuringEpisode?: { systolic: number; diastolic: number; hr?: number }[];
  postEpisodeMood?: number;
}

interface ThoughtRecord {
  id?: number;
  date: string;
  situation: string;           // What happened (200 char)
  automaticThought: string;    // What went through your mind
  emotion: string;             // anxious, sad, angry, etc.
  emotionIntensity: number;    // 0-100
  distortions: string[];       // Selected from checklist
  evidenceFor: string;
  evidenceAgainst: string;
  balancedThought: string;
  outcomeIntensity: number;    // 0-100 (re-rating)
}

interface PlannedActivity {
  id?: number;
  date: string;
  activity: string;
  category: 'social' | 'creative' | 'physical' | 'learning' | 'mastery' | 'pleasure';
  timeBlock: 'morning' | 'afternoon' | 'evening';
  completed: boolean;
  enjoyment?: number;     // 0-10
  mastery?: number;       // 0-10
  moodBefore?: number;
  moodAfter?: number;
}
```

---

## Part 7: UI/UX Architecture

### Design Philosophy for Your Profile

Based on your psych eval findings:
- **Social introversion**: No social features, no sharing pressure
- **ADHD-Inattentive**: Minimal cognitive load, one task per screen
- **Processing speed (average)**: Allow time, no rushing animations
- **High perceptual reasoning**: Visual charts will be effective

### Accessibility Requirements

```css
/* Base typography - 16pt minimum, scalable */
:root {
  --font-size-base: 1rem;      /* 16px */
  --font-size-lg: 1.25rem;     /* 20px */
  --font-size-xl: 1.5rem;      /* 24px */
  --font-size-xxl: 2rem;       /* 32px for headings */
  
  /* High contrast colors */
  --color-text: #1a1a2e;
  --color-bg: #fafaf9;
  --color-primary: #2563eb;
  --color-success: #16a34a;
  --color-warning: #ca8a04;
  --color-danger: #dc2626;
  
  /* Touch targets - minimum 44x44px */
  --touch-target-min: 44px;
  
  /* Spacing - generous for readability */
  --spacing-unit: 8px;
}

/* Reduced motion for those who prefer it */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

### Navigation Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      DASHBOARD                               │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │
│  │   Today's   │  │   Quick     │  │   ANXIETY HELP      │  │
│  │   Mood      │  │   Stats     │  │   (Large Red Btn)   │  │
│  └─────────────┘  └─────────────┘  └─────────────────────┘  │
│  ┌─────────────────────────────────────────────────────────┐│
│  │              Today's Planned Activities                 ││
│  │  [ ] Morning tai chi                                    ││
│  │  [ ] Call daughter                                      ││
│  │  [✓] Cycling (30 min) — Enjoyment: 7, Mastery: 6       ││
│  └─────────────────────────────────────────────────────────┘│
├─────────────────────────────────────────────────────────────┤
│  [Track]    [Plan]    [Tools]    [Insights]    [Settings]   │
└─────────────────────────────────────────────────────────────┘

Track Section:
├── Log Mood & Anxiety
├── Log BP Reading
├── Log Activity
└── Log Anxiety Episode

Plan Section (Behavioral Activation):
├── Today's Plan
├── Activity Library
├── Weekly Schedule
└── Suggestions

Tools Section:
├── Breathing Exercises
│   ├── 4-7-8 Breathing
│   ├── Box Breathing
│   └── Paced Breathing
├── Grounding
│   ├── 5-4-3-2-1
│   └── Body Scan Quick
├── CBT Tools
│   ├── Thought Record
│   ├── Behavioral Experiment
│   └── Anxiety Hierarchy
└── Mindfulness
    ├── Breath Awareness (2/5/10 min)
    ├── Body Scan (5/10 min)
    └── Quick Breaks

Insights Section:
├── Mood Trends
├── Activity Impact
├── BP Correlation
├── Episode Patterns
└── Export Report

Settings:
├── Profile
├── Goals & Reminders
├── Appearance (font size, contrast)
└── Data Management
```

### Emergency Anxiety Protocol Flow

```
[ANXIETY HELP Button Tapped]
         │
         ▼
┌─────────────────────────────┐
│   How intense? (1-10)       │
│   [Quick slider]            │
│                             │
│   [Skip → Go to Breathing]  │
└─────────────────────────────┘
         │
         ▼
┌─────────────────────────────┐
│   4-7-8 BREATHING           │
│   ┌─────────────────────┐   │
│   │    ●                │   │  ← Animated circle
│   │   (expanding)       │   │
│   │                     │   │
│   │   INHALE... 4       │   │
│   └─────────────────────┘   │
│                             │
│   Round 2 of 4              │
│                             │
│   [Done] [More Rounds]      │
└─────────────────────────────┘
         │
         ▼
┌─────────────────────────────┐
│   Feeling better?           │
│                             │
│   [Yes, I'm done]           │
│   [Try Grounding]           │
│   [Try Mindfulness]         │
│   [Log this Episode]        │
└─────────────────────────────┘
```

---

## Part 8: Implementation Strategy

### Phase 1: Scaffold + Crisis Tools (Week 1-2)

```bash
# Project setup
npm create svelte@latest mental-wellness-pwa
cd mental-wellness-pwa
npm install

# Core dependencies
npm install dexie                    # IndexedDB wrapper
npm install @vite-pwa/sveltekit -D   # PWA support
npm install tailwindcss -D           # Styling
npm install chart.js                 # Visualization
npm install date-fns                 # Date handling
```

**Deliverables:**
- PWA shell (manifest, service worker, offline page)
- Dashboard layout with navigation
- 4-7-8 breathing timer with animation
- 5-4-3-2-1 grounding flow
- Basic mood log form
- IndexedDB initialization

### Phase 2: Core Tracking + BA (Week 3-4)

**Deliverables:**
- Mood log with anxiety scale
- BP entry form with anxiety episode flag
- Activity logging (type, duration, enjoyment/mastery)
- Behavioral Activation planner
- Activity library with categories
- Activity completion tracking
- Basic mood trend chart

### Phase 3: CBT Tools (Week 5-6)

**Deliverables:**
- Thought record form with cognitive distortions checklist
- Thought record history/review
- Behavioral experiments module
- Anxiety hierarchy builder
- Activity-mood correlation chart

### Phase 4: Mindfulness + Refinement (Week 7-8)

**Deliverables:**
- Breath awareness timer (2/5/10 min)
- Body scan guided text (3 min quick version)
- Mindfulness session logging
- Streak tracking
- Weekly insights dashboard
- Basic pattern detection

### Phase 5: Movement + Reporting (Week 9-10)

**Deliverables:**
- Tai chi video library (YouTube embeds)
- Gentle stretching routines
- PDF report generation
- Data export (CSV, JSON)
- Final polish and accessibility audit

---

## Part 9: Key Technical Decisions

### Offline-First Data Flow

```javascript
// Example: Logging mood with offline support
async function logMood(moodData) {
  // Always write to IndexedDB first
  const id = await db.moodLogs.add({
    ...moodData,
    timestamp: new Date().toISOString(),
    synced: false
  });
  
  // UI updates immediately from local data
  return id;
  
  // No server sync needed - pure local storage
}

// Service worker caches app shell for offline access
// See SvelteKit service worker docs for implementation
```

### Breathing Animation Strategy

```svelte
<!-- BreathingTimer.svelte -->
<script>
  let phase = 'inhale'; // 'inhale' | 'hold' | 'exhale'
  let count = 0;
  let round = 1;
  
  const PHASES = {
    inhale: { duration: 4, next: 'hold' },
    hold: { duration: 7, next: 'exhale' },
    exhale: { duration: 8, next: 'inhale' }
  };
</script>

<div class="breathing-container">
  <div 
    class="breath-circle"
    class:inhale={phase === 'inhale'}
    class:hold={phase === 'hold'}
    class:exhale={phase === 'exhale'}
  >
    <span class="phase-label">{phase.toUpperCase()}</span>
    <span class="count">{count}</span>
  </div>
</div>

<style>
  .breath-circle {
    width: 200px;
    height: 200px;
    border-radius: 50%;
    transition: transform ease-in-out;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
  
  .inhale {
    transform: scale(1.5);
    transition-duration: 4s;
    background: linear-gradient(135deg, #3b82f6, #60a5fa);
  }
  
  .hold {
    transform: scale(1.5);
    background: linear-gradient(135deg, #8b5cf6, #a78bfa);
  }
  
  .exhale {
    transform: scale(1);
    transition-duration: 8s;
    background: linear-gradient(135deg, #10b981, #34d399);
  }
</style>
```

### Chart Configuration for Accessibility

```javascript
// Accessible chart configuration
const moodChartConfig = {
  type: 'line',
  data: {
    labels: dates,
    datasets: [{
      label: 'Mood',
      data: moodScores,
      borderColor: '#2563eb',
      borderWidth: 3,  // Thick for visibility
      pointRadius: 6,  // Large points
      pointHoverRadius: 8
    }]
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          font: { size: 16 }  // Large legend text
        }
      }
    },
    scales: {
      y: {
        min: 1,
        max: 10,
        ticks: {
          font: { size: 14 },
          stepSize: 1
        }
      },
      x: {
        ticks: {
          font: { size: 14 }
        }
      }
    }
  }
};
```

---

## Part 10: Specific Recommendations Based on Your Profile

### For ADHD-Inattentive

1. **One task per screen**: Never show mood log + thought record on same view
2. **Progress indicators**: Always show "Step 2 of 4" type guidance
3. **Default values**: Pre-fill today's date, current time
4. **Auto-save**: Save after every field, not just on submit
5. **Gentle reminders**: Notification at consistent times (morning mood log, evening review)

### For GAD (Generalized Anxiety)

1. **Always-accessible breathing**: Floating "Calm" button on every screen
2. **No countdown pressure**: Breathing timer shows phase, not urgent countdown
3. **Validation, not alarm**: "Your BP is elevated" not "⚠️ HIGH BP ALERT"
4. **Exit always available**: Can leave any exercise at any time without guilt

### For MDD

1. **Behavioral Activation front and center**: This is your primary intervention
2. **Celebrate small wins**: Completion counts, not perfection
3. **Activity-mood connection visible**: Show correlation to reinforce behavior
4. **Low-effort entry options**: Quick "check off" for planned activities

### For OCD (mild, obsessive concerns about daughters)

1. **Thought records specifically for worry themes**: Track recurring patterns
2. **Evidence-based approach**: The "evidence for/against" structure helps externalize obsessive thoughts
3. **Behavioral experiments**: "What if I don't check on them for 24 hours?"
4. **Anxiety hierarchy for exposures**: Gradual approach to reducing checking behaviors

### For Cardiac Monitoring

1. **BP tracking with context**: Link readings to anxiety episodes
2. **Correlation view**: See if breathing exercises correlate with lower post-episode BP
3. **Report for cardiologist**: Exportable BP + anxiety data

---

## Part 11: What to Discuss with Professionals

When you do engage with therapy/psychiatry, this app provides:

### For a Therapist (CBT-focused)

- Completed thought records to review in session
- Behavioral activation data showing activity-mood patterns
- Anxiety hierarchy for structured exposure work
- Episode logs showing trigger patterns

### For a Psychiatrist

- Mood trend data (supports/contradicts medication need)
- Anxiety episode frequency and duration
- BP correlation with anxiety
- Sleep pattern data (if added)
- Response to non-medication interventions

### For Your Cardiologist/PCP

- BP readings with anxiety context
- Exercise compliance data
- Correlation between tai chi/exercise and BP stability

---

## Part 12: Risks and Mitigations

| Risk | Mitigation |
|------|------------|
| **iOS cache eviction (7 days)** | Regular use resets timer; export backup feature |
| **App becomes another source of anxiety** | No guilt language; optional everything; easy to pause |
| **Data loss** | Export to JSON/CSV; backup to files |
| **Feature overwhelm** | Phased release; hide unused features |
| **Replacing professional care** | Clear disclaimers; designed as supplement |
| **ADHD abandonment** | Gamification light (streaks); minimal friction |

---

## Conclusion and Next Steps

### Recommendation Summary

Build a **SvelteKit PWA** with:
- **Dexie.js/IndexedDB** for local-only storage
- **@vite-pwa/sveltekit** for offline capability
- **Tailwind CSS** with accessibility-first custom design
- **Chart.js** for mood visualization

### Priority Order

1. **Crisis tools first** (breathing, grounding)—usable within days
2. **Behavioral Activation next**—your primary depression intervention
3. **CBT tools third**—for worry/obsessive thoughts
4. **Mindfulness fourth**—supports everything else
5. **Movement last**—enhancement, not core

### Immediate Next Step

Would you like me to:

1. **Generate the project scaffold** with SvelteKit + PWA configuration?
2. **Build the 4-7-8 breathing component** as a standalone prototype?
3. **Create the complete IndexedDB schema** with Dexie.js?
4. **Design the dashboard wireframe** as an interactive prototype?

I recommend starting with **option 1** (scaffold) + **option 2** (breathing)—gives you a working crisis tool within the first day of development.

---

*Document generated: January 4, 2026*
*Based on clinical documents and evidence-based research*
