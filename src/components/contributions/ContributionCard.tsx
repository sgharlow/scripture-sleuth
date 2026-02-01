/**
 * ContributionCard Component
 * Displays a single contribution with voting
 */

import React from 'react';
import type { ContributionDisplay } from '../../types';

export interface ContributionCardProps {
  contribution: ContributionDisplay;
  onVote: (contributionId: string, vote: 'up' | 'down') => void;
  disabled?: boolean;
}

const STATUS_BADGES: Record<string, { bg: string; text: string; label: string }> = {
  pending: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Pending Review' },
  approved: { bg: 'bg-green-100', text: 'text-green-800', label: 'Approved' },
  rejected: { bg: 'bg-red-100', text: 'text-red-800', label: 'Not Selected' },
  used: { bg: 'bg-purple-100', text: 'text-purple-800', label: 'Used in Puzzle!' },
};

export function ContributionCard({ contribution, onVote, disabled }: ContributionCardProps): React.ReactElement {
  const status = STATUS_BADGES[contribution.status] ?? STATUS_BADGES.pending;
  const netVotes = contribution.upvotes - contribution.downvotes;
  const hasVoted = contribution.userVote !== null;

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-700">u/{contribution.username}</span>
          <span className={`text-xs px-2 py-0.5 rounded-full ${status.bg} ${status.text}`}>
            {status.label}
          </span>
        </div>
        <span className="text-xs text-gray-400">
          {new Date(contribution.createdAt).toLocaleDateString()}
        </span>
      </div>

      {/* Prompt Idea */}
      <div className="mb-3">
        <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Prompt Idea</span>
        <p className="text-gray-900 font-medium mt-1">"{contribution.promptIdea}"</p>
      </div>

      {/* AI Comment */}
      <div className="mb-3 bg-gray-50 rounded-lg p-3">
        <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">AI Comment</span>
        <p className="text-gray-700 mt-1 italic">"{contribution.aiCommentText}"</p>
      </div>

      {/* AI Tells */}
      <div className="mb-4">
        <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Why It Sounds Like AI</span>
        <ul className="mt-1 space-y-1">
          {contribution.aiTells.map((tell, i) => (
            <li key={i} className="text-sm text-gray-600 flex items-start gap-2">
              <span className="text-blue-500">•</span>
              <span>{tell}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Voting */}
      <div className="flex items-center justify-between border-t border-gray-100 pt-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => onVote(contribution.id, 'up')}
            disabled={disabled || hasVoted}
            className={`p-2 rounded-lg transition-colors ${
              hasVoted
                ? 'text-gray-400 cursor-not-allowed'
                : 'text-gray-600 hover:bg-green-50 hover:text-green-600'
            }`}
            title={hasVoted ? 'Already voted' : 'Upvote'}
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
            </svg>
          </button>
          <span className={`font-bold min-w-[2rem] text-center ${
            netVotes > 0 ? 'text-green-600' : netVotes < 0 ? 'text-red-600' : 'text-gray-600'
          }`}>
            {netVotes > 0 ? '+' : ''}{netVotes}
          </span>
          <button
            onClick={() => onVote(contribution.id, 'down')}
            disabled={disabled || hasVoted}
            className={`p-2 rounded-lg transition-colors ${
              hasVoted
                ? 'text-gray-400 cursor-not-allowed'
                : 'text-gray-600 hover:bg-red-50 hover:text-red-600'
            }`}
            title={hasVoted ? 'Already voted' : 'Downvote'}
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>

        {contribution.usedInPuzzleId && (
          <span className="text-xs text-purple-600 font-medium">
            Used in puzzle!
          </span>
        )}
      </div>
    </div>
  );
}

export default ContributionCard;
