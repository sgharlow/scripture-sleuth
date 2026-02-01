# Task 010: Create CompletedScreen

## Metadata
| Field | Value |
|-------|-------|
| **ID** | 010 |
| **Status** | done |
| **Branch** | task/010 |
| **Assigned** | task/010 |
| **Depends** | 005, 009 |
| **Blocked-By** | |
| **Estimated** | 30 min |

## Inputs
- src/hooks/useGameState.ts from task 005
- src/components/results/*.tsx from task 009
- comment-conspiracy-spec-v2.md (Section 2.6: Already Played State)

## Description
Create the screen shown when a user returns after already playing today. Shows their result and community stats.

Shows:
- "YOU'VE PLAYED TODAY" banner
- Their answer and whether it was correct
- Current streak
- Today's community stats (total players, % correct, guess distribution)
- Countdown timer to next puzzle
- Action buttons (View Breakdown, Discuss)

## Acceptance Criteria
- [x] src/components/screens/CompletedScreen.tsx created
- [x] Shows user's previous answer for today
- [x] Displays community stats panel
- [x] Countdown timer to midnight UTC (next puzzle)
- [x] Reuses StatsPanel from task 009
- [x] Action buttons for engagement

## Context Files
- comment-conspiracy-spec-v2.md (Section 2.6: Already Played State)
- src/components/results/StatsPanel.tsx

## Outputs
- Created: src/components/screens/CompletedScreen.tsx, src/components/shared/Timer.tsx
- Modified: none
- Decisions: none

---

## Work Log

### 2026-01-18 - Complete
Created completed screen components:

Timer.tsx:
- Countdown to midnight UTC
- Updates every second
- HH:MM:SS format with leading zeros

CompletedScreen.tsx:
- "You've Played Today" banner
- User's answer and correct/incorrect indicator
- Current streak display
- Community stats via StatsPanel
- Dark theme countdown section
- Action buttons for breakdown/discussion
