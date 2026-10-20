# Belu Website Redesign — TODOs

Implementation brief for `CodingPope/Belu_art_website` (Next.js 15 + Payload CMS 3, Postgres). Keep that architecture unless a task explicitly calls for a change.

## Product direction

A compact, cozy vintage scrapbook shop. Within about ten seconds, a visitor should understand that Belu is an artist, that there is art to browse or buy, and that there are upcoming events.

- Keep the home page short: preview destinations, don't hold every piece of content.
- Prefer image cards and horizontal rows over dropdowns and tall stacked sections.
- Build on the warm paper, ink, red, grain, star, and handmade details; lean further into scrapbook warmth.
- Keep interaction accessible: keyboard controls, visible focus, readable contrast, touch-friendly mobile controls.
- No live checkout until product, fulfillment, and legal/business details are confirmed.
- **Belu should be able to make everyday changes herself, from her phone,** without asking for code changes.

---

## Ask Belu now (runs alongside everything below)

These block later work, so request them early.

- [ ] A reference image or annotated sketch for the new hero's scroll animation ("the image kind of faces and gets…"). Blocks task 9.
- [ ] Portraits to upload in the admin: Home › Hero › Hero Portrait, Home › About Me › Portrait, About Page › Studio Portrait.
- [ ] Whether she likes the gallery's filter chips or wants visual category cards instead.
- [ ] Whether she wants the "Event" inquiry type on the contact form (added; easy to remove).
- [ ] Commerce answers for Phase 4: Shopify and Lumaprints accounts, launch-ready products, prices, print sizes, paper, frame, finish, edition, shipping regions, taxes, and returns.

---

## Up next

### 1. Make the Connect page shorter

- [x] Reduce the page's vertical length, especially on mobile. *(Mobile ~2,030px → ~1,390px; desktop ~1,250px → ~1,060px. Quick links removed, socials a 2-column grid, inquiry types wrap as chips on phones, and name/email share a row.)*

### 2. Self-service essentials (things that break quietly if missing)

- [ ] **Inquiry notifications:** email Belu when a contact form inquiry arrives. Add a Payload email adapter (e.g. Resend) and an `afterChange` hook on Inquiries. Needs an email service account and API key.
- [ ] **Password reset:** works once the email adapter exists; test "Forgot password" end to end.
- [ ] **Phone photo uploads:** enable `clientUploads: true` on the Vercel Blob plugin so uploads skip Vercel's ~4.5MB request limit. Test an iPhone photo (HEIC) end to end.
- [ ] **Instant updates:** add `revalidatePath` hooks on collections and globals so published edits appear immediately, not after the 60-second cache.
- [ ] **No sample content in production:** replace the built-in fallback artworks, products, and events with proper empty states (e.g. "No dates yet. Join the list."), so deleting all events doesn't show made-up ones.
- [ ] **Undo:** turn on version history for the Home, About, Shop, Connect, and Site Settings globals so Belu can restore earlier text herself.

### 3. Make hardcoded text and lists editable

- [ ] **Gallery categories:** replace the fixed list (Originals, Prints, Mandalas, Cats, Murals) with a Categories collection used by Artworks and the gallery filters.
- [ ] **Social platforms:** add Etsy, Pinterest, Threads, Substack, Bluesky, and an "Other" option with a custom label.
- [ ] **Home module headings:** editable heading and subtitle for each module ("From the studio wall", "Come say hi", "Join the list"…), plus a show/hide toggle for each.
- [ ] **Newsletter copy:** one shared setting in Site Settings, replacing the four slightly different hardcoded blurbs (home, shop, cart, events).
- [ ] **Shop and cart text:** move "What you'll find when it opens", "Your cart is quiet for now", and the First access card into the Shop Page global.
- [ ] **Footer and navigation:** editable footer link columns; main nav labels can be renamed but not restructured.
- [ ] **SEO and link previews:** title, description, and share image per page global.

### 4. Before launch: admin and content workflow

- [ ] **Pages collection:** title, slug, and rich-text body for simple pages (FAQ, commission info, shipping, returns). Phase 4 needs policy pages anyway.
- [ ] **Subscriber export:** connect Kit/Mailchimp, or add Payload's import-export plugin so Belu can download a CSV.
- [ ] **Roles:** give Belu her own account with an Editor role that can't manage Users or bulk-delete collections. The `role` field exists but isn't enforced yet.
- [ ] **Admin tidy-up for phones:** group the sidebar (Content, Shop, Inbox, Marketing), hide Journal from editors, add help text to any field that needs it.
- [ ] **Not editable on purpose:** layout, colors, motion, and section order. No page builder.

### 5. Ship and verify

- [ ] Generate and run one Payload migration covering every schema change in the redesign (Events fields, Inquiries opt-in and "event" type, subscriber sources, Connect Page fields, Promotions, Press, removed Home Page and Site Settings fields, and anything from sections 2–4). Removing fields deletes their stored values.
- [ ] Commit the work (still uncommitted).
- [ ] Remove the temporary `src/app/api/debug-posts` route.
- [ ] Verify the eBay and Reddit social URLs by hand (they block automated checks); Instagram, Facebook, and Discord respond.
- [ ] Against a real database: send a contact inquiry with newsletter opt-in, create and schedule a promotion (modal and banner), add a press mention, create past and upcoming events.
- [ ] Test on a real iPhone (Safari) and Android phone: mobile menu, progress line, carousels, pop-up and banner, contact form.

---

## Waiting on Belu

### 6. New hero: "About Me" scrapbook moment

- [ ] Design a new home hero with Belu's portrait and logo as the visual anchor.
- [ ] Start with a short About Me line partly cut off, peeking from the lower part of the composition.
- [ ] On scroll, reveal the fuller About Me content with a gentle image/composition transformation.
- [ ] Subtle, performant motion only; honor `prefers-reduced-motion`.
- [ ] Replace the current hero only after the new composition is approved. The interim About Me module on the home page can then merge into it.

### 7. Gallery category controls

- [ ] If Belu dislikes the filter chips on `/gallery`, replace them with visual category cards or tabs. Keep filtering and the lightbox.

### 8. Product selector

- [ ] Build the print/product selector with `OptionCards` once Belu's real options exist (size, paper, frame, finish, edition, shipping regions).

### 9. Production content

- [ ] Replace placeholder portraits (see "Ask Belu now").
- [ ] Replace the hardcoded "coming soon" shop cards in `src/app/(frontend)/shop/page.tsx` once real products exist.

---

## Phase 4 — Ecommerce and Lumaprints (do last)

### 10. Confirm the commerce architecture before coding

- [ ] Confirm whether Belu already has a Shopify store and a Lumaprints account.
- [ ] Confirm which products are launch-ready: prints, originals, apparel, stickers, or other merchandise.
- [ ] Confirm prices, taxes, shipping regions, returns/refunds, print sizes, paper/finish options, framing, and fulfillment expectations.
- [ ] Decide whether Shopify checkout is the system of record. **Recommended:** Shopify checkout + the Lumaprints Shopify integration, keeping the custom Belu site design.
- [ ] Don't build direct Lumaprints API fulfillment by default; only if a custom commerce flow is worth the extra engineering and maintenance.

### 11. Implement the selected commerce path

**Recommended: Shopify + Lumaprints**

- [ ] Connect Shopify to Lumaprints and map products in the Lumaprints dashboard.
- [ ] Create products/variants, accurate print assets, pricing, and shipping settings.
- [ ] Replace the static "coming soon" shop/cart with real product cards and checkout links, or a Shopify-backed custom storefront.
- [ ] Test a full low-risk purchase, refund, and fulfillment before launch.
- [ ] Make order confirmation, shipping, and support ownership clear to Belu.

**Optional later: custom Lumaprints API**

- [ ] Use a Lumaprints sandbox account first.
- [ ] Keep credentials server-side only; never commit them.
- [ ] Build order creation, secure payment, order-status sync, shipping updates, error/retry handling, and webhook validation.
- [ ] Treat production submissions as real fulfillment; never use production for test orders.

### 12. Google Ads, only after checkout is proven

- [ ] Don't buy traffic before real product pages, checkout, tracking, and customer policies are live.
- [ ] Install analytics and conversion tracking with consent/privacy handling.
- [ ] Create a product feed and set up Google Merchant Center if Shopping ads are planned.
- [ ] Build campaign landing pages around specific print collections, not the generic home page.
- [ ] Start with a small, controlled spend and evaluate conversion quality before expanding.

---

## Acceptance checklist

- [ ] The home page feels like a cozy vintage scrapbook shop within ten seconds. *(Needs the new hero, then Belu's verdict.)*
- [x] The home page is short and directs visitors to dedicated pages.
- [x] Journal is absent from all public navigation and home content.
- [x] About, Shop, Gallery, Events, and Newsletter are all visible on the home page.
- [x] Gallery, Shop, and Events use compact horizontal browsing without making the page overly tall.
- [ ] Mobile navigation, the progress line, carousels, and pop-ups work on real phones.
- [ ] Contact supports inquiries and newsletter opt-in. *(Built; verify against a real database.)*
- [ ] Promotions can be turned on/off and scheduled without editing code. *(Built; verify against a real database.)*
- [ ] Press mentions can be entered in the backend without appearing publicly. *(Built; needs the migration.)*
- [ ] Belu can make everyday text, image, event, and promotion changes from her phone without asking for code changes.
- [ ] A real commerce/fulfillment path is selected and tested before checkout or paid ads go live.

---

## Done

<details>
<summary>Completed work (Phases 1–3 of the original brief)</summary>

**Journal removed from the public site.** Gone from desktop nav, mobile menu, footer, and the home page. Collection, posts, and `/journal` routes are kept until Belu approves removal.

**Compact, destination-led home page.** Current hero, then short modules: Gallery carousel, Shop row, Events row, About Me, Newsletter. The old featured-work, long statement, large shop copy, and markets layouts are retired.

**Events.** `/events` page (upcoming first, year-round stockists listed separately, past events in a collapsible archive) and a horizontal events row on the home page. The `markets` collection is shown as "Events" in the admin, with type, start/end dates, location, image, link, status, and an optional date label. Events in nav, mobile menu, and footer.

**Gallery carousel (home).** Horizontal swipeable row with text over the art on a dark gradient, prev/next buttons, arrow-key/Home/End navigation, a position counter, "View details" opening the lightbox, and a "See all the work" card. A vertical mouse wheel scrolls the page, not the row. Without JS it's a plain scrollable row.

**Scroll progress line.** Mobile: star, solid red road travelled, travelling star, faded red dots ahead, end star along the bottom of the masthead. Desktop: the same treatment on the vertical left-margin line. End star brightens at the bottom of the page; reduced motion respected.

**Promotions.** Payload-managed pop-up (modal) or bottom banner: campaign type (sale, launch, event, newsletter), headline, body, optional image, button, target pages, start/end, delay, how soon to show again after closing, and priority. Focus trap, Escape, close button, no autoplay. The gallery lightbox now uses the same focus trap.

**Connect page.** Linktree-style link directory (socials from Site Settings, contact email) and a contact form with selectable inquiry-type cards, visible labels, error state, and an optional newsletter opt-in with editable consent text. Opt-ins go through the shared `addSubscriber` helper, so no duplicate emails. Connect Page global is now fully used.

**Press.** Backend-only `press-mentions` collection (outlet, title, date, quote, link, logo, featured, sort order). Not shown publicly.

**Show, don't dropdown.** No `<select>` left in shopper-facing UI. Reusable `OptionCards` component (radio cards with optional image swatch and price/size line). Rule documented in README.md.

**CMS audit.** Hero portrait, hero featured artwork, statement attribution, About studio portrait, and contact email now render. Unused fields removed (Home: Featured Work tab, Journal Preview tab, shop body; Site Settings: site name, tagline, logo, Site Alert). Product status reads `productStatus` correctly.

</details>
