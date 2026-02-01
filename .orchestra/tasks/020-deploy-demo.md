# Task 020: Deploy to r/ScriptureSleuth and Demo

## Metadata
| Field | Value |
|-------|-------|
| **ID** | 020 |
| **Status** | in_progress |
| **Branch** | task/020 |
| **Assigned** | |
| **Depends** | 014, 015, 016, 017, 018, 019 |
| **Blocked-By** | |
| **Estimated** | 60 min |

## Inputs
- Complete app from all previous tasks
- Bootstrap puzzles (loaded into Redis)

## Description
Deploy the app to a live subreddit and verify everything works end-to-end.

Steps:
1. Create r/ScriptureSleuth subreddit (if not exists)
2. Upload app to Devvit
3. Install app on subreddit
4. Verify puzzles are loaded in Redis
5. Manually trigger scheduler to create first post
6. Play through the full game flow
7. Take screenshots for submission
8. Document any issues found

## Acceptance Criteria
- [x] App uploaded to developers.reddit.com
- [x] App installed on r/ScriptureSleuth
- [x] At least one puzzle post live
- [x] Full game flow works: view → select → confirm → result
- [ ] Mobile experience verified
- [x] Screenshots captured for Devpost submission
- [ ] README.md updated with deployment notes

## Context Files
- Devvit deployment documentation
- TODO.md for launch checklist

## Outputs
- Created:
- Modified: README.md
- Decisions:
- Screenshots: [list of screenshots for submission]

---

## Work Log
<!-- Append progress here while working -->

### 2026-02-01
- Updated documentation from CommentConspiracy to ScriptureSleuth
- Production subreddit: r/ScriptureSleuth (pending creation)
- Dev subreddit: r/scripture_sleuth_dev (active)

### 2026-02-01 (Session 2)
- ✅ Uploaded subreddit branding (icon + banner) to r/ScriptureSleuth
- ✅ Created puzzle post via "Create Comment Conspiracy Post" menu action
- 🐛 Fixed verse selection bug (onSelectVerse not a function) - required app rebuild
- ✅ App rebuilt and uploaded to v0.0.4
- ✅ Installed v0.0.4 on r/ScriptureSleuth
- ✅ Full game flow verified: welcome → game → select → confirm → result
- ✅ Achievement system working ("First Discovery" unlocked)
- ✅ Screenshots captured:
  - 01-welcome-screen.png - How to Play screen
  - 02-game-screen.png - Active puzzle with 5 verses
  - 03-verse-selected.png - Verse marked suspicious with Lock In button
  - 04-confirmation-modal.png - Final Decision confirmation
  - 05-correct-result.png - Correct result with explanation, stats, achievements

**Known Issues:**
- ~~Post title still shows "Comment Conspiracy - Can You Spot the AI?" instead of "Scripture Sleuth"~~ FIXED
- ~~Menu action name still says "Create Comment Conspiracy Post"~~ FIXED
- ~~Need to update main.tsx to fix these naming issues~~ Already correct, was stale deploy

### 2026-02-01 (Session 3)
- ✅ Verified naming in main.tsx already correct ("Scripture Sleuth" not "Comment Conspiracy")
- ✅ Verified per-user shuffling working correctly (fake verse position randomized per user)
- ✅ Rebuilt and uploaded app to v0.0.5
- ✅ Installed v0.0.5 on r/ScriptureSleuth
- ✅ Menu now correctly shows "Create Scripture Sleuth Post"
- ✅ Created new post with correct title: "Scripture Sleuth - Can You Spot the Fake Verse?"
- ✅ Screenshot captured: 06-new-post-correct-title.png
- Old "Comment Conspiracy" post marked for removal (pending mod cleanup)
