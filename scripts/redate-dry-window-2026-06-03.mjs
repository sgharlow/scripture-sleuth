#!/usr/bin/env node
/**
 * Re-date the never-surfaced "dry window" puzzles (2026-05-25 .. 2026-06-03).
 *
 * Context: the 2026-05-24 content extension was committed but never uploaded
 * to Reddit, so the live app served nothing from 5-25 onward. Rather than
 * waste those 10 curated puzzles, this moves them +126 days (exactly 18
 * weeks, so every weekday/difficulty rule still holds) to 2026-09-28 ..
 * 2026-10-07 — immediately after the current end of schedule (2026-09-27) —
 * and renumbers dayNumber across the whole inventory by date order.
 *
 * Already-seeded Redis puzzles (<= 2026-05-24) keep their exact ids and
 * dayNumbers, so nothing live is disturbed; seedNewPuzzles() picks up the
 * re-dated ids incrementally.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const dir = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'src', 'data', 'bootstrap');
const DRY_START = '2026-05-25';
const DRY_END = '2026-06-03';
const SHIFT_DAYS = 126; // exactly 18 weeks — weekday-preserving

const DOW = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
const weekdayOf = (id) => DOW[new Date(id + 'T00:00:00Z').getUTCDay()];
const shiftDate = (id, days) => {
  const d = new Date(id + 'T00:00:00Z');
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
};
const mondayOf = (id) => {
  const d = new Date(id + 'T00:00:00Z');
  const dow = d.getUTCDay(); // 0=Sun
  d.setUTCDate(d.getUTCDate() - ((dow + 6) % 7));
  return d.toISOString().slice(0, 10);
};

const files = fs.readdirSync(dir).filter((f) => /^week\d+\.json$/.test(f)).sort();
const weeks = files.map((f) => ({ file: f, data: JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8')) }));

// 1. Pull dry-window puzzles out of their weeks
const dry = [];
for (const w of weeks) {
  const keep = [];
  for (const p of w.data.puzzles) {
    if (p.id >= DRY_START && p.id <= DRY_END) dry.push(p);
    else keep.push(p);
  }
  w.data.puzzles = keep;
}
if (dry.length === 0) {
  console.log('No dry-window puzzles found — nothing to do.');
  process.exit(0);
}
console.log(`Moving ${dry.length} puzzles: ${dry.map((p) => p.id).join(', ')}`);

// 2. Re-date +126 days; weekday must be identical (guards difficulty rules)
for (const p of dry) {
  const newId = shiftDate(p.id, SHIFT_DAYS);
  if (weekdayOf(newId) !== p.dayOfWeek) {
    throw new Error(`weekday mismatch: ${p.id} (${p.dayOfWeek}) -> ${newId} (${weekdayOf(newId)})`);
  }
  console.log(`  ${p.id} -> ${newId} (${p.dayOfWeek}, ${p.difficulty})`);
  p.id = newId;
}

// 3. Group re-dated puzzles into new trailing weeks
const lastWeekNum = Math.max(...weeks.map((w) => w.data.week));
const byMonday = new Map();
for (const p of dry.sort((a, b) => a.id.localeCompare(b.id))) {
  const mon = mondayOf(p.id);
  if (!byMonday.has(mon)) byMonday.set(mon, []);
  byMonday.get(mon).push(p);
}
let nextWeek = lastWeekNum;
const newWeeks = [];
for (const [mon, puzzles] of [...byMonday.entries()].sort((a, b) => a[0].localeCompare(b[0]))) {
  nextWeek += 1;
  const file = `week${String(nextWeek).padStart(2, '0')}.json`;
  newWeeks.push({ file, data: { week: nextWeek, startDate: mon, puzzles } });
  console.log(`  new ${file}: week ${nextWeek}, startDate ${mon}, ${puzzles.length} puzzles`);
}

// 4. Renumber dayNumber across the full inventory by date order
const all = [...weeks, ...newWeeks].flatMap((w) => w.data.puzzles).sort((a, b) => a.id.localeCompare(b.id));
all.forEach((p, i) => { p.dayNumber = i + 1; });
console.log(`Renumbered dayNumber 1..${all.length}`);

// 5. Write everything back (2-space indent, trailing newline)
for (const w of [...weeks, ...newWeeks]) {
  fs.writeFileSync(path.join(dir, w.file), JSON.stringify(w.data, null, 2) + '\n');
}
console.log(`Wrote ${weeks.length + newWeeks.length} week files. New weeks: ${newWeeks.map((w) => w.file).join(', ')}`);
