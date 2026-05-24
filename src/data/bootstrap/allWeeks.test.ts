/**
 * Full-inventory validation across ALL week*.json bootstrap files.
 * Complements puzzleData.test.ts (which only imports weeks 1-9) by validating
 * every shipped puzzle — including weeks added after launch.
 * Reads files from disk so it auto-covers new weeks with no edits.
 */
import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const dir = path.dirname(fileURLToPath(import.meta.url));
const DOW = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
const weekdayOf = (id: string): string => DOW[new Date(id + 'T00:00:00Z').getUTCDay()];

// 66-book KJV canon (real verses must cite one of these; "Psalm" and "Psalms" both allowed)
const CANON = new Set([
  'Genesis','Exodus','Leviticus','Numbers','Deuteronomy','Joshua','Judges','Ruth',
  '1 Samuel','2 Samuel','1 Kings','2 Kings','1 Chronicles','2 Chronicles','Ezra','Nehemiah',
  'Esther','Job','Psalm','Psalms','Proverbs','Ecclesiastes','Song of Solomon','Isaiah','Jeremiah',
  'Lamentations','Ezekiel','Daniel','Hosea','Joel','Amos','Obadiah','Jonah','Micah','Nahum',
  'Habakkuk','Zephaniah','Haggai','Zechariah','Malachi','Matthew','Mark','Luke','John','Acts',
  'Romans','1 Corinthians','2 Corinthians','Galatians','Ephesians','Philippians','Colossians',
  '1 Thessalonians','2 Thessalonians','1 Timothy','2 Timothy','Titus','Philemon','Hebrews','James',
  '1 Peter','2 Peter','1 John','2 John','3 John','Jude','Revelation',
]);
const bookOf = (ref: string): string | null => {
  const m = ref.match(/^(.*?)\s+\d+:\d+/);
  return m ? m[1].trim() : null;
};

const files = fs.readdirSync(dir).filter((f) => /^week\d+\.json$/.test(f)).sort();
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const weeks: any[] = files.map((f) => JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8')));
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const puzzles: any[] = weeks.flatMap((w) => w.puzzles);

describe('All weeks — full puzzle inventory', () => {
  it('loads at least the launch weeks', () => {
    expect(files.length).toBeGreaterThanOrEqual(9);
    expect(puzzles.length).toBeGreaterThanOrEqual(63);
  });

  it('has continuous dayNumbers 1..N (no gaps, no dupes)', () => {
    const dns = puzzles.map((p) => p.dayNumber).sort((a: number, b: number) => a - b);
    dns.forEach((n: number, i: number) => expect(n).toBe(i + 1));
  });

  it('has unique puzzle ids', () => {
    const ids = puzzles.map((p) => p.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('has sequential week numbers 1..N', () => {
    const ws = weeks.map((w) => w.week).sort((a: number, b: number) => a - b);
    ws.forEach((w: number, i: number) => expect(w).toBe(i + 1));
  });

  puzzles.forEach((p) => {
    describe(`puzzle ${p.id}`, () => {
      it('id is YYYY-MM-DD', () => expect(p.id).toMatch(/^\d{4}-\d{2}-\d{2}$/));
      it('dayOfWeek matches the calendar date', () => expect(p.dayOfWeek).toBe(weekdayOf(p.id)));
      it('contains no leftover placeholders', () => expect(JSON.stringify(p)).not.toContain('__TODO'));
      it('saturday puzzles are expert', () => {
        if (p.dayOfWeek === 'saturday') expect(p.difficulty).toBe('expert');
      });
      it('monday/tuesday are easy or medium', () => {
        if (p.dayOfWeek === 'monday' || p.dayOfWeek === 'tuesday') {
          expect(['easy', 'medium']).toContain(p.difficulty);
        }
      });
      it('metadata.reviewed is true', () => expect(p.metadata.reviewed).toBe(true));
      it('has a non-trivial theme', () => expect(p.theme.length).toBeGreaterThan(3));
      it('has exactly 5 verses with exactly 1 fake and a matching fakeVerseIndex', () => {
        expect(p.verses.length).toBe(5);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        expect(p.verses.filter((v: any) => v.isFake).length).toBe(1);
        expect(p.verses[p.fakeVerseIndex].isFake).toBe(true);
        expect(new Set(p.verses.map((v: { id: string }) => v.id)).size).toBe(5);
      });
      it('real verses cite a real Bible book and link a subreddit; fake verse does not', () => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        p.verses.forEach((v: any) => {
          if (!v.isFake) {
            expect(v.linkedSubreddit).toMatch(/^r\//);
            expect(CANON.has(bookOf(v.reference) ?? '')).toBe(true);
          } else {
            expect(v.linkedSubreddit).toBe('');
          }
        });
      });
    });
  });
});
