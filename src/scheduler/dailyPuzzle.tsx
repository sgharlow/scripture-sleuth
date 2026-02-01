/**
 * Daily Puzzle Scheduler
 * Posts a new Comment Conspiracy puzzle every day at midnight UTC
 */

import { Devvit } from '@devvit/public-api';
import type { RedisContext } from '../services/redisKeys';
import { getPuzzle, setCurrentPuzzleId } from '../services/redisService';
import { ensurePuzzlesLoaded } from '../services/bootstrapService';
import { getInventoryStatus, formatInventoryReport } from '../services/inventoryService';

/**
 * Get today's date in puzzle ID format (YYYY-MM-DD) in UTC
 */
function getTodayDateId(): string {
  const now = new Date();
  const year = now.getUTCFullYear();
  const month = String(now.getUTCMonth() + 1).padStart(2, '0');
  const day = String(now.getUTCDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Create Redis context from Devvit context
 */
function createRedisContext(context: Devvit.Context): RedisContext {
  return {
    redis: context.redis,
  };
}

/**
 * Register the daily puzzle scheduler job
 */
export function registerDailyPuzzleJob(): void {
  Devvit.addSchedulerJob({
    name: 'daily-puzzle-post',
    onRun: async (event, context) => {
      console.log('[DailyPuzzle] Starting daily puzzle job');

      const redisCtx = createRedisContext(context);
      const todayId = getTodayDateId();

      try {
        // Ensure puzzles are loaded
        await ensurePuzzlesLoaded(redisCtx);

        // Get today's puzzle
        const puzzle = await getPuzzle(redisCtx, todayId);

        if (!puzzle) {
          console.error(`[DailyPuzzle] No puzzle found for ${todayId}`);
          // Send modmail alert
          await sendMissingPuzzleAlert(context, todayId);
          return;
        }

        // Update current puzzle pointer
        await setCurrentPuzzleId(redisCtx, todayId);
        console.log(`[DailyPuzzle] Set current puzzle to ${todayId}`);

        // Get the subreddit
        const subreddit = await context.reddit.getCurrentSubreddit();

        // Create the daily puzzle post
        const post = await context.reddit.submitPost({
          title: `Day ${puzzle.dayNumber}: Can You Spot the AI Comment?`,
          subredditName: subreddit.name,
          preview: (
            <vstack height="100%" width="100%" alignment="center middle" padding="medium">
              <text size="xlarge" weight="bold">Comment Conspiracy</text>
              <spacer size="medium" />
              <text size="medium">Loading puzzle...</text>
            </vstack>
          ),
        });

        console.log(`[DailyPuzzle] Created post ${post.id} for Day ${puzzle.dayNumber}`);

        // Run inventory health check
        await runInventoryHealthCheck(context, redisCtx);

      } catch (error) {
        console.error('[DailyPuzzle] Error in daily puzzle job:', error);
        await sendErrorAlert(context, error);
      }
    },
  });
}

/**
 * Send alert when puzzle is missing
 */
async function sendMissingPuzzleAlert(
  context: Devvit.Context,
  date: string
): Promise<void> {
  try {
    const subreddit = await context.reddit.getCurrentSubreddit();
    await context.reddit.sendPrivateMessage({
      to: `/r/${subreddit.name}`,
      subject: '[Comment Conspiracy] Missing Puzzle Alert',
      text: `No puzzle found for ${date}. Please add a puzzle for this date to continue the daily series.`,
    });
  } catch (error) {
    console.error('[DailyPuzzle] Failed to send missing puzzle alert:', error);
  }
}

/**
 * Send alert on scheduler error
 */
async function sendErrorAlert(
  context: Devvit.Context,
  error: unknown
): Promise<void> {
  try {
    const subreddit = await context.reddit.getCurrentSubreddit();
    const errorMessage = error instanceof Error ? error.message : String(error);
    await context.reddit.sendPrivateMessage({
      to: `/r/${subreddit.name}`,
      subject: '[Comment Conspiracy] Scheduler Error',
      text: `Error in daily puzzle scheduler: ${errorMessage}`,
    });
  } catch (sendError) {
    console.error('[DailyPuzzle] Failed to send error alert:', sendError);
  }
}

/**
 * Schedule the daily job on app install
 */
export async function scheduleDailyJob(context: Devvit.Context): Promise<void> {
  try {
    // Schedule at midnight UTC daily
    await context.scheduler.runJob({
      name: 'daily-puzzle-post',
      cron: '0 0 * * *', // Midnight UTC
    });
    console.log('[DailyPuzzle] Scheduled daily puzzle job for midnight UTC');
  } catch (error) {
    console.error('[DailyPuzzle] Failed to schedule daily job:', error);
  }
}

/**
 * Cancel the daily job (used on app uninstall)
 */
export async function cancelDailyJob(context: Devvit.Context): Promise<void> {
  try {
    const jobs = await context.scheduler.listJobs();
    for (const job of jobs) {
      if (job.name === 'daily-puzzle-post') {
        await context.scheduler.cancelJob(job.id);
        console.log(`[DailyPuzzle] Cancelled job ${job.id}`);
      }
    }
  } catch (error) {
    console.error('[DailyPuzzle] Failed to cancel daily job:', error);
  }
}

/**
 * Run inventory health check and send alert if needed
 */
async function runInventoryHealthCheck(
  context: Devvit.Context,
  redisCtx: RedisContext
): Promise<void> {
  try {
    const status = await getInventoryStatus(redisCtx, 7);
    console.log(`[HealthCheck] Inventory status: ${status.daysOfRunway} days of runway`);

    if (status.isCritical || status.isLow) {
      const report = formatInventoryReport(status);
      const subreddit = await context.reddit.getCurrentSubreddit();

      const subject = status.isCritical
        ? '[Comment Conspiracy] CRITICAL: Puzzle Inventory Empty!'
        : '[Comment Conspiracy] WARNING: Puzzle Inventory Low';

      await context.reddit.sendPrivateMessage({
        to: `/r/${subreddit.name}`,
        subject,
        text: report,
      });
      console.log('[HealthCheck] Sent inventory alert');
    }
  } catch (error) {
    console.error('[HealthCheck] Error running inventory check:', error);
  }
}
