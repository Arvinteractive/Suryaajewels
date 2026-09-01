// Toggleable site configuration — mirrors the component props described
// in the design handoff (heroVariant / showTestimonials). Nav is always
// sticky and transparent, switching to dark text once scrolled past the hero.
export const siteConfig = {
  heroVariant: 'fullbleed', // 'split' | 'fullbleed'
  showTestimonials: false,
}

export const navLinks = [
  // Points at the "What We Craft" showcase, not the hero. #craft sits on the
  // hero, which is the top of the page — as a nav destination it just meant
  // "scroll back up", which is not what the label promises.
  { label: 'Craft', href: '#collections' },
  { label: 'Heritage', href: '#heritage' },
  { label: 'Visit', href: '#visit' },
]

export const trustItems = [
  {
    icon: '/images/icon-handmade.jpg',
    title: '100% Hand-Forged at Our Bench',
    text: 'Every piece is shaped, cast and finished entirely by hand — no machines, no shortcuts.',
  },
  {
    icon: '/images/icon-hallmark.jpg',
    title: 'HUID Hallmarked 22K Gold, Guaranteed',
    text: 'All gold jewelry carries HUID hallmark certification before it leaves the workshop.',
  },
  {
    icon: '/images/icon-custom.jpg',
    title: 'Bespoke Commissions, Brought to Life',
    text: 'Bring a sketch, a reference or an idea — our goldsmiths bring it to life in gold.',
  },
]

export const collections = [
  {
    title: 'Necklaces & Haarams',
    sub: 'Statement pieces for festive occasions',
    tag: 'Temple',
    shot: '/images/collection-necklaces.jpg',
    accent: '#C9A227',
    summary:
      'Authentic South Indian haarams built for muhurthams. Solid 22K gold, hand-soldered links, and temple motifs designed to outlast us all.',
    credits: ['22K hallmarked gold', 'Hand-set temple motifs', '4–6 week lead time'],
  },
  {
    title: 'Bridal Sets',
    sub: 'Complete looks for the wedding day',
    tag: 'Bridal',
    shot: '/images/collection-bridal.jpg',
    accent: '#D9B872',
    summary:
      'Coordinated kundan, polki, and pure gold bridal trousseaus. We design the entire composition together so your wedding day look is completely seamless.',
    credits: ['Full set, one goldsmith', 'Kundan & polki on request', 'Trial fitting included'],
  },
  {
    title: 'Rings',
    sub: 'Engagement, cocktail and everyday',
    tag: 'Everyday',
    shot: '/images/collection-rings.jpg',
    accent: '#B8860B',
    summary:
      'From custom engagement bands to heavy daily-wear signets. Cast to your exact size and hand-polished — no lazy resizing cuts.',
    credits: ['Cast to your size', 'Conflict-free stones', 'Engraving available'],
  },
  {
    title: 'Earrings',
    sub: 'Jhumkas, studs and chandelier drops',
    tag: 'Festive',
    shot: '/images/collection-earrings.jpg',
    accent: '#E0C068',
    summary:
      'Traditional screw-back jhumkas that move perfectly, lightweight daily studs, and heavy evening chandelier drops.',
    credits: ['Hand-set stonework', 'Screw-back & hook fittings', 'Made to order'],
  },
]

export const manifesto =
  'No mass casting. No shortcuts. Just pure gold and absolute precision.'

export const heirloomQuote =
  'The only difference between a commodity and an heirloom is the story you tell.'

export const transformation = {
  beforeLabel: 'The Sketch',
  afterLabel: 'The Heirloom',
}

export const processSteps = [
  {
    n: '01',
    title: 'The Blueprint',
    text: 'Every piece starts as a hand-drawn concept, sketched and refined with the client until the form is right.',
  },
  {
    n: '02',
    title: 'The Carve',
    text: 'The design is precision-carved in wax, translating the sketch into three dimensions.',
  },
  {
    n: '03',
    title: 'The Forge',
    text: 'The wax model is cast in 22K gold using the traditional lost-wax method.',
  },
  {
    n: '04',
    title: 'The Set',
    text: 'Every stone is secured by eye, not machine — checked for alignment and security by hand.',
  },
  {
    n: '05',
    title: 'The Polish',
    text: 'The finished piece is hand-polished at the bench before it earns the Suryaa mark.',
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
  { src: '/images/gallery-01.jpg', alt: 'Handcrafted 22K gold temple haaram on raw Coimbatore sandstone' },
  { src: '/images/gallery-02.jpg', alt: 'Hand-engraved 22K gold signet ring with a custom family crest' },
  { src: '/images/gallery-03.jpg', alt: 'Traditional 22K gold hoop earrings resting on natural clay' },
  { src: '/images/gallery-04.jpg', alt: 'Hand-set 22K gold drop earrings beside polished obsidian stone' },
  { src: '/images/gallery-05.jpg', alt: 'Bridal 22K gold necklace displayed on a velvet cushion' },
  { src: '/images/gallery-06.jpg', alt: 'Hand-finished 22K gold brooch resting on raw silk cloth' },
  { src: '/images/gallery-07.jpg', alt: 'Hand-forged 22K gold bracelet on a marble slab' },
  { src: '/images/gallery-08.jpg', alt: 'Hand-forged 22K gold cuff bracelet on a slate tile' },
  { src: '/images/gallery-09.jpg', alt: 'Hand-polished 22K gold ring displayed on a velvet surface' },
  { src: '/images/gallery-10.jpg', alt: 'Handcrafted 22K gold anklet tangled among driftwood' },
]
