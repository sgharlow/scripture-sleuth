/**
 * Leaderboard Service Tests
 * Tests for leaderboard utility functions
 */

import { describe, it, expect } from 'vitest';
import {
  calculateAccuracy,
  formatRankPercentile,
  formatOrdinal,
  qualifiesForAccuracyLeaderboard,
  gamesUntilAccuracyQualification,
  ACCURACY_LEADERBOARD_MIN_GAMES,
} from './leaderboardService';

describe('Leaderboard Service', () => {
  describe('calculateAccuracy', () => {
    it('returns 0 for no games played', () => {
      expect(calculateAccuracy(0, 0)).toBe(0);
    });

    it('calculates 100% accuracy correctly', () => {
      expect(calculateAccuracy(10, 10)).toBe(100);
    });

    it('calculates 50% accuracy correctly', () => {
      expect(calculateAccuracy(5, 10)).toBe(50);
    });

    it('rounds to nearest integer', () => {
      expect(calculateAccuracy(1, 3)).toBe(33); // 33.33...
      expect(calculateAccuracy(2, 3)).toBe(67); // 66.66...
    });

    it('handles edge case of 0 correct', () => {
      expect(calculateAccuracy(0, 10)).toBe(0);
    });
  });

  describe('formatRankPercentile', () => {
    it('returns "N/A" for 0 total players', () => {
      expect(formatRankPercentile(1, 0)).toBe('N/A');
    });

    it('formats top 1%', () => {
      expect(formatRankPercentile(1, 100)).toBe('Top 1%');
    });

    it('formats top 10%', () => {
      expect(formatRankPercentile(10, 100)).toBe('Top 10%');
    });

    it('formats top 50%', () => {
      expect(formatRankPercentile(50, 100)).toBe('Top 50%');
    });

    it('rounds up percentile', () => {
      // Rank 3 out of 200 = 1.5%, should round to 2%
      expect(formatRankPercentile(3, 200)).toBe('Top 2%');
    });

    it('handles rank equal to total', () => {
      expect(formatRankPercentile(100, 100)).toBe('Top 100%');
    });
  });

  describe('formatOrdinal', () => {
    it('formats 1st correctly', () => {
      expect(formatOrdinal(1)).toBe('1st');
    });

    it('formats 2nd correctly', () => {
      expect(formatOrdinal(2)).toBe('2nd');
    });

    it('formats 3rd correctly', () => {
      expect(formatOrdinal(3)).toBe('3rd');
    });

    it('formats 4th-10th correctly', () => {
      expect(formatOrdinal(4)).toBe('4th');
      expect(formatOrdinal(5)).toBe('5th');
      expect(formatOrdinal(10)).toBe('10th');
    });

    it('formats 11th-13th correctly (special case)', () => {
      expect(formatOrdinal(11)).toBe('11th');
      expect(formatOrdinal(12)).toBe('12th');
      expect(formatOrdinal(13)).toBe('13th');
    });

    it('formats 21st, 22nd, 23rd correctly', () => {
      expect(formatOrdinal(21)).toBe('21st');
      expect(formatOrdinal(22)).toBe('22nd');
      expect(formatOrdinal(23)).toBe('23rd');
    });

    it('formats 111th-113th correctly (special case)', () => {
      expect(formatOrdinal(111)).toBe('111th');
      expect(formatOrdinal(112)).toBe('112th');
      expect(formatOrdinal(113)).toBe('113th');
    });

    it('formats large numbers correctly', () => {
      expect(formatOrdinal(100)).toBe('100th');
      expect(formatOrdinal(101)).toBe('101st');
      expect(formatOrdinal(1000)).toBe('1000th');
    });
  });

  describe('qualifiesForAccuracyLeaderboard', () => {
    it('returns false for 0 games', () => {
      expect(qualifiesForAccuracyLeaderboard(0)).toBe(false);
    });

    it('returns false for 9 games', () => {
      expect(qualifiesForAccuracyLeaderboard(9)).toBe(false);
    });

    it('returns true for 10 games', () => {
      expect(qualifiesForAccuracyLeaderboard(10)).toBe(true);
    });

    it('returns true for more than 10 games', () => {
      expect(qualifiesForAccuracyLeaderboard(50)).toBe(true);
    });
  });

  describe('gamesUntilAccuracyQualification', () => {
    it('returns 10 for 0 games played', () => {
      expect(gamesUntilAccuracyQualification(0)).toBe(10);
    });

    it('returns 5 for 5 games played', () => {
      expect(gamesUntilAccuracyQualification(5)).toBe(5);
    });

    it('returns 1 for 9 games played', () => {
      expect(gamesUntilAccuracyQualification(9)).toBe(1);
    });

    it('returns 0 for 10 games played', () => {
      expect(gamesUntilAccuracyQualification(10)).toBe(0);
    });

    it('returns 0 for more than 10 games', () => {
      expect(gamesUntilAccuracyQualification(50)).toBe(0);
    });
  });

  describe('ACCURACY_LEADERBOARD_MIN_GAMES', () => {
    it('is set to 10', () => {
      expect(ACCURACY_LEADERBOARD_MIN_GAMES).toBe(10);
    });
  });
});
