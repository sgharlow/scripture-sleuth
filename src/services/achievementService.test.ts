/**
 * Achievement Service Tests
 * Tests for achievement definitions and progress calculation
 */

import { describe, it, expect } from 'vitest';
import {
  ACHIEVEMENT_DEFINITIONS,
  getAllAchievementDefinitions,
  getAchievementProgress,
} from './achievementService';
import type { UserProgress } from '../types';

// Mock user progress factory
function createMockProgress(overrides: Partial<UserProgress> = {}): UserProgress {
  return {
    userId: 'test-user',
    currentStreak: 0,
    longestStreak: 0,
    totalPlayed: 0,
    totalCorrect: 0,
    lastPlayed: null,
    byDifficulty: {
      easy: [0, 0],
      medium: [0, 0],
      hard: [0, 0],
      expert: [0, 0],
    },
    ...overrides,
  };
}

describe('Achievement Service', () => {
  describe('ACHIEVEMENT_DEFINITIONS', () => {
    it('has 8 achievements defined', () => {
      expect(Object.keys(ACHIEVEMENT_DEFINITIONS).length).toBe(8);
    });

    it('has all required achievement IDs', () => {
      const expectedIds = [
        'first_correct',
        'streak_3',
        'streak_7',
        'streak_30',
        'perfect_week',
        'hard_mode',
        'veteran',
        'sharp_eye',
      ];
      expectedIds.forEach(id => {
        expect(ACHIEVEMENT_DEFINITIONS).toHaveProperty(id);
      });
    });

    it('each achievement has required fields', () => {
      Object.values(ACHIEVEMENT_DEFINITIONS).forEach(achievement => {
        expect(achievement).toHaveProperty('id');
        expect(achievement).toHaveProperty('name');
        expect(achievement).toHaveProperty('description');
        expect(achievement).toHaveProperty('icon');
        expect(achievement.name.length).toBeGreaterThan(0);
        expect(achievement.description.length).toBeGreaterThan(0);
        expect(achievement.icon.length).toBeGreaterThan(0);
      });
    });

    it('each achievement has a unique icon', () => {
      const icons = Object.values(ACHIEVEMENT_DEFINITIONS).map(a => a.icon);
      const uniqueIcons = new Set(icons);
      expect(uniqueIcons.size).toBe(icons.length);
    });
  });

  describe('getAllAchievementDefinitions', () => {
    it('returns all achievements as an array', () => {
      const definitions = getAllAchievementDefinitions();
      expect(definitions).toBeInstanceOf(Array);
      expect(definitions.length).toBe(8);
    });

    it('returns clones, not references', () => {
      const definitions1 = getAllAchievementDefinitions();
      const definitions2 = getAllAchievementDefinitions();
      expect(definitions1).not.toBe(definitions2);
      expect(definitions1[0]).not.toBe(definitions2[0]);
    });
  });

  describe('getAchievementProgress', () => {
    it('returns 100% progress for unlocked achievements', () => {
      const progress = createMockProgress();
      const unlockedIds = ['first_correct'];

      const result = getAchievementProgress(progress, unlockedIds);
      const firstCorrect = result.find(r => r.achievement.id === 'first_correct');

      expect(firstCorrect?.unlocked).toBe(true);
      expect(firstCorrect?.progress).toBe(100);
    });

    it('calculates first_correct progress correctly', () => {
      const progressNoCorrect = createMockProgress({ totalCorrect: 0 });
      const progressOneCorrect = createMockProgress({ totalCorrect: 1 });

      const resultNo = getAchievementProgress(progressNoCorrect, []);
      const resultYes = getAchievementProgress(progressOneCorrect, []);

      const achievementNo = resultNo.find(r => r.achievement.id === 'first_correct');
      const achievementYes = resultYes.find(r => r.achievement.id === 'first_correct');

      expect(achievementNo?.progress).toBe(0);
      expect(achievementYes?.progress).toBe(100);
    });

    it('calculates streak_3 progress correctly', () => {
      const tests = [
        { streak: 0, expected: 0 },
        { streak: 1, expected: 33 },
        { streak: 2, expected: 67 },
        { streak: 3, expected: 100 },
        { streak: 5, expected: 100 },
      ];

      tests.forEach(({ streak, expected }) => {
        const progress = createMockProgress({ currentStreak: streak });
        const result = getAchievementProgress(progress, []);
        const achievement = result.find(r => r.achievement.id === 'streak_3');
        expect(achievement?.progress).toBe(expected);
      });
    });

    it('calculates streak_7 progress correctly', () => {
      const tests = [
        { streak: 0, expected: 0 },
        { streak: 3, expected: 43 },
        { streak: 7, expected: 100 },
        { streak: 10, expected: 100 },
      ];

      tests.forEach(({ streak, expected }) => {
        const progress = createMockProgress({ currentStreak: streak });
        const result = getAchievementProgress(progress, []);
        const achievement = result.find(r => r.achievement.id === 'streak_7');
        expect(achievement?.progress).toBe(expected);
      });
    });

    it('calculates streak_30 progress correctly', () => {
      const tests = [
        { streak: 0, expected: 0 },
        { streak: 15, expected: 50 },
        { streak: 30, expected: 100 },
        { streak: 40, expected: 100 },
      ];

      tests.forEach(({ streak, expected }) => {
        const progress = createMockProgress({ currentStreak: streak });
        const result = getAchievementProgress(progress, []);
        const achievement = result.find(r => r.achievement.id === 'streak_30');
        expect(achievement?.progress).toBe(expected);
      });
    });

    it('calculates veteran progress correctly', () => {
      const tests = [
        { played: 0, expected: 0 },
        { played: 15, expected: 50 },
        { played: 30, expected: 100 },
        { played: 50, expected: 100 },
      ];

      tests.forEach(({ played, expected }) => {
        const progress = createMockProgress({ totalPlayed: played });
        const result = getAchievementProgress(progress, []);
        const achievement = result.find(r => r.achievement.id === 'veteran');
        expect(achievement?.progress).toBe(expected);
      });
    });

    it('calculates hard_mode (expert hunter) progress correctly', () => {
      const progressNoExpert = createMockProgress({
        byDifficulty: { easy: [0, 0], medium: [0, 0], hard: [0, 0], expert: [0, 1] },
      });
      const progressExpertCorrect = createMockProgress({
        byDifficulty: { easy: [0, 0], medium: [0, 0], hard: [0, 0], expert: [1, 1] },
      });

      const resultNo = getAchievementProgress(progressNoExpert, []);
      const resultYes = getAchievementProgress(progressExpertCorrect, []);

      const achievementNo = resultNo.find(r => r.achievement.id === 'hard_mode');
      const achievementYes = resultYes.find(r => r.achievement.id === 'hard_mode');

      expect(achievementNo?.progress).toBe(0);
      expect(achievementYes?.progress).toBe(100);
    });

    it('calculates sharp_eye (perfectionist) progress correctly', () => {
      // Under 20 games: shows progress to 20
      const progressUnder20 = createMockProgress({
        totalPlayed: 10,
        totalCorrect: 8,
      });

      // 20+ games with 80%+ accuracy
      const progressQualified = createMockProgress({
        totalPlayed: 20,
        totalCorrect: 16, // 80%
      });

      // 20+ games with <80% accuracy
      const progressNotQualified = createMockProgress({
        totalPlayed: 20,
        totalCorrect: 14, // 70%
      });

      const resultUnder = getAchievementProgress(progressUnder20, []);
      const resultQualified = getAchievementProgress(progressQualified, []);
      const resultNot = getAchievementProgress(progressNotQualified, []);

      const achievementUnder = resultUnder.find(r => r.achievement.id === 'sharp_eye');
      const achievementQualified = resultQualified.find(r => r.achievement.id === 'sharp_eye');
      const achievementNot = resultNot.find(r => r.achievement.id === 'sharp_eye');

      expect(achievementUnder?.progress).toBe(50); // 10/20 * 100
      expect(achievementQualified?.progress).toBe(100);
      expect(achievementNot?.progress).toBe(0);
    });

    it('returns all 8 achievements in result', () => {
      const progress = createMockProgress();
      const result = getAchievementProgress(progress, []);
      expect(result.length).toBe(8);
    });
  });
});
