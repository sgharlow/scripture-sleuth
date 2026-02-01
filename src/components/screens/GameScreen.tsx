/**
 * GameScreen Component
 * Main game screen showing the daily puzzle with verses to choose from
 * Scripture theme: Parchment/biblical presentation
 */

import React from 'react';
import type { ShuffledPuzzle, DisplayVerse } from '../../types';
import { VerseCard } from '../game/VerseCard';

export interface GameScreenProps {
  puzzle: ShuffledPuzzle;
  selectedIndex: number | null;
  onSelectVerse: (index: number) => void;
  onConfirmGuess: () => void;
  disabled?: boolean;
}

/**
 * Get difficulty badge color - Scripture theme
 */
function getDifficultyColor(difficulty: string): string {
  switch (difficulty.toLowerCase()) {
    case 'easy':
      return 'bg-correct/20 text-correct border-correct/30';
    case 'medium':
      return 'bg-gold/20 text-gold-dark border-gold/30';
    case 'hard':
      return 'bg-burgundy/20 text-burgundy border-burgundy/30';
    case 'expert':
      return 'bg-burgundy text-white border-burgundy';
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
  onSelectVerse,
  onConfirmGuess,
  disabled = false,
}: GameScreenProps): React.ReactElement {
  const handleSelectVerse = (id: string) => {
    const index = puzzle.verses.findIndex(v => v.id === id);
    if (index !== -1) {
      onSelectVerse(index);
    }
  };

  const difficultyColor = getDifficultyColor(puzzle.difficulty);

  return (
    <div className="flex flex-col h-full w-full max-w-2xl mx-auto px-3 sm:px-4 py-4 sm:py-6 bg-scripture-bg">
      {/* Scripture Header */}
      <div className="text-center mb-4 sm:mb-5">
        <div className="inline-flex items-center gap-2 bg-scripture-card border border-scripture-border rounded-lg px-3 py-1.5 mb-2">
          <span className="text-xl">📖</span>
          <span className="text-sm font-bold text-textPrimary uppercase tracking-wider">
            Day {puzzle.dayNumber}
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

      {/* Theme Card */}
      <div className="bg-scripture-card border border-scripture-border rounded-xl p-4 mb-4 sm:mb-5">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-burgundy font-bold text-sm uppercase tracking-wider">Today's Theme</span>
        </div>
        <div className="text-base sm:text-lg font-verse font-medium text-textPrimary leading-relaxed italic">
          "{puzzle.theme}"
        </div>
      </div>

      {/* Verses Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="text-xs font-semibold text-textSecondary uppercase tracking-wider">
          📜 Scripture Passages
        </div>
        <div className="text-xs text-textMuted">
          {selectedIndex !== null ? '1 marked as fake' : 'Tap to mark as fake'}
        </div>
      </div>

      {/* Verses List */}
      <div className="flex-1 space-y-3 mb-4 overflow-y-auto -mx-1 px-1">
        {puzzle.verses.map((verse: DisplayVerse, index: number) => (
          <VerseCard
            key={verse.id}
            verse={verse}
            index={index}
            isSelected={selectedIndex === index}
            isRevealed={false}
            onSelect={handleSelectVerse}
            disabled={disabled}
          />
        ))}
      </div>

      {/* Warning Text */}
      <div className="bg-burgundy/10 border border-burgundy/20 rounded-lg px-3 py-2 mb-3">
        <p className="text-center text-xs sm:text-sm text-burgundy font-medium">
          ⚠️ Choose carefully — ONE GUESS ONLY
        </p>
      </div>

      {/* Confirm Button (shows when verse is selected) */}
      {selectedIndex !== null && (
        <button
          onClick={onConfirmGuess}
          disabled={disabled}
          className="w-full py-4 px-6 bg-burgundy hover:bg-burgundy-dark active:bg-burgundy-dark disabled:bg-scripture-border disabled:text-textMuted text-white text-base sm:text-lg font-bold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl active:scale-[0.98] touch-manipulation"
        >
          📜 LOCK IN YOUR ANSWER
        </button>
      )}
    </div>
  );
}

export default GameScreen;
