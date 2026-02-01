import { Devvit, type JSONValue } from '@devvit/public-api';
import type { WebViewToDevvitMessage, DevvitToWebViewMessage, InitData, LeaderboardRankData } from './types';
import { getTodaysPuzzle, submitGuess, getPreviousResult, hasUserPlayedToday } from './services/puzzleService';
import { getUserProgress } from './services/userService';
import { getStreakRank, getAccuracyRank } from './services/redisService';
import type { RedisContext } from './services/redisKeys';
import { registerDailyPuzzleJob, scheduleDailyJob, cancelDailyJob } from './scheduler/dailyPuzzle';
import {
  submitContribution,
  voteOnContribution,
  getContributions,
  getUserContributions,
  getTopContributors,
} from './services/contributionService';

// Configure Devvit capabilities
Devvit.configure({
  redditAPI: true,
  redis: true,
  http: true,
});

// Register the daily puzzle scheduler job
registerDailyPuzzleJob();

// Create Redis context from Devvit context
function createRedisContext(context: Devvit.Context): RedisContext {
  return {
    redis: context.redis,
  };
}

const WEBVIEW_ID = 'comment-conspiracy';

// Main App component with WebView
const App: Devvit.CustomPostComponent = (context) => {
  const userId = context.userId ?? 'anonymous';
  const redisCtx = createRedisContext(context);

  // WebView message handler - using the correct pattern from official examples
  const onMessage = async (msg: JSONValue) => {
    const message = msg as WebViewToDevvitMessage;
    console.log('[CommentConspiracy] Received message from webview:', message.type);

    try {
      switch (message.type) {
        case 'INIT': {
          console.log('[CommentConspiracy] Processing INIT for user:', userId);

          // Get today's puzzle from Redis
          const puzzle = await getTodaysPuzzle(redisCtx, userId);
          console.log('[CommentConspiracy] Got puzzle:', puzzle?.id ?? 'none');

          // Get user progress from Redis
          const userProgress = await getUserProgress(redisCtx, userId);
          console.log('[CommentConspiracy] Got user progress, streak:', userProgress.currentStreak);

          // Check if user already played today
          let previousResult = null;
          if (puzzle) {
            const alreadyPlayed = await hasUserPlayedToday(redisCtx, userId, puzzle.id);
            if (alreadyPlayed) {
              previousResult = await getPreviousResult(redisCtx, userId, puzzle.id);
              console.log('[CommentConspiracy] User already played today');
            }
          }

          // Get leaderboard ranks
          let streakRank: LeaderboardRankData | null = null;
          let accuracyRank: LeaderboardRankData | null = null;

          const streakRankData = await getStreakRank(redisCtx, userId);
          if (streakRankData) {
            streakRank = streakRankData;
          }

          const accuracyRankData = await getAccuracyRank(redisCtx, userId);
          if (accuracyRankData) {
            accuracyRank = accuracyRankData;
          }

          const initData: InitData = {
            userId,
            puzzle: puzzle ?? undefined,
            userProgress,
            previousResult,
            streakRank,
            accuracyRank,
          };

          console.log('[CommentConspiracy] Sending INIT_RESPONSE');
          context.ui.webView.postMessage<DevvitToWebViewMessage>(WEBVIEW_ID, { type: 'INIT_RESPONSE', data: initData });
          console.log('[CommentConspiracy] INIT_RESPONSE sent!');
          break;
        }

        case 'SUBMIT_GUESS': {
          // Get today's puzzle ID
          const puzzle = await getTodaysPuzzle(redisCtx, userId);
          if (!puzzle) {
            context.ui.webView.postMessage<DevvitToWebViewMessage>(WEBVIEW_ID, { type: 'ERROR', error: 'No puzzle available' });
            return;
          }

          // Submit the guess
          const result = await submitGuess(redisCtx, userId, puzzle.id, message.guessIndex);
          context.ui.webView.postMessage<DevvitToWebViewMessage>(WEBVIEW_ID, { type: 'GUESS_RESPONSE', result });
          break;
        }

        // ===== User Contribution Handlers =====

        case 'SUBMIT_CONTRIBUTION': {
          console.log('[CommentConspiracy] Processing SUBMIT_CONTRIBUTION');
          const username = (await context.reddit.getCurrentUser())?.username ?? 'anonymous';
          const contribution = await submitContribution(redisCtx, userId, username, message.data);
          context.ui.webView.postMessage<DevvitToWebViewMessage>(WEBVIEW_ID, {
            type: 'CONTRIBUTION_SUBMITTED',
            contribution: {
              id: contribution.id,
              username: contribution.username,
              createdAt: contribution.createdAt,
              promptIdea: contribution.promptIdea,
              category: contribution.category,
              aiCommentText: contribution.aiCommentText,
              aiTells: contribution.aiTells,
              status: contribution.status,
              upvotes: contribution.upvotes,
              downvotes: contribution.downvotes,
              userVote: null,
            },
          });
          break;
        }

        case 'VOTE_CONTRIBUTION': {
          console.log('[CommentConspiracy] Processing VOTE_CONTRIBUTION');
          const voteResult = await voteOnContribution(redisCtx, userId, message.contributionId, message.vote);
          if (voteResult.success && voteResult.contribution) {
            context.ui.webView.postMessage<DevvitToWebViewMessage>(WEBVIEW_ID, {
              type: 'CONTRIBUTION_VOTED',
              contribution: voteResult.contribution,
            });
          } else {
            context.ui.webView.postMessage<DevvitToWebViewMessage>(WEBVIEW_ID, {
              type: 'ERROR',
              error: voteResult.error ?? 'Failed to vote',
            });
          }
          break;
        }

        case 'GET_CONTRIBUTIONS': {
          console.log('[CommentConspiracy] Processing GET_CONTRIBUTIONS');
          const contributions = await getContributions(redisCtx, userId, message.filter);
          context.ui.webView.postMessage<DevvitToWebViewMessage>(WEBVIEW_ID, {
            type: 'CONTRIBUTIONS_LIST',
            contributions,
          });
          break;
        }

        case 'GET_MY_CONTRIBUTIONS': {
          console.log('[CommentConspiracy] Processing GET_MY_CONTRIBUTIONS');
          const myContributions = await getUserContributions(redisCtx, userId);
          context.ui.webView.postMessage<DevvitToWebViewMessage>(WEBVIEW_ID, {
            type: 'MY_CONTRIBUTIONS',
            contributions: myContributions,
          });
          break;
        }

        case 'GET_TOP_CONTRIBUTORS': {
          console.log('[CommentConspiracy] Processing GET_TOP_CONTRIBUTORS');
          const topContributors = await getTopContributors(redisCtx, 10);
          context.ui.webView.postMessage<DevvitToWebViewMessage>(WEBVIEW_ID, {
            type: 'TOP_CONTRIBUTORS',
            contributors: topContributors,
          });
          break;
        }
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      context.ui.webView.postMessage<DevvitToWebViewMessage>(WEBVIEW_ID, { type: 'ERROR', error: errorMessage });
    }
  };

  return (
    <vstack height="100%" width="100%">
      <webview
        id={WEBVIEW_ID}
        url="index.html"
        width="100%"
        height="100%"
        onMessage={onMessage}
      />
    </vstack>
  );
};

// Register the custom post type
Devvit.addCustomPostType({
  name: 'Comment Conspiracy',
  description: 'Daily game - spot the AI-generated comment',
  height: 'tall',
  render: App,
});

// Menu item to create a new game post
Devvit.addMenuItem({
  label: 'Create Comment Conspiracy Post',
  location: 'subreddit',
  onPress: async (_event, context) => {
    const { reddit, ui } = context;
    const subreddit = await reddit.getCurrentSubreddit();
    const post = await reddit.submitPost({
      title: 'Comment Conspiracy - Can You Spot the AI?',
      subredditName: subreddit.name,
      preview: (
        <vstack height="100%" width="100%" alignment="middle center">
          <text size="large">Loading ...</text>
        </vstack>
      ),
    });
    ui.showToast({ text: 'Created post!' });
    ui.navigateTo(post);
  },
});

// App install trigger - schedule the daily job
Devvit.addTrigger({
  event: 'AppInstall',
  onEvent: async (event, context) => {
    console.log('[CommentConspiracy] App installed, scheduling daily job');
    await scheduleDailyJob(context);
  },
});

// App upgrade trigger - re-schedule the daily job
Devvit.addTrigger({
  event: 'AppUpgrade',
  onEvent: async (event, context) => {
    console.log('[CommentConspiracy] App upgraded, re-scheduling daily job');
    await cancelDailyJob(context);
    await scheduleDailyJob(context);
  },
});

export default Devvit;
