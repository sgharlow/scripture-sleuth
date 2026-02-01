/**
 * Central export for all type definitions
 * Scripture Sleuth
 */

// Puzzle types
export type {
  Difficulty,
  DayOfWeek,
  Category,
  Verse,
  Explanation,
  PuzzleMetadata,
  Puzzle,
  DisplayVerse,
  ShuffledPuzzle,
  RevealedPuzzle,
  SubredditConnection,
  PuzzleStats,
  PuzzleWeek,
  // Legacy aliases
  Comment,
  DisplayComment,
  Prompt,
} from './puzzle';

// User types
export type {
  DayResult,
  DifficultyStats,
  UserProgress,
  UserGuess,
  Achievement,
  AchievementId,
  LeaderboardEntry,
  LeaderboardPosition,
} from './user';

// Game types
export type {
  GameState,
  GuessResult,
  GameContext,
  GameAction,
  CountdownState,
  ShareData,
} from './game';

// Message types
export type {
  WebViewToDevvitMessage,
  DevvitToWebViewMessage,
  InitData,
  LeaderboardRankData,
} from './messages';

// Contribution types
export type {
  ContributionStatus,
  ContributionSubmission,
  ContributionDisplay,
  ContributorStats,
  ContributionVote,
  SubmitContributionRequest,
  ContributionFilter,
} from './contribution';
