# Scripture Sleuth - Complete Launch Checklist

> **HISTORICAL SNAPSHOT — DO NOT USE AS CURRENT STATE.**
> Pre-launch snapshot (2026-02-01). Game was submitted ~2026-02-12; puzzle content exhausted ~2026-03-25. Status below is historical.

> **PUZZLE FILE DISCREPANCY:** The inventory table below and Task 10 reference weeks 1-10 (126 puzzles). Only week01-week09 JSON files actually exist in `src/data/bootstrap/`; `week10.json` and any weeks 11-19 are absent from the repository. Actual content covers at most 63 puzzles (9 weeks). The "126 puzzles" / "53 days of runway" figures in this document are inaccurate.

> **Last Updated**: 2026-02-01
> **Hackathon Deadline**: February 12, 2026, 6:00 PM PST (11 days remaining)
> **Demo URL**: https://reddit.com/r/ScriptureSleuth
> **60-Day Target**: Support game through March 26, 2026

---

## Executive Summary

| Category | Status | Details |
|----------|--------|---------|
| **Development** | 100% Complete | All 20 core tasks done + parchment theme UI |
| **Deployment** | PENDING | Need to deploy to r/ScriptureSleuth |
| **Puzzle Content** | 126 puzzles | Jan 19 - May 24, 2026 (4+ months of content) |
| **Infrastructure** | Ready | Devvit Redis + Scheduler configured |
| **Devpost Submission** | PENDING | Form not yet submitted |
| **GitHub Repo** | Up to date | Commits pushed |

---

## COMPLETE TODO LIST FOR DEVPOST + 60-DAY SUPPORT

### CRITICAL - Required Before Devpost Submission

| # | Task | Status | Owner | Notes |
|---|------|--------|-------|-------|
| 1 | **Create r/ScriptureSleuth subreddit** | PENDING | Human | Production subreddit |
| 2 | **Deploy app to r/ScriptureSleuth** | PENDING | Human | Install from Devvit dashboard |
| 3 | **Push commits to GitHub** | DONE | Human | Pushed Jan 26 |
| 4 | **Verify GitHub repo is public** | PENDING | Human | https://github.com/sgharlow/scripture-sleuth |
| 5 | **Verify scheduler at midnight UTC** | PENDING | Human | After deployment |
| 6 | **Submit to Devpost** | PENDING | Human | Use walkthrough/DEVPOST_SUBMISSION.md |

### HIGH PRIORITY - Important for 60-Day Operation

| # | Task | Status | Owner | Notes |
|---|------|--------|-------|-------|
| 7 | Monitor first 3 days of auto-posting | PENDING | Human | After deployment |
| 8 | Verify modmail alerts work | PENDING | Human | Check r/ScriptureSleuth modmail |
| 9 | Create contingency for scheduler failure | DONE | Code | Manual post instructions exist |
| 10 | Plan puzzle creation for Apr-May | PENDING | Human | Need 28+ more puzzles by Mar 20 |

### MEDIUM PRIORITY - Recommended

| # | Task | Status | Owner | Notes |
|---|------|--------|-------|-------|
| 11 | Create video demo (1-2 min) | PENDING | Human | Record gameplay |
| 12 | Test logged-out experience | OPTIONAL | Human | Incognito browser test |
| 13 | Cross-browser testing | OPTIONAL | Human | Safari, Firefox, Edge |
| 14 | Reddit mobile app testing | OPTIONAL | Human | iOS + Android |

### LOW PRIORITY - Post-Launch Polish

| # | Task | Status | Owner | Notes |
|---|------|--------|-------|-------|
| 15 | Set up analytics tracking | FUTURE | Code | Player retention, popular puzzles |
| 16 | Create puzzle submission workflow | FUTURE | Code | User contributions → puzzles |
| 17 | Weekly community engagement posts | FUTURE | Human | Leaderboard highlights |

---

## DETAILED TASK BREAKDOWN

### Task 1: Create r/ScriptureSleuth Subreddit

**Status:** PENDING
**Urgency:** CRITICAL

1. Go to https://www.reddit.com/subreddits/create
2. Name: `ScriptureSleuth`
3. Type: Public
4. Description: "Daily Bible verse puzzle - spot the fake verse among 5 options"

---

### Task 2: Deploy App to r/ScriptureSleuth

**Status:** PENDING
**Urgency:** CRITICAL

1. Go to https://developers.reddit.com/apps/scripture-sleuth
2. Click "Install"
3. Select r/ScriptureSleuth
4. Verify app appears in subreddit

---

### Task 4: Verify GitHub Repo is Public

**Status:** PENDING
**Urgency:** HIGH

1. Go to https://github.com/sgharlow/scripture-sleuth
2. Check visibility in repo settings
3. If private: Settings → Danger Zone → Change visibility → Public

---

### Task 5: Verify Scheduler at Midnight UTC

**Status:** PENDING
**Urgency:** CRITICAL (after deployment)

**What to check:**
- [ ] New post appears on r/ScriptureSleuth at 00:00 UTC
- [ ] Post title follows format: "Day {N}: Can You Spot the Fake Verse?"
- [ ] `puzzle:current` Redis key updated
- [ ] Game loads and works on new post

**If scheduler fails:**
- Check Devvit dashboard for errors
- Manual fallback: Create post via Reddit, the game will still work
- Scheduler job name in devvit.yaml: `daily-puzzle-post`
- Cron: `0 0 * * *` (midnight UTC)

---

### Task 6: Submit to Devpost

**Status:** PENDING
**Urgency:** HIGH (deadline Feb 12)

**Submission URL:** [Reddit Games & Puzzles Hackathon on Devpost]

**Form Fields:**
| Field | Value |
|-------|-------|
| Title | Scripture Sleuth |
| Tagline | One of these verses isn't real. Can you spot the fake? |
| Categories | Best Daily Game, Best Use of User Contributions, Best Mobile Game Play |
| Demo Link | https://reddit.com/r/ScriptureSleuth |
| App Link | https://developers.reddit.com/apps/scripture-sleuth |
| GitHub | https://github.com/sgharlow/scripture-sleuth |
| Team | Solo (u/Primary-Subject-8639) |

**Screenshots to upload (from `screenshots/` folder):**
1. `01-welcome-screen.png`
2. `02-game-screen.png`
3. `03-verse-selected.png`
4. `04-confirmation-modal.png`
5. `05-correct-result.png`

**Built With:**
- Reddit Devvit Platform
- React 18
- TypeScript 5.x
- Tailwind CSS
- Devvit Redis
- Devvit Scheduler

---

### Task 10: Plan Puzzle Creation for Apr-May

**Status:** PENDING
**Urgency:** MEDIUM (by Mar 20)

**Current Coverage:**
- Week 1-19: Jan 19 - May 24 (126 puzzles)
- **Gap starts:** Mar 26, 2026

**Required:**
- Create week11-14.json (28 puzzles) by Mar 20
- OR integrate user contributions into puzzle pipeline

---

## PUZZLE INVENTORY STATUS

| Week | Dates | Count | File | Status |
|------|-------|-------|------|--------|
| Week 1 | Jan 19-25 | 7 | week01.json | ✅ |
| Week 2 | Jan 26 - Feb 1 | 7 | week02.json | ✅ |
| Week 3 | Feb 2-8 | 7 | week03.json | ✅ |
| Week 4 | Feb 9-15 | 7 | week04.json | ✅ |
| Week 5 | Feb 16-22 | 7 | week05.json | ✅ |
| Week 6 | Feb 23 - Mar 1 | 7 | week06.json | ✅ |
| Week 7 | Mar 2-8 | 7 | week07.json | ✅ |
| Week 8 | Mar 9-15 | 7 | week08.json | ✅ |
| Week 9 | Mar 16-19 | 4 | week09.json | ✅ |
| Week 10 | Mar 20-25 | 6 | week10.json | ✅ |
| **Total** | | **126** | | |

**From Today (Feb 1):**
- Days of runway: **53 days** (through Mar 25)
- Hackathon coverage: Full (deadline Feb 12)
- Post-hackathon coverage: 41 additional days

---

## INFRASTRUCTURE STATUS

| Component | Status | Notes |
|-----------|--------|-------|
| Devvit App | ✅ READY | scripture-sleuth configured |
| Redis Storage | ✅ CONFIGURED | Devvit managed |
| Scheduler | ✅ CONFIGURED | Job: `daily-puzzle-post`, Cron: `0 0 * * *` |
| Subreddit | ⬜ PENDING | r/ScriptureSleuth needs creation |
| Dev Subreddit | ✅ LIVE | r/scripture_sleuth_dev |
| Branding | ⬜ PENDING | Icon + Banner for r/ScriptureSleuth |
| Screenshots | ✅ READY | Images in `screenshots/` |

---

## FEATURE COMPLETENESS

### Core Features (20/20) ✅
- [x] Daily puzzle display (5 verses, 1 fake)
- [x] Verse selection with visual feedback
- [x] Guess confirmation modal
- [x] Correct/incorrect result display
- [x] Fake verse explanation
- [x] Subreddit connections reveal
- [x] Already-played state detection
- [x] Community statistics
- [x] Share functionality
- [x] Streak tracking
- [x] Accuracy tracking
- [x] 8 achievements system
- [x] Achievement notifications
- [x] Leaderboards (streak + accuracy)
- [x] User contributions
- [x] Contribution voting
- [x] Daily scheduler
- [x] Inventory health monitoring
- [x] Mobile-responsive design
- [x] Error handling & loading states

---

## RISK ASSESSMENT

### HIGH RISK
| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Scheduler doesn't run | Low | High | Manual posting fallback, monitor first 3 days |
| Puzzle content runs out | Low | High | 53 days runway, plan creation by Mar 20 |

### MEDIUM RISK
| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| GitHub repo private | Medium | Medium | Check before submission |
| Video demo missing | Medium | Low | Optional, screenshots sufficient |

### LOW RISK
| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Browser compatibility | Low | Low | Works on Chrome, test others optionally |
| User scale issues | Low | Low | Devvit handles infrastructure |

---

## TIMELINE TO DEADLINE

| Date | Days Left | Milestone |
|------|-----------|-----------|
| **Feb 1** | **11** | **TODAY** - Create subreddit, deploy app |
| Feb 2-3 | 10-9 | Verify scheduler, monitor posting |
| Feb 4-8 | 8-4 | Testing, video demo (optional) |
| Feb 9-11 | 3-1 | Submit to Devpost |
| **Feb 12** | **0** | **DEADLINE 6:00 PM PST** |

---

## QUICK REFERENCE

### Build Commands
```bash
npm run dev          # Local playtest
npm run build        # Full build
npm run upload       # Deploy to Reddit
npm run test         # Run tests
npm run typecheck    # TypeScript check
npm run lint         # ESLint check
```

### Key URLs
- **Demo**: https://reddit.com/r/ScriptureSleuth
- **Dev Subreddit**: https://reddit.com/r/scripture_sleuth_dev
- **Devvit Dashboard**: https://developers.reddit.com/apps/scripture-sleuth
- **GitHub**: https://github.com/sgharlow/scripture-sleuth

### Key Files
- **Scheduler**: `src/scheduler/dailyPuzzle.tsx`
- **App Config**: `devvit.yaml`
- **Puzzle Data**: `src/data/bootstrap/week*.json`
- **Bootstrap**: `src/services/bootstrapService.ts`

---

## SUMMARY: WHAT'S NEEDED FOR LAUNCH

### Blocking (Must Do)
1. ⬜ Create r/ScriptureSleuth subreddit
2. ⬜ Deploy app to r/ScriptureSleuth
3. ⬜ Verify scheduler at midnight UTC
4. ⬜ Submit to Devpost (before Feb 12)

### Important (Should Do)
5. ⬜ Monitor first 3 days of auto-posting
6. ⬜ Plan puzzle creation for Apr-May

### Optional (Nice to Have)
7. ⬜ Video demo
8. ⬜ Cross-browser testing
9. ⬜ Reddit mobile app testing

**Bottom Line**: Create subreddit, deploy app, verify scheduler, submit to Devpost. The game is fully functional with 53 days of content.
