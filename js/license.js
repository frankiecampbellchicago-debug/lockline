// License keys via the Lemon Squeezy License API. It allows browser requests (CORS *) and needs no secret,
// so the site can stay static. Each device uses one activation; set the product's activation limit to 6.
window.LocklineLicense = (() => {
  const API = "https://api.lemonsqueezy.com/v1/licenses/";
  const cfg = window.LOCKLINE;

  async function call(action, params) {
    const res = await fetch(API + action, {
      method: "POST",
      headers: { Accept: "application/json", "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams(params)
    });
    return res.json().catch(() => ({ error: "Unexpected response from the key server." }));
  }

  function isPreview(roomId) { return !cfg.rooms[roomId].productId; }

  function friendly(err) {
    const e = String(err || "").toLowerCase();
    if (e.includes("not found")) return "We couldn't find that key. Check for typos, or copy it straight from your email.";
    if (e.includes("activation limit")) return "This key is already active on 6 devices. Email us and we'll reset it.";
    if (e.includes("expired")) return "This key has expired.";
    if (e.includes("disabled")) return "This key has been disabled. If you think that's a mistake, email us.";
    return err || "Something went wrong checking your key. Try again in a moment.";
  }

  // Returns { ok, instanceId?, message? }
  async function verify(roomId, key, saved) {
    key = key.trim();
    if (isPreview(roomId)) {
      return key.toUpperCase() === "PREVIEW" ? { ok: true, instanceId: "preview" } : { ok: false, message: "Checkout isn't live yet. Use the test key PREVIEW." };
    }
    const productId = String(cfg.rooms[roomId].productId);
    const owns = data => data && data.meta && String(data.meta.product_id) === productId;
    try {
      // Same device coming back: validate the existing activation instead of using a new one.
      if (saved && saved.key === key && saved.instanceId) {
        const v = await call("validate", { license_key: key, instance_id: saved.instanceId });
        if (v.valid && owns(v)) return { ok: true, instanceId: saved.instanceId };
      }
      const a = await call("activate", { license_key: key, instance_name: "lockline-" + roomId + "-" + Math.random().toString(36).slice(2, 8) });
      if (a.activated && owns(a)) return { ok: true, instanceId: a.instance.id };
      if (a.activated && !owns(a)) return { ok: false, message: "That key is for a different case." };
      return { ok: false, message: friendly(a.error) };
    } catch {
      return { ok: false, message: "Couldn't reach the key server. Check your connection and try again." };
    }
  }

  return { verify, isPreview };
})();
