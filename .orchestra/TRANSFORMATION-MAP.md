# Transformation Map

**Source Repo:** comment-conspiracy
**Target Repo:** scripture-sleuth
**Generated:** 2026-01-31 23:02

---

## File Categories

### A. Copy As-Is (No Changes)

| File | Reason |
|------|--------|
| `tsconfig.json` | Build config unchanged |
| `vitest.config.ts` | Test config unchanged |
| `scripts/build-webview.cjs` | Build script unchanged |
| `.gitignore` | Same ignores needed |
| `.eslintrc.json` | Lint config unchanged |

### B. Delete (Not Needed)

| File/Folder | Reason |
|-------------|--------|
| `.orchestra/` (old) | Will recreate with new state |
| `archive/` | Source-specific archived files |
| `screenshots/` | Old game screenshots |
| `STATUS_REPORT.md` | Source-specific status |
| `TODO.md` | Source-specific todos |
| `walkthrough/` | Source-specific demo |

### C. Content Update Only

| File | Type of Changes |
|------|-----------------|
| `package.json` | name → scripture-sleuth, description |
| `devvit.yaml` | name → scripture-sleuth |
| `README.md` | Complete rewrite for new game |
| `CLAUDE.md` | Complete rewrite for new game |

### D. Type Definitions

| Source File | Changes |
|------------|---------|
| `src/types/puzzle.ts` | Comment→Verse, isAI→isFake, add reference/translation/linkedSubreddit |
| `src/types/game.ts` | Update type references |
| `src/types/user.ts` | Minimal - update achievement descriptions |
| `src/types/messages.ts` | Update type references |
| `src/types/contribution.ts` | Update for verse contributions |
| `src/types/index.ts` | Update export names |

### E. Services

| Source File | Changes |
|------------|---------|
| `src/services/puzzleService.ts` | Type refs, field names (comment→verse) |
| `src/services/redisKeys.ts` | Same patterns, same keys |
| `src/services/bootstrapService.ts` | Update for verse puzzle format |
| `src/services/userService.ts` | Minimal - type refs |
| `src/services/achievementService.ts` | Update achievement text/descriptions |
| `src/services/statsService.ts` | Type refs |
| `src/services/leaderboardService.ts` | Minimal |
| `src/services/contributionService.ts` | Update for verse contributions |
| `src/services/inventoryService.ts` | Type refs |
| `src/services/redisService.ts` | No changes |

### F. Utilities

| Source File | Changes |
|------------|---------|
| `src/utils/shuffleUtils.ts` | Update field refs (comment→verse) |
| `src/utils/shareUtils.ts` | New share text format for verses |
| `src/utils/leaderboardUtils.ts` | Minimal |

### G. Components

| Source File | Target File | Changes |
|------------|-------------|---------|
| `src/components/App.tsx` | Same | Types, state names, theme |
| `src/components/screens/WelcomeScreen.tsx` | Same | Theme, copy, imagery |
| `src/components/screens/GameScreen.tsx` | Same | Layout for verses |
| `src/components/screens/ResultScreen.tsx` | Same | Subreddit connections reveal |
| `src/components/screens/CompletedScreen.tsx` | Same | Theme, copy |
| `src/components/game/CommentCard.tsx` | `VerseCard.tsx` | Rename + full redesign |
| `src/components/game/ConfirmModal.tsx` | Same | Theme, copy |
| `src/components/results/AIExplanation.tsx` | `FakeExplanation.tsx` | Rename + content |
| `src/components/results/ResultBanner.tsx` | Same | Theme |
| `src/components/results/StatsPanel.tsx` | Same | Labels |
| `src/components/results/ShareCard.tsx` | Same | Format |
| `src/components/results/Leaderboard.tsx` | Same | Minimal |
| `src/components/results/AchievementToast.tsx` | Same | Minimal |
| `src/components/shared/LoadingSpinner.tsx` | Same | Theme colors |
| `src/components/shared/Timer.tsx` | Same | Theme |
| `src/components/shared/ErrorState.tsx` | Same | Theme |
| `src/components/contributions/*` | Same | Update for verses |

### H. Styling

| Source File | Changes |
|------------|---------|
| `tailwind.config.js` | Complete color palette change |

### I. Content Data

| Source | Target | Changes |
|--------|--------|---------|
| `src/data/bootstrap/week*.json` | New content | Complete replacement |
| `src/data/bootstrap/puzzleData.test.ts` | Same | Update for verse schema |

### J. Entry Points

| Source File | Changes |
|------------|---------|
| `src/main.tsx` | Type names in messages |
| `src/web/index.tsx` | None |
| `src/webview/index.tsx` | None |
| `src/scheduler/dailyPuzzle.tsx` | Minimal - type refs |

---

## Search & Replace Patterns

Execute in this order:

| Find | Replace | Scope | Notes |
|------|---------|-------|-------|
| `Comment` (type) | `Verse` | Types, components | Interface name |
| `comment` (var) | `verse` | All files | Variable names |
| `comments` | `verses` | All files | Array names |
| `isAI` | `isFake` | All files | Boolean flag |
| `aiCommentIndex` | `fakeVerseIndex` | All files | Index field |
| `AI` (display) | `Fake` | Components | User-facing text |
| `comment-conspire` | `scripture-sleuth` | Config files | Package name |
| `Comment Conspiracy` | `Scripture Sleuth` | Display text | Game title |
| `CommentCard` | `VerseCard` | Components | Component name |
| `AIExplanation` | `FakeExplanation` | Components | Component name |

---

## Transformation Order

Execute in this order to minimize errors:

### Phase 1 - Foundation
1. package.json
2. devvit.yaml
3. README.md
4. CLAUDE.md

### Phase 2 - Types (all together)
1. src/types/puzzle.ts
2. src/types/game.ts
3. src/types/user.ts
4. src/types/messages.ts
5. src/types/contribution.ts
6. src/types/index.ts

### Phase 3 - Services
1. src/services/redisKeys.ts (no deps)
2. src/services/redisService.ts
3. src/services/puzzleService.ts
4. src/services/bootstrapService.ts
5. src/services/userService.ts
6. src/services/achievementService.ts
7. src/services/statsService.ts
8. src/services/leaderboardService.ts
9. src/services/contributionService.ts
10. src/services/inventoryService.ts
11. src/utils/shuffleUtils.ts
12. src/utils/shareUtils.ts
13. src/utils/leaderboardUtils.ts

### Phase 4 - UI
1. tailwind.config.js (colors first)
2. src/components/shared/* (base components)
3. Rename CommentCard.tsx → VerseCard.tsx
4. Rename AIExplanation.tsx → FakeExplanation.tsx
5. src/components/game/*
6. src/components/results/*
7. src/components/screens/*
8. src/components/contributions/*
9. src/components/App.tsx
10. src/main.tsx

### Phase 5 - Content
1. Create week01.json with verse format
2. Update puzzleData.test.ts

### Phase 6 - Verification
1. npm run typecheck
2. npm run lint
3. npm run test
4. npm run build

---

## New Fields to Add

### Verse Type (replaces Comment)
```typescript
interface Verse {
  id: string;
  text: string;
  reference: string;        // NEW: e.g., "Matthew 7:1"
  translation: string;      // NEW: e.g., "KJV"
  linkedSubreddit?: string; // NEW: Only real verses
  isFake: boolean;          // Renamed from isAI
}
```

### Puzzle Type Updates
```typescript
interface Puzzle {
  theme: string;           // NEW: replaces prompt.text
  verses: Verse[];         // Renamed from comments
  fakeVerseIndex: number;  // Renamed from aiCommentIndex
  explanation: {
    whyFake: string[];     // Renamed from aiTells
    connections: string[]; // NEW: subreddit explanations
    // Keep humanTells? Rename to whyReal?
  };
}
```

---

## Dependency Graph

```
package.json ─┐
devvit.yaml  ─┼─> (no deps, do first)
README.md    ─┘

types/puzzle.ts ─┐
types/game.ts   ─┼─> (core types, do together)
types/user.ts   ─┤
types/messages.ts┘

services/* ─────> (depend on types)

utils/* ────────> (depend on types)

components/* ───> (depend on types + services)

data/bootstrap/* ─> (depend on types for structure)

main.tsx ───────> (depends on everything)
```
