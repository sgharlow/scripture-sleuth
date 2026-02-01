# Architectural Decisions

> This log captures important technical decisions for context across all agents.
> Every non-trivial choice should be documented here.

<!--
## Template

### DEC-XXX: [Decision Title]
**Date:** YYYY-MM-DD
**Task:** [Related task ID or "Planning"]
**Status:** Decided | Superseded by DEC-YYY

**Context:**
[Why did this decision need to be made?]

**Decision:**
[What was decided?]

**Rationale:**
[Why this choice over alternatives?]

**Alternatives Considered:**
- Option A: [Description] - [Why rejected]
- Option B: [Description] - [Why rejected]

**Consequences:**
- [Impact on other parts of the system]
- [Technical debt or future considerations]
-->

## Decisions

### DEC-001: Use Pre-Generated Puzzles (No Live Reddit API)
**Date:** 2026-01-18
**Task:** Planning
**Status:** Decided

**Context:**
The spec describes a puzzle generator CLI that fetches comments from Reddit API and generates AI comments via Claude. However, for hackathon MVP, we need to minimize external dependencies and focus on core game experience.

**Decision:** Bundle pre-generated puzzle JSON files. Use `sample_puzzles_week01.json` as bootstrap data. No live Reddit/Claude API calls in MVP.

**Rationale:**
- Simplifies deployment (no API keys needed in Devvit)
- Reduces failure points during judging
- 7 puzzles covers demo period adequately
- Can add puzzle generator post-hackathon

**Alternatives Considered:**
- Live puzzle generation: Too complex for deadline, external dependency risk
- Manual JSON editing only: Slower, but acceptable for MVP

**Consequences:**
- Limited to pre-curated puzzles
- Need to manually create/upload puzzles for extended use
- Puzzle Generator CLI becomes Phase 2 work

### DEC-002: Server-Side Streak Tracking
**Date:** 2026-01-18
**Task:** Planning
**Status:** Decided

**Context:**
User progress (streaks, accuracy) needs to persist across sessions. Could use client-side storage or server-side Redis.

**Decision:** All user progress stored in Devvit Redis, keyed by Reddit user ID.

**Rationale:**
- Prevents manipulation (can't fake streaks)
- Works across devices
- Matches Devvit best practices

**Consequences:**
- Requires Redis calls on every game load
- Need efficient key structure
