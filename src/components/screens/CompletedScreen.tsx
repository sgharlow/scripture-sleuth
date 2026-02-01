/**
 * CompletedScreen Component
 * Shown when user has already played today
 * Scripture theme: "Today's Puzzle Complete"
 */

import React from 'react';
import type { GuessResult, ShuffledPuzzle, UserProgress, LeaderboardRankData } from '../../types';
import { StatsPanel } from '../results/StatsPanel';
import { Timer } from '../shared/Timer';
import { LeaderboardPanel } from '../results/Leaderboard';

export interface CompletedScreenProps {
  result: GuessResult;
  puzzle: ShuffledPuzzle;
  userProgress?: UserProgress;
  streakRank?: LeaderboardRankData | null;
  accuracyRank?: LeaderboardRankData | null;
  onViewBreakdown?: () => void;
  onJoinDiscussion?: () => void;
  onContribute?: () => void;
}

export function CompletedScreen({
  result,
  puzzle: _puzzle,
  userProgress,
  streakRank,
  accuracyRank,
  onViewBreakdown,
  onJoinDiscussion,
  onContribute,
}: CompletedScreenProps): React.ReactElement {
  return (
    <div className="flex flex-col h-full w-full max-w-2xl mx-auto px-4 py-6 overflow-y-auto bg-scripture-bg">
      {/* Header Banner */}
      <div className="text-center py-6 bg-scripture-card border border-scripture-border rounded-xl mb-6">
        <div className="text-3xl mb-2">📖</div>
        <h2 className="text-lg font-bold text-textPrimary uppercase tracking-wider">
          Today's Puzzle Complete
        </h2>
        <p className="text-textSecondary text-sm mt-1">
          You've already made your selection
        </p>
      </div>

      {/* User's Result */}
      <div className={`border rounded-xl p-4 mb-6 ${
        result.wasCorrect
          ? 'bg-correct/10 border-correct/30'
          : 'bg-incorrect/10 border-incorrect/30'
      }`}>
        <div className="flex items-center justify-between mb-3">
          <span className="text-textSecondary text-sm">Your choice:</span>
          <span className="font-bold text-textPrimary">
            Verse #{result.guessedIndex + 1}{' '}
            {result.wasCorrect ? (
              <span className="text-correct">(Found it! ✓)</span>
            ) : (
              <span className="text-incorrect">(Wrong ✗)</span>
            )}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-textSecondary text-sm">Discernment streak:</span>
          <span className="font-bold text-textPrimary">
            {result.newStreak > 0 && result.newStreak >= 3 && '🔥 '}
            {result.newStreak} {result.newStreak === 1 ? 'day' : 'days'}
          </span>
        </div>
      </div>

      {/* Leaderboard Rankings */}
      {userProgress && (
        <div className="mb-6">
          <LeaderboardPanel
            streakRank={streakRank ?? null}
            accuracyRank={accuracyRank ?? null}
            progress={userProgress}
          />
        </div>
      )}

      {/* Community Stats */}
      <div className="mb-6">
        <h3 className="text-xs font-semibold text-textSecondary uppercase tracking-wider mb-3">
          📊 Today's Puzzle Stats
        </h3>
        <StatsPanel
          stats={result.stats}
          streak={result.newStreak}
          wasCorrect={result.wasCorrect}
          userPercentile={result.userPercentile}
        />
      </div>

      {/* Countdown Timer */}
      <div className="bg-scripture-card border border-scripture-border rounded-xl p-6 mb-6">
        <Timer className="text-textPrimary" />
      </div>

      {/* Action Buttons */}
      <div className="space-y-3">
        {onViewBreakdown && (
          <button
            onClick={onViewBreakdown}
            className="w-full py-3 px-6 bg-scripture-card border border-scripture-border hover:bg-scripture-cardHover text-textPrimary font-semibold rounded-xl transition-all"
          >
            View Full Breakdown
          </button>
        )}
        {onContribute && (
          <button
            onClick={onContribute}
            className="w-full py-3 px-6 bg-gold/20 border border-gold/40 hover:bg-gold/30 text-gold-dark font-bold rounded-xl transition-all flex items-center justify-center gap-2"
          >
            <span>+</span>
            <span>Suggest a Fake Verse</span>
          </button>
        )}
        {onJoinDiscussion && (
          <button
            onClick={onJoinDiscussion}
            className="w-full py-3 px-6 bg-burgundy hover:bg-burgundy-dark text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2"
          >
            <span>💬</span>
            <span>Join Discussion</span>
          </button>
        )}
      </div>
    </div>
  );
}

export default CompletedScreen;
