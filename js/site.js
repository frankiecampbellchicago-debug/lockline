// Shared page behavior: reveal-on-scroll, footer year, buy buttons, the homepage mini-lock.
(() => {
  document.querySelectorAll("[data-year]").forEach(el => el.textContent = new Date().getFullYear());

  const io = "IntersectionObserver" in window && new IntersectionObserver(entries => {
    for (const e of entries) if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
  }, { rootMargin: "0px 0px -8% 0px" });
  document.querySelectorAll(".reveal").forEach(el => io ? io.observe(el) : el.classList.add("in"));

  // Buy buttons: <a data-buy="last-call">. Without a checkout link we're in preview mode.
  const cfg = window.LOCKLINE || { rooms: {} };
  document.querySelectorAll("[data-buy]").forEach(btn => {
    const room = cfg.rooms[btn.dataset.buy];
    if (room && room.checkoutUrl) {
      btn.href = room.checkoutUrl;
      return;
    }
    btn.setAttribute("aria-disabled", "true");
    btn.removeAttribute("href");
    btn.innerHTML = "Checkout opens soon";
    const note = document.querySelector(`[data-buy-note="${btn.dataset.buy}"]`);
    if (note) note.hidden = false;
  });

  // Homepage mini-lock (just a taste; the answer isn't a secret)
  const form = document.getElementById("minilock");
  if (form) {
    const input = form.querySelector("input");
    const msg = document.getElementById("ml-msg");
    const nudges = ["Not quite. Look at where the hour hand sits.", "Closer look: the minute hand is on the 8. That's 40 minutes.", "Hour hand between 1 and 2, minutes at 40. Type it as three digits."];
    let tries = 0;
    input.addEventListener("input", () => { input.value = input.value.replace(/\D/g, ""); input.removeAttribute("aria-invalid"); });
    form.addEventListener("submit", e => {
      e.preventDefault();
      const v = input.value.replace(/\D/g, "");
      if (v === "140") {
        form.closest(".teaser").querySelector(".teaser-body").hidden = true;
        const solved = form.closest(".teaser").querySelector(".teaser-solved");
        solved.hidden = false;
        solved.querySelector("a").focus({ preventScroll: true });
        return;
      }
      input.setAttribute("aria-invalid", "true");
      void input.offsetWidth;
      msg.className = "ml-msg bad";
      msg.textContent = v.length !== 3 ? "Enter three digits." : nudges[Math.min(tries++, nudges.length - 1)];
    });
  }
})();
