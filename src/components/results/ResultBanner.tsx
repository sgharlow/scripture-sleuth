/**
 * ResultBanner Component
 * Shows correct/incorrect result with scripture-themed messaging
 * "You Found It!" or "The Truth Revealed"
 */

import React from 'react';

export interface ResultBannerProps {
  wasCorrect: boolean;
  correctIndex: number;
  guessedIndex?: number;
}

export function ResultBanner({
  wasCorrect,
  correctIndex,
  guessedIndex,
}: ResultBannerProps): React.ReactElement {
  if (wasCorrect) {
    return (
      <div className="text-center py-6">
        <div className="text-5xl mb-3">📖</div>
        <div className="inline-block bg-correct/20 border border-correct/40 rounded-lg px-4 py-2 mb-3">
          <h2 className="text-xl sm:text-2xl font-bold text-correct uppercase tracking-wider">
            You Found It!
          </h2>
        </div>
        <div className="bg-scripture-card border border-scripture-border rounded-lg px-4 py-3 max-w-sm mx-auto">
          <p className="text-textPrimary font-semibold">
            ✨ Verse {correctIndex + 1} was the fake!
          </p>
          <p className="text-correct text-sm mt-1">
            Your discernment is strong!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="text-center py-6">
      <div className="text-5xl mb-3">📜</div>
      <div className="inline-block bg-incorrect/20 border border-incorrect/40 rounded-lg px-4 py-2 mb-3">
        <h2 className="text-xl sm:text-2xl font-bold text-incorrect uppercase tracking-wider">
          The Truth Revealed
        </h2>
      </div>
      <div className="bg-scripture-card border border-scripture-border rounded-lg px-4 py-3 max-w-sm mx-auto">
        <p className="text-textSecondary text-sm">
          You suspected Verse {(guessedIndex ?? 0) + 1}
        </p>
        <p className="text-textPrimary font-semibold mt-1">
          ✨ The fake was actually Verse {correctIndex + 1}
        </p>
        <p className="text-incorrect text-sm mt-1">
          Study and return tomorrow!
        </p>
      </div>
    </div>
  );
}

export default ResultBanner;
