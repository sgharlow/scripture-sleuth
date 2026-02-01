/**
 * ConfirmModal Component
 * Confirmation dialog before submitting a guess
 * Detective theme: "Final Accusation" dramatic styling
 */

import React, { useEffect, useRef } from 'react';
import type { DisplayComment } from '../../types';

export interface ConfirmModalProps {
  isOpen: boolean;
  comment: DisplayComment | null;
  onConfirm: () => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

/**
 * Truncate text to a maximum length
 */
function truncateText(text: string, maxLength: number = 100): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + '...';
}

/**
 * ConfirmModal component
 */
export function ConfirmModal({
  isOpen,
  comment,
  onConfirm,
  onCancel,
  isSubmitting = false,
}: ConfirmModalProps): React.ReactElement | null {
  const confirmButtonRef = useRef<HTMLButtonElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  // Focus trap and escape key handling
  useEffect(() => {
    if (!isOpen) return;

    // Focus the confirm button when modal opens
    confirmButtonRef.current?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onCancel();
      }
      // Basic focus trap
      if (e.key === 'Tab' && modalRef.current) {
        const focusableElements = modalRef.current.querySelectorAll(
          'button:not([disabled])'
        );
        const firstElement = focusableElements[0] as HTMLElement;
        const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

        if (e.shiftKey && document.activeElement === firstElement) {
          e.preventDefault();
          lastElement?.focus();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
          e.preventDefault();
          firstElement?.focus();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onCancel]);

  if (!isOpen || !comment) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-modal-title"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black bg-opacity-80"
        onClick={onCancel}
        aria-hidden="true"
      />

      {/* Modal */}
      <div
        ref={modalRef}
        className="relative bg-detective-card border border-detective-border rounded-2xl shadow-2xl max-w-md w-full mx-4 p-6"
      >
        {/* Warning Icon */}
        <div className="text-center mb-4">
          <span className="text-4xl">⚠️</span>
        </div>

        {/* Title */}
        <h2
          id="confirm-modal-title"
          className="text-xl font-bold text-suspicious text-center mb-2 uppercase tracking-wider"
        >
          Final Accusation
        </h2>

        <p className="text-center text-textSecondary text-sm mb-4">
          You're accusing this suspect of being the AI imposter
        </p>

        {/* Comment Preview */}
        <div className="bg-detective-bg border border-suspicious/30 rounded-lg p-4 mb-6">
          <div className="flex items-center gap-2 text-sm text-textSecondary mb-2">
            <span className="text-suspicious font-semibold">Suspect {comment.displayIndex + 1}</span>
            <span>•</span>
            <span className="text-reddit">u/{comment.username}</span>
          </div>
          <div className="text-textPrimary italic text-sm">
            "{truncateText(comment.text)}"
          </div>
        </div>

        {/* Warning text */}
        <div className="bg-incorrect/10 border border-incorrect/30 rounded-lg px-4 py-2 mb-6">
          <p className="text-center text-incorrect text-sm font-medium">
            This cannot be undone
          </p>
        </div>

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            disabled={isSubmitting}
            className="flex-1 py-4 px-6 bg-detective-bg border border-detective-border hover:bg-detective-cardHover disabled:opacity-50 text-textPrimary font-semibold rounded-xl transition-all duration-200"
          >
            Back Off
          </button>
          <button
            ref={confirmButtonRef}
            onClick={onConfirm}
            disabled={isSubmitting}
            className="flex-1 py-4 px-6 bg-reddit hover:bg-reddit/90 disabled:bg-detective-border disabled:text-textMuted text-white font-bold rounded-xl transition-all duration-200"
          >
            {isSubmitting ? 'Analyzing...' : '🎯 Confirm'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmModal;
