# Phase 8C: Anxiety Hierarchy - Cold Start Instructions

## Status
- **Database helpers**: ✅ Complete (in `/src/lib/db/index.ts`)
- **UI Components**: ❌ Not started
- **Routes**: ❌ Not started
- **Hub Integration**: ❌ Not started

## What This Feature Does
Anxiety hierarchy helps users gradually face their fears through exposure therapy. Users create a "ladder" of feared situations ranked by distress level (SUDS 0-100), then systematically expose themselves to each fear while tracking distress reduction over time.

Example: Fear of phone calls → Start with texting → Progress to calling friend → Eventually call unfamiliar people.

## Database Schema (Already Exists)
```typescript
// src/lib/db/types.ts (lines 296-325)
interface AnxietyHierarchyItem {
  id?: number;
  createdAt: string;               // ISO datetime

  // Feared situation
  situation: string;               // Description of feared situation
  category?: string;               // Optional grouping

  // Distress ratings
  initialDistress: number;         // 0-100 SUDS rating
  currentDistress: number;         // 0-100 current rating

  // Exposure tracking
  exposureAttempts: ExposureAttempt[];  // **ARRAY - must spread before save!**

  // Goal
  targetDistress?: number;         // Goal distress level
  isComplete: boolean;             // Reached target

  notes?: string;
}

interface ExposureAttempt {
  date: string;                    // YYYY-MM-DD
  distressBefore: number;          // 0-100
  distressDuring: number;          // 0-100 peak
  distressAfter: number;           // 0-100
  duration: number;                // Minutes
  notes?: string;
}
```

## Database Helpers (Already Complete)
```typescript
// src/lib/db/index.ts (lines 626-716)
getAnxietyHierarchy()                      // Get all items, sorted by currentDistress descending
getHierarchyItemById(id)                   // Get single item
addExposureAttempt(itemId, exposure)       // Add exposure + update currentDistress (handles array spreading!)
updateHierarchyDistress(itemId, newDistress)  // Update current distress
getHierarchyStats()                        // Calculate statistics
```

**CRITICAL**: The `addExposureAttempt` helper already handles the Svelte 5 proxy array spreading issue:
```typescript
const updatedAttempts = [...item.exposureAttempts, exposure]; // Spreads array!
```

## Implementation Plan

### Step 1: Create Directory Structure
```bash
mkdir -p src/routes/tools/cbt/hierarchy/new
mkdir -p src/routes/tools/cbt/hierarchy/[id]
mkdir -p src/routes/tools/cbt/hierarchy/[id]/expose
mkdir -p src/lib/components/cbt
```

### Step 2: Create Components (5 files)

#### A. HierarchyItemForm.svelte
**Location**: `/src/lib/components/cbt/HierarchyItemForm.svelte`
**Pattern**: Multi-step auto-save (4 steps)
**Lines**: ~250

**Structure**:
```svelte
<script lang="ts">
  import { db } from '$lib/db';
  import type { AnxietyHierarchyItem } from '$lib/db/types';
  import ProgressSteps from '$lib/components/common/ProgressSteps.svelte';
  import CharacterCounter from '$lib/components/common/CharacterCounter.svelte';

  let currentStep = $state(1);
  let currentEntryId: number | null = $state(null);
  let saveStatus: 'idle' | 'saving' | 'saved' = $state('idle');
  let saveTimeout: ReturnType<typeof setTimeout> | null = null;

  let formData = $state({
    situation: '',
    category: '',
    initialDistress: 50,
    targetDistress: 20  // Default: 30 points below initial
  });

  // Step validation
  const step1Valid = $derived(formData.situation.trim().length > 0);

  async function saveEntry() {
    const entry: Omit<AnxietyHierarchyItem, 'id'> = {
      createdAt: new Date().toISOString(),
      situation: formData.situation,
      category: formData.category || undefined,
      initialDistress: formData.initialDistress,
      currentDistress: formData.initialDistress,  // Same as initial at creation
      exposureAttempts: [],  // Empty array at creation
      targetDistress: formData.targetDistress,
      isComplete: false
    };

    if (currentEntryId) {
      await db.anxietyHierarchy.update(currentEntryId, entry);
    } else {
      currentEntryId = await db.anxietyHierarchy.add(entry);
    }
    saveStatus = 'saved';
  }
</script>

<!-- 4 Steps:
  1. Describe Fear (textarea, max 200 chars)
  2. Category (optional text input)
  3. Current Distress (0-100 slider)
  4. Target Goal (0-100 slider, default: initialDistress - 30)
-->
```

**Key Points**:
- Step 4: Calculate suggested target as `Math.max(10, initialDistress - 30)`
- Show info: "You don't need to reach 0 - just a manageable level"
- On submit: Redirect to `/tools/cbt/hierarchy`

#### B. HierarchyList.svelte
**Location**: `/src/lib/components/cbt/HierarchyList.svelte`
**Pattern**: Card list with filters
**Lines**: ~200

**Features**:
- Sort by: `currentDistress` descending (highest anxiety first)
- Filter: All | In Progress | Completed | Not Started
- Each card shows:
  - **Situation** (full text)
  - **Category** badge (if set)
  - **Current distress**: Large number with color
    - Green (0-33), Amber (34-66), Red (67-100)
  - **Progress bar**: Visual from initialDistress → currentDistress
  - **Exposure count**: "5 exposures" or "Not started"
  - **Status badge**: "Not started" | "In progress" (exposures > 0) | "Complete"
  - Click → navigate to `/tools/cbt/hierarchy/[id]`

**Empty state**:
```svelte
<div class="empty-state">
  <span class="text-6xl">📊</span>
  <h2>Build Your Anxiety Hierarchy</h2>
  <p>Create a ladder of feared situations ranked by distress level...</p>
  <button>Add Your First Fear</button>
</div>
```

**Card structure**:
```svelte
<div class="hierarchy-card">
  <div class="card-header">
    <h3>{item.situation}</h3>
    {#if item.category}
      <span class="category-badge">{item.category}</span>
    {/if}
  </div>

  <div class="distress-display">
    <span class="distress-number {getDistressColor(item.currentDistress)}">
      {item.currentDistress}
    </span>
    <span class="distress-label">Current Distress (SUDS)</span>
  </div>

  <div class="progress-section">
    <div class="progress-bar">
      <!-- Calculate: (initialDistress - currentDistress) / initialDistress * 100% -->
      <div class="progress-fill" style="width: {calculateProgress(item)}%"></div>
    </div>
    <div class="progress-labels">
      <span>Initial: {item.initialDistress}</span>
      {#if item.targetDistress}
        <span>Target: {item.targetDistress}</span>
      {/if}
    </div>
  </div>

  <div class="card-footer">
    <span class="exposure-count">
      {item.exposureAttempts.length} exposure{item.exposureAttempts.length !== 1 ? 's' : ''}
    </span>
    <span class="status-badge {getStatusClass(item)}">
      {getStatusText(item)}
    </span>
  </div>
</div>
```

#### C. HierarchyDetail.svelte
**Location**: `/src/lib/components/cbt/HierarchyDetail.svelte`
**Pattern**: Detail view with nested data
**Lines**: ~300

**Props**: `{ item: AnxietyHierarchyItem }`

**Sections**:
1. **Header**:
   - Situation + category
   - Initial → Current distress (large visual)
   - Target distress (if set)
   - "Mark as Complete" button (only if currentDistress <= targetDistress)

2. **Action Button**:
   - "Log New Exposure" → `/tools/cbt/hierarchy/[id]/expose`

3. **Progress Chart** (use ExposureChart component):
   - Shows exposureAttempts over time
   - Three lines: distressBefore (blue), distressDuring (orange), distressAfter (green)
   - Horizontal dashed line for targetDistress
   - X-axis: dates, Y-axis: SUDS (0-100)

4. **Exposure History**:
   - Grouped by date
   - Each entry:
     - Date/time
     - Distress: Before → During → After (with arrows)
     - Duration
     - Notes (if present)
   - Newest first

**Mark Complete Logic**:
```typescript
async function markComplete() {
  await db.anxietyHierarchy.update(item.id!, {
    isComplete: true
  });
  // Refresh or navigate back
}
```

#### D. ExposureLogForm.svelte
**Location**: `/src/lib/components/cbt/ExposureLogForm.svelte`
**Pattern**: Explicit save (like BP Logger)
**Lines**: ~200

**Props**: `{ item: AnxietyHierarchyItem }`

**Form Fields**:
1. **Context** (read-only):
   - Show situation being faced
   - Show current distress level

2. **Distress Before** (0-100 slider):
   - Default value: item.currentDistress
   - Label: "How anxious are you before starting?"

3. **Distress During (Peak)** (0-100 slider):
   - Label: "What was your peak anxiety during the exposure?"

4. **Distress After** (0-100 slider):
   - Label: "How anxious are you after finishing?"

5. **Duration** (number input):
   - Minutes, required, 1-300 range

6. **Notes** (textarea):
   - CharacterCounter, max 300 chars, optional

**Save Logic**:
```typescript
async function saveExposure() {
  const exposure: ExposureAttempt = {
    date: new Date().toISOString().split('T')[0],
    distressBefore,
    distressDuring,
    distressAfter,
    duration: duration as number,
    notes: notes.trim() || undefined
  };

  // Use helper that handles array spreading!
  await addExposureAttempt(item.id!, exposure);

  saveStatus = 'saved';
  // Show success, then navigate back to detail view
}
```

**Success View**:
- Show saved exposure details
- Visual: distressBefore → distressDuring → distressAfter with arrows
- "View Progress" button → back to `/tools/cbt/hierarchy/[id]`

#### E. ExposureChart.svelte
**Location**: `/src/lib/components/cbt/ExposureChart.svelte`
**Pattern**: Chart visualization
**Lines**: ~150

**Props**: `{ exposureAttempts: ExposureAttempt[], targetDistress?: number }`

**Chart Type**: Line chart (similar to MoodTrendChart)
- **Library**: Chart.js (already imported in Insights phase)
- **X-axis**: Dates from exposureAttempts
- **Y-axis**: SUDS (0-100)
- **Three lines**:
  - distressBefore (blue solid line)
  - distressDuring (orange solid line)
  - distressAfter (green solid line)
- **Target line**: Horizontal dashed line at targetDistress (if set)

**Empty State**: "No exposures yet. Log your first exposure to see progress."

**Chart Config**:
```typescript
const chartData = {
  labels: exposureAttempts.map(e => formatDate(e.date)),
  datasets: [
    {
      label: 'Before',
      data: exposureAttempts.map(e => e.distressBefore),
      borderColor: '#3b82f6',  // blue
      backgroundColor: 'rgba(59, 130, 246, 0.1)',
      tension: 0.1
    },
    {
      label: 'During (Peak)',
      data: exposureAttempts.map(e => e.distressDuring),
      borderColor: '#f59e0b',  // amber
      backgroundColor: 'rgba(245, 158, 11, 0.1)',
      tension: 0.1
    },
    {
      label: 'After',
      data: exposureAttempts.map(e => e.distressAfter),
      borderColor: '#10b981',  // green
      backgroundColor: 'rgba(16, 185, 129, 0.1)',
      tension: 0.1
    }
  ]
};

const chartOptions = {
  scales: {
    y: {
      min: 0,
      max: 100,
      title: { display: true, text: 'SUDS Rating' }
    }
  },
  plugins: {
    annotation: targetDistress ? {
      annotations: {
        targetLine: {
          type: 'line',
          yMin: targetDistress,
          yMax: targetDistress,
          borderColor: '#6b7280',
          borderWidth: 2,
          borderDash: [5, 5],
          label: { content: 'Target', enabled: true }
        }
      }
    } : undefined
  }
};
```

### Step 3: Create Routes (5 files)

#### A. `/src/routes/tools/cbt/hierarchy/+page.svelte`
Hub page:
- "Add New Fear" button → `/tools/cbt/hierarchy/new`
- `<HierarchyList />` component

#### B. `/src/routes/tools/cbt/hierarchy/new/+page.svelte`
- Header with back button
- `<HierarchyItemForm />` component

#### C. `/src/routes/tools/cbt/hierarchy/[id]/+page.svelte`
- Load item by ID
- Show `<HierarchyDetail item={loadedItem} />`
- Dynamic route needs `+page.ts` with `export const prerender = false;`

#### D. `/src/routes/tools/cbt/hierarchy/[id]/+page.ts`
```typescript
export const prerender = false;
```

#### E. `/src/routes/tools/cbt/hierarchy/[id]/expose/+page.svelte`
- Load item by ID
- Show `<ExposureLogForm item={loadedItem} />`
- Header with back button to detail view

### Step 4: Update CBT Hub
**File**: `/src/routes/tools/cbt/+page.svelte`
**Lines**: 112-123 (currently "Coming Soon" card)

**Replace with**:
```svelte
<a href="{base}/tools/cbt/hierarchy" class="tool-card">
  <div class="tool-icon" style="background-color: #dbeafe">
    <span class="tool-emoji">📊</span>
  </div>
  <div class="tool-content">
    <h2 class="tool-title">Anxiety Hierarchy</h2>
    <p class="tool-description">Build an exposure ladder to gradually face your fears</p>
  </div>
  <svg class="tool-chevron" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
    <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
  </svg>
</a>
```

## Critical Patterns

### 1. Svelte 5 Proxy + Nested Arrays (CRITICAL!)
**The `addExposureAttempt` helper already handles this**, but if you manually update:

```typescript
// ❌ WRONG - Svelte 5 proxy arrays can't be cloned by IndexedDB
await db.anxietyHierarchy.update(item.id, {
  exposureAttempts: [...item.exposureAttempts, newExposure]
});

// ✅ CORRECT - Use the helper
await addExposureAttempt(item.id, newExposure);

// Or if doing it manually:
const updatedAttempts = [...item.exposureAttempts, newExposure];  // Spread!
await db.anxietyHierarchy.update(item.id, {
  exposureAttempts: updatedAttempts,
  currentDistress: newExposure.distressAfter
});
```

### 2. SUDS Color Coding
```typescript
function getDistressColor(suds: number): string {
  if (suds <= 33) return 'text-green-600';
  if (suds <= 66) return 'text-amber-600';
  return 'text-red-600';
}
```

### 3. Progress Calculation
```typescript
function calculateProgress(item: AnxietyHierarchyItem): number {
  const reduction = item.initialDistress - item.currentDistress;
  const maxReduction = item.targetDistress
    ? item.initialDistress - item.targetDistress
    : item.initialDistress;
  return Math.round((reduction / maxReduction) * 100);
}
```

### 4. Status Determination
```typescript
function getStatusText(item: AnxietyHierarchyItem): string {
  if (item.isComplete) return 'Complete';
  if (item.exposureAttempts.length === 0) return 'Not started';
  return 'In progress';
}
```

### 5. Chart.js Import
```typescript
import { Chart, registerables } from 'chart.js';
import { onMount } from 'svelte';

onMount(() => {
  Chart.register(...registerables);
  // Create chart
});
```

## Accessibility Checklist
- [ ] All sliders: 44px thumbs minimum
- [ ] Sliders have aria-valuemin="0", aria-valuemax="100", aria-valuenow={value}
- [ ] Chart has descriptive aria-label
- [ ] "Mark Complete" button has confirmation dialog
- [ ] Card links have hover/focus states with visible rings
- [ ] Empty states have actionable CTAs

## Testing Scenarios

### Scenario 1: Create Hierarchy Item
1. Navigate to `/tools/cbt/hierarchy`, click "Add New Fear"
2. Step 1: "Calling unknown person", distress 70
3. Step 2: Category "Social"
4. Step 3: Confirm distress 70
5. Step 4: Set target 30 (suggested 40)
6. Save → appears in list with red badge (70), "Not started"

### Scenario 2: Log First Exposure
1. Click item from list → detail view
2. Click "Log New Exposure"
3. Distress before: 70 (pre-filled)
4. Distress during: 80 (peak)
5. Distress after: 50
6. Duration: 5 minutes
7. Notes: "Hands shook but I got through it"
8. Save → success view, then back to detail
9. Verify chart shows first data point
10. Verify currentDistress updated to 50

### Scenario 3: Track Habituation
1. Log 5 more exposures over 2 weeks
2. Each exposure: after-distress decreases (50 → 45 → 40 → 35 → 30)
3. Chart shows downward trend in "After" line
4. When currentDistress reaches 30 (target), "Mark as Complete" button appears
5. Click "Mark as Complete"
6. Status changes to "Complete" with green badge

### Scenario 4: Array Spreading Verification
1. After logging exposure, open DevTools → Application → IndexedDB
2. Navigate to `anxietyHierarchy` table
3. Find the item, expand `exposureAttempts` array
4. Verify it's a plain array (not Proxy)
5. Verify new exposure is appended correctly

## File Checklist
- [ ] `/src/lib/components/cbt/HierarchyItemForm.svelte` (~250 lines)
- [ ] `/src/lib/components/cbt/HierarchyList.svelte` (~200 lines)
- [ ] `/src/lib/components/cbt/HierarchyDetail.svelte` (~300 lines)
- [ ] `/src/lib/components/cbt/ExposureLogForm.svelte` (~200 lines)
- [ ] `/src/lib/components/cbt/ExposureChart.svelte` (~150 lines)
- [ ] `/src/routes/tools/cbt/hierarchy/+page.svelte` (hub)
- [ ] `/src/routes/tools/cbt/hierarchy/new/+page.svelte` (form wrapper)
- [ ] `/src/routes/tools/cbt/hierarchy/[id]/+page.svelte` (detail)
- [ ] `/src/routes/tools/cbt/hierarchy/[id]/+page.ts` (prerender = false)
- [ ] `/src/routes/tools/cbt/hierarchy/[id]/expose/+page.svelte` (log exposure)
- [ ] Update `/src/routes/tools/cbt/+page.svelte` (hub link)

**Total**: 12 files (11 new, 1 modified), ~1,100 lines

## Estimated Effort
- Components: 6-8 hours (chart complexity)
- Routes: 2-3 hours
- Testing: 2-3 hours
- **Total**: 10-14 hours

## Dependencies
- Chart.js (already installed in Phase 6)
- No additional npm packages needed

## Completion
After Phase 8C, **all Phase 8 features are complete**. The app will have:
- ✅ Activities tracking (exercise logging)
- ✅ Behavioral experiments (belief testing)
- ✅ Anxiety hierarchy (exposure therapy)

Next phase (if any) would be Phase 9 or feature enhancements based on user feedback.
