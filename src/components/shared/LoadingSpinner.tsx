/**
 * LoadingSpinner Component
 * Animated loading indicator for various loading states
 * Detective theme: dark-friendly styling
 */

import React from 'react';

export interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  message?: string;
  className?: string;
}

const sizeClasses = {
  small: 'text-2xl',
  medium: 'text-4xl',
  large: 'text-6xl',
};

const containerSizes = {
  small: 'p-2',
  medium: 'p-4',
  large: 'p-6',
};

export function LoadingSpinner({
  size = 'medium',
  message,
  className = '',
}: LoadingSpinnerProps): React.ReactElement {
  return (
    <div
      className={`flex flex-col items-center justify-center ${containerSizes[size]} ${className}`}
      role="status"
      aria-live="polite"
    >
      <div className={`${sizeClasses[size]} animate-pulse`}>🔍</div>
      {message && (
        <p className="mt-3 text-textSecondary text-center">{message}</p>
      )}
      <span className="sr-only">Loading...</span>
    </div>
  );
}

/**
 * Full-page loading spinner
 */
export function FullPageSpinner({
  message = 'Loading case file...',
}: {
  message?: string;
}): React.ReactElement {
  return (
    <div className="flex flex-col h-full w-full items-center justify-center min-h-[300px]">
      <LoadingSpinner size="large" message={message} />
    </div>
  );
}

/**
 * Inline loading indicator (for buttons)
 */
export function InlineSpinner(): React.ReactElement {
  return (
    <span className="inline-block animate-spin text-lg" role="status">
      ⏳
    </span>
  );
}

export default LoadingSpinner;
