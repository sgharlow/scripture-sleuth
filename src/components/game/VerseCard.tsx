/**
 * VerseCard Component
 * Displays a single Bible verse card with scripture styling
 * Parchment theme: cream cards, gold selection glow
 */

import React from 'react';
import type { DisplayVerse } from '../../types';

export interface VerseCardProps {
  verse: DisplayVerse;
  index: number;           // 0-based index for display
  isSelected: boolean;
  isRevealed: boolean;
  isFake?: boolean;        // Only set after reveal
  isCorrectGuess?: boolean; // User's guess was this card and it was correct
  onSelect: (id: string) => void;
  disabled?: boolean;
}

/**
 * Visual state calculation
 */
type VisualState = 'default' | 'selected' | 'revealed_fake' | 'revealed_real' | 'disabled';

function getVisualState(props: VerseCardProps): VisualState {
  if (props.disabled) return 'disabled';
  if (props.isRevealed) {
    return props.isFake ? 'revealed_fake' : 'revealed_real';
  }
  if (props.isSelected) return 'selected';
  return 'default';
}

/**
 * Style classes for each visual state - Scripture theme
 */
const stateStyles: Record<VisualState, { container: string; border: string }> = {
  default: {
    container: 'bg-scripture-card hover:bg-scripture-cardHover cursor-pointer active:scale-[0.99]',
    border: 'border-scripture-border hover:border-burgundy/40',
  },
  selected: {
    container: 'bg-scripture-card cursor-pointer active:scale-[0.99] shadow-selected',
    border: 'border-gold border-2',
  },
  revealed_fake: {
    container: 'bg-burgundy/10 shadow-fake',
    border: 'border-burgundy border-2',
  },
  revealed_real: {
    container: 'bg-scripture-card opacity-80',
    border: 'border-scripture-border',
  },
  disabled: {
    container: 'bg-scripture-card opacity-40 cursor-not-allowed',
    border: 'border-scripture-border',
  },
};

/**
 * VerseCard component
 */
export function VerseCard({
  verse,
  index,
  isSelected,
  isRevealed,
  isFake,
  isCorrectGuess,
  onSelect,
  disabled = false,
}: VerseCardProps): React.ReactElement {
  const visualState = getVisualState({ verse, index, isSelected, isRevealed, isFake, onSelect, disabled });
  const styles = stateStyles[visualState];

  const baseClasses = 'relative p-5 rounded-xl border transition-all duration-200 min-h-[120px] touch-manipulation select-none';

  const handleClick = () => {
    if (!disabled && !isRevealed) {
      onSelect(verse.id);
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
      aria-label={`Verse ${index + 1}: ${verse.reference}`}
    >
      {/* Verse number and status badges */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className={`text-xs font-bold uppercase tracking-wider ${
            isSelected ? 'text-gold' :
            isRevealed && isFake ? 'text-burgundy' :
            'text-textSecondary'
          }`}>
            Verse {index + 1}
          </span>
          {isSelected && !isRevealed && (
            <span className="px-2 py-0.5 bg-gold/20 border border-gold/40 rounded text-[10px] font-bold text-gold-dark uppercase">
              Marked Suspicious
            </span>
          )}
        </div>

        {/* Fake badge (shown after reveal) */}
        {isRevealed && isFake && (
          <div className="px-2 py-1 rounded bg-burgundy text-white text-xs font-bold flex items-center gap-1">
            <span>📜</span>
            <span>FAKE SCRIPTURE</span>
          </div>
        )}

        {/* Correct guess indicator */}
        {isRevealed && isCorrectGuess && (
          <div className="px-2 py-1 rounded bg-correct text-white text-xs font-bold">
            ✓ You found it!
          </div>
        )}
      </div>

      {/* Verse text - styled as scripture */}
      <div className="font-verse text-base sm:text-lg text-textVerse leading-relaxed italic mb-3">
        "{verse.text}"
      </div>

      {/* Reference and translation */}
      <div className="flex items-center justify-between text-xs text-textSecondary">
        <span className="font-medium text-burgundy">
          — {verse.reference}
        </span>
        <span className="px-2 py-0.5 bg-scripture-border/50 rounded text-[10px] font-medium uppercase">
          {verse.translation}
        </span>
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

export default VerseCard;
