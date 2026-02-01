# Task 012: Implement userService

## Metadata
| Field | Value |
|-------|-------|
| **ID** | 012 |
| **Status** | done |
| **Branch** | task/012 |
| **Assigned** | |
| **Depends** | 003 |
| **Blocked-By** | |
| **Estimated** | 30 min |

## Inputs
- src/services/redisService.ts from task 003
- src/types/user.ts from task 002

## Description
Create the user service that manages user progress, streaks, and history.

Functions:
- getUserProgress(userId): Get or create user progress record
- updateProgress(userId, wasCorrect, difficulty): Update after a guess
- getHistory(userId, limit?): Get recent game history
- calculateStreak(lastPlayed, wasCorrect): Streak calculation logic

Streak Rules:
- Correct + consecutive day = streak + 1
- Correct + missed day(s) = streak reset to 1
- Incorrect = streak reset to 0

## Acceptance Criteria
- [x] src/services/userService.ts created
- [x] getUserProgress() returns UserProgress, creates if new user
- [x] updateProgress() correctly updates streak, accuracy, totals
- [x] Streak calculation follows spec rules
- [x] History limited to last 30 days
- [x] All timestamps use UTC

## Context Files
- comment-conspiracy-spec-v2.md (Section 6: Scoring & Progression)
- .orchestra/DECISIONS.md (DEC-002: Server-Side Streak Tracking)

## Outputs
- Created: src/services/userService.ts
- Modified: None
- Decisions: Added helper functions for streak status checks (isHotStreak, isStreakAtRisk)

---

## Work Log
<!-- Append progress here while working -->
