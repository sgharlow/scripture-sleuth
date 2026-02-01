/**
 * FakeExplanation Component
 * Shows why the fake verse was detectable and explains subreddit connections
 * Scripture Sleuth theme
 */

import React from 'react';
import type { Explanation } from '../../types';

export interface FakeExplanationProps {
  explanation: Explanation;
  wasCorrect: boolean;
}

export function FakeExplanation({
  explanation,
  wasCorrect,
}: FakeExplanationProps): React.ReactElement {
  return (
    <div className="space-y-4">
      {/* Why the Fake Verse is Fake */}
      <div className={`rounded-xl p-4 border ${
        wasCorrect
          ? 'bg-correct/10 border-correct/30'
          : 'bg-burgundy/10 border-burgundy/30'
      }`}>
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xl">📜</span>
          <h3 className="font-bold text-textPrimary uppercase tracking-wider text-sm">
            Why It's Fake
          </h3>
        </div>
        <ul className="space-y-2">
          {explanation.whyFake.map((tell, index) => (
            <li key={index} className="flex items-start gap-2 text-textPrimary">
              <span className="text-burgundy">•</span>
              <span className="text-sm">{tell}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Why Real Verses Are Real (shown when incorrect) */}
      {!wasCorrect && explanation.whyReal && explanation.whyReal.length > 0 && (
        <div className="bg-scripture-card border border-scripture-border rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xl">✨</span>
            <h3 className="font-bold text-textPrimary uppercase tracking-wider text-sm">
              Why Your Pick Was Real
            </h3>
          </div>
          <ul className="space-y-2">
            {explanation.whyReal.map((tell, index) => (
              <li key={index} className="flex items-start gap-2 text-textSecondary">
                <span className="text-textMuted">•</span>
                <span className="text-sm">{tell}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Subreddit Connections - Key Feature! */}
      {explanation.connections && explanation.connections.length > 0 && (
        <div className="bg-gold/10 border border-gold/30 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xl">🔗</span>
            <h3 className="font-bold text-textPrimary uppercase tracking-wider text-sm">
              Subreddit Connections
            </h3>
          </div>
          <p className="text-xs text-textSecondary mb-3">
            Each real verse connects to a subreddit theme:
          </p>
          <ul className="space-y-2">
            {explanation.connections.map((connection, index) => (
              <li key={index} className="flex items-start gap-2 text-textPrimary">
                <span className="text-gold">→</span>
                <span className="text-sm">{connection}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Difficulty Note */}
      {explanation.difficulty_note && (
        <p className="text-sm text-textSecondary italic text-center px-4">
          {explanation.difficulty_note}
        </p>
      )}
    </div>
  );
}

export default FakeExplanation;
