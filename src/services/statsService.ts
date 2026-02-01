/**
 * Stats Service
 * Records and aggregates daily puzzle statistics
 */

import type { PuzzleStats } from '../types';
import type { RedisContext } from './redisKeys';
import {
  getPuzzleStats as getStoredStats,
  recordGuess as storeGuess,
  getStreakRank,
} from './redisService';

/**
 * Record a guess for a puzzle
 * Atomically increments counters
 */
export async function recordGuess(
  ctx: RedisContext,
  puzzleId: string,
  guessIndex: number,
  wasCorrect: boolean
): Promise<void> {
  await storeGuess(ctx, puzzleId, guessIndex, wasCorrect);
}

/**
 * Get current stats for a puzzle
 */
export async function getPuzzleStats(
  ctx: RedisContext,
  puzzleId: string
): Promise<PuzzleStats> {
  return await getStoredStats(ctx, puzzleId);
}

/**
 * Calculate where user ranks compared to others
 * Returns percentile (1 = top 1%, 50 = middle, 99 = bottom)
 */
export function calculatePercentile(
  stats: PuzzleStats,
  wasCorrect: boolean
): number {
  // If no players yet, correct guessers are in top 1%
  if (stats.totalPlayers === 0) {
    return wasCorrect ? 1 : 99;
  }

  if (wasCorrect) {
    // Correct guessers rank in the top portion
    // If 30% got it right, correct users are "Top 30%"
    return Math.max(1, Math.round(stats.correctPercentage));
  } else {
    // Incorrect guessers are in the remaining portion
    // If 30% got it right, incorrect users are in the "70%" range
    const incorrectPercentage = 100 - stats.correctPercentage;
    return Math.max(1, Math.round(stats.correctPercentage + (incorrectPercentage / 2)));
  }
}

/**
 * Format percentile as display string
 */
export function formatPercentile(percentile: number): string {
  if (percentile <= 1) {
    return 'Top 1%';
  }
  if (percentile <= 10) {
    return `Top ${percentile}%`;
  }
  if (percentile <= 25) {
    return `Top ${percentile}%`;
  }
  if (percentile <= 50) {
    return `Top ${percentile}%`;
  }
  // For bottom half, don't embarrass them
  return `${percentile}%`;
}

/**
 * Get which comment was most selected (for curiosity stat)
 */
export function getMostSelectedComment(stats: PuzzleStats): {
  index: number;
  count: number;
  percentage: number;
} | null {
  if (stats.totalPlayers === 0) {
    return null;
  }

  const distribution = stats.guessDistribution;
  let maxIndex = 0;
  let maxCount = distribution[0];

  for (let i = 1; i < distribution.length; i++) {
    if (distribution[i] > maxCount) {
      maxCount = distribution[i];
      maxIndex = i;
    }
  }

  return {
    index: maxIndex,
    count: maxCount,
    percentage: Math.round((maxCount / stats.totalPlayers) * 100),
  };
}

/**
 * Get distribution as percentages
 */
export function getDistributionPercentages(stats: PuzzleStats): number[] {
  if (stats.totalPlayers === 0) {
    return [0, 0, 0, 0, 0];
  }

  return stats.guessDistribution.map(count =>
    Math.round((count / stats.totalPlayers) * 100)
  );
}

/**
 * Get user's streak rank compared to others
 */
export async function getUserStreakRank(
  ctx: RedisContext,
  userId: string
): Promise<{
  rank: number;
  total: number;
  percentile: number;
} | null> {
  const rankData = await getStreakRank(ctx, userId);
  if (!rankData) {
    return null;
  }

  const percentile = Math.round((rankData.rank / rankData.total) * 100);

  return {
    rank: rankData.rank,
    total: rankData.total,
    percentile: Math.max(1, percentile),
  };
}

/**
 * Calculate difficulty rating based on stats
 * Lower correct percentage = harder puzzle
 */
export function calculateDifficultyRating(stats: PuzzleStats): 'easy' | 'medium' | 'hard' | 'expert' {
  if (stats.totalPlayers < 10) {
    // Not enough data
    return 'medium';
  }

  const correctPct = stats.correctPercentage;

  if (correctPct >= 60) return 'easy';
  if (correctPct >= 40) return 'medium';
  if (correctPct >= 20) return 'hard';
  return 'expert';
}

/**
 * Get summary stats for display
 */
export function getSummaryStats(stats: PuzzleStats): {
  totalPlayers: number;
  correctPercentage: number;
  difficulty: string;
  mostSelectedIndex: number | null;
} {
  const mostSelected = getMostSelectedComment(stats);

  return {
    totalPlayers: stats.totalPlayers,
    correctPercentage: Math.round(stats.correctPercentage),
    difficulty: calculateDifficultyRating(stats),
    mostSelectedIndex: mostSelected?.index ?? null,
  };
}
