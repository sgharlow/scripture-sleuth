/**
 * GameScreen Component
 * Main game screen showing the daily puzzle with comments to choose from
 * Detective theme: Case file presentation
 */

import React from 'react';
import type { ShuffledPuzzle, DisplayComment } from '../../types';
import { CommentCard } from '../game/CommentCard';

export interface GameScreenProps {
  puzzle: ShuffledPuzzle;
  selectedIndex: number | null;
  onSelectComment: (index: number) => void;
  onConfirmGuess: () => void;
  disabled?: boolean;
}

/**
 * Get difficulty badge color
 */
function getDifficultyColor(difficulty: string): string {
  switch (difficulty.toLowerCase()) {
    case 'easy':
      return 'bg-correct/20 text-correct border-correct/30';
    case 'medium':
      return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
    case 'hard':
      return 'bg-suspicious/20 text-suspicious border-suspicious/30';
    case 'expert':
      return 'bg-ai/20 text-ai border-ai/30';
    default:
      return 'bg-textSecondary/20 text-textSecondary border-textSecondary/30';
  }
}

/**
 * GameScreen component
 */
export function GameScreen({
  puzzle,
  selectedIndex,
  onSelectComment,
  onConfirmGuess,
  disabled = false,
}: GameScreenProps): React.ReactElement {
  const handleSelectComment = (id: string) => {
    const index = puzzle.comments.findIndex(c => c.id === id);
    if (index !== -1) {
      onSelectComment(index);
    }
  };

  const difficultyColor = getDifficultyColor(puzzle.difficulty);

  return (
    <div className="flex flex-col h-full w-full max-w-2xl mx-auto px-3 sm:px-4 py-4 sm:py-6">
      {/* Case File Header */}
      <div className="text-center mb-4 sm:mb-5">
        <div className="inline-flex items-center gap-2 bg-detective-card border border-detective-border rounded-lg px-3 py-1.5 mb-2">
          <span className="text-xl">📋</span>
          <span className="text-sm font-bold text-textPrimary uppercase tracking-wider">
            Case File #{puzzle.dayNumber}
          </span>
        </div>
        <div className="flex items-center justify-center gap-2 text-xs text-textSecondary">
          <span className={`px-2 py-0.5 rounded border ${difficultyColor} font-semibold uppercase text-[10px]`}>
            {puzzle.difficulty}
          </span>
          <span>•</span>
          <span className="capitalize">{puzzle.dayOfWeek}</span>
        </div>
      </div>

      {/* Reddit Prompt Card */}
      <div className="bg-detective-card border border-detective-border rounded-xl p-4 mb-4 sm:mb-5">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-reddit font-bold text-sm">{puzzle.prompt.source}</span>
        </div>
        <div className="text-base sm:text-lg font-medium text-textPrimary leading-relaxed">
          "{puzzle.prompt.text}"
        </div>
      </div>

      {/* Suspects Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="text-xs font-semibold text-textSecondary uppercase tracking-wider">
          🔍 Suspects
        </div>
        <div className="text-xs text-textMuted">
          {selectedIndex !== null ? '1 marked' : 'Tap to mark suspicious'}
        </div>
      </div>

      {/* Comments List */}
      <div className="flex-1 space-y-3 mb-4 overflow-y-auto -mx-1 px-1">
        {puzzle.comments.map((comment: DisplayComment, index: number) => (
          <CommentCard
            key={comment.id}
            comment={comment}
            index={index}
            isSelected={selectedIndex === index}
            isRevealed={false}
            onSelect={handleSelectComment}
            disabled={disabled}
          />
        ))}
      </div>

      {/* Warning Text */}
      <div className="bg-suspicious/10 border border-suspicious/20 rounded-lg px-3 py-2 mb-3">
        <p className="text-center text-xs sm:text-sm text-suspicious font-medium">
          ⚠️ Choose carefully — ONE GUESS ONLY
        </p>
      </div>

      {/* Confirm Button (shows when comment is selected) */}
      {selectedIndex !== null && (
        <button
          onClick={onConfirmGuess}
          disabled={disabled}
          className="w-full py-4 px-6 bg-reddit hover:bg-reddit/90 active:bg-reddit/80 disabled:bg-detective-border disabled:text-textMuted text-white text-base sm:text-lg font-bold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl active:scale-[0.98] touch-manipulation"
        >
          🔒 LOCK IN ACCUSATION
        </button>
      )}
    </div>
  );
}

export default GameScreen;
