/**
 * StatsPanel Component
 * Shows statistics about the puzzle and user performance
 * Detective theme: "Your Detective Record"
 */

import React from 'react';
import type { PuzzleStats } from '../../types';

export interface StatsPanelProps {
  stats: PuzzleStats;
  streak: number;
  previousStreak?: number;
  wasCorrect: boolean;
  userPercentile?: number;
}

export function StatsPanel({
  stats,
  streak,
  previousStreak,
  wasCorrect,
  userPercentile,
}: StatsPanelProps): React.ReactElement {
  const streakDisplay = wasCorrect && streak >= 3;
  const streakReset = !wasCorrect && (previousStreak ?? 0) > 0;

  return (
    <div className="bg-detective-card border border-detective-border rounded-xl p-4 space-y-4">
      {/* Personal Stats Row */}
      <div className="grid grid-cols-2 gap-4">
        {/* Streak Display */}
        <div className="bg-detective-bg border border-detective-border rounded-lg p-3 text-center">
          <div className="text-xs text-textSecondary uppercase tracking-wider mb-1">Streak</div>
          <div className={`font-bold text-lg ${wasCorrect ? 'text-correct' : 'text-textPrimary'}`}>
            {streakDisplay && <span className="mr-1">🔥</span>}
            {streak} {streak === 1 ? 'day' : 'days'}
          </div>
          {streakReset && (
            <div className="text-incorrect text-xs mt-1">
              (reset from {previousStreak})
            </div>
          )}
        </div>

        {/* Percentile */}
        <div className="bg-detective-bg border border-detective-border rounded-lg p-3 text-center">
          <div className="text-xs text-textSecondary uppercase tracking-wider mb-1">Your Ranking</div>
          <div className={`font-bold text-lg ${wasCorrect ? 'text-correct' : 'text-textSecondary'}`}>
            {userPercentile !== undefined && wasCorrect
              ? `Top ${Math.round(userPercentile)}%`
              : '-'}
          </div>
        </div>
      </div>

      {/* Community Stats */}
      <div className="border-t border-detective-border pt-4 space-y-2">
        <h4 className="text-xs font-semibold text-textSecondary uppercase tracking-wider mb-3">
          📊 Today's Case Stats
        </h4>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center justify-between">
            <span className="text-textSecondary text-sm">Players:</span>
            <span className="font-bold text-textPrimary">{stats.totalPlayers.toLocaleString()}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-textSecondary text-sm">Caught it:</span>
            <span className="font-bold text-correct">
              {stats.correctPercentage.toFixed(0)}%
            </span>
          </div>
        </div>
      </div>

      {/* Guess Distribution */}
      {stats.guessDistribution.some(count => count > 0) && (
        <div className="border-t border-detective-border pt-4">
          <h4 className="text-xs font-semibold text-textSecondary uppercase tracking-wider mb-3">
            Suspect Distribution
          </h4>
          <div className="space-y-2">
            {stats.guessDistribution.map((count, index) => {
              const total = stats.totalPlayers || 1;
              const percentage = (count / total) * 100;
              const isCorrect = percentage > 0 && index === stats.guessDistribution.indexOf(Math.max(...stats.guessDistribution));
              return (
                <div key={index} className="flex items-center gap-2">
                  <span className="w-8 text-xs text-textSecondary font-medium">#{index + 1}</span>
                  <div className="flex-1 h-3 bg-detective-bg border border-detective-border rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all ${isCorrect ? 'bg-correct' : 'bg-suspicious/60'}`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="w-10 text-xs text-textSecondary text-right">
                    {percentage.toFixed(0)}%
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default StatsPanel;
