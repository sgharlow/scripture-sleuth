# Goal: Win Reddit Daily Games Hackathon with Comment Conspiracy

## Description
Build **Comment Conspiracy** — a daily deduction game for Reddit where players identify which comment among 5 is AI-generated. The game posts a new puzzle daily, tracks player streaks, and drives community discussion.

This is a hackathon entry targeting three prizes:
- **Best Daily Game** ($15,000) — Primary target
- **Best Use of User Contributions** ($3,000)
- **Best Mobile Game Play** ($3,000)

**Deadline: February 12, 2026, 6:00 PM PST**

The app runs on the Reddit Devvit platform, using React for the UI, Redis for persistence, and a Scheduler for daily puzzle posting.

## Acceptance Criteria
- [x] Devvit app initializes and runs on a test subreddit
- [x] Daily puzzle displays with 5 comments (4 real sourced, 1 AI-generated)
- [x] Users can select one comment as their guess (one guess per day)
- [x] Correct/incorrect result shown with AI "tells" explanation
- [x] User streak and accuracy tracked persistently
- [x] Share card generated for results (spoiler-free)
- [x] Mobile-responsive UI that feels native on Reddit
- [x] Scheduler automatically posts new puzzle at midnight UTC
- [x] At least 7 pre-loaded puzzles for demo/judging period (60 puzzles loaded!)
- [x] Deployed to r/CommentConspiracy subreddit

## Launch Readiness (Updated 2026-01-25)
- [ ] 60 days of puzzle content from launch date (currently 54 days from today)
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
- Pre-generated puzzle JSON loading (7+ puzzles bundled)
- Admin/mod upload mechanism for additional puzzles
- Scheduler job for daily puzzle posting

### Out of Scope (Post-Hackathon)
- Puzzle Generator CLI tool (manual puzzle creation for now)
- User-submitted puzzle suggestions
- Achievements system
- Leaderboards beyond basic stats
- Multi-subreddit support
- Real-time comment sourcing via Reddit API

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
- `comment-conspiracy-spec-v2.md` — Full product specification
- `sample_puzzles_week01.json` — 7 pre-built puzzles for MVP
