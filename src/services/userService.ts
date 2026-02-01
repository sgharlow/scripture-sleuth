/**
 * User Service
 * Manages user progress, streaks, and history
 */

import type { Difficulty, UserProgress, DayResult } from '../types';
import type { RedisContext } from './redisKeys';
import { REDIS_KEYS } from './redisKeys';
import {
  getUserProgress as getStoredProgress,
  setUserProgress,
  updateStreakLeaderboard,
} from './redisService';

/**
 * Get today's date in UTC as YYYY-MM-DD
 */
function getTodayUTC(): string {
  const now = new Date();
  const year = now.getUTCFullYear();
  const month = String(now.getUTCMonth() + 1).padStart(2, '0');
  const day = String(now.getUTCDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Check if two dates are consecutive (UTC)
 */
function areConsecutiveDays(earlier: string, later: string): boolean {
  const d1 = new Date(earlier + 'T00:00:00Z');
  const d2 = new Date(later + 'T00:00:00Z');
  const diffMs = d2.getTime() - d1.getTime();
  const diffDays = diffMs / (1000 * 60 * 60 * 24);
  return diffDays === 1;
}

/**
 * Check if dates are the same day (UTC)
 */
function isSameDay(date1: string, date2: string): boolean {
  return date1 === date2;
}

/**
 * Calculate new streak value based on game result
 *
 * Streak Rules:
 * - Correct + consecutive day = streak + 1
 * - Correct + missed day(s) = streak reset to 1
 * - Incorrect = streak reset to 0
 */
export function calculateStreak(
  lastPlayed: string | null,
  currentStreak: number,
  wasCorrect: boolean
): number {
  const today = getTodayUTC();

  if (!wasCorrect) {
    // Wrong answer always resets streak to 0
    return 0;
  }

  // Correct answer
  if (!lastPlayed) {
    // First game ever - start streak at 1
    return 1;
  }

  if (isSameDay(lastPlayed, today)) {
    // Already played today - shouldn't update streak again
    return currentStreak;
  }

  if (areConsecutiveDays(lastPlayed, today)) {
    // Consecutive day - increment streak
    return currentStreak + 1;
  }

  // Missed day(s) - reset to 1 (starting fresh)
  return 1;
}

/**
 * Get or create user progress record
 */
export async function getUserProgress(
  ctx: RedisContext,
  userId: string
): Promise<UserProgress> {
  return await getStoredProgress(ctx, userId);
}

/**
 * Update user progress after a guess
 */
export async function updateProgress(
  ctx: RedisContext,
  userId: string,
  wasCorrect: boolean,
  difficulty: Difficulty,
  puzzleId: string
): Promise<UserProgress> {
  const progress = await getStoredProgress(ctx, userId);
  const today = getTodayUTC();

  // Don't update if already played today (idempotent)
  if (progress.lastPlayed && isSameDay(progress.lastPlayed, today)) {
    return progress;
  }

  // Calculate new streak
  const newStreak = calculateStreak(
    progress.lastPlayed,
    progress.currentStreak,
    wasCorrect
  );

  // Update progress
  const updatedProgress: UserProgress = {
    ...progress,
    currentStreak: newStreak,
    longestStreak: Math.max(progress.longestStreak, newStreak),
    lastPlayed: today,
    totalPlayed: progress.totalPlayed + 1,
    totalCorrect: progress.totalCorrect + (wasCorrect ? 1 : 0),
    byDifficulty: {
      ...progress.byDifficulty,
      [difficulty]: [
        progress.byDifficulty[difficulty][0] + (wasCorrect ? 1 : 0),
        progress.byDifficulty[difficulty][1] + 1,
      ] as [number, number],
    },
  };

  // Persist updates
  await setUserProgress(ctx, updatedProgress);
  await updateStreakLeaderboard(ctx, userId, newStreak);

  // Add to history
  await addToHistory(ctx, userId, {
    puzzleId,
    date: today,
    wasCorrect,
    guessedIndex: -1, // Will be filled by caller if needed
    correctIndex: -1, // Will be filled by caller if needed
    difficulty,
    timestamp: Date.now(),
  });

  return updatedProgress;
}

/**
 * Add a result to user's history
 * Note: Uses JSON array since Devvit Redis doesn't support List operations
 */
async function addToHistory(
  ctx: RedisContext,
  userId: string,
  result: DayResult
): Promise<void> {
  const key = REDIS_KEYS.userHistory(userId);

  // Get existing history
  const data = await ctx.redis.get(key);
  let history: DayResult[] = [];
  if (data) {
    try {
      history = JSON.parse(data) as DayResult[];
    } catch {
      history = [];
    }
  }

  // Add to front of array (most recent first)
  history.unshift(result);

  // Keep only last 30 entries
  if (history.length > 30) {
    history = history.slice(0, 30);
  }

  await ctx.redis.set(key, JSON.stringify(history));
}

/**
 * Get user's recent game history
 * Defaults to last 30 days
 * Note: Uses JSON array since Devvit Redis doesn't support List operations
 */
export async function getHistory(
  ctx: RedisContext,
  userId: string,
  limit: number = 30
): Promise<DayResult[]> {
  const key = REDIS_KEYS.userHistory(userId);

  const data = await ctx.redis.get(key);
  if (!data) return [];

  try {
    const history = JSON.parse(data) as DayResult[];
    return history.slice(0, limit);
  } catch {
    return [];
  }
}

/**
 * Get user's accuracy percentage
 */
export function getAccuracy(progress: UserProgress): number {
  if (progress.totalPlayed === 0) {
    return 0;
  }
  return Math.round((progress.totalCorrect / progress.totalPlayed) * 100);
}

/**
 * Get accuracy by difficulty level
 */
export function getAccuracyByDifficulty(
  progress: UserProgress,
  difficulty: Difficulty
): number {
  const [correct, played] = progress.byDifficulty[difficulty];
  if (played === 0) {
    return 0;
  }
  return Math.round((correct / played) * 100);
}

/**
 * Check if user is on a "hot streak" (3+ days)
 */
export function isHotStreak(progress: UserProgress): boolean {
  return progress.currentStreak >= 3;
}

/**
 * Get days since last played (for streak warning)
 */
export function getDaysSinceLastPlayed(progress: UserProgress): number | null {
  if (!progress.lastPlayed) {
    return null;
  }

  const last = new Date(progress.lastPlayed + 'T00:00:00Z');
  const today = new Date(getTodayUTC() + 'T00:00:00Z');
  const diffMs = today.getTime() - last.getTime();
  return Math.floor(diffMs / (1000 * 60 * 60 * 24));
}

/**
 * Check if user's streak is at risk (will break if they don't play today)
 */
export function isStreakAtRisk(progress: UserProgress): boolean {
  if (progress.currentStreak === 0) {
    return false;
  }

  const daysSince = getDaysSinceLastPlayed(progress);
  // Streak is at risk if they haven't played today and have a streak
  return daysSince === 1;
}
