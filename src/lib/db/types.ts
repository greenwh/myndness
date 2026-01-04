// src/lib/db/types.ts
// Mental Wellness Companion - Database Type Definitions

// ============================================
// MOOD & HEALTH TRACKING
// ============================================

export interface MoodLog {
  id?: number;
  date: string;                    // YYYY-MM-DD
  timestamp: string;               // ISO datetime
  mood: number;                    // 1-10
  anxiety: number;                 // 0-10
  notes?: string;                  // Optional, max 500 chars
  isAnxietyEpisode: boolean;
  linkedBpId?: number;             // Reference to BP reading taken at same time
  linkedEpisodeId?: number;        // Reference to anxiety episode if part of one
}

export interface AnxietyEpisode {
  id?: number;
  date: string;                    // YYYY-MM-DD
  startTime: string;               // ISO datetime
  endTime?: string;                // ISO datetime, null if ongoing
  durationMinutes?: number;        // Calculated from start/end
  
  // Symptom tracking
  symptoms: AnxietySymptom[];
  symptomsOther?: string;
  
  // Context
  triggers?: string;               // Free text
  location?: string;
  
  // Intervention tracking
  interventionsUsed: InterventionType[];
  interventionEffectiveness: Record<InterventionType, number>; // 0-10 rating
  
  // Physiological data
  bpReadings: {
    time: string;
    systolic: number;
    diastolic: number;
    heartRate?: number;
  }[];
  
  // Outcome
  peakAnxietyLevel?: number;       // 0-10
  postEpisodeMood?: number;        // 1-10
  postEpisodeAnxiety?: number;     // 0-10
  
  notes?: string;
}

export type AnxietySymptom =
  | 'racing-thoughts'
  | 'chest-tightness'
  | 'shortness-of-breath'
  | 'rapid-heartbeat'
  | 'sweating'
  | 'trembling'
  | 'restlessness'
  | 'difficulty-concentrating'
  | 'irritability'
  | 'muscle-tension'
  | 'nausea'
  | 'dizziness'
  | 'feeling-detached'
  | 'fear-of-losing-control'
  | 'other';

export type InterventionType =
  | 'breathing-478'
  | 'breathing-box'
  | 'breathing-paced'
  | 'grounding-54321'
  | 'grounding-bodyscan'
  | 'grounding-sensory'
  | 'mindfulness-breath'
  | 'mindfulness-bodyscan'
  | 'thought-record'
  | 'physical-movement'
  | 'social-support'
  | 'medication'
  | 'other';

export interface BPReading {
  id?: number;
  date: string;                    // YYYY-MM-DD
  timestamp: string;               // ISO datetime
  systolic: number;                // 50-250 valid range
  diastolic: number;               // 30-150 valid range
  heartRate?: number;              // Optional BPM
  arm?: 'left' | 'right';
  position?: 'sitting' | 'standing' | 'lying';
  
  // Context flags
  isAnxietyRelated: boolean;       // Taken during/after anxiety
  isPostExercise: boolean;
  isPostMedication: boolean;
  
  linkedEpisodeId?: number;        // Reference to anxiety episode
  notes?: string;
}

// ============================================
// BEHAVIORAL ACTIVATION
// ============================================

export interface PlannedActivity {
  id?: number;
  date: string;                    // YYYY-MM-DD
  createdAt: string;               // ISO datetime
  
  // Activity details
  activity: string;                // Description
  category: ActivityCategory;
  timeBlock: TimeBlock;
  estimatedDuration?: number;      // Minutes
  
  // Completion tracking
  completed: boolean;
  completedAt?: string;            // ISO datetime
  actualDuration?: number;         // Minutes
  
  // Ratings (filled after completion)
  enjoyment?: number;              // 0-10
  mastery?: number;                // 0-10
  moodBefore?: number;             // 1-10
  moodAfter?: number;              // 1-10
  
  // Linking
  linkedExperimentId?: number;     // If this is a behavioral experiment
  
  notes?: string;
}

export type ActivityCategory =
  | 'social'      // Call friend, video chat, coffee meetup
  | 'creative'    // Music, art, writing, cooking
  | 'physical'    // Walk, garden, stretch, cycling
  | 'learning'    // Read, puzzle, online course
  | 'mastery'     // Small project, repair, organize
  | 'pleasure';   // Favorite show, nature, pet time

export type TimeBlock = 'morning' | 'afternoon' | 'evening';

export interface ActivityLibraryItem {
  id?: number;
  name: string;
  category: ActivityCategory;
  description?: string;
  estimatedDuration?: number;      // Minutes
  isDefault: boolean;              // Pre-populated vs user-added
  timesCompleted: number;
  averageEnjoyment?: number;
  averageMastery?: number;
  lastUsed?: string;               // ISO date
}

export interface Activity {
  id?: number;
  date: string;                    // YYYY-MM-DD
  timestamp: string;               // ISO datetime
  
  // Activity details
  type: ExerciseType | string;     // Exercise type or custom
  description?: string;
  duration: number;                // Minutes
  intensity?: 'light' | 'moderate' | 'vigorous';
  
  // Ratings
  enjoyment?: number;              // 0-10
  mastery?: number;                // 0-10
  moodBefore?: number;
  moodAfter?: number;
  
  // Equipment/details
  equipment?: string;
  location?: string;
  
  notes?: string;
}

export type ExerciseType =
  | 'cycling'
  | 'resistance-bands'
  | 'stretching'
  | 'tai-chi'
  | 'walking'
  | 'yoga'
  | 'swimming'
  | 'other';

// ============================================
// CBT TOOLS
// ============================================

export interface ThoughtRecord {
  id?: number;
  date: string;                    // YYYY-MM-DD
  timestamp: string;               // ISO datetime
  
  // Step 1: Situation
  situation: string;               // What happened? (max 200 chars)
  
  // Step 2: Automatic Thought
  automaticThought: string;        // What went through your mind?
  
  // Step 3: Emotion
  emotion: EmotionType;
  emotionOther?: string;           // If emotion is 'other'
  emotionIntensity: number;        // 0-100
  
  // Step 4: Cognitive Distortions
  distortions: CognitiveDistortion[];
  
  // Step 5: Evidence
  evidenceFor: string;             // Facts supporting the thought
  evidenceAgainst: string;         // Facts contradicting the thought
  
  // Step 6: Balanced Thought
  balancedThought: string;         // Alternative, more balanced perspective
  
  // Step 7: Outcome
  outcomeEmotion?: EmotionType;
  outcomeIntensity: number;        // 0-100 re-rating
  
  // Meta
  isComplete: boolean;             // All required fields filled
  theme?: string;                  // Recurring theme tag
  
  notes?: string;
}

export type EmotionType =
  | 'anxious'
  | 'sad'
  | 'angry'
  | 'guilty'
  | 'ashamed'
  | 'frustrated'
  | 'hopeless'
  | 'overwhelmed'
  | 'fearful'
  | 'other';

export type CognitiveDistortion =
  | 'all-or-nothing'       // Black and white thinking
  | 'overgeneralization'   // Always/never patterns
  | 'mental-filter'        // Focusing only on negatives
  | 'disqualifying'        // Dismissing positive experiences
  | 'jumping-to-conclusions'
  | 'mind-reading'         // Assuming others' thoughts
  | 'fortune-telling'      // Predicting negative outcomes
  | 'catastrophizing'      // Worst-case thinking
  | 'minimizing'           // Shrinking importance of positives
  | 'emotional-reasoning'  // Feelings as facts
  | 'should-statements'    // Rigid rules
  | 'labeling'             // Global negative labels
  | 'personalization'      // Taking blame inappropriately
  | 'blaming';             // Attributing all responsibility to others

export interface BehavioralExperiment {
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

export interface AnxietyHierarchyItem {
  id?: number;
  createdAt: string;               // ISO datetime
  
  // Feared situation
  situation: string;               // Description of feared situation
  category?: string;               // Optional grouping
  
  // Distress ratings
  initialDistress: number;         // 0-100 SUDS rating
  currentDistress: number;         // 0-100 current rating
  
  // Exposure tracking
  exposureAttempts: ExposureAttempt[];
  
  // Goal
  targetDistress?: number;         // Goal distress level
  isComplete: boolean;             // Reached target
  
  notes?: string;
}

export interface ExposureAttempt {
  date: string;
  distressBefore: number;          // 0-100
  distressDuring: number;          // 0-100 peak
  distressAfter: number;           // 0-100
  duration: number;                // Minutes
  notes?: string;
}

// ============================================
// MINDFULNESS
// ============================================

export interface MindfulnessSession {
  id?: number;
  date: string;                    // YYYY-MM-DD
  timestamp: string;               // ISO datetime
  
  // Session details
  practiceType: MindfulnessPracticeType;
  durationPlanned: number;         // Minutes
  durationActual?: number;         // Actual minutes completed
  
  // Mood tracking
  moodBefore?: number;             // 1-10
  anxietyBefore?: number;          // 0-10
  moodAfter?: number;              // 1-10
  anxietyAfter?: number;           // 0-10
  
  // Session quality
  focusQuality?: number;           // 0-10 how focused were you
  restlessness?: number;           // 0-10 how restless
  completed: boolean;              // Finished the full duration
  
  notes?: string;
}

export type MindfulnessPracticeType =
  | 'breath-awareness'
  | 'body-scan-short'      // 3-5 min
  | 'body-scan-full'       // 10-20 min
  | 'loving-kindness'
  | 'open-awareness'
  | 'walking-meditation'
  | 'sound-awareness'
  | 'other';

// ============================================
// USER & SETTINGS
// ============================================

export interface UserProfile {
  id?: number;
  
  // Demographics
  name?: string;                   // Optional
  age?: number;
  
  // Medical context
  conditions?: string[];           // List of conditions
  medications?: string[];          // Current medications
  hasPacemaker: boolean;
  hasCardiacMonitor: boolean;
  
  // Healthcare providers (for reports)
  primaryCareProvider?: string;
  therapist?: string;
  psychiatrist?: string;
  cardiologist?: string;
  
  // Default exercise routine
  defaultExercises?: string[];
  
  // Profile created
  createdAt: string;
  updatedAt: string;
}

export interface Settings {
  id?: number;
  
  // Display preferences
  theme: 'light' | 'dark' | 'system';
  fontSize: 'normal' | 'large' | 'extra-large';
  highContrast: boolean;
  reducedMotion: boolean;
  
  // Notifications
  notificationsEnabled: boolean;
  morningCheckInTime?: string;     // HH:MM
  eveningReviewTime?: string;      // HH:MM
  activityReminders: boolean;
  
  // Defaults
  defaultBreathingRounds: number;  // Default 4
  defaultMindfulnessDuration: number; // Minutes
  
  // Data
  autoBackup: boolean;
  backupFrequency?: 'daily' | 'weekly';
  lastBackup?: string;             // ISO datetime
  
  // Goals
  weeklyMindfulnessGoal?: number;  // Sessions per week
  weeklyActivityGoal?: number;     // Planned activities per week
  weeklyThoughtRecordGoal?: number;
  
  createdAt: string;
  updatedAt: string;
}

// ============================================
// HELPER TYPES
// ============================================

export interface DateRange {
  start: string;                   // YYYY-MM-DD
  end: string;                     // YYYY-MM-DD
}

export interface MoodTrend {
  date: string;
  avgMood: number;
  avgAnxiety: number;
  moodEntries: number;
}

export interface ActivityImpact {
  category: ActivityCategory;
  avgMoodBefore: number;
  avgMoodAfter: number;
  avgEnjoyment: number;
  avgMastery: number;
  count: number;
}

export interface WeeklySummary {
  weekStart: string;
  weekEnd: string;
  
  // Mood
  avgMood: number;
  avgAnxiety: number;
  moodRange: { min: number; max: number };
  
  // Episodes
  anxietyEpisodes: number;
  avgEpisodeDuration: number;
  
  // Activities
  activitiesPlanned: number;
  activitiesCompleted: number;
  completionRate: number;
  
  // Mindfulness
  mindfulnessSessions: number;
  totalMindfulnessMinutes: number;
  
  // CBT
  thoughtRecordsCompleted: number;
  
  // BP
  avgSystolic: number;
  avgDiastolic: number;
  bpReadings: number;
}

// ============================================
// EXPORT TYPES
// ============================================

export interface ExportData {
  exportDate: string;
  exportVersion: string;
  dateRange: DateRange;
  
  moodLogs: MoodLog[];
  anxietyEpisodes: AnxietyEpisode[];
  bpReadings: BPReading[];
  activities: Activity[];
  plannedActivities: PlannedActivity[];
  thoughtRecords: ThoughtRecord[];
  behavioralExperiments: BehavioralExperiment[];
  mindfulnessSessions: MindfulnessSession[];
  
  summary: WeeklySummary[];
}
