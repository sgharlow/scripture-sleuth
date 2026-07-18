# Scripture Sleuth

[![Skill Crossroads](https://skillcrossroads.com/api/badge/sgharlow/scripture-sleuth.svg)](https://skillcrossroads.com/s/sgharlow/scripture-sleuth)

Claude Code artifacts graded by [Skill Crossroads](https://skillcrossroads.com) — click the badge for the evidence-cited scorecard.


Daily Reddit game where players identify the fake Bible verse among 5 options. Built for the Reddit Games & Puzzles Hackathon 2026.

## Play Now

**Live at: [r/ScriptureSleuth](https://reddit.com/r/ScriptureSleuth)**

**Demo Video: [Watch on YouTube](https://youtu.be/CTuRKwgCeu0)**

## Concept

- 5 Bible verses presented daily on a themed topic
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
| "Be anxious for nothing" | r/Anxiety | Mental health support |

The **fake** verse has no natural subreddit connection - it's just generic "biblical-sounding" text. After guessing, players see which subreddits the real verses connect to!

## Features

- **Daily Puzzles**: New puzzle every day at midnight UTC
- **One Guess Rule**: Choose carefully - no retries
- **Streak Tracking**: Build consecutive correct day streaks
- **8 Achievements**: From "First Discovery" to "30-day Streak"
- **Leaderboards**: Compete on streak and accuracy rankings
- **User Contributions**: Submit your own fake verse ideas
- **Community Stats**: See how your guess compares to others
- **126 Curated Puzzles**: 4+ months of daily content

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

## Deployment

### Current Deployment (v0.0.11)

| Component | Status | Link |
|-----------|--------|------|
| Devvit App | Deployed | [developers.reddit.com/apps/scripture-sleuth](https://developers.reddit.com/apps/scripture-sleuth) |
| Production Subreddit | Live | [r/ScriptureSleuth](https://reddit.com/r/ScriptureSleuth) |
| Dev Subreddit | Active | r/scripture_sleuth_dev |

### Deploying Updates

1. Build the webview: `npm run build:webview`
2. Upload to Devvit: `npm run upload`
3. Install on subreddit via Mod Tools > Installed Apps

### Creating Puzzle Posts

1. Go to r/ScriptureSleuth
2. Click the overflow menu (three dots)
3. Select "Create Scripture Sleuth Post"
4. A new puzzle post will be created automatically

### Automated Daily Posts

The Devvit Scheduler is configured to create a new puzzle post at midnight UTC daily. To manually trigger:
1. Use the "Create Scripture Sleuth Post" menu action, or
2. Call the scheduler job via Devvit admin tools

## Game Rules

- One guess per day (no retries)
- 24-hour puzzle window (midnight UTC reset)
- Difficulty: Monday (easy) -> Friday (hard) -> Weekend (expert)
- 8 achievements to unlock

## Project Structure

```
scripture-sleuth/
├── src/
│   ├── main.tsx           # Devvit entry point
│   ├── components/        # React UI components
│   ├── services/          # Business logic (puzzle, user, stats)
│   ├── hooks/             # React hooks (useGameState)
│   ├── types/             # TypeScript definitions
│   └── data/bootstrap/    # Curated puzzle JSON files
├── webroot/               # Built webview assets
├── screenshots/           # Game screenshots for submission
└── walkthrough/           # Game narrative documentation
```

## Hackathon

- **Competition**: Reddit Games & Puzzles Hackathon 2026
- **Status**: ✅ Submitted (deadline 2026-02-12 @ 6:00 PM PST). Game is live on Reddit at [r/ScriptureSleuth](https://www.reddit.com/r/ScriptureSleuth/).
- **Prize Categories entered**:
  - Best Daily Game ($15,000)
  - Best Use of User Contributions ($3,000)
  - Best Mobile Game Play ($3,000)

## Screenshots

See the [screenshots/](./screenshots/) folder for game flow images.

## License

MIT

---

*Scripture Sleuth: One of these verses isn't real. Can you spot the fake?*

---

**Repo size note:** this repository is ~37MB because the Devvit listing assets (high-resolution subreddit banners and icons in `assets/`) live in the current tree by requirement — they are functional, not stray build output. Documented per the 2026-07 portfolio size audit; a history rewrite was evaluated and declined (little reclaim, submitted-app risk).
