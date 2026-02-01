# Task 005: Build Game State Machine

## Metadata
| Field | Value |
|-------|-------|
| **ID** | 005 |
| **Status** | done |
| **Branch** | task/005 |
| **Assigned** | task/005 |
| **Depends** | 002 |
| **Blocked-By** | |
| **Estimated** | 45 min |

## Inputs
- src/types/game.ts from task 002
- comment-conspiracy-spec-v2.md (Section 2: User Experience Flow)

## Description
Create a React hook that manages the game state machine. This is the core logic that drives which screen the user sees.

States:
- LOADING - Fetching puzzle/user data
- NEW_USER - First time, show welcome screen
- PLAYING - Active puzzle, selecting comment
- CONFIRMING - User selected, showing confirmation modal
- RESULT_CORRECT - Correct guess, show celebration
- RESULT_INCORRECT - Wrong guess, show explanation
- COMPLETED - Already played today, show stats

Transitions:
- LOADING → NEW_USER (if first time) or PLAYING (if returning)
- LOADING → COMPLETED (if already played today)
- PLAYING → CONFIRMING (on comment tap)
- CONFIRMING → PLAYING (on cancel)
- CONFIRMING → RESULT_* (on confirm)
- RESULT_* → COMPLETED (automatic after viewing)

## Acceptance Criteria
- [x] src/hooks/useGameState.ts with full state machine
- [x] Hook returns: { state, puzzle, selectedComment, selectComment, confirmGuess, cancelConfirm, result }
- [x] All state transitions work correctly
- [x] Loading state properly detected and transitioned

## Context Files
- comment-conspiracy-spec-v2.md (Section 2: User Experience Flow)
- src/types/game.ts

## Outputs
- Created: src/hooks/useGameState.ts
- Modified: none
- Decisions: none

---

## Work Log

### 2026-01-18 - Complete
Created useGameState hook with useReducer pattern:

States: LOADING, NEW_USER, PLAYING, SELECTED, CONFIRMING, SUBMITTING, RESULT_CORRECT, RESULT_INCORRECT, COMPLETED, ERROR

Actions: startLoading, loadSuccess, loadAlreadyPlayed, loadError, startGame, selectComment, openConfirm, cancelConfirm, submitGuess, guessSuccess, guessError, reset

Derived state: isLoading, canSelect, canConfirm, hasResult

All state transitions enforced - actions only work from valid source states.
