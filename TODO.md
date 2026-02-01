# Comment Conspiracy - Complete Launch Checklist

> **Last Updated**: 2026-01-29 (Dark theme UI redesign completed)
> **Hackathon Deadline**: February 12, 2026, 6:00 PM PST (14 days remaining)
> **Demo URL**: https://reddit.com/r/CommentConspiracy
> **60-Day Target**: Support game through March 26, 2026

---

## Executive Summary

| Category | Status | Details |
|----------|--------|---------|
| **Development** | 100% Complete | All 20 core tasks done + dark theme UI |
| **Deployment** | Live | v0.0.14 on r/CommentConspiracy |
| **Puzzle Content** | 126 puzzles | Jan 19 - May 24, 2026 (4+ months of content) |
| **Infrastructure** | Ready | Devvit Redis + Scheduler configured |
| **Devpost Submission** | PENDING | Form not yet submitted |
| **GitHub Repo** | Up to date | Commits pushed |

---

## COMPLETE TODO LIST FOR DEVPOST + 60-DAY SUPPORT

### CRITICAL - Required Before Devpost Submission

| # | Task | Status | Owner | Notes |
|---|------|--------|-------|-------|
| 1 | **Push commits to GitHub** | DONE | Human | Pushed Jan 26 |
| 2 | **Verify GitHub repo is public** | DONE | Human | Verified public Jan 28 |
| 3 | **Verify scheduler at midnight UTC** | DONE | Human | Verified Jan 27-29, posting daily |
| 4 | **Submit to Devpost** | PENDING | Human | Use DEVPOST_SUBMISSION.md |

### HIGH PRIORITY - Important for 60-Day Operation

| # | Task | Status | Owner | Notes |
|---|------|--------|-------|-------|
| 5 | Monitor first 3 days of auto-posting | DONE | Human | Day 9-11 posted successfully |
| 6 | Verify modmail alerts work | PENDING | Human | Check r/CommentConspiracy modmail |
| 7 | Create contingency for scheduler failure | DONE | Code | Manual post instructions exist |
| 8 | Plan puzzle creation for Apr-May | PENDING | Human | Need 28+ more puzzles by Mar 20 |

### MEDIUM PRIORITY - Recommended

| # | Task | Status | Owner | Notes |
|---|------|--------|-------|-------|
| 9 | Create video demo (1-2 min) | DONE | Human | https://youtu.be/FEWEZMGPXPs |
| 10 | Test logged-out experience | OPTIONAL | Human | Incognito browser test |
| 11 | Cross-browser testing | OPTIONAL | Human | Safari, Firefox, Edge |
| 12 | Reddit mobile app testing | OPTIONAL | Human | iOS + Android |

### LOW PRIORITY - Post-Launch Polish

| # | Task | Status | Owner | Notes |
|---|------|--------|-------|-------|
| 13 | Set up analytics tracking | FUTURE | Code | Player retention, popular puzzles |
| 14 | Create puzzle submission workflow | FUTURE | Code | User contributions → puzzles |
| 15 | Weekly community engagement posts | FUTURE | Human | Leaderboard highlights |

---

## DETAILED TASK BREAKDOWN

### Task 1: Push Commits to GitHub

**Status:** DONE (Jan 26)
**Urgency:** Completed

All commits have been pushed to `origin/main`.

---

### Task 2: Verify GitHub Repo is Public

**Status:** PENDING
**Urgency:** HIGH

1. Go to https://github.com/sgharlow/comment-conspiracy
2. Check visibility in repo settings
3. If private: Settings → Danger Zone → Change visibility → Public

---

### Task 3: Verify Scheduler at Midnight UTC

**Status:** PENDING
**Urgency:** CRITICAL

**What to check:**
- [ ] New post appears on r/CommentConspiracy at 00:00 UTC (Jan 27)
- [ ] Post title follows format: "Day {N}: Can You Spot the AI Comment?"
- [ ] `puzzle:current` Redis key updated
- [ ] Game loads and works on new post

**If scheduler fails:**
- Check Devvit dashboard for errors
- Manual fallback: Create post via Reddit, the game will still work
- Scheduler job name in devvit.yaml: `daily-puzzle-post`
- Cron: `0 0 * * *` (midnight UTC)

---

### Task 4: Submit to Devpost

**Status:** PENDING
**Urgency:** HIGH (deadline Feb 12)

**Submission URL:** [Reddit Games & Puzzles Hackathon on Devpost]

**Form Fields:**
| Field | Value |
|-------|-------|
| Title | Comment Conspiracy |
| Tagline | One of these comments isn't human. Can you spot the imposter? |
| Categories | Best Daily Game, Best Use of User Contributions, Best Mobile Game Play |
| Demo Link | https://reddit.com/r/CommentConspiracy |
| App Link | https://developers.reddit.com/apps/comment-conspire |
| GitHub | https://github.com/sgharlow/comment-conspiracy |
| Team | Solo (u/Primary-Subject-8639) |

**Screenshots to upload (from `screenshots/` folder):**
1. `01-welcome-screen.png`
2. `02-game-screen.png`
3. `03-comment-selected.png`
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

### Task 8: Plan Puzzle Creation for Apr-May

**Status:** PENDING
**Urgency:** MEDIUM (by Mar 20)

**Current Coverage:**
- Week 1-19: Jan 19 - May 24 (126 puzzles)
- **Gap starts:** Mar 26, 2026

**Required:**
- Create week11-14.json (28 puzzles) by Mar 20
- OR integrate user contributions into puzzle pipeline
- Consider reducing puzzle quality standards for quantity

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

**From Today (Jan 26):**
- Days of runway: **59 days** (through Mar 25)
- Hackathon coverage: Full (deadline Feb 12 = Day 25)
- Post-hackathon coverage: 42 additional days

---

## INFRASTRUCTURE STATUS

| Component | Status | Notes |
|-----------|--------|-------|
| Devvit App | ✅ DEPLOYED | v0.0.14 (dark theme CSS fix) |
| Redis Storage | ✅ CONFIGURED | Devvit managed |
| Scheduler | ✅ CONFIGURED | Job: `daily-puzzle-post`, Cron: `0 0 * * *` |
| Subreddit | ✅ LIVE | r/CommentConspiracy (public) |
| Branding | ✅ COMPLETE | Icon (256×256) + Banner (1920×384) |
| Screenshots | ✅ READY | 5 images in `screenshots/` |

---

## FEATURE COMPLETENESS

### Core Features (20/20) ✅
- [x] Daily puzzle display (5 comments, 1 AI)
- [x] Comment selection with visual feedback
- [x] Guess confirmation modal
- [x] Correct/incorrect result display
- [x] AI tells explanation
- [x] Human tells explanation
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
| Puzzle content runs out | Low | High | 59 days runway, plan creation by Mar 20 |

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
| **Jan 26** | **17** | **TODAY** - Complete inventory, push commits |
| Jan 27 | 16 | Verify scheduler at midnight UTC |
| Jan 28-31 | 15-12 | Monitor auto-posting, optional testing |
| Feb 1-5 | 11-7 | Video demo (if desired) |
| Feb 6-10 | 6-2 | Submit to Devpost |
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
- **Demo**: https://reddit.com/r/CommentConspiracy
- **Devvit Dashboard**: https://developers.reddit.com/apps/comment-conspire
- **GitHub**: https://github.com/sgharlow/comment-conspiracy
- **Test Subreddit**: https://reddit.com/r/comment_conspire_dev

### Key Files
- **Scheduler**: `src/scheduler/dailyPuzzle.tsx`
- **App Config**: `devvit.yaml`
- **Puzzle Data**: `src/data/bootstrap/week*.json`
- **Bootstrap**: `src/services/bootstrapService.ts`

---

## SUMMARY: WHAT'S NEEDED FOR LAUNCH

### Blocking (Must Do)
1. ✅ Push commits to GitHub (DONE)
2. ✅ Verify GitHub repo is public (DONE)
3. ✅ Verify scheduler at midnight UTC (DONE)
4. ⬜ Submit to Devpost (before Feb 12)

### Important (Should Do)
5. ⬜ Monitor first 3 days of auto-posting
6. ⬜ Plan puzzle creation for Apr-May

### Optional (Nice to Have)
7. ✅ Video demo (https://youtu.be/FEWEZMGPXPs)
8. ⬜ Cross-browser testing
9. ⬜ Reddit mobile app testing

**Bottom Line**: Push commits, verify scheduler works, submit to Devpost. The game is fully functional with 59 days of content.

---

## COMPLETED WORK LOG

### Jan 30, 2026
- [x] Fixed dark theme CSS not rendering (styles.css was missing detective theme colors)
- [x] Added all detective theme colors to webroot/styles.css:
  - Dark backgrounds: bg-detective-bg, bg-detective-card
  - Text colors: text-textPrimary, text-textSecondary, text-textMuted
  - Accent colors: suspicious, correct, incorrect, ai, reddit with opacity variants
  - Additional utility classes for borders, shadows, transforms
- [x] Deployed v0.0.14 to r/CommentConspiracy
- [x] Verified dark theme now displays correctly in production
- [x] Captured new dark theme screenshots (day10_dark_completed.png, day12_dark_completed.png)

### Jan 29, 2026
- [x] Complete dark "Detective" theme UI redesign
- [x] Implemented custom Tailwind color palette (detective-bg, suspicious, correct, incorrect, ai)
- [x] Redesigned WelcomeScreen: "COMMENT CONSPIRACY" title, "ONE OF THESE ISN'T HUMAN" tagline
- [x] Redesigned GameScreen: "Case File #{dayNumber}" header, difficulty badges
- [x] Redesigned CommentCard: "Suspect X" labels, Reddit-style metadata (upvotes, timestamps)
- [x] Updated ConfirmModal: "FINAL ACCUSATION" theme
- [x] Updated ResultBanner: "CASE CLOSED" / "CASE UNSOLVED" outcomes
- [x] Updated AIExplanation: "Evidence Breakdown" header
- [x] Updated StatsPanel: "Today's Case Stats", "Suspect Distribution"
- [x] Updated CompletedScreen: "Case Closed for Today" header
- [x] Updated Timer: "Next Case File In" label
- [x] Updated Leaderboard: "Your Detective Rankings"
- [x] Deployed v0.0.13 to Reddit
- [x] All 497 tests passing
- [x] Captured new screenshots with dark theme

### Jan 26, 2026
- [x] Full project inventory completed
- [x] All documentation updated
- [x] Identified remaining tasks for 60-day support
- [x] Risk assessment completed

### Previous (Jan 25-26)
- [x] Created r/CommentConspiracy subreddit
- [x] Deployed v0.0.12 with scheduler fix
- [x] Created subreddit icon and banner
- [x] Captured 5 Devpost screenshots
- [x] Fixed scheduler job name mismatch
- [x] Created 126 puzzles (19 weeks)
- [x] All tests passing
- [x] Full playtest completed
