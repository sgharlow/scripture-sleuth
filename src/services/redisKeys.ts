/**
 * Redis key schema for Comment Conspiracy
 * Based on comment-conspiracy-spec-v2.md Section 10
 */

export const REDIS_KEYS = {
  // Puzzle storage
  puzzle: (id: string) => `puzzle:${id}`,                     // puzzle:2026-01-20
  puzzleIndex: () => `puzzle:index`,                          // List of all puzzle IDs
  currentPuzzle: () => `puzzle:current`,                      // Today's puzzle ID

  // User data
  userProgress: (userId: string) => `user:${userId}:progress`,
  userGuess: (userId: string, puzzleId: string) => `user:${userId}:guess:${puzzleId}`,
  userHistory: (userId: string) => `user:${userId}:history`,
  userAchievements: (userId: string) => `user:${userId}:achievements`,

  // Daily stats
  dailyStats: (puzzleId: string) => `stats:${puzzleId}`,
  dailyGuesses: (puzzleId: string) => `guesses:${puzzleId}`,  // Hash: index → count

  // Leaderboards
  streakLeaderboard: () => `leaderboard:streaks`,             // Sorted set
  accuracyLeaderboard: () => `leaderboard:accuracy`,          // Sorted set
  contributorLeaderboard: () => `leaderboard:contributors`,   // Sorted set

  // User contributions
  contribution: (id: string) => `contribution:${id}`,         // Individual contribution
  contributionIndex: (status: string) => `contributions:${status}`, // List by status (pending/approved/rejected)
  userContributions: (userId: string) => `user:${userId}:contributions`, // User's contribution IDs
  contributorStats: (userId: string) => `contributor:${userId}:stats`, // User's contribution stats
} as const;

// Type for the context parameter from Devvit
// Note: Devvit Redis does NOT support List operations (lPush, lRange, etc.)
// We use JSON strings in regular keys or Sets for list-like data
export interface RedisContext {
  redis: {
    // String operations
    get: (key: string) => Promise<string | undefined>;
    set: (key: string, value: string) => Promise<void>;
    del: (key: string) => Promise<void>;
    // Hash operations
    hGet: (key: string, field: string) => Promise<string | undefined>;
    hSet: (key: string, fieldValues: Record<string, string>) => Promise<number>;
    hGetAll: (key: string) => Promise<Record<string, string>>;
    hIncrBy: (key: string, field: string, value: number) => Promise<number>;
    // Sorted Set operations
    zAdd: (key: string, ...members: { score: number; member: string }[]) => Promise<number>;
    zScore: (key: string, member: string) => Promise<number | undefined>;
    zRank: (key: string, member: string) => Promise<number | undefined>;
    zCard: (key: string) => Promise<number>;
  };
}
