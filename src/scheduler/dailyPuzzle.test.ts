/**
 * Daily puzzle scheduler: sunset behaviour (ruling 2026-10-15, option B of
 * __project-docs/content-runway-brief-2026-10-14.md).
 *
 * Runs the real `daily-puzzle-post` handler against the real bootstrap puzzle
 * data (last puzzle 2026-11-06) with an in-memory Redis that persists across
 * runs, so each test is a sequence of real daily runs.
 */

import { describe, it, expect, vi, beforeAll, afterEach } from 'vitest';

type JobHandler = (event: unknown, context: unknown) => Promise<void>;

const captured = vi.hoisted(() => ({ jobs: {} as Record<string, JobHandler> }));

vi.mock('@devvit/public-api', () => ({
  Devvit: {
    addSchedulerJob: (job: { name: string; onRun: JobHandler }) => {
      captured.jobs[job.name] = job.onRun;
    },
    createElement: () => ({}),
  },
}));

import { registerDailyPuzzleJob } from './dailyPuzzle.js';

const LAST_PUZZLE_DATE = '2026-11-06';
const LAST_DAY_NUMBER = 219;
const SUBREDDIT = 'ScriptureSleuth';

function makeContext(store: Map<string, string>) {
  let postCount = 0;
  const redis = {
    get: async (key: string) => store.get(key),
    set: async (key: string, value: string) => {
      store.set(key, value);
    },
    del: async (key: string) => {
      store.delete(key);
    },
  };
  const submitPost = vi.fn(async (_options: Record<string, unknown>) => ({ id: `t3_post${++postCount}` }));
  const sendPrivateMessage = vi.fn(async (_options: { to: string; subject: string; text: string }) => {});
  const listJobs = vi.fn(async () => [{ id: 'job-daily', name: 'daily-puzzle-post', cron: '0 0 * * *' }]);
  const cancelJob = vi.fn(async (_id: string) => {});
  return {
    redis,
    reddit: {
      getCurrentSubreddit: async () => ({ name: SUBREDDIT }),
      submitPost,
      sendPrivateMessage,
    },
    scheduler: { listJobs, cancelJob },
  };
}

async function runJobAt(isoTime: string, context: ReturnType<typeof makeContext>): Promise<void> {
  vi.setSystemTime(new Date(isoTime));
  await captured.jobs['daily-puzzle-post']({ name: 'daily-puzzle-post' }, context);
}

function modmailSubjects(context: ReturnType<typeof makeContext>): string[] {
  return context.reddit.sendPrivateMessage.mock.calls.map(([options]) => options.subject);
}

describe('daily-puzzle-post scheduler: series sunset', () => {
  beforeAll(() => {
    registerDailyPuzzleJob();
    vi.spyOn(console, 'log').mockImplementation(() => {});
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('posts ONE "Series complete" post on 2026-11-07, the first day past the last puzzle, and no Missing Puzzle Alert', async () => {
    vi.useFakeTimers({ toFake: ['Date'] });
    const context = makeContext(new Map());

    await runJobAt('2026-11-07T00:00:05Z', context);

    expect(context.reddit.submitPost).toHaveBeenCalledTimes(1);
    const options = context.reddit.submitPost.mock.calls[0][0] as { title: string; text: string; subredditName: string };
    expect(options.subredditName).toBe(SUBREDDIT);
    expect(options.title).toMatch(/series complete/i);
    expect(options.text).toContain(`Day ${LAST_DAY_NUMBER}`);
    expect(options.text).toContain(LAST_PUZZLE_DATE);
    expect(options.text).toMatch(/thank you/i);
    expect(modmailSubjects(context).some((s) => /missing puzzle/i.test(s))).toBe(false);
  });

  it('posts it exactly once: later runs post nothing and send no modmail', async () => {
    vi.useFakeTimers({ toFake: ['Date'] });
    const context = makeContext(new Map());

    await runJobAt('2026-11-07T00:00:05Z', context);
    await runJobAt('2026-11-08T00:00:05Z', context);
    await runJobAt('2026-11-09T00:00:05Z', context);

    expect(context.reddit.submitPost).toHaveBeenCalledTimes(1);
    expect(context.reddit.sendPrivateMessage).not.toHaveBeenCalled();
  });

  it('cancels the daily-puzzle-post job once the series is complete', async () => {
    vi.useFakeTimers({ toFake: ['Date'] });
    const context = makeContext(new Map());

    await runJobAt('2026-11-07T00:00:05Z', context);

    expect(context.scheduler.cancelJob).toHaveBeenCalledWith('job-daily');
  });

  it('does not mark the series complete when the post fails, so the next run retries it', async () => {
    vi.useFakeTimers({ toFake: ['Date'] });
    const context = makeContext(new Map());
    context.reddit.submitPost.mockRejectedValueOnce(new Error('reddit unavailable'));

    await runJobAt('2026-11-07T00:00:05Z', context);
    expect(context.scheduler.cancelJob).not.toHaveBeenCalled();

    await runJobAt('2026-11-08T00:00:05Z', context);
    expect(context.reddit.submitPost).toHaveBeenCalledTimes(2);
    const retry = context.reddit.submitPost.mock.calls[1][0] as { title: string };
    expect(retry.title).toMatch(/series complete/i);
    expect(context.scheduler.cancelJob).toHaveBeenCalledWith('job-daily');
  });

  it('still posts the last puzzle normally on 2026-11-06', async () => {
    vi.useFakeTimers({ toFake: ['Date'] });
    const context = makeContext(new Map());

    await runJobAt('2026-11-06T00:00:05Z', context);

    expect(context.reddit.submitPost).toHaveBeenCalledTimes(1);
    const options = context.reddit.submitPost.mock.calls[0][0] as { title: string };
    expect(options.title).toBe(`Day ${LAST_DAY_NUMBER}: Can You Spot the Fake Verse?`);
    expect(context.scheduler.cancelJob).not.toHaveBeenCalled();
  });

  it('a gap BEFORE the last puzzle still sends the Missing Puzzle Alert and no series post', async () => {
    vi.useFakeTimers({ toFake: ['Date'] });
    const context = makeContext(new Map());

    await runJobAt('2026-05-01T00:00:05Z', context);

    expect(context.reddit.submitPost).not.toHaveBeenCalled();
    expect(modmailSubjects(context)).toEqual(['[Scripture Sleuth] Missing Puzzle Alert']);
    expect(context.scheduler.cancelJob).not.toHaveBeenCalled();
  });
});
