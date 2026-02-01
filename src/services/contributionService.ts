/**
 * Contribution Service for Comment Conspiracy
 * Handles user-submitted AI comment contributions
 */

import type { RedisContext } from './redisKeys';
import { REDIS_KEYS } from './redisKeys';
import type {
  ContributionSubmission,
  ContributionDisplay,
  ContributorStats,
  SubmitContributionRequest,
  ContributionFilter,
  ContributionStatus,
} from '../types';

/**
 * Generate a simple unique ID for contributions
 */
function generateContributionId(): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 8);
  return `contrib_${timestamp}_${random}`;
}

/**
 * Submit a new contribution
 */
export async function submitContribution(
  ctx: RedisContext,
  userId: string,
  username: string,
  request: SubmitContributionRequest
): Promise<ContributionSubmission> {
  const id = generateContributionId();
  const now = new Date().toISOString();

  const contribution: ContributionSubmission = {
    id,
    userId,
    username,
    createdAt: now,
    promptIdea: request.promptIdea,
    category: request.category,
    aiCommentText: request.aiCommentText,
    aiTells: request.aiTells,
    status: 'pending',
    upvotes: 0,
    downvotes: 0,
    voterIds: [],
  };

  // Store the contribution
  await ctx.redis.set(REDIS_KEYS.contribution(id), JSON.stringify(contribution));

  // Add to pending index
  const pendingIndex = await getContributionIndex(ctx, 'pending');
  pendingIndex.push(id);
  await ctx.redis.set(REDIS_KEYS.contributionIndex('pending'), JSON.stringify(pendingIndex));

  // Add to user's contributions
  const userContribs = await getUserContributionIds(ctx, userId);
  userContribs.push(id);
  await ctx.redis.set(REDIS_KEYS.userContributions(userId), JSON.stringify(userContribs));

  // Update contributor stats
  await updateContributorStats(ctx, userId, username, 'submit');

  console.log(`[Contributions] New contribution ${id} from ${username}`);
  return contribution;
}

/**
 * Get a contribution by ID
 */
export async function getContribution(
  ctx: RedisContext,
  contributionId: string
): Promise<ContributionSubmission | null> {
  const data = await ctx.redis.get(REDIS_KEYS.contribution(contributionId));
  if (!data) return null;
  return JSON.parse(data) as ContributionSubmission;
}

/**
 * Get contribution index by status
 */
async function getContributionIndex(
  ctx: RedisContext,
  status: ContributionStatus
): Promise<string[]> {
  const data = await ctx.redis.get(REDIS_KEYS.contributionIndex(status));
  if (!data) return [];
  try {
    return JSON.parse(data) as string[];
  } catch {
    return [];
  }
}

/**
 * Get user's contribution IDs
 */
async function getUserContributionIds(
  ctx: RedisContext,
  userId: string
): Promise<string[]> {
  const data = await ctx.redis.get(REDIS_KEYS.userContributions(userId));
  if (!data) return [];
  try {
    return JSON.parse(data) as string[];
  } catch {
    return [];
  }
}

/**
 * Vote on a contribution
 */
export async function voteOnContribution(
  ctx: RedisContext,
  userId: string,
  contributionId: string,
  vote: 'up' | 'down'
): Promise<{ success: boolean; error?: string; contribution?: ContributionDisplay }> {
  const contribution = await getContribution(ctx, contributionId);
  if (!contribution) {
    return { success: false, error: 'Contribution not found' };
  }

  // Check if user has already voted
  const existingVoteIndex = contribution.voterIds.indexOf(userId);
  const hadVoted = existingVoteIndex !== -1;

  // If user already voted, remove their previous vote first
  // (We store just the voter IDs, not the vote direction, so we can't change votes)
  if (hadVoted) {
    return { success: false, error: 'You have already voted on this contribution' };
  }

  // Apply the vote
  if (vote === 'up') {
    contribution.upvotes++;
  } else {
    contribution.downvotes++;
  }
  contribution.voterIds.push(userId);

  // Save the updated contribution
  await ctx.redis.set(REDIS_KEYS.contribution(contributionId), JSON.stringify(contribution));

  // Update the contributor's stats (upvote count)
  if (vote === 'up') {
    await updateContributorStats(ctx, contribution.userId, contribution.username, 'upvote');
  }

  console.log(`[Contributions] ${vote} vote on ${contributionId} by ${userId}`);

  return {
    success: true,
    contribution: toContributionDisplay(contribution, userId),
  };
}

/**
 * Get contributions with filters
 */
export async function getContributions(
  ctx: RedisContext,
  userId: string,
  filter: ContributionFilter
): Promise<ContributionDisplay[]> {
  const status = filter.status ?? 'pending';
  const limit = filter.limit ?? 20;
  const offset = filter.offset ?? 0;

  // Get contribution IDs for the status
  const contributionIds = await getContributionIndex(ctx, status);

  // Fetch all contributions
  const contributions: ContributionSubmission[] = [];
  for (const id of contributionIds) {
    const contrib = await getContribution(ctx, id);
    if (contrib) {
      // Filter by category if specified
      if (filter.category && contrib.category !== filter.category) {
        continue;
      }
      contributions.push(contrib);
    }
  }

  // Sort based on sortBy
  switch (filter.sortBy) {
    case 'popular':
      contributions.sort((a, b) => (b.upvotes - b.downvotes) - (a.upvotes - a.downvotes));
      break;
    case 'controversial':
      // Most total votes
      contributions.sort((a, b) => (b.upvotes + b.downvotes) - (a.upvotes + a.downvotes));
      break;
    case 'newest':
    default:
      contributions.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      break;
  }

  // Apply pagination
  const paginated = contributions.slice(offset, offset + limit);

  // Convert to display format
  return paginated.map(c => toContributionDisplay(c, userId));
}

/**
 * Get user's own contributions
 */
export async function getUserContributions(
  ctx: RedisContext,
  userId: string
): Promise<ContributionDisplay[]> {
  const contributionIds = await getUserContributionIds(ctx, userId);
  const contributions: ContributionDisplay[] = [];

  for (const id of contributionIds) {
    const contrib = await getContribution(ctx, id);
    if (contrib) {
      contributions.push(toContributionDisplay(contrib, userId));
    }
  }

  // Sort by newest first
  contributions.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  return contributions;
}

/**
 * Get contributor stats for a user
 */
export async function getContributorStats(
  ctx: RedisContext,
  userId: string
): Promise<ContributorStats | null> {
  const data = await ctx.redis.get(REDIS_KEYS.contributorStats(userId));
  if (!data) return null;
  return JSON.parse(data) as ContributorStats;
}

/**
 * Update contributor stats
 */
async function updateContributorStats(
  ctx: RedisContext,
  userId: string,
  username: string,
  action: 'submit' | 'approve' | 'use' | 'upvote'
): Promise<void> {
  let stats = await getContributorStats(ctx, userId);

  if (!stats) {
    stats = {
      userId,
      username,
      totalSubmissions: 0,
      approvedCount: 0,
      usedCount: 0,
      totalUpvotes: 0,
      contributorScore: 0,
    };
  }

  switch (action) {
    case 'submit':
      stats.totalSubmissions++;
      break;
    case 'approve':
      stats.approvedCount++;
      break;
    case 'use':
      stats.usedCount++;
      break;
    case 'upvote':
      stats.totalUpvotes++;
      break;
  }

  // Calculate contributor score:
  // - Each submission: 1 point
  // - Each approval: 5 points
  // - Each use in puzzle: 20 points
  // - Each upvote: 1 point
  stats.contributorScore =
    stats.totalSubmissions * 1 +
    stats.approvedCount * 5 +
    stats.usedCount * 20 +
    stats.totalUpvotes * 1;

  await ctx.redis.set(REDIS_KEYS.contributorStats(userId), JSON.stringify(stats));

  // Update leaderboard
  await ctx.redis.zAdd(REDIS_KEYS.contributorLeaderboard(), {
    score: stats.contributorScore,
    member: userId,
  });
}

/**
 * Get top contributors leaderboard
 */
export async function getTopContributors(
  ctx: RedisContext,
  limit: number = 10
): Promise<ContributorStats[]> {
  // Note: Devvit Redis doesn't have zRange with REV option easily
  // We'll use zRank to get top contributors differently
  // For now, we'll collect all stats and sort in-memory

  // Get all pending contributions to find unique contributors
  const pendingIds = await getContributionIndex(ctx, 'pending');
  const approvedIds = await getContributionIndex(ctx, 'approved');
  const allIds = [...pendingIds, ...approvedIds];

  const seenUserIds = new Set<string>();
  const contributorStatsList: ContributorStats[] = [];

  for (const id of allIds) {
    const contrib = await getContribution(ctx, id);
    if (contrib && !seenUserIds.has(contrib.userId)) {
      seenUserIds.add(contrib.userId);
      const stats = await getContributorStats(ctx, contrib.userId);
      if (stats) {
        contributorStatsList.push(stats);
      }
    }
  }

  // Sort by score descending
  contributorStatsList.sort((a, b) => b.contributorScore - a.contributorScore);

  return contributorStatsList.slice(0, limit);
}

/**
 * Get user's rank on contributor leaderboard
 */
export async function getContributorRank(
  ctx: RedisContext,
  userId: string
): Promise<{ rank: number; total: number } | null> {
  const rank = await ctx.redis.zRank(REDIS_KEYS.contributorLeaderboard(), userId);
  if (rank === undefined) return null;

  const total = await ctx.redis.zCard(REDIS_KEYS.contributorLeaderboard());
  // zRank returns 0-indexed, so actual rank is (total - rank) since we want highest score first
  return {
    rank: total - rank,
    total,
  };
}

/**
 * Convert full contribution to display format
 */
function toContributionDisplay(
  contribution: ContributionSubmission,
  viewerUserId: string
): ContributionDisplay {
  // Check if viewer has voted
  let userVote: 'up' | 'down' | null = null;
  if (contribution.voterIds.includes(viewerUserId)) {
    // We don't store vote direction, so we can't tell which way they voted
    // For simplicity, we'll just indicate they've voted by setting to 'up'
    // In a more complex system, we'd store votes separately
    userVote = 'up'; // Placeholder - they've voted but we don't know direction
  }

  return {
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
    userVote: contribution.voterIds.includes(viewerUserId) ? 'up' : null, // Simplified
    usedInPuzzleId: contribution.usedInPuzzleId,
  };
}

/**
 * Approve a contribution (moderator action)
 */
export async function approveContribution(
  ctx: RedisContext,
  contributionId: string,
  moderatorId: string,
  note?: string
): Promise<boolean> {
  const contribution = await getContribution(ctx, contributionId);
  if (!contribution || contribution.status !== 'pending') {
    return false;
  }

  // Update status
  contribution.status = 'approved';
  contribution.reviewedAt = new Date().toISOString();
  contribution.reviewedBy = moderatorId;
  if (note) contribution.moderatorNote = note;

  await ctx.redis.set(REDIS_KEYS.contribution(contributionId), JSON.stringify(contribution));

  // Move from pending to approved index
  const pendingIndex = await getContributionIndex(ctx, 'pending');
  const newPendingIndex = pendingIndex.filter(id => id !== contributionId);
  await ctx.redis.set(REDIS_KEYS.contributionIndex('pending'), JSON.stringify(newPendingIndex));

  const approvedIndex = await getContributionIndex(ctx, 'approved');
  approvedIndex.push(contributionId);
  await ctx.redis.set(REDIS_KEYS.contributionIndex('approved'), JSON.stringify(approvedIndex));

  // Update contributor stats
  await updateContributorStats(ctx, contribution.userId, contribution.username, 'approve');

  console.log(`[Contributions] Approved ${contributionId}`);
  return true;
}

/**
 * Reject a contribution (moderator action)
 */
export async function rejectContribution(
  ctx: RedisContext,
  contributionId: string,
  moderatorId: string,
  note?: string
): Promise<boolean> {
  const contribution = await getContribution(ctx, contributionId);
  if (!contribution || contribution.status !== 'pending') {
    return false;
  }

  // Update status
  contribution.status = 'rejected';
  contribution.reviewedAt = new Date().toISOString();
  contribution.reviewedBy = moderatorId;
  if (note) contribution.moderatorNote = note;

  await ctx.redis.set(REDIS_KEYS.contribution(contributionId), JSON.stringify(contribution));

  // Move from pending to rejected index
  const pendingIndex = await getContributionIndex(ctx, 'pending');
  const newPendingIndex = pendingIndex.filter(id => id !== contributionId);
  await ctx.redis.set(REDIS_KEYS.contributionIndex('pending'), JSON.stringify(newPendingIndex));

  const rejectedIndex = await getContributionIndex(ctx, 'rejected');
  rejectedIndex.push(contributionId);
  await ctx.redis.set(REDIS_KEYS.contributionIndex('rejected'), JSON.stringify(rejectedIndex));

  console.log(`[Contributions] Rejected ${contributionId}`);
  return true;
}
