# Task 004: Load Bootstrap Puzzles

## Metadata
| Field | Value |
|-------|-------|
| **ID** | 004 |
| **Status** | done |
| **Branch** | task/004 |
| **Assigned** | task/004 |
| **Depends** | 001, 002, 003 |
| **Blocked-By** | |
| **Estimated** | 30 min |

## Inputs
- sample_puzzles_week01.json
- src/services/redisService.ts from task 003

## Description
Create a mechanism to load the bootstrap puzzle data from the bundled JSON file into Redis. This ensures the game has puzzles available immediately for demo/judging.

Options:
1. Load on app install trigger
2. Load on first puzzle request if not present
3. Admin menu action to seed data

Implement option 2 (lazy loading) with a check-and-seed pattern. If puzzle:current is empty, seed all puzzles from the JSON file.

## Acceptance Criteria
- [x] src/data/bootstrap/week01.json contains the sample puzzles (copy from sample_puzzles_week01.json)
- [x] src/services/bootstrapService.ts with seedPuzzles() function
- [x] seedPuzzles() checks if puzzle:index is empty before seeding
- [x] All 7 puzzles from week01.json loaded with correct date keys
- [x] puzzle:index populated with all puzzle IDs

## Context Files
- sample_puzzles_week01.json
- src/services/redisService.ts
- .orchestra/DECISIONS.md (DEC-001: Use Pre-Generated Puzzles)

## Outputs
- Created: src/services/bootstrapService.ts
- Modified: none (week01.json already exists from task 001)
- Decisions: none

---

## Work Log

### 2026-01-18 - Complete
Created bootstrapService.ts with lazy loading pattern:
- isPuzzleDataSeeded(): Check if puzzles already in Redis
- seedPuzzles(): Load all puzzles, returns {seeded, count}
- ensurePuzzlesLoaded(): Idempotent helper for startup
- getBootstrapPuzzleDates(): List available dates
- getBootstrapPuzzle(): Direct access to bundled data

Uses JSON import from src/data/bootstrap/week01.json (7 puzzles).
Sets first available puzzle as current if today's date not found.
