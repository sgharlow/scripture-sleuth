# Task 015: Create Scheduler Job for Daily Posting

## Metadata
| Field | Value |
|-------|-------|
| **ID** | 015 |
| **Status** | done |
| **Branch** | task/015 |
| **Assigned** | |
| **Depends** | 011 |
| **Blocked-By** | |
| **Estimated** | 45 min |

## Inputs
- src/services/puzzleService.ts from task 011
- comment-conspiracy-spec-v2.md (Section 4.5: Content Calendar)

## Description
Create the Devvit scheduler job that posts a new puzzle every day at midnight UTC.

The scheduler should:
1. Get today's date (UTC)
2. Fetch today's puzzle from Redis
3. Create a new Reddit post with the puzzle content
4. Update puzzle:current pointer
5. Initialize daily stats

If no puzzle exists for today, send alert to mod queue.

Also set up the AppInstall trigger to register the scheduled job.

## Acceptance Criteria
- [x] src/scheduler/dailyPuzzle.ts created
- [x] Scheduler job registered with cron "0 0 * * *" (midnight UTC)
- [x] Creates Reddit post with title "Day {n}: Can you spot the AI comment?"
- [x] Post contains the embedded game (Devvit custom post)
- [x] Updates puzzle:current on success
- [x] Initializes stats:{puzzleId} with zero counts
- [x] Handles missing puzzle gracefully (logs error, notifies)

## Context Files
- comment-conspiracy-spec-v2.md (Section 4.5.1: How the Scheduler Works)
- Devvit scheduler documentation

## Outputs
- Created: src/scheduler/dailyPuzzle.ts
- Modified: src/main.tsx (register scheduler, add triggers)
- Decisions: Added AppInstall and AppUpgrade triggers for automatic job scheduling

---

## Work Log
<!-- Append progress here while working -->
