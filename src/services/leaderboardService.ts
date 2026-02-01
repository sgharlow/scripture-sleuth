/**
 * Leaderboard Service
 * Manages fetching and formatting leaderboard data
 */

import type { UserProgress } from '../types';
import type { RedisContext } from './redisKeys';
import {
  getStreakRank,
  getAccuracyRank,
  getUserProgress,
} from './redisService';

export interface LeaderboardData {
  type: 'streak' | 'accuracy';
  entries: LeaderboardEntry[];
  userRank: LeaderboardEntry | null;
  totalPlayers: number;
}

/**
 * Get user's accuracy percentage
 */
export function calculateAccuracy(totalCorrect: number, totalPlayed: number): number {
  if (totalPlayed === 0) return 0;
  return Math.round((totalCorrect / totalPlayed) * 100);
}

/**
 * Get user's rank on streak leaderboard
 */
export async function getUserStreakRank(
  ctx: RedisContext,
  userId: string
): Promise<{ rank: number; total: number; score: number } | null> {
  const progress = await getUserProgress(ctx, userId);
  const rankData = await getStreakRank(ctx, userId);

  if (!rankData) return null;

  return {
    ...rankData,
    score: progress.currentStreak,
  };
}

/**
 * Get user's rank on accuracy leaderboard
 * Returns null if user doesn't have enough games (10+)
 */
export async function getUserAccuracyRank(
  ctx: RedisContext,
  userId: string
): Promise<{ rank: number; total: number; accuracy: number } | null> {
  const progress = await getUserProgress(ctx, userId);

  // Need 10+ games to be on accuracy leaderboard
  if (progress.totalPlayed < 10) {
    return null;
  }

  const rankData = await getAccuracyRank(ctx, userId);

  if (!rankData) return null;

  return {
    ...rankData,
    accuracy: calculateAccuracy(progress.totalCorrect, progress.totalPlayed),
  };
}

/**
 * Get user's leaderboard positions for both streak and accuracy
 */
export async function getUserLeaderboardPositions(
  ctx: RedisContext,
  userId: string
): Promise<{
  streak: { rank: number; total: number; score: number } | null;
  accuracy: { rank: number; total: number; accuracy: number } | null;
  progress: UserProgress;
}> {
  const progress = await getUserProgress(ctx, userId);
  const streakRank = await getUserStreakRank(ctx, userId);
  const accuracyRank = await getUserAccuracyRank(ctx, userId);

  return {
    streak: streakRank,
    accuracy: accuracyRank,
    progress,
  };
}

/**
 * Format rank as percentile string
 */
export function formatRankPercentile(rank: number, total: number): string {
  if (total === 0) return 'N/A';
  const percentile = Math.ceil((rank / total) * 100);
  return `Top ${percentile}%`;
}

/**
 * Format rank as ordinal string (1st, 2nd, 3rd, etc.)
 */
export function formatOrdinal(n: number): string {
  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

/**
 * Get minimum games required for accuracy leaderboard
 */
export const ACCURACY_LEADERBOARD_MIN_GAMES = 10;

/**
 * Check if user qualifies for accuracy leaderboard
 */
export function qualifiesForAccuracyLeaderboard(totalPlayed: number): boolean {
  return totalPlayed >= ACCURACY_LEADERBOARD_MIN_GAMES;
}

/**
 * Get games remaining until qualifying for accuracy leaderboard
 */
export function gamesUntilAccuracyQualification(totalPlayed: number): number {
  return Math.max(0, ACCURACY_LEADERBOARD_MIN_GAMES - totalPlayed);
}
