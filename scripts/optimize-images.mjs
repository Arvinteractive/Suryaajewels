// Converts the site's shipped raster images to WebP and removes the
// originals. Re-run this after adding or swapping any photo in
// public/images/ or the three imported assets in src/assets/ — it always
// operates on whatever is on disk right now, keyed by filename.
//
// Icons are resized: they're painted at 44px (TrustStrip) or 20px
// (Footer) but were exported at 2048x2048, ~45x their display size. The
// main photography is left at its native resolution and just re-encoded —
// several components size retina/large-viewport renders close to the
// source dimensions, so shrinking those risked a visible quality loss for
// a much smaller payoff than the format switch alone already gives.
import { readdirSync, statSync, unlinkSync } from 'node:fs'
import { join, basename, extname, relative } from 'node:path'
import sharp from 'sharp'

// Run via `npm run optimize-images` (see package.json), which always sets
// cwd to the project root — simpler and more robust on Windows than
// deriving it from import.meta.url, which URL-encodes spaces in the path.
const ROOT = process.cwd()

const PHOTO_QUALITY = 82
const ICON_QUALITY = 85
const SIGNATURE_QUALITY = 85 // TransformationScrub before/after — the one interactive detail shot
const ICON_MAX_WIDTH = 320
const ICON_NAMES = new Set(['icon-custom.jpg', 'icon-hallmark.jpg', 'icon-handmade.jpg'])
const SIGNATURE_NAMES = new Set(['gold-before.png', 'gold-after.png'])

let totalBefore = 0
let totalAfter = 0

async function convert(fullPath, { quality, maxWidth } = {}) {
  const before = statSync(fullPath).size
  const dir = fullPath.slice(0, -(basename(fullPath).length))
  const outPath = join(dir, basename(fullPath, extname(fullPath)) + '.webp')

  let pipeline = sharp(fullPath)
  if (maxWidth) pipeline = pipeline.resize({ width: maxWidth, withoutEnlargement: true })
  await pipeline.webp({ quality, effort: 6 }).toFile(outPath)

  const after = statSync(outPath).size
  unlinkSync(fullPath)

  totalBefore += before
  totalAfter += after
  console.log(
    `${relative(ROOT, fullPath)} -> ${relative(ROOT, outPath)}  ` +
      `${(before / 1024).toFixed(0)}KB -> ${(after / 1024).toFixed(0)}KB`,
  )
}

async function run() {
  const publicImages = join(ROOT, 'public', 'images')
  for (const name of readdirSync(publicImages)) {
    if (!/\.(jpe?g|png)$/i.test(name)) continue
    const full = join(publicImages, name)
    if (ICON_NAMES.has(name)) {
      await convert(full, { quality: ICON_QUALITY, maxWidth: ICON_MAX_WIDTH })
    } else {
      await convert(full, { quality: PHOTO_QUALITY })
    }
  }

  const srcAssets = join(ROOT, 'src', 'assets')
  for (const name of ['foreground-overlay.png', 'gold-before.png', 'gold-after.png']) {
    const full = join(srcAssets, name)
    await convert(full, { quality: SIGNATURE_NAMES.has(name) ? SIGNATURE_QUALITY : PHOTO_QUALITY })
  }

  console.log(
    `\nTotal: ${(totalBefore / 1024 / 1024).toFixed(2)}MB -> ${(totalAfter / 1024 / 1024).toFixed(2)}MB ` +
      `(${(100 - (totalAfter / totalBefore) * 100).toFixed(0)}% smaller)`,
  )
}

run()
