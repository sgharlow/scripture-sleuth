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

// All week data combined (7 puzzles for MVP - week of Feb 1-7, 2026)
const allWeeksData = [
  week01Data,
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
 * Ensure puzzles are loaded and current puzzle is set
 * Call this at the start of any puzzle fetch operation
 */
export async function ensurePuzzlesLoaded(ctx: RedisContext): Promise<void> {
  console.log('[Bootstrap] ensurePuzzlesLoaded: starting...');

  // Seed if needed
  const seedResult = await seedPuzzles(ctx);
  if (seedResult.seeded) {
    console.log(`[Bootstrap] First-time setup: seeded ${seedResult.count} puzzles`);
  }

  // Get today's puzzle ID
  const todayId = getTodayPuzzleId();
  console.log('[Bootstrap] Today puzzle ID:', todayId);

  // Check if this puzzle exists in our data
  const puzzleIndex = await getPuzzleIndex(ctx);
  if (puzzleIndex.includes(todayId)) {
    // Set as current puzzle
    await setCurrentPuzzleId(ctx, todayId);
    console.log('[Bootstrap] Set current puzzle to today:', todayId);
  } else {
    // Today's puzzle doesn't exist, use the first available puzzle
    console.log('[Bootstrap] Today puzzle not found, looking for fallback...');
    if (puzzleIndex.length > 0) {
      // Sort puzzles by date and find the closest one
      const sortedPuzzles = [...puzzleIndex].sort();

      // Find a puzzle that's on or after today, or the latest one available
      let fallbackId = sortedPuzzles[sortedPuzzles.length - 1]; // Default to latest
      for (const id of sortedPuzzles) {
        if (id >= todayId) {
          fallbackId = id;
          break;
        }
      }

      await setCurrentPuzzleId(ctx, fallbackId);
      console.log('[Bootstrap] Set current puzzle to fallback:', fallbackId);
    } else {
      console.log('[Bootstrap] No puzzles available!');
    }
  }
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
