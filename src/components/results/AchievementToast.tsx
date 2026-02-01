/**
 * AchievementToast Component
 * Displays newly unlocked achievements with celebration animation
 * Detective theme: golden achievement badges
 */

import React, { useState, useEffect } from 'react';
import type { Achievement } from '../../types';

export interface AchievementToastProps {
  achievements: Achievement[];
  onDismiss?: () => void;
}

/**
 * Single achievement card display
 */
function AchievementCard({
  achievement,
  index,
}: {
  achievement: Achievement;
  index: number;
}): React.ReactElement {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Stagger the animation for multiple achievements
    const timer = setTimeout(() => setIsVisible(true), index * 200);
    return () => clearTimeout(timer);
  }, [index]);

  return (
    <div
      className={`
        flex items-center gap-3 p-4 bg-detective-card
        border border-suspicious/50 rounded-xl shadow-lg shadow-suspicious/20
        transition-all duration-500 ease-out
        ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
      `}
    >
      <div className="text-3xl animate-bounce">{achievement.icon}</div>
      <div className="flex-1">
        <div className="font-bold text-textPrimary">{achievement.name}</div>
        <div className="text-sm text-textSecondary">{achievement.description}</div>
      </div>
      <div className="text-suspicious text-sm font-bold uppercase tracking-wider">NEW!</div>
    </div>
  );
}

/**
 * Toast container for displaying multiple achievements
 */
export function AchievementToast({
  achievements,
  onDismiss,
}: AchievementToastProps): React.ReactElement | null {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (achievements.length === 0) return;

    // Auto-dismiss after 5 seconds (if more than 1 achievement, give more time)
    const dismissTime = 5000 + (achievements.length - 1) * 1500;
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => onDismiss?.(), 300);
    }, dismissTime);

    return () => clearTimeout(timer);
  }, [achievements.length, onDismiss]);

  if (achievements.length === 0 || !isVisible) {
    return null;
  }

  return (
    <div className="fixed inset-x-0 top-4 z-50 flex flex-col items-center px-4 pointer-events-none">
      <div
        className={`
          w-full max-w-sm flex flex-col gap-2 pointer-events-auto
          transition-opacity duration-300
          ${isVisible ? 'opacity-100' : 'opacity-0'}
        `}
        onClick={() => {
          setIsVisible(false);
          setTimeout(() => onDismiss?.(), 300);
        }}
      >
        {/* Achievement unlocked header */}
        <div className="text-center text-sm font-bold text-suspicious uppercase tracking-wider mb-1">
          🏆 Achievement Unlocked!
        </div>

        {/* Achievement cards */}
        {achievements.map((achievement, index) => (
          <AchievementCard
            key={achievement.id}
            achievement={achievement}
            index={index}
          />
        ))}

        {/* Tap to dismiss hint */}
        <div className="text-center text-xs text-textMuted mt-1">
          Tap to dismiss
        </div>
      </div>
    </div>
  );
}

/**
 * Inline achievement badge for showing in result screen
 */
export function AchievementBadge({
  achievement,
}: {
  achievement: Achievement;
}): React.ReactElement {
  return (
    <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-suspicious/20 border border-suspicious/40 rounded-full">
      <span className="text-lg">{achievement.icon}</span>
      <span className="text-sm font-medium text-suspicious">
        {achievement.name}
      </span>
    </div>
  );
}

/**
 * Achievement list for showing all unlocked achievements in result screen
 */
export function AchievementList({
  achievements,
  title = 'Achievements Unlocked',
}: {
  achievements: Achievement[];
  title?: string;
}): React.ReactElement | null {
  if (achievements.length === 0) {
    return null;
  }

  return (
    <div className="mt-4 p-4 bg-detective-card border border-suspicious/30 rounded-xl">
      <h3 className="text-sm font-semibold text-suspicious mb-3">🏆 {title}</h3>
      <div className="flex flex-wrap gap-2">
        {achievements.map((achievement) => (
          <AchievementBadge key={achievement.id} achievement={achievement} />
        ))}
      </div>
    </div>
  );
}

export default AchievementToast;
