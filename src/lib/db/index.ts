// src/lib/db/index.ts
// Mental Wellness Companion - Dexie Database Initialization

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
  EnergyLog,
  TaskBreakdown,
  RoutineTemplate,
  SpecialInterest,
  InterestSession,
  UserProfile,
  Settings
} from './types';

export class MentalWellnessDB extends Dexie {
  // Mood & Health
  moodLogs!: Table<MoodLog>;
  anxietyEpisodes!: Table<AnxietyEpisode>;
  bpReadings!: Table<BPReading>;

  // Activities
  activities!: Table<Activity>;
  plannedActivities!: Table<PlannedActivity>;
  activityLibrary!: Table<ActivityLibraryItem>;

  // CBT Tools
  thoughtRecords!: Table<ThoughtRecord>;
  behavioralExperiments!: Table<BehavioralExperiment>;
  anxietyHierarchy!: Table<AnxietyHierarchyItem>;

  // Mindfulness
  mindfulnessSessions!: Table<MindfulnessSession>;

  // Autism Productivity Features
  energyLogs!: Table<EnergyLog>;
  taskBreakdowns!: Table<TaskBreakdown>;
  routineTemplates!: Table<RoutineTemplate>;
  specialInterests!: Table<SpecialInterest>;
  interestSessions!: Table<InterestSession>;

  // User
  userProfile!: Table<UserProfile>;
  settings!: Table<Settings>;

  constructor() {
    super('MentalWellnessDB');

    this.version(1).stores({
      // Mood & Health - indexed by date for quick lookups
      moodLogs: '++id, date, timestamp, mood, anxiety',
      anxietyEpisodes: '++id, date, startTime, endTime',
      bpReadings: '++id, date, timestamp, linkedEpisodeId, isAnxietyRelated',

      // Activities
      activities: '++id, date, timestamp, type',
      plannedActivities: '++id, date, timeBlock, completed, category',
      activityLibrary: '++id, name, category, isDefault',

      // CBT Tools
      thoughtRecords: '++id, date, timestamp, emotion, isComplete',
      behavioralExperiments: '++id, date, completed, plannedDate',
      anxietyHierarchy: '++id, situation, currentDistress, isComplete',

      // Mindfulness
      mindfulnessSessions: '++id, date, timestamp, practiceType, completed',

      // User (single record tables)
      userProfile: '++id',
      settings: '++id'
    });

    // Version 2: Add autism productivity features
    this.version(2).stores({
      // Existing tables (keep all indexes)
      moodLogs: '++id, date, timestamp, mood, anxiety',
      anxietyEpisodes: '++id, date, startTime, endTime',
      bpReadings: '++id, date, timestamp, linkedEpisodeId, isAnxietyRelated',
      activities: '++id, date, timestamp, type',
      plannedActivities: '++id, date, timeBlock, completed, category',
      activityLibrary: '++id, name, category, isDefault',
      thoughtRecords: '++id, date, timestamp, emotion, isComplete',
      behavioralExperiments: '++id, date, completed, plannedDate',
      anxietyHierarchy: '++id, situation, currentDistress, isComplete',
      mindfulnessSessions: '++id, date, timestamp, practiceType, completed',
      userProfile: '++id',
      settings: '++id',

      // New tables for autism productivity
      energyLogs: '++id, date, timestamp',
      taskBreakdowns: '++id, createdAt, status, isTemplate, templateCategory',
      routineTemplates: '++id, name, isDefault, timesUsed',
      specialInterests: '++id, name, category, currentlyActive, createdAt',
      interestSessions: '++id, interestId, date, timestamp, sessionType'
    });
  }
}

// Create singleton instance
export const db = new MentalWellnessDB();

// ============================================
// INITIALIZATION HELPERS
// ============================================

/**
 * Initialize database with default data if empty
 */
export async function initializeDatabase(): Promise<void> {
  // Check if activity library is empty and seed it
  const activityCount = await db.activityLibrary.count();
  if (activityCount === 0) {
    await seedActivityLibrary();
  }

  // Check if settings exist and create defaults
  const settingsCount = await db.settings.count();
  if (settingsCount === 0) {
    await createDefaultSettings();
  }

  // Ensure user profile exists
  const profileCount = await db.userProfile.count();
  if (profileCount === 0) {
    await db.userProfile.add({
      hasPacemaker: false,
      hasCardiacMonitor: false,
      onboardingCompleted: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
  }
}

/**
 * Seed activity library with default suggestions
 */
async function seedActivityLibrary(): Promise<void> {
  const defaultActivities: Omit<ActivityLibraryItem, 'id'>[] = [
    // Social (medium-high energy due to social interaction demands)
    { name: 'Call a family member', category: 'social', description: 'Reach out to a loved one', estimatedDuration: 15, spoonCost: 4, isDefault: true, timesCompleted: 0 },
    { name: 'Video chat with friend', category: 'social', description: 'Face-to-face connection from home', estimatedDuration: 30, spoonCost: 7, isDefault: true, timesCompleted: 0 },
    { name: 'Coffee with neighbor', category: 'social', description: 'Brief social interaction', estimatedDuration: 30, spoonCost: 8, isDefault: true, timesCompleted: 0 },
    { name: 'Write a letter or email', category: 'social', description: 'Thoughtful connection', estimatedDuration: 20, spoonCost: 4, isDefault: true, timesCompleted: 0 },

    // Creative (variable energy, mostly medium)
    { name: 'Listen to favorite music', category: 'creative', description: 'Enjoy music mindfully', estimatedDuration: 20, spoonCost: 1, isDefault: true, timesCompleted: 0 },
    { name: 'Try a new recipe', category: 'creative', description: 'Cooking something different', estimatedDuration: 45, spoonCost: 7, isDefault: true, timesCompleted: 0 },
    { name: 'Photography walk', category: 'creative', description: 'Take photos of interesting things', estimatedDuration: 30, spoonCost: 5, isDefault: true, timesCompleted: 0 },
    { name: 'Write in journal', category: 'creative', description: 'Free writing or reflection', estimatedDuration: 15, spoonCost: 2, isDefault: true, timesCompleted: 0 },
    { name: 'Drawing or coloring', category: 'creative', description: 'Visual creative expression', estimatedDuration: 30, spoonCost: 4, isDefault: true, timesCompleted: 0 },

    // Physical (high energy, except gentle activities)
    { name: 'Stationary cycling', category: 'physical', description: 'Indoor cycling routine', estimatedDuration: 30, spoonCost: 8, isDefault: true, timesCompleted: 0 },
    { name: 'Resistance band exercises', category: 'physical', description: 'Upper body strengthening', estimatedDuration: 20, spoonCost: 7, isDefault: true, timesCompleted: 0 },
    { name: 'Stretching routine', category: 'physical', description: 'Full body stretch', estimatedDuration: 15, spoonCost: 4, isDefault: true, timesCompleted: 0 },
    { name: 'Tai chi practice', category: 'physical', description: 'Gentle flowing movement', estimatedDuration: 20, spoonCost: 5, isDefault: true, timesCompleted: 0 },
    { name: 'Walk outside', category: 'physical', description: 'Neighborhood walk', estimatedDuration: 20, spoonCost: 6, isDefault: true, timesCompleted: 0 },
    { name: 'Gardening', category: 'physical', description: 'Outdoor activity with purpose', estimatedDuration: 30, spoonCost: 8, isDefault: true, timesCompleted: 0 },

    // Learning (medium energy, mental effort)
    { name: 'Read a book', category: 'learning', description: 'Engage with a good book', estimatedDuration: 30, spoonCost: 3, isDefault: true, timesCompleted: 0 },
    { name: 'Crossword or puzzle', category: 'learning', description: 'Mental challenge', estimatedDuration: 20, spoonCost: 5, isDefault: true, timesCompleted: 0 },
    { name: 'Watch educational video', category: 'learning', description: 'Learn something new', estimatedDuration: 30, spoonCost: 3, isDefault: true, timesCompleted: 0 },
    { name: 'Practice a language', category: 'learning', description: 'Language learning app or study', estimatedDuration: 15, spoonCost: 5, isDefault: true, timesCompleted: 0 },

    // Mastery (medium-high energy, executive function demands)
    { name: 'Organize a drawer or closet', category: 'mastery', description: 'Small organizing project', estimatedDuration: 20, spoonCost: 6, isDefault: true, timesCompleted: 0 },
    { name: 'Fix something small', category: 'mastery', description: 'Minor repair or improvement', estimatedDuration: 30, spoonCost: 7, isDefault: true, timesCompleted: 0 },
    { name: 'Sort through paperwork', category: 'mastery', description: 'Administrative task', estimatedDuration: 30, spoonCost: 6, isDefault: true, timesCompleted: 0 },
    { name: 'Clean one room', category: 'mastery', description: 'Focused cleaning task', estimatedDuration: 30, spoonCost: 8, isDefault: true, timesCompleted: 0 },
    { name: 'Plan meals for the week', category: 'mastery', description: 'Meal planning', estimatedDuration: 20, spoonCost: 5, isDefault: true, timesCompleted: 0 },

    // Pleasure (low energy, restorative)
    { name: 'Watch favorite show', category: 'pleasure', description: 'Relaxing entertainment', estimatedDuration: 45, spoonCost: 2, isDefault: true, timesCompleted: 0 },
    { name: 'Sit outside in nature', category: 'pleasure', description: 'Enjoy fresh air', estimatedDuration: 15, spoonCost: 2, isDefault: true, timesCompleted: 0 },
    { name: 'Take a relaxing bath', category: 'pleasure', description: 'Self-care relaxation', estimatedDuration: 30, spoonCost: 3, isDefault: true, timesCompleted: 0 },
    { name: 'Enjoy a cup of tea/coffee', category: 'pleasure', description: 'Mindful beverage break', estimatedDuration: 15, spoonCost: 1, isDefault: true, timesCompleted: 0 },
    { name: 'Pet or play with animal', category: 'pleasure', description: 'Animal companionship', estimatedDuration: 15, spoonCost: 1, isDefault: true, timesCompleted: 0 },
    { name: 'Look at old photos', category: 'pleasure', description: 'Pleasant memories', estimatedDuration: 20, spoonCost: 2, isDefault: true, timesCompleted: 0 },
  ];

  await db.activityLibrary.bulkAdd(defaultActivities);
}

/**
 * Create default settings
 */
async function createDefaultSettings(): Promise<void> {
  const defaultSettings: Omit<Settings, 'id'> = {
    theme: 'light',
    fontSize: 'large',           // Larger default for 64+ user
    highContrast: false,
    reducedMotion: false,
    
    notificationsEnabled: true,
    morningCheckInTime: '08:00',
    eveningReviewTime: '20:00',
    activityReminders: true,
    
    defaultBreathingRounds: 4,
    defaultMindfulnessDuration: 5,
    
    autoBackup: false,
    
    weeklyMindfulnessGoal: 5,
    weeklyActivityGoal: 14,       // 2 per day
    weeklyThoughtRecordGoal: 2,
    
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  await db.settings.add(defaultSettings);
}

// ============================================
// QUERY HELPERS
// ============================================

/**
 * Get mood logs for a date range
 */
export async function getMoodLogs(startDate: string, endDate: string): Promise<MoodLog[]> {
  return db.moodLogs
    .where('date')
    .between(startDate, endDate, true, true)
    .sortBy('timestamp');
}

/**
 * Get today's mood logs
 */
export async function getTodaysMoodLogs(): Promise<MoodLog[]> {
  const today = new Date().toISOString().split('T')[0];
  return db.moodLogs.where('date').equals(today).toArray();
}

/**
 * Get planned activities for a date
 */
export async function getPlannedActivities(date: string): Promise<PlannedActivity[]> {
  return db.plannedActivities
    .where('date')
    .equals(date)
    .sortBy('timeBlock');
}

/**
 * Get activity library by category
 */
export async function getActivityLibraryByCategory(category?: string): Promise<ActivityLibraryItem[]> {
  if (category) {
    return db.activityLibrary.where('category').equals(category).toArray();
  }
  return db.activityLibrary.toArray();
}

/**
 * Get recent anxiety episodes
 */
export async function getRecentAnxietyEpisodes(days: number = 7): Promise<AnxietyEpisode[]> {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  const startDateStr = startDate.toISOString().split('T')[0];
  
  return db.anxietyEpisodes
    .where('date')
    .aboveOrEqual(startDateStr)
    .reverse()
    .sortBy('startTime');
}

/**
 * Get BP readings for a date range
 */
export async function getBPReadings(startDate: string, endDate: string): Promise<BPReading[]> {
  return db.bpReadings
    .where('date')
    .between(startDate, endDate, true, true)
    .sortBy('timestamp');
}

/**
 * Get incomplete thought records
 */
export async function getIncompleteThoughtRecords(): Promise<ThoughtRecord[]> {
  return db.thoughtRecords.where('isComplete').equals(0).toArray();
}

/**
 * Get thought records for date range
 */
export async function getThoughtRecords(startDate: string, endDate: string): Promise<ThoughtRecord[]> {
  return db.thoughtRecords
    .where('date')
    .between(startDate, endDate, true, true)
    .reverse()
    .sortBy('timestamp');
}

/**
 * Get thought record statistics
 */
export async function getThoughtRecordStats(
  startDate: string,
  endDate: string
): Promise<{
  total: number;
  completed: number;
  avgEmotionBefore: number;
  avgEmotionAfter: number;
  avgReduction: number;
  topDistortions: string[];
}> {
  const records = await getThoughtRecords(startDate, endDate);
  const completed = records.filter(r => r.isComplete);

  if (completed.length === 0) {
    return {
      total: 0,
      completed: 0,
      avgEmotionBefore: 0,
      avgEmotionAfter: 0,
      avgReduction: 0,
      topDistortions: []
    };
  }

  const avgBefore = completed.reduce((sum, r) => sum + r.emotionIntensity, 0) / completed.length;
  const avgAfter = completed.reduce((sum, r) => sum + r.outcomeIntensity, 0) / completed.length;

  // Count distortion frequency
  const distortionCounts: Record<string, number> = {};
  completed.forEach(r => {
    r.distortions.forEach(d => {
      distortionCounts[d] = (distortionCounts[d] || 0) + 1;
    });
  });

  const topDistortions = Object.entries(distortionCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([d]) => d);

  return {
    total: records.length,
    completed: completed.length,
    avgEmotionBefore: Math.round(avgBefore),
    avgEmotionAfter: Math.round(avgAfter),
    avgReduction: Math.round(avgBefore - avgAfter),
    topDistortions
  };
}

/**
 * Get mindfulness sessions for date range
 */
export async function getMindfulnessSessions(startDate: string, endDate: string): Promise<MindfulnessSession[]> {
  return db.mindfulnessSessions
    .where('date')
    .between(startDate, endDate, true, true)
    .toArray();
}

/**
 * Get current settings
 */
export async function getSettings(): Promise<Settings | undefined> {
  return db.settings.toCollection().first();
}

/**
 * Update settings
 */
export async function updateSettings(updates: Partial<Settings>): Promise<void> {
  const current = await getSettings();
  if (current?.id) {
    await db.settings.update(current.id, {
      ...updates,
      updatedAt: new Date().toISOString()
    });
  }
}

/**
 * Get or create user profile
 */
export async function getUserProfile(): Promise<UserProfile | undefined> {
  return db.userProfile.toCollection().first();
}

/**
 * Update user profile (create if doesn't exist)
 */
export async function updateUserProfile(updates: Partial<UserProfile>): Promise<void> {
  const profile = await getUserProfile();

  if (profile?.id) {
    await db.userProfile.update(profile.id, {
      ...updates,
      updatedAt: new Date().toISOString()
    });
  } else {
    await db.userProfile.add({
      ...updates,
      hasPacemaker: updates.hasPacemaker ?? false,
      hasCardiacMonitor: updates.hasCardiacMonitor ?? false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
  }
}

/**
 * Mark onboarding as completed
 */
export async function completeOnboarding(): Promise<void> {
  await updateUserProfile({
    onboardingCompleted: true,
    onboardingCompletedAt: new Date().toISOString()
  });
}

/**
 * Check if onboarding is needed
 */
export async function needsOnboarding(): Promise<boolean> {
  const profile = await getUserProfile();
  return !profile?.onboardingCompleted && !profile?.onboardingSkipped;
}

// ============================================
// STATISTICS HELPERS
// ============================================

/**
 * Calculate average mood for date range
 */
export async function getAverageMood(startDate: string, endDate: string): Promise<{ avgMood: number; avgAnxiety: number; count: number }> {
  const logs = await getMoodLogs(startDate, endDate);
  
  if (logs.length === 0) {
    return { avgMood: 0, avgAnxiety: 0, count: 0 };
  }
  
  const totals = logs.reduce(
    (acc, log) => ({
      mood: acc.mood + log.mood,
      anxiety: acc.anxiety + log.anxiety
    }),
    { mood: 0, anxiety: 0 }
  );
  
  return {
    avgMood: Math.round((totals.mood / logs.length) * 10) / 10,
    avgAnxiety: Math.round((totals.anxiety / logs.length) * 10) / 10,
    count: logs.length
  };
}

/**
 * Count completed activities for date range
 */
export async function getActivityCompletionStats(startDate: string, endDate: string): Promise<{ planned: number; completed: number; rate: number }> {
  const activities = await db.plannedActivities
    .where('date')
    .between(startDate, endDate, true, true)
    .toArray();
  
  const completed = activities.filter(a => a.completed).length;
  const planned = activities.length;
  
  return {
    planned,
    completed,
    rate: planned > 0 ? Math.round((completed / planned) * 100) : 0
  };
}

/**
 * Get mindfulness minutes for date range
 */
export async function getMindfulnessMinutes(startDate: string, endDate: string): Promise<number> {
  const sessions = await getMindfulnessSessions(startDate, endDate);
  return sessions.reduce((total, session) => total + (session.durationActual || session.durationPlanned), 0);
}

// ============================================
// ACTIVITIES TRACKING (Phase 8A)
// ============================================

/**
 * Get activities for a date range
 */
export async function getActivities(startDate: string, endDate: string): Promise<Activity[]> {
  return db.activities
    .where('date')
    .between(startDate, endDate, true, true)
    .reverse()
    .sortBy('timestamp');
}

/**
 * Get recent activities
 */
export async function getRecentActivities(days: number = 30): Promise<Activity[]> {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  const startDateStr = startDate.toISOString().split('T')[0];

  return db.activities
    .where('date')
    .aboveOrEqual(startDateStr)
    .reverse()
    .sortBy('timestamp');
}

/**
 * Get activity statistics
 */
export async function getActivityStats(
  startDate: string,
  endDate: string
): Promise<{
  total: number;
  totalMinutes: number;
  byType: Record<string, number>;
  byIntensity: Record<string, number>;
  avgEnjoyment: number;
  avgMastery: number;
}> {
  const activities = await getActivities(startDate, endDate);

  if (activities.length === 0) {
    return {
      total: 0,
      totalMinutes: 0,
      byType: {},
      byIntensity: {},
      avgEnjoyment: 0,
      avgMastery: 0
    };
  }

  const totalMinutes = activities.reduce((sum, a) => sum + a.duration, 0);

  const byType: Record<string, number> = {};
  activities.forEach(a => {
    byType[a.type] = (byType[a.type] || 0) + 1;
  });

  const byIntensity: Record<string, number> = {};
  activities.forEach(a => {
    if (a.intensity) {
      byIntensity[a.intensity] = (byIntensity[a.intensity] || 0) + 1;
    }
  });

  const withEnjoyment = activities.filter(a => a.enjoyment !== undefined);
  const avgEnjoyment = withEnjoyment.length > 0
    ? withEnjoyment.reduce((sum, a) => sum + (a.enjoyment || 0), 0) / withEnjoyment.length
    : 0;

  const withMastery = activities.filter(a => a.mastery !== undefined);
  const avgMastery = withMastery.length > 0
    ? withMastery.reduce((sum, a) => sum + (a.mastery || 0), 0) / withMastery.length
    : 0;

  return {
    total: activities.length,
    totalMinutes,
    byType,
    byIntensity,
    avgEnjoyment: Math.round(avgEnjoyment * 10) / 10,
    avgMastery: Math.round(avgMastery * 10) / 10
  };
}

// ============================================
// BEHAVIORAL EXPERIMENTS (Phase 8B)
// ============================================

/**
 * Get behavioral experiments for date range
 */
export async function getBehavioralExperiments(startDate: string, endDate: string): Promise<BehavioralExperiment[]> {
  return db.behavioralExperiments
    .where('date')
    .between(startDate, endDate, true, true)
    .reverse()
    .sortBy('createdAt');
}

/**
 * Get incomplete experiments
 */
export async function getIncompleteExperiments(): Promise<BehavioralExperiment[]> {
  return db.behavioralExperiments
    .where('completed')
    .equals(0)
    .reverse()
    .sortBy('createdAt');
}

/**
 * Get experiment by ID
 */
export async function getExperimentById(id: number): Promise<BehavioralExperiment | undefined> {
  return db.behavioralExperiments.get(id);
}

/**
 * Get experiment statistics
 */
export async function getExperimentStats(
  startDate: string,
  endDate: string
): Promise<{
  total: number;
  completed: number;
  avgBeliefReduction: number;
  avgPredictionAccuracy: number;
}> {
  const experiments = await getBehavioralExperiments(startDate, endDate);
  const completed = experiments.filter(e => e.completed);

  if (completed.length === 0) {
    return {
      total: experiments.length,
      completed: 0,
      avgBeliefReduction: 0,
      avgPredictionAccuracy: 0
    };
  }

  const beliefReductions = completed
    .filter(e => e.beliefStrengthAfter !== undefined)
    .map(e => e.beliefStrength - (e.beliefStrengthAfter || 0));

  const avgBeliefReduction = beliefReductions.length > 0
    ? beliefReductions.reduce((sum, r) => sum + r, 0) / beliefReductions.length
    : 0;

  return {
    total: experiments.length,
    completed: completed.length,
    avgBeliefReduction: Math.round(avgBeliefReduction),
    avgPredictionAccuracy: 0 // Could be calculated based on outcome vs prediction
  };
}

// ============================================
// ANXIETY HIERARCHY (Phase 8C)
// ============================================

/**
 * Get all anxiety hierarchy items
 */
export async function getAnxietyHierarchy(): Promise<AnxietyHierarchyItem[]> {
  return db.anxietyHierarchy
    .orderBy('currentDistress')
    .reverse()
    .toArray();
}

/**
 * Get hierarchy item by ID
 */
export async function getHierarchyItemById(id: number): Promise<AnxietyHierarchyItem | undefined> {
  return db.anxietyHierarchy.get(id);
}

/**
 * Add exposure attempt to hierarchy item
 */
export async function addExposureAttempt(itemId: number, exposure: ExposureAttempt): Promise<void> {
  const item = await db.anxietyHierarchy.get(itemId);
  if (!item) {
    throw new Error('Hierarchy item not found');
  }

  // CRITICAL: Spread array to avoid Svelte 5 proxy issue
  const updatedAttempts = [...item.exposureAttempts, exposure];

  await db.anxietyHierarchy.update(itemId, {
    exposureAttempts: updatedAttempts,
    currentDistress: exposure.distressAfter
  });
}

/**
 * Update hierarchy item distress
 */
export async function updateHierarchyDistress(itemId: number, newDistress: number): Promise<void> {
  await db.anxietyHierarchy.update(itemId, {
    currentDistress: newDistress
  });
}

/**
 * Get hierarchy statistics
 */
export async function getHierarchyStats(): Promise<{
  total: number;
  completed: number;
  inProgress: number;
  avgDistressReduction: number;
  totalExposures: number;
}> {
  const items = await db.anxietyHierarchy.toArray();

  if (items.length === 0) {
    return {
      total: 0,
      completed: 0,
      inProgress: 0,
      avgDistressReduction: 0,
      totalExposures: 0
    };
  }

  const completed = items.filter(i => i.isComplete).length;
  const inProgress = items.filter(i => !i.isComplete && i.exposureAttempts.length > 0).length;

  const distressReductions = items
    .filter(i => i.exposureAttempts.length > 0)
    .map(i => i.initialDistress - i.currentDistress);

  const avgDistressReduction = distressReductions.length > 0
    ? distressReductions.reduce((sum, r) => sum + r, 0) / distressReductions.length
    : 0;

  const totalExposures = items.reduce((sum, i) => sum + i.exposureAttempts.length, 0);

  return {
    total: items.length,
    completed,
    inProgress,
    avgDistressReduction: Math.round(avgDistressReduction),
    totalExposures
  };
}

// ============================================
// AUTISM PRODUCTIVITY FEATURES
// ============================================

/**
 * Get energy logs for a date range
 */
export async function getEnergyLogs(startDate: string, endDate: string): Promise<EnergyLog[]> {
  return db.energyLogs
    .where('date')
    .between(startDate, endDate, true, true)
    .sortBy('date');
}

/**
 * Get today's energy log
 */
export async function getTodayEnergyLog(): Promise<EnergyLog | undefined> {
  const today = new Date().toISOString().split('T')[0];
  return db.energyLogs.where('date').equals(today).first();
}

/**
 * Get latest energy log (most recent)
 */
export async function getLatestEnergyLog(): Promise<EnergyLog | undefined> {
  return db.energyLogs
    .orderBy('timestamp')
    .reverse()
    .first();
}

/**
 * Get task breakdowns (optionally filter by status or template)
 */
export async function getTaskBreakdowns(options?: {
  status?: 'draft' | 'ready' | 'in-progress' | 'completed' | 'abandoned';
  templatesOnly?: boolean;
}): Promise<TaskBreakdown[]> {
  let query = db.taskBreakdowns.toCollection();

  if (options?.status) {
    query = db.taskBreakdowns.where('status').equals(options.status);
  }

  if (options?.templatesOnly) {
    query = db.taskBreakdowns.where('isTemplate').equals(1);
  }

  return query.reverse().sortBy('createdAt');
}

/**
 * Get task breakdown templates by category
 */
export async function getTaskBreakdownTemplates(category?: string): Promise<TaskBreakdown[]> {
  if (category) {
    return db.taskBreakdowns
      .where({ isTemplate: 1, templateCategory: category })
      .reverse()
      .sortBy('timesUsed');
  }
  return db.taskBreakdowns
    .where('isTemplate')
    .equals(1)
    .reverse()
    .sortBy('timesUsed');
}

/**
 * Get in-progress task breakdowns
 */
export async function getInProgressTaskBreakdowns(): Promise<TaskBreakdown[]> {
  return db.taskBreakdowns
    .where('status')
    .equals('in-progress')
    .reverse()
    .sortBy('startedAt');
}

/**
 * Get task breakdown by ID
 */
export async function getTaskBreakdownById(id: number): Promise<TaskBreakdown | undefined> {
  return db.taskBreakdowns.get(id);
}

/**
 * Get all routine templates
 */
export async function getRoutineTemplates(): Promise<RoutineTemplate[]> {
  return db.routineTemplates
    .orderBy('timesUsed')
    .reverse()
    .toArray();
}

/**
 * Get default routine templates
 */
export async function getDefaultRoutineTemplates(): Promise<RoutineTemplate[]> {
  return db.routineTemplates
    .where('isDefault')
    .equals(1)
    .toArray();
}

/**
 * Get routine template by ID
 */
export async function getRoutineTemplateById(id: number): Promise<RoutineTemplate | undefined> {
  return db.routineTemplates.get(id);
}

/**
 * Get all special interests
 */
export async function getSpecialInterests(): Promise<SpecialInterest[]> {
  return db.specialInterests
    .orderBy('createdAt')
    .reverse()
    .toArray();
}

/**
 * Get currently active special interests
 */
export async function getActiveSpecialInterests(): Promise<SpecialInterest[]> {
  return db.specialInterests
    .where('currentlyActive')
    .equals(1)
    .reverse()
    .sortBy('createdAt');
}

/**
 * Get special interests by category
 */
export async function getSpecialInterestsByCategory(category: string): Promise<SpecialInterest[]> {
  return db.specialInterests
    .where('category')
    .equals(category)
    .toArray();
}

/**
 * Get special interest by ID
 */
export async function getSpecialInterestById(id: number): Promise<SpecialInterest | undefined> {
  return db.specialInterests.get(id);
}

/**
 * Get interest sessions for a specific interest
 */
export async function getInterestSessions(interestId: number, startDate?: string, endDate?: string): Promise<InterestSession[]> {
  let query = db.interestSessions.where('interestId').equals(interestId);

  const sessions = await query.toArray();

  if (startDate && endDate) {
    return sessions
      .filter(s => s.date >= startDate && s.date <= endDate)
      .sort((a, b) => b.timestamp.localeCompare(a.timestamp));
  }

  return sessions.sort((a, b) => b.timestamp.localeCompare(a.timestamp));
}

/**
 * Get interest session statistics for an interest
 */
export async function getInterestSessionStats(interestId: number): Promise<{
  totalSessions: number;
  totalMinutes: number;
  avgMoodBefore: number;
  avgMoodAfter: number;
  avgMoodImpact: number;
  avgEnergyImpact: number;
  byType: Record<string, number>;
}> {
  const sessions = await getInterestSessions(interestId);

  if (sessions.length === 0) {
    return {
      totalSessions: 0,
      totalMinutes: 0,
      avgMoodBefore: 0,
      avgMoodAfter: 0,
      avgMoodImpact: 0,
      avgEnergyImpact: 0,
      byType: {}
    };
  }

  const totalMinutes = sessions.reduce((sum, s) => sum + s.duration, 0);

  const withMood = sessions.filter(s => s.moodBefore !== undefined && s.moodAfter !== undefined);
  const avgMoodBefore = withMood.length > 0
    ? withMood.reduce((sum, s) => sum + (s.moodBefore || 0), 0) / withMood.length
    : 0;
  const avgMoodAfter = withMood.length > 0
    ? withMood.reduce((sum, s) => sum + (s.moodAfter || 0), 0) / withMood.length
    : 0;
  const avgMoodImpact = avgMoodAfter - avgMoodBefore;

  const withEnergy = sessions.filter(s => s.energyBefore !== undefined && s.energyAfter !== undefined);
  const avgEnergyBefore = withEnergy.length > 0
    ? withEnergy.reduce((sum, s) => sum + (s.energyBefore || 0), 0) / withEnergy.length
    : 0;
  const avgEnergyAfter = withEnergy.length > 0
    ? withEnergy.reduce((sum, s) => sum + (s.energyAfter || 0), 0) / withEnergy.length
    : 0;
  const avgEnergyImpact = avgEnergyAfter - avgEnergyBefore;

  const byType: Record<string, number> = {};
  sessions.forEach(s => {
    byType[s.sessionType] = (byType[s.sessionType] || 0) + 1;
  });

  return {
    totalSessions: sessions.length,
    totalMinutes,
    avgMoodBefore: Math.round(avgMoodBefore * 10) / 10,
    avgMoodAfter: Math.round(avgMoodAfter * 10) / 10,
    avgMoodImpact: Math.round(avgMoodImpact * 10) / 10,
    avgEnergyImpact: Math.round(avgEnergyImpact * 10) / 10,
    byType
  };
}

/**
 * Get all interest sessions for date range (across all interests)
 */
export async function getAllInterestSessions(startDate: string, endDate: string): Promise<InterestSession[]> {
  return db.interestSessions
    .where('date')
    .between(startDate, endDate, true, true)
    .reverse()
    .sortBy('timestamp');
}

// Export database instance as default
export default db;
