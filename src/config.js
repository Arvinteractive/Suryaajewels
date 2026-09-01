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
  '/images/icon-handmade.jpg',
  '/images/icon-hallmark.jpg',
  '/images/icon-custom.jpg',
]

export const collectionArt = [
  { shot: '/images/collection-necklaces.jpg', accent: '#C9A227' },
  { shot: '/images/collection-bridal.jpg', accent: '#D9B872' },
  { shot: '/images/collection-rings.jpg', accent: '#B8860B' },
  { shot: '/images/collection-earrings.jpg', accent: '#E0C068' },
]

export const processNumbers = ['01', '02', '03', '04', '05']

export const galleryImages = [
  '/images/gallery-01.jpg',
  '/images/gallery-02.jpg',
  '/images/gallery-03.jpg',
  '/images/gallery-04.jpg',
  '/images/gallery-05.jpg',
  '/images/gallery-06.jpg',
  '/images/gallery-07.jpg',
  '/images/gallery-08.jpg',
  '/images/gallery-09.jpg',
  '/images/gallery-10.jpg',
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
