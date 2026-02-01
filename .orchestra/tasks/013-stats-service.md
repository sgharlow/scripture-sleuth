# Task 013: Implement statsService

## Metadata
| Field | Value |
|-------|-------|
| **ID** | 013 |
| **Status** | done |
| **Branch** | task/013 |
| **Assigned** | |
| **Depends** | 003 |
| **Blocked-By** | |
| **Estimated** | 30 min |

## Inputs
- src/services/redisService.ts from task 003
- src/types/game.ts from task 002

## Description
Create the stats service that records and aggregates daily puzzle statistics.

Functions:
- recordGuess(puzzleId, guessIndex, wasCorrect): Increment counters
- getPuzzleStats(puzzleId): Get current stats for a puzzle
- calculatePercentile(puzzleId, wasCorrect): Where user ranks

Stats tracked per puzzle:
- totalPlayers: number
- correctCount: number
- guessDistribution: [count for each comment index 0-4]
- (optional) averageGuessTime

## Acceptance Criteria
- [x] src/services/statsService.ts created
- [x] recordGuess() atomically increments counters
- [x] getPuzzleStats() returns PuzzleStats object
- [x] calculatePercentile() returns percentile number (formatPercentile for string)
- [x] Stats properly initialized when first guess recorded

## Context Files
- comment-conspiracy-spec-v2.md (Section 7.4: Daily Stats Display)

## Outputs
- Created: src/services/statsService.ts
- Modified: None
- Decisions: Added helper functions for display (formatPercentile, getDistributionPercentages, getSummaryStats)

---

## Work Log
<!-- Append progress here while working -->
