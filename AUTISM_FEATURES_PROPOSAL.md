# Autism-Friendly Feature Enhancements for Myndness

**Assessment Date:** 2026-01-28
**Purpose:** Expand myndness to better support autistic individuals (specifically mild autism diagnosis)
**Current Status:** Analysis and planning phase

---

## Table of Contents

1. [Overview](#overview)
2. [High-Priority Additions](#high-priority-additions)
3. [Medium-Priority Additions](#medium-priority-additions)
4. [Lower-Priority Features](#lower-priority-features)
5. [Implementation Considerations](#implementation-considerations)
6. [Recommended Phasing](#recommended-phasing)
7. [Database Schema Additions](#database-schema-additions)

---

## Overview

### Current Strengths (Already Autism-Friendly)

The existing myndness app already has many features that support autistic needs:

- ✅ **No social features** - respects introverted/asocial preferences
- ✅ **Local-only data** - privacy is critical for autistic community
- ✅ **Large touch targets (44px)** - supports motor coordination differences
- ✅ **Auto-save everything** - executive function support
- ✅ **Neutral, non-judgmental language** - no guilt or pressure
- ✅ **Visual over text** - preference for visual processing
- ✅ **Reduced motion support** - sensory accommodation
- ✅ **One task per screen** - reduces overwhelm
- ✅ **Exit always available** - control and autonomy

### Overlap: ADHD & Autism

Many existing features benefit both ADHD and autism:
- Structured routines (activity planner)
- Crisis tools (breathing, grounding)
- Executive function support (auto-save, simple flows)
- Anxiety management (thought records, hierarchy)

### Gap Analysis

What's missing for autism-specific needs:
- **Sensory processing** - overload tracking and management
- **Interoception** - body signal awareness training
- **Energy management** - capacity tracking (spoon theory)
- **Masking awareness** - social energy and recovery
- **Shutdown/meltdown** - crisis prevention and tracking
- **Routine rigidity** - transition support
- **Communication support** - nonverbal alternatives

---

## High-Priority Additions

### 1. Sensory Overload Tracker

**Purpose:** Track sensory experiences to identify triggers and patterns

**What to Track:**
- **Sensory load level:** 0-10 scale (similar to anxiety)
- **Specific triggers:**
  - Sound (volume, type, unexpectedness)
  - Light (brightness, flickering, glare)
  - Touch (textures, tags, tight clothing)
  - Smell (strong scents, chemicals, food)
  - Visual clutter (busy patterns, crowds)
  - Other (temperature, movement, taste)
- **Location/Environment:** Where overload occurred
- **Warning signs noticed:** What preceded the overload
- **Recovery strategies used:** What helped
- **Time to recover:** Minutes/hours
- **Optional notes:** Context (max 200 chars)

**UI Design:**
- Route: `/track/sensory`
- Similar to mood logger with slider + checkboxes
- Color-coded intensity: green (0-3), amber (4-6), red (7-10)
- History view: `/track/sensory/history` (last 90 days)

**Database Integration:**
```typescript
interface SensoryLog {
  id?: number;
  date: string;                    // YYYY-MM-DD
  timestamp: string;               // ISO datetime
  overloadLevel: number;           // 0-10
  triggers: SensoryTrigger[];
  location?: string;
  warningSigns?: string;
  recoveryStrategies?: string;
  recoveryMinutes?: number;
  notes?: string;                  // Max 200 chars
  linkedMoodId?: number;           // Link to mood log if applicable
}

type SensoryTrigger =
  | 'sound-volume'
  | 'sound-unexpected'
  | 'light-brightness'
  | 'light-flickering'
  | 'touch-texture'
  | 'touch-pressure'
  | 'smell-strong'
  | 'visual-clutter'
  | 'visual-crowds'
  | 'temperature'
  | 'other';
```

**Why It Helps:**
- Identifies environmental triggers
- Enables pattern recognition ("Grocery store at 5pm = overload")
- Supports proactive accommodation planning
- Links sensory state to mood/anxiety (insights)

**Insights Integration:**
- Sensory trend chart (7/14/30 days)
- Most common triggers
- Time-of-day patterns
- Correlation with mood/anxiety levels

---

### 2. Interoception Training Module

**Purpose:** Improve awareness of internal body signals (hunger, thirst, fatigue, bathroom needs)

**Features:**

**A. Scheduled Check-Ins**
- Customizable reminders (e.g., every 3 hours)
- Quick assessment form:
  - Hunger: 0-10
  - Thirst: 0-10
  - Energy/Fatigue: 0-10
  - Bathroom need: 0-10
  - Temperature comfort: 0-10
  - Pain/discomfort: 0-10
- Optional: "Where do you feel this?" (body map)

**B. Body Signal Library**
- Educational guide for each signal
- Visual aids (e.g., "Hunger feels like...")
- What to do at each level (3 = snack, 7 = meal)

**C. Pattern Tracking**
- Daily trends: "You're usually hungry at 11am"
- Missed signals: "Rated fatigue 8/10 three times this week at 2pm"
- Suggestions: "Consider afternoon rest period"

**UI Design:**
- Route: `/track/interoception`
- Quick check-in modal (accessible from dashboard)
- History: `/track/interoception/history`
- Body map: Visual SVG with clickable regions

**Database Schema:**
```typescript
interface InteroceptionCheck {
  id?: number;
  timestamp: string;               // ISO datetime
  hunger: number;                  // 0-10
  thirst: number;                  // 0-10
  energy: number;                  // 0-10 (reverse: 0=exhausted, 10=energized)
  bathroomNeed: number;            // 0-10
  temperature: number;             // 0-10 (0=too cold, 5=comfortable, 10=too hot)
  pain: number;                    // 0-10
  bodyRegions?: string[];          // Where sensations felt
  notes?: string;
}
```

**Why It Helps:**
- Alexithymia (difficulty identifying emotions) is common in autism
- Poor interoception leads to missing hunger, thirst, bathroom cues
- Explicit training improves self-awareness
- Prevents dehydration, hunger-related mood crashes, discomfort

---

### 3. Routine Visualizer & Transition Warnings

**Purpose:** Enhance existing activity planner with autism-specific routine support

**Additions to Existing Planner:**

**A. Visual Timeline**
- Horizontal timeline showing day structure (not just list)
- Color-coded blocks for different activity types
- Current time indicator
- Duration bars (proportional to activity length)

**B. Transition Countdowns**
- Configurable warnings: 15min, 10min, 5min before next activity
- Notification/banner: "Next activity (Shower) in 10 minutes"
- Option to extend current activity
- Visual countdown timer

**C. Routine Templates**
- Pre-built templates: Morning, Workday, Weekend, Pre-Sleep
- Save custom routines
- One-tap to load template into today's plan
- Duplicate previous day's routine

**D. Disruption Tracking**
- Log when routine is broken: "Skipped X because Y"
- Reduces anxiety about imperfect adherence
- Pattern tracking: "Most disruptions on Thursdays"
- No guilt language - factual recording

**UI Enhancements:**
- Route: `/plan/today` (enhance existing)
- New route: `/plan/templates`
- Settings: Configure transition warning timing

**Database Additions:**
```typescript
interface RoutineTemplate {
  id?: number;
  name: string;                    // "Morning Routine", "Workday"
  activities: {
    activityId: number;            // Reference to activity library
    timeSlot?: TimeSlot;
    duration: number;
  }[];
  tags?: string[];                 // "weekday", "weekend"
}

interface RoutineDisruption {
  id?: number;
  date: string;
  timestamp: string;
  plannedActivityId: number;
  reason: string;
  emotionalImpact?: number;        // 0-10 how distressing
}
```

**Why It Helps:**
- Predictability reduces anxiety
- Transitions are difficult - advance warning enables mental preparation
- Visual timeline provides at-a-glance structure
- Disruption logging reduces guilt about "failed" routines

---

### 4. Shutdown/Meltdown Tracker

**Purpose:** Track autistic burnout episodes for pattern recognition and prevention

**Note:** `AnxietyEpisode` interface already exists in `types.ts` but isn't implemented in UI. This could extend or parallel that structure.

**What to Track:**

**A. Episode Type**
- Shutdown (withdrawal, going nonverbal, need to isolate)
- Meltdown (emotional outburst, loss of control)
- Mixed

**B. Preceding Events (Timeline)**
- What happened in hours/days before
- Stress accumulation
- Sleep quality
- Sensory load
- Social demands
- Routine disruptions

**C. Warning Signs Noticed**
- Physical: tension, fatigue, nausea
- Cognitive: brain fog, difficulty processing
- Emotional: irritability, fragility
- Behavioral: withdrawal, snapping at people

**D. During Episode**
- Duration (minutes/hours)
- Peak intensity (0-10)
- Where it happened
- Who was present (if anyone)
- Safety concerns (self-harm, leaving dangerous situation)

**E. Recovery**
- What helped (isolation, deep pressure, stim, sleep)
- What didn't help
- Time to recover
- Post-episode state

**F. Prevention Insights**
- Linked sensory logs (was sensory load high?)
- Linked energy tracking (running on empty?)
- Linked social interactions (too much masking?)

**UI Design:**
- Route: `/track/episode`
- Hub: `/track/episode/history`
- Multi-step form (like thought records)
- Timeline visualization showing buildup
- Pattern analysis: common triggers

**Database Schema:**
```typescript
interface ShutdownMeltdown {
  id?: number;
  date: string;
  timestamp: string;               // When episode started
  type: 'shutdown' | 'meltdown' | 'mixed';

  // Preceding events
  precedingHours: number;          // How far back did buildup start?
  stressors: string[];             // What contributed
  sleepQuality?: number;           // 0-10 from previous night

  // Warning signs
  warningSigns: WarningSigns;
  warningSignsNoticed: boolean;    // Did you recognize them in time?

  // During
  durationMinutes: number;
  peakIntensity: number;           // 0-10
  location?: string;
  trigger?: string;                // Immediate trigger (if any)

  // Recovery
  recoveryStrategies: string[];
  recoveryMinutes: number;
  whatHelped?: string;
  whatDidntHelp?: string;
  postEpisodeState: number;        // 0-10 energy/mood

  // Links
  linkedSensoryLogs?: number[];
  linkedEnergyLogs?: number[];
  linkedSocialLogs?: number[];

  notes?: string;
}

interface WarningSigns {
  physical: string[];              // tension, fatigue, nausea, headache
  cognitive: string[];             // brain fog, difficulty processing
  emotional: string[];             // irritability, fragility, numbness
  behavioral: string[];            // withdrawal, snapping, stimming increase
}
```

**Why It Helps:**
- Pattern recognition enables prevention
- Validates experience (these episodes are real and trackable)
- Identifies early warning signs for intervention
- Shows connections between sensory/social/energy states and episodes
- Supports conversations with therapists/psychiatrists

---

## Medium-Priority Additions

### 5. Energy/Spoons Tracker

**Purpose:** Track daily capacity using "spoon theory" model

**Background:** Spoon theory = each person has limited daily energy (spoons). Activities cost spoons. Running out = burnout.

**Features:**

**A. Morning Energy Assessment**
- "How many spoons do you have today?" (1-10 scale)
- Factors affecting capacity:
  - Sleep quality
  - Current stress level
  - Physical health
  - Mental health
  - Yesterday's demands

**B. Activity Spoon Costs**
- Add "spoon cost" field to activity logging
- Learn over time: "Shower usually costs you 2 spoons"
- Categorize activities:
  - Low (1-2 spoons): reading, watching TV
  - Medium (3-5): shower, light chores, phone call
  - High (6-8): grocery shopping, doctor appointment
  - Very high (9-10): social event, job interview

**C. Running Total**
- Dashboard widget: "6 spoons left today"
- Color-coded: green (5+), amber (2-4), red (0-1)
- Warning when approaching zero

**D. Pacing Suggestions**
- "You have 3 spoons left - consider low-energy activities"
- "Tomorrow is high-demand - plan rest today"
- Prevent over-scheduling: "This plan requires 12 spoons, you average 8"

**E. Pattern Recognition**
- Average spoons by day of week
- Recovery time after high-demand days
- Activities that drain vs energize
- Baseline fluctuations (seasonal, menstrual cycle if applicable)

**UI Design:**
- Route: `/track/energy`
- Dashboard widget: spoon count + gauge
- Integration with activity planner (show spoon costs)
- History: `/track/energy/trends`

**Database Schema:**
```typescript
interface EnergyLog {
  id?: number;
  date: string;
  morningSpoons: number;           // 0-10 starting capacity
  spoonsUsed: number;              // Calculated from activities
  spoonsRemaining: number;         // morningSpoons - spoonsUsed

  // Factors
  sleepQuality?: number;           // 0-10
  stressLevel?: number;            // 0-10

  // End of day
  endOfDayEnergy?: number;         // Actual vs predicted
  crashed?: boolean;               // Went into negative (burnout)

  notes?: string;
}

// Add to Activity types
interface Activity {
  // ... existing fields
  spoonCost?: number;              // 1-10, learned over time
}
```

**Why It Helps:**
- Makes invisible disability visible and trackable
- Prevents burnout through proactive pacing
- Validates need for rest
- Helps explain capacity to others
- Pattern recognition for self-advocacy

---

### 6. Stim & Regulation Strategies Library

**Purpose:** Quick-access library of self-regulation tools (like existing Activity Library but for stims)

**Categories:**

**A. Movement Stims**
- Rocking
- Pacing
- Bouncing/jumping
- Hand flapping
- Spinning
- Leg bouncing

**B. Tactile Stims**
- Fidget toys (specify type)
- Textures (soft, rough, smooth)
- Weighted items (blanket, lap pad)
- Temperature (ice, warmth)
- Repetitive touch

**C. Auditory Stims**
- Music (specify genre/playlist)
- White/brown/pink noise
- ASMR
- Repetitive sounds
- Earplugs/noise cancellation

**D. Visual Stims**
- Dim lights
- Specific colors
- Patterns
- Watching repetitive movement
- Sunglasses/tinted lenses

**E. Proprioceptive**
- Deep pressure (hugs, compression)
- Compression clothing
- Heavy lifting
- Push-ups against wall
- Tight spaces

**F. Oral Stims**
- Chewing (gum, stim toy)
- Crunchy foods
- Cold drinks
- Humming/vocal stims

**Features:**
- Pre-seeded with common strategies
- Add custom strategies
- Tag with: when useful, how long needed, accessibility (discreet vs obvious)
- Rate effectiveness: calming, focusing, energizing
- Quick access during distress
- Track which strategies work for which situations

**UI Design:**
- Route: `/tools/regulation`
- Similar to Activity Library structure
- Quick access modal from dashboard/crisis button
- Filter by category, effectiveness, situation type
- History: when strategies were used

**Database Schema:**
```typescript
interface RegulationStrategy {
  id?: number;
  name: string;
  category: RegulationCategory;
  description?: string;

  // Context
  bestFor: RegulationContext[];
  timeNeeded: number;              // Minutes
  discreetness: 'discreet' | 'somewhat' | 'obvious';
  accessibility: 'always' | 'home-only' | 'equipment-needed';

  // Effectiveness tracking
  timesUsed: number;
  averageRating: number;           // 0-10

  // Custom
  isCustom: boolean;
}

type RegulationCategory =
  | 'movement'
  | 'tactile'
  | 'auditory'
  | 'visual'
  | 'proprioceptive'
  | 'oral'
  | 'other';

type RegulationContext =
  | 'overstimulated'
  | 'understimulated'
  | 'anxious'
  | 'focus-needed'
  | 'emotional-regulation'
  | 'transition-help';

interface RegulationLog {
  id?: number;
  timestamp: string;
  strategyId: number;
  situation: string;
  beforeState: number;             // 0-10 distress/dysregulation
  afterState: number;              // 0-10
  effectiveness: number;           // 0-10
  notes?: string;
}
```

**Why It Helps:**
- Legitimizes stimming as valid regulation
- Quick access reduces decision fatigue during distress
- Pattern tracking shows what actually works
- Educational for understanding personal regulation needs
- Can share effective strategies list with support people

---

### 7. Social Energy Tracker

**Purpose:** Track social demands and recovery needs

**What to Track:**

**A. Social Battery Level**
- Pre-interaction: 0-10
- Post-interaction: 0-10
- Depletion amount
- Expected vs actual drain

**B. Interaction Details**
- Type: phone, video, in-person, group
- Duration: minutes
- Number of people
- Relationship: family, friend, acquaintance, stranger, professional
- Setting: home, work, public, controlled, uncontrolled

**C. Masking Effort**
- How much did you mask? (0-10)
  - 0 = Fully authentic
  - 5 = Some code-switching
  - 10 = Complete performance
- Specific masking behaviors:
  - Forced eye contact
  - Suppressed stims
  - Scripted conversation
  - Emotion regulation
  - Sensory tolerance

**D. Interaction Quality**
- Positive/neutral/draining
- What was good about it
- What was difficult
- Would repeat?

**E. Recovery Needs**
- Estimated recovery time
- Actual recovery time
- Recovery activities used
- Recovered to what level

**UI Design:**
- Route: `/track/social`
- Log before and after interactions
- Pattern analysis: which interactions drain most
- Recovery time calculator
- Planning tool: "Social event Saturday - block Sunday for recovery"

**Database Schema:**
```typescript
interface SocialInteraction {
  id?: number;
  date: string;
  timestamp: string;

  // Social battery
  batteryBefore: number;           // 0-10
  batteryAfter: number;            // 0-10
  depletion: number;               // Calculated

  // Interaction details
  type: 'phone' | 'video' | 'in-person-solo' | 'in-person-group';
  durationMinutes: number;
  numberOfPeople?: number;
  relationship: 'family' | 'friend' | 'acquaintance' | 'stranger' | 'professional';
  setting: 'home' | 'work' | 'public' | 'controlled' | 'uncontrolled';

  // Masking
  maskingLevel: number;            // 0-10
  maskingBehaviors: MaskingBehavior[];

  // Quality
  valence: 'positive' | 'neutral' | 'draining';
  whatWasGood?: string;
  whatWasDifficult?: string;
  wouldRepeat: boolean;

  // Recovery
  estimatedRecoveryMinutes?: number;
  actualRecoveryMinutes?: number;
  recoveryActivities?: string[];

  notes?: string;
}

type MaskingBehavior =
  | 'forced-eye-contact'
  | 'suppressed-stims'
  | 'scripted-conversation'
  | 'emotion-regulation'
  | 'sensory-tolerance'
  | 'fake-enthusiasm'
  | 'social-reciprocity'
  | 'other';
```

**Why It Helps:**
- Validates that social interaction is work
- Helps plan social time + recovery time
- Identifies which interactions are worthwhile
- Reduces masking by recognizing its cost
- Data for explaining needs to others
- Pattern recognition: "Video calls drain less than in-person"

---

### 8. Explicit Communication Cards

**Purpose:** Non-verbal communication during overwhelm or shutdown

**Pre-Loaded Phrases:**
- "I need a break"
- "I'm overwhelmed, please give me space"
- "I can't talk right now"
- "Too loud"
- "Too bright"
- "Too crowded"
- "I need quiet"
- "I need help but can't explain"
- "Not ignoring you, processing"
- "Sensory overload"
- "Need to leave"
- "Don't touch me"

**Features:**
- Customizable cards (add your own)
- Large text, high contrast
- Show card full-screen
- Option to speak card text (text-to-speech)
- Quick access: one tap from any screen
- Emergency mode: show crisis card + location

**UI Design:**
- Floating button (like existing crisis button) OR
- Swipe gesture to open card drawer
- Grid of cards, tap to display full-screen
- Settings: customize card text, add new cards
- Multiple languages support

**Implementation:**
```typescript
interface CommunicationCard {
  id?: number;
  text: string;
  category: 'need' | 'sensory' | 'emotional' | 'boundary';
  isDefault: boolean;              // Pre-loaded vs custom
  order: number;                   // Display order
  usageCount: number;              // Track which cards are most used
}
```

**Why It Helps:**
- Going nonverbal is common during shutdown/overload
- Reduces frustration of being unable to communicate needs
- Empowers communication without speech
- Can show to support people, strangers, emergency services
- Fast - no typing or searching for words

---

## Lower-Priority Features

### 9. Task Breakdown Tool

**Purpose:** Executive function support for complex tasks

**Features:**
- Input large task: "Clean kitchen"
- Break into micro-steps (manual or AI-suggested)
- Estimate time per step (1-15 min chunks)
- Check off as completed
- Visual progress bar
- Option to save breakdown as template

**Example:**
```
Task: Clean Kitchen
├─ [ ] Collect dishes from around house (3 min)
├─ [ ] Load dishwasher (5 min)
├─ [ ] Wipe counters (3 min)
├─ [ ] Sweep floor (4 min)
├─ [ ] Take out trash (2 min)
└─ [ ] Put away clean dishes (3 min)
Progress: ████░░░░░░ 40% complete (12/20 min)
```

**UI Design:**
- Route: `/tools/breakdown`
- Integration with activity planner
- Template library: common tasks pre-broken-down
- Share breakdowns (export/import JSON)

**Why It Helps:**
- Task initiation is hard with executive dysfunction
- Micro-steps reduce overwhelm
- Clear endpoint (100% bar) prevents perfectionism spiral
- Time estimates prevent underestimation
- Templates reduce repeated cognitive load

---

### 10. Special Interest Log

**Purpose:** Positive tracking (most features track difficulties)

**What to Track:**
- Special interest name/topic
- Time spent (per session)
- Type: research, creating, consuming, discussing
- Mood before/after (0-10)
- Energy before/after (0-10)
- Projects completed
- Knowledge gained
- Connections made

**Features:**
- Multiple interests (can have many)
- Hyperfocus sessions: track deep dives
- Goals: "Learn X", "Finish Y project"
- Share-worthy achievements (optional export)
- Time trend: how interest ebbs/flows over weeks

**UI Design:**
- Route: `/track/interests`
- Dashboard widget: "Time in special interests this week"
- Project tracker per interest
- Mood correlation: interests improve mood

**Database Schema:**
```typescript
interface SpecialInterest {
  id?: number;
  name: string;
  category?: string;               // STEM, creative, collection, etc.
  startedDate: string;
  currentlyActive: boolean;
  notes?: string;
}

interface InterestSession {
  id?: number;
  interestId: number;
  timestamp: string;
  durationMinutes: number;
  type: 'research' | 'creating' | 'consuming' | 'discussing';
  moodBefore?: number;
  moodAfter?: number;
  energyBefore?: number;
  energyAfter?: number;
  accomplishment?: string;
  notes?: string;
}
```

**Why It Helps:**
- Special interests are regulating and energizing (not "weird obsessions")
- Legitimizes this time as valuable self-care
- Shows positive impact on mood/energy
- Tracks productivity in areas you care about
- Reduces guilt about "wasting time" on interests

---

### 11. Masking Recovery Timer

**Purpose:** Dedicated recovery scheduling after masking demands

**Features:**

**A. Masking Period Blocks**
- Set known masking times: "Work 9am-5pm Monday-Friday"
- Mark special events: "Family dinner Sunday 6-9pm"
- Intensity rating: light, moderate, heavy masking

**B. Auto-Recovery Calculation**
- Light masking (2hr) = 1hr recovery
- Moderate masking (4hr) = 2hr recovery
- Heavy masking (8hr) = 4hr recovery
- Customizable ratios (learn your personal needs)

**C. Recovery Blocking**
- Automatically block calendar during recovery
- Prevent scheduling activities during recovery window
- Suggested recovery activities from regulation library
- Override if necessary (but tracked as "skipped recovery")

**D. Recovery Deficit Tracking**
- Running total of recovery needed vs taken
- Warning: "You have 6hr recovery debt this week"
- Pattern: "You skip recovery on weekdays, crash on weekends"

**UI Design:**
- Route: `/plan/recovery`
- Integration with activity planner (gray out recovery times)
- Dashboard: "Recovery time today: 2hr after work"
- Settings: customize recovery ratios

**Database Schema:**
```typescript
interface MaskingPeriod {
  id?: number;
  date: string;
  startTime: string;
  endTime: string;
  durationMinutes: number;
  intensity: 'light' | 'moderate' | 'heavy';
  context: string;                 // "work", "family event"
  recoveryNeeded: number;          // Calculated minutes
}

interface RecoveryBlock {
  id?: number;
  date: string;
  maskingPeriodId: number;
  plannedRecoveryMinutes: number;
  actualRecoveryMinutes: number;
  wasSkipped: boolean;
  recoveryActivities?: string[];
}
```

**Why It Helps:**
- Makes invisible masking cost visible
- Prevents burnout from consecutive masking periods
- Legitimizes recovery time as necessary, not optional
- Pattern recognition: recovery debt leads to shutdowns
- Self-advocacy: "I need 2hr alone time after this event"

---

## Implementation Considerations

### Design Principles to Maintain

**Existing Strengths:**
- ✅ No social features (critical for this user and many autistic people)
- ✅ Local-only data (privacy is huge for autistic community)
- ✅ Large touch targets (44px minimum)
- ✅ Auto-save everything (executive function support)
- ✅ No guilt language (factual, neutral tone)
- ✅ Visual over text (preference for visual processing)
- ✅ Reduced motion support (sensory accommodation)
- ✅ One task per screen (reduces cognitive load)
- ✅ Exit always available (control and autonomy)

### New Design Considerations for Autism

**A. Literal Language**
- Autistic individuals often process language literally
- Avoid idioms: "piece of cake" → "easy"
- Avoid metaphors: "burning the candle at both ends" → "overexerting yourself"
- Be explicit: "Done" → "Save and return to dashboard"
- Use concrete examples in help text

**B. Consistent Patterns**
- Once you establish a UX pattern (multi-step forms, auto-save), keep it 100% consistent
- Don't change button positions between screens
- Don't change color meanings (red = distress throughout, not sometimes red = delete)
- Use same terminology everywhere (don't alternate "intensity" and "level")

**C. Reduce Uncertainty**
- Explicit outcomes: "This will take 5 minutes" not "Quick exercise"
- Tell user what happens next: "After saving, you'll return to the dashboard"
- Show progress: "Step 2 of 4" not just "Next"
- Confirmation messages: "Saved successfully" not silent save

**D. Visual Predictability**
- Color-coding should be consistent and meaningful
- Green = good/calm, amber = caution/moderate, red = distress/high
- Don't use colors decoratively that have meaning elsewhere
- Icons should be literal (picture of the thing, not abstract metaphors)

**E. Control & Customization**
- Allow disabling features (not everyone needs all autism features)
- Customizable thresholds: "Alert me when spoons drop below 3" (user sets 3)
- Reorder lists to personal preference
- Export data (transparency and ownership)

**F. Error Handling**
- Clear error messages: "Blood pressure must be between 50-250" not "Invalid input"
- Suggest fix: "Try a number between 50 and 250"
- Never blame user: "Invalid entry" → "Number out of range"
- Preserve data on error (don't make them re-enter everything)

### Technical Architecture

**Database Additions Needed:**

New tables to add to `src/lib/db/types.ts` and `src/lib/db/index.ts`:

```typescript
// High Priority
- SensoryLog
- InteroceptionCheck
- RoutineTemplate
- RoutineDisruption
- ShutdownMeltdown + WarningSigns

// Medium Priority
- EnergyLog (+ spoonCost field on Activity)
- RegulationStrategy
- RegulationLog
- SocialInteraction

// Lower Priority
- TaskBreakdown
- SpecialInterest
- InterestSession
- MaskingPeriod
- RecoveryBlock
- CommunicationCard
```

**Component Reuse:**

Leverage existing patterns:
- Slider components (mood/anxiety) → sensory/energy/masking sliders
- Multi-step forms (thought records) → shutdown tracking, hierarchy
- Auto-save pattern → apply to all new multi-step forms
- History views → template for all new tracking features
- CharacterCounter → notes fields in new features
- Dashboard widgets → add new widgets for spoons, recovery time

**Route Structure:**

```
/track/sensory              Sensory logger
/track/sensory/history      Sensory history
/track/interoception        Body signal check-in
/track/interoception/history Body signal patterns
/track/energy               Spoons tracker
/track/energy/trends        Energy patterns
/track/social               Social interaction logger
/track/social/history       Social interaction history
/track/episode              Shutdown/meltdown logger
/track/episode/history      Episode history & patterns
/track/interests            Special interests tracker

/tools/regulation           Stim/regulation library
/tools/breakdown            Task breakdown tool
/tools/communicate          Communication cards

/plan/recovery              Masking recovery scheduler
/plan/templates             Routine templates
```

### Accessibility Reminders

**Continue these practices:**
- 44px touch targets
- WCAG AA contrast (4.5:1 minimum)
- Keyboard navigation with visible focus
- Screen reader compatible labels
- `prefers-reduced-motion` respect
- Font size customization (existing settings)

**New considerations:**
- Communication cards: ultra-high contrast, extra-large text
- Sensory UI: avoid triggering colors (flashing red), animations
- Audio cues: always optional, with visual alternatives

---

## Recommended Phasing

### Phase 9A: Sensory Overload Tracker (Week 1-2)

**Why first:**
- Highest impact for autism-specific needs
- Fills gap not addressed by current features
- Leverages existing mood/anxiety tracking patterns
- Critical for understanding triggers

**Deliverables:**
- Sensory logger (`/track/sensory`)
- Trigger checkboxes with multi-select
- Sensory history view (90 days)
- Basic insights: trend chart, common triggers
- Link to mood logs (optional correlation)

**Database:**
- `SensoryLog` table
- Query helpers: `getSensoryLogs()`, `getSensoryTriggerStats()`

**Testing:**
- Log various sensory experiences
- Verify trigger multi-select works
- Check insights accuracy
- Test reduced motion (no jarring animations on overload screens)

---

### Phase 9B: Shutdown/Meltdown Tracker (Week 3-4)

**Why second:**
- Critical for crisis prevention
- Infrastructure partially exists (`AnxietyEpisode` in types.ts)
- Natural extension of existing crisis tools
- Builds on Phase 9A (link sensory data)

**Deliverables:**
- Episode logger (`/track/episode`)
- Multi-step form: type → buildup → during → recovery
- Episode history with timeline visualization
- Pattern analysis: common triggers, warning signs
- Link to sensory logs, energy logs (if 9C done), social logs

**Database:**
- `ShutdownMeltdown` table
- `WarningSigns` interface
- Query helpers: `getEpisodes()`, `getEpisodeStats()`, `getCommonTriggers()`

**Testing:**
- Log both shutdown and meltdown examples
- Verify timeline visualization works
- Check warning signs library completeness
- Test pattern detection accuracy

---

### Phase 9C: Interoception Training + Routine Visualizer (Week 5-6)

**Why third:**
- Addresses core autistic experiences
- Builds on existing activity planning
- Preventive rather than reactive (reduces future episodes)
- Moderate complexity

**Part 1: Interoception**

**Deliverables:**
- Check-in logger (`/track/interoception`)
- Quick modal for scheduled reminders
- Body map visualization (SVG)
- Pattern trends: hunger/thirst/energy by time of day
- Suggestions: "You're usually hungry at 11am"

**Database:**
- `InteroceptionCheck` table
- Query helpers: `getInteroceptionChecks()`, `getInteroceptionPatterns()`

**Part 2: Routine Enhancements**

**Deliverables:**
- Visual timeline view (enhance `/plan/today`)
- Transition countdown system (configurable warnings)
- Routine templates (`/plan/templates`)
- Disruption logging (factual, no guilt)

**Database:**
- `RoutineTemplate` table
- `RoutineDisruption` table
- Query helpers: `getTemplates()`, `getDisruptions()`, `getDisruptionPatterns()`

**Testing:**
- Check-in accuracy over multiple days
- Routine template save/load
- Transition countdown timing
- Disruption tracking without guilt language

---

### Phase 9D: Energy & Social Tracking (Week 7-8)

**Why fourth:**
- Builds on established tracking patterns
- Provides data for Phase 9B insights (energy → shutdowns)
- Social tracking is complex but valuable
- Energy tracking enables recovery planning (Phase 9E)

**Part 1: Energy/Spoons**

**Deliverables:**
- Morning spoon assessment (`/track/energy`)
- Activity spoon cost field (add to existing activities)
- Dashboard spoon widget
- Running total with color-coded gauge
- Pattern recognition: average spoons by day

**Database:**
- `EnergyLog` table
- Add `spoonCost` field to `Activity` interface
- Query helpers: `getEnergyLogs()`, `getAverageSpoonsByDay()`

**Part 2: Social Tracking**

**Deliverables:**
- Social interaction logger (`/track/social`)
- Pre/post battery level
- Masking effort tracking (0-10 + behaviors)
- Interaction quality rating
- Recovery time estimation vs actual
- Pattern analysis: which interactions drain most

**Database:**
- `SocialInteraction` table
- Query helpers: `getSocialInteractions()`, `getMaskingPatterns()`, `getSocialEnergyStats()`

**Testing:**
- Spoon calculations accurate
- Social battery depletion math correct
- Masking behavior checkboxes comprehensive
- Recovery time predictions improve with data

---

### Phase 9E: Regulation & Communication (Week 9-10)

**Why fifth:**
- Leverages existing Activity Library pattern
- Communication cards are simple but high-value
- Completes the crisis support ecosystem
- Nice quality-of-life improvements

**Part 1: Regulation Library**

**Deliverables:**
- Regulation strategy library (`/tools/regulation`)
- Pre-seeded strategies (30+ across 6 categories)
- Custom strategy creation
- Effectiveness rating after use
- Quick access modal (like crisis button)
- Filter by category, context, effectiveness

**Database:**
- `RegulationStrategy` table (pre-seeded)
- `RegulationLog` table
- Query helpers: `getRegulationStrategies()`, `getEffectiveStrategies()`

**Part 2: Communication Cards**

**Deliverables:**
- Communication card interface (`/tools/communicate`)
- Pre-loaded phrases (12+ common needs)
- Custom card creation
- Full-screen display mode
- Text-to-speech option
- Quick access (floating button or swipe gesture)

**Database:**
- `CommunicationCard` table (pre-seeded)
- Query helper: `getCommunicationCards()`

**Testing:**
- Regulation strategies discoverable
- Effectiveness tracking updates library
- Communication cards readable at arm's length
- Text-to-speech clear and functional
- Quick access is truly quick (< 2 seconds from anywhere)

---

### Phase 9F: Lower-Priority Features (Week 11+)

**Optional enhancements based on user feedback:**

**Task Breakdown Tool:**
- If executive function struggles persist
- If activity planner feels too high-level

**Special Interest Log:**
- If user wants positive tracking
- If interests significantly impact mood/energy

**Masking Recovery Timer:**
- If social tracking (Phase 9D) reveals consistent recovery deficits
- If burnout prevention becomes priority

**Implementation:**
- These can be done individually based on need
- Not critical for MVP of autism support
- Good candidates for user-requested features

---

## Database Schema Additions

### Complete Schema for All Features

```typescript
// src/lib/db/types.ts additions

// ============================================
// SENSORY TRACKING
// ============================================

export interface SensoryLog {
  id?: number;
  date: string;                    // YYYY-MM-DD
  timestamp: string;               // ISO datetime
  overloadLevel: number;           // 0-10
  triggers: SensoryTrigger[];
  location?: string;
  warningSigns?: string;           // What preceded overload
  recoveryStrategies?: string;     // What helped
  recoveryMinutes?: number;        // Time to recover
  notes?: string;                  // Max 200 chars
  linkedMoodId?: number;           // Optional link to mood log
}

export type SensoryTrigger =
  | 'sound-volume'
  | 'sound-unexpected'
  | 'sound-repetitive'
  | 'light-brightness'
  | 'light-flickering'
  | 'light-glare'
  | 'touch-texture'
  | 'touch-pressure'
  | 'touch-temperature'
  | 'smell-strong'
  | 'smell-chemical'
  | 'visual-clutter'
  | 'visual-crowds'
  | 'visual-patterns'
  | 'temperature'
  | 'movement'
  | 'taste'
  | 'other';

// ============================================
// INTEROCEPTION
// ============================================

export interface InteroceptionCheck {
  id?: number;
  timestamp: string;               // ISO datetime
  hunger: number;                  // 0-10 (0=starving, 10=overfull)
  thirst: number;                  // 0-10 (0=parched, 10=overhydrated)
  energy: number;                  // 0-10 (0=exhausted, 10=energized)
  bathroomNeed: number;            // 0-10 (0=none, 10=urgent)
  temperature: number;             // 0-10 (0=too cold, 5=comfortable, 10=too hot)
  pain: number;                    // 0-10 (0=none, 10=severe)
  bodyRegions?: string[];          // Where sensations felt
  notes?: string;
}

// ============================================
// ROUTINE MANAGEMENT
// ============================================

export interface RoutineTemplate {
  id?: number;
  name: string;                    // "Morning Routine", "Workday"
  description?: string;
  activities: {
    activityId: number;            // Reference to activity library
    timeSlot?: TimeSlot;
    duration: number;              // Minutes
    order: number;                 // Display order
  }[];
  tags?: string[];                 // "weekday", "weekend", "low-energy"
  isActive: boolean;
}

export interface RoutineDisruption {
  id?: number;
  date: string;                    // YYYY-MM-DD
  timestamp: string;               // When disruption occurred
  plannedActivityId: number;       // What was supposed to happen
  plannedActivityName: string;     // Denormalized for history
  reason: string;                  // Why it didn't happen
  emotionalImpact?: number;        // 0-10 how distressing
  wasReplaced: boolean;            // Did something else instead?
  replacementActivity?: string;
  notes?: string;
}

// ============================================
// SHUTDOWN/MELTDOWN TRACKING
// ============================================

export interface ShutdownMeltdown {
  id?: number;
  date: string;                    // YYYY-MM-DD
  timestamp: string;               // When episode started
  type: 'shutdown' | 'meltdown' | 'mixed';

  // Preceding events
  precedingHours: number;          // How far back did buildup start?
  stressors: string[];             // What contributed
  sleepQuality?: number;           // 0-10 from previous night

  // Warning signs
  warningSigns: WarningSigns;
  warningSignsNoticed: boolean;    // Did you recognize them in time?
  warningSignsTime?: string;       // When first noticed (if any)

  // During episode
  durationMinutes: number;
  peakIntensity: number;           // 0-10
  location?: string;
  trigger?: string;                // Immediate trigger (if identifiable)
  safetyNotes?: string;            // Any safety concerns

  // Recovery
  recoveryStrategies: string[];
  recoveryMinutes: number;
  whatHelped?: string;
  whatDidntHelp?: string;
  postEpisodeState: number;        // 0-10 energy/mood

  // Data links
  linkedSensoryLogs?: number[];
  linkedEnergyLogs?: number[];
  linkedSocialLogs?: number[];

  notes?: string;
}

export interface WarningSigns {
  physical: string[];              // tension, fatigue, nausea, headache
  cognitive: string[];             // brain fog, difficulty processing, losing words
  emotional: string[];             // irritability, fragility, numbness, flatness
  behavioral: string[];            // withdrawal, snapping, increased stimming
}

export const warningSignOptions = {
  physical: [
    'muscle-tension',
    'fatigue',
    'nausea',
    'headache',
    'jaw-clenching',
    'rapid-heartbeat',
    'shallow-breathing'
  ],
  cognitive: [
    'brain-fog',
    'difficulty-processing',
    'losing-words',
    'slower-responses',
    'confusion',
    'memory-issues'
  ],
  emotional: [
    'irritability',
    'fragility',
    'numbness',
    'flatness',
    'tearfulness',
    'anger',
    'despair'
  ],
  behavioral: [
    'withdrawal',
    'snapping-at-people',
    'increased-stimming',
    'avoiding-tasks',
    'escape-urges',
    'repetitive-behaviors'
  ]
};

// ============================================
// ENERGY MANAGEMENT (SPOONS)
// ============================================

export interface EnergyLog {
  id?: number;
  date: string;                    // YYYY-MM-DD
  morningSpoons: number;           // 0-10 starting capacity
  spoonsUsed: number;              // Calculated from activities
  spoonsRemaining: number;         // morningSpoons - spoonsUsed

  // Factors affecting capacity
  sleepQuality?: number;           // 0-10
  stressLevel?: number;            // 0-10
  physicalHealth?: number;         // 0-10

  // End of day
  endOfDayEnergy?: number;         // Actual energy level
  crashed?: boolean;               // Went into negative (burnout)

  notes?: string;
}

// Add to existing Activity interface
export interface Activity {
  // ... existing fields remain ...
  spoonCost?: number;              // 1-10, learned over time
  spoonCostLearned?: boolean;      // Has cost been calculated from logs?
}

// ============================================
// REGULATION STRATEGIES
// ============================================

export interface RegulationStrategy {
  id?: number;
  name: string;
  category: RegulationCategory;
  description?: string;

  // Context
  bestFor: RegulationContext[];
  timeNeeded: number;              // Minutes
  discreetness: 'discreet' | 'somewhat' | 'obvious';
  accessibility: 'always' | 'home-only' | 'equipment-needed';
  equipment?: string;              // What's needed

  // Effectiveness tracking
  timesUsed: number;
  averageRating: number;           // 0-10 (auto-calculated)

  // Custom vs pre-seeded
  isCustom: boolean;
  isActive: boolean;               // Can be archived
}

export type RegulationCategory =
  | 'movement'
  | 'tactile'
  | 'auditory'
  | 'visual'
  | 'proprioceptive'
  | 'oral'
  | 'breathing'
  | 'other';

export type RegulationContext =
  | 'overstimulated'
  | 'understimulated'
  | 'anxious'
  | 'focus-needed'
  | 'emotional-regulation'
  | 'transition-help'
  | 'grounding'
  | 'energy-boost';

export interface RegulationLog {
  id?: number;
  timestamp: string;
  strategyId: number;
  strategyName: string;            // Denormalized
  situation: string;               // Brief context
  beforeState: number;             // 0-10 distress/dysregulation
  afterState: number;              // 0-10
  effectiveness: number;           // 0-10
  durationMinutes?: number;
  notes?: string;
}

// ============================================
// SOCIAL TRACKING
// ============================================

export interface SocialInteraction {
  id?: number;
  date: string;                    // YYYY-MM-DD
  timestamp: string;               // Start time

  // Social battery
  batteryBefore: number;           // 0-10
  batteryAfter: number;            // 0-10
  depletion: number;               // Calculated: before - after

  // Interaction details
  type: 'phone' | 'video' | 'in-person-solo' | 'in-person-group';
  durationMinutes: number;
  numberOfPeople?: number;
  relationship: 'family' | 'friend' | 'acquaintance' | 'stranger' | 'professional';
  setting: 'home' | 'work' | 'public' | 'controlled' | 'uncontrolled';

  // Masking
  maskingLevel: number;            // 0-10
  maskingBehaviors: MaskingBehavior[];

  // Quality
  valence: 'positive' | 'neutral' | 'draining';
  whatWasGood?: string;
  whatWasDifficult?: string;
  wouldRepeat: boolean;

  // Recovery
  estimatedRecoveryMinutes?: number;
  actualRecoveryMinutes?: number;
  recoveryActivities?: string[];

  notes?: string;
}

export type MaskingBehavior =
  | 'forced-eye-contact'
  | 'suppressed-stims'
  | 'scripted-conversation'
  | 'emotion-regulation'
  | 'sensory-tolerance'
  | 'fake-enthusiasm'
  | 'social-reciprocity'
  | 'mirroring'
  | 'small-talk'
  | 'other';

// ============================================
// COMMUNICATION CARDS
// ============================================

export interface CommunicationCard {
  id?: number;
  text: string;                    // The message to display
  category: 'need' | 'sensory' | 'emotional' | 'boundary' | 'emergency';
  isDefault: boolean;              // Pre-loaded vs custom
  order: number;                   // Display order
  usageCount: number;              // Track which cards are most used
  lastUsed?: string;               // ISO datetime
  backgroundColor?: string;        // Custom color for card
  textColor?: string;              // Custom text color
}

// ============================================
// TASK BREAKDOWN
// ============================================

export interface TaskBreakdown {
  id?: number;
  taskName: string;                // "Clean kitchen"
  createdDate: string;             // YYYY-MM-DD
  isTemplate: boolean;             // Save as reusable template?

  steps: TaskStep[];
  totalEstimatedMinutes: number;   // Sum of step estimates
  totalActualMinutes?: number;     // Sum of actual time

  status: 'not-started' | 'in-progress' | 'completed';
  completedDate?: string;

  notes?: string;
}

export interface TaskStep {
  stepNumber: number;
  description: string;             // "Load dishwasher"
  estimatedMinutes: number;        // 5
  actualMinutes?: number;          // What it really took
  completed: boolean;
  completedTime?: string;          // ISO datetime
}

// ============================================
// SPECIAL INTERESTS
// ============================================

export interface SpecialInterest {
  id?: number;
  name: string;                    // "Astronomy", "WWII History"
  category?: string;               // STEM, creative, collection, etc.
  startedDate: string;             // YYYY-MM-DD
  currentlyActive: boolean;
  description?: string;
  notes?: string;
}

export interface InterestSession {
  id?: number;
  interestId: number;
  interestName: string;            // Denormalized
  timestamp: string;               // ISO datetime
  durationMinutes: number;
  type: 'research' | 'creating' | 'consuming' | 'discussing' | 'organizing';

  // Mood/energy impact
  moodBefore?: number;             // 0-10
  moodAfter?: number;              // 0-10
  energyBefore?: number;           // 0-10
  energyAfter?: number;            // 0-10

  // What happened
  accomplishment?: string;         // "Finished chapter 3", "Catalogued 20 items"
  knowledgeGained?: string;

  notes?: string;
}

// ============================================
// MASKING RECOVERY
// ============================================

export interface MaskingPeriod {
  id?: number;
  date: string;                    // YYYY-MM-DD
  startTime: string;               // ISO datetime
  endTime: string;                 // ISO datetime
  durationMinutes: number;         // Calculated
  intensity: 'light' | 'moderate' | 'heavy';
  context: string;                 // "work", "family event", "doctor appointment"
  recoveryNeededMinutes: number;   // Calculated based on intensity
  linkedSocialId?: number;         // Link to social interaction if logged
}

export interface RecoveryBlock {
  id?: number;
  date: string;                    // YYYY-MM-DD
  maskingPeriodId: number;
  plannedRecoveryMinutes: number;  // What was scheduled
  actualRecoveryMinutes: number;   // What was taken
  wasSkipped: boolean;
  skipReason?: string;
  recoveryActivities?: string[];   // What did during recovery
  wasEffective?: boolean;          // Did recovery actually help
  notes?: string;
}
```

### Database Initialization

```typescript
// src/lib/db/index.ts additions

import Dexie, { type Table } from 'dexie';
// ... existing imports ...

export class MyndnessDB extends Dexie {
  // ... existing tables ...

  // New tables
  sensoryLogs!: Table<SensoryLog>;
  interoceptionChecks!: Table<InteroceptionCheck>;
  routineTemplates!: Table<RoutineTemplate>;
  routineDisruptions!: Table<RoutineDisruption>;
  shutdownMeltdowns!: Table<ShutdownMeltdown>;
  energyLogs!: Table<EnergyLog>;
  regulationStrategies!: Table<RegulationStrategy>;
  regulationLogs!: Table<RegulationLog>;
  socialInteractions!: Table<SocialInteraction>;
  communicationCards!: Table<CommunicationCard>;
  taskBreakdowns!: Table<TaskBreakdown>;
  specialInterests!: Table<SpecialInterest>;
  interestSessions!: Table<InterestSession>;
  maskingPeriods!: Table<MaskingPeriod>;
  recoveryBlocks!: Table<RecoveryBlock>;

  constructor() {
    super('MyndnessDB');
    this.version(2).stores({
      // ... existing stores ...

      // New stores
      sensoryLogs: '++id, date, timestamp, overloadLevel',
      interoceptionChecks: '++id, timestamp',
      routineTemplates: '++id, name, isActive',
      routineDisruptions: '++id, date, plannedActivityId',
      shutdownMeltdowns: '++id, date, timestamp, type',
      energyLogs: '++id, date',
      regulationStrategies: '++id, category, isActive',
      regulationLogs: '++id, timestamp, strategyId',
      socialInteractions: '++id, date, timestamp',
      communicationCards: '++id, category, order',
      taskBreakdowns: '++id, createdDate, status',
      specialInterests: '++id, name, currentlyActive',
      interestSessions: '++id, timestamp, interestId',
      maskingPeriods: '++id, date, startTime',
      recoveryBlocks: '++id, date, maskingPeriodId'
    });
  }
}

export const db = new MyndnessDB();
```

---

## Next Steps

1. **Review & Prioritize:** Decide which phases align with user needs
2. **User Feedback:** Share this document with the 64yo user - which features resonate?
3. **Start Small:** Phase 9A (Sensory Tracker) is good MVP for autism support
4. **Iterate:** Build, test, gather feedback, adjust before next phase
5. **Optional Features:** Lower-priority features can be user-requested additions

---

**Document Version:** 1.0
**Created:** 2026-01-28
**Status:** Proposal - awaiting review and prioritization
**Next Action:** Review with user, select Phase 9A features for implementation
