/**
 * Puzzle Data Validation Tests
 * Ensures all puzzle JSON files have correct structure and data
 * Scripture Sleuth - validates verse-based puzzles
 */

import { describe, it, expect } from 'vitest';
import week01Data from './week01.json';
import week02Data from './week02.json';
import week03Data from './week03.json';
import week04Data from './week04.json';
import week05Data from './week05.json';
import week06Data from './week06.json';
import week07Data from './week07.json';
import week08Data from './week08.json';
import week09Data from './week09.json';

interface Verse {
  id: string;
  text: string;
  reference: string;
  translation: string;
  linkedSubreddit?: string;
  isFake: boolean;
}

interface Puzzle {
  id: string;
  dayNumber: number;
  difficulty: string;
  dayOfWeek: string;
  category: string;
  theme: string;
  verses: Verse[];
  fakeVerseIndex: number;
  explanation: {
    whyFake: string[];
    whyReal: string[];
    connections?: string[];
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
  week05Data as PuzzleWeek,
  week06Data as PuzzleWeek,
  week07Data as PuzzleWeek,
  week08Data as PuzzleWeek,
  week09Data as PuzzleWeek,
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
            expect(puzzle.dayNumber).toBeLessThanOrEqual(63);
          });

          it('has valid difficulty', () => {
            expect(validDifficulties).toContain(puzzle.difficulty);
          });

          it('has valid day of week', () => {
            expect(validDaysOfWeek).toContain(puzzle.dayOfWeek);
          });

          it('has valid theme', () => {
            expect(puzzle.theme.length).toBeGreaterThan(3);
          });

          it('has exactly 5 verses', () => {
            expect(puzzle.verses.length).toBe(5);
          });

          it('has unique verse IDs', () => {
            const ids = puzzle.verses.map(v => v.id);
            const uniqueIds = new Set(ids);
            expect(uniqueIds.size).toBe(5);
          });

          it('has exactly 1 fake verse', () => {
            const fakeVerses = puzzle.verses.filter(v => v.isFake);
            expect(fakeVerses.length).toBe(1);
          });

          it('has valid fakeVerseIndex', () => {
            expect(puzzle.fakeVerseIndex).toBeGreaterThanOrEqual(0);
            expect(puzzle.fakeVerseIndex).toBeLessThan(5);
            expect(puzzle.verses[puzzle.fakeVerseIndex].isFake).toBe(true);
          });

          it('has all real verses marked as not fake', () => {
            puzzle.verses.forEach((verse, index) => {
              if (index !== puzzle.fakeVerseIndex) {
                expect(verse.isFake).toBe(false);
              }
            });
          });

          it('has explanation with whyFake', () => {
            expect(puzzle.explanation).toHaveProperty('whyFake');
            expect(puzzle.explanation.whyFake.length).toBeGreaterThan(0);
          });

          it('has explanation with whyReal', () => {
            expect(puzzle.explanation).toHaveProperty('whyReal');
            expect(puzzle.explanation.whyReal.length).toBeGreaterThan(0);
          });

          it('has valid metadata', () => {
            expect(puzzle.metadata).toHaveProperty('createdAt');
            expect(puzzle.metadata).toHaveProperty('createdBy');
            expect(puzzle.metadata).toHaveProperty('reviewed');
            expect(puzzle.metadata.reviewed).toBe(true);
          });

          it('has reasonable verse text lengths', () => {
            puzzle.verses.forEach(verse => {
              expect(verse.text.length).toBeGreaterThan(10);
              expect(verse.text.length).toBeLessThan(500);
            });
          });

          it('has valid verse references', () => {
            puzzle.verses.forEach(verse => {
              expect(verse.reference.length).toBeGreaterThan(3);
              expect(verse.reference.length).toBeLessThan(50);
            });
          });

          it('has translation for all verses', () => {
            puzzle.verses.forEach(verse => {
              expect(verse.translation).toBeDefined();
              expect(verse.translation.length).toBeGreaterThan(0);
            });
          });

          it('real verses have linkedSubreddit', () => {
            puzzle.verses.forEach(verse => {
              if (!verse.isFake) {
                expect(verse.linkedSubreddit).toBeDefined();
                expect(verse.linkedSubreddit).toMatch(/^r\//);
              }
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

    it('each week has 7 puzzles with day numbers 1-7', () => {
      allWeeks.forEach((weekData, weekIndex) => {
        const dayNumbers = weekData.puzzles.map(p => p.dayNumber).sort((a, b) => a - b);
        // Day numbers within week are relative to overall sequence
        const expectedStart = weekIndex * 7 + 1;
        for (let i = 0; i < 7; i++) {
          expect(dayNumbers[i]).toBe(expectedStart + i);
        }
      });
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
    it('has 63 puzzles total (9 weeks of content)', () => {
      const totalPuzzles = allWeeks.reduce(
        (sum, week) => sum + week.puzzles.length,
        0
      );
      expect(totalPuzzles).toBe(63);
    });

    it('has 9 weeks of puzzles', () => {
      expect(allWeeks.length).toBe(9);
    });
  });

  describe('No duplicate verses', () => {
    it('has no duplicate verse references across all puzzles', () => {
      const allReferences: string[] = [];
      allWeeks.forEach(week => {
        week.puzzles.forEach(puzzle => {
          puzzle.verses.forEach(verse => {
            if (!verse.isFake) {
              allReferences.push(verse.reference);
            }
          });
        });
      });

      const uniqueReferences = new Set(allReferences);
      // Allow some duplicates (same verse can appear in different contexts)
      // but flag if more than 10% are duplicates
      const duplicateRatio = 1 - (uniqueReferences.size / allReferences.length);
      expect(duplicateRatio).toBeLessThan(0.1);
    });

    it('has unique puzzle IDs', () => {
      const allIds = allWeeks.flatMap(week => week.puzzles.map(p => p.id));
      const uniqueIds = new Set(allIds);
      expect(uniqueIds.size).toBe(allIds.length);
    });

    it('has unique themes across all puzzles', () => {
      const allThemes = allWeeks.flatMap(week => week.puzzles.map(p => p.theme.toLowerCase()));
      const uniqueThemes = new Set(allThemes);
      // Themes should be mostly unique (allow 10% overlap for similar themes)
      const duplicateRatio = 1 - (uniqueThemes.size / allThemes.length);
      expect(duplicateRatio).toBeLessThan(0.1);
    });
  });
});
