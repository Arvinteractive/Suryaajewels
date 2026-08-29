// Toggleable site configuration — mirrors the component props described
// in the design handoff (heroVariant / showTestimonials). Nav is always
// sticky and transparent, switching to dark text once scrolled past the hero.
export const siteConfig = {
  heroVariant: 'fullbleed', // 'split' | 'fullbleed'
  showTestimonials: false,
}

export const navLinks = [
  { label: 'Craft', href: '#craft' },
  { label: 'Heritage', href: '#heritage' },
  { label: 'Collections', href: '#collections' },
  { label: 'Visit', href: '#visit' },
]

export const trustItems = [
  {
    icon: '/images/icon-handmade.jpg',
    title: 'Handmade, Not Machine-Cast',
    text: 'Every piece is shaped, cast and finished by hand at our own bench.',
  },
  {
    icon: '/images/icon-hallmark.jpg',
    title: 'BIS Hallmarked Gold',
    text: 'All gold jewelry is hallmarked and certified before it leaves the workshop.',
  },
  {
    icon: '/images/icon-custom.jpg',
    title: 'Custom Design on Request',
    text: 'Bring a sketch, a reference or an idea — we design around you.',
  },
]

export const collections = [
  {
    title: 'Necklaces & Haarams',
    sub: 'Statement pieces for festive occasions',
    shot: '/images/collection-necklaces.jpg',
    accent: '#C9A227',
    summary:
      'Layered haarams and single-strand necklaces built for festival mornings and wedding nights alike — each link soldered and finished entirely by hand at our bench.',
    credits: ['22K hallmarked gold', 'Hand-set temple motifs', '4–6 week lead time'],
  },
  {
    title: 'Bridal Sets',
    sub: 'Complete looks for the wedding day',
    shot: '/images/collection-bridal.jpg',
    accent: '#D9B872',
    summary:
      'Necklace, earrings and maang tikka designed as one composition, so the whole bridal look reads as a single, considered piece rather than parts assembled at the last minute.',
    credits: ['Full set, one goldsmith', 'Kundan & polki on request', 'Trial fitting included'],
  },
  {
    title: 'Rings',
    sub: 'Engagement, cocktail and everyday',
    shot: '/images/collection-rings.jpg',
    accent: '#B8860B',
    summary:
      'From a first engagement ring to an everyday signet, every band is cast to size and hand-finished — no resizing counter, no shortcuts.',
    credits: ['Cast to your size', 'Conflict-free stones', 'Engraving available'],
  },
  {
    title: 'Earrings',
    sub: 'Jhumkas, studs and chandelier drops',
    shot: '/images/collection-earrings.jpg',
    accent: '#E0C068',
    summary:
      'Jhumkas that still move like they should, studs light enough for daily wear, and chandelier drops built stone by stone for the evening.',
    credits: ['Hand-set stonework', 'Screw-back & hook fittings', 'Made to order'],
  },
]

export const manifesto =
  'Nothing here is machine-cast, mass-produced, or made twice the same way.'

export const transformation = {
  beforeLabel: 'The Sketch',
  beforeWord: 'an idea',
  afterLabel: 'The Heirloom',
  afterWord: 'in gold',
}

export const processSteps = [
  {
    n: '01',
    title: 'Design Sketch',
    text: 'Every piece starts as a hand-drawn sketch, refined with the client until the form is right.',
  },
  {
    n: '02',
    title: 'Wax Carving',
    text: 'The design is carved in wax, translating the sketch into three dimensions.',
  },
  {
    n: '03',
    title: 'Casting',
    text: 'The wax model is cast in gold or silver using the lost-wax method.',
  },
  {
    n: '04',
    title: 'Stone Setting',
    text: 'Stones are set one at a time by hand, checked for alignment and security.',
  },
  {
    n: '05',
    title: 'Hand Polishing',
    text: 'The piece is polished and finished entirely by hand before it leaves the bench.',
  },
]

export const testimonials = [
  {
    quote:
      'They remade my grandmother’s bangles without losing a single detail of the original design.',
    name: 'Priya R.',
    place: 'Chennai',
  },
  {
    quote:
      'We brought a rough sketch for an engagement ring and they built exactly what we imagined.',
    name: 'Arjun K.',
    place: 'Bengaluru',
  },
  {
    quote:
      'The kind of craftsmanship you assume doesn’t exist anymore. It does, here.',
    name: 'Meera S.',
    place: 'Chennai',
  },
]

export const galleryImages = [
  { src: '/images/gallery-01.jpg', alt: 'Gold necklace draped on sandstone' },
  { src: '/images/gallery-02.jpg', alt: 'Gold signet ring with crest' },
  { src: '/images/gallery-03.jpg', alt: 'Gold hoop earrings on clay' },
  { src: '/images/gallery-04.jpg', alt: 'Gold drop earrings near obsidian' },
  { src: '/images/gallery-05.jpg', alt: 'Gold necklace on velvet cushion' },
  { src: '/images/gallery-06.jpg', alt: 'Gold brooch on silk cloth' },
  { src: '/images/gallery-07.jpg', alt: 'Gold bracelet on marble slab' },
  { src: '/images/gallery-08.jpg', alt: 'Gold cuff on slate tile' },
  { src: '/images/gallery-09.jpg', alt: 'Gold ring on velvet surface' },
  { src: '/images/gallery-10.jpg', alt: 'Gold anklet tangled on driftwood' },
]
