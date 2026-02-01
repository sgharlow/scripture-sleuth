/**
 * Puzzle-related type definitions
 * Scripture Sleuth - forked from Comment Conspiracy
 */

// Difficulty levels matching day-of-week progression
export type Difficulty = 'easy' | 'medium' | 'hard' | 'expert';

// Day of week for puzzle scheduling
export type DayOfWeek = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';

// Content categories/themes for verse puzzles
export type Category = 'wisdom' | 'love' | 'judgment' | 'kindness' | 'faith' | 'work' | 'family' | 'misc';

// Verse as stored in puzzle JSON (with isFake flag)
export interface Verse {
  id: string;
  text: string;
  reference: string;         // e.g., "Matthew 7:1" (empty for fake verses)
  translation: string;       // e.g., "KJV" (empty for fake verses)
  linkedSubreddit?: string;  // Only real verses have this (e.g., "r/HumansBeingBros")
  isFake: boolean;
}

// Explanation details for fake verse detection
export interface Explanation {
  whyFake: string[];         // Why the fake verse is detectable
  whyReal: string[];         // Why the real verses are authentic
  connections: string[];     // Explain subreddit connections for each real verse
  difficulty_note?: string;
}

// Puzzle metadata
export interface PuzzleMetadata {
  createdAt: string;
  createdBy: string;
  reviewed: boolean;
}

// Full puzzle as stored in JSON/Redis
export interface Puzzle {
  id: string;              // Date format: "2026-02-01"
  dayNumber: number;
  difficulty: Difficulty;
  dayOfWeek: DayOfWeek;
  category: Category;
  theme: string;           // Daily theme: "Wisdom", "Love", "Judgment", etc.
  verses: Verse[];         // Always 5 verses
  fakeVerseIndex: number;  // Index of fake verse (0-4)
  explanation: Explanation;
  metadata: PuzzleMetadata;
}

// Verse as displayed to user (no isFake flag exposed)
export interface DisplayVerse {
  id: string;
  displayIndex: number;    // 0-4 shuffled position shown to user
  text: string;
  reference: string;       // Shown for all verses (fake ones have plausible-looking refs)
  translation: string;     // e.g., "KJV"
}

// Puzzle as sent to client (fake index hidden until guess)
export interface ShuffledPuzzle {
  id: string;
  dayNumber: number;
  difficulty: Difficulty;
  dayOfWeek: DayOfWeek;
  category: Category;
  theme: string;
  verses: DisplayVerse[];  // Shuffled order, no isFake exposed
}

// Puzzle with reveal info (after guess)
export interface RevealedPuzzle extends ShuffledPuzzle {
  fakeVerseIndex: number;      // Which verse was fake
  explanation: Explanation;
  subredditConnections: SubredditConnection[];  // Revealed connections
}

// Subreddit connection for reveal
export interface SubredditConnection {
  verseId: string;
  subreddit: string;
  explanation: string;
}

// Stats for a single puzzle
export interface PuzzleStats {
  totalPlayers: number;
  correctCount: number;
  correctPercentage: number;
  guessDistribution: number[];  // Count for each verse index [0-4]
  averageTimeMs?: number;
}

// Week of puzzles (bootstrap data format)
export interface PuzzleWeek {
  week: number;
  startDate: string;
  puzzles: Puzzle[];
}

// Legacy aliases for backward compatibility during migration
export type Comment = Verse;
export type DisplayComment = DisplayVerse;
export interface Prompt {
  text: string;
  source: string;
}
