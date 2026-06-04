# Scripture Sleuth

Daily Reddit game where players identify the fake Bible verse among 5 options. Built for the Reddit Games & Puzzles Hackathon 2026.

## Tech Stack

- **Platform**: Reddit Devvit (developer.reddit.com)
- **Frontend**: React 18 + TypeScript 5.x + Tailwind CSS (via Devvit WebView)
- **Backend**: Devvit Redis for persistence, Devvit Scheduler for daily puzzle posting
- **Build**: esbuild for webview bundling
- **Testing**: Vitest

## Project Structure

```
scripture-sleuth/
├── devvit.yaml              # Devvit app config (name, version, capabilities)
├── package.json             # @devvit/public-api ^0.12.18
├── src/
│   ├── main.tsx             # Devvit entry: WebView host, message handlers, triggers
│   ├── types/               # TypeScript definitions
│   │   ├── puzzle.ts        # Puzzle, Verse, Difficulty, ShuffledPuzzle
│   │   ├── user.ts          # UserProgress, UserGuess, Achievement
│   │   ├── game.ts          # GameState, GuessResult, GameAction
│   │   ├── messages.ts      # WebView <-> Devvit message types
│   │   └── contribution.ts  # User contribution types
│   ├── components/
│   │   ├── App.tsx          # Main React app, state machine, message handling
│   │   ├── screens/         # WelcomeScreen, GameScreen, ResultScreen, CompletedScreen
│   │   ├── game/            # VerseCard, ConfirmModal
│   │   ├── results/         # ResultBanner, FakeExplanation, StatsPanel, ShareCard
│   │   ├── contributions/   # ContributeScreen, ContributionForm
│   │   └── shared/          # LoadingSpinner, Timer, ErrorState
│   ├── hooks/
│   │   └── useGameState.ts  # Game state reducer
│   ├── services/
│   │   ├── puzzleService.ts     # getTodaysPuzzle, submitGuess, getPreviousResult
│   │   ├── redisService.ts      # Low-level Redis operations
│   │   ├── redisKeys.ts         # Redis key schema
│   │   ├── bootstrapService.ts  # Loads puzzles from JSON into Redis
│   │   ├── userService.ts       # User progress management
│   │   ├── achievementService.ts# Achievement checking/awarding
│   │   ├── contributionService.ts# User-submitted puzzle ideas
│   │   └── inventoryService.ts  # Puzzle inventory health checks
│   ├── scheduler/
│   │   └── dailyPuzzle.tsx  # Cron job: posts new puzzle at midnight UTC
│   ├── utils/
│   │   ├── shuffleUtils.ts  # Deterministic shuffle (userId:puzzleId seed)
│   │   ├── shareUtils.ts    # Generate share text
│   │   └── leaderboardUtils.ts
│   ├── data/bootstrap/
│   │   └── week*.json       # Curated verse puzzles
│   └── web/
│       └── index.tsx        # WebView React entry
├── webroot/                 # Built webview assets (index.html, bundle.js)
└── scripts/
    └── build-webview.cjs    # esbuild script for webview
```

## Development

```bash
npm install           # Install dependencies
npm run dev           # Start Devvit playtest
npm run build         # Build webview + devvit
npm run upload        # Deploy to Reddit
npm run test          # Run Vitest tests
npm run typecheck     # TypeScript check
npm run lint          # ESLint check
```

## Architecture

### Message Flow
1. WebView sends `INIT` on load
2. Devvit host fetches puzzle from Redis, shuffles for user, responds with `INIT_RESPONSE`
3. User selects verse, confirms guess
4. WebView sends `SUBMIT_GUESS` with guessIndex
5. Devvit validates, updates streak/stats, responds with `GUESS_RESPONSE`

### Key Patterns
- **Shuffling**: Verses are deterministically shuffled per-user using `hashSeed(userId:puzzleId)`. Fake index hidden until guess.
- **Idempotent Guesses**: `submitGuess` checks for existing guess first, returns cached result.
- **Streak Logic**: Consecutive correct answers, resets on wrong or missed day. Uses UTC dates.
- **Lazy Bootstrap**: Puzzles seeded into Redis on first request if empty.

### Redis Keys
- `puzzle:{YYYY-MM-DD}` - Puzzle JSON
- `puzzle:current` - Today's puzzle ID
- `puzzle:index` - Array of all puzzle IDs (stored as JSON string)
- `user:{userId}:progress` - UserProgress JSON
- `user:{userId}:guess:{puzzleId}` - UserGuess JSON
- `stats:{puzzleId}` - PuzzleStats hash
- `leaderboard:streaks` - Sorted set
- `leaderboard:accuracy` - Sorted set

### Game Rules
- One guess per day (no retries)
- 24-hour puzzle window (midnight UTC reset)
- Difficulty: Monday (easy) -> Friday (hard) -> Weekend (expert)
- 8 achievements: first_correct, streak_3/7/30, perfect_week, hard_mode, veteran, sharp_eye

### Theme: Parchment/Scripture
- Background: #faf3e3 (parchment)
- Primary: #722f37 (burgundy)
- Accent: #c9a227 (gold)
- Font: Georgia, serif for verses

## Subreddit Connection Feature

Each real verse maps to a thematically-connected subreddit:
- "Love your neighbor" -> r/HumansBeingBros
- "Judge not" -> r/AmItheAsshole
- "Pride goes before destruction" -> r/WinStupidPrizes

Revealed after guessing for educational value and humor.

## Testing

Tests located in `src/**/*.test.ts`:
- `puzzleData.test.ts` - Validates puzzle JSON format
- `shuffleUtils.test.ts` - Deterministic shuffle verification
- `shareUtils.test.ts` - Share text generation
- `achievementService.test.ts` - Achievement logic

3,133 tests across 6 test files (VERIFIED via `npm run test` on 2026-06-03). `allWeeks.test.ts` is a disk-reading full-inventory validator that auto-covers new week files. Run with `npm run test` or `npm run test:watch`.

**Puzzle content (2026-06-03):** 219 puzzles through 2026-11-06 (weeks 01-33). The never-served 2026-05-25..06-03 "dry window" puzzles (the 5-24 extension was committed but never uploaded) were re-dated +126 days to 9-28..10-07 (weeks 28-29, `scripts/redate-dry-window-2026-06-03.mjs`), and 30 new puzzles added for 10-08..11-06 (weeks 29-33; KJV-verbatim audited, zero real-verse reuse vs the prior corpus). Deployed + installed on r/ScriptureSleuth same day.

---

*Forked from Comment Conspiracy*
