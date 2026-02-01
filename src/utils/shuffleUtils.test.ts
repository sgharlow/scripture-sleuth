/**
 * Shuffle Utils Tests
 * Tests for deterministic shuffling with seeded random
 */

import { describe, it, expect } from 'vitest';
import { hashSeed, seededRandom, shuffleArray } from './shuffleUtils';

describe('Shuffle Utils', () => {
  describe('hashSeed', () => {
    it('returns consistent hash for same string', () => {
      const hash1 = hashSeed('test-string');
      const hash2 = hashSeed('test-string');
      expect(hash1).toBe(hash2);
    });

    it('returns different hashes for different strings', () => {
      const hash1 = hashSeed('string-a');
      const hash2 = hashSeed('string-b');
      expect(hash1).not.toBe(hash2);
    });

    it('returns non-negative integers', () => {
      const testStrings = ['test', '', 'a', 'long string with many characters'];
      testStrings.forEach(str => {
        const hash = hashSeed(str);
        expect(hash).toBeGreaterThanOrEqual(0);
        expect(Number.isInteger(hash)).toBe(true);
      });
    });

    it('handles empty string', () => {
      const hash = hashSeed('');
      expect(hash).toBe(0);
    });

    it('creates unique seeds for user+puzzle combinations', () => {
      const seeds = new Set<number>();
      const users = ['user1', 'user2', 'user3'];
      const puzzles = ['2026-01-19', '2026-01-20', '2026-01-21'];

      users.forEach(user => {
        puzzles.forEach(puzzle => {
          seeds.add(hashSeed(`${user}:${puzzle}`));
        });
      });

      // All 9 combinations should be unique
      expect(seeds.size).toBe(9);
    });
  });

  describe('seededRandom', () => {
    it('returns consistent sequence for same seed', () => {
      const random1 = seededRandom(12345);
      const random2 = seededRandom(12345);

      const sequence1 = [random1(), random1(), random1()];
      const sequence2 = [random2(), random2(), random2()];

      expect(sequence1).toEqual(sequence2);
    });

    it('returns different sequences for different seeds', () => {
      const random1 = seededRandom(12345);
      const random2 = seededRandom(54321);

      const val1 = random1();
      const val2 = random2();

      expect(val1).not.toBe(val2);
    });

    it('returns values between 0 and 1', () => {
      const random = seededRandom(99999);

      for (let i = 0; i < 100; i++) {
        const val = random();
        expect(val).toBeGreaterThanOrEqual(0);
        expect(val).toBeLessThan(1);
      }
    });

    it('produces uniform distribution', () => {
      const random = seededRandom(42);
      const buckets = [0, 0, 0, 0, 0]; // 5 buckets for 0-0.2, 0.2-0.4, etc.
      const iterations = 1000;

      for (let i = 0; i < iterations; i++) {
        const val = random();
        const bucket = Math.min(4, Math.floor(val * 5));
        buckets[bucket]++;
      }

      // Each bucket should have roughly 200 values (20% of 1000)
      // Allow 50% tolerance
      buckets.forEach(count => {
        expect(count).toBeGreaterThan(100);
        expect(count).toBeLessThan(300);
      });
    });
  });

  describe('shuffleArray', () => {
    it('returns consistent shuffle for same seed', () => {
      const array = [1, 2, 3, 4, 5];
      const shuffled1 = shuffleArray(array, 12345);
      const shuffled2 = shuffleArray(array, 12345);

      expect(shuffled1).toEqual(shuffled2);
    });

    it('returns different shuffle for different seeds', () => {
      const array = [1, 2, 3, 4, 5];
      const shuffled1 = shuffleArray(array, 12345);
      const shuffled2 = shuffleArray(array, 54321);

      // Technically could be the same by chance, but very unlikely for 5 items
      expect(shuffled1).not.toEqual(shuffled2);
    });

    it('preserves all elements', () => {
      const array = [1, 2, 3, 4, 5];
      const shuffled = shuffleArray(array, 99999);

      expect(shuffled.sort()).toEqual([1, 2, 3, 4, 5]);
    });

    it('does not modify original array', () => {
      const array = [1, 2, 3, 4, 5];
      const original = [...array];
      shuffleArray(array, 12345);

      expect(array).toEqual(original);
    });

    it('handles empty array', () => {
      const shuffled = shuffleArray([], 12345);
      expect(shuffled).toEqual([]);
    });

    it('handles single element array', () => {
      const shuffled = shuffleArray([42], 12345);
      expect(shuffled).toEqual([42]);
    });

    it('handles array of objects', () => {
      const array = [
        { id: 1, name: 'a' },
        { id: 2, name: 'b' },
        { id: 3, name: 'c' },
      ];
      const shuffled = shuffleArray(array, 12345);

      expect(shuffled.length).toBe(3);
      expect(shuffled.map(o => o.id).sort()).toEqual([1, 2, 3]);
    });

    it('produces different positions for comments with different users', () => {
      const comments = ['A', 'B', 'C', 'D', 'E'];
      const puzzleId = '2026-01-19';

      const user1Seed = hashSeed(`user1:${puzzleId}`);
      const user2Seed = hashSeed(`user2:${puzzleId}`);

      const shuffled1 = shuffleArray(comments, user1Seed);
      const shuffled2 = shuffleArray(comments, user2Seed);

      // Different users see different orders
      expect(shuffled1).not.toEqual(shuffled2);
    });

    it('same user sees same order across refreshes (simulated)', () => {
      const comments = ['Comment1', 'Comment2', 'Comment3', 'Comment4', 'Comment5'];
      const seed = hashSeed('user123:2026-01-19');

      // Simulate multiple "sessions"
      const order1 = shuffleArray(comments, seed);
      const order2 = shuffleArray(comments, seed);
      const order3 = shuffleArray(comments, seed);

      expect(order1).toEqual(order2);
      expect(order2).toEqual(order3);
    });
  });
});
