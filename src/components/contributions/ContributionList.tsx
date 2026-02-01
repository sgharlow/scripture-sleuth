/**
 * ContributionList Component
 * Lists contributions with filtering and sorting
 */

import React from 'react';
import type { ContributionDisplay, ContributionFilter } from '../../types';
import { ContributionCard } from './ContributionCard';

export interface ContributionListProps {
  contributions: ContributionDisplay[];
  onVote: (contributionId: string, vote: 'up' | 'down') => void;
  filter: ContributionFilter;
  onFilterChange: (filter: ContributionFilter) => void;
  loading?: boolean;
}

export function ContributionList({
  contributions,
  onVote,
  filter,
  onFilterChange,
  loading,
}: ContributionListProps): React.ReactElement {
  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-wrap gap-2 items-center">
        <select
          value={filter.sortBy ?? 'newest'}
          onChange={(e) => onFilterChange({ ...filter, sortBy: e.target.value as 'newest' | 'popular' | 'controversial' })}
          className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
        >
          <option value="newest">Newest</option>
          <option value="popular">Most Popular</option>
          <option value="controversial">Controversial</option>
        </select>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="text-center py-8">
          <div className="text-2xl animate-spin mb-2">Loading...</div>
          <p className="text-gray-500">Loading contributions...</p>
        </div>
      )}

      {/* Empty State */}
      {!loading && contributions.length === 0 && (
        <div className="text-center py-8 bg-gray-50 rounded-xl">
          <div className="text-3xl mb-2">No submissions yet</div>
          <p className="text-gray-500">Be the first to contribute!</p>
        </div>
      )}

      {/* Contribution Cards */}
      {!loading && contributions.length > 0 && (
        <div className="space-y-4">
          {contributions.map((contribution) => (
            <ContributionCard
              key={contribution.id}
              contribution={contribution}
              onVote={onVote}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default ContributionList;
