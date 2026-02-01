/**
 * WelcomeScreen Component
 * Shown to first-time users before they start playing
 * Scripture theme: Parchment/biblical, warm and inviting
 */

import React from 'react';

export interface WelcomeScreenProps {
  onStartGame: () => void;
}

export function WelcomeScreen({ onStartGame }: WelcomeScreenProps): React.ReactElement {
  return (
    <div className="flex flex-col h-full w-full max-w-2xl mx-auto px-4 py-8 justify-center bg-scripture-bg">
      {/* Logo / Title */}
      <div className="text-center mb-8">
        <div className="text-6xl mb-4">📖</div>
        <h1 className="text-3xl font-bold text-burgundy mb-3 tracking-tight font-display">
          SCRIPTURE SLEUTH
        </h1>
        <div className="inline-block bg-scripture-card border border-gold/30 rounded-lg px-4 py-2 mb-2">
          <p className="text-lg text-gold-dark font-semibold tracking-wide">
            ONE VERSE ISN'T REAL
          </p>
        </div>
        <p className="text-sm text-textSecondary mt-3">
          Can you spot the fake scripture hiding among real Bible verses?
        </p>
      </div>

      {/* How to Play - Scripture Style */}
      <div className="bg-scripture-card border border-scripture-border rounded-xl p-6 mb-6">
        <h2 className="text-sm font-semibold text-textSecondary uppercase tracking-wider mb-5">
          How to Play
        </h2>
        <div className="space-y-5">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-10 h-10 bg-scripture-bg border border-scripture-border rounded-lg flex items-center justify-center text-xl">
              📜
            </div>
            <div>
              <p className="text-textPrimary font-medium">Read the Passages</p>
              <p className="text-textSecondary text-sm">Five verses on today's theme — study them carefully</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-10 h-10 bg-scripture-bg border border-scripture-border rounded-lg flex items-center justify-center text-xl">
              🔍
            </div>
            <div>
              <p className="text-textPrimary font-medium">Find the Fake</p>
              <p className="text-textSecondary text-sm">One "verse" was made up — it sounds biblical but isn't real</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-10 h-10 bg-scripture-bg border border-scripture-border rounded-lg flex items-center justify-center text-xl">
              🔗
            </div>
            <div>
              <p className="text-textPrimary font-medium">Discover Connections</p>
              <p className="text-textSecondary text-sm">Each real verse connects to a subreddit — see the reveal!</p>
            </div>
          </div>
        </div>
      </div>

      {/* Warning Box */}
      <div className="bg-burgundy/10 border border-burgundy/30 rounded-lg px-4 py-3 mb-6">
        <p className="text-center text-sm text-burgundy font-medium">
          ⚠️ One guess only — choose wisely
        </p>
      </div>

      {/* Rules */}
      <div className="text-center text-sm text-textMuted mb-6">
        <p>New puzzle released at midnight UTC</p>
      </div>

      {/* Start Button */}
      <button
        onClick={onStartGame}
        className="w-full py-4 px-6 bg-burgundy hover:bg-burgundy-dark text-white text-lg font-bold rounded-xl transition-all shadow-lg hover:shadow-xl active:scale-[0.98]"
      >
        📖 BEGIN YOUR SEARCH
      </button>
    </div>
  );
}

export default WelcomeScreen;
