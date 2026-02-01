# Task 002: Create Core Type Definitions

## Metadata
| Field | Value |
|-------|-------|
| **ID** | 002 |
| **Status** | done |
| **Branch** | task/002 |
| **Assigned** | task/002 |
| **Depends** | 001 |
| **Blocked-By** | |
| **Estimated** | 30 min |

## Inputs
- sample_puzzles_week01.json (data structure reference)
- comment-conspiracy-spec-v2.md (Section 4.13: Puzzle JSON Schema, Section 6: Scoring)

## Description
Define TypeScript interfaces for all core data types. These types are the contract between all components and services.

Create types for:
- Puzzle, Comment (puzzle data structure)
- UserProgress (streaks, accuracy, history)
- GameState (NEW_USER, PLAYING, CONFIRMING, RESULT_CORRECT, RESULT_INCORRECT, COMPLETED)
- GuessResult (what gets returned after a guess)
- DailyStats (aggregate statistics)
- Difficulty, DayOfWeek, Category (enums/unions)

## Acceptance Criteria
- [x] src/types/puzzle.ts with Puzzle, Comment interfaces
- [x] src/types/user.ts with UserProgress, DayResult interfaces
- [x] src/types/game.ts with GameState enum, GuessResult interface
- [x] src/types/index.ts re-exports all types
- [x] Types match the sample_puzzles_week01.json structure exactly

## Context Files
- comment-conspiracy-spec-v2.md (Section 4.13, Section 6)
- sample_puzzles_week01.json

## Outputs
- Created: src/types/puzzle.ts, src/types/user.ts, src/types/game.ts
- Modified: src/types/index.ts
- Decisions: none

---

## Work Log

### 2026-01-18 - Started
Analyzed spec Section 10 (Data Models) and sample_puzzles_week01.json for type structure.

### 2026-01-18 - Complete
Created comprehensive type definitions:
- puzzle.ts: Difficulty, DayOfWeek, Category, Comment, Puzzle, DisplayComment, ShuffledPuzzle, PuzzleStats
- user.ts: UserProgress, DayResult, UserGuess, Achievement, DifficultyStats
- game.ts: GameState union type, GuessResult, GameContext, GameAction reducer types
- index.ts: Re-exports all types for clean imports

Types match sample JSON structure exactly and include both stored (with isAI) and display (without isAI) variants.
