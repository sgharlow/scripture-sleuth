# Task 008: Create ConfirmModal Component

## Metadata
| Field | Value |
|-------|-------|
| **ID** | 008 |
| **Status** | done |
| **Branch** | task/008 |
| **Assigned** | task/008 |
| **Depends** | 005, 006 |
| **Blocked-By** | |
| **Estimated** | 20 min |

## Inputs
- src/hooks/useGameState.ts from task 005
- comment-conspiracy-spec-v2.md (Section 2.3: Confirmation Modal)

## Description
Create the modal that appears when a user selects a comment, asking them to confirm their guess. This is a critical UX moment that prevents accidental submissions.

Shows:
- "You selected Comment #X:"
- Preview of the selected comment text (truncated)
- "Is this your final answer?"
- Cancel button (returns to PLAYING state)
- Confirm button (submits guess)

## Acceptance Criteria
- [x] src/components/game/ConfirmModal.tsx created
- [x] Modal overlays the game screen
- [x] Shows selected comment number and preview
- [x] Cancel button calls onCancel
- [x] Confirm button calls onConfirm
- [x] Touch-friendly button sizes (py-4 = 56px+ height)
- [x] Accessible (focus trap, escape key to cancel)

## Context Files
- comment-conspiracy-spec-v2.md (Section 2.3: Confirmation Modal)
- src/hooks/useGameState.ts

## Outputs
- Created: src/components/game/ConfirmModal.tsx
- Modified: none
- Decisions: none

---

## Work Log

### 2026-01-18 - Complete
Created ConfirmModal with:
- Dark overlay backdrop (click to cancel)
- Centered modal with title, comment preview, question
- Truncated comment text (100 chars)
- Cancel and Confirm buttons
- Focus trap (Tab/Shift+Tab cycles within modal)
- Escape key closes modal
- isSubmitting state for loading feedback
- Auto-focus on confirm button when opened
