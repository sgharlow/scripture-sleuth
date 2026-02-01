/**
 * ErrorState Component
 * Displays error messages with retry option
 * Detective theme: dark-friendly styling
 */

import React from 'react';

export interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  retryLabel?: string;
  className?: string;
}

/**
 * Map common error types to user-friendly messages
 */
export function getErrorMessage(error: string | Error | unknown): string {
  const errorString = error instanceof Error ? error.message : String(error);

  // Network errors
  if (
    errorString.includes('network') ||
    errorString.includes('fetch') ||
    errorString.includes('Network')
  ) {
    return "Couldn't reach the server. Check your connection and try again.";
  }

  // Puzzle not found
  if (
    errorString.includes('puzzle') &&
    (errorString.includes('not found') || errorString.includes('No puzzle'))
  ) {
    return "Today's case file isn't available yet. Check back soon!";
  }

  // Submit failures
  if (errorString.includes('submit') || errorString.includes('guess')) {
    return "Couldn't record your accusation. Please try again.";
  }

  // Generic fallback
  return errorString || 'Something went wrong. Please try again.';
}

export function ErrorState({
  title = 'Investigation Failed',
  message,
  onRetry,
  retryLabel = 'Try Again',
  className = '',
}: ErrorStateProps): React.ReactElement {
  return (
    <div
      className={`flex flex-col items-center justify-center p-6 text-center ${className}`}
      role="alert"
    >
      <div className="text-4xl mb-4">🚫</div>
      <h2 className="text-lg font-semibold text-textPrimary mb-2">{title}</h2>
      <p className="text-sm text-textSecondary mb-6 max-w-sm">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-6 py-3 bg-reddit hover:bg-reddit/90 active:bg-reddit/80 text-white font-semibold rounded-xl transition-all duration-200 touch-manipulation"
        >
          {retryLabel}
        </button>
      )}
    </div>
  );
}

/**
 * Full-page error state
 */
export function FullPageError({
  title,
  message,
  onRetry,
  retryLabel,
}: ErrorStateProps): React.ReactElement {
  return (
    <div className="flex flex-col h-full w-full items-center justify-center min-h-[300px] px-4">
      <ErrorState
        title={title}
        message={message}
        onRetry={onRetry}
        retryLabel={retryLabel}
      />
    </div>
  );
}

/**
 * Compact error for inline display
 */
export function InlineError({
  message,
  onRetry,
}: {
  message: string;
  onRetry?: () => void;
}): React.ReactElement {
  return (
    <div className="flex items-center gap-2 p-3 bg-incorrect/10 border border-incorrect/30 rounded-lg text-sm">
      <span className="text-incorrect">⚠️</span>
      <span className="text-incorrect flex-1">{message}</span>
      {onRetry && (
        <button
          onClick={onRetry}
          className="text-incorrect hover:text-incorrect/80 font-medium underline"
        >
          Retry
        </button>
      )}
    </div>
  );
}

export default ErrorState;
