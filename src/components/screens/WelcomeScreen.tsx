/**
 * WelcomeScreen Component
 * Shown to first-time users before they start playing
 * Detective theme: dark, mysterious, intriguing
 */

import React from 'react';

export interface WelcomeScreenProps {
  onStartGame: () => void;
}

export function WelcomeScreen({ onStartGame }: WelcomeScreenProps): React.ReactElement {
  return (
    <div className="flex flex-col h-full w-full max-w-2xl mx-auto px-4 py-8 justify-center">
      {/* Logo / Title */}
      <div className="text-center mb-8">
        <div className="text-6xl mb-4">🔍</div>
        <h1 className="text-3xl font-bold text-textPrimary mb-3 tracking-tight">
          COMMENT CONSPIRACY
        </h1>
        <div className="inline-block bg-detective-card border border-suspicious/30 rounded-lg px-4 py-2 mb-2">
          <p className="text-lg text-suspicious font-semibold tracking-wide">
            ONE OF THESE ISN'T HUMAN
          </p>
        </div>
        <p className="text-sm text-textSecondary mt-3">
          Can you spot the AI imposter hiding among real Redditors?
        </p>
      </div>

      {/* How to Play - Detective Style */}
      <div className="bg-detective-card border border-detective-border rounded-xl p-6 mb-6">
        <h2 className="text-sm font-semibold text-textSecondary uppercase tracking-wider mb-5">
          Your Mission
        </h2>
        <div className="space-y-5">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-10 h-10 bg-detective-bg border border-detective-border rounded-lg flex items-center justify-center text-xl">
              👁️
            </div>
            <div>
              <p className="text-textPrimary font-medium">Examine the Evidence</p>
              <p className="text-textSecondary text-sm">Read all 5 comments from an r/AskReddit thread</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-10 h-10 bg-detective-bg border border-detective-border rounded-lg flex items-center justify-center text-xl">
              🎯
            </div>
            <div>
              <p className="text-textPrimary font-medium">Identify the Imposter</p>
              <p className="text-textSecondary text-sm">One comment was written by AI — find it</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-10 h-10 bg-detective-bg border border-detective-border rounded-lg flex items-center justify-center text-xl">
              🔥
            </div>
            <div>
              <p className="text-textPrimary font-medium">Build Your Streak</p>
              <p className="text-textSecondary text-sm">New case every day — keep your detective record clean</p>
            </div>
          </div>
        </div>
      </div>

      {/* Warning Box */}
      <div className="bg-suspicious/10 border border-suspicious/30 rounded-lg px-4 py-3 mb-6">
        <p className="text-center text-sm text-suspicious font-medium">
          ⚠️ One guess only — choose wisely
        </p>
      </div>

      {/* Rules */}
      <div className="text-center text-sm text-textMuted mb-6">
        <p>New case file released at midnight UTC</p>
      </div>

      {/* Start Button */}
      <button
        onClick={onStartGame}
        className="w-full py-4 px-6 bg-reddit hover:bg-reddit/90 text-white text-lg font-bold rounded-xl transition-all shadow-lg hover:shadow-xl active:scale-[0.98]"
      >
        🔎 START INVESTIGATING
      </button>
    </div>
  );
}

export default WelcomeScreen;
