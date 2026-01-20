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
    // Social
    { name: 'Call a family member', category: 'social', description: 'Reach out to a loved one', estimatedDuration: 15, isDefault: true, timesCompleted: 0 },
    { name: 'Video chat with friend', category: 'social', description: 'Face-to-face connection from home', estimatedDuration: 30, isDefault: true, timesCompleted: 0 },
    { name: 'Coffee with neighbor', category: 'social', description: 'Brief social interaction', estimatedDuration: 30, isDefault: true, timesCompleted: 0 },
    { name: 'Write a letter or email', category: 'social', description: 'Thoughtful connection', estimatedDuration: 20, isDefault: true, timesCompleted: 0 },
    
    // Creative
    { name: 'Listen to favorite music', category: 'creative', description: 'Enjoy music mindfully', estimatedDuration: 20, isDefault: true, timesCompleted: 0 },
    { name: 'Try a new recipe', category: 'creative', description: 'Cooking something different', estimatedDuration: 45, isDefault: true, timesCompleted: 0 },
    { name: 'Photography walk', category: 'creative', description: 'Take photos of interesting things', estimatedDuration: 30, isDefault: true, timesCompleted: 0 },
    { name: 'Write in journal', category: 'creative', description: 'Free writing or reflection', estimatedDuration: 15, isDefault: true, timesCompleted: 0 },
    { name: 'Drawing or coloring', category: 'creative', description: 'Visual creative expression', estimatedDuration: 30, isDefault: true, timesCompleted: 0 },
    
    // Physical
    { name: 'Stationary cycling', category: 'physical', description: 'Indoor cycling routine', estimatedDuration: 30, isDefault: true, timesCompleted: 0 },
    { name: 'Resistance band exercises', category: 'physical', description: 'Upper body strengthening', estimatedDuration: 20, isDefault: true, timesCompleted: 0 },
    { name: 'Stretching routine', category: 'physical', description: 'Full body stretch', estimatedDuration: 15, isDefault: true, timesCompleted: 0 },
    { name: 'Tai chi practice', category: 'physical', description: 'Gentle flowing movement', estimatedDuration: 20, isDefault: true, timesCompleted: 0 },
    { name: 'Walk outside', category: 'physical', description: 'Neighborhood walk', estimatedDuration: 20, isDefault: true, timesCompleted: 0 },
    { name: 'Gardening', category: 'physical', description: 'Outdoor activity with purpose', estimatedDuration: 30, isDefault: true, timesCompleted: 0 },
    
    // Learning
    { name: 'Read a book', category: 'learning', description: 'Engage with a good book', estimatedDuration: 30, isDefault: true, timesCompleted: 0 },
    { name: 'Crossword or puzzle', category: 'learning', description: 'Mental challenge', estimatedDuration: 20, isDefault: true, timesCompleted: 0 },
    { name: 'Watch educational video', category: 'learning', description: 'Learn something new', estimatedDuration: 30, isDefault: true, timesCompleted: 0 },
    { name: 'Practice a language', category: 'learning', description: 'Language learning app or study', estimatedDuration: 15, isDefault: true, timesCompleted: 0 },
    
    // Mastery
    { name: 'Organize a drawer or closet', category: 'mastery', description: 'Small organizing project', estimatedDuration: 20, isDefault: true, timesCompleted: 0 },
    { name: 'Fix something small', category: 'mastery', description: 'Minor repair or improvement', estimatedDuration: 30, isDefault: true, timesCompleted: 0 },
    { name: 'Sort through paperwork', category: 'mastery', description: 'Administrative task', estimatedDuration: 30, isDefault: true, timesCompleted: 0 },
    { name: 'Clean one room', category: 'mastery', description: 'Focused cleaning task', estimatedDuration: 30, isDefault: true, timesCompleted: 0 },
    { name: 'Plan meals for the week', category: 'mastery', description: 'Meal planning', estimatedDuration: 20, isDefault: true, timesCompleted: 0 },
    
    // Pleasure
    { name: 'Watch favorite show', category: 'pleasure', description: 'Relaxing entertainment', estimatedDuration: 45, isDefault: true, timesCompleted: 0 },
    { name: 'Sit outside in nature', category: 'pleasure', description: 'Enjoy fresh air', estimatedDuration: 15, isDefault: true, timesCompleted: 0 },
    { name: 'Take a relaxing bath', category: 'pleasure', description: 'Self-care relaxation', estimatedDuration: 30, isDefault: true, timesCompleted: 0 },
    { name: 'Enjoy a cup of tea/coffee', category: 'pleasure', description: 'Mindful beverage break', estimatedDuration: 15, isDefault: true, timesCompleted: 0 },
    { name: 'Pet or play with animal', category: 'pleasure', description: 'Animal companionship', estimatedDuration: 15, isDefault: true, timesCompleted: 0 },
    { name: 'Look at old photos', category: 'pleasure', description: 'Pleasant memories', estimatedDuration: 20, isDefault: true, timesCompleted: 0 },
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

// Export database instance as default
export default db;
