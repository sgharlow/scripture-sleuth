# Task 018: Share Card Generation

## Metadata
| Field | Value |
|-------|-------|
| **ID** | 018 |
| **Status** | done |
| **Branch** | task/018 |
| **Assigned** | |
| **Depends** | 009 |
| **Blocked-By** | |
| **Estimated** | 30 min |

## Inputs
- src/components/screens/ResultScreen.tsx from task 009
- comment-conspiracy-spec-v2.md (Section 7.3: Share Card System)

## Description
Create the shareable result card that users can copy/share. Must be spoiler-free (doesn't reveal which comment was AI).

Share text format:
```
🔍 Comment Conspiracy Day {n}

✅ 1/1  (or ❌ 0/1)
🔥 {streak}-day streak  (if streak > 0)

r/CommentConspiracy
```

The component should show:
- Preview of the share text
- Copy button (copies to clipboard)
- Share button (if Web Share API available)

## Acceptance Criteria
- [x] src/components/results/ShareCard.tsx created
- [x] src/utils/shareUtils.ts with generateShareText()
- [x] Copy button copies text to clipboard
- [x] Share button uses navigator.share if available
- [x] Proper visual styling (dark card with monospace text)
- [x] No spoilers in share text

## Context Files
- comment-conspiracy-spec-v2.md (Section 7.3, Section 12.4: ShareCard Component Spec)

## Outputs
- Created: src/components/results/ShareCard.tsx, src/utils/shareUtils.ts
- Modified: src/components/screens/ResultScreen.tsx (integrate ShareCard)
- Decisions: Copy button shows feedback state (copied/error), Share only shown if Web Share API available

---

## Work Log
<!-- Append progress here while working -->
