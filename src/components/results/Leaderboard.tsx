/**
 * Leaderboard Component
 * Displays user's rank on streak and accuracy leaderboards
 * Detective theme: "Your Detective Rankings"
 */

import React from 'react';
import type { UserProgress } from '../../types';
import {
  formatOrdinal,
  formatRankPercentile,
  calculateAccuracy,
  ACCURACY_LEADERBOARD_MIN_GAMES,
  gamesUntilAccuracyQualification,
} from '../../utils/leaderboardUtils';

export interface LeaderboardRank {
  rank: number;
  total: number;
  score?: number;
  accuracy?: number;
}

export interface LeaderboardPanelProps {
  streakRank: LeaderboardRank | null;
  accuracyRank: LeaderboardRank | null;
  progress: UserProgress;
  className?: string;
}

/**
 * Individual rank display card
 */
function RankCard({
  title,
  icon,
  rank,
  total,
  value,
  valueLabel,
  subtext,
}: {
  title: string;
  icon: string;
  rank: number | null;
  total: number;
  value: string | number;
  valueLabel: string;
  subtext?: string;
}): React.ReactElement {
  const hasRank = rank !== null;

  return (
    <div className="bg-detective-bg border border-detective-border rounded-xl p-4 flex flex-col items-center text-center">
      <div className="text-2xl mb-1">{icon}</div>
      <div className="text-xs font-medium text-textSecondary uppercase tracking-wider mb-2">
        {title}
      </div>

      {hasRank ? (
        <>
          <div className="text-2xl font-bold text-textPrimary mb-1">
            {formatOrdinal(rank)}
          </div>
          <div className="text-xs text-textMuted mb-2">
            {formatRankPercentile(rank, total)}
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-lg font-semibold text-correct">{value}</span>
            <span className="text-xs text-textSecondary">{valueLabel}</span>
          </div>
        </>
      ) : (
        <>
          <div className="text-lg font-semibold text-textMuted mb-1">--</div>
          {subtext && (
            <div className="text-xs text-textMuted max-w-[100px]">{subtext}</div>
          )}
        </>
      )}
    </div>
  );
}

/**
 * Main leaderboard panel showing user's ranks
 */
export function LeaderboardPanel({
  streakRank,
  accuracyRank,
  progress,
  className = '',
}: LeaderboardPanelProps): React.ReactElement {
  const accuracy = calculateAccuracy(progress.totalCorrect, progress.totalPlayed);
  const gamesRemaining = gamesUntilAccuracyQualification(progress.totalPlayed);

  return (
    <div className={`${className}`}>
      <h3 className="text-xs font-semibold text-textSecondary uppercase tracking-wider mb-3 flex items-center gap-2">
        <span>🏆 Your Detective Rankings</span>
      </h3>

      <div className="grid grid-cols-2 gap-3">
        <RankCard
          title="Streak"
          icon="🔥"
          rank={streakRank?.rank ?? null}
          total={streakRank?.total ?? 0}
          value={progress.currentStreak}
          valueLabel="days"
          subtext={progress.totalPlayed === 0 ? "Play to join!" : undefined}
        />

        <RankCard
          title="Accuracy"
          icon="🎯"
          rank={accuracyRank?.rank ?? null}
          total={accuracyRank?.total ?? 0}
          value={`${accuracy}%`}
          valueLabel={`(${progress.totalCorrect}/${progress.totalPlayed})`}
          subtext={
            gamesRemaining > 0
              ? `${gamesRemaining} more games to qualify`
              : undefined
          }
        />
      </div>

      {progress.totalPlayed > 0 && progress.totalPlayed < ACCURACY_LEADERBOARD_MIN_GAMES && (
        <div className="mt-3 text-xs text-center text-textMuted">
          Play {gamesRemaining} more game{gamesRemaining !== 1 ? 's' : ''} to join the accuracy leaderboard
        </div>
      )}
    </div>
  );
}

/**
 * Compact leaderboard badge for result screens
 */
export function LeaderboardBadge({
  type,
  rank,
  total,
}: {
  type: 'streak' | 'accuracy';
  rank: number;
  total: number;
}): React.ReactElement {
  const icon = type === 'streak' ? '🔥' : '🎯';
  const label = type === 'streak' ? 'Streak' : 'Accuracy';

  return (
    <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-correct/10 border border-correct/30 rounded-full text-sm">
      <span>{icon}</span>
      <span className="font-medium text-correct">
        {label}: {formatOrdinal(rank)}
      </span>
      <span className="text-textSecondary text-xs">
        ({formatRankPercentile(rank, total)})
      </span>
    </div>
  );
}

/**
 * Progress bar showing progress toward accuracy leaderboard qualification
 */
export function AccuracyQualificationProgress({
  totalPlayed,
}: {
  totalPlayed: number;
}): React.ReactElement | null {
  if (totalPlayed >= ACCURACY_LEADERBOARD_MIN_GAMES) {
    return null;
  }

  const progress = (totalPlayed / ACCURACY_LEADERBOARD_MIN_GAMES) * 100;
  const remaining = ACCURACY_LEADERBOARD_MIN_GAMES - totalPlayed;

  return (
    <div className="p-3 bg-detective-card border border-detective-border rounded-lg">
      <div className="flex justify-between items-center mb-2">
        <span className="text-xs font-medium text-textSecondary">
          Accuracy Leaderboard
        </span>
        <span className="text-xs text-textMuted">
          {totalPlayed}/{ACCURACY_LEADERBOARD_MIN_GAMES} games
        </span>
      </div>
      <div className="h-2 bg-detective-bg border border-detective-border rounded-full overflow-hidden">
        <div
          className="h-full bg-correct rounded-full transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>
      <div className="text-xs text-textMuted mt-1 text-center">
        {remaining} more game{remaining !== 1 ? 's' : ''} to qualify
      </div>
    </div>
  );
}

export default LeaderboardPanel;
