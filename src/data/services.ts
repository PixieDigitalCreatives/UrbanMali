export interface Service {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  priceDisplay: string;
  priceNote?: string;
  priceNumeric?: number;
  image: string;
  isQuoteOnly?: boolean;
  duration: string;
  description: string;
  included: string[];
  notIncluded: string[];
}

export const services: Service[] = [
  {
    id: 'plant-maintenance',
    slug: 'plant-maintenance',
    title: 'Garden / Plant Maintenance',
    subtitle: 'Regular care for healthy and beautiful plants at your home.',
    priceDisplay: 'From ₹749',
    priceNote: 'Up to 20 pots',
    priceNumeric: 749,
    image: '/images/service-plant-maintenance.jpg',
    duration: '1 visit (approx. 1–2 hours)',
    description: 'Comprehensive pruning, weed removal, soil aerating, and organic fertilizer feeding for indoor and balcony plants.',
    included: [
      'Plant cleaning, dusting and precision pruning',
      'Soil check and basic nourishment',
      'Pest inspection and organic treatment recommendation',
      'Expert seasonal care tips and watering advice'
    ],
    notIncluded: [
      'New plants or replacement pots',
      'Major structural plant replacement',
      'Civil or structural landscaping changes'
    ]
  },
  {
    id: 'maintenance-addon',
    slug: 'maintenance-addon',
    title: 'Maintenance Add-on',
    subtitle: 'Extra care add-on visits and pot repotting support.',
    priceDisplay: 'From ₹199',
    priceNote: 'Per 10 extra pots',
    priceNumeric: 199,
    image: '/images/service-maintenance-addon.jpg',
    duration: '30–45 mins',
    description: 'Quick top-up visit or expansion for homes with larger plant collections needing targeted care.',
    included: [
      'Repotting of up to 3 plants (pots/soil provided by user or purchased)',
      'Secondary root aeration',
      'Foliar spray application'
    ],
    notIncluded: [
      'Heavy tree trimming',
      'Fertilizer supply beyond single dose'
    ]
  },
  {
    id: 'nursery-delivery',
    slug: 'nursery-delivery',
    title: 'Plant Nursery and Delivery',
    subtitle: 'Wide range of healthy curated indoor & outdoor plants.',
    priceDisplay: 'Wide range of plants',
    priceNote: 'Direct nursery rates',
    image: '/images/service-nursery-delivery.jpg',
    duration: 'Same-day or next-day delivery',
    description: 'Handpicked plants delivered directly from local nursery partners with soil acclimatization check.',
    included: [
      'Healthy sapling selection from partner nurseries',
      'Safe door-step transit in eco-friendly packaging',
      'Initial planting placement guide'
    ],
    notIncluded: [
      'Continuous daily watering'
    ]
  },
  {
    id: 'balcony-makeover',
    slug: 'balcony-makeover',
    title: 'Balcony Makeover and Setup',
    subtitle: 'Transform your balcony into a lush green haven.',
    priceDisplay: 'Transform your balcony',
    priceNote: 'Custom consultation',
    isQuoteOnly: true,
    image: '/images/service-balcony-setup.jpg',
    duration: 'Site visit + setup slot',
    description: 'End-to-end design layout, plant selection, planter railing fixtures, and ambient green space transformation.',
    included: [
      'On-site sunlight and spatial analysis',
      'Custom plant palette curation for balcony climate',
      'Railing planter installation & potting setup'
    ],
    notIncluded: [
      'Civil construction or tile alterations'
    ]
  },
  {
    id: 'irrigation-setup',
    slug: 'irrigation-setup',
    title: 'Irrigation Setup',
    subtitle: 'Automated drip and micro-spray watering systems.',
    priceDisplay: 'Starting price on request',
    priceNote: 'Quote based on tap points',
    isQuoteOnly: true,
    image: '/images/service-irrigation.jpg',
    duration: '2–4 hours installation',
    description: 'Worry-free automated watering solutions for balconies, terraces, and garden beds so your plants flourish while you travel.',
    included: [
      'Timer controller setup & water pressure check',
      'UV-treated food grade drip tubing',
      'Individual adjustable micro-drippers per pot'
    ],
    notIncluded: [
      'Main water pipe plumbing replacements'
    ]
  },
  {
    id: 'society-office-maintenance',
    slug: 'society-office-maintenance',
    title: 'Society / Office Maintenance',
    subtitle: 'Scheduled recurring care for residential complexes & offices.',
    priceDisplay: 'Request a quote',
    priceNote: 'Custom commercial tier',
    isQuoteOnly: true,
    image: '/images/service-society-office.jpg',
    duration: 'Weekly or bi-weekly contracts',
    description: 'Professional green-scape care for lobbies, shared society parks, corporate courtyards, and co-working terraces.',
    included: [
      'Dedicated local maali roster & supervisor checks',
      'Lawn mowing, hedge trimming & edge maintenance',
      'Bulk pest inspection and compost enrichment'
    ],
    notIncluded: [
      'Civil drainage system overhauls'
    ]
  }
];
