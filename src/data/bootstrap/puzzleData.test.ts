/**
 * Puzzle Data Validation Tests
 * Ensures all puzzle JSON files have correct structure and data
 */

import { describe, it, expect } from 'vitest';
import week01Data from './week01.json';
import week02Data from './week02.json';
import week03Data from './week03.json';
import week04Data from './week04.json';

interface PuzzleComment {
  id: string;
  username: string;
  text: string;
  isAI: boolean;
}

interface Puzzle {
  id: string;
  dayNumber: number;
  difficulty: string;
  dayOfWeek: string;
  category: string;
  prompt: { text: string; source: string };
  comments: PuzzleComment[];
  aiCommentIndex: number;
  explanation: {
    aiTells: string[];
    humanTells: string[];
    difficulty_note?: string;
  };
  metadata: {
    createdAt: string;
    createdBy: string;
    reviewed: boolean;
  };
}

interface PuzzleWeek {
  week: number;
  startDate: string;
  puzzles: Puzzle[];
}

const allWeeks: PuzzleWeek[] = [
  week01Data as PuzzleWeek,
  week02Data as PuzzleWeek,
  week03Data as PuzzleWeek,
  week04Data as PuzzleWeek,
];

const validDifficulties = ['easy', 'medium', 'hard', 'expert'];
const validDaysOfWeek = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

describe('Puzzle Data Validation', () => {
  describe('Week structure', () => {
    allWeeks.forEach((weekData, index) => {
      it(`week ${index + 1} has valid structure`, () => {
        expect(weekData).toHaveProperty('week');
        expect(weekData).toHaveProperty('startDate');
        expect(weekData).toHaveProperty('puzzles');
        expect(weekData.week).toBe(index + 1);
        expect(weekData.puzzles).toBeInstanceOf(Array);
        expect(weekData.puzzles.length).toBe(7);
      });
    });
  });

  describe('Individual puzzles', () => {
    allWeeks.forEach((weekData) => {
      weekData.puzzles.forEach((puzzle) => {
        describe(`Puzzle ${puzzle.id}`, () => {
          it('has valid ID format (YYYY-MM-DD)', () => {
            expect(puzzle.id).toMatch(/^\d{4}-\d{2}-\d{2}$/);
          });

          it('has valid day number', () => {
            expect(puzzle.dayNumber).toBeGreaterThan(0);
            expect(puzzle.dayNumber).toBeLessThanOrEqual(28);
          });

          it('has valid difficulty', () => {
            expect(validDifficulties).toContain(puzzle.difficulty);
          });

          it('has valid day of week', () => {
            expect(validDaysOfWeek).toContain(puzzle.dayOfWeek);
          });

          it('has valid prompt', () => {
            expect(puzzle.prompt).toHaveProperty('text');
            expect(puzzle.prompt).toHaveProperty('source');
            expect(puzzle.prompt.text.length).toBeGreaterThan(10);
            expect(puzzle.prompt.source).toMatch(/^r\//);
          });

          it('has exactly 5 comments', () => {
            expect(puzzle.comments.length).toBe(5);
          });

          it('has unique comment IDs', () => {
            const ids = puzzle.comments.map(c => c.id);
            const uniqueIds = new Set(ids);
            expect(uniqueIds.size).toBe(5);
          });

          it('has exactly 1 AI comment', () => {
            const aiComments = puzzle.comments.filter(c => c.isAI);
            expect(aiComments.length).toBe(1);
          });

          it('has valid aiCommentIndex', () => {
            expect(puzzle.aiCommentIndex).toBeGreaterThanOrEqual(0);
            expect(puzzle.aiCommentIndex).toBeLessThan(5);
            expect(puzzle.comments[puzzle.aiCommentIndex].isAI).toBe(true);
          });

          it('has all human comments marked as not AI', () => {
            puzzle.comments.forEach((comment, index) => {
              if (index !== puzzle.aiCommentIndex) {
                expect(comment.isAI).toBe(false);
              }
            });
          });

          it('has explanation with AI tells', () => {
            expect(puzzle.explanation).toHaveProperty('aiTells');
            expect(puzzle.explanation.aiTells.length).toBeGreaterThan(0);
          });

          it('has explanation with human tells', () => {
            expect(puzzle.explanation).toHaveProperty('humanTells');
            expect(puzzle.explanation.humanTells.length).toBeGreaterThan(0);
          });

          it('has valid metadata', () => {
            expect(puzzle.metadata).toHaveProperty('createdAt');
            expect(puzzle.metadata).toHaveProperty('createdBy');
            expect(puzzle.metadata).toHaveProperty('reviewed');
            expect(puzzle.metadata.reviewed).toBe(true);
          });

          it('has reasonable comment lengths', () => {
            puzzle.comments.forEach(comment => {
              expect(comment.text.length).toBeGreaterThan(10);
              expect(comment.text.length).toBeLessThan(1000);
            });
          });

          it('has valid usernames', () => {
            puzzle.comments.forEach(comment => {
              expect(comment.username.length).toBeGreaterThan(2);
              expect(comment.username.length).toBeLessThan(50);
            });
          });
        });
      });
    });
  });

  describe('Day number sequence', () => {
    it('has continuous day numbers across all weeks', () => {
      const allDayNumbers = allWeeks
        .flatMap(week => week.puzzles.map(p => p.dayNumber))
        .sort((a, b) => a - b);

      for (let i = 0; i < allDayNumbers.length; i++) {
        expect(allDayNumbers[i]).toBe(i + 1);
      }
    });
  });

  describe('Difficulty progression', () => {
    it('has appropriate difficulty for day of week', () => {
      allWeeks.forEach(weekData => {
        weekData.puzzles.forEach(puzzle => {
          if (puzzle.dayOfWeek === 'saturday') {
            expect(puzzle.difficulty).toBe('expert');
          }
          // Monday and Tuesday should be easy or medium
          if (puzzle.dayOfWeek === 'monday' || puzzle.dayOfWeek === 'tuesday') {
            expect(['easy', 'medium']).toContain(puzzle.difficulty);
          }
        });
      });
    });
  });

  describe('Total puzzle count', () => {
    it('has 28 puzzles total (4 weeks)', () => {
      const totalPuzzles = allWeeks.reduce(
        (sum, week) => sum + week.puzzles.length,
        0
      );
      expect(totalPuzzles).toBe(28);
    });
  });
});
