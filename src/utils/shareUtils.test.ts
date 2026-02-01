/**
 * Share Utils Tests
 * Tests for share text generation
 */

import { describe, it, expect } from 'vitest';
import { generateShareText, generateShareTextWithEmojis } from './shareUtils';
import type { ShareData } from './shareUtils';

describe('Share Utils', () => {
  describe('generateShareText', () => {
    it('generates correct text for a correct guess with streak', () => {
      const data: ShareData = {
        dayNumber: 5,
        wasCorrect: true,
        streak: 3,
      };

      const result = generateShareText(data);

      expect(result).toContain('Comment Conspiracy Day 5');
      expect(result).toContain('1/1');
      expect(result).toContain('3-day streak');
      expect(result).toContain('r/CommentConspiracy');
    });

    it('generates correct text for an incorrect guess', () => {
      const data: ShareData = {
        dayNumber: 10,
        wasCorrect: false,
        streak: 0,
      };

      const result = generateShareText(data);

      expect(result).toContain('Comment Conspiracy Day 10');
      expect(result).toContain('0/1');
      expect(result).not.toContain('streak');
      expect(result).toContain('r/CommentConspiracy');
    });

    it('does not show streak when streak is 0', () => {
      const data: ShareData = {
        dayNumber: 1,
        wasCorrect: true,
        streak: 0,
      };

      const result = generateShareText(data);

      expect(result).not.toContain('streak');
    });

    it('shows singular "day" for 1-day streak', () => {
      const data: ShareData = {
        dayNumber: 2,
        wasCorrect: true,
        streak: 1,
      };

      const result = generateShareText(data);

      expect(result).toContain('1-day streak');
    });

    it('shows plural "days" for multi-day streak', () => {
      const data: ShareData = {
        dayNumber: 7,
        wasCorrect: true,
        streak: 7,
      };

      const result = generateShareText(data);

      expect(result).toContain('7-day streak');
    });
  });

  describe('generateShareTextWithEmojis', () => {
    it('includes emojis for correct guess', () => {
      const data: ShareData = {
        dayNumber: 5,
        wasCorrect: true,
        streak: 3,
      };

      const result = generateShareTextWithEmojis(data);

      expect(result).toContain('🔍');
      expect(result).toContain('✅ 1/1');
      expect(result).toContain('🔥');
    });

    it('includes X emoji for incorrect guess', () => {
      const data: ShareData = {
        dayNumber: 5,
        wasCorrect: false,
        streak: 0,
      };

      const result = generateShareTextWithEmojis(data);

      expect(result).toContain('🔍');
      expect(result).toContain('❌ 0/1');
    });

    it('does not include fire emoji when no streak', () => {
      const data: ShareData = {
        dayNumber: 1,
        wasCorrect: true,
        streak: 0,
      };

      const result = generateShareTextWithEmojis(data);

      expect(result).not.toContain('🔥');
    });
  });
});
