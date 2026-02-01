/**
 * CommentCard Component
 * Displays a single comment as a "Suspect" card with Reddit-style formatting
 * Detective theme: dark cards, amber selection glow
 */

import React from 'react';
import type { DisplayComment } from '../../types';

export interface CommentCardProps {
  comment: DisplayComment;
  index: number;           // 0-based index for display
  isSelected: boolean;
  isRevealed: boolean;
  isAI?: boolean;           // Only set after reveal
  isCorrectGuess?: boolean; // User's guess was this card and it was correct
  onSelect: (id: string) => void;
  disabled?: boolean;
}

/**
 * Visual state calculation
 */
type VisualState = 'default' | 'selected' | 'revealed_ai' | 'revealed_human' | 'disabled';

function getVisualState(props: CommentCardProps): VisualState {
  if (props.disabled) return 'disabled';
  if (props.isRevealed) {
    return props.isAI ? 'revealed_ai' : 'revealed_human';
  }
  if (props.isSelected) return 'selected';
  return 'default';
}

/**
 * Generate fake Reddit-style points (seeded by username for consistency)
 */
function getFakePoints(username: string): number {
  let hash = 0;
  for (let i = 0; i < username.length; i++) {
    hash = ((hash << 5) - hash) + username.charCodeAt(i);
    hash |= 0;
  }
  // Generate a number between 50 and 2000
  return Math.abs(hash % 1950) + 50;
}

/**
 * Generate fake Reddit-style time ago
 */
function getFakeTimeAgo(index: number): string {
  const times = ['3h', '5h', '7h', '12h', '1d'];
  return times[index % times.length];
}

/**
 * Style classes for each visual state
 */
const stateStyles: Record<VisualState, { container: string; border: string }> = {
  default: {
    container: 'bg-detective-card hover:bg-detective-cardHover cursor-pointer active:scale-[0.99]',
    border: 'border-detective-border hover:border-textMuted',
  },
  selected: {
    container: 'bg-detective-card cursor-pointer active:scale-[0.99] shadow-suspicious',
    border: 'border-suspicious border-2',
  },
  revealed_ai: {
    container: 'bg-ai/10 shadow-ai',
    border: 'border-ai border-2',
  },
  revealed_human: {
    container: 'bg-detective-card opacity-60',
    border: 'border-detective-border',
  },
  disabled: {
    container: 'bg-detective-card opacity-40 cursor-not-allowed',
    border: 'border-detective-border',
  },
};

/**
 * CommentCard component
 */
export function CommentCard({
  comment,
  index,
  isSelected,
  isRevealed,
  isAI,
  isCorrectGuess,
  onSelect,
  disabled = false,
}: CommentCardProps): React.ReactElement {
  const visualState = getVisualState({ comment, index, isSelected, isRevealed, isAI, onSelect, disabled });
  const styles = stateStyles[visualState];

  const baseClasses = 'relative p-4 rounded-xl border transition-all duration-200 min-h-[100px] touch-manipulation select-none';

  const fakePoints = getFakePoints(comment.username);
  const fakeTime = getFakeTimeAgo(index);

  const handleClick = () => {
    if (!disabled && !isRevealed) {
      onSelect(comment.id);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick();
    }
  };

  return (
    <div
      role="button"
      tabIndex={disabled || isRevealed ? -1 : 0}
      className={`${baseClasses} ${styles.container} ${styles.border}`}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      aria-pressed={isSelected}
      aria-disabled={disabled}
      aria-label={`Suspect ${index + 1} by ${comment.username}`}
    >
      {/* Suspect label */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className={`text-xs font-bold uppercase tracking-wider ${
            isSelected ? 'text-suspicious' :
            isRevealed && isAI ? 'text-ai' :
            'text-textSecondary'
          }`}>
            Suspect {index + 1}
          </span>
          {isSelected && !isRevealed && (
            <span className="px-2 py-0.5 bg-suspicious/20 border border-suspicious/40 rounded text-[10px] font-bold text-suspicious uppercase">
              Marked Suspicious
            </span>
          )}
        </div>

        {/* AI badge (shown after reveal) */}
        {isRevealed && isAI && (
          <div className="px-2 py-1 rounded bg-ai text-white text-xs font-bold flex items-center gap-1">
            <span>🤖</span>
            <span>AI IMPOSTER</span>
          </div>
        )}

        {/* Correct guess indicator */}
        {isRevealed && isCorrectGuess && (
          <div className="px-2 py-1 rounded bg-correct text-white text-xs font-bold">
            ✓ You caught it!
          </div>
        )}
      </div>

      {/* Reddit-style username and metadata */}
      <div className="flex items-center gap-2 text-xs text-textMuted mb-2">
        <span className="text-reddit font-medium">u/{comment.username}</span>
        <span>•</span>
        <span>{fakePoints} pts</span>
        <span>•</span>
        <span>{fakeTime}</span>
      </div>

      {/* Comment text */}
      <div className="text-sm sm:text-base text-textPrimary leading-relaxed">
        {comment.text}
      </div>

      {/* Selection hint for non-selected cards */}
      {!isSelected && !isRevealed && !disabled && (
        <div className="absolute bottom-2 right-3 text-[10px] text-textMuted opacity-0 group-hover:opacity-100 transition-opacity">
          Tap to mark
        </div>
      )}
    </div>
  );
}

export default CommentCard;
