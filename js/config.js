/* Stakeout store settings.
   Fill these in after creating the Lemon Squeezy store (see README → "Turning on payments").
   While productId is empty the site runs in PREVIEW MODE: buy buttons say checkout isn't open yet,
   and the play page accepts the test key PREVIEW so you can playtest. */
window.LOCKLINE = {
  storeName: "Stakeout",
  supportEmail: "",            // shown on the play page and legal page, e.g. "help@stakeout.games"
  rooms: {
    "last-call": {
      title: "The Last Call",
      price: "$10",
      checkoutUrl: "",          // Lemon Squeezy checkout link for the product, e.g. https://stakeout.lemonsqueezy.com/buy/xxxx
      productId: ""             // Lemon Squeezy product ID (number) — keys from other products are rejected
    }
  }
};
