# Task 019: Loading States and Error Handling

## Metadata
| Field | Value |
|-------|-------|
| **ID** | 019 |
| **Status** | done |
| **Branch** | task/019 |
| **Assigned** | |
| **Depends** | 014 |
| **Blocked-By** | |
| **Estimated** | 30 min |

## Inputs
- src/components/App.tsx from task 014
- comment-conspiracy-spec-v2.md (Section 14: Edge Cases & Error Handling)

## Description
Add proper loading states and error handling throughout the app.

Loading states:
- Initial load: Show spinner/skeleton while fetching puzzle
- Submit guess: Show loading indicator during submission
- Share: Show feedback after copy/share action

Error states:
- Network error: "Couldn't reach the server. Try again."
- Puzzle missing: "Today's puzzle isn't available yet."
- Submit failed: "Couldn't record your guess. Try again."

Also add retry logic for transient failures.

## Acceptance Criteria
- [x] src/components/shared/LoadingSpinner.tsx created
- [x] src/components/shared/ErrorState.tsx created
- [x] Loading state shown during initial fetch
- [x] Error state shown with retry button on failure
- [x] Submit button shows loading during guess submission
- [x] Toast/feedback for copy success (via ShareCard)

## Context Files
- comment-conspiracy-spec-v2.md (Section 14: Edge Cases & Error Handling)

## Outputs
- Created: src/components/shared/LoadingSpinner.tsx, src/components/shared/ErrorState.tsx
- Modified: src/components/App.tsx
- Decisions: Created reusable components with variants (FullPage, Inline)

---

## Work Log
<!-- Append progress here while working -->
