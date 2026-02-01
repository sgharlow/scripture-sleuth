/**
 * Timer Component
 * Countdown timer to next puzzle (midnight UTC)
 * Detective theme: styled for dark backgrounds
 */

import React, { useState, useEffect } from 'react';

export interface TimerProps {
  className?: string;
}

interface TimeLeft {
  hours: number;
  minutes: number;
  seconds: number;
}

/**
 * Calculate time remaining until midnight UTC
 */
function getTimeUntilMidnightUTC(): TimeLeft {
  const now = new Date();
  const midnight = new Date(now);
  midnight.setUTCHours(24, 0, 0, 0);

  const diff = midnight.getTime() - now.getTime();

  if (diff <= 0) {
    return { hours: 0, minutes: 0, seconds: 0 };
  }

  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  return { hours, minutes, seconds };
}

/**
 * Format number with leading zero
 */
function pad(num: number): string {
  return num.toString().padStart(2, '0');
}

export function Timer({ className = '' }: TimerProps): React.ReactElement {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(getTimeUntilMidnightUTC);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(getTimeUntilMidnightUTC());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`text-center ${className}`}>
      <div className="text-xs text-textSecondary uppercase tracking-wider mb-2">
        🔍 Next Case File In
      </div>
      <div className="text-3xl font-mono font-bold text-textPrimary">
        {pad(timeLeft.hours)}:{pad(timeLeft.minutes)}:{pad(timeLeft.seconds)}
      </div>
    </div>
  );
}

export default Timer;
