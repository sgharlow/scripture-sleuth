/**
 * Message types for Devvit <-> WebView communication
 * Scripture Sleuth
 */

import type { ShuffledPuzzle, GuessResult, UserProgress, ContributionDisplay, ContributorStats, SubmitContributionRequest, ContributionFilter, Category } from './index';

// Messages from WebView to Devvit
export type WebViewToDevvitMessage =
  | { type: 'INIT' }
  | { type: 'SUBMIT_GUESS'; guessIndex: number }
  // Contribution messages
  | { type: 'SUBMIT_CONTRIBUTION'; data: SubmitContributionRequest }
  | { type: 'VOTE_CONTRIBUTION'; contributionId: string; vote: 'up' | 'down' }
  | { type: 'GET_CONTRIBUTIONS'; filter: ContributionFilter }
  | { type: 'GET_MY_CONTRIBUTIONS' }
  | { type: 'GET_TOP_CONTRIBUTORS' };

// Messages from Devvit to WebView
export type DevvitToWebViewMessage =
  | { type: 'INIT_RESPONSE'; data: InitData }
  | { type: 'GUESS_RESPONSE'; result: GuessResult }
  | { type: 'ERROR'; error: string }
  // Contribution responses
  | { type: 'CONTRIBUTION_SUBMITTED'; contribution: ContributionDisplay }
  | { type: 'CONTRIBUTION_VOTED'; contribution: ContributionDisplay }
  | { type: 'CONTRIBUTIONS_LIST'; contributions: ContributionDisplay[] }
  | { type: 'MY_CONTRIBUTIONS'; contributions: ContributionDisplay[] }
  | { type: 'TOP_CONTRIBUTORS'; contributors: ContributorStats[] };

// Leaderboard rank info
export interface LeaderboardRankData {
  rank: number;
  total: number;
}

// Initial data sent to WebView on load
export interface InitData {
  userId: string;
  puzzle: ShuffledPuzzle | null;
  userProgress: UserProgress;
  previousResult: GuessResult | null; // If already played today
  streakRank: LeaderboardRankData | null;
  accuracyRank: LeaderboardRankData | null;
}
