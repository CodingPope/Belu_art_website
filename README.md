# Belu_art_website

Belu Malu, the art site and shop for Belu Maluenda. Next.js 15 + Payload CMS 3 (Postgres).

## Design rules

### Show, don't dropdown

Shopper-facing choices should be visible and easy to compare, not hidden in a `<select>`.

- For choices like inquiry type, print size, paper, frame, finish, or edition, use `OptionCards` (`src/components/OptionCards.tsx`). It's a radio group shown as cards, with an optional image swatch (`imageSrc`) and a visible comparison line (`detail`, e.g. a price or "8 × 10 in").
- Show the price, dimensions, and what makes each option different on the card itself.
- Dropdowns are fine for secondary metadata (sort order, country lists) and for admin-only UI.
