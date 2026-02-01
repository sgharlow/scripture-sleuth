/**
 * ShareCard Component
 * Displays shareable result with copy/share functionality
 * Detective theme: dark card with branded buttons
 */

import React, { useState, useCallback } from 'react';
import {
  generateShareTextWithEmojis,
  copyToClipboard,
  canShare,
  shareResult,
} from '../../utils/shareUtils';

export interface ShareCardProps {
  dayNumber: number;
  wasCorrect: boolean;
  streak: number;
}

type CopyState = 'idle' | 'copying' | 'copied' | 'error';

export function ShareCard({
  dayNumber,
  wasCorrect,
  streak,
}: ShareCardProps): React.ReactElement {
  const [copyState, setCopyState] = useState<CopyState>('idle');

  const shareData = { dayNumber, wasCorrect, streak };
  const shareText = generateShareTextWithEmojis(shareData);
  const canUseShare = canShare();

  const handleCopy = useCallback(async () => {
    setCopyState('copying');

    const success = await copyToClipboard(shareText);

    if (success) {
      setCopyState('copied');
      setTimeout(() => setCopyState('idle'), 2000);
    } else {
      setCopyState('error');
      setTimeout(() => setCopyState('idle'), 2000);
    }
  }, [shareText]);

  const handleShare = useCallback(async () => {
    await shareResult(shareData);
  }, [shareData]);

  const getCopyButtonText = (): string => {
    switch (copyState) {
      case 'copying':
        return '...';
      case 'copied':
        return 'Copied!';
      case 'error':
        return 'Failed';
      default:
        return 'Copy';
    }
  };

  return (
    <div className="bg-detective-bg border border-detective-border rounded-xl p-4 sm:p-6">
      {/* Preview of share text */}
      <div className="font-mono text-sm sm:text-base whitespace-pre-line text-center mb-4 leading-relaxed text-textPrimary">
        {shareText}
      </div>

      {/* Action buttons */}
      <div className="flex gap-3 justify-center">
        <button
          onClick={handleCopy}
          disabled={copyState === 'copying'}
          className={`
            flex-1 max-w-[140px] py-3 px-4 rounded-lg text-sm font-bold
            transition-all duration-200 touch-manipulation border
            ${copyState === 'copied'
              ? 'bg-correct/20 border-correct/40 text-correct'
              : copyState === 'error'
              ? 'bg-incorrect/20 border-incorrect/40 text-incorrect'
              : 'bg-detective-card border-detective-border hover:bg-detective-cardHover text-textPrimary'
            }
          `}
        >
          <span className="flex items-center justify-center gap-2">
            {copyState === 'copied' ? (
              <>
                <span>✓</span>
                <span>{getCopyButtonText()}</span>
              </>
            ) : (
              <>
                <span>📋</span>
                <span>{getCopyButtonText()}</span>
              </>
            )}
          </span>
        </button>

        {canUseShare && (
          <button
            onClick={handleShare}
            className="flex-1 max-w-[140px] py-3 px-4 bg-reddit hover:bg-reddit/90 rounded-lg text-sm font-bold text-white transition-all duration-200 touch-manipulation"
          >
            <span className="flex items-center justify-center gap-2">
              <span>🔗</span>
              <span>Share</span>
            </span>
          </button>
        )}
      </div>
    </div>
  );
}

export default ShareCard;
