# Scripture Sleuth

Daily Reddit game where players identify the fake Bible verse among 5 options. Built for the Reddit Games & Puzzles Hackathon 2026.

## Concept

- 5 Bible verses presented daily
- 4 are REAL scripture, 1 is FAKE
- Player identifies the fake one
- One guess per day, no retries
- Streak tracking, achievements, leaderboards

### The Twist: Subreddit Connections

Each **real** verse maps to a subreddit that thematically connects:

| Real Verse | Subreddit | Connection |
|------------|-----------|------------|
| "Love your neighbor as yourself" | r/HumansBeingBros | Acts of kindness |
| "Judge not, that ye be not judged" | r/AmItheAsshole | Moral judgment |
| "Pride goes before destruction" | r/WinStupidPrizes | Hubris consequences |

The **fake** verse has no natural subreddit connection - it's just generic "biblical-sounding" text. After guessing, players see which subreddits the real verses connect to!

## Tech Stack

- **Platform**: Reddit Devvit (developer.reddit.com)
- **Frontend**: React 18 + TypeScript 5.x + Tailwind CSS
- **Backend**: Devvit Redis + Scheduler
- **Build**: esbuild for webview bundling
- **Testing**: Vitest

## Development

```bash
npm install           # Install dependencies
npm run dev           # Start Devvit playtest
npm run build         # Build webview + devvit
npm run upload        # Deploy to Reddit
npm run test          # Run Vitest tests
npm run typecheck     # TypeScript check
```

## Game Rules

- One guess per day (no retries)
- 24-hour puzzle window (midnight UTC reset)
- Difficulty: Monday (easy) -> Friday (hard) -> Weekend (expert)
- 8 achievements to unlock

## Live

- **Subreddit**: r/ScriptureSleuth
- **Hackathon Deadline**: February 12, 2026

---

*Forked from [Comment Conspiracy](https://github.com/sgharlow/comment-conspiracy)*
