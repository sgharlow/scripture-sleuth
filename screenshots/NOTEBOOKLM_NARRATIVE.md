# Comment Conspiracy: The Daily AI Detective Game

## Introduction

Welcome to Comment Conspiracy, a daily puzzle game that transforms every Reddit user into a digital detective. In an era where AI-generated content is becoming increasingly sophisticated and prevalent, Comment Conspiracy poses a simple yet compelling question: Can you spot the imposter?

Every day, players are presented with five Reddit comments from a real discussion thread. Four of these comments were written by actual humans. One was crafted by artificial intelligence. Your mission? Identify the AI imposter hiding among real Redditors.

## The Detective Experience

Comment Conspiracy isn't just a game—it's an immersive investigation experience. From the moment you open a puzzle, you're greeted with a detective-themed interface that sets the stage for your daily case.

### Your Mission Briefing

When you first encounter a Comment Conspiracy puzzle, the Welcome Screen presents your mission with clarity and purpose. The header declares "COMMENT CONSPIRACY" with the intriguing tagline "ONE OF THESE ISN'T HUMAN." Below, your mission is outlined in three clear steps:

First, **Examine the Evidence**—you'll read all five comments from a real Reddit thread. Second, **Identify the Imposter**—one comment was written by AI, and it's your job to find it. Third, **Build Your Streak**—new puzzles arrive every day, challenging you to maintain your detective record.

The interface reminds players that they get only one guess per day, and a new case file is released at midnight UTC. This creates urgency and makes every decision meaningful.

### The Investigation

Once you click "START INVESTIGATING," the real detective work begins. You're presented with a "Case File" that shows the day number, difficulty level, and the day of the week. Each puzzle draws from authentic Reddit discussions, displaying the subreddit and the original question that prompted the comments.

The comments themselves are presented as "Suspects"—numbered one through five. Each suspect card displays the username, upvote count, and timestamp, mimicking the authentic Reddit experience. The instruction "Tap to mark suspicious" guides players to interact with the suspects they want to investigate further.

What makes Comment Conspiracy compelling is the detective framing. You're not just reading comments—you're analyzing evidence. You're not clicking buttons—you're marking suspects. This thematic consistency transforms a simple guessing game into an engaging investigative experience.

### Making Your Accusation

When you've identified your prime suspect, tapping on their card marks them as "MARKED SUSPICIOUS." The interface shows "1 marked" to confirm your selection, and a prominent "LOCK IN ACCUSATION" button appears at the bottom of the screen.

Before finalizing your choice, a confirmation modal appears with the heading "FINAL ACCUSATION." This dramatic moment asks: "You're accusing this suspect of being the AI imposter." The modal displays which suspect you've selected along with a preview of their comment. The reminder "This cannot be undone" emphasizes the gravity of your decision. Players can either "Back Off" to reconsider or hit "Confirm" to lock in their accusation.

### Case Closed: The Reveal

After submitting your accusation, the result screen delivers the verdict. If you've correctly identified the AI, you're greeted with a satisfying "CASE CLOSED" banner and the confirmation that "Suspect [X] was the AI imposter! You caught them!"

But Comment Conspiracy goes beyond simple right-or-wrong feedback. The "EVIDENCE BREAKDOWN" section explains exactly why the flagged comment was AI-generated, providing educational value alongside entertainment. For example, the AI tells might include observations like:

- "Seemed nice"—tells rather than shows
- "Dishonest about some important things"—incredibly vague
- "Trusted my instincts"—cliché with no specific detail
- No actual story, just a summary of having a story
- Lowercase feels calculated to fit in

These explanations help players develop their AI-detection skills over time, making them better digital citizens in an age of synthetic content.

## Features That Keep Players Coming Back

### Daily Progression and Streaks

Comment Conspiracy follows the proven daily puzzle format that made Wordle a phenomenon. Each day brings a new case file, and players build streaks by correctly identifying the AI day after day. The game tracks your current streak and displays it prominently, creating a compelling reason to return daily. Miss a day or guess wrong? Your streak resets, adding real stakes to every puzzle.

### Difficulty Progression

The game features a thoughtful difficulty curve throughout the week. Monday puzzles are easier, helping players build confidence. As the week progresses, difficulty increases, with Saturday featuring "Expert" level puzzles that challenge even the most seasoned detectives. This progression keeps the game fresh and provides appropriate challenges for players of all skill levels.

### Community Statistics

After each guess, players see "Today's Case Stats" showing how many players have attempted the puzzle and what percentage got it right. The "Suspect Distribution" chart reveals which suspects fooled the most players, allowing you to compare your detective instincts against the community.

### Achievement System

Comment Conspiracy rewards dedicated players with eight achievements:

- **First Correct**: Land your first successful accusation
- **Streak achievements**: Maintain 3-day, 7-day, and 30-day streaks
- **Perfect Week**: Get seven correct in a row
- **Expert Hunter**: Correctly solve an Expert-difficulty puzzle
- **Veteran**: Play 30 puzzles
- **Sharp Eye**: Maintain 80%+ accuracy over 20+ games

Achievement unlocks appear as celebratory notifications, providing dopamine hits that reinforce continued play.

### Social Sharing

Every result screen includes a shareable summary that players can copy to their clipboard or share directly. The format mimics the popular Wordle sharing pattern, showing your result without spoiling the answer for others. This built-in virality helps spread the game organically through Reddit communities and social media.

### User Contributions

Comment Conspiracy embraces the Reddit community spirit by allowing users to contribute their own AI comment submissions for future puzzles. This "Best Use of User Contributions" feature ensures the game can sustain itself with fresh content while giving the community ownership in the experience.

## Technical Excellence

Behind the engaging gameplay lies robust technical architecture. Comment Conspiracy is built on the Reddit Devvit platform using React 18, TypeScript, and Tailwind CSS. The game uses Devvit Redis for persistent storage of user progress, streaks, and statistics. A Devvit Scheduler automatically posts new puzzles at midnight UTC every day, ensuring players worldwide have a consistent daily experience.

Comments are shuffled using a deterministic algorithm seeded with the user ID and puzzle ID, ensuring fairness while preventing players from sharing exact comment positions. The AI comment index remains hidden from the client until after a guess is submitted, preventing any possibility of cheating through browser inspection.

## Why Comment Conspiracy Matters

In a world increasingly filled with AI-generated content, Comment Conspiracy serves a dual purpose. First, it's genuinely fun—a daily brain teaser that challenges your perception and rewards your intuition. Second, it's educational—teaching players to recognize the subtle tells of AI-generated text.

The game creates water-cooler moments as players discuss the daily puzzle, share their streaks, and debate which comments seemed most suspicious. It's a shared daily ritual that brings Reddit communities together around a common challenge.

Comment Conspiracy proves that games can be both entertaining and meaningful. It transforms the abstract concern about AI content into an engaging daily practice, helping players become more discerning consumers of online content—one case file at a time.

---

*Comment Conspiracy: One of these comments isn't human. Can you spot the imposter?*
