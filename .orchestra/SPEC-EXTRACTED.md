# Extracted Specification

**Source:** C:\Users\sghar\CascadeProjects\bible-verse.md
**Extracted:** 2026-01-31 23:02

---

## Game Identity

### Name
- **Primary Choice:** Scripture Sleuth
- **Alternatives:** Verse or Worse, Holy or Hoax, Apocrypha, Blessed or Bogus
- **Decision Rationale:** Spec recommends as "more respectful, clear purpose"

### Tagline/Concept
Daily trivia game where players identify the fake Bible verse among 5 options

---

## Domain Mapping

### Original Game → New Game

| Original Concept | New Concept | Notes |
|-----------------|-------------|-------|
| Comment | Verse | Core item type |
| AI-generated | Fake scripture | Detection target |
| Prompt/Source (subreddit) | Theme | Daily theme: "Wisdom", "Love", etc. |
| Username | Reference | e.g., "Matthew 7:1" |
| isAI | isFake | Boolean flag |
| aiCommentIndex | fakeVerseIndex | Index of fake item |

---

## Type Changes Required

### Primary Item Type (Comment → Verse)

**Original:**
```typescript
interface Comment {
  id: string;
  username: string;
  text: string;
  isAI: boolean;
}
```

**Target:**
```typescript
interface Verse {
  id: string;
  text: string;
  reference: string;        // e.g., "Matthew 7:1"
  translation: string;      // e.g., "KJV"
  linkedSubreddit?: string; // Only real verses have this
  isFake: boolean;
}
```

### Puzzle Type Changes

**Fields to Add:**
- `theme: string` - Daily theme like "Wisdom", "Love", "Judgment"
- `explanation.connections: string[]` - Explain subreddit connections

**Fields to Rename:**
- `prompt` → `theme` (simpler string, not object)
- `comments` → `verses`
- `aiCommentIndex` → `fakeVerseIndex`
- `explanation.aiTells` → `explanation.whyFake`

**Fields to Remove:**
- `prompt.source` - Replaced by theme string

---

## Visual Theme

### Color Palette

| Element | Original | Target | Hex |
|---------|----------|--------|-----|
| Background | Dark (#0f0f10) | Parchment | #faf3e3 |
| Card BG | Dark (#1a1a1b) | Cream | #f5ebe0 |
| Primary | Reddit orange | Burgundy | #722f37 |
| Accent | Suspicious amber | Gold | #c9a227 |
| Correct | Green (#46D160) | Keep | #46D160 |
| Incorrect | Red (#FF4B4B) | Keep | #FF4B4B |
| AI/Fake reveal | Purple (#9333EA) | Burgundy dark | #5a252c |

### Typography

| Element | Original | Target |
|---------|----------|--------|
| Body | System sans-serif | Georgia, serif |
| Display | Sans-serif | Garamond, Georgia |
| Special | - | Italic for verses |

### Icons/Imagery

- Original: Magnifying glass, detective theme
- Target: Book/scroll icons, paper texture, parchment aesthetic

---

## Component Mapping

| Original Component | Target Component | Changes |
|-------------------|------------------|---------|
| CommentCard.tsx | VerseCard.tsx | Rename, show reference + translation badge |
| AIExplanation.tsx | FakeExplanation.tsx | Rename, update labels |
| WelcomeScreen.tsx | WelcomeScreen.tsx | Theme, copy, imagery |
| GameScreen.tsx | GameScreen.tsx | Layout adjustments for verses |
| ResultScreen.tsx | ResultScreen.tsx | Add subreddit connections reveal |
| ShareCard.tsx | ShareCard.tsx | Update share text format |

---

## Content Structure

### Puzzle Format

**Items per puzzle:** 5
**Real items:** 4 (with subreddit connections)
**Fake items:** 1 (no subreddit connection)

### Content Sources

- KJV Bible (public domain) - Primary
- ASV, WEB - Alternatives if needed
- Avoid: NIV, ESV, NLT (copyrighted)

### Difficulty Progression

| Day | Difficulty | Characteristics |
|-----|------------|-----------------|
| Mon-Tue | Easy | Obvious fakes, well-known real verses |
| Wed-Thu | Medium | Subtler fakes, lesser-known real verses |
| Fri | Hard | Very convincing fakes, obscure real verses |
| Sat-Sun | Expert | Fakes that mimic specific biblical patterns |

---

## Special Features

### New Features (from spec)

1. **Subreddit Connections**
   - Description: Each real verse maps to a thematically-connected subreddit
   - Implementation: `linkedSubreddit` field on Verse, reveal in ResultScreen
   - Examples:
     - "Love your neighbor" → r/HumansBeingBros
     - "Judge not" → r/AmItheAsshole
     - "Pride goes before destruction" → r/WinStupidPrizes

2. **Connection Explanations**
   - Description: After guessing, explain why each verse connects to its subreddit
   - Implementation: `explanation.connections[]` in Puzzle type

### Removed Features

None - keeping all core mechanics from source

---

## Fake Verse Characteristics

From spec lines 165-175, fake verses should have tells:

1. **Too modern** - Uses contemporary concepts
2. **Too generic** - Lacks specificity of real scripture
3. **Wrong structure** - Doesn't follow biblical prose patterns
4. **Anachronisms** - References things that didn't exist
5. **Over-explained** - Real verses are often cryptic

**Example fake verses:**
- "Blessed are those who optimize their time, for they shall achieve balance."
- "The wise man diversifies his investments across many fields."
- "Let your heart be filled with gratitude, for negativity serves no purpose."

---

## Content Requirements

### Minimum Viable Content

- Puzzles needed: 7 (one week for MVP)
- Target for launch: 30+ puzzles
- Real verses needed: 4 per puzzle
- Fake verses needed: 1 per puzzle
- Subreddit mappings: 4 per puzzle

### Content Guidelines

- Present as "Bible trivia" not "Bible criticism"
- Avoid controversial verses (violence, slavery, etc.)
- Focus on wisdom, kindness, life advice verses
- Subreddit connections should be clever, not mocking
- Educational and playful tone, not irreverent

---

## Open Questions Resolved

| Question | Resolution |
|----------|------------|
| Name preference? | Scripture Sleuth (spec recommendation) |
| Tone? | Educational/playful, respectful |
| Translation? | KJV (public domain, recognizable) |
| Content volume? | Start with 7 puzzles, expand to 30+ |
| Subreddit name? | r/ScriptureSleuth |

---

## Risk Notes

From spec:
- **Religious offense** - Mitigate with respectful tone
- **Secular alienation** - Focus on fun/educational, not preachy
- **Controversy** - Clear "game" framing, not theological debate
