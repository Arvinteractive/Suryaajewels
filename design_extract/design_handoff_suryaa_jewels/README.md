# Handoff: Suryaa Jewels Craft — Single Page Site

## Overview
A single-page showcase site for Suryaa Jewels Craft, a jewelry atelier. Purely presentational — no product catalog, no cart, no working search, no sub-pages. Purpose is to tell the brand's craft story and drive visits/enquiries, not e-commerce.

## About the Design Files
The bundled file (`Suryaa Jewels Craft.dc.html`) is a **design reference built in HTML** — a high-fidelity prototype of layout, copy, colors, and interaction, not production code to lift directly. Recreate this design as a React app (Vite or Next.js — either is fine for a static single page) using standard React conventions: componentize by section, use CSS modules or styled-components/Tailwind per your team's preference. If a codebase/framework is already established, follow its existing patterns instead of introducing a new one.

## Fidelity
**High-fidelity.** Colors, typography, spacing, and copy are final as shown. Recreate pixel-close using the values below.

## Screens / Views
Single page, top to bottom, in this order:

1. **Nav** — sticky/absolute top bar. Logo "SURYAA" (serif, tracked) + "JEWELS CRAFT" micro-label. Right: nav links (Craft, Heritage, Collections, Visit) + outlined "Book a Visit" button. Two variants exist: solid bar (opaque background, dark text) and transparent-over-hero (light text, no background) — current default is transparent, sitting over the hero image.
2. **Hero (full-bleed variant, default)** — full-width background photo (two gold rings on cracked terracotta). Dark gradient overlay masks only the left ~60% (`linear-gradient(90deg, rgba(41,48,43,.6) 0%, rgba(41,48,43,.42) 65%, rgba(41,48,43,0) 100%)`) so text is legible while the right side of the photo stays clear. Content: eyebrow label, serif H1 "Handcrafted in Gold. Rooted in Heritage.", body paragraph, "See Our Craft" button (light fill, dark text). All text color `#F4F5F1`. A second "split" hero variant also exists (left: text + 2 small thumbnail images; right: full-height photo) — swappable via a layout prop.
3. **Trust strip** — 3-column row, divided by vertical borders, background `#DDE1D9`. Each column: small icon image (mix-blend-mode: multiply to drop the white product-shot background), serif title, secondary-color body line. Items: "Handmade, Not Machine-Cast", "BIS Hallmarked Gold", "Custom Design on Request".
4. **Collections showcase ("What We Craft")** — heading + right-aligned subhead, then a 4-tile responsive grid (auto-fit, min 260px). Each tile: 3:4 photo, bottom gradient scrim, title + subtitle overlaid in light text. Tiles: Necklaces & Haarams, Bridal Sets, Rings, Earrings.
5. **Process ("From Sketch to Setting")** — background `#DDE1D9`, 5-column responsive grid, each column top-bordered (2px solid `#29302B`), showing step number, serif title, body text. Steps: Design Sketch → Wax Carving → Casting → Stone Setting → Hand Polishing.
6. **About/Heritage ("Three Generations of Goldsmiths")** — two-column: left photo (brooch on silk), right text block with eyebrow, serif H2, two paragraphs.
7. **Testimonials** — currently toggled OFF by default (see Design Tokens/props below). When on: centered heading + 3-column grid of quote cards (large serif quote mark, italic serif quote, uppercase name/location).
8. **Gallery ("From the Workshop")** — background `#DDE1D9`. Horizontal single-row carousel, exactly 5 cards visible at any viewport width (`flex: 0 0 calc((100% - 64px)/5)`), native scrollbar hidden, `scroll-behavior: smooth`, `scroll-snap-type: x mandatory`. Left/right circular arrow buttons (40px, bordered, absolutely positioned just outside the row) call `scrollBy` for ~90% of the row's width per click. Images scale to 1.08 on hover (`transition: transform .4s ease`) inside an `overflow:hidden` clipping container. 10 photos in the row.
9. **Visit** — two-column: left text (Address, Hours, Contact, socials) + "Book a Visit" button; right, a map placeholder (striped pattern, monospace label "MAP — ATELIER LOCATION" — not a real embed).
10. **Footer** — logo mini + nav link repeat + copyright line, top-bordered.

## Interactions & Behavior
- All nav links are in-page anchor scrolls (`href="#section-id"`), no routing.
- Nav/CTA buttons: outline → filled color swap on hover (150ms-ish, use CSS transition).
- Gallery: smooth-scroll carousel via JS `scrollBy`, buttons disabled/hidden at ends is NOT implemented in the mock — recommend adding scroll-position-aware disable states in production.
- Collection tiles and gallery images: `transform: scale()` on hover, contained by `overflow: hidden` parent — do not let the scale bleed outside the card.
- No modals, no forms wired up, no working search (explicitly excluded by design).
- Responsive: fluid via `clamp()` for type/spacing and CSS grid `auto-fit`/`minmax()` — no fixed breakpoints in the mock. Recreate the same fluid approach or map it to your breakpoint system, but preserve "5 cards visible in the gallery at all viewport sizes."

## State Management
Minimal — this is a static page. Only stateful piece: gallery scroll container ref (for the arrow-button scroll actions). No data fetching; all content is static copy/image references.

## Design Tokens
**Colors** (monotone sage palette):
- Background: `#E9ECE5`
- Surface (alt sections): `#DDE1D9`
- Primary text / dark fills: `#29302B`
- Secondary text: `#727A72`
- Border: `#C8CEC5`
- Light (button text on dark / accent fill): `#F4F5F1`

**Typography:**
- Display/serif: "Cormorant Garamond" (weights 400/500/600, italic 400) — headings, quote marks, nav wordmark
- Body/sans: "Jost" (weights 400/500/600) — body copy, nav links, labels, buttons
- Nav/labels: uppercase, letter-spacing ~0.08–0.28em depending on size
- Headline sizes fluid via `clamp()`, e.g. H1 `clamp(38px, 5.6vw, 72px)`

**Spacing:** section padding fluid via `clamp()`, roughly 64–120px vertical on desktop, collapsing on mobile; grid/flex gaps 16–24px typically.

**Borders/radius:** 1px solid `#C8CEC5` throughout; no border-radius anywhere (square/sharp edges by design — do not round corners).

**Toggleable props (implemented as component props in the .dc.html, recreate as component props/config in React):**
- `heroVariant`: `"split" | "fullbleed"` (default `fullbleed`)
- `navSolid`: boolean (default `false` — transparent nav)
- `showTestimonials`: boolean (default `false` — currently hidden)

## Assets
All photography is user-supplied and lives in the project's `uploads/` folder. Filenames map to usage as follows — get the actual image files from the design team/project rather than re-shooting:
- Hero background (full-bleed): `pexels-n-voitkevich-4943485.jpg` (two gold rings on cracked terracotta)
- Hero split thumbnails: `Gold_bracelet_on_marble_slab_...jpeg`, `Gold_cuff_on_slate_tile_...jpeg`
- Hero split main image: `Gold_necklace_draped_on_sandstone_...jpeg`
- Collections: `Gold_necklace_on_velvet_cushion_...jpeg` (Necklaces), `Gold_drop_earrings_near_obsidian_...jpeg` (Bridal), `Gold_signet_ring_with_crest_...jpeg` (Rings), `Gold_hoop_earrings_on_clay_...jpeg` (Earrings)
- About/Heritage: `Gold_brooch_on_silk_cloth_...jpeg`
- Trust icons: `Drafting_compass_sketching_ring_2K_...jpeg`, `Gold_icon_on_gold_bar_...jpeg`, `Gold_handmade_quality_icon_2K_...jpeg` (all rendered with `mix-blend-mode: multiply` to remove their white backgrounds — in production, prefer re-exporting these as transparent PNGs instead of relying on blend mode)
- Gallery carousel (10 images): reuses several of the above plus `Gold_necklace_draped_on_sandstone`, `Gold_ring_on_velvet_surface_...jpeg`, `Gold_anklet_tangled_on_driftwood_...jpeg`

Google Fonts loaded via `<link>`: Cormorant Garamond, Jost.

## Files
- `Suryaa Jewels Craft.dc.html` — the full design reference (included in this handoff folder)
