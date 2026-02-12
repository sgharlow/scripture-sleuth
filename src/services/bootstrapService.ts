/**
 * Bootstrap service for loading initial puzzle data
 * Scripture Sleuth - forked from Comment Conspiracy
 * Implements lazy loading - seeds puzzles on first request if Redis is empty
 */

import type { Puzzle, PuzzleWeek } from '../types';
import type { RedisContext } from './redisKeys';
import { setPuzzle, addToPuzzleIndex, setCurrentPuzzleId, getPuzzleIndex } from './redisService';

// Import bootstrap puzzle data
// Note: In Devvit, JSON imports may need to be handled differently
// This is bundled at build time
import week01Data from '../data/bootstrap/week01.json';
import week02Data from '../data/bootstrap/week02.json';
import week03Data from '../data/bootstrap/week03.json';
import week04Data from '../data/bootstrap/week04.json';
import week05Data from '../data/bootstrap/week05.json';
import week06Data from '../data/bootstrap/week06.json';
import week07Data from '../data/bootstrap/week07.json';
import week08Data from '../data/bootstrap/week08.json';
import week09Data from '../data/bootstrap/week09.json';

// All week data combined (63 puzzles - 9 weeks of content)
const allWeeksData = [
  week01Data,
  week02Data,
  week03Data,
  week04Data,
  week05Data,
  week06Data,
  week07Data,
  week08Data,
  week09Data,
] as PuzzleWeek[];

/**
 * Check if puzzles have been seeded
 */
export async function isPuzzleDataSeeded(ctx: RedisContext): Promise<boolean> {
  console.log('[Bootstrap] isPuzzleDataSeeded: calling getPuzzleIndex');
  const index = await getPuzzleIndex(ctx);
  console.log('[Bootstrap] isPuzzleDataSeeded: index length =', index.length);
  return index.length > 0;
}

/**
 * Seed all bootstrap puzzles into Redis
 * Only runs if puzzle:index is empty
 */
export async function seedPuzzles(ctx: RedisContext): Promise<{ seeded: boolean; count: number }> {
  // Check if already seeded
  const alreadySeeded = await isPuzzleDataSeeded(ctx);
  if (alreadySeeded) {
    return { seeded: false, count: 0 };
  }

  // Collect all puzzles from all weeks
  const allPuzzles: Puzzle[] = [];
  for (const weekData of allWeeksData) {
    allPuzzles.push(...weekData.puzzles);
  }

  console.log(`[Bootstrap] Seeding ${allPuzzles.length} puzzles...`);

  // Store each puzzle and add to index
  for (const puzzle of allPuzzles) {
    await setPuzzle(ctx, puzzle);
    await addToPuzzleIndex(ctx, puzzle.id);
  }

  console.log(`[Bootstrap] Seeded ${allPuzzles.length} puzzles`);
  return { seeded: true, count: allPuzzles.length };
}

/**
 * Get today's puzzle ID based on date
 */
function getTodayPuzzleId(): string {
  const now = new Date();
  const year = now.getUTCFullYear();
  const month = String(now.getUTCMonth() + 1).padStart(2, '0');
  const day = String(now.getUTCDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Ensure puzzles are loaded before accessing
 * Call this at app startup or before first puzzle request
 */
export async function ensurePuzzlesLoaded(ctx: RedisContext): Promise<void> {
  console.log('[Bootstrap] ensurePuzzlesLoaded called');
  console.log('[Bootstrap] Checking if seeded...');
  const isSeeded = await isPuzzleDataSeeded(ctx);
  console.log('[Bootstrap] isSeeded:', isSeeded);
  if (!isSeeded) {
    console.log('[Bootstrap] Seeding puzzles...');
    await seedPuzzles(ctx);
    console.log('[Bootstrap] Seeding complete');
  } else {
    // Check for new puzzles that need to be added incrementally
    console.log('[Bootstrap] Checking for new puzzles to add...');
    await seedNewPuzzles(ctx);
  }
  console.log('[Bootstrap] ensurePuzzlesLoaded done');
}

/**
 * Seed only NEW puzzles that aren't already in Redis
 * This handles incremental updates when new week files are added
 */
export async function seedNewPuzzles(ctx: RedisContext): Promise<{ added: number }> {
  const existingIndex = await getPuzzleIndex(ctx);
  const existingSet = new Set(existingIndex);

  // Collect all puzzles from bootstrap data
  const allPuzzles: Puzzle[] = [];
  for (const weekData of allWeeksData) {
    allPuzzles.push(...weekData.puzzles);
  }

  // Find puzzles that aren't in Redis yet
  const newPuzzles = allPuzzles.filter(p => !existingSet.has(p.id));

  if (newPuzzles.length === 0) {
    console.log('[Bootstrap] No new puzzles to add');
    return { added: 0 };
  }

  console.log(`[Bootstrap] Adding ${newPuzzles.length} new puzzles...`);

  // Add new puzzles to Redis
  for (const puzzle of newPuzzles) {
    await setPuzzle(ctx, puzzle);
    await addToPuzzleIndex(ctx, puzzle.id);
  }

  console.log(`[Bootstrap] Added ${newPuzzles.length} new puzzles`);
  return { added: newPuzzles.length };
}

/**
 * Get all puzzle IDs sorted by date
 */
export async function getAllPuzzleIds(ctx: RedisContext): Promise<string[]> {
  await ensurePuzzlesLoaded(ctx);
  const index = await getPuzzleIndex(ctx);
  return index.sort();
}

/**
 * Get puzzle count
 */
export async function getPuzzleCount(ctx: RedisContext): Promise<number> {
  const index = await getPuzzleIndex(ctx);
  return index.length;
}
