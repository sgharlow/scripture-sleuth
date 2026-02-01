# Task 014: Wire Up Main App Component

## Metadata
| Field | Value |
|-------|-------|
| **ID** | 014 |
| **Status** | done |
| **Branch** | task/014 |
| **Assigned** | |
| **Depends** | 007, 008, 009, 010, 011, 012, 013 |
| **Blocked-By** | |
| **Estimated** | 45 min |

## Inputs
- All screen components from tasks 007-010
- All services from tasks 011-013
- src/hooks/useGameState.ts from task 005

## Description
Wire everything together in the main App component. This creates the complete game experience.

The App component should:
1. Initialize Devvit context
2. Get current user ID from Devvit
3. Use game state hook to manage state machine
4. Render appropriate screen based on state
5. Pass all necessary props and callbacks

Also create WelcomeScreen for first-time users (simple, can be inline).

## Acceptance Criteria
- [x] src/components/App.tsx fully wired up
- [x] src/components/screens/WelcomeScreen.tsx created
- [x] State machine drives screen rendering
- [x] All services integrated correctly
- [x] User can play through complete flow: Welcome → Game → Confirm → Result
- [x] Returning users see CompletedScreen if already played

## Context Files
- src/hooks/useGameState.ts
- src/components/screens/*.tsx
- src/services/*.ts

## Outputs
- Created: src/components/screens/WelcomeScreen.tsx, src/types/messages.ts, src/web/index.tsx
- Modified: src/components/App.tsx, src/main.tsx, webroot/index.html, src/types/index.ts
- Decisions: Using postMessage API for Devvit <-> WebView communication

---

## Work Log
<!-- Append progress here while working -->
