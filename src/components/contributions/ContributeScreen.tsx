/**
 * ContributeScreen Component
 * Main screen for user contributions - submit, browse, and vote
 */

import React, { useState } from 'react';
import type { ContributionDisplay, ContributorStats, SubmitContributionRequest, ContributionFilter } from '../../types';
import { ContributionForm } from './ContributionForm';
import { ContributionList } from './ContributionList';
import { ContributorLeaderboard } from './ContributorLeaderboard';

type Tab = 'submit' | 'browse' | 'my' | 'leaderboard';

export interface ContributeScreenProps {
  contributions: ContributionDisplay[];
  myContributions: ContributionDisplay[];
  topContributors: ContributorStats[];
  onSubmit: (data: SubmitContributionRequest) => void;
  onVote: (contributionId: string, vote: 'up' | 'down') => void;
  onFilterChange: (filter: ContributionFilter) => void;
  filter: ContributionFilter;
  loading?: boolean;
  submitting?: boolean;
  onBack: () => void;
}

export function ContributeScreen({
  contributions,
  myContributions,
  topContributors,
  onSubmit,
  onVote,
  onFilterChange,
  filter,
  loading,
  submitting,
  onBack,
}: ContributeScreenProps): React.ReactElement {
  const [activeTab, setActiveTab] = useState<Tab>('submit');

  const tabs: { id: Tab; label: string; icon: string }[] = [
    { id: 'submit', label: 'Submit', icon: '+' },
    { id: 'browse', label: 'Browse', icon: 'All' },
    { id: 'my', label: 'My Submissions', icon: 'My' },
    { id: 'leaderboard', label: 'Top', icon: 'Top' },
  ];

  return (
    <div className="flex flex-col h-full w-full max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
        <button
          onClick={onBack}
          className="text-blue-600 hover:text-blue-700 font-medium"
        >
          Back to Game
        </button>
        <h1 className="font-bold text-lg">Contribute</h1>
        <div className="w-20"></div>
      </div>

      {/* Intro Banner */}
      <div className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-4 py-4">
        <h2 className="font-bold text-lg mb-1">Help Build the Game!</h2>
        <p className="text-sm opacity-90">
          Submit AI-style comments that might be used in future puzzles.
          The best submissions get used and you get credit!
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="flex border-b border-gray-200">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 py-3 text-center text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {activeTab === 'submit' && (
          <div>
            <div className="bg-blue-50 rounded-lg p-4 mb-4">
              <h3 className="font-semibold text-blue-900 mb-2">How to Submit</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>1. Think of a Reddit-style question prompt</li>
                <li>2. Write a comment that sounds AI-generated</li>
                <li>3. Explain what makes it sound like AI</li>
                <li>4. If approved, your comment may appear in a puzzle!</li>
              </ul>
            </div>
            <ContributionForm onSubmit={onSubmit} disabled={submitting} />
          </div>
        )}

        {activeTab === 'browse' && (
          <ContributionList
            contributions={contributions}
            onVote={onVote}
            filter={filter}
            onFilterChange={onFilterChange}
            loading={loading}
          />
        )}

        {activeTab === 'my' && (
          <div>
            {myContributions.length === 0 ? (
              <div className="text-center py-8 bg-gray-50 rounded-xl">
                <div className="text-3xl mb-2">No submissions yet</div>
                <p className="text-gray-500">Switch to Submit tab to contribute!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {myContributions.map((contribution) => (
                  <div key={contribution.id} className="bg-white border border-gray-200 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        contribution.status === 'approved' ? 'bg-green-100 text-green-800' :
                        contribution.status === 'rejected' ? 'bg-red-100 text-red-800' :
                        contribution.status === 'used' ? 'bg-purple-100 text-purple-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {contribution.status === 'used' ? 'Used in Puzzle!' :
                         contribution.status.charAt(0).toUpperCase() + contribution.status.slice(1)}
                      </span>
                      <span className="text-xs text-gray-400">
                        {new Date(contribution.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="font-medium text-gray-900 mb-1">"{contribution.promptIdea}"</p>
                    <p className="text-sm text-gray-600 italic">"{contribution.aiCommentText}"</p>
                    <div className="mt-2 text-xs text-gray-500">
                      Votes: +{contribution.upvotes} / -{contribution.downvotes}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'leaderboard' && (
          <ContributorLeaderboard contributors={topContributors} loading={loading} />
        )}
      </div>
    </div>
  );
}

export default ContributeScreen;
