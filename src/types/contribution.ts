/**
 * User Contribution types for Scripture Sleuth
 * Allows users to submit fake verse ideas that may be used in future puzzles
 */

import type { Category } from './puzzle';

// Status of a contribution submission
export type ContributionStatus = 'pending' | 'approved' | 'rejected' | 'used';

// A user-submitted fake verse contribution
export interface ContributionSubmission {
  id: string;                       // Unique ID (uuid)
  userId: string;                   // Reddit user ID
  username: string;                 // Reddit username for display
  createdAt: string;                // ISO timestamp

  // The contribution content
  themeIdea: string;                // Suggested theme for the puzzle
  category: Category;               // Category for the theme
  fakeVerseText: string;            // The fake verse they wrote
  whyFake: string[];                // Why this verse sounds fake (user explains)

  // Status and moderation
  status: ContributionStatus;
  moderatorNote?: string;           // Feedback from moderator
  reviewedAt?: string;              // When it was reviewed
  reviewedBy?: string;              // Moderator who reviewed

  // Voting
  upvotes: number;
  downvotes: number;
  voterIds: string[];               // Users who have voted (to prevent double voting)

  // If used in a puzzle
  usedInPuzzleId?: string;          // Puzzle ID where this was used
  usedAt?: string;                  // When it was used
}

// Simplified contribution for display (hides voter IDs, etc.)
export interface ContributionDisplay {
  id: string;
  username: string;
  createdAt: string;
  themeIdea: string;
  category: Category;
  fakeVerseText: string;
  whyFake: string[];
  status: ContributionStatus;
  upvotes: number;
  downvotes: number;
  userVote: 'up' | 'down' | null;   // Current user's vote
  usedInPuzzleId?: string;
}

// User's contribution stats
export interface ContributorStats {
  userId: string;
  username: string;
  totalSubmissions: number;
  approvedCount: number;
  usedCount: number;                // How many were used in actual puzzles
  totalUpvotes: number;
  contributorScore: number;         // Weighted score for leaderboard
}

// Vote on a contribution
export interface ContributionVote {
  oderId: string;
  contributionId: string;
  vote: 'up' | 'down';
  timestamp: string;
}

// Request to submit a contribution
export interface SubmitContributionRequest {
  themeIdea: string;
  category: Category;
  fakeVerseText: string;
  whyFake: string[];
}

// Filter options for listing contributions
export interface ContributionFilter {
  status?: ContributionStatus;
  category?: Category;
  sortBy?: 'newest' | 'popular' | 'controversial';
  limit?: number;
  offset?: number;
}
