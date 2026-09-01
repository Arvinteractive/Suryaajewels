// English — the reference locale. Every other locale file mirrors this shape
// exactly, so a component can read `t.<section>.<key>` without ever checking
// which language is active.
export default {
  code: 'en',
  htmlLang: 'en',
  label: 'EN',
  name: 'English',

  meta: {
    title: 'Suryaa Jewels Craft | Bespoke 22K Gold Jewelry in Coimbatore',
    description:
      'Hand-forged 22K gold jewelry from a third-generation Coimbatore atelier. Bespoke haarams, bridal trousseaus, and custom heirloom pieces by master goldsmiths.',
  },

  nav: {
    microLabel: 'JEWELS CRAFT',
    links: ['Craft', 'Heritage', 'Visit'],
    book: 'Book a Visit',
    openMenu: 'Open menu',
    closeMenu: 'Close menu',
    langLabel: 'Language',
  },

  hero: {
    eyebrow: 'Suryaa Jewels Craft',
    headlineA: 'Master Goldsmiths.',
    headlineB: 'True 22K Heritage.',
    body: 'We don’t do assembly lines. Every piece is shaped, set, and polished by hand at our Coimbatore bench — preserving three generations of traditional Tamil goldsmithing.',
    ctaPrimary: 'See Our Craft',
    ctaSecondary: 'Our Story',
    mainAlt: 'Handcrafted 22K gold necklace draped over raw Coimbatore sandstone',
    thumbAlt: [
      'Handcrafted 22K gold bracelet resting on a marble slab, Suryaa Jewels Coimbatore',
      'Hand-forged 22K gold cuff bracelet on a slate tile, Coimbatore goldsmith bench',
    ],
  },

  trust: [
    {
      title: '100% Hand-Forged at Our Bench',
      text: 'Every piece is shaped, cast and finished entirely by hand — no machines, no shortcuts.',
    },
    {
      title: 'HUID Hallmarked 22K Gold, Guaranteed',
      text: 'All gold jewelry carries HUID hallmark certification before it leaves the workshop.',
    },
    {
      title: 'Bespoke Commissions, Brought to Life',
      text: 'Bring a sketch, a reference or an idea — our goldsmiths bring it to life in gold.',
    },
  ],

  manifesto: 'No mass casting. No shortcuts. Just pure gold and absolute precision.',

  showcase: {
    heading: 'What We Craft',
    subhead:
      'A showcase of the forms our goldsmiths return to most often — every piece made to order.',
    indexLabel: 'Collections · Made to Order',
    hint: 'Tap a category to open the file',
    close: 'Close',
  },

  collections: [
    {
      title: 'Necklaces & Haarams',
      sub: 'Statement pieces for festive occasions',
      tag: 'Temple',
      summary:
        'Authentic South Indian haarams built for muhurthams. Solid 22K gold, hand-soldered links, and temple motifs designed to outlast us all.',
    },
    {
      title: 'Bridal Sets',
      sub: 'Complete looks for the wedding day',
      tag: 'Bridal',
      summary:
        'Coordinated kundan, polki, and pure gold bridal trousseaus. We design the entire composition together so your wedding day look is completely seamless.',
    },
    {
      title: 'Rings',
      sub: 'Engagement, cocktail and everyday',
      tag: 'Everyday',
      summary:
        'From custom engagement bands to heavy daily-wear signets. Cast to your exact size and hand-polished — no lazy resizing cuts.',
    },
    {
      title: 'Earrings',
      sub: 'Jhumkas, studs and chandelier drops',
      tag: 'Festive',
      summary:
        'Traditional screw-back jhumkas that move perfectly, lightweight daily studs, and heavy evening chandelier drops.',
    },
  ],

  process: {
    heading: 'From Sketch to Setting',
    steps: [
      {
        title: 'The Blueprint',
        text: 'Every piece starts as a hand-drawn concept, sketched and refined with the client until the form is right.',
      },
      {
        title: 'The Carve',
        text: 'The design is precision-carved in wax, translating the sketch into three dimensions.',
      },
      {
        title: 'The Forge',
        text: 'The wax model is cast in 22K gold using the traditional lost-wax method.',
      },
      {
        title: 'The Set',
        text: 'Every stone is secured by eye, not machine — checked for alignment and security by hand.',
      },
      {
        title: 'The Polish',
        text: 'The finished piece is hand-polished at the bench before it earns the Suryaa mark.',
      },
    ],
  },

  transformation: {
    eyebrow: 'From Sketch to Setting',
    beforeLabel: 'The Sketch',
    afterLabel: 'The Heirloom',
    beforeAlt: 'Raw 999.9 fine gold bar before it is shaped into a piece',
    afterAlt: 'Finished 22K gold bracelet, the completed heirloom piece',
    handleAria: 'Drag to reveal the finished piece',
    prompt: 'Drag the handle across to reveal the finished piece',
  },

  heritage: {
    eyebrow: 'Our Heritage',
    heading: 'Three Generations at the Bench',
    body: 'We still work exactly the way our grandfather did. It takes time, patience, and hands that know how to coax raw metal into an heirloom. Small batches keep the craft honest.',
    imageAlt: 'Master goldsmith hand-soldering a 22K gold jewelry piece at the Coimbatore workbench',
  },

  testimonials: {
    heading: 'Trusted by Families for Generations',
    items: [
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
        quote: 'The kind of craftsmanship you assume doesn’t exist anymore. It does, here.',
        name: 'Meera S.',
        place: 'Chennai',
      },
    ],
  },

  gallery: {
    heading: 'From the Workshop',
    prev: 'Previous images',
    next: 'Next images',
    slide: (i, n) => `Go to slide ${i} of ${n}`,
    alts: [
      'Handcrafted 22K gold temple haaram on raw Coimbatore sandstone',
      'Hand-engraved 22K gold signet ring with a custom family crest',
      'Traditional 22K gold hoop earrings resting on natural clay',
      'Hand-set 22K gold drop earrings beside polished obsidian stone',
      'Bridal 22K gold necklace displayed on a velvet cushion',
      'Hand-finished 22K gold brooch resting on raw silk cloth',
      'Hand-forged 22K gold bracelet on a marble slab',
      'Hand-forged 22K gold cuff bracelet on a slate tile',
      'Hand-polished 22K gold ring displayed on a velvet surface',
      'Handcrafted 22K gold anklet tangled among driftwood',
    ],
  },

  visit: {
    eyebrow: 'The Studio',
    heading: 'Witness the Craft',
    addressLabel: 'Address',
    address: 'Suryaa Jewels Craft, Edayar St, Town Hall, Coimbatore, Tamil Nadu 641001',
    shortAddress: 'Edayar St, Town Hall, Coimbatore',
    hoursLabel: 'Hours',
    hours: 'Tuesday — Sunday, 10:30 AM – 7:30 PM',
    contactLabel: 'Contact',
    phone: '+91 88381 31708',
    instagram: 'Instagram — @suryaajewelscraft',
    cta: 'Book an Appointment',
    mapTitle: 'Suryaa Jewels Craft — Atelier location',
    directions: 'Get Directions',
  },

  footer: {
    microLabel: 'JEWELS CRAFT',
    tagline:
      'A family atelier making fine jewelry entirely by hand — one piece, one goldsmith, one sitting at a time.',
    assurance: 'Our Assurance',
    explore: 'Explore',
    visitUs: 'Visit Us',
    quote: 'The only difference between a commodity and an heirloom is the story you tell.',
    copyright: '© 2026 Suryaa Jewels Craft. All rights reserved.',
  },
}
