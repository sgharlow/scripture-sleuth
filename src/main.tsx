import { Devvit, useWebView, type JSONValue } from '@devvit/public-api';
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

const WEBVIEW_ID = 'scripture-sleuth';

// Main App component with WebView
const App: Devvit.CustomPostComponent = (context) => {
  const userId = context.userId ?? 'anonymous';
  const redisCtx = createRedisContext(context);

  // WebView hook — replaces deprecated Blocks renderer <webview> element
  const webView = useWebView<WebViewToDevvitMessage, DevvitToWebViewMessage>({
    url: 'index.html',
    onMessage: async (message, hook) => {
      console.log('[ScriptureSleuth] Received message from webview:', message.type);

      try {
        switch (message.type) {
          case 'INIT': {
            console.log('[ScriptureSleuth] Processing INIT for user:', userId);

            const puzzle = await getTodaysPuzzle(redisCtx, userId);
            const userProgress = await getUserProgress(redisCtx, userId);

            let previousResult = null;
            if (puzzle) {
              const alreadyPlayed = await hasUserPlayedToday(redisCtx, userId, puzzle.id);
              if (alreadyPlayed) {
                previousResult = await getPreviousResult(redisCtx, userId, puzzle.id);
              }
            }

            const streakRank = await getStreakRank(redisCtx, userId);
            const accuracyRank = await getAccuracyRank(redisCtx, userId);

            const initData: InitData = {
              userId,
              puzzle: puzzle ?? undefined,
              userProgress,
              previousResult,
              streakRank,
              accuracyRank,
            };

            hook.postMessage({ type: 'INIT_RESPONSE', data: initData });
            break;
          }

          case 'SUBMIT_GUESS': {
            const puzzle = await getTodaysPuzzle(redisCtx, userId);
            if (!puzzle) {
              hook.postMessage({ type: 'ERROR', error: 'No puzzle available' });
              return;
            }
            const result = await submitGuess(redisCtx, userId, puzzle.id, message.guessIndex);
            hook.postMessage({ type: 'GUESS_RESPONSE', result });
            break;
          }

          case 'SUBMIT_CONTRIBUTION': {
            const username = (await context.reddit.getCurrentUser())?.username ?? 'anonymous';
            const contribution = await submitContribution(redisCtx, userId, username, message.data);
            hook.postMessage({
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
            const voteResult = await voteOnContribution(redisCtx, userId, message.contributionId, message.vote);
            if (voteResult.success && voteResult.contribution) {
              hook.postMessage({ type: 'CONTRIBUTION_VOTED', contribution: voteResult.contribution });
            } else {
              hook.postMessage({ type: 'ERROR', error: voteResult.error ?? 'Failed to vote' });
            }
            break;
          }

          case 'GET_CONTRIBUTIONS': {
            const contributions = await getContributions(redisCtx, userId, message.filter);
            hook.postMessage({ type: 'CONTRIBUTIONS_LIST', contributions });
            break;
          }

          case 'GET_MY_CONTRIBUTIONS': {
            const myContributions = await getUserContributions(redisCtx, userId);
            hook.postMessage({ type: 'MY_CONTRIBUTIONS', contributions: myContributions });
            break;
          }

          case 'GET_TOP_CONTRIBUTORS': {
            const topContributors = await getTopContributors(redisCtx, 10);
            hook.postMessage({ type: 'TOP_CONTRIBUTORS', contributors: topContributors });
            break;
          }
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        hook.postMessage({ type: 'ERROR', error: errorMessage });
      }
    },
  });

  // Auto-mount the webview on render
  webView.mount();

  return (
    <vstack height="100%" width="100%" alignment="middle center">
      <text size="large">Loading Scripture Sleuth...</text>
    </vstack>
  );
};

// Register the custom post type
Devvit.addCustomPostType({
  name: 'Scripture Sleuth',
  description: 'Daily game - spot the fake Bible verse',
  height: 'tall',
  render: App,
});

// Menu item to create a new game post
Devvit.addMenuItem({
  label: 'Create Scripture Sleuth Post',
  location: 'subreddit',
  onPress: async (_event, context) => {
    const { reddit, ui } = context;
    const subreddit = await reddit.getCurrentSubreddit();
    const post = await reddit.submitPost({
      title: 'Scripture Sleuth - Can You Spot the Fake Verse?',
      subredditName: subreddit.name,
    });
    ui.showToast({ text: 'Created post!' });
    ui.navigateTo(post);
  },
});

// App install trigger - schedule the daily job
Devvit.addTrigger({
  event: 'AppInstall',
  onEvent: async (event, context) => {
    console.log('[ScriptureSleuth] App installed, scheduling daily job');
    await scheduleDailyJob(context);
  },
});

// App upgrade trigger - re-schedule the daily job
Devvit.addTrigger({
  event: 'AppUpgrade',
  onEvent: async (event, context) => {
    console.log('[ScriptureSleuth] App upgraded, re-scheduling daily job');
    await cancelDailyJob(context);
    await scheduleDailyJob(context);
  },
});

export default Devvit;
