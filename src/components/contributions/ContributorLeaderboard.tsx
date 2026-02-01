/**
 * ContributorLeaderboard Component
 * Shows top contributors
 */

import React from 'react';
import type { ContributorStats } from '../../types';

export interface ContributorLeaderboardProps {
  contributors: ContributorStats[];
  loading?: boolean;
}

export function ContributorLeaderboard({ contributors, loading }: ContributorLeaderboardProps): React.ReactElement {
  if (loading) {
    return (
      <div className="text-center py-6">
        <p className="text-gray-500">Loading leaderboard...</p>
      </div>
    );
  }

  if (contributors.length === 0) {
    return (
      <div className="text-center py-6 bg-gray-50 rounded-xl">
        <div className="text-2xl mb-2">No contributors yet</div>
        <p className="text-gray-500">Be the first to contribute!</p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-3">
        <h3 className="font-bold text-lg">Top Contributors</h3>
      </div>
      <ul className="divide-y divide-gray-100">
        {contributors.map((contributor, index) => (
          <li key={contributor.userId} className="px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                index === 0 ? 'bg-yellow-100 text-yellow-700' :
                index === 1 ? 'bg-gray-100 text-gray-700' :
                index === 2 ? 'bg-orange-100 text-orange-700' :
                'bg-gray-50 text-gray-600'
              }`}>
                {index === 0 ? '1st' : index === 1 ? '2nd' : index === 2 ? '3rd' : `#${index + 1}`}
              </span>
              <div>
                <p className="font-medium text-gray-900">u/{contributor.username}</p>
                <p className="text-xs text-gray-500">
                  {contributor.totalSubmissions} submitted
                  {contributor.usedCount > 0 && ` - ${contributor.usedCount} used in puzzles!`}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-bold text-purple-600">{contributor.contributorScore}</p>
              <p className="text-xs text-gray-500">points</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ContributorLeaderboard;
