/**
 * ResultBanner Component
 * Shows correct/incorrect result with detective-themed messaging
 * "Case Closed" or "Case Unsolved"
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
        <div className="text-5xl mb-3">🎯</div>
        <div className="inline-block bg-correct/20 border border-correct/40 rounded-lg px-4 py-2 mb-3">
          <h2 className="text-xl sm:text-2xl font-bold text-correct uppercase tracking-wider">
            Case Closed
          </h2>
        </div>
        <div className="bg-detective-card border border-detective-border rounded-lg px-4 py-3 max-w-sm mx-auto">
          <p className="text-textPrimary font-semibold">
            🤖 Suspect {correctIndex + 1} was the AI imposter!
          </p>
          <p className="text-correct text-sm mt-1">
            You caught them!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="text-center py-6">
      <div className="text-5xl mb-3">❌</div>
      <div className="inline-block bg-incorrect/20 border border-incorrect/40 rounded-lg px-4 py-2 mb-3">
        <h2 className="text-xl sm:text-2xl font-bold text-incorrect uppercase tracking-wider">
          Case Unsolved
        </h2>
      </div>
      <div className="bg-detective-card border border-detective-border rounded-lg px-4 py-3 max-w-sm mx-auto">
        <p className="text-textSecondary text-sm">
          You suspected Suspect {(guessedIndex ?? 0) + 1}
        </p>
        <p className="text-textPrimary font-semibold mt-1">
          🤖 The real imposter was Suspect {correctIndex + 1}
        </p>
        <p className="text-incorrect text-sm mt-1">
          The AI got away this time...
        </p>
      </div>
    </div>
  );
}

export default ResultBanner;
