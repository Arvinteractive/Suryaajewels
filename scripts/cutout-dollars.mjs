// Cuts the gold pendants ("dollars") out of their studio backdrop and writes
// transparent WebPs to public/images/dollars/.
//
// Re-run with `npm run cutout-dollars` after adding or replacing a shot in
// src/assets/dollars/ — the originals stay put, this only ever writes
// derivatives, so the mask can always be re-tuned from the source frames.
//
// The key is saturation, not luminance. Every frame was shot on the same
// neutral grey card, and grey is by definition R=G=B, while 22K gold sits at a
// strong yellow saturation — so colourfulness separates the two cleanly no
// matter how hard the backdrop vignettes (it ranges 100-200 across these
// frames, which is why a brightness threshold could never have worked).
//
// It has to be saturation — chroma over value — and not the raw chroma
// distance, because of two effects pulling in opposite directions. Gold lying
// in its own shadow keeps its hue but loses amplitude: (40,32,21) is
// unmistakably gold at saturation 0.47, yet its raw chroma is only 19, so a
// chroma cutoff high enough to be useful would eat every shadowed recess. And
// the gold bounces its own colour onto the card sitting behind the piercing,
// which turns the backdrop into a warm beige — (182,170,146) reaches chroma 36
// while being plainly not metal, and its saturation of 0.20 says so.
//
// What chroma alone gets wrong is everything *inside* the silhouette, and it
// gets it wrong in both directions: polished gold throws specular highlights
// that blow out to neutral white, and the pierced temple work in most of these
// pieces shows the grey card straight through. Both are neutral, so both look
// identical to the chroma key — one has to stay, the other has to go. They
// separate on the *mean luminance of the connected region*, not on any single
// pixel: measured across these frames a gap in the piercing averages 107-195
// (it is lit card, and the gold bounces light into it), while a blown
// highlight averages 248-253. Nothing lands in between, so the threshold below
// sits in a ~30-point no man's land on either side.
import { readdirSync, mkdirSync, statSync } from 'node:fs'
import { join, relative } from 'node:path'
import sharp from 'sharp'

const ROOT = process.cwd()
const SRC = join(ROOT, 'src', 'assets', 'dollars-new')
const OUT = join(ROOT, 'public', 'images', 'dollars')

const SAT_METAL = 0.33 // at or above this a pixel is unambiguously gold...
const CHROMA_FLOOR = 12 // ...but near-black pixels reach any saturation on noise
const SPECULAR_LUMA = 225 // mean luma of an enclosed region that is a highlight
const RECESS_LUMA = 90 // ...and of one that is a shadowed recess in the piece
const BRIDGE_RADIUS = 2 // closes hairline dropouts so the piece stays one blob
const MIN_BLOB = 0.003 // fraction of frame; smaller islands are chroma noise
const EDGE_TRIM = 1 // shave the half-gold/half-card pixel ring off the contour
const TRIM_ALPHA = 8 // below this a pixel is backdrop, and does not set the crop
const PAD = 0.04 // breathing room around the trimmed subject
const MAX_EDGE = 1100
const QUALITY = 86

// One 4-neighbour pass. Binary morphology on a 1.5MP frame is cheap enough to
// do the naive way, and a radius of 2 is two passes.
function morph(mask, w, h, dilating) {
  const out = new Uint8Array(mask.length)
  const hit = dilating ? 1 : 0
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const i = y * w + x
      let v = mask[i]
      if (v !== hit) {
        if (
          (x > 0 && mask[i - 1] === hit) ||
          (x < w - 1 && mask[i + 1] === hit) ||
          (y > 0 && mask[i - w] === hit) ||
          (y < h - 1 && mask[i + w] === hit)
        ) {
          v = hit
        }
      }
      out[i] = v
    }
  }
  return out
}

const dilate = (m, w, h, r) => {
  for (let i = 0; i < r; i++) m = morph(m, w, h, true)
  return m
}
const erode = (m, w, h, r) => {
  for (let i = 0; i < r; i++) m = morph(m, w, h, false)
  return m
}

// Walks every 4-connected region of `mask` and hands each one to `visit` as a
// flat list of pixel indices plus whether it runs off the edge of the frame.
// Iterative, with an explicit stack — the backdrop region alone is a million
// pixels, which is several times past the call-stack limit for recursion.
function eachRegion(mask, w, h, visit) {
  const seen = new Uint8Array(mask.length)
  const stack = new Int32Array(mask.length)
  const region = new Int32Array(mask.length)

  for (let start = 0; start < mask.length; start++) {
    if (!mask[start] || seen[start]) continue
    let top = 0
    let n = 0
    let touchesEdge = false
    stack[top++] = start
    seen[start] = 1
    while (top > 0) {
      const i = stack[--top]
      region[n++] = i
      const x = i % w
      const y = (i / w) | 0
      if (x === 0 || y === 0 || x === w - 1 || y === h - 1) touchesEdge = true
      const push = (j) => {
        if (!mask[j] || seen[j]) return
        seen[j] = 1
        stack[top++] = j
      }
      if (x > 0) push(i - 1)
      if (x < w - 1) push(i + 1)
      if (y > 0) push(i - w)
      if (y < h - 1) push(i + w)
    }
    visit(region, n, touchesEdge)
  }
}

// A source that already carries its own cut-out needs none of the keying
// below — the alpha it ships with is better than anything inferred from the
// colour, so it is used verbatim and only trimmed.
async function alphaFromSource(data, w, h, c) {
  const n = w * h
  const alpha = new Uint8Array(n)
  for (let i = 0, p = 0; i < n; i++, p += c) alpha[i] = data[p + 3]
  return alpha
}

async function alphaByKeying(data, w, h, c) {
  const n = w * h
  const luma = new Uint8Array(n)
  const metal = new Uint8Array(n)

  for (let i = 0, p = 0; i < n; i++, p += c) {
    const r = data[p]
    const g = data[p + 1]
    const b = data[p + 2]
    const max = Math.max(r, g, b)
    const chroma = max - Math.min(r, g, b)
    luma[i] = (0.299 * r + 0.587 * g + 0.114 * b) | 0
    metal[i] = chroma >= CHROMA_FLOOR && chroma / Math.max(1, max) >= SAT_METAL ? 1 : 0
  }

  // Every neutral region that doesn't reach the frame edge is enclosed by the
  // piece, so it is either a highlight, a recess, or a hole we can see the
  // card through. The first two belong to the pendant and get pulled back in.
  const solid = Uint8Array.from(metal)
  const neutral = new Uint8Array(n)
  for (let i = 0; i < n; i++) neutral[i] = metal[i] ? 0 : 1

  eachRegion(neutral, w, h, (region, count, touchesEdge) => {
    if (touchesEdge) return
    let sum = 0
    for (let k = 0; k < count; k++) sum += luma[region[k]]
    const mean = sum / count
    if (mean >= SPECULAR_LUMA || mean <= RECESS_LUMA) {
      for (let k = 0; k < count; k++) solid[region[k]] = 1
    }
  })

  // Connectivity is decided on a closed copy so a hairline of gold that JPEG
  // softened below the chroma threshold can't lop a bail off, but the closing
  // is only ever used to *select* — intersecting back means it can never drag
  // a card-coloured pixel into the cutout.
  const bridged = erode(dilate(solid, w, h, BRIDGE_RADIUS), w, h, BRIDGE_RADIUS)
  const keep = new Uint8Array(n)
  const minArea = Math.round(n * MIN_BLOB)
  eachRegion(bridged, w, h, (region, count) => {
    if (count < minArea) return
    for (let k = 0; k < count; k++) keep[region[k]] = 1
  })

  let mask = new Uint8Array(n)
  for (let i = 0; i < n; i++) mask[i] = solid[i] && keep[i] ? 1 : 0
  mask = erode(mask, w, h, EDGE_TRIM)

  const alpha = new Uint8Array(n)
  for (let i = 0; i < n; i++) alpha[i] = mask[i] ? 255 : 0
  return alpha
}

async function cutout(file, index) {
  const source = sharp(join(SRC, file))
  const preCut = (await source.metadata()).hasAlpha
  const { data, info } = await source.ensureAlpha().raw().toBuffer({ resolveWithObject: true })

  const { width: w, height: h, channels: c } = info
  const n = w * h
  const alpha = preCut
    ? await alphaFromSource(data, w, h, c)
    : await alphaByKeying(data, w, h, c)

  let minX = w
  let minY = h
  let maxX = -1
  let maxY = -1
  const rgba = Buffer.alloc(n * 4)
  for (let i = 0, p = 0, q = 0; i < n; i++, p += c, q += 4) {
    const a = alpha[i]
    if (a < TRIM_ALPHA) continue
    // Colour is carried only where the piece actually is. Everywhere else the
    // buffer stays black, so the anti-aliasing blur below can only bleed black
    // into the rim rather than dragging the source's own backdrop — or, for a
    // pre-cut render, the glow it was composited against — out past the edge.
    rgba[q] = data[p]
    rgba[q + 1] = data[p + 1]
    rgba[q + 2] = data[p + 2]
    rgba[q + 3] = a
    const x = i % w
    const y = (i / w) | 0
    if (x < minX) minX = x
    if (x > maxX) maxX = x
    if (y < minY) minY = y
    if (y > maxY) maxY = y
  }

  if (maxX < 0) throw new Error(`no subject found in ${file}`)

  const padX = Math.round((maxX - minX) * PAD)
  const padY = Math.round((maxY - minY) * PAD)
  const left = Math.max(0, minX - padX)
  const top = Math.max(0, minY - padY)
  const cropW = Math.min(w - left, maxX - minX + 1 + padX * 2)
  const cropH = Math.min(h - top, maxY - minY + 1 + padY * 2)

  const name = `dollar-${String(index + 1).padStart(2, '0')}.webp`
  const outPath = join(OUT, name)
  const out = await sharp(rgba, { raw: { width: w, height: h, channels: 4 } })
    // The mask is 1-bit, so the contour needs anti-aliasing before anything
    // else touches it. Transparent pixels were left black rather than carrying
    // their original grey, so this sub-pixel blur can only ever bleed black
    // into the rim — which is exactly what the black panel behind it wants.
    .blur(0.7)
    .extract({ left, top, width: cropW, height: cropH })
    .resize({ width: MAX_EDGE, height: MAX_EDGE, fit: 'inside', withoutEnlargement: true })
    .webp({ quality: QUALITY, alphaQuality: 92, effort: 6 })
    .toFile(outPath)

  console.log(
    `${relative(ROOT, join(SRC, file))} -> ${relative(ROOT, outPath)}  ` +
      `${(statSync(join(SRC, file)).size / 1024).toFixed(0)}KB -> ${(out.size / 1024).toFixed(0)}KB  ` +
      `${out.width}x${out.height}`,
  )
  return { name, width: out.width, height: out.height }
}

mkdirSync(OUT, { recursive: true })
const candidates = readdirSync(SRC)
  .filter((f) => /\.(jpe?g|png|webp)$/i.test(f))
  .sort()

// The source folder holds both the finished renders and the phone photographs
// they were made from. Shipping both would put every pendant on the rail
// twice, in two different styles, so when any pre-cut source is present the
// flat photographs are treated as the working files they are and left alone.
const withAlpha = []
for (const f of candidates) {
  if ((await sharp(join(SRC, f)).metadata()).hasAlpha) withAlpha.push(f)
}
const files = withAlpha.length ? withAlpha : candidates
if (withAlpha.length && withAlpha.length !== candidates.length) {
  console.log(
    `${withAlpha.length} pre-cut sources; skipping ${candidates.length - withAlpha.length} ` +
      `flat photograph(s) in the same folder\n`,
  )
}

const manifest = []
for (const [i, file] of files.entries()) manifest.push(await cutout(file, i))
console.log(`\n${manifest.length} cutouts\n`, JSON.stringify(manifest))
