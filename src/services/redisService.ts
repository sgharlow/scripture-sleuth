/**
 * Redis service layer for Comment Conspiracy
 * Provides typed access to Redis storage
 */

import type { Puzzle, PuzzleStats, UserProgress, UserGuess } from '../types';
import { REDIS_KEYS, type RedisContext } from './redisKeys';

// Default user progress for new users
const DEFAULT_USER_PROGRESS: Omit<UserProgress, 'userId'> = {
  currentStreak: 0,
  longestStreak: 0,
  lastPlayed: null,
  totalPlayed: 0,
  totalCorrect: 0,
  byDifficulty: {
    easy: [0, 0],
    medium: [0, 0],
    hard: [0, 0],
    expert: [0, 0],
  },
};

// Default stats for a new puzzle
const DEFAULT_PUZZLE_STATS: PuzzleStats = {
  totalPlayers: 0,
  correctCount: 0,
  correctPercentage: 0,
  guessDistribution: [0, 0, 0, 0, 0],
};

/**
 * Puzzle operations
 */
export async function getPuzzle(
  ctx: RedisContext,
  puzzleId: string
): Promise<Puzzle | null> {
  const data = await ctx.redis.get(REDIS_KEYS.puzzle(puzzleId));
  if (!data) return null;
  return JSON.parse(data) as Puzzle;
}

export async function setPuzzle(
  ctx: RedisContext,
  puzzle: Puzzle
): Promise<void> {
  await ctx.redis.set(REDIS_KEYS.puzzle(puzzle.id), JSON.stringify(puzzle));
}

export async function getCurrentPuzzleId(
  ctx: RedisContext
): Promise<string | null> {
  const id = await ctx.redis.get(REDIS_KEYS.currentPuzzle());
  return id || null;
}

export async function setCurrentPuzzleId(
  ctx: RedisContext,
  puzzleId: string
): Promise<void> {
  await ctx.redis.set(REDIS_KEYS.currentPuzzle(), puzzleId);
}

/**
 * Get all puzzle IDs from the index
 * Note: Uses JSON string since Devvit Redis doesn't support List operations
 */
export async function getPuzzleIndex(ctx: RedisContext): Promise<string[]> {
  const data = await ctx.redis.get(REDIS_KEYS.puzzleIndex());
  if (!data) return [];
  try {
    return JSON.parse(data) as string[];
  } catch {
    return [];
  }
}

/**
 * Add a puzzle ID to the index
 * Note: Uses JSON string since Devvit Redis doesn't support List operations
 */
export async function addToPuzzleIndex(
  ctx: RedisContext,
  puzzleId: string
): Promise<void> {
  const currentIndex = await getPuzzleIndex(ctx);
  if (!currentIndex.includes(puzzleId)) {
    currentIndex.push(puzzleId);
    await ctx.redis.set(REDIS_KEYS.puzzleIndex(), JSON.stringify(currentIndex));
  }
}

/**
 * User progress operations
 */
export async function getUserProgress(
  ctx: RedisContext,
  userId: string
): Promise<UserProgress> {
  const data = await ctx.redis.get(REDIS_KEYS.userProgress(userId));
  if (!data) {
    return { userId, ...DEFAULT_USER_PROGRESS };
  }
  return JSON.parse(data) as UserProgress;
}

export async function setUserProgress(
  ctx: RedisContext,
  progress: UserProgress
): Promise<void> {
  await ctx.redis.set(
    REDIS_KEYS.userProgress(progress.userId),
    JSON.stringify(progress)
  );
}

/**
 * User guess operations
 */
export async function getUserGuess(
  ctx: RedisContext,
  userId: string,
  puzzleId: string
): Promise<UserGuess | null> {
  const data = await ctx.redis.get(REDIS_KEYS.userGuess(userId, puzzleId));
  if (!data) return null;
  return JSON.parse(data) as UserGuess;
}

export async function setUserGuess(
  ctx: RedisContext,
  userId: string,
  guess: UserGuess
): Promise<void> {
  await ctx.redis.set(
    REDIS_KEYS.userGuess(userId, guess.puzzleId),
    JSON.stringify(guess)
  );
}

export async function hasUserPlayedPuzzle(
  ctx: RedisContext,
  userId: string,
  puzzleId: string
): Promise<boolean> {
  const guess = await getUserGuess(ctx, userId, puzzleId);
  return guess !== null;
}

/**
 * Stats operations
 */
export async function getPuzzleStats(
  ctx: RedisContext,
  puzzleId: string
): Promise<PuzzleStats> {
  const data = await ctx.redis.hGetAll(REDIS_KEYS.dailyStats(puzzleId));

  if (!data || Object.keys(data).length === 0) {
    return { ...DEFAULT_PUZZLE_STATS };
  }

  const totalPlayers = parseInt(data.totalPlayers || '0', 10);
  const correctCount = parseInt(data.correctCount || '0', 10);

  return {
    totalPlayers,
    correctCount,
    correctPercentage: totalPlayers > 0 ? (correctCount / totalPlayers) * 100 : 0,
    guessDistribution: [
      parseInt(data.guess_0 || '0', 10),
      parseInt(data.guess_1 || '0', 10),
      parseInt(data.guess_2 || '0', 10),
      parseInt(data.guess_3 || '0', 10),
      parseInt(data.guess_4 || '0', 10),
    ],
    averageTimeMs: data.avgTime ? parseInt(data.avgTime, 10) : undefined,
  };
}

export async function recordGuess(
  ctx: RedisContext,
  puzzleId: string,
  guessIndex: number,
  wasCorrect: boolean
): Promise<void> {
  const key = REDIS_KEYS.dailyStats(puzzleId);

  await ctx.redis.hIncrBy(key, 'totalPlayers', 1);
  await ctx.redis.hIncrBy(key, `guess_${guessIndex}`, 1);

  if (wasCorrect) {
    await ctx.redis.hIncrBy(key, 'correctCount', 1);
  }
}

/**
 * Leaderboard operations
 */
export async function updateStreakLeaderboard(
  ctx: RedisContext,
  userId: string,
  streak: number
): Promise<void> {
  await ctx.redis.zAdd(REDIS_KEYS.streakLeaderboard(), {
    score: streak,
    member: userId,
  });
}

export async function getStreakRank(
  ctx: RedisContext,
  userId: string
): Promise<{ rank: number; total: number } | null> {
  const rank = await ctx.redis.zRank(REDIS_KEYS.streakLeaderboard(), userId);
  if (rank === undefined) return null;

  const total = await ctx.redis.zCard(REDIS_KEYS.streakLeaderboard());
  return { rank: total - rank, total }; // Convert to descending rank
}

/**
 * Update accuracy leaderboard
 * Score = accuracy percentage * 100 (to preserve decimals) + games played as tiebreaker
 * Only users with 10+ games are included
 */
export async function updateAccuracyLeaderboard(
  ctx: RedisContext,
  userId: string,
  totalCorrect: number,
  totalPlayed: number
): Promise<void> {
  // Only include users with 10+ games for meaningful accuracy
  if (totalPlayed < 10) {
    return;
  }

  // Score = accuracy (0-10000) + tiny bonus for more games (0.0001 per game)
  // This keeps accuracy as primary sort but breaks ties with more games
  const accuracy = (totalCorrect / totalPlayed) * 10000;
  const tiebreaker = totalPlayed * 0.0001;
  const score = accuracy + tiebreaker;

  await ctx.redis.zAdd(REDIS_KEYS.accuracyLeaderboard(), {
    score,
    member: userId,
  });
}

export async function getAccuracyRank(
  ctx: RedisContext,
  userId: string
): Promise<{ rank: number; total: number } | null> {
  const rank = await ctx.redis.zRank(REDIS_KEYS.accuracyLeaderboard(), userId);
  if (rank === undefined) return null;

  const total = await ctx.redis.zCard(REDIS_KEYS.accuracyLeaderboard());
  return { rank: total - rank, total }; // Convert to descending rank
}

export async function getAccuracyLeaderboardTotal(
  ctx: RedisContext
): Promise<number> {
  return await ctx.redis.zCard(REDIS_KEYS.accuracyLeaderboard());
}
