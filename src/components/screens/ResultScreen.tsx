/**
 * ResultScreen Component
 * Shows the result after a user submits their guess
 * Scripture theme: Parchment/biblical presentation with subreddit reveals
 */

import React from 'react';
import type { GuessResult, ShuffledPuzzle } from '../../types';
import { ResultBanner } from '../results/ResultBanner';
import { FakeExplanation } from '../results/FakeExplanation';
import { StatsPanel } from '../results/StatsPanel';
import { ShareCard } from '../results/ShareCard';
import { AchievementList } from '../results/AchievementToast';

export interface ResultScreenProps {
  result: GuessResult;
  puzzle: ShuffledPuzzle;
  onViewBreakdown?: () => void;
  onJoinDiscussion?: () => void;
  onContribute?: () => void;
}

export function ResultScreen({
  result,
  puzzle,
  onViewBreakdown,
  onJoinDiscussion,
  onContribute,
}: ResultScreenProps): React.ReactElement {
  return (
    <div className="flex flex-col h-full w-full max-w-2xl mx-auto px-4 py-6 overflow-y-auto bg-scripture-bg">
      {/* Result Banner */}
      <ResultBanner
        wasCorrect={result.wasCorrect}
        correctIndex={result.correctIndex}
        guessedIndex={result.guessedIndex}
      />

      {/* Fake Verse Explanation */}
      <div className="mb-6">
        <FakeExplanation
          explanation={result.explanation}
          wasCorrect={result.wasCorrect}
        />
      </div>

      {/* Stats Panel */}
      <div className="mb-6">
        <StatsPanel
          stats={result.stats}
          streak={result.newStreak}
          previousStreak={result.previousStreak}
          wasCorrect={result.wasCorrect}
          userPercentile={result.userPercentile}
        />
      </div>

      {/* Achievements Unlocked */}
      {result.newlyUnlockedAchievements && result.newlyUnlockedAchievements.length > 0 && (
        <div className="mb-6">
          <AchievementList achievements={result.newlyUnlockedAchievements} />
        </div>
      )}

      {/* Share Card */}
      <div className="mb-6">
        <ShareCard
          dayNumber={puzzle.dayNumber}
          wasCorrect={result.wasCorrect}
          streak={result.newStreak}
        />
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

export default ResultScreen;
