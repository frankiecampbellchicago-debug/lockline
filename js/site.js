// Shared page behavior: reveal-on-scroll, footer year, buy buttons.
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
})();
