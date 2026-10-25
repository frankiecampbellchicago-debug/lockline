# Stakeout

Online escape rooms for multiple screens. A static site with no build step and no server, hosted on GitHub Pages.

- `index.html`: home page
- `rooms/the-last-call.html`: Case 01 sales page
- `play.html`: key check → pick a side → briefing → game
- `legal.html`: terms, privacy, refunds
- `js/config.js`: **store settings (checkout link, product ID, support email)**
- `js/license.js`: Lemon Squeezy license check
- `js/game.js`: game engine (clock, case board, hints, locks, save)
- `js/rooms/last-call.js`: Case 01 content and puzzles
- `tools/hash.mjs`: makes answer hashes for new puzzles

## Design

Colors come from Figma's "Ink wash" palette (charcoal `#1c1e21`, cool gray `#e6e6e1`, ivory `#f6f5f0`). Following Visme's three-color rule, there's one bright accent, tape yellow `#f2c230`. It's always a fill behind charcoal text, never text on ivory. Every text pair passes WCAG AA.

Fonts are Bricolage Grotesque (variable) for headings, Inter (variable) for body text, Courier Prime for case documents, and Caveat for handwriting.

Following Lovable's 2026 trends, the site has one kinetic headline that plays once, small purposeful interactions, `prefers-reduced-motion` support, a skip link, keyboard-friendly locks and visible focus.

## Turning on payments (Lemon Squeezy)

1. Create a store at lemonsqueezy.com. It's free to set up; they take 5% + 50¢ per sale and handle sales tax.
2. Add a product, **The Last Call**, priced at **$10**, as a single payment.
3. In the product, turn on **License keys**: activation limit **6**, no expiry.
4. Under Confirmation, set the button link to `https://<your-site>/play.html?room=last-call`, and mention the key in the email text.
5. Copy the product's **checkout link** and **product ID** into `js/config.js`. Add a support email too.
6. Push. The buy buttons go live and the `PREVIEW` test key stops working.

Test with Lemon Squeezy's test mode first. Test-mode keys validate the same way.

## How a case works

Each puzzle's lock is on one side's screen, and the information needed to open it is on the other side's screen. That means the two devices never have to sync. Progress is saved per device in localStorage.

Answers are stored as SHA-256 hashes: `node tools/hash.mjs last-call <puzzleId> <answer>`.

**Limits to know:** this is a client-side game, so someone determined could read the code (including the hint text) or skip the key check. That's an acceptable risk for a $10 game. Real protection would need a small server that hands out case content only after the key checks out, such as a Cloudflare Worker.
