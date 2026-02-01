/**
 * Inventory Service
 * Monitors puzzle inventory and provides health check functionality
 */

import type { RedisContext } from './redisKeys';
import { getPuzzle, getPuzzleIndex } from './redisService';

/**
 * Status of the puzzle inventory
 */
export interface InventoryStatus {
  puzzlesLoaded: number;
  daysOfRunway: number;
  missingDates: string[];
  nextEmptyDate: string | null;
  isCritical: boolean;
  isLow: boolean;
}

/**
 * Get a date in puzzle ID format (YYYY-MM-DD)
 */
function formatDateId(date: Date): string {
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const day = String(date.getUTCDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Get today's date in UTC
 */
function getTodayUTC(): Date {
  const now = new Date();
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
}

/**
 * Add days to a date
 */
function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setUTCDate(result.getUTCDate() + days);
  return result;
}

/**
 * Get inventory status for the next N days
 */
export async function getInventoryStatus(
  ctx: RedisContext,
  daysToCheck: number = 7
): Promise<InventoryStatus> {
  const today = getTodayUTC();
  const missingDates: string[] = [];
  let daysOfRunway = 0;
  let nextEmptyDate: string | null = null;
  let foundEmpty = false;

  // Check each day from today
  for (let i = 0; i < daysToCheck; i++) {
    const checkDate = addDays(today, i);
    const dateId = formatDateId(checkDate);
    const puzzle = await getPuzzle(ctx, dateId);

    if (puzzle) {
      if (!foundEmpty) {
        daysOfRunway++;
      }
    } else {
      missingDates.push(dateId);
      if (!foundEmpty) {
        nextEmptyDate = dateId;
        foundEmpty = true;
      }
    }
  }

  // Get total puzzles loaded
  const puzzleIndex = await getPuzzleIndex(ctx);
  const puzzlesLoaded = puzzleIndex.length;

  return {
    puzzlesLoaded,
    daysOfRunway,
    missingDates,
    nextEmptyDate,
    isCritical: daysOfRunway < 1,
    isLow: daysOfRunway < 3,
  };
}

/**
 * Check if inventory is critically low (needs immediate attention)
 */
export async function isCriticallyLow(ctx: RedisContext): Promise<boolean> {
  const status = await getInventoryStatus(ctx, 3);
  return status.daysOfRunway < 1;
}

/**
 * Check if inventory is low (needs attention soon)
 */
export async function isLow(ctx: RedisContext): Promise<boolean> {
  const status = await getInventoryStatus(ctx, 7);
  return status.daysOfRunway < 3;
}

/**
 * Generate a status report for the inventory
 */
export function formatInventoryReport(status: InventoryStatus): string {
  const lines: string[] = [];

  lines.push('**Puzzle Inventory Status**\n');
  lines.push(`- Total puzzles loaded: ${status.puzzlesLoaded}`);
  lines.push(`- Days of runway: ${status.daysOfRunway}`);

  if (status.isCritical) {
    lines.push('\n**CRITICAL: No puzzle for tomorrow!**');
  } else if (status.isLow) {
    lines.push('\n**WARNING: Puzzle inventory running low**');
  }

  if (status.missingDates.length > 0) {
    lines.push('\n**Missing dates:**');
    for (const date of status.missingDates.slice(0, 7)) {
      lines.push(`- ${date}`);
    }
    if (status.missingDates.length > 7) {
      lines.push(`- ...and ${status.missingDates.length - 7} more`);
    }
  }

  if (status.nextEmptyDate) {
    lines.push(`\n**Next empty date:** ${status.nextEmptyDate}`);
  }

  return lines.join('\n');
}

/**
 * Get specific dates that need puzzles
 */
export function getDatesNeedingPuzzles(
  startDate: Date,
  numberOfDays: number
): string[] {
  const dates: string[] = [];
  for (let i = 0; i < numberOfDays; i++) {
    const date = addDays(startDate, i);
    dates.push(formatDateId(date));
  }
  return dates;
}
