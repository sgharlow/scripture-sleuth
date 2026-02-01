/**
 * Achievement Service
 * Manages achievement definitions, checking, and awarding
 * Based on comment-conspiracy-spec-v2.md Section 5.2
 */

import type { Achievement, AchievementId, UserProgress, Difficulty } from '../types';
import type { RedisContext } from './redisKeys';
import { REDIS_KEYS } from './redisKeys';

/**
 * Achievement definitions with criteria
 */
export const ACHIEVEMENT_DEFINITIONS: Record<AchievementId, Omit<Achievement, 'unlockedAt'>> = {
  first_correct: {
    id: 'first_correct',
    name: 'First Blood',
    description: 'Complete your first puzzle correctly',
    icon: '🎯',
  },
  streak_3: {
    id: 'streak_3',
    name: 'Sharp Eye',
    description: 'Achieve a 3-day streak',
    icon: '👁️',
  },
  streak_7: {
    id: 'streak_7',
    name: 'Pattern Recognition',
    description: 'Achieve a 7-day streak',
    icon: '🧠',
  },
  streak_30: {
    id: 'streak_30',
    name: 'Turing Champion',
    description: 'Achieve a 30-day streak',
    icon: '🏆',
  },
  perfect_week: {
    id: 'perfect_week',
    name: 'Perfect Week',
    description: '7 correct answers in a row',
    icon: '⭐',
  },
  hard_mode: {
    id: 'hard_mode',
    name: 'Expert Hunter',
    description: 'Get an expert puzzle correct',
    icon: '💎',
  },
  veteran: {
    id: 'veteran',
    name: 'Veteran',
    description: 'Play 30 puzzles',
    icon: '🎖️',
  },
  sharp_eye: {
    id: 'sharp_eye',
    name: 'Perfectionist',
    description: '80%+ accuracy over 20+ games',
    icon: '✨',
  },
};

/**
 * Get all achievement definitions
 */
export function getAllAchievementDefinitions(): Achievement[] {
  return Object.values(ACHIEVEMENT_DEFINITIONS).map(def => ({ ...def }));
}

/**
 * Get user's unlocked achievements from Redis
 */
export async function getUserAchievements(
  ctx: RedisContext,
  userId: string
): Promise<Achievement[]> {
  const data = await ctx.redis.get(REDIS_KEYS.userAchievements(userId));
  if (!data) return [];
  return JSON.parse(data) as Achievement[];
}

/**
 * Save user's achievements to Redis
 */
async function saveUserAchievements(
  ctx: RedisContext,
  userId: string,
  achievements: Achievement[]
): Promise<void> {
  await ctx.redis.set(
    REDIS_KEYS.userAchievements(userId),
    JSON.stringify(achievements)
  );
}

/**
 * Check if user has a specific achievement
 */
export async function hasAchievement(
  ctx: RedisContext,
  userId: string,
  achievementId: AchievementId
): Promise<boolean> {
  const achievements = await getUserAchievements(ctx, userId);
  return achievements.some(a => a.id === achievementId);
}

/**
 * Award an achievement to a user (if not already awarded)
 * Returns the achievement if newly awarded, null if already had it
 */
async function awardAchievement(
  ctx: RedisContext,
  userId: string,
  achievementId: AchievementId
): Promise<Achievement | null> {
  const achievements = await getUserAchievements(ctx, userId);

  // Check if already has this achievement
  if (achievements.some(a => a.id === achievementId)) {
    return null;
  }

  // Create the achievement with unlock timestamp
  const definition = ACHIEVEMENT_DEFINITIONS[achievementId];
  const newAchievement: Achievement = {
    ...definition,
    unlockedAt: new Date().toISOString(),
  };

  // Add to user's achievements and save
  achievements.push(newAchievement);
  await saveUserAchievements(ctx, userId, achievements);

  return newAchievement;
}

/**
 * Check and award achievements based on current progress and game result
 * Called after each guess submission
 *
 * @param ctx Redis context
 * @param userId User ID
 * @param progress Updated user progress
 * @param wasCorrect Whether the current guess was correct
 * @param difficulty Difficulty of the current puzzle
 * @returns Array of newly unlocked achievements
 */
export async function checkAndAwardAchievements(
  ctx: RedisContext,
  userId: string,
  progress: UserProgress,
  wasCorrect: boolean,
  difficulty: Difficulty
): Promise<Achievement[]> {
  const newlyUnlocked: Achievement[] = [];

  // First Blood - first correct guess ever
  if (wasCorrect && progress.totalCorrect === 1) {
    const achievement = await awardAchievement(ctx, userId, 'first_correct');
    if (achievement) newlyUnlocked.push(achievement);
  }

  // Streak achievements
  if (progress.currentStreak >= 3) {
    const achievement = await awardAchievement(ctx, userId, 'streak_3');
    if (achievement) newlyUnlocked.push(achievement);
  }

  if (progress.currentStreak >= 7) {
    const achievement = await awardAchievement(ctx, userId, 'streak_7');
    // Also award "perfect week" since 7 streak means 7 correct in a row
    const perfectWeek = await awardAchievement(ctx, userId, 'perfect_week');
    if (achievement) newlyUnlocked.push(achievement);
    if (perfectWeek) newlyUnlocked.push(perfectWeek);
  }

  if (progress.currentStreak >= 30) {
    const achievement = await awardAchievement(ctx, userId, 'streak_30');
    if (achievement) newlyUnlocked.push(achievement);
  }

  // Expert Hunter - correct on expert difficulty
  if (wasCorrect && difficulty === 'expert') {
    const achievement = await awardAchievement(ctx, userId, 'hard_mode');
    if (achievement) newlyUnlocked.push(achievement);
  }

  // Veteran - played 30 puzzles
  if (progress.totalPlayed >= 30) {
    const achievement = await awardAchievement(ctx, userId, 'veteran');
    if (achievement) newlyUnlocked.push(achievement);
  }

  // Sharp Eye / Perfectionist - 80%+ accuracy over 20+ games
  if (progress.totalPlayed >= 20) {
    const accuracy = (progress.totalCorrect / progress.totalPlayed) * 100;
    if (accuracy >= 80) {
      const achievement = await awardAchievement(ctx, userId, 'sharp_eye');
      if (achievement) newlyUnlocked.push(achievement);
    }
  }

  return newlyUnlocked;
}

/**
 * Get achievement progress for display (percentage towards each achievement)
 */
export function getAchievementProgress(
  progress: UserProgress,
  unlockedIds: string[]
): Array<{ achievement: Achievement; progress: number; unlocked: boolean }> {
  const results: Array<{ achievement: Achievement; progress: number; unlocked: boolean }> = [];

  for (const [id, def] of Object.entries(ACHIEVEMENT_DEFINITIONS)) {
    const unlocked = unlockedIds.includes(id);
    let progressPct = 0;

    if (unlocked) {
      progressPct = 100;
    } else {
      // Calculate progress based on achievement type
      switch (id) {
        case 'first_correct':
          progressPct = progress.totalCorrect >= 1 ? 100 : 0;
          break;
        case 'streak_3':
          progressPct = Math.min(100, (progress.currentStreak / 3) * 100);
          break;
        case 'streak_7':
        case 'perfect_week':
          progressPct = Math.min(100, (progress.currentStreak / 7) * 100);
          break;
        case 'streak_30':
          progressPct = Math.min(100, (progress.currentStreak / 30) * 100);
          break;
        case 'hard_mode':
          // Can't easily track expert correct without more data
          progressPct = progress.byDifficulty.expert[0] >= 1 ? 100 : 0;
          break;
        case 'veteran':
          progressPct = Math.min(100, (progress.totalPlayed / 30) * 100);
          break;
        case 'sharp_eye':
          if (progress.totalPlayed >= 20) {
            const accuracy = (progress.totalCorrect / progress.totalPlayed) * 100;
            progressPct = accuracy >= 80 ? 100 : 0;
          } else {
            progressPct = Math.min(100, (progress.totalPlayed / 20) * 100);
          }
          break;
      }
    }

    results.push({
      achievement: { ...def },
      progress: Math.round(progressPct),
      unlocked,
    });
  }

  return results;
}
