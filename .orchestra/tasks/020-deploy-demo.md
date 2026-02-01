# Task 020: Deploy to r/CommentConspiracy and Demo

## Metadata
| Field | Value |
|-------|-------|
| **ID** | 020 |
| **Status** | ready |
| **Branch** | task/020 |
| **Assigned** | |
| **Depends** | 014, 015, 016, 017, 018, 019 |
| **Blocked-By** | |
| **Estimated** | 60 min |

## Inputs
- Complete app from all previous tasks
- sample_puzzles_week01.json (loaded into Redis)

## Description
Deploy the app to a live subreddit and verify everything works end-to-end.

Steps:
1. Create r/CommentConspiracy subreddit (if not exists)
2. Upload app to Devvit
3. Install app on subreddit
4. Verify puzzles are loaded in Redis
5. Manually trigger scheduler to create first post
6. Play through the full game flow
7. Take screenshots for submission
8. Document any issues found

## Acceptance Criteria
- [ ] App uploaded to developers.reddit.com
- [ ] App installed on r/CommentConspiracy
- [ ] At least one puzzle post live
- [ ] Full game flow works: view → select → confirm → result
- [ ] Mobile experience verified
- [ ] Screenshots captured for Devpost submission
- [ ] README.md updated with deployment notes

## Context Files
- comment-conspiracy-spec-v2.md (Section 16: Launch Checklist)
- Devvit deployment documentation

## Outputs
- Created:
- Modified: README.md
- Decisions:
- Screenshots: [list of screenshots for submission]

---

## Work Log
<!-- Append progress here while working -->
