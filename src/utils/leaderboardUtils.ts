/**
 * Leaderboard Utilities
 * Frontend-safe utility functions for leaderboard display
 */

/**
 * Get user's accuracy percentage
 */
export function calculateAccuracy(totalCorrect: number, totalPlayed: number): number {
  if (totalPlayed === 0) return 0;
  return Math.round((totalCorrect / totalPlayed) * 100);
}

/**
 * Format rank as percentile string
 */
export function formatRankPercentile(rank: number, total: number): string {
  if (total === 0) return 'N/A';
  const percentile = Math.ceil((rank / total) * 100);
  return `Top ${percentile}%`;
}

/**
 * Format rank as ordinal string (1st, 2nd, 3rd, etc.)
 */
export function formatOrdinal(n: number): string {
  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

/**
 * Get minimum games required for accuracy leaderboard
 */
export const ACCURACY_LEADERBOARD_MIN_GAMES = 10;

/**
 * Check if user qualifies for accuracy leaderboard
 */
export function qualifiesForAccuracyLeaderboard(totalPlayed: number): boolean {
  return totalPlayed >= ACCURACY_LEADERBOARD_MIN_GAMES;
}

/**
 * Get games remaining until qualifying for accuracy leaderboard
 */
export function gamesUntilAccuracyQualification(totalPlayed: number): number {
  return Math.max(0, ACCURACY_LEADERBOARD_MIN_GAMES - totalPlayed);
}
