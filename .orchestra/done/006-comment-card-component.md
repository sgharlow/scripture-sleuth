# Task 006: Create CommentCard Component

## Metadata
| Field | Value |
|-------|-------|
| **ID** | 006 |
| **Status** | done |
| **Branch** | task/006 |
| **Assigned** | task/006 |
| **Depends** | 001, 002 |
| **Blocked-By** | |
| **Estimated** | 30 min |

## Inputs
- src/types/puzzle.ts from task 002
- comment-conspiracy-spec-v2.md (Section 12: UI Component Specifications)

## Description
Create the CommentCard component that displays a single comment with its fake username. This is the primary interactive element of the game.

Visual States:
1. DEFAULT - Gray border, white background
2. HOVER - Light blue border, slight shadow (on desktop)
3. SELECTED - Blue border, blue tint background
4. REVEALED_AI - Red border, red tint + 🤖 badge
5. REVEALED_HUMAN - Gray, slightly faded
6. DISABLED - Opacity 0.5, no interactions

Props:
- comment: DisplayComment
- isSelected: boolean
- isRevealed: boolean
- isAI?: boolean (only set after reveal)
- onSelect: (id: string) => void
- disabled?: boolean

## Acceptance Criteria
- [x] src/components/game/CommentCard.tsx created
- [x] Shows comment number, username (u/...), and text
- [x] All 6 visual states implemented with Tailwind
- [x] Touch-friendly (min 44px tap target, min-h-[88px])
- [x] Accessible (button role, proper labels, keyboard support)

## Context Files
- comment-conspiracy-spec-v2.md (Section 12.2: CommentCard Component Spec)

## Outputs
- Created: src/components/game/CommentCard.tsx
- Modified: none
- Decisions: none

---

## Work Log

### 2026-01-18 - Complete
Created CommentCard React component with:

Visual states (Tailwind classes):
- default: gray border, white bg, hover effects
- selected: blue border, blue tint
- revealed_ai: red border, red tint + 🤖 badge
- revealed_human: gray, faded
- disabled: low opacity, no interactions

Features:
- Comment number badge (top-left)
- AI badge (top-right, on reveal)
- Correct guess indicator
- Username display (u/...)
- Selection indicator
- Keyboard navigation (Enter/Space)
- ARIA attributes for accessibility
