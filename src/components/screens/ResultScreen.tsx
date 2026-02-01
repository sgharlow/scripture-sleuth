/**
 * ResultScreen Component
 * Shows the result after a user submits their guess
 * Detective theme: "Case Closed" or "Case Unsolved"
 */

import React from 'react';
import type { GuessResult, ShuffledPuzzle } from '../../types';
import { ResultBanner } from '../results/ResultBanner';
import { AIExplanation } from '../results/AIExplanation';
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
    <div className="flex flex-col h-full w-full max-w-2xl mx-auto px-4 py-6 overflow-y-auto">
      {/* Result Banner */}
      <ResultBanner
        wasCorrect={result.wasCorrect}
        correctIndex={result.correctIndex}
        guessedIndex={result.guessedIndex}
      />

      {/* AI Explanation */}
      <div className="mb-6">
        <AIExplanation
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
            className="w-full py-3 px-6 bg-detective-card border border-detective-border hover:bg-detective-cardHover text-textPrimary font-semibold rounded-xl transition-all"
          >
            View Full Breakdown
          </button>
        )}
        {onContribute && (
          <button
            onClick={onContribute}
            className="w-full py-3 px-6 bg-ai/20 border border-ai/40 hover:bg-ai/30 text-ai font-bold rounded-xl transition-all flex items-center justify-center gap-2"
          >
            <span>+</span>
            <span>Contribute AI Comments</span>
          </button>
        )}
        {onJoinDiscussion && (
          <button
            onClick={onJoinDiscussion}
            className="w-full py-3 px-6 bg-reddit hover:bg-reddit/90 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2"
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
