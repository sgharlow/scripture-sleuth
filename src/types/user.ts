/**
 * User-related type definitions
 * Scripture Sleuth - forked from Comment Conspiracy
 */

import type { Difficulty } from './puzzle';

// Result for a single day's play
export interface DayResult {
  puzzleId: string;
  date: string;
  wasCorrect: boolean;
  guessedIndex: number;
  correctIndex: number;
  difficulty: Difficulty;
  timestamp: number;
}

// Stats by difficulty level: [correct, played]
export interface DifficultyStats {
  easy: [number, number];
  medium: [number, number];
  hard: [number, number];
  expert: [number, number];
}

// User's overall progress
export interface UserProgress {
  userId: string;
  currentStreak: number;
  longestStreak: number;
  lastPlayed: string | null;     // ISO date string
  totalPlayed: number;
  totalCorrect: number;
  byDifficulty: DifficultyStats;
}

// User's guess record for a specific puzzle
export interface UserGuess {
  puzzleId: string;
  guessedIndex: number;
  wasCorrect: boolean;
  timestamp: number;
  timeToGuessMs?: number;
}

// Achievement definition
export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt?: string;
}

// Achievement IDs
export type AchievementId =
  | 'first_correct'      // First correct guess
  | 'streak_3'           // 3-day streak
  | 'streak_7'           // 7-day streak
  | 'streak_30'          // 30-day streak
  | 'perfect_week'       // 7 correct in a row
  | 'hard_mode'          // Correct on expert difficulty
  | 'veteran'            // Played 30 games
  | 'sharp_eye';         // 80%+ accuracy over 20 games

// Leaderboard entry
export interface LeaderboardEntry {
  userId: string;
  username: string;
  score: number;         // Streak count or accuracy %
  rank: number;
}

// User's position on leaderboard
export interface LeaderboardPosition {
  rank: number;
  total: number;
  percentile: number;    // "Top X%"
}
