# Task 009: Create ResultScreen

## Metadata
| Field | Value |
|-------|-------|
| **ID** | 009 |
| **Status** | done |
| **Branch** | task/009 |
| **Assigned** | task/009 |
| **Depends** | 005, 006 |
| **Blocked-By** | |
| **Estimated** | 45 min |

## Inputs
- src/hooks/useGameState.ts from task 005
- comment-conspiracy-spec-v2.md (Section 2.4, 2.5: Result screens)

## Description
Create the result screen that shows after a user submits their guess. Has two variants:
1. RESULT_CORRECT - Celebration, streak update, top percentage
2. RESULT_INCORRECT - Explanation, streak reset

Both show:
- Result banner (correct/incorrect with emoji)
- AI Tells explanation (why the AI comment was detectable)
- Updated streak info
- Stats (percentage of players who got it right)
- Share card preview
- Action buttons (View Breakdown, Join Discussion)

## Acceptance Criteria
- [x] src/components/screens/ResultScreen.tsx created
- [x] Correct variant shows celebration (🎉), green styling
- [x] Incorrect variant shows (❌), red styling, also shows why user's pick was human
- [x] AIExplanation component shows bullet points of AI tells
- [x] Streak display with fire emoji if 3+ days
- [x] Stats panel shows % correct, player count
- [x] Share card component placeholder with Copy/Share buttons
- [x] Buttons for next actions

## Context Files
- comment-conspiracy-spec-v2.md (Section 2.4, 2.5: Result Screens)
- comment-conspiracy-spec-v2.md (Section 12.3: ResultBanner Component Spec)

## Outputs
- Created: src/components/screens/ResultScreen.tsx, src/components/results/ResultBanner.tsx, src/components/results/AIExplanation.tsx, src/components/results/StatsPanel.tsx
- Modified: none
- Decisions: none

---

## Work Log

### 2026-01-18 - Complete
Created result screen components:

ResultBanner.tsx:
- Correct variant: 🎉 green celebration
- Incorrect variant: ❌ red, shows both guessed and correct indices

AIExplanation.tsx:
- Shows AI tells as bullet list
- For incorrect: also shows why user's pick was human
- Optional difficulty note

StatsPanel.tsx:
- Streak display with 🔥 for 3+ days
- Reset notification if streak broken
- User percentile ranking
- Total players and correct percentage
- Guess distribution bar chart

ResultScreen.tsx:
- Composes all components
- Share card placeholder (dark theme)
- Action buttons for breakdown/discussion
