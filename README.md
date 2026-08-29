# Suryaa Jewels Craft

Single-page showcase site for Suryaa Jewels Craft, a family jewelry atelier. Built with React + Vite from the design handoff in `design_extract/design_handoff_suryaa_jewels/`.

## Development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Structure

- `src/config.js` — all site copy and toggleable settings (hero variant, testimonials visibility)
- `src/components/` — one component per page section
- `public/images/` — photography (free-license stock, sourced to match the design brief; swap in real product photography when available)

## Notes

- Hero and testimonials support the toggles described in the original design handoff (`heroVariant`, `showTestimonials`) via `src/config.js`.
- The nav is always sticky and transparent (no background fill); its text switches from light to dark once you scroll past the hero, so it stays legible over both the hero photo and the lighter sections below.
- The gallery carousel's arrow buttons disable at the scroll start/end.
- The Visit section embeds a live Google Maps view of the atelier (grayscale-filtered to match the palette) with a "Get Directions" link out to Google Maps.
