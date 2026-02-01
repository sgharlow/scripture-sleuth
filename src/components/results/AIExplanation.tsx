/**
 * AIExplanation Component
 * Shows why the AI comment was detectable - styled as "Evidence Breakdown"
 * Detective theme: detective notes presentation
 */

import React from 'react';
import type { Explanation } from '../../types';

export interface AIExplanationProps {
  explanation: Explanation;
  wasCorrect: boolean;
}

export function AIExplanation({
  explanation,
  wasCorrect,
}: AIExplanationProps): React.ReactElement {
  return (
    <div className="space-y-4">
      {/* AI Tells - Evidence Breakdown */}
      <div className={`rounded-xl p-4 border ${
        wasCorrect
          ? 'bg-correct/10 border-correct/30'
          : 'bg-ai/10 border-ai/30'
      }`}>
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xl">🔍</span>
          <h3 className="font-bold text-textPrimary uppercase tracking-wider text-sm">
            Evidence Breakdown
          </h3>
        </div>
        <ul className="space-y-2">
          {explanation.aiTells.map((tell, index) => (
            <li key={index} className="flex items-start gap-2 text-textPrimary">
              <span className="text-suspicious">•</span>
              <span className="text-sm">{tell}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Human Tells (shown when incorrect to explain why user's pick was human) */}
      {!wasCorrect && explanation.humanTells.length > 0 && (
        <div className="bg-detective-card border border-detective-border rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xl">👤</span>
            <h3 className="font-bold text-textPrimary uppercase tracking-wider text-sm">
              Why Your Pick Was Human
            </h3>
          </div>
          <ul className="space-y-2">
            {explanation.humanTells.map((tell, index) => (
              <li key={index} className="flex items-start gap-2 text-textSecondary">
                <span className="text-textMuted">•</span>
                <span className="text-sm">{tell}</span>
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

export default AIExplanation;
