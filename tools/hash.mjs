// Prints answer hashes for a room. Usage: node tools/hash.mjs last-call drawer 0927 [more answers...]
// Answers are normalized like the game does: uppercase, letters and digits only.
import { createHash } from "node:crypto";
const [room, id, ...answers] = process.argv.slice(2);
if (!room || !id || !answers.length) { console.error("usage: node tools/hash.mjs <room> <puzzleId> <answer>..."); process.exit(1); }
const norm = s => s.toUpperCase().replace(/[^A-Z0-9|]/g, "");
for (const a of answers) console.log(JSON.stringify(a), createHash("sha256").update(`lockline|${room}|${id}|${norm(a)}`).digest("hex"));
