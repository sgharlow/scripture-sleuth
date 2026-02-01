/**
 * Root App Component
 * Main entry point for the Comment Conspiracy React app
 * Manages game state and renders appropriate screens
 */

import React, { useEffect, useCallback, useState } from 'react';
import { useGameState } from '../hooks/useGameState';
import type {
  DevvitToWebViewMessage,
  WebViewToDevvitMessage,
  InitData,
  Achievement,
  LeaderboardRankData,
  ContributionDisplay,
  ContributorStats,
  SubmitContributionRequest,
  ContributionFilter,
} from '../types';

// Screen components
import { WelcomeScreen } from './screens/WelcomeScreen';
import { GameScreen } from './screens/GameScreen';
import { ResultScreen } from './screens/ResultScreen';
import { CompletedScreen } from './screens/CompletedScreen';
import { ConfirmModal } from './game/ConfirmModal';
import { FullPageSpinner } from './shared/LoadingSpinner';
import { FullPageError, getErrorMessage } from './shared/ErrorState';
import { AchievementToast } from './results/AchievementToast';
import { ContributeScreen } from './contributions/ContributeScreen';

/**
 * Send a message to the Devvit host
 */
function sendToDevvit(message: WebViewToDevvitMessage): void {
  window.parent.postMessage(message, '*');
}


/**
 * Main App component
 */
export function App(): React.ReactElement {
  const {
    state,
    puzzle,
    selectedIndex,
    result,
    userProgress,
    error,
    loadSuccess,
    loadAlreadyPlayed,
    loadError,
    startGame,
    selectComment,
    openConfirm,
    cancelConfirm,
    submitGuess,
    guessSuccess,
    guessError,
    reset,
  } = useGameState();

  // Track achievements to show in toast
  const [achievementsToShow, setAchievementsToShow] = useState<Achievement[]>([]);

  // Track leaderboard ranks
  const [streakRank, setStreakRank] = useState<LeaderboardRankData | null>(null);
  const [accuracyRank, setAccuracyRank] = useState<LeaderboardRankData | null>(null);

  // Contribution state
  const [showContributions, setShowContributions] = useState(false);
  const [contributions, setContributions] = useState<ContributionDisplay[]>([]);
  const [myContributions, setMyContributions] = useState<ContributionDisplay[]>([]);
  const [topContributors, setTopContributors] = useState<ContributorStats[]>([]);
  const [contributionFilter, setContributionFilter] = useState<ContributionFilter>({ status: 'pending', sortBy: 'newest' });
  const [contributionLoading, setContributionLoading] = useState(false);
  const [contributionSubmitting, setContributionSubmitting] = useState(false);

  // Handle messages from Devvit
  const handleDevvitMessage = useCallback(
    (event: MessageEvent) => {
      // v35: Debug message logging with Devvit envelope unwrapping
      console.log('[WebView] Received message event:', event);
      console.log('[WebView] event.data:', JSON.stringify(event.data, null, 2));

      // Unwrap Devvit message envelope if present
      let message = event.data;
      if (message?.type === 'devvit-message' && message?.data?.message) {
        message = message.data.message;
        console.log('[WebView] Unwrapped devvit-message:', JSON.stringify(message, null, 2));
      }

      if (!message || typeof message !== 'object' || !('type' in message)) {
        console.log('[WebView] Message rejected - not valid format');
        return;
      }

      console.log('[WebView] Processing message type:', message.type);

      switch (message.type) {
        case 'INIT_RESPONSE': {
          const data = message.data as InitData;
          // Store leaderboard data
          setStreakRank(data.streakRank ?? null);
          setAccuracyRank(data.accuracyRank ?? null);

          if (data.previousResult && data.puzzle) {
            // User already played today
            loadAlreadyPlayed(data.puzzle, data.previousResult, data.userProgress);
          } else if (data.puzzle) {
            // Ready to play
            loadSuccess(data.puzzle, data.userProgress);
          } else {
            loadError('No puzzle available');
          }
          break;
        }
        case 'GUESS_RESPONSE': {
          guessSuccess(message.result);
          // Show achievement toast if any were unlocked
          if (message.result.newlyUnlockedAchievements?.length > 0) {
            setAchievementsToShow(message.result.newlyUnlockedAchievements);
          }
          break;
        }
        case 'ERROR': {
          if (state === 'SUBMITTING') {
            guessError(message.error);
          } else if (contributionSubmitting) {
            setContributionSubmitting(false);
          } else {
            loadError(message.error);
          }
          break;
        }

        // Contribution message handlers
        case 'CONTRIBUTION_SUBMITTED': {
          setContributionSubmitting(false);
          setMyContributions(prev => [message.contribution, ...prev]);
          break;
        }
        case 'CONTRIBUTION_VOTED': {
          // Update the contribution in the list
          setContributions(prev =>
            prev.map(c => c.id === message.contribution.id ? message.contribution : c)
          );
          break;
        }
        case 'CONTRIBUTIONS_LIST': {
          setContributionLoading(false);
          setContributions(message.contributions);
          break;
        }
        case 'MY_CONTRIBUTIONS': {
          setMyContributions(message.contributions);
          break;
        }
        case 'TOP_CONTRIBUTORS': {
          setTopContributors(message.contributors);
          break;
        }
      }
    },
    [loadSuccess, loadAlreadyPlayed, loadError, guessSuccess, guessError, state, contributionSubmitting]
  );

  // Set up message listener (updates when handler changes)
  useEffect(() => {
    window.addEventListener('message', handleDevvitMessage);
    return () => {
      window.removeEventListener('message', handleDevvitMessage);
    };
  }, [handleDevvitMessage]);

  // Send initial INIT request only once on mount
  useEffect(() => {
    sendToDevvit({ type: 'INIT' });
  }, []);

  // Handle guess submission
  const handleConfirmGuess = useCallback(() => {
    if (selectedIndex === null) return;
    submitGuess();
    sendToDevvit({ type: 'SUBMIT_GUESS', guessIndex: selectedIndex });
  }, [selectedIndex, submitGuess]);

  // Handle retry after error
  const handleRetry = useCallback(() => {
    reset();
    sendToDevvit({ type: 'INIT' });
  }, [reset]);

  // Contribution handlers
  const openContributions = useCallback(() => {
    setShowContributions(true);
    setContributionLoading(true);
    // Fetch contribution data
    sendToDevvit({ type: 'GET_CONTRIBUTIONS', filter: contributionFilter });
    sendToDevvit({ type: 'GET_MY_CONTRIBUTIONS' });
    sendToDevvit({ type: 'GET_TOP_CONTRIBUTORS' });
  }, [contributionFilter]);

  const closeContributions = useCallback(() => {
    setShowContributions(false);
  }, []);

  const handleSubmitContribution = useCallback((data: SubmitContributionRequest) => {
    setContributionSubmitting(true);
    sendToDevvit({ type: 'SUBMIT_CONTRIBUTION', data });
  }, []);

  const handleVoteContribution = useCallback((contributionId: string, vote: 'up' | 'down') => {
    sendToDevvit({ type: 'VOTE_CONTRIBUTION', contributionId, vote });
  }, []);

  const handleContributionFilterChange = useCallback((filter: ContributionFilter) => {
    setContributionFilter(filter);
    setContributionLoading(true);
    sendToDevvit({ type: 'GET_CONTRIBUTIONS', filter });
  }, []);

  // Render based on state
  const renderContent = (): React.ReactElement => {
    // Show contributions screen if active
    if (showContributions) {
      return (
        <ContributeScreen
          contributions={contributions}
          myContributions={myContributions}
          topContributors={topContributors}
          onSubmit={handleSubmitContribution}
          onVote={handleVoteContribution}
          onFilterChange={handleContributionFilterChange}
          filter={contributionFilter}
          loading={contributionLoading}
          submitting={contributionSubmitting}
          onBack={closeContributions}
        />
      );
    }

    switch (state) {
      case 'LOADING':
        return <FullPageSpinner message="Loading puzzle..." />;

      case 'ERROR':
        return (
          <FullPageError
            title="Something went wrong"
            message={getErrorMessage(error || 'Unknown error')}
            onRetry={handleRetry}
          />
        );

      case 'NEW_USER':
        return <WelcomeScreen onStartGame={startGame} />;

      case 'PLAYING':
      case 'SELECTED':
      case 'CONFIRMING':
      case 'SUBMITTING':
        if (!puzzle) return <FullPageSpinner />;
        return (
          <GameScreen
            puzzle={puzzle}
            selectedIndex={selectedIndex}
            onSelectComment={selectComment}
            onConfirmGuess={openConfirm}
            disabled={state === 'SUBMITTING'}
          />
        );

      case 'RESULT_CORRECT':
      case 'RESULT_INCORRECT':
        if (!result || !puzzle) return <FullPageSpinner />;
        return (
          <ResultScreen
            result={result}
            puzzle={puzzle}
            onViewBreakdown={() => {
              // Could navigate to a detailed breakdown
              console.log('View breakdown');
            }}
            onJoinDiscussion={() => {
              // Could open Reddit comments
              console.log('Join discussion');
            }}
            onContribute={openContributions}
          />
        );

      case 'COMPLETED':
        if (!result || !puzzle) return <FullPageSpinner />;
        return (
          <CompletedScreen
            result={result}
            puzzle={puzzle}
            userProgress={userProgress ?? undefined}
            streakRank={streakRank}
            accuracyRank={accuracyRank}
            onViewBreakdown={() => {
              console.log('View breakdown');
            }}
            onJoinDiscussion={() => {
              console.log('Join discussion');
            }}
            onContribute={openContributions}
          />
        );

      default:
        return <FullPageSpinner />;
    }
  };

  return (
    <div className="min-h-screen bg-detective-bg safe-area-inset">
      {renderContent()}

      {/* Confirmation Modal */}
      {state === 'CONFIRMING' && puzzle && selectedIndex !== null && (
        <ConfirmModal
          isOpen={true}
          comment={puzzle.comments[selectedIndex]}
          onConfirm={handleConfirmGuess}
          onCancel={cancelConfirm}
        />
      )}

      {/* Submitting Overlay */}
      {state === 'SUBMITTING' && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-detective-card border border-detective-border rounded-xl p-6 text-center">
            <div className="text-3xl mb-3 animate-spin">🔍</div>
            <div className="text-textPrimary font-medium">Analyzing suspect...</div>
          </div>
        </div>
      )}

      {/* Achievement Toast */}
      {achievementsToShow.length > 0 && (
        <AchievementToast
          achievements={achievementsToShow}
          onDismiss={() => setAchievementsToShow([])}
        />
      )}
    </div>
  );
}

export default App;
