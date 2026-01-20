# Phase 8B: Behavioral Experiments - Cold Start Instructions

## Status
- **Database helpers**: ✅ Complete (in `/src/lib/db/index.ts`)
- **UI Components**: ❌ Not started
- **Routes**: ❌ Not started
- **Hub Integration**: ❌ Not started

## What This Feature Does
Behavioral experiments let users test anxiety-provoking beliefs with real-world evidence. Example: "If I call my doctor, I'll sound stupid" → Call doctor → Record what actually happened → Update belief strength based on evidence.

## Database Schema (Already Exists)
```typescript
// src/lib/db/types.ts (lines 264-294)
interface BehavioralExperiment {
  id?: number;
  date: string;                    // YYYY-MM-DD
  createdAt: string;               // ISO datetime

  // Hypothesis
  belief: string;                  // "I believe that..."
  beliefStrength: number;          // 0-100 how strongly believed

  // Test plan
  experiment: string;              // What will you do to test it?
  prediction: string;              // What do you expect to happen?
  predictionConfidence: number;    // 0-100

  // Execution
  plannedDate?: string;            // When to do it
  completed: boolean;
  completedAt?: string;

  // Results
  actualOutcome?: string;          // What really happened?
  learnings?: string;              // What did this teach you?

  // Post-experiment ratings
  beliefStrengthAfter?: number;    // 0-100 revised belief

  // Link to activity
  linkedActivityId?: number;

  notes?: string;
}
```

## Database Helpers (Already Complete)
```typescript
// src/lib/db/index.ts (lines 553-624)
getBehavioralExperiments(startDate, endDate)  // Get experiments in date range
getIncompleteExperiments()                     // Get uncompleted experiments
getExperimentById(id)                          // Get single experiment
getExperimentStats(startDate, endDate)         // Calculate stats
```

## Implementation Plan

### Step 1: Create Directory Structure
```bash
mkdir -p src/routes/tools/cbt/experiment/new
mkdir -p src/routes/tools/cbt/experiment/[id]
mkdir -p src/lib/components/cbt
```

### Step 2: Create Components (4 files)

#### A. BehavioralExperimentForm.svelte
**Location**: `/src/lib/components/cbt/BehavioralExperimentForm.svelte`
**Pattern**: Multi-step auto-save (like ThoughtRecordForm)
**Lines**: ~400

**Structure**:
```svelte
<script lang="ts">
  import { db } from '$lib/db';
  import type { BehavioralExperiment } from '$lib/db/types';
  import ProgressSteps from '$lib/components/common/ProgressSteps.svelte';
  import CharacterCounter from '$lib/components/common/CharacterCounter.svelte';
  import { onMount } from 'svelte';

  let currentStep = $state(1);
  let currentEntryId: number | null = $state(null);
  let saveStatus: 'idle' | 'saving' | 'saved' = $state('idle');
  let saveTimeout: ReturnType<typeof setTimeout> | null = null;

  // Form data
  let formData = $state({
    belief: '',
    beliefStrength: 50,
    experiment: '',
    prediction: '',
    predictionConfidence: 50,
    plannedDate: '',
    linkedActivityId: undefined as number | undefined
  });

  // Auto-save with 500ms debounce
  function scheduleAutoSave() {
    if (saveTimeout) clearTimeout(saveTimeout);
    saveStatus = 'saving';
    saveTimeout = setTimeout(async () => {
      await saveEntry();
    }, 500);
  }

  async function saveEntry() {
    const entry: Omit<BehavioralExperiment, 'id'> = {
      date: new Date().toISOString().split('T')[0],
      createdAt: new Date().toISOString(),
      belief: formData.belief || '',
      beliefStrength: formData.beliefStrength,
      experiment: formData.experiment || '',
      prediction: formData.prediction || '',
      predictionConfidence: formData.predictionConfidence,
      plannedDate: formData.plannedDate || undefined,
      linkedActivityId: formData.linkedActivityId,
      completed: false
    };

    if (currentEntryId) {
      await db.behavioralExperiments.update(currentEntryId, entry);
    } else {
      currentEntryId = await db.behavioralExperiments.add(entry);
    }
    saveStatus = 'saved';
  }

  // Step validation
  const step1Valid = $derived(formData.belief.trim().length > 0);
  const step2Valid = $derived(formData.experiment.trim().length > 0);
  const step3Valid = $derived(formData.prediction.trim().length > 0);

  function nextStep() {
    if (currentStep < 4) currentStep++;
  }

  function prevStep() {
    if (currentStep > 1) currentStep--;
  }
</script>

<div class="experiment-form">
  <ProgressSteps
    currentStep={currentStep}
    totalSteps={4}
    stepLabels={['Belief', 'Experiment', 'Prediction', 'Schedule']}
  />

  {#if currentStep === 1}
    <!-- Step 1: Identify Belief -->
    <div class="step-content">
      <h2>What belief do you want to test?</h2>
      <CharacterCounter
        bind:value={formData.belief}
        maxLength={300}
        placeholder="e.g., If I call my doctor, I'll sound stupid"
        oninput={scheduleAutoSave}
      />

      <label>How strongly do you believe this? (0-100)</label>
      <input
        type="range"
        bind:value={formData.beliefStrength}
        min="0"
        max="100"
        step="5"
        oninput={scheduleAutoSave}
      />
      <div class="range-labels">
        <span>Not at all (0)</span>
        <span class="value">{formData.beliefStrength}</span>
        <span>Completely (100)</span>
      </div>
    </div>

    <button disabled={!step1Valid} onclick={nextStep}>Next</button>
  {/if}

  {#if currentStep === 2}
    <!-- Step 2: Design Experiment -->
    <!-- Similar structure -->
  {/if}

  {#if currentStep === 3}
    <!-- Step 3: Make Prediction -->
    <!-- Similar structure -->
  {/if}

  {#if currentStep === 4}
    <!-- Step 4: Schedule (Optional) -->
    <div class="step-content">
      <label for="plannedDate">When will you do this? (Optional)</label>
      <input
        type="date"
        id="plannedDate"
        bind:value={formData.plannedDate}
        oninput={scheduleAutoSave}
      />

      <!-- Link to planned activity (optional) -->
      <!-- Query today's planned activities and show dropdown -->
    </div>

    <button onclick={submitAndExit}>Save & Exit</button>
  {/if}

  <!-- Save status indicator -->
  {#if saveStatus === 'saving'}
    <p class="save-status">Saving...</p>
  {:else if saveStatus === 'saved'}
    <p class="save-status">Saved ✓</p>
  {/if}
</div>
```

**Key Points**:
- Use `$state()` for reactive state
- Use `$derived()` for computed values
- 500ms debounced auto-save
- Store `currentEntryId` to update existing entry
- Draft resume: Check for incomplete experiments < 24h old on mount
- Use `CharacterCounter` for text inputs (max 300 chars)
- Custom range slider for 0-100 ratings (not IntensitySlider - that's 0-100 only and can't bind undefined)

#### B. ExperimentCompletionForm.svelte
**Location**: `/src/lib/components/cbt/ExperimentCompletionForm.svelte`
**Pattern**: Explicit save
**Lines**: ~150

**Props**: `{ experiment: BehavioralExperiment }`

**Structure**:
- Show original belief, experiment, prediction (read-only)
- Add fields:
  - actualOutcome (textarea, max 300 chars)
  - learnings (textarea, max 300 chars)
  - beliefStrengthAfter (0-100 slider)
- Show before → after belief strength comparison
- "Complete Experiment" button → sets `completed=true`, `completedAt=ISO timestamp`

#### C. BehavioralExperimentHistory.svelte
**Location**: `/src/lib/components/cbt/BehavioralExperimentHistory.svelte`
**Pattern**: List view with filters
**Lines**: ~200

**Features**:
- Tabs: "Incomplete" | "Completed" | "All"
- Each card shows:
  - Belief (truncated to 80 chars with "...")
  - Status badge: "Incomplete" (yellow) or "Completed" (green)
  - Created date
  - Belief reduction (if completed): "75 → 45 (-30 points)"
  - Click → navigate to `/tools/cbt/experiment/[id]`
- Sort: Most recent first
- Empty state for each tab

### Step 3: Create Routes (4 files)

#### A. `/src/routes/tools/cbt/experiment/+page.svelte`
Hub page with:
- "Create New Experiment" button → `/tools/cbt/experiment/new`
- `<BehavioralExperimentHistory />` component

#### B. `/src/routes/tools/cbt/experiment/new/+page.svelte`
- Header with back button
- `<BehavioralExperimentForm />` component

#### C. `/src/routes/tools/cbt/experiment/[id]/+page.svelte`
- Load experiment by ID
- If `completed === false`: Show `<ExperimentCompletionForm experiment={loadedExperiment} />`
- If `completed === true`: Show read-only view with all details
- Dynamic route needs `+page.ts` with `export const prerender = false;`

#### D. `/src/routes/tools/cbt/experiment/[id]/+page.ts`
```typescript
export const prerender = false;
```

### Step 4: Update CBT Hub
**File**: `/src/routes/tools/cbt/+page.svelte`
**Lines**: 97-109 (currently "Coming Soon" card)

**Replace with**:
```svelte
<a href="{base}/tools/cbt/experiment" class="tool-card">
  <div class="tool-icon" style="background-color: #fef3c7">
    <span class="tool-emoji">🔬</span>
  </div>
  <div class="tool-content">
    <h2 class="tool-title">Behavioral Experiments</h2>
    <p class="tool-description">Test your beliefs with real-world experiments</p>
  </div>
  <svg class="tool-chevron" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
    <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
  </svg>
</a>
```

## Critical Patterns

### 1. Svelte 5 Proxy Issue
**CRITICAL**: When saving to IndexedDB, spread arrays:
```typescript
// ❌ WRONG
await db.behavioralExperiments.add({ ...formData });

// ✅ CORRECT (not needed here - no arrays in BehavioralExperiment)
// But if you add array fields later, remember to spread them
```

### 2. Auto-Save Debounce Pattern
```typescript
let saveTimeout: ReturnType<typeof setTimeout> | null = null;

function scheduleAutoSave() {
  if (saveTimeout) clearTimeout(saveTimeout);
  saveStatus = 'saving';
  saveTimeout = setTimeout(async () => {
    await saveEntry();
  }, 500);
}
```

### 3. Date Handling
```typescript
// Date field: YYYY-MM-DD
date: new Date().toISOString().split('T')[0]

// Timestamp field: Full ISO
createdAt: new Date().toISOString()
```

### 4. Optional Fields
```typescript
// Convert empty strings to undefined
plannedDate: formData.plannedDate.trim() || undefined
```

### 5. Draft Resume Pattern
```typescript
onMount(async () => {
  const incompleteExperiments = await db.behavioralExperiments
    .where('completed').equals(0)
    .toArray();

  const recentDraft = incompleteExperiments.find(exp => {
    const createdDate = new Date(exp.createdAt);
    const hoursSince = (Date.now() - createdDate.getTime()) / (1000 * 60 * 60);
    return hoursSince < 24;
  });

  if (recentDraft) {
    // Prompt user: "You have an incomplete experiment from [time ago]. Resume?"
    // If yes, load into form
  }
});
```

## Accessibility Checklist
- [ ] All interactive elements 44px minimum
- [ ] All links/buttons have aria-label or visible text
- [ ] Range sliders have aria-valuemin, aria-valuemax, aria-valuenow
- [ ] Form labels use `for` attribute or wrap inputs
- [ ] Focus rings visible on all focusable elements
- [ ] WCAG AA contrast (4.5:1 minimum)

## Testing Scenarios

### Scenario 1: Create New Experiment
1. Navigate to `/tools/cbt/experiment`
2. Click "Create New Experiment"
3. Step 1: Enter belief "If I email my friend, they'll be annoyed", strength 80
4. Step 2: Enter experiment "Send a friendly email asking how they are"
5. Step 3: Enter prediction "They'll ignore it or respond curtly", confidence 70
6. Step 4: Set planned date to tomorrow, optionally link to planned activity
7. Click "Save & Exit"
8. Verify appears in history as "Incomplete"

### Scenario 2: Complete Experiment
1. Open incomplete experiment from history
2. Fill results: "They responded warmly and asked to meet up"
3. Fill learnings: "My fear was based on assumptions, not evidence"
4. Re-rate belief: 80 → 30 (50-point reduction)
5. Click "Complete Experiment"
6. Verify shows 80 → 30 with visual indicator
7. Verify status changed to "Completed"

### Scenario 3: Auto-Save
1. Start new experiment
2. Type in belief field
3. Wait 500ms
4. Check DevTools → IndexedDB → behavioralExperiments
5. Verify entry exists with typed content
6. Refresh page
7. Verify draft resume prompt appears

## File Checklist
- [ ] `/src/lib/components/cbt/BehavioralExperimentForm.svelte` (~400 lines)
- [ ] `/src/lib/components/cbt/ExperimentCompletionForm.svelte` (~150 lines)
- [ ] `/src/lib/components/cbt/BehavioralExperimentHistory.svelte` (~200 lines)
- [ ] `/src/routes/tools/cbt/experiment/+page.svelte` (hub)
- [ ] `/src/routes/tools/cbt/experiment/new/+page.svelte` (form wrapper)
- [ ] `/src/routes/tools/cbt/experiment/[id]/+page.svelte` (detail/complete)
- [ ] `/src/routes/tools/cbt/experiment/[id]/+page.ts` (prerender = false)
- [ ] Update `/src/routes/tools/cbt/+page.svelte` (hub link)

**Total**: 8 files (7 new, 1 modified), ~750 lines

## Estimated Effort
- Components: 4-5 hours
- Routes: 1-2 hours
- Testing: 1-2 hours
- **Total**: 6-9 hours

## Next Steps After 8B
Proceed to Phase 8C (Anxiety Hierarchy) - see `PHASE_8C_COLDSTART.md`
