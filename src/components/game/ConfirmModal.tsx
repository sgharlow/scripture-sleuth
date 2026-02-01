/**
 * ConfirmModal Component
 * Confirmation dialog before submitting a guess
 * Scripture theme: "Final Decision" parchment styling
 */

import React, { useEffect, useRef } from 'react';
import type { DisplayVerse } from '../../types';

export interface ConfirmModalProps {
  isOpen: boolean;
  verse: DisplayVerse | null;
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
  verse,
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

  if (!isOpen || !verse) return null;

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
        className="relative bg-scripture-card border border-scripture-border rounded-2xl shadow-2xl max-w-md w-full mx-4 p-6"
      >
        {/* Warning Icon */}
        <div className="text-center mb-4">
          <span className="text-4xl">📜</span>
        </div>

        {/* Title */}
        <h2
          id="confirm-modal-title"
          className="text-xl font-bold text-burgundy text-center mb-2 uppercase tracking-wider"
        >
          Final Decision
        </h2>

        <p className="text-center text-textSecondary text-sm mb-4">
          You're marking this verse as the fake
        </p>

        {/* Verse Preview */}
        <div className="bg-scripture-bg border border-burgundy/30 rounded-lg p-4 mb-6">
          <div className="flex items-center gap-2 text-sm text-textSecondary mb-2">
            <span className="text-burgundy font-semibold">Verse {verse.displayIndex + 1}</span>
            <span>•</span>
            <span className="text-gold-dark">{verse.reference}</span>
          </div>
          <div className="text-textPrimary italic text-sm font-verse">
            "{truncateText(verse.text)}"
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
            className="flex-1 py-4 px-6 bg-scripture-bg border border-scripture-border hover:bg-scripture-cardHover disabled:opacity-50 text-textPrimary font-semibold rounded-xl transition-all duration-200"
          >
            Go Back
          </button>
          <button
            ref={confirmButtonRef}
            onClick={onConfirm}
            disabled={isSubmitting}
            className="flex-1 py-4 px-6 bg-burgundy hover:bg-burgundy-dark disabled:bg-scripture-border disabled:text-textMuted text-white font-bold rounded-xl transition-all duration-200"
          >
            {isSubmitting ? 'Checking...' : '📖 Confirm'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmModal;
