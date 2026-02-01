# Task 007: Create GameScreen with Puzzle Display

## Metadata
| Field | Value |
|-------|-------|
| **ID** | 007 |
| **Status** | done |
| **Branch** | task/007 |
| **Assigned** | task/007 |
| **Depends** | 005, 006 |
| **Blocked-By** | |
| **Estimated** | 45 min |

## Inputs
- src/hooks/useGameState.ts from task 005
- src/components/game/CommentCard.tsx from task 006
- comment-conspiracy-spec-v2.md (Section 2.2: Active Game Flow)

## Description
Create the main game screen that shows the daily puzzle. This includes:
- Header with day number, day of week, difficulty
- Prompt card showing the question
- List of 5 CommentCard components
- Warning text about one guess only

The screen should use the game state hook and handle comment selection.

## Acceptance Criteria
- [x] src/components/screens/GameScreen.tsx created
- [x] Header shows: "DAY {n} • {dayOfWeek} • {difficulty}"
- [x] Prompt displayed prominently
- [x] 5 CommentCards rendered in shuffled order
- [x] Tapping a card triggers selection (highlights it)
- [x] Warning text: "Choose carefully - you only get one guess!"
- [x] Integrates with useGameState hook via props

## Context Files
- comment-conspiracy-spec-v2.md (Section 2.2: Active Game Flow)
- src/hooks/useGameState.ts
- src/components/game/CommentCard.tsx

## Outputs
- Created: src/components/screens/GameScreen.tsx
- Modified: none
- Decisions: none

---

## Work Log

### 2026-01-18 - Complete
Created GameScreen component with:

Layout:
- Header with day number, day of week, difficulty (styled gradient underline)
- Prompt card showing source subreddit and question
- Scrollable list of 5 CommentCards
- Warning text
- "Lock In Your Answer" button (appears when comment selected)

Props interface allows parent component to control:
- puzzle data
- selectedIndex state
- onSelectComment callback
- onConfirmGuess callback
- disabled state

Uses CommentCard component from task 006.
