# Decision Log

**Project:** scripture-sleuth
**Fork of:** comment-conspiracy
**Spec:** bible-verse.md
**Started:** 2026-01-31 23:02

---

## Decision Framework

Priority for making decisions:
1. **Explicit in Spec** → Follow exactly as written
2. **Pattern in Source** → Apply same pattern to new domain
3. **Sensible Default** → Simplest working option, document rationale

---

## Decisions Made

### DEC-001: Game Name
- **Phase:** 0 - Initialize
- **Source:** Spec lines 47-64
- **Options Considered:**
  - Scripture Sleuth (recommended, "more respectful, clear purpose")
  - Verse or Worse (punny, memorable, "might seem mocking")
  - Holy or Hoax, Apocrypha, Blessed or Bogus, etc.
- **Decision:** Scripture Sleuth
- **Rationale:** Spec explicitly recommends "Scripture Sleuth" as first choice for being "more respectful, clear purpose" - important for religious content
- **Impact:** Package name (scripture-sleuth), devvit app name, subreddit (r/ScriptureSleuth)

---

### DEC-002: Color Palette
- **Phase:** 0 - Initialize
- **Source:** Spec lines 127-138
- **Decision:** Use spec's exact colors
- **Values:**
  - Background: #faf3e3 (parchment/cream)
  - Primary: #722f37 (deep burgundy)
  - Accent: #c9a227 (gold)
- **Rationale:** Explicitly defined in spec with clear theme intent
- **Impact:** tailwind.config.js, all component styling

---

### DEC-003: Font Selection
- **Phase:** 0 - Initialize
- **Source:** Spec line 136
- **Decision:** Georgia as primary serif, Garamond as fallback
- **Rationale:** Spec specifies "Serif fonts for verses (Georgia, Garamond)"
- **Impact:** Tailwind font family config, verse display components

---

### DEC-004: Translation Source
- **Phase:** 0 - Initialize
- **Source:** Spec lines 159-162
- **Decision:** KJV (King James Version) as primary
- **Rationale:** Spec recommends KJV as "public domain, recognizable"
- **Impact:** Content creation, verse display

---

### DEC-005: Core Type Mapping
- **Phase:** 0 - Initialize
- **Source:** Spec lines 72-112
- **Decision:** Apply the following type transformations:
  - `Comment` → `Verse`
  - `isAI` → `isFake`
  - `username` → `reference` (e.g., "Matthew 7:1")
  - `aiCommentIndex` → `fakeVerseIndex`
  - `prompt` → `theme`
- **Rationale:** Explicitly defined in spec's type definitions section
- **Impact:** All type files, services, components

---

### DEC-006: Subreddit Connection Feature
- **Phase:** 0 - Initialize
- **Source:** Spec lines 27-43
- **Decision:** Implement the subreddit connection feature
- **Details:** Each real verse maps to a thematically-connected subreddit, revealed after guessing
- **Rationale:** Described as "Key Innovation" in spec
- **Impact:** Verse type needs `linkedSubreddit?: string`, ResultScreen needs connection display

---

### DEC-007: Puzzle Item Count
- **Phase:** 0 - Initialize
- **Source:** Spec lines 12-14
- **Decision:** Keep 5 items per puzzle (4 real + 1 fake)
- **Rationale:** Core mechanic unchanged from source
- **Impact:** Puzzle structure, validation

---

## Pending Decisions

| ID | Topic | When Needed | Default |
|----|-------|-------------|---------|
| DEC-008 | Achievement renaming | Phase 3 | Keep same mechanics, update text |
| DEC-009 | Share text format | Phase 3 | Adapt source pattern for verses |
| DEC-010 | Content volume for MVP | Phase 5 | 7 puzzles (1 week) minimum |
