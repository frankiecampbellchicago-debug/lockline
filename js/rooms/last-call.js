// Case 01 · The Last Call
// Puzzle chain (who holds the lock → who holds the information):
//   records : HQ enters the club's street number      ← Field reads the liquor license (4719)
//   drawer  : Field opens the desk drawer             ← HQ's personnel file: the "songbird's" first night (0927)
//   phone   : HQ dials the burned matchbook number    ← Field's matchbook: "...b Co.", checker stripe, ends 61
//   cigar   : Field opens the cigar box               ← Field's coded ledger + HQ's Navy shift key (7) → MOONGLOW
//   final   : either side names suspect + unit        ← clock vs alibis, cufflink, cab call, lease log + Vince's note
// Answers are stored as SHA-256 hashes (see tools/hash.mjs).
window.LOCKLINE_ROOM = (() => {
  const answers = {
    records: ["b61920246c62603d22845ca29928b37dd209ce7cc1d058a6f531b9d433e6738f"],
    drawer: ["d029beede1a9c22047c75007ed15daa3ed195578f0545ae1c71a41e09ca9ec00"],
    phone: [
      "cf1a381edccbf813c3a4ee2c2416c4e6e78c2ea94fdcdd4ceaacadaa20119771",
      "8d5f8891d742b54caf8c9de35355039c01de831e45e65c0440522b61f5b4545f",
      "7ce9e1480bc5809a415cc907975b05b15a385a4a1a6658d5e09e20ed148f5762",
      "6f5987784931518dc67707303392fe735f6eda88b9892fa17a18b92998b2fbb9",
      "9135b6a9f7a0c43d29d99e7f91d086339620e304820c0fc88fa6f5a1ce4e6627"
    ],
    cigar: ["89cc0a6967c8a6565f37b45548b64b1bdc6a43e4fcf82dcae5762461e22811a9"],
    final: ["a33ee7ebfbcda9c1a81b44b1760369bd590325dc956f8b3c954f01c8eea91cd8"]
  };

  // ---------- art ----------
  const clockSVG = `<svg viewBox="0 0 120 120" role="img" aria-label="A smashed clock. The hour hand sits between 1 and 2; the minute hand points at the 8."><circle cx="60" cy="60" r="54" fill="#fff" stroke="#1c1e21" stroke-width="5"/><g stroke="#1c1e21" stroke-width="3" stroke-linecap="round"><line x1="60" y1="12" x2="60" y2="20"/><line x1="108" y1="60" x2="100" y2="60"/><line x1="60" y1="108" x2="60" y2="100"/><line x1="12" y1="60" x2="20" y2="60"/></g><g fill="#1c1e21" font-family="Courier Prime, monospace" font-size="11" font-weight="700" text-anchor="middle"><text x="60" y="33">12</text><text x="88" y="64">3</text><text x="60" y="94">6</text><text x="32" y="64">9</text></g><line x1="60" y1="60" x2="77" y2="46" stroke="#1c1e21" stroke-width="5" stroke-linecap="round"/><line x1="60" y1="60" x2="30" y2="77" stroke="#1c1e21" stroke-width="3.5" stroke-linecap="round"/><circle cx="60" cy="60" r="4" fill="#1c1e21"/><path d="M70 18 L64 40 L80 46 L72 70 M64 40 L48 34 M80 46 L98 42" fill="none" stroke="#1c1e21" stroke-width="1.4" opacity=".55"/></svg>`;

  // two-row checkerboard band, like a Checker cab's stripe
  const checker = (x, y, w, n = 24) => { const q = w / n; return Array.from({ length: n }, (_, i) =>
    `<rect x="${x + i * q}" y="${y + (i % 2 ? q : 0)}" width="${q}" height="${q}" fill="#1c1e21"/>`).join("") + `<rect x="${x}" y="${y}" width="${w}" height="${q * 2}" fill="none" stroke="#1c1e21" stroke-width="1.5"/>`; };

  const matchbookSVG = `<svg viewBox="0 0 260 170" role="img" aria-label="A burned matchbook. A black-and-white checkered stripe runs across it. The surviving text reads: '...b Co.', 'Day or Night', and the phone number WAbash 2- then two burned digits, then 6 1.">
    <defs><linearGradient id="burn" x1="0" x2="1"><stop offset="0" stop-color="#1c1e21"/><stop offset=".35" stop-color="#5a3d22"/><stop offset=".5" stop-color="#f3e3b5" stop-opacity="0"/></linearGradient></defs>
    <rect x="10" y="10" width="240" height="150" rx="8" fill="#f3e3b5" stroke="#1c1e21" stroke-width="3"/>
    ${checker(10, 34, 240)}
    <text x="150" y="85" font-family="Bricolage Grotesque, sans-serif" font-weight="800" font-size="26" fill="#1c1e21">…b Co.</text>
    <text x="130" y="108" font-family="Courier Prime, monospace" font-size="13" fill="#1c1e21">DAY OR NIGHT</text>
    <text x="70" y="140" font-family="Courier Prime, monospace" font-weight="700" font-size="17" fill="#1c1e21">WAbash 2-</text>
    <rect x="166" y="125" width="28" height="20" fill="#2a1d10" opacity=".85" rx="3"/>
    <text x="198" y="140" font-family="Courier Prime, monospace" font-weight="700" font-size="17" fill="#1c1e21">61</text>
    <path d="M10 18 Q 40 70 22 100 Q 50 130 14 160 L10 160 Z" fill="url(#burn)"/>
    <rect x="10" y="10" width="90" height="150" rx="8" fill="url(#burn)" opacity=".85"/>
  </svg>`;

  // simple portraits: skin, hair color, hat?, scar side, coat color, build
  function portrait({ skin = "#c68a5c", hair = "#1c1e21", hat = "", coat = "#4c5158", scar = "", big = false, woman = false, label }) {
    const sh = big ? "M10 140 Q 14 92 60 88 Q 106 92 110 140 Z" : "M20 140 Q 24 98 60 94 Q 96 98 100 140 Z";
    return `<svg viewBox="0 0 120 140" role="img" aria-label="${label}">
      <rect width="120" height="140" fill="#e6e6e1"/>
      <path d="${sh}" fill="${coat}"/>
      <path d="M50 92 L60 108 L70 92" fill="#f6f5f0"/>
      <rect x="53" y="76" width="14" height="18" fill="${skin}"/>
      <ellipse cx="60" cy="58" rx="${big ? 23 : 20}" ry="25" fill="${skin}"/>
      ${woman ? `<path d="M36 62 Q 34 28 60 30 Q 88 28 84 62 Q 86 80 78 84 L 76 56 Q 60 44 44 56 L 42 84 Q 34 80 36 62 Z" fill="${hair}"/>` : `<path d="M${big ? 37 : 40} 52 Q 44 30 60 31 Q 78 30 ${big ? 83 : 80} 52 Q 70 42 60 42 Q 50 42 ${big ? 37 : 40} 52 Z" fill="${hair}"/>`}
      ${hat ? `<path d="M30 40 Q 60 34 90 40 L 86 44 Q 60 40 34 44 Z" fill="${hat}"/><path d="M42 40 Q 44 20 60 20 Q 76 20 78 40 Z" fill="${hat}"/><rect x="42" y="34" width="36" height="5" fill="#1c1e21" opacity=".5"/>` : ""}
      <circle cx="52" cy="58" r="2.2" fill="#1c1e21"/><circle cx="68" cy="58" r="2.2" fill="#1c1e21"/>
      <path d="M53 72 Q 60 76 67 72" stroke="#1c1e21" stroke-width="2" fill="none" stroke-linecap="round"/>
      ${scar === "right" ? `<path d="M72 60 L 78 72" stroke="#7a2e22" stroke-width="2.4" stroke-linecap="round"/>` : ""}
    </svg>`;
  }

  const scene = `<svg class="scene-svg" viewBox="0 0 1000 600" role="img" aria-label="Vince Hale's office, ransacked. A door crossed with police tape on the left, framed papers on the wall, a desk in the middle with a phone and lamp, a window at night on the right, a shelf with a cigar box, and an open safe. Papers, a knocked-over chair and a smashed clock are on the floor.">
    <defs>
      <pattern id="wp" width="40" height="40" patternUnits="userSpaceOnUse"><rect width="40" height="40" fill="#d9d8d0"/><path d="M20 0v40" stroke="#cfcec5" stroke-width="6"/></pattern>
      <pattern id="planks" width="160" height="30" patternUnits="userSpaceOnUse"><rect width="160" height="30" fill="#4a443c"/><path d="M0 29.5h160M80 0v30" stroke="#3d3832" stroke-width="2"/></pattern>
      <radialGradient id="glow" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#f2c230" stop-opacity=".45"/><stop offset="1" stop-color="#f2c230" stop-opacity="0"/></radialGradient>
    </defs>
    <rect width="1000" height="470" fill="url(#wp)"/>
    <rect y="380" width="1000" height="90" fill="#c9c8bf"/><rect y="376" width="1000" height="8" fill="#a9a89f"/>
    <rect y="470" width="1000" height="130" fill="url(#planks)"/>
    <!-- window -->
    <rect x="720" y="50" width="210" height="200" fill="#1f2a3a" stroke="#1c1e21" stroke-width="8"/>
    <path d="M724 250V170h30v-30h26v50h22v-70h34v90h24v-40h30v-20h26v120z" fill="#2c3a4e"/>
    <g fill="#f2c230"><rect x="760" y="150" width="6" height="8"/><rect x="812" y="132" width="6" height="8"/><rect x="822" y="160" width="6" height="8"/><rect x="866" y="200" width="6" height="8"/><rect x="896" y="176" width="6" height="8"/></g>
    <circle cx="890" cy="90" r="16" fill="#f6f5f0" opacity=".85"/>
    <path d="M825 50v200M720 150h210" stroke="#1c1e21" stroke-width="6"/>
    <!-- door + tape -->
    <rect x="40" y="130" width="150" height="340" fill="#6b5a48" stroke="#1c1e21" stroke-width="4"/>
    <rect x="62" y="152" width="106" height="130" fill="none" stroke="#54463a" stroke-width="4"/><rect x="62" y="302" width="106" height="140" fill="none" stroke="#54463a" stroke-width="4"/>
    <circle cx="170" cy="310" r="7" fill="#c9a227"/>
    <rect x="182" y="190" width="10" height="24" fill="#a9a89f"/><rect x="182" y="390" width="10" height="24" fill="#a9a89f"/>
    <g transform="rotate(-14 115 260)"><rect x="10" y="246" width="210" height="26" fill="#f2c230"/><text x="115" y="264" text-anchor="middle" font-family="Courier Prime, monospace" font-weight="700" font-size="13" fill="#1c1e21">POLICE LINE · DO NOT CROSS</text></g>
    <g transform="rotate(10 115 340)"><rect x="10" y="328" width="210" height="26" fill="#f2c230"/><text x="115" y="346" text-anchor="middle" font-family="Courier Prime, monospace" font-weight="700" font-size="13" fill="#1c1e21">POLICE LINE · DO NOT CROSS</text></g>
    <!-- license -->
    <rect x="225" y="95" width="130" height="95" fill="#fbf8ef" stroke="#3a2e22" stroke-width="6"/>
    <rect x="240" y="108" width="100" height="6" fill="#4c5158"/><rect x="250" y="122" width="80" height="4" fill="#9a9a92"/><rect x="250" y="132" width="80" height="4" fill="#9a9a92"/><rect x="250" y="142" width="60" height="4" fill="#9a9a92"/>
    <circle cx="326" cy="168" r="11" fill="none" stroke="#b3261e" stroke-width="3"/>
    <!-- band photo, hanging crooked -->
    <g transform="rotate(-5 480 138)">
      <rect x="390" y="80" width="180" height="115" fill="#2b2d31" stroke="#3a2e22" stroke-width="6"/>
      <g fill="#6b6f76"><circle cx="420" cy="130" r="9"/><rect x="410" y="140" width="20" height="40"/><circle cx="452" cy="126" r="9"/><rect x="442" y="136" width="20" height="44"/><circle cx="487" cy="118" r="12"/><rect x="473" y="131" width="28" height="49"/><circle cx="522" cy="128" r="9"/><rect x="512" y="138" width="20" height="42"/><circle cx="550" cy="130" r="9"/><rect x="540" y="140" width="20" height="40"/></g>
      <path d="M498 140 l22 -8 l2 6 l-22 8z" fill="#c9a227"/>
    </g>
    <!-- shelf + cigar box -->
    <rect x="760" y="300" width="190" height="10" fill="#5a4632"/><path d="M780 310l10 22M930 310l-10 22" stroke="#5a4632" stroke-width="6"/>
    <rect x="795" y="266" width="96" height="34" fill="#8b5a2b" stroke="#1c1e21" stroke-width="2"/><rect x="795" y="266" width="96" height="9" fill="#6e4520"/>
    <rect x="822" y="279" width="42" height="13" fill="#f3e3b5"/><text x="843" y="289" text-anchor="middle" font-family="Courier Prime, monospace" font-size="9" font-weight="700" fill="#1c1e21">HAVANA</text>
    <rect x="880" y="280" width="16" height="16" rx="3" fill="#c9a227" stroke="#1c1e21" stroke-width="2"/>
    <!-- safe -->
    <rect x="790" y="350" width="140" height="150" fill="#22252a" stroke="#1c1e21" stroke-width="4"/>
    <rect x="800" y="420" width="120" height="6" fill="#3b3f45"/>
    <path d="M930 350 L978 368 L978 512 L930 500 Z" fill="#50555c" stroke="#1c1e21" stroke-width="4"/>
    <circle cx="955" cy="432" r="13" fill="#3b3f45" stroke="#c9c8bf" stroke-width="3"/>
    <rect x="815" y="460" width="22" height="12" fill="#2e6b3f" opacity=".8" transform="rotate(-10 826 466)"/>
    <!-- desk -->
    <ellipse cx="640" cy="300" rx="130" ry="70" fill="url(#glow)"/>
    <rect x="290" y="330" width="420" height="22" fill="#5a4632" stroke="#1c1e21" stroke-width="3"/>
    <rect x="305" y="352" width="390" height="118" fill="#6b5640" stroke="#1c1e21" stroke-width="3"/>
    <rect x="318" y="364" width="120" height="46" fill="#5d4a36" stroke="#1c1e21" stroke-width="2"/><rect x="318" y="416" width="120" height="46" fill="#5d4a36" stroke="#1c1e21" stroke-width="2"/>
    <rect x="562" y="364" width="120" height="46" fill="#5d4a36" stroke="#1c1e21" stroke-width="2"/><rect x="562" y="416" width="120" height="46" fill="#5d4a36" stroke="#1c1e21" stroke-width="2"/>
    <g fill="#c9a227"><rect x="370" y="383" width="16" height="5" rx="2"/><rect x="370" y="435" width="16" height="5" rx="2"/><rect x="614" y="435" width="16" height="5" rx="2"/></g>
    <rect x="610" y="378" width="22" height="20" rx="3" fill="#c9a227" stroke="#1c1e21" stroke-width="2"/><path d="M614 378v-6a7 7 0 0 1 14 0v6" fill="none" stroke="#1c1e21" stroke-width="3"/>
    <!-- desk top: lamp, phone, papers -->
    <path d="M640 330v-46" stroke="#1c1e21" stroke-width="5"/><path d="M612 290h56l-12 -30h-32z" fill="#2e6b3f" stroke="#1c1e21" stroke-width="3"/><rect x="624" y="325" width="32" height="7" fill="#1c1e21"/>
    <rect x="340" y="312" width="58" height="20" rx="6" fill="#1c1e21"/><path d="M350 312q19-22 38 0" fill="none" stroke="#1c1e21" stroke-width="7"/>
    <path d="M405 330q20 30 4 70" fill="none" stroke="#1c1e21" stroke-width="2.5"/><rect x="400" y="398" width="34" height="12" rx="5" fill="#1c1e21"/>
    <rect x="455" y="318" width="80" height="14" fill="#fbf8ef" stroke="#9a9a92"/><rect x="470" y="322" width="44" height="2" fill="#9a9a92"/>
    <!-- floor mess -->
    <g transform="rotate(-24 230 505)"><rect x="200" y="470" width="14" height="70" fill="#5a4632"/><rect x="250" y="470" width="14" height="70" fill="#5a4632"/><rect x="196" y="462" width="72" height="12" fill="#6b5640"/></g>
    <rect x="300" y="520" width="60" height="42" fill="#fbf8ef" transform="rotate(14 330 540)"/><rect x="660" y="530" width="56" height="40" fill="#fbf8ef" transform="rotate(-18 690 550)"/><rect x="380" y="560" width="50" height="34" fill="#f3efe2" transform="rotate(-6 405 577)"/>
    <rect x="216" y="538" width="46" height="24" fill="#f3e3b5" stroke="#1c1e21" stroke-width="1.5" transform="rotate(-12 239 550)"/>
    <g transform="translate(590 548) scale(.5) translate(-60 -60)">${clockSVG.replace(/^<svg[^>]*>/, "").replace(/<\/svg>$/, "")}</g>
    <circle cx="472" cy="522" r="6" fill="#c9a227" stroke="#1c1e21" stroke-width="1.5"/><path d="M478 512l4 -6M482 520h6" stroke="#f2c230" stroke-width="2" stroke-linecap="round"/>
  </svg>`;

  // ---------- Field: things to examine ----------
  // x/y are hotspot positions in % of the scene.
  const spots = [
    { id: "license", x: 29, y: 24, label: "Framed certificate" },
    { id: "photo", x: 48, y: 23, label: "Band photo" },
    { id: "door", x: 17, y: 52, label: "Office door" },
    { id: "window", x: 82, y: 25, label: "Window" },
    { id: "desk", x: 50, y: 54, label: "Desk" },
    { id: "drawer", x: 62, y: 65, label: "Locked drawer" },
    { id: "phone", x: 37, y: 50, label: "Telephone" },
    { id: "cigar", x: 84, y: 46, label: "Cigar box" },
    { id: "safe", x: 86, y: 70, label: "Open safe" },
    { id: "clock", x: 59, y: 91, label: "Smashed clock" },
    { id: "cufflink", x: 47, y: 85, label: "Something shiny" },
    { id: "ticket", x: 24, y: 90, label: "Ticket stub" }
  ];

  const doc = (inner, cls = "") => `<div class="doc ${cls}">${inner}</div>`;
  const note = text => `<div class="handnote">${text}</div>`;
  const ledgerHTML = doc(`<p class="doc-h">— last page, torn from a ledger —</p>
    <table class="ledger"><tbody>
      <tr><td>VJA 1</td><td>S.J.</td><td>WHPK PU MBSS</td></tr>
      <tr><td>VJA 2</td><td>L.T.</td><td>VDLZ MVBY NYHUK</td></tr>
      <tr><td colspan="3" class="ledger-last">IVE DVYK — TVVUNSVD</td></tr>
    </tbody></table>
    <p class="small muted">Vince's handwriting. Every word is gibberish, but the digits look normal.</p>`, "doc--ledger");

  function fieldItem(ctx, id) {
    const solved = ctx.solved;
    switch (id) {
      case "license": return ["Framed certificate", doc(`
        <p class="doc-h">City of Chicago · Liquor Control Commission</p>
        <h3 class="doc-title">Retail Liquor Dealer's License</h3>
        <dl class="doc-dl"><dt>License no.</dt><dd>52-1187</dd><dt>Issued to</dt><dd>Vincent J. Hale</dd><dt>Doing business as</dt><dd>The Blue Heron</dd><dt>Premises</dt><dd>4719 S. State St., Chicago, Ill.</dd><dt>Expires</dt><dd>April 30, 1953</dd></dl>
        <p class="small muted">Must be displayed in plain view on the licensed premises.</p>`)];
      case "photo": return ["Band photo", `<div>
        <div class="photo-frame"><svg viewBox="0 0 360 200" role="img" aria-label="Black and white photo of five musicians on the club's stage. In the middle, the tallest and broadest man holds a trumpet."><rect width="360" height="200" fill="#3b3f45"/><rect y="150" width="360" height="50" fill="#2b2d31"/>${[40, 105, 180, 255, 320].map((x, i) => `<circle cx="${x}" cy="${i === 2 ? 62 : 78}" r="${i === 2 ? 20 : 15}" fill="#9a9ea5"/><rect x="${x - (i === 2 ? 26 : 18)}" y="${i === 2 ? 84 : 95}" width="${i === 2 ? 52 : 36}" height="${i === 2 ? 90 : 75}" rx="8" fill="#6b6f76"/>`).join("")}<path d="M196 112 l44 -14 l3 9 l-44 14 z" fill="#d6c27a"/><circle cx="244" cy="101" r="8" fill="#d6c27a"/></svg></div>
        ${doc(`<p class="typed">THE BLUE HERON ORCHESTRA · 1951</p><p class="small">L to R: Lou Pratt (piano) · Ruby Lane (vocals) · Eddie Marsh (trumpet, bandleader) · Jimmy Ruiz (bass) · Sam "Tiny" Cole (drums)</p>`)}
        <p class="muted small">The frame hangs crooked, as if someone bumped it hard.</p></div>`];
      case "door": return ["Office door", `<div><p>The lock wasn't forced; whoever came in, Vince let them in.</p><p>A few <strong>green wool fibers</strong> are snagged on the upper hinge, at about shoulder height for a short person.</p></div>`];
      case "window": return ["Window", `<div><p>Latched from the inside, and the fire escape is rusted solid. Nobody came or went this way.</p><p>Down in the alley, fresh tire tracks lead from the club's back door toward the street.</p></div>`];
      case "phone": return ["Telephone", `<div><p>The receiver is off the hook, dangling by its cord. Somebody either grabbed for it or knocked it flying.</p><p class="muted small">Phones in 1952 don't remember the last number dialed. You'll have to find it another way.</p></div>`];
      case "safe": return ["Open safe", `<div><p>The door is open and there are no scratches on the dial. Whoever opened it knew the combination, or made Vince open it.</p><p>A few loose bills are still inside. <strong>This wasn't a robbery.</strong> On the top shelf, a clean rectangle in the dust shows where a thick book used to sit. It's the only thing missing.</p></div>`];
      case "clock": return ["Smashed clock", `<div class="clock-item">${clockSVG}<p>Knocked off the wall during a struggle. The glass is shattered and the hands are stuck.</p></div>`];
      case "cufflink": return ["Something shiny", `<div class="cuff-item"><svg viewBox="0 0 120 80" role="img" aria-label="A gold cufflink shaped like two joined eighth notes, with a bent post."><g fill="#c9a227" stroke="#1c1e21" stroke-width="2"><ellipse cx="38" cy="58" rx="13" ry="10"/><ellipse cx="82" cy="52" rx="13" ry="10"/><rect x="47" y="14" width="6" height="44"/><rect x="91" y="8" width="6" height="44"/><path d="M47 14 L97 8 L97 18 L47 24 Z"/></g><path d="M60 70 q6 6 14 2" stroke="#9a9a92" stroke-width="3" fill="none"/></svg><p>Under the desk: a single <strong>gold cufflink shaped like two musical notes</strong>. Its post is bent, as if it was torn off a sleeve.</p></div>`];
      case "ticket": return ["Ticket stub", doc(`
        <p class="doc-h">Lakefront Cold Storage Co.</p>
        <h3 class="doc-title">Pier 9 · Claim Check</h3>
        <dl class="doc-dl"><dt>Unit no.</dt><dd><span class="smudge" aria-label="smudged, unreadable">▓▓</span></dd><dt>Leased</dt><dd>Oct. 1, 1952</dd><dt>Term</dt><dd>1 week · paid in cash</dd><dt>Lessee</dt><dd><span class="smudge" aria-label="smudged, unreadable">▓▓▓▓▓▓</span></dd></dl>
        <p class="small muted">Found on the floor by the door. It's damp and the ink has run.</p>`, "doc--ticket")];
      case "desk": return ["Desk", `<div>${note("Drawer = the night our songbird first sang.<br>Month, day. &nbsp;—V")}<p>A note in Vince's handwriting sits under the blotter. The right-hand drawer has a <strong>4-digit padlock</strong> on it.</p><button class="btn" type="button" data-goto="drawer">Look at the drawer</button></div>`];
      case "drawer": {
        if (solved("drawer")) return ["Desk drawer (open)", drawerContents(ctx)];
        const w = ctx.wheels({ length: 4, kind: "digits", label: "Drawer padlock" });
        const box = ctx.h(`<div><p>A brass 4-digit padlock. Vince's note says: <em>"the night our songbird first sang. Month, day."</em></p></div>`);
        box.append(ctx.lockForm({ id: "drawer", control: w, button: "Open drawer", onSolve: () => ctx.open(...fieldItemArgs(ctx, "drawer")) }));
        return ["Locked drawer", box];
      }
      case "cigar": {
        if (solved("cigar")) return ["Cigar box (open)", cigarContents()];
        const w = ctx.wheels({ length: 8, kind: "letters", label: "Cigar box letter lock" });
        const box = ctx.h(`<div><p>A Havana cigar box with a small <strong>8-letter combination lock</strong>. It's heavy; something besides cigars is inside.</p></div>`);
        box.append(ctx.lockForm({ id: "cigar", control: w, button: "Open box", onSolve: () => ctx.open(...fieldItemArgs(ctx, "cigar")) }));
        return ["Cigar box", box];
      }
    }
  }
  const fieldItemArgs = (ctx, id) => { const [t, c] = fieldItem(ctx, id); return [t, c, { id, wide: ["drawer", "photo", "cigar"].includes(id) }]; };

  function drawerContents(ctx) {
    const box = ctx.h(`<div class="drawer-grid">
      <figure class="ev"><div class="ev-art">${matchbookSVG}</div><figcaption><strong>Matchbook</strong>, half burned. The phone number is partly gone.</figcaption></figure>
      <figure class="ev">${ledgerHTML}<figcaption><strong>Ledger page</strong>, torn out. The rest of the book is missing.</figcaption></figure>
      <figure class="ev">${doc(`<p class="doc-title" style="font-size:1.2rem">Leo Castellano</p><p class="typed small">THE VELVET ROOM · DRexel 3-0505</p>${note("Offer stands. Let's talk about the Heron. —L")}`)}<figcaption><strong>Business card</strong>, with a note on the back.</figcaption></figure>
    </div>`);
    return box;
  }
  function cigarContents() {
    return `<div>${doc(`<p class="doc-h">Folded inside the box, in Vince's hand</p>
      <div class="handnote handnote--long">If you're reading this, something happened to me.<br><br>
      Eddie Marsh — <u>"Two-Tone"</u> to the band — owes me $4,000, and he's been skimming the door money for months. Tonight I told him I'm taking my ledger to the police on Monday.<br><br>
      He laughed. He didn't look like he was laughing.<br><br>— V.H.</div>`)}
      <p class="muted small">Under the note: three cigars and a roll of twenties. Vince was hiding the note from someone who'd look in the obvious places.</p></div>`;
  }

  // ---------- HQ: records desk ----------
  const personnel = [
    ["Sal Ortiz", "Head bartender", "06/02/1946"],
    ["Eddie Marsh", "Bandleader, trumpet", "03/11/1947"],
    ["Ruby Lane", 'Featured vocalist, billed as "the Songbird of State Street"', "09/27/1948"],
    ["Lou Pratt", "Piano", "11/19/1949"],
    ["Dot Freeman", "Hat check", "01/08/1950"],
    ["Jimmy Ruiz", "Bass", "02/14/1951"],
    ["Cora Bell", "Fill-in vocalist, Tuesdays only", "05/05/1951"],
    ["Sam \"Tiny\" Cole", "Drums", "07/30/1951"]
  ];
  const suspects = [
    { id: "ruby", name: "Ruby Lane", age: 29, art: { skin: "#a0673f", hair: "#2b1a10", coat: "#2e6b3f", woman: true, label: "Ruby Lane: young woman, dark curled hair, green coat." },
      desc: "5'4\", slim. Rarely seen without her green wool coat.", alibi: "Sang the late set at the Savoy Ballroom from 12:45 to 2:30 AM. Confirmed by the manager and a full house.", record: "None.", notes: "Her contract with Hale is up for renewal. The bartender says they argued about money last week." },
    { id: "eddie", name: "Eddie Marsh", age: 38, art: { skin: "#7a4b2c", hair: "#1c1e21", coat: "#1f3a5f", big: true, label: "Eddie Marsh: tall, heavyset man in a navy suit." },
      desc: "6'3\", 230 lbs. Bandleader and trumpet player at the Blue Heron.", alibi: "Says he left the Heron at 1:00 AM and walked home alone. No witnesses.", record: "1950: disorderly conduct (bar fight). Personal effects at booking: wallet, harmonica, house keys, pair of gold cufflinks shaped like musical notes.", notes: "Known to gamble on the horses." },
    { id: "leo", name: "Leo Castellano", age: 51, art: { skin: "#d9a982", hair: "#9a9a92", coat: "#2b2d31", hat: "#3b3f45", scar: "right", label: "Leo Castellano: older man in a dark fedora with a scar on his right cheek." },
      desc: "5'9\". Owner of the Velvet Room. Scar on his right cheek.", alibi: "Hosted a private party at the Velvet Room from 11 PM to 4 AM. Forty guests, a newspaper photographer and an alderman vouch for him.", record: "Questioned in 1949 about bribery. No charges.", notes: "Has offered to buy the Blue Heron three times this year." },
    { id: "mae", name: "Mae Hale", age: 41, art: { skin: "#e3b48f", hair: "#6e4520", coat: "#8b5a2b", woman: true, label: "Mae Hale: woman with auburn hair in a brown coat." },
      desc: "5'6\". Vincent Hale's wife of eleven years.", alibi: "Says she was home in Hyde Park, asleep. Alone.", record: "None.", notes: "Took out a $20,000 life insurance policy on her husband in August." }
  ];
  const directory = [
    { name: "Blue Heron, The (nightclub)", num: "KEnwood 6-4719", ico: "note" },
    { name: "Blue Ribbon Cab Co.", num: "WAbash 2-7714", ico: "cab" },
    { name: "Checker Cab Co.", num: "WAbash 2-3361", ico: "cabcheck" },
    { name: "Checkerboard Club (billiards)", num: "WAbash 2-1161", ico: "board" },
    { name: "Checkmate Chess Club", num: "WAbash 2-2861", ico: "knight" },
    { name: "Hale, Vincent J. (residence)", num: "HYde Park 3-2210", ico: "house" },
    { name: "Lakefront Cold Storage Co., Pier 9", num: "FRanklin 2-9090", ico: "snow" },
    { name: "Savoy Ballroom", num: "KEnwood 6-1200", ico: "note" },
    { name: "Velvet Room, The (nightclub)", num: "DRexel 3-0505", ico: "note" },
    { name: "Yellow Cab Co.", num: "WAbash 2-4461", ico: "cab" }
  ];
  const icons = {
    cab: `<svg viewBox="0 0 40 24"><rect x="2" y="9" width="36" height="10" rx="3" fill="#1c1e21"/><path d="M9 9l4-6h14l4 6z" fill="#1c1e21"/><circle cx="11" cy="20" r="3" fill="#f6f5f0" stroke="#1c1e21" stroke-width="2"/><circle cx="29" cy="20" r="3" fill="#f6f5f0" stroke="#1c1e21" stroke-width="2"/></svg>`,
    cabcheck: `<svg viewBox="0 0 40 24"><rect x="2" y="9" width="36" height="10" rx="3" fill="#1c1e21"/><path d="M9 9l4-6h14l4 6z" fill="#1c1e21"/>${Array.from({ length: 8 }, (_, i) => `<rect x="${3 + i * 4.25}" y="${i % 2 ? 14 : 11}" width="4.25" height="3" fill="#f6f5f0"/>`).join("")}<circle cx="11" cy="20" r="3" fill="#f6f5f0" stroke="#1c1e21" stroke-width="2"/><circle cx="29" cy="20" r="3" fill="#f6f5f0" stroke="#1c1e21" stroke-width="2"/></svg>`,
    board: `<svg viewBox="0 0 40 24"><rect x="10" y="2" width="20" height="20" fill="#f6f5f0" stroke="#1c1e21" stroke-width="2"/>${[0, 1, 2, 3].flatMap(r => [0, 1, 2, 3].filter(c => (r + c) % 2).map(c => `<rect x="${10 + c * 5}" y="${2 + r * 5}" width="5" height="5" fill="#1c1e21"/>`)).join("")}</svg>`,
    knight: `<svg viewBox="0 0 40 24"><path d="M14 22h14v-3h-2l-1-6 3-2-2-7-6 2-5 6 2 2 4-2-4 7h-3z" fill="#1c1e21"/></svg>`,
    note: `<svg viewBox="0 0 40 24"><path d="M16 18a3 3 0 1 1-2-2.8V4l12-2v13a3 3 0 1 1-2-2.8V6l-8 1.4z" fill="#1c1e21"/></svg>`,
    house: `<svg viewBox="0 0 40 24"><path d="M10 12L20 3l10 9v10H10z" fill="#1c1e21"/><rect x="18" y="15" width="4" height="7" fill="#f6f5f0"/></svg>`,
    snow: `<svg viewBox="0 0 40 24"><path d="M20 2v20M11 7l18 10M29 7L11 17" stroke="#1c1e21" stroke-width="2.4" stroke-linecap="round"/></svg>`
  };
  // What you hear when HQ dials a number that isn't the answer (keyed by last 4 digits).
  const decoyCalls = {
    "4719": "The Blue Heron. It just rings and rings. Everyone's at the precinct or the scene.",
    "7714": "Blue Ribbon Cab, night desk: \"Nobody of ours was near State Street last night, officer. Slow night.\"",
    "1161": "Checkerboard Club: \"We closed at midnight. Nobody here but the cue balls.\"",
    "2861": "Checkmate Chess Club: a very sleepy man tells you they close at nine and hangs up.",
    "2210": "The Hale residence. Mae Hale answers, voice shaking: \"Have you found him? Please call the minute you know anything.\"",
    "9090": "Lakefront Cold Storage: a recording says the office opens at 7 AM.",
    "1200": "Savoy Ballroom: \"Ruby Lane? Sure, she closed our show. Sang till 2:30, a whole room saw her.\"",
    "0505": "The Velvet Room: \"Mr. Castellano's party went till four. Ask the alderman, he was dancing on a table.\"",
    "4461": "Yellow Cab dispatch: \"Nothing from the Heron on our sheets last night, sorry, officer.\""
  };
  const leases = [
    ["09/26", "4", "Calumet Fish Co.", "Monthly · check"],
    ["09/29", "5", "T. Tolliver", "1 week · cash"],
    ["10/01", "3", "Great Lakes Ice & Fuel", "Monthly · check"],
    ["10/01", "7", "J. Smith", "1 week · check"],
    ["10/01", "12", "T. Tone", "1 week · cash"],
    ["10/01", "15", "T. Thomas", "1 week · cash"],
    ["10/02", "9", "Mrs. M. Hale", "Seasonal · fur storage"],
    ["10/02", "11", "Velvet Room, Inc.", "Monthly · check"]
  ];

  function hqTabs(ctx) {
    const phoneDone = ctx.solved("phone");
    return [
      { id: "case", label: "Case file" },
      { id: "staff", label: "Club staff" },
      { id: "suspects", label: "Suspects" },
      { id: "directory", label: "City directory" },
      { id: "telephone", label: "Telephone" },
      { id: "harbor", label: "Harbor records", locked: !phoneDone },
      { id: "callit", label: "Call it in", locked: !phoneDone }
    ];
  }

  function hqPanel(ctx, id) {
    const h = ctx.h;
    switch (id) {
      case "case": return h(`<div>
        ${doc(`<p class="doc-h">Chicago Police Dept. · 2nd District · Incident report</p>
          <h3 class="doc-title">Missing person: Vincent J. Hale</h3>
          <dl class="doc-dl"><dt>Reported</dt><dd>2:30 AM by Sal Ortiz, head bartender</dd><dt>Location</dt><dd>The Blue Heron, owner's office (2nd floor)</dd><dt>Scene</dt><dd>Office ransacked, safe open, signs of a struggle</dd></dl>
          <p><strong>Statement, S. Ortiz:</strong> "I was cleaning up downstairs after close. Around 1:40 I heard a crash upstairs. I figured it was the band moving their gear. When I went up at 2:30 to say goodnight, the place was torn apart and Vince was gone."</p>`)}
        ${doc(`<p class="doc-h">Victim profile</p>
          <h3 class="doc-title">Hale, Vincent James · age 46</h3>
          <dl class="doc-dl"><dt>Occupation</dt><dd>Owner, The Blue Heron (since 1946)</dd><dt>Family</dt><dd>Wife, Mae Hale</dd><dt>Record</dt><dd>None</dd><dt>Service</dt><dd>U.S. Navy, 1942–45. Radioman and code clerk aboard the destroyer escort <strong>USS Garrison (DE-7)</strong>.</dd></dl>
          <p><strong>Statement, Mae Hale:</strong> "Vince never trusted banks or bookkeepers. He wrote his ledger in a code from his Navy days: every letter pushed forward by the number of his old ship. He said nobody would ever crack it."</p>`)}
      </div>`);
      case "staff": return h(`<div>${doc(`<p class="doc-h">Liquor Control Commission · Employee register on file</p>
        <h3 class="doc-title">The Blue Heron · Staff</h3>
        <div class="table-wrap"><table class="rec"><thead><tr><th scope="col">Name</th><th scope="col">Position</th><th scope="col">First night at the Heron</th></tr></thead><tbody>
        ${personnel.map(p => `<tr><td>${p[0]}</td><td>${p[1]}</td><td class="typed">${p[2]}</td></tr>`).join("")}
        </tbody></table></div><p class="small muted">Dates are month/day/year.</p>`)}</div>`);
      case "suspects": return h(`<div class="suspects">${suspects.map(s => `<article class="sus">
        <div class="sus-pic">${portrait(s.art)}</div>
        <div class="sus-body"><h3>${s.name} <span class="muted typed">· ${s.age}</span></h3>
        <dl class="doc-dl"><dt>Description</dt><dd>${s.desc}</dd><dt>Alibi</dt><dd>${s.alibi}</dd><dt>Record</dt><dd>${s.record}</dd><dt>Notes</dt><dd>${s.notes}</dd></dl></div>
      </article>`).join("")}</div>`);
      case "directory": return h(`<div>${doc(`<p class="doc-h">Chicago Classified Telephone Directory · 1952</p>
        <h3 class="doc-title">Page 214</h3>
        <ul class="dir">${directory.map(d => `<li><span class="dir-ico" aria-hidden="true">${icons[d.ico]}</span><span class="dir-name">${d.name}</span><span class="dir-dots" aria-hidden="true"></span><span class="dir-num typed">${d.num}</span></li>`).join("")}</ul>
        <p class="small muted">Exchanges are written as two letters + digits. "WAbash 2-7714" is dialed WA2-7714.</p>`, "doc--dir")}</div>`);
      case "telephone": {
        const box = h(`<div class="phone-desk">
          <p>Dial any Chicago number. Use the exchange letters and the digits, e.g. <span class="typed">WA2-7714</span>.</p>
          <div class="call-log" aria-live="polite"></div>
        </div>`);
        const log = box.querySelector(".call-log");
        if (ctx.solved("phone")) log.append(h(transcriptHTML()));
        const input = h(`<input class="dial-input" aria-label="Number to dial" autocomplete="off" placeholder="WA2-0000">`);
        const form = ctx.lockForm({
          id: "phone", control: input, button: "Dial",
          wrong: v => { const last4 = v.replace(/\D/g, "").slice(-4); return decoyCalls[last4] || "\"The number you have dialed is not in service.\""; },
          onSolve: () => { ctx.toast("New file: <strong>Harbor records</strong>", "good"); hqState.tab = "telephone"; ctx.rerender(); }
        });
        if (!ctx.solved("phone")) box.insertBefore(form, log);
        return box;
      }
      case "harbor": return h(`<div>${doc(`<p class="doc-h">Chicago Harbor Authority · Lease log</p>
        <h3 class="doc-title">Lakefront Cold Storage Co. · Pier 9</h3>
        <div class="table-wrap"><table class="rec"><thead><tr><th scope="col">Date</th><th scope="col">Unit</th><th scope="col">Lessee</th><th scope="col">Terms</th></tr></thead><tbody>
        ${leases.map(l => `<tr><td class="typed">${l[0]}</td><td class="typed">${l[1]}</td><td>${l[2]}</td><td>${l[3]}</td></tr>`).join("")}
        </tbody></table></div><p class="small muted">Units are refrigerated. Temperature held at 28°F.</p>`)}</div>`);
      case "callit": return finalForm(ctx);
    }
  }

  function transcriptHTML() {
    return `<div class="transcript doc"><p class="doc-h">Call · Checker Cab Co. · Night dispatch</p>
      <p>"Checker Cab. …The Blue Heron? Yeah, hold on. Here it is: <strong>Car 31</strong>, alley door of the Heron, <strong>1:52 AM</strong>.</p>
      <p>Driver says two fellas. One was out cold, and the other was holding him up, said his pal had one too many. <strong>Big fella, carrying a trumpet case.</strong></p>
      <p>Fare went down to the lakefront: <strong>Pier 9, the cold-storage sheds</strong>. Big fella tipped in quarters, like he'd been playing for tips all night. That help you, officer?"</p></div>`;
  }

  function finalForm(ctx) {
    const box = ctx.h(`<div class="final">
      <p>When you're sure, call it in. A wrong call sends the squad to the wrong place and costs you <strong>3 minutes</strong>.</p>
      <fieldset class="sus-pick"><legend>Who took Vince?</legend>
        ${suspects.map(s => `<label class="pick"><input type="radio" name="who" value="${s.id}"><span>${s.name}</span></label>`).join("")}
      </fieldset>
      <label class="unit-l" for="unit-in">Where is he? Pier 9, unit number</label>
    </div>`);
    const unit = ctx.h(`<input id="unit-in" class="dial-input unit-in" inputmode="numeric" autocomplete="off" placeholder="00">`);
    const form = ctx.lockForm({
      id: "final", control: unit, button: "Send the squad",
      getValue: () => (box.querySelector("input[name=who]:checked")?.value || "") + "|" + unit.value,
      wrong: v => {
        if (v.startsWith("|")) return "Pick a suspect first.";
        if (!v.split("|")[1].trim()) return "Enter a unit number.";
        ctx.penalize(180);
        return "The squad comes back empty-handed. Something doesn't add up. (+3:00)";
      },
      onSolve: () => ctx.finish()
    });
    box.append(form);
    return box;
  }

  // ---------- render ----------
  const hqState = { tab: "case" };

  function renderField(ctx, main) {
    const wrap = ctx.h(`<div class="field">
      <div class="scene-head"><h1 class="view-h">Vince's office</h1><p class="muted">Select anything to take a closer look. Describe what you find to HQ.</p></div>
      <div class="scene">${scene}<div class="hotspots"></div></div>
      <h2 class="sub-h">Things to examine</h2>
      <ul class="examine"></ul>
    </div>`);
    const hs = wrap.querySelector(".hotspots"), list = wrap.querySelector(".examine");
    for (const s of spots) {
      const label = s.id === "drawer" && ctx.solved("drawer") ? "Open drawer" : s.id === "cigar" && ctx.solved("cigar") ? "Open cigar box" : s.label;
      const seen = ctx.seen(s.id) ? " seen" : "";
      const btn = ctx.h(`<button class="hs${seen}" style="left:${s.x}%;top:${s.y}%" aria-label="${label}"><span class="hs-tip">${label}</span></button>`);
      const li = ctx.h(`<li><button class="ex-btn${seen}">${label}${seen ? '<span class="sr-only"> (seen)</span>' : ""}</button></li>`);
      const go = () => openSpot(ctx, s.id);
      btn.addEventListener("click", go);
      li.querySelector("button").addEventListener("click", go);
      hs.append(btn);
      list.append(li);
    }
    main.append(wrap);
  }
  function openSpot(ctx, id) {
    const [title, content, opts] = fieldItemArgs(ctx, id);
    const node = typeof content === "string" ? ctx.h(content) : content;
    node.querySelectorAll?.("[data-goto]").forEach(b => b.addEventListener("click", () => openSpot(ctx, b.dataset.goto)));
    ctx.open(title, node, Object.assign({}, opts, { onClose: () => ctx.rerender() }));
  }

  function renderHQ(ctx, main) {
    if (!ctx.solved("records")) {
      const wrap = ctx.h(`<div class="hq-gate">
        <div class="doc gate-doc"><p class="doc-h">Chicago Police Dept. · Records division</p>
        <h1 class="doc-title">File request</h1>
        <p>Files are pulled by incident address. The Blue Heron is on <strong>S. State St.</strong>, but the request needs the street number.</p>
        <p class="muted small">The Field team is standing in the club. Ask them.</p></div>
      </div>`);
      const w = ctx.wheels({ length: 4, kind: "digits", label: "Street number" });
      wrap.querySelector(".gate-doc").append(ctx.lockForm({ id: "records", control: w, button: "Pull the files", wrong: "\"No incident on file at that address,\" says the clerk." }));
      main.append(wrap);
      return;
    }
    const tabs = hqTabs(ctx);
    if (tabs.find(t => t.id === hqState.tab)?.locked) hqState.tab = "case";
    const wrap = ctx.h(`<div class="hq">
      <div class="scene-head"><h1 class="view-h">Records desk</h1><p class="muted">The Field team can't see any of this. Read things out to them.</p></div>
      <div class="hq-grid">
        <div class="tabs" role="tablist" aria-label="Files" aria-orientation="vertical"></div>
        <div class="tabpanel" role="tabpanel" tabindex="0"></div>
      </div>
    </div>`);
    const tl = wrap.querySelector(".tabs"), panel = wrap.querySelector(".tabpanel");
    tabs.forEach(t => {
      const b = ctx.h(`<button role="tab" id="tab-${t.id}" class="tab${t.locked ? " locked" : ""}" aria-selected="${t.id === hqState.tab}" ${t.locked ? 'aria-disabled="true"' : ""} tabindex="${t.id === hqState.tab ? 0 : -1}">${t.label}${t.locked ? ' <span class="lock-ico" aria-label="(locked)">🔒</span>' : ""}</button>`);
      b.addEventListener("click", () => {
        if (t.locked) { ctx.toast(t.id === "harbor" ? "You'll need a reason to request harbor records." : "You're not ready to call it in yet."); return; }
        hqState.tab = t.id; ctx.rerender();
        document.getElementById("tab-" + t.id)?.focus();
      });
      b.addEventListener("keydown", e => {
        const all = [...tl.querySelectorAll("[role=tab]")], i = all.indexOf(b);
        if (e.key === "ArrowDown" || e.key === "ArrowRight") { e.preventDefault(); all[(i + 1) % all.length].focus(); }
        if (e.key === "ArrowUp" || e.key === "ArrowLeft") { e.preventDefault(); all[(i - 1 + all.length) % all.length].focus(); }
      });
      tl.append(b);
    });
    panel.setAttribute("aria-labelledby", "tab-" + hqState.tab);
    panel.append(hqPanel(ctx, hqState.tab));
    main.append(wrap);
  }

  // ---------- leads (case board) ----------
  const finalHints = [
    "The office clock stopped at 1:40, when the struggle happened. Check every suspect's alibi against that time. Field has the clock; HQ has the alibis.",
    "Ruby and Leo both have witnesses at 1:40, and the cab driver saw two men. Field found something torn off at the scene. Does it match any booking record? For the unit: compare the claim check's date and terms with the harbor log, and look for a nickname in Vince's note.",
    "The note-shaped cufflink matches Eddie Marsh's booking record, he carries a trumpet case, and he owes Vince $4,000. \"T. Tone\" is \"Two-Tone\": Eddie Marsh, Pier 9, unit 12."
  ];

  function leads(ctx) {
    const s = ctx.solved;
    if (ctx.role === "field") return [
      { id: "help-hq", title: "HQ can't open their files", note: "They need something from this room.", status: ctx.done("help-hq") ? "done" : "open", manual: true,
        hints: ["HQ's files are pulled by the club's street number. Something in this office shows the address.", "Businesses that sell liquor have to hang their license in plain view.", "The liquor license reads 4719 S. State St. Tell HQ: 4719."] },
      { id: "drawer", title: "Locked desk drawer", note: "4-digit padlock", status: s("drawer") ? "done" : "open",
        hints: ["Vince's note mentions \"our songbird.\" HQ has the club's staff records.", "The songbird is the club's featured singer. Ask HQ when she first performed at the Heron.", "Ruby Lane, \"the Songbird of State Street,\" started 09/27/1948. Month and day: 0927."] },
      { id: "cigar", title: "Cigar box on the shelf", note: "8-letter lock", status: s("cigar") ? "done" : "open",
        hints: [s("drawer") ? "The ledger page from the drawer is in code. HQ's victim profile explains how Vince wrote it." : "Open the desk drawer first. What's inside will get you into this box.", "Vince pushed every letter forward by his old ship's number. Ask HQ for the ship (it's in the victim profile).", "The USS Garrison was DE-7. Move every letter back 7 (H→A, I→B…). The last line reads BOX WORD: MOONGLOW."] },
      { id: "final", title: "Call it in", note: s("cigar") ? "Who took Vince, and where is he?" : "Find out who and where.", status: s("cigar") ? "open" : "locked", hints: s("cigar") ? finalHints : null }
    ];
    return [
      { id: "records", title: "Get into the records", note: "Needs the club's street number", status: s("records") ? "done" : "open",
        hints: ["The Field team is standing in the club. Ask them to look for anything showing the address.", "Businesses that sell liquor have to hang their license on the wall.", "The license says 4719 S. State St. Enter 4719."] },
      { id: "songbird", title: "Field needs a date", note: "They'll ask about the club's staff.", status: s("records") ? (ctx.done("songbird") ? "done" : "open") : "locked", manual: true,
        hints: ["Field found a note about \"our songbird.\" Check the club staff file.", "The songbird is the featured singer. Her first night is what Field needs.", "Ruby Lane started 09/27/1948. Tell Field: 0927."] },
      { id: "phone", title: "Who drove Vince away?", note: "Use the telephone", status: !s("records") ? "locked" : s("phone") ? "done" : "open",
        hints: ["You can call any number in the city directory. Ask Field whether they've found anything with a phone number on it.", "Field's matchbook has a burned number ending in 61, a checkered stripe, and the end of a name: \"…b Co.\"", "Only Checker Cab Co. matches all three. Dial WA2-3361."] },
      { id: "final", title: "Call it in", note: s("phone") ? "Who took Vince, and where is he?" : "Find out who and where.", status: s("phone") ? "open" : "locked", hints: s("phone") ? finalHints : null }
    ];
  }

  function boardExtra(ctx, el) {
    if (ctx.role === "field" && ctx.solved("cigar")) {
      const b = ctx.h(`<button class="btn btn--tape board-cta">Call it in <span class="arrow" aria-hidden="true">→</span></button>`);
      b.addEventListener("click", () => ctx.open("Call it in", finalForm(ctx)));
      el.append(b);
    }
    el.append(ctx.h(`<p class="board-tip"><strong>Stuck?</strong> Say out loud everything you can see. The answer to your lock is usually on the other screen.</p>`));
  }

  // ---------- story ----------
  const briefing = {
    field: `<h1 class="screen-h">The Last Call</h1>
      <p class="typed brief-dateline">Chicago · Friday, October 3, 1952 · 5:52 AM</p>
      <p>You're standing in <strong>Vincent Hale's office</strong>, upstairs at the Blue Heron. Uniforms have taped off the room, and nobody's touched a thing.</p>
      <p>Hale vanished after closing. His safe is open and his office is wrecked. If he's still alive, he won't be for long. <strong>Sunrise is at 6:52.</strong></p>
      <p>HQ is on the line with the precinct files, but they can't see this room. Search everything and describe what you find. Some of these locks can only be opened with what HQ knows.</p>`,
    hq: `<h1 class="screen-h">The Last Call</h1>
      <p class="typed brief-dateline">Chicago · Friday, October 3, 1952 · 5:52 AM</p>
      <p>You're at the <strong>records desk</strong> of the 2nd District precinct. Vincent Hale, owner of the Blue Heron jazz club, has gone missing, and the Field team is at the scene.</p>
      <p>You have the files: staff, suspects, the city directory and a telephone. Field has the evidence. Neither of you can crack this alone. <strong>Sunrise is at 6:52.</strong></p>
      <p>First problem: the clerk won't pull any files without the club's street number. Ask Field to find it.</p>`
  };
  const howTo = `<div><ul class="howto">
    <li><strong>Talk constantly.</strong> Field sees the scene; HQ sees the records. Most locks on one screen are solved by information on the other.</li>
    <li><strong>The case board</strong> lists your open leads. Each has three hints; the last one gives the answer.</li>
    <li><strong>The notebook</strong> (top bar) saves anything you jot down on this device.</li>
    <li><strong>Call it in</strong> when you know who did it and where Vince is. Wrong calls cost 3 minutes.</li>
    <li>Your progress saves automatically. Close the tab and come back any time.</li>
  </ul></div>`;
  const ending = () => `<h1 class="screen-h">Found him.</h1>
    <p>Squad cars hit Pier 9 at 6:41. Behind the door of <strong>Unit 12</strong>, wrapped in a moving blanket and shivering hard, Vincent Hale was alive.</p>
    <p>His ledger was on a crate beside him. So was <strong>Eddie "Two-Tone" Marsh</strong>, trying to burn it with a lighter that wouldn't catch in the cold. He'd planned to leave Vince there until the book was ash, then let the cold do the rest.</p>
    <p>Eddie was booked at 7:15, minus one cufflink. Vince was back behind the bar by Saturday night. The band played <em>Moonglow</em>.</p>`;
  const rank = (sec, hints) => {
    const m = sec / 60;
    if (m <= 35 && hints <= 1) return "Chief of Detectives";
    if (m <= 50 && hints <= 3) return "Detective Sergeant";
    if (m <= 65) return "Detective";
    return "Rookie (but you got your man)";
  };

  return {
    id: "last-call", title: "The Last Call", clockStart: [5, 52], dawnMinutes: 60,
    answers, briefing, howTo, leads, boardExtra, ending, rank,
    render(ctx, main) { ctx.role === "field" ? renderField(ctx, main) : renderHQ(ctx, main); }
  };
})();
