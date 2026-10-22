export interface Plan {
  id: string;
  title: string;
  audience: string;
  statusText: string;
  image: string;
  description: string;
  features: string[];
}

export const plans: Plan[] = [
  {
    id: 'home-gardening-plan',
    title: 'Home Gardening Plan',
    audience: 'Apartments, Balconies & Independent Houses',
    statusText: 'Plan details coming soon',
    image: '/images/plan-home-gardening.jpg',
    description: 'Scheduled weekly or bi-weekly visits by trusted local maalis to keep your home jungle thriving year-round.',
    features: [
      'Fortnightly or monthly scheduled visits',
      'Seasonal plant repotting & root aerating',
      'Organic pest control prevention treatments',
      'Direct WhatsApp access to urban garden advisors'
    ]
  },
  {
    id: 'society-office-plan',
    title: 'Society / Office Plan',
    audience: 'Residential Communities, Corporate & Retail',
    statusText: 'Plan details coming soon',
    image: '/images/plan-society-garden.jpg',
    description: 'Complete groundskeeping, lobby plant rotations, and common area greenery maintenance with supervisor oversight.',
    features: [
      'Tailored frequency (2x weekly to full-time presence)',
      'Dedicated equipment & organic nutrient scheduling',
      'Quarterly green audit and biodiversity enhancement',
      'Commercial billing with transparent invoicing'
    ]
  }
];
