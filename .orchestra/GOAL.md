# Goal: Win Reddit Daily Games Hackathon with Scripture Sleuth

## Description
Build **Scripture Sleuth** — a daily deduction game for Reddit where players identify which Bible verse among 5 is fake. The game posts a new puzzle daily, tracks player streaks, and drives community discussion through thematic subreddit connections.

This is a hackathon entry targeting three prizes:
- **Best Daily Game** ($15,000) — Primary target
- **Best Use of User Contributions** ($3,000)
- **Best Mobile Game Play** ($3,000)

**Deadline: February 12, 2026, 6:00 PM PST**

The app runs on the Reddit Devvit platform, using React for the UI, Redis for persistence, and a Scheduler for daily puzzle posting.

## Acceptance Criteria
- [x] Devvit app initializes and runs on a test subreddit
- [x] Daily puzzle displays with 5 verses (4 real scripture, 1 fake)
- [x] Users can select one verse as their guess (one guess per day)
- [x] Correct/incorrect result shown with fake verse explanation
- [x] Real verses reveal thematic subreddit connections
- [x] User streak and accuracy tracked persistently
- [x] Share card generated for results (spoiler-free)
- [x] Mobile-responsive UI that feels native on Reddit
- [x] Scheduler automatically posts new puzzle at midnight UTC
- [x] At least 7 pre-loaded puzzles for demo/judging period (126 puzzles loaded!)
- [ ] Deployed to r/ScriptureSleuth subreddit

## Launch Readiness (Updated 2026-02-01)
- [x] 60 days of puzzle content from launch date (126 puzzles = 4+ months)
- [ ] Deploy to r/ScriptureSleuth (production subreddit)
- [ ] Devpost submission completed
- [ ] Video demo recorded
- [ ] Screenshots captured
- [ ] Full playtest verification completed

## Scope

### In Scope (MVP for Hackathon)
- Core game loop: view puzzle → select guess → see result
- 5 game states: NEW_USER, PLAYING, CONFIRMING, RESULT, COMPLETED
- Streak tracking with reset on wrong answer or missed day
- Daily stats: total players, correct %, guess distribution
- Share card generation (text-based, no spoilers)
- Mobile-first responsive design
- Pre-generated puzzle JSON loading (126 puzzles bundled)
- Scheduler job for daily puzzle posting
- Subreddit connections for real verses

### Out of Scope (Post-Hackathon)
- Puzzle Generator CLI tool (manual puzzle creation for now)
- Multi-subreddit support
- Real-time verse sourcing

## Technical Constraints
- **Platform:** Reddit Devvit (developer.reddit.com)
- **Frontend:** React 18 via Devvit Web, TypeScript
- **Styling:** Tailwind CSS utility classes
- **Storage:** Devvit Redis (puzzles, user progress, stats)
- **Scheduling:** Devvit Scheduler (daily puzzle posting)
- **No external services** for MVP (puzzles pre-generated)
- All timestamps in **UTC**
- Server-side source of truth for streaks (prevent manipulation)

## Key Files Reference
- `src/data/bootstrap/week*.json` — Pre-built puzzles
- `devvit.yaml` — App configuration
- `src/scheduler/dailyPuzzle.tsx` — Daily posting logic
