/**
 * Share utilities for Comment Conspiracy
 * Generates spoiler-free share text and handles clipboard/share operations
 */

export interface ShareData {
  dayNumber: number;
  wasCorrect: boolean;
  streak: number;
}

/**
 * Generate the share text (spoiler-free)
 */
export function generateShareText(data: ShareData): string {
  const lines: string[] = [];

  lines.push(`Comment Conspiracy Day ${data.dayNumber}`);
  lines.push('');
  lines.push(data.wasCorrect ? '1/1' : '0/1');

  if (data.streak > 0) {
    lines.push(`${data.streak}-day streak`);
  }

  lines.push('');
  lines.push('r/CommentConspiracy');

  return lines.join('\n');
}

/**
 * Generate the share text with emojis (for display preview)
 */
export function generateShareTextWithEmojis(data: ShareData): string {
  const lines: string[] = [];

  lines.push(`🔍 Comment Conspiracy Day ${data.dayNumber}`);
  lines.push('');
  lines.push(data.wasCorrect ? '✅ 1/1' : '❌ 0/1');

  if (data.streak > 0) {
    lines.push(`🔥 ${data.streak}-day streak`);
  }

  lines.push('');
  lines.push('r/CommentConspiracy');

  return lines.join('\n');
}

/**
 * Copy text to clipboard
 * Returns true if successful, false otherwise
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }

    // Fallback for older browsers
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-9999px';
    document.body.appendChild(textArea);
    textArea.select();
    const success = document.execCommand('copy');
    document.body.removeChild(textArea);
    return success;
  } catch (error) {
    console.error('Failed to copy to clipboard:', error);
    return false;
  }
}

/**
 * Check if Web Share API is available
 */
export function canShare(): boolean {
  return typeof navigator !== 'undefined' && typeof navigator.share === 'function';
}

/**
 * Share using Web Share API
 * Returns true if successful, false otherwise
 */
export async function shareResult(data: ShareData): Promise<boolean> {
  if (!canShare()) {
    return false;
  }

  const text = generateShareTextWithEmojis(data);

  try {
    await navigator.share({
      title: 'Comment Conspiracy',
      text,
    });
    return true;
  } catch (error) {
    // User cancelled or share failed
    if ((error as Error).name !== 'AbortError') {
      console.error('Failed to share:', error);
    }
    return false;
  }
}
