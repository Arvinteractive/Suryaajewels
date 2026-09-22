// Toggleable site configuration — mirrors the component props described
// in the design handoff (heroVariant / showTestimonials). Nav is always
// sticky and transparent, switching to dark text once scrolled past the hero.
export const siteConfig = {
  heroVariant: 'fullbleed', // 'split' | 'fullbleed'
  showTestimonials: false,
}

// Everything below is the *structure* of the content — anchors, image paths,
// accent colours, step numbers. The words that go with each entry live in
// src/i18n/<lang>.js and are matched up by array position, so adding a
// language never means touching an asset path.

export const navLinks = [
  // Points at the "What We Craft" showcase, not the hero. #craft sits on the
  // hero, which is the top of the page — as a nav destination it just meant
  // "scroll back up", which is not what the label promises.
  { href: '#collections' },
  { href: '#heritage' },
  { href: '#visit' },
]

export const trustIcons = [
  '/images/icon-handmade.webp',
  '/images/icon-hallmark.webp',
  '/images/icon-custom.webp',
]

export const collectionArt = [
  { shot: '/images/collection-necklaces.webp', accent: '#C9A227' },
  { shot: '/images/collection-bridal.webp', accent: '#D9B872' },
  { shot: '/images/collection-rings.webp', accent: '#B8860B' },
  { shot: '/images/collection-earrings.webp', accent: '#E0C068' },
]

export const processNumbers = ['01', '02', '03', '04', '05']

export const galleryImages = [
  '/images/gallery-01.webp',
  '/images/gallery-02.webp',
  '/images/gallery-03.webp',
  '/images/gallery-04.webp',
  '/images/gallery-05.webp',
  '/images/gallery-06.webp',
  '/images/gallery-07.webp',
  '/images/gallery-08.webp',
  '/images/gallery-09.webp',
  '/images/gallery-10.webp',
]

// The pendant cut-outs, written by `npm run cutout-dollars` from the originals
// in src/assets/dollars/. Each one's intrinsic size is recorded because no two
// are the same shape and the rail has to reserve the right slot before the
// image lands — twenty-three pendants reflowing as they decode is exactly what
// would give the display away as a row of boxes.
export const dollarImages = [
  { src: '/images/dollars/dollar-01.webp', width: 574, height: 1100 },
  { src: '/images/dollars/dollar-02.webp', width: 549, height: 1100 },
  { src: '/images/dollars/dollar-03.webp', width: 771, height: 1100 },
  { src: '/images/dollars/dollar-04.webp', width: 654, height: 1100 },
  { src: '/images/dollars/dollar-05.webp', width: 703, height: 1100 },
  { src: '/images/dollars/dollar-06.webp', width: 695, height: 1100 },
  { src: '/images/dollars/dollar-07.webp', width: 632, height: 1100 },
  { src: '/images/dollars/dollar-08.webp', width: 791, height: 1100 },
  { src: '/images/dollars/dollar-09.webp', width: 662, height: 1100 },
  { src: '/images/dollars/dollar-10.webp', width: 644, height: 1100 },
  { src: '/images/dollars/dollar-11.webp', width: 569, height: 1100 },
  { src: '/images/dollars/dollar-12.webp', width: 685, height: 1100 },
  { src: '/images/dollars/dollar-13.webp', width: 624, height: 1100 },
  { src: '/images/dollars/dollar-14.webp', width: 550, height: 1100 },
  { src: '/images/dollars/dollar-15.webp', width: 297, height: 1100 },
  { src: '/images/dollars/dollar-16.webp', width: 543, height: 1100 },
  { src: '/images/dollars/dollar-17.webp', width: 499, height: 1100 },
  { src: '/images/dollars/dollar-18.webp', width: 571, height: 1100 },
  { src: '/images/dollars/dollar-19.webp', width: 707, height: 1100 },
  { src: '/images/dollars/dollar-20.webp', width: 357, height: 1100 },
  { src: '/images/dollars/dollar-21.webp', width: 553, height: 1100 },
  { src: '/images/dollars/dollar-22.webp', width: 612, height: 1100 },
  { src: '/images/dollars/dollar-23.webp', width: 720, height: 1100 },
]

// Not localised: a phone number, a handle and a map query are the same string
// in every language.
export const contact = {
  phone: '+91 88381 31708',
  instagram: '@suryaajewelscraft',
  instagramUrl: 'https://instagram.com/suryaajewelscraft',
  mapEmbed:
    'https://www.google.com/maps?q=10.9968868,76.9530199(Suryaa+Jewels+Craft)&z=18&output=embed',
  directionsUrl:
    'https://www.google.com/maps/place/Edayar+St,+Kundapur,+Town+Hall,+Coimbatore,+Tamil+Nadu+641001,+India/@10.9970194,76.9527802,19.57z/data=!4m6!3m5!1s0x3ba8590e011c8e67:0xe109219d0bb96bf7!8m2!3d10.9968868!4d76.9530199!16s%2Fg%2F11f4qq5_rj?hl=en-US&entry=ttu&g_ep=EgoyMDI2MDgyNi4wIKXMDSoASAFQAw%3D%3D',
}
