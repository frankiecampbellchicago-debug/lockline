// Lockline game engine. Room content lives in js/rooms/<room>.js and registers window.LOCKLINE_ROOM.
// Progress is saved per device in localStorage; the two sides never need to sync because every
// puzzle's answer sits on one screen and the information to solve it sits on the other.
(() => {
  const room = window.LOCKLINE_ROOM;
  const cfg = window.LOCKLINE;
  const $ = s => document.querySelector(s);
  const STORE = "lockline:" + room.id;

  // ---------- state ----------
  const blank = () => ({ key: "", instanceId: "", role: "", startedAt: 0, finishedAt: 0, solved: {}, hints: {}, seen: {}, done: {}, penalty: 0, notes: "" });
  let state = load();
  function load() {
    try { return Object.assign(blank(), JSON.parse(localStorage.getItem(STORE)) || {}); } catch { return blank(); }
  }
  function save() { try { localStorage.setItem(STORE, JSON.stringify(state)); } catch {} }

  // ---------- helpers ----------
  const h = html => { const t = document.createElement("template"); t.innerHTML = html.trim(); return t.content.childElementCount === 1 ? t.content.firstElementChild : t.content; };
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
  const norm = s => String(s).toUpperCase().replace(/[^A-Z0-9|]/g, "");
  async function sha(text) {
    const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
    return [...new Uint8Array(buf)].map(b => b.toString(16).padStart(2, "0")).join("");
  }
  async function check(id, value) {
    const digest = await sha(`lockline|${room.id}|${id}|${norm(value)}`);
    return (room.answers[id] || []).includes(digest);
  }

  function toast(msg, kind = "") {
    const t = h(`<div class="toast ${kind}">${msg}</div>`);
    $("#toasts").append(t);
    setTimeout(() => t.classList.add("out"), 3800);
    setTimeout(() => t.remove(), 4300);
  }

  // ---------- screens ----------
  const screens = ["s-key", "s-role", "s-brief", "s-game", "s-end"];
  function show(id) {
    screens.forEach(s => $("#" + s).hidden = s !== id);
    const inGame = id === "s-game";
    $("#bar-case").hidden = !(inGame || id === "s-brief" || id === "s-end");
    $("#bar-tools").hidden = !inGame;
    document.body.classList.toggle("in-game", inGame);
    window.scrollTo(0, 0);
    const focusable = $("#" + id).querySelector("h1, h2, [autofocus]");
    if (focusable) { focusable.setAttribute("tabindex", "-1"); focusable.focus({ preventScroll: true }); }
  }
  function route() {
    $("#bar-title").textContent = "Case 01 · " + room.title;
    if (!state.key) return showKey();
    if (!state.role) return showRole();
    if (state.finishedAt) return showEnd();
    if (!state.startedAt) return showBrief();
    startGame();
  }

  // 1. key
  function showKey() {
    const banner = $("#preview-banner");
    banner.hidden = !LocklineLicense.isPreview(room.id);
    const params = new URLSearchParams(location.search);
    if (params.get("key")) $("#key-input").value = params.get("key");
    show("s-key");
  }
  $("#key-form").addEventListener("submit", async e => {
    e.preventDefault();
    const input = $("#key-input"), msg = $("#key-msg"), btn = $("#key-btn");
    const key = input.value.trim();
    if (!key) { input.setAttribute("aria-invalid", "true"); msg.className = "field-msg bad"; msg.textContent = "Paste your key first."; return; }
    btn.disabled = true; btn.classList.add("busy"); msg.className = "field-msg"; msg.textContent = "Checking…";
    const res = await LocklineLicense.verify(room.id, key, state);
    btn.disabled = false; btn.classList.remove("busy");
    if (!res.ok) { input.setAttribute("aria-invalid", "true"); msg.className = "field-msg bad"; msg.textContent = res.message; return; }
    input.removeAttribute("aria-invalid");
    state.key = key; state.instanceId = res.instanceId; save();
    msg.className = "field-msg good"; msg.textContent = "Key accepted.";
    setTimeout(route, 350);
  });
  $("#key-input").addEventListener("input", e => e.target.removeAttribute("aria-invalid"));

  // 2. role
  function showRole() {
    const url = location.origin + location.pathname;
    $("#invite-text").textContent = `Go to ${url}, enter our key (${state.key}) and pick the other side.`;
    show("s-role");
  }
  document.querySelectorAll("[data-role]").forEach(b => b.addEventListener("click", () => {
    state.role = b.dataset.role; save(); route();
  }));
  $("#copy-invite").addEventListener("click", async () => {
    try { await navigator.clipboard.writeText($("#invite-text").textContent); toast("Invite copied."); }
    catch { toast("Couldn't copy. Select the text and copy it instead."); }
  });

  // 3. briefing
  function roleName(r = state.role) { return r === "field" ? "Field team" : "HQ team"; }
  function showBrief() {
    $("#bar-role").textContent = roleName();
    $("#brief-stamp").textContent = roleName();
    $("#brief-body").innerHTML = room.briefing[state.role];
    show("s-brief");
  }
  $("#start-btn").addEventListener("click", () => { state.startedAt = Date.now(); save(); startGame(); });
  $("#back-role").addEventListener("click", () => { state.role = ""; save(); route(); });

  // ---------- clock ----------
  let tick;
  const elapsedSec = () => Math.max(0, Math.floor(((state.finishedAt || Date.now()) - state.startedAt) / 1000) + state.penalty);
  const mmss = s => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
  function inGameTime(sec) {
    const [hh, mm] = room.clockStart;
    const total = hh * 60 + mm + Math.floor(sec / 60);
    const H = Math.floor(total / 60) % 12 || 12, M = total % 60;
    return `${H}:${String(M).padStart(2, "0")} AM`;
  }
  function renderClock() {
    const s = elapsedSec(), limit = room.dawnMinutes * 60;
    $("#bar-clock").textContent = s < limit ? inGameTime(s) : "Sunrise";
    $("#bar-elapsed").textContent = s < limit ? mmss(s) : "+" + mmss(s - limit) + " over";
    document.querySelector(".clock-chip").classList.toggle("late", s >= limit - 300);
  }

  // ---------- game ----------
  function startGame() {
    $("#bar-role").textContent = roleName();
    render();
    show("s-game");
    renderClock();
    clearInterval(tick);
    tick = setInterval(renderClock, 1000);
  }

  function render() {
    const main = $("#game-main");
    main.innerHTML = "";
    room.render(ctx, main);
    renderLeads();
  }

  function renderLeads() {
    const list = $("#leads");
    list.innerHTML = "";
    for (const lead of room.leads(ctx)) {
      const used = state.hints[lead.id] || 0;
      const li = h(`<li class="lead ${lead.status}">
        <div class="lead-top">
          <span class="lead-mark" aria-hidden="true">${lead.status === "done" ? "✓" : lead.status === "locked" ? "•" : "?"}</span>
          <div class="lead-txt"><strong>${lead.title}</strong>${lead.note ? `<span>${lead.note}</span>` : ""}</div>
        </div>
      </li>`);
      if (lead.status === "open" && lead.hints) {
        const hintsBox = h(`<div class="lead-hints"></div>`);
        lead.hints.slice(0, used).forEach((t, i) => hintsBox.append(h(`<p class="hint"><span class="typed">Hint ${i + 1}</span> ${t}</p>`)));
        if (used < lead.hints.length) {
          const b = h(`<button class="hint-btn" type="button">${used === lead.hints.length - 1 ? "Show the answer" : used ? "Another hint" : "Need a hint?"}</button>`);
          b.addEventListener("click", () => { state.hints[lead.id] = used + 1; save(); renderLeads(); list.querySelector(`[data-lead="${lead.id}"] .hint:last-of-type`)?.focus(); });
          hintsBox.append(b);
        }
        li.append(hintsBox);
      }
      if (lead.status === "open" && lead.manual) {
        const b = h(`<button class="hint-btn" type="button">Mark as done</button>`);
        b.addEventListener("click", () => { state.done[lead.id] = true; save(); renderLeads(); });
        li.querySelector(".lead-txt").append(b);
      }
      li.dataset.lead = lead.id;
      list.append(li);
    }
    const extra = $("#board-extra");
    extra.innerHTML = "";
    if (room.boardExtra) room.boardExtra(ctx, extra);
  }

  // ---------- modal ----------
  const modal = $("#modal");
  let onClose = null;
  function open(title, content, opts = {}) {
    $("#modal-title").textContent = title;
    const body = $("#modal-body");
    body.innerHTML = "";
    body.append(typeof content === "string" ? h(content) : content);
    modal.classList.toggle("wide", !!opts.wide);
    onClose = opts.onClose || null;
    if (!modal.open) modal.showModal();
    body.scrollTop = 0;
    if (opts.id) { state.seen[opts.id] = true; save(); }
  }
  function close() { if (modal.open) modal.close(); }
  modal.addEventListener("close", () => { const f = onClose; onClose = null; f && f(); });
  modal.addEventListener("click", e => { if (e.target === modal || e.target.closest("[data-close]")) close(); });

  // ---------- lock widget ----------
  // wheels({ length, kind: "digits"|"letters", label }) → element with .value
  function wheels({ length, kind = "digits", label = "Combination" }) {
    const chars = kind === "digits" ? "0123456789" : "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const vals = Array(length).fill(0);
    const wrap = h(`<div class="wheels" role="group" aria-label="${esc(label)}"></div>`);
    vals.forEach((_, i) => {
      const w = h(`<div class="wheel">
        <button type="button" class="wheel-btn" tabindex="-1" aria-hidden="true">▲</button>
        <span class="wheel-val" role="spinbutton" tabindex="0" aria-label="${kind === "digits" ? "Digit" : "Letter"} ${i + 1} of ${length}" aria-valuemin="0" aria-valuemax="${chars.length - 1}"></span>
        <button type="button" class="wheel-btn" tabindex="-1" aria-hidden="true">▼</button>
      </div>`);
      const [up, down] = w.querySelectorAll("button");
      const val = w.querySelector(".wheel-val");
      const set = n => {
        vals[i] = (n + chars.length) % chars.length;
        val.textContent = chars[vals[i]];
        val.setAttribute("aria-valuenow", vals[i]);
        val.setAttribute("aria-valuetext", chars[vals[i]]);
        val.classList.remove("spin"); void val.offsetWidth; val.classList.add("spin");
      };
      up.addEventListener("click", () => set(vals[i] + 1));
      down.addEventListener("click", () => set(vals[i] - 1));
      val.addEventListener("keydown", e => {
        if (e.key === "ArrowUp") { e.preventDefault(); set(vals[i] + 1); }
        else if (e.key === "ArrowDown") { e.preventDefault(); set(vals[i] - 1); }
        else if (e.key === "ArrowRight") wrap.querySelectorAll(".wheel-val")[i + 1]?.focus();
        else if (e.key === "ArrowLeft") wrap.querySelectorAll(".wheel-val")[i - 1]?.focus();
        else if (e.key.length === 1 && chars.includes(e.key.toUpperCase())) {
          set(chars.indexOf(e.key.toUpperCase()));
          wrap.querySelectorAll(".wheel-val")[i + 1]?.focus();
        } else if (e.key === "Enter") wrap.closest("form")?.requestSubmit();
      });
      val.addEventListener("wheel", e => { e.preventDefault(); set(vals[i] + (e.deltaY < 0 ? 1 : -1)); }, { passive: false });
      set(0);
      val.classList.remove("spin");
      wrap.append(w);
    });
    Object.defineProperty(wrap, "value", { get: () => vals.map(v => chars[v]).join("") });
    wrap.shake = () => { wrap.classList.remove("shake"); void wrap.offsetWidth; wrap.classList.add("shake"); };
    return wrap;
  }

  // lockForm: wraps an input/wheels with submit + feedback. onSolve runs after a correct answer.
  function lockForm({ id, control, button = "Try it", wrong = "Nothing happens. That's not it.", onSolve, getValue }) {
    const form = h(`<form class="lock-form" novalidate><div class="lock-ctl"></div><div class="lock-row"><button class="btn" type="submit">${button}</button><p class="lock-msg" role="status" aria-live="polite"></p></div></form>`);
    form.querySelector(".lock-ctl").append(control);
    const msg = form.querySelector(".lock-msg");
    form.addEventListener("submit", async e => {
      e.preventDefault();
      const v = getValue ? getValue() : control.value;
      if (!norm(v)) { msg.textContent = "Enter something first."; msg.className = "lock-msg bad"; return; }
      if (await check(id, v)) {
        form.classList.add("opened");
        msg.textContent = "Click. It opens.";
        msg.className = "lock-msg good";
        setTimeout(() => { solve(id); onSolve && onSolve(); }, 650);
      } else {
        control.shake ? control.shake() : (control.classList.remove("shake"), void control.offsetWidth, control.classList.add("shake"));
        control.setAttribute?.("aria-invalid", "true");
        msg.textContent = typeof wrong === "function" ? wrong(v) : wrong;
        msg.className = "lock-msg bad";
      }
    });
    return form;
  }

  function solve(id) {
    if (state.solved[id]) return;
    state.solved[id] = Date.now();
    save();
    render();
  }

  function finish() {
    state.finishedAt = Date.now();
    save();
    clearInterval(tick);
    close();
    showEnd();
  }

  function showEnd() {
    $("#bar-role").textContent = roleName();
    const sec = elapsedSec();
    const hints = Object.values(state.hints).reduce((a, b) => a + b, 0);
    const rank = room.rank(sec, hints);
    $("#end-body").innerHTML = "";
    $("#end-body").append(h(`<div>
      <span class="stamp stamp--ok">Case closed</span>
      ${room.ending(ctx)}
      <div class="report">
        <div><span>Time</span><strong>${mmss(sec)}</strong></div>
        <div><span>Hints</span><strong>${hints}</strong></div>
        <div><span>Penalties</span><strong>${state.penalty ? "+" + mmss(state.penalty) : "None"}</strong></div>
        <div><span>Rank</span><strong>${rank}</strong></div>
      </div>
      <p class="muted">Tell the other team, if they haven't filed it yet. They can enter the same answer on their screen to see this report.</p>
      <div class="end-actions">
        <button class="btn btn--tape" id="share-btn">Share your result</button>
        <a class="btn btn--ghost" href="./">Back to Lockline</a>
      </div>
    </div>`));
    $("#share-btn").addEventListener("click", async () => {
      const text = `We cracked Lockline Case 01: ${room.title} in ${mmss(sec)} with ${hints} hint${hints === 1 ? "" : "s"}. Rank: ${rank}. 🔍 ${location.origin}${location.pathname.replace(/play\.html$/, "")}`;
      try {
        if (navigator.share) await navigator.share({ text });
        else { await navigator.clipboard.writeText(text); toast("Result copied. Paste it anywhere."); }
      } catch {}
    });
    show("s-end");
  }

  // ---------- notes + menu ----------
  $("#btn-notes").addEventListener("click", () => {
    const box = h(`<div><label class="sr-only" for="notes-ta">Your notes</label><textarea id="notes-ta" class="notes" placeholder="Jot down names, numbers, anything the other team tells you…"></textarea><p class="small muted">Saved on this device as you type.</p></div>`);
    const ta = box.querySelector("textarea");
    ta.value = state.notes;
    ta.addEventListener("input", () => { state.notes = ta.value; save(); });
    open("Notebook", box);
    ta.focus();
  });
  $("#btn-menu").addEventListener("click", () => {
    const other = state.role === "field" ? "hq" : "field";
    const box = h(`<div class="menu">
      <button class="menu-item" data-act="how"><strong>How to play</strong><span>A quick refresher</span></button>
      <button class="menu-item" data-act="switch"><strong>Switch to ${roleName(other)}</strong><span>Your progress on this side is kept</span></button>
      <button class="menu-item" data-act="restart"><strong>Restart the case</strong><span>Clears progress, notes and the clock on this device</span></button>
      ${cfg.supportEmail ? `<a class="menu-item" href="mailto:${cfg.supportEmail}"><strong>Get help</strong><span>${cfg.supportEmail}</span></a>` : ""}
    </div>`);
    box.addEventListener("click", e => {
      const act = e.target.closest("[data-act]")?.dataset.act;
      if (act === "how") open("How to play", room.howTo);
      if (act === "switch") { state.role = other; save(); close(); startGame(); toast("You're now on the " + roleName() + "."); }
      if (act === "restart") {
        const sure = h(`<div><p>This wipes your progress on this device and restarts the clock. The other team's screen isn't affected.</p><div class="end-actions"><button class="btn" data-yes>Yes, restart</button><button class="btn btn--ghost" data-close>Cancel</button></div></div>`);
        sure.querySelector("[data-yes]").addEventListener("click", () => {
          const keep = { key: state.key, instanceId: state.instanceId };
          state = Object.assign(blank(), keep); save(); close(); route();
        });
        open("Restart the case?", sure);
      }
    });
    open("Menu", box);
  });

  // ---------- context for the room ----------
  const ctx = {
    get role() { return state.role; },
    get state() { return state; },
    h, esc, open, close, wheels, lockForm, check, toast, solve, finish,
    solved: id => !!state.solved[id],
    seen: id => !!state.seen[id],
    done: id => !!state.done[id],
    penalize(sec) { state.penalty += sec; save(); renderClock(); },
    rerender: render
  };

  route();
})();
