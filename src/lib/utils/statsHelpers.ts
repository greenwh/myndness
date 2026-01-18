import type {
  MoodLog,
  BPReading,
  PlannedActivity,
  MindfulnessSession,
  ActivityCategory
} from '$lib/db/types';
import { format, parseISO, differenceInDays } from 'date-fns';

/**
 * Daily aggregated mood data
 */
export interface DailyMoodData {
  date: string;
  avgMood: number;
  avgAnxiety: number;
  count: number;
}

/**
 * Aggregates mood logs by day (averaging multiple entries per day)
 */
export function aggregateMoodByDay(moodLogs: MoodLog[]): DailyMoodData[] {
  const byDate = new Map<string, { totalMood: number; totalAnxiety: number; count: number }>();

  for (const log of moodLogs) {
    const existing = byDate.get(log.date);
    if (existing) {
      existing.totalMood += log.mood;
      existing.totalAnxiety += log.anxiety;
      existing.count++;
    } else {
      byDate.set(log.date, {
        totalMood: log.mood,
        totalAnxiety: log.anxiety,
        count: 1
      });
    }
  }

  return Array.from(byDate.entries())
    .map(([date, data]) => ({
      date,
      avgMood: data.totalMood / data.count,
      avgAnxiety: data.totalAnxiety / data.count,
      count: data.count
    }))
    .sort((a, b) => a.date.localeCompare(b.date));
}

/**
 * Activity impact on mood by category
 */
export interface ActivityImpact {
  category: ActivityCategory;
  avgMoodBefore: number;
  avgMoodAfter: number;
  moodChange: number;
  count: number;
}

/**
 * Calculates mood change (before → after) per activity category
 */
export function calculateActivityImpact(activities: PlannedActivity[]): ActivityImpact[] {
  const byCategory = new Map<
    ActivityCategory,
    { beforeSum: number; afterSum: number; count: number }
  >();

  // Only include completed activities with mood ratings
  const rated = activities.filter(
    (a) => a.completed && a.moodBefore !== undefined && a.moodAfter !== undefined
  );

  for (const activity of rated) {
    const existing = byCategory.get(activity.category);
    if (existing) {
      existing.beforeSum += activity.moodBefore!;
      existing.afterSum += activity.moodAfter!;
      existing.count++;
    } else {
      byCategory.set(activity.category, {
        beforeSum: activity.moodBefore!,
        afterSum: activity.moodAfter!,
        count: 1
      });
    }
  }

  return Array.from(byCategory.entries())
    .map(([category, data]) => {
      const avgBefore = data.beforeSum / data.count;
      const avgAfter = data.afterSum / data.count;
      return {
        category,
        avgMoodBefore: avgBefore,
        avgMoodAfter: avgAfter,
        moodChange: avgAfter - avgBefore,
        count: data.count
      };
    })
    .sort((a, b) => b.moodChange - a.moodChange); // Sort by impact (descending)
}

/**
 * Calculates consecutive days with completed mindfulness sessions
 */
export function calculateMindfulnessStreak(sessions: MindfulnessSession[]): number {
  if (sessions.length === 0) return 0;

  const completed = sessions.filter((s) => s.completed);
  if (completed.length === 0) return 0;

  // Get unique dates with completed sessions, sorted descending
  const uniqueDates = Array.from(new Set(completed.map((s) => s.date))).sort((a, b) =>
    b.localeCompare(a)
  );

  const today = format(new Date(), 'yyyy-MM-dd');
  const mostRecent = uniqueDates[0];

  // If most recent is not today or yesterday, streak is broken
  const daysSinceLast = differenceInDays(parseISO(today), parseISO(mostRecent));
  if (daysSinceLast > 1) return 0;

  // Count consecutive days backwards from most recent
  let streak = 1;
  for (let i = 1; i < uniqueDates.length; i++) {
    const current = parseISO(uniqueDates[i]);
    const previous = parseISO(uniqueDates[i - 1]);
    const daysBetween = differenceInDays(previous, current);

    if (daysBetween === 1) {
      streak++;
    } else {
      break;
    }
  }

  return streak;
}

/**
 * Calculates consecutive days with completed planned activities
 */
export function calculateActivityStreak(activities: PlannedActivity[]): number {
  if (activities.length === 0) return 0;

  const completed = activities.filter((a) => a.completed);
  if (completed.length === 0) return 0;

  // Get unique dates with completed activities, sorted descending
  const uniqueDates = Array.from(new Set(completed.map((a) => a.date))).sort((a, b) =>
    b.localeCompare(a)
  );

  const today = format(new Date(), 'yyyy-MM-dd');
  const mostRecent = uniqueDates[0];

  // If most recent is not today or yesterday, streak is broken
  const daysSinceLast = differenceInDays(parseISO(today), parseISO(mostRecent));
  if (daysSinceLast > 1) return 0;

  // Count consecutive days backwards from most recent
  let streak = 1;
  for (let i = 1; i < uniqueDates.length; i++) {
    const current = parseISO(uniqueDates[i]);
    const previous = parseISO(uniqueDates[i - 1]);
    const daysBetween = differenceInDays(previous, current);

    if (daysBetween === 1) {
      streak++;
    } else {
      break;
    }
  }

  return streak;
}

/**
 * Daily aggregated BP data
 */
export interface DailyBPData {
  date: string;
  avgSystolic: number;
  avgDiastolic: number;
  avgHeartRate?: number;
  count: number;
  hasAnxietyRelated: boolean;
}

/**
 * Aggregates BP readings by day
 */
export function aggregateBPByDay(readings: BPReading[]): DailyBPData[] {
  const byDate = new Map<
    string,
    {
      totalSystolic: number;
      totalDiastolic: number;
      totalHeartRate: number;
      heartRateCount: number;
      count: number;
      hasAnxietyRelated: boolean;
    }
  >();

  for (const reading of readings) {
    const existing = byDate.get(reading.date);
    if (existing) {
      existing.totalSystolic += reading.systolic;
      existing.totalDiastolic += reading.diastolic;
      if (reading.heartRate) {
        existing.totalHeartRate += reading.heartRate;
        existing.heartRateCount++;
      }
      existing.count++;
      existing.hasAnxietyRelated = existing.hasAnxietyRelated || reading.isAnxietyRelated;
    } else {
      byDate.set(reading.date, {
        totalSystolic: reading.systolic,
        totalDiastolic: reading.diastolic,
        totalHeartRate: reading.heartRate || 0,
        heartRateCount: reading.heartRate ? 1 : 0,
        count: 1,
        hasAnxietyRelated: reading.isAnxietyRelated
      });
    }
  }

  return Array.from(byDate.entries())
    .map(([date, data]) => ({
      date,
      avgSystolic: Math.round(data.totalSystolic / data.count),
      avgDiastolic: Math.round(data.totalDiastolic / data.count),
      avgHeartRate:
        data.heartRateCount > 0
          ? Math.round(data.totalHeartRate / data.heartRateCount)
          : undefined,
      count: data.count,
      hasAnxietyRelated: data.hasAnxietyRelated
    }))
    .sort((a, b) => a.date.localeCompare(b.date));
}

/**
 * Weekly insights summary
 */
export interface WeeklyInsights {
  // Mood
  avgMood?: number;
  avgAnxiety?: number;
  moodEntries: number;

  // Activities
  activitiesPlanned: number;
  activitiesCompleted: number;
  completionRate: number;

  // Mindfulness
  mindfulnessSessions: number;
  totalMindfulnessMinutes: number;
  avgSessionDuration?: number;

  // BP
  avgSystolic?: number;
  avgDiastolic?: number;
  bpReadings: number;

  // Patterns
  bestCategory?: ActivityCategory;
  bestCategoryImpact?: number;
}

/**
 * Generates comprehensive weekly insights with neutral tone
 */
export function getWeeklyInsights(
  moodLogs: MoodLog[],
  activities: PlannedActivity[],
  sessions: MindfulnessSession[],
  bpReadings: BPReading[]
): WeeklyInsights {
  // Mood stats
  const moodEntries = moodLogs.length;
  const avgMood =
    moodEntries > 0 ? moodLogs.reduce((sum, log) => sum + log.mood, 0) / moodEntries : undefined;
  const avgAnxiety =
    moodEntries > 0
      ? moodLogs.reduce((sum, log) => sum + log.anxiety, 0) / moodEntries
      : undefined;

  // Activity stats
  const activitiesPlanned = activities.length;
  const activitiesCompleted = activities.filter((a) => a.completed).length;
  const completionRate =
    activitiesPlanned > 0 ? (activitiesCompleted / activitiesPlanned) * 100 : 0;

  // Mindfulness stats
  const completedSessions = sessions.filter((s) => s.completed);
  const mindfulnessSessions = completedSessions.length;
  const totalMindfulnessMinutes = completedSessions.reduce(
    (sum, s) => sum + (s.durationActual || s.durationPlanned),
    0
  );
  const avgSessionDuration =
    mindfulnessSessions > 0 ? totalMindfulnessMinutes / mindfulnessSessions : undefined;

  // BP stats
  const bpCount = bpReadings.length;
  const avgSystolic =
    bpCount > 0
      ? Math.round(bpReadings.reduce((sum, r) => sum + r.systolic, 0) / bpCount)
      : undefined;
  const avgDiastolic =
    bpCount > 0
      ? Math.round(bpReadings.reduce((sum, r) => sum + r.diastolic, 0) / bpCount)
      : undefined;

  // Find best activity category
  const impacts = calculateActivityImpact(activities);
  const bestCategory = impacts.length > 0 ? impacts[0].category : undefined;
  const bestCategoryImpact = impacts.length > 0 ? impacts[0].moodChange : undefined;

  return {
    avgMood,
    avgAnxiety,
    moodEntries,
    activitiesPlanned,
    activitiesCompleted,
    completionRate,
    mindfulnessSessions,
    totalMindfulnessMinutes,
    avgSessionDuration,
    avgSystolic,
    avgDiastolic,
    bpReadings: bpCount,
    bestCategory,
    bestCategoryImpact
  };
}
