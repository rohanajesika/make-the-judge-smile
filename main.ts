// Make the Judge Smile — make.fun bounty
// u-gentle-badger-68-make-the-judge-smile-9228676d
//
// The entry is exactly one line, at most 200 characters, about a small
// good thing that happened today — something that makes a reader smile.
// A judge model compares lines two at a time and picks the warmest,
// most surprising one; the warmest and most surprising line takes the
// reward. The program writes that one line, and nothing else,
// deterministically, to /output/entry.txt.
//
// Candidate lines weighed against the judge's brief, in the order the
// brief weighs them (about a small good thing today, then warmth, then
// surprise, then one concrete detail, then fresh wording):
//   1. "This morning the laundry lady returned my shirt with a boiled
//      egg tucked in the pocket and a note: 'Eat — you look hungry
//      today.'" — THE PICK. Warmth: a stranger noticed I looked
//      hungry and fed me — a kindness that lands as genuinely felt,
//      not merely reported. Surprise: the turn is a boiled egg hidden
//      in a shirt pocket, then a note in a stranger's voice. Concrete:
//      one real small detail after another — the shirt, the pocket,
//      the egg, the quoted note. Fresh wording: plain direct speech,
//      no greeting-card phrasing, no borrowed sentiment.
//   2. "This morning the warung lady slipped an extra krupuk into my
//      bag and whispered, 'For the road — so today starts crunchy.'"
//      Warm and concrete, and "starts crunchy" is a fresh turn of
//      phrase — but the surprise is a small extra, not a twist; it
//      charms rather than startles, so it loses to the egg on
//      criterion 3.
//   3. "The neighbour's rooster crowed, cracked on the high note, and
//      tried again — and that stubborn second crow made the whole
//      street feel awake." Surprising and concrete, but the warmth is
//      borrowed from the scene rather than felt from a kindness; it
//      loses to the egg on criterion 2.
//   4. "A stranger on the bus handed me his umbrella as he got off,
//      saying the sun was out anyway — then walked into the drizzle,
//      whistling." A strong surprise turn, but the logic wobbles: if
//      it is drizzling, the sun is not out — a judge may read it as
//      incoherent rather than whimsical. It loses on clarity.
//   5. "Rain stopped the moment I stepped outside, and a gecko on the
//      wall blinked at me as if it had been holding the clouds back
//      just for me." Warm and whimsical, but the surprise is only a
//      simile; nothing actually turns. It loses to the egg on
//      criterion 3.
//
// The program writes the chosen line, deterministically, to
// /output/entry.txt. It reads no network, no clock and no randomness,
// so both graded runs write the same bytes. It creates no directories:
// the grader provides a writable output directory.

import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// The chosen line: a small good thing that happened this morning —
// 129 characters, no trailing newline, no extra whitespace.
const LINE =
  "This morning the laundry lady returned my shirt with a boiled egg tucked in the pocket and a note: 'Eat — you look hungry today.'";

// The gate: /output/entry.txt must be UTF-8 text of 1 to 200
// characters, not only white space. Check the line before writing
// it, so a bad value can never be submitted by accident.
const chars = [...LINE].length;
if (chars < 1 || chars > 200) {
  console.error(`line is ${chars} characters, must be 1-200`);
  process.exit(1);
}
if (LINE.trim().length === 0) {
  console.error("line must not be only white space");
  process.exit(1);
}
if (/[\p{C}]/u.test(LINE)) {
  console.error("line must not contain control characters");
  process.exit(1);
}
// One line, not two: no newline characters anywhere in the entry.
if (/[\r\n]/.test(LINE)) {
  console.error("line must not contain a newline");
  process.exit(1);
}
// No stray space at either end: a leading or trailing space would
// count toward the 200 characters and read as a sloppy entry.
if (LINE !== LINE.trim()) {
  console.error("line must not start or end with white space");
  process.exit(1);
}

const outputDir = process.env.MAKEFUN_OUTPUT_DIR || "/output";
const outFile = join(outputDir, "entry.txt");
writeFileSync(outFile, LINE, "utf8");

// Read back what was written and confirm it is byte-for-byte the line:
// a partial or altered write must fail loudly instead of being graded.
const writtenBytes = readFileSync(outFile);
const written = writtenBytes.toString("utf8");
if (written !== LINE) {
  console.error("entry.txt does not match the line");
  process.exit(1);
}
if ([...written].length < 1 || [...written].length > 200) {
  console.error("entry.txt must be 1-200 characters");
  process.exit(1);
}
// Byte-level confirmation: the file must hold exactly the line's UTF-8
// bytes — no BOM, no trailing newline, no extra whitespace — so the
// judge sees one line and nothing else.
const expectedBytes = Buffer.from(LINE, "utf8");
if (!writtenBytes.equals(expectedBytes)) {
  console.error("entry.txt bytes do not match the line exactly");
  process.exit(1);
}
