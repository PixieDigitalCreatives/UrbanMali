export interface ProductVariant {
  size: 'Small' | 'Medium' | 'Large' | '1 kg' | '5 kg';
  price: number;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  subtitle: string;
  category: 'Indoor' | 'Outdoor' | 'Balcony' | 'Pots' | 'Soil' | 'Compost';
  price: number;
  image: string;
  inStock: boolean;
  sunlight: 'Low light' | 'Moderate light' | 'Bright direct';
  watering: 'Low' | 'Moderate watering' | 'Daily';
  careLevel: 'Easy care' | 'Moderate' | 'Expert';
  description: string;
  variants: ProductVariant[];
}

export const products: Product[] = [
  {
    id: 'money-plant',
    slug: 'money-plant',
    name: 'Money Plant (Indoor)',
    subtitle: 'Epipremnum aureum — lush trailing foliage',
    category: 'Indoor',
    price: 299,
    image: '/images/product-money-plant.jpg',
    inStock: true,
    sunlight: 'Low light',
    watering: 'Moderate watering',
    careLevel: 'Easy care',
    description: 'A hardy, lush trailing houseplant known for air-purifying qualities and adaptable growth in urban apartments.',
    variants: [
      { size: 'Small', price: 199 },
      { size: 'Medium', price: 299 },
      { size: 'Large', price: 449 }
    ]
  },
  {
    id: 'snake-plant',
    slug: 'snake-plant',
    name: 'Snake Plant (Sansevieria)',
    subtitle: 'Architectural sword leaves, oxygen booster',
    category: 'Indoor',
    price: 399,
    image: '/images/product-snake-plant.jpg',
    inStock: true,
    sunlight: 'Low light',
    watering: 'Low',
    careLevel: 'Easy care',
    description: 'Thrives on neglect and produces nighttime oxygen. Excellent choice for bedroom side tables or dimly lit workspaces.',
    variants: [
      { size: 'Small', price: 299 },
      { size: 'Medium', price: 399 },
      { size: 'Large', price: 599 }
    ]
  },
  {
    id: 'areca-palm',
    slug: 'areca-palm',
    name: 'Areca Palm',
    subtitle: 'Feathery tropical foliage for living spaces',
    category: 'Balcony',
    price: 599,
    image: '/images/product-areca-palm.jpg',
    inStock: true,
    sunlight: 'Moderate light',
    watering: 'Moderate watering',
    careLevel: 'Easy care',
    description: 'Graceful arching fronds that introduce calming nature into living room corners and covered balcony nooks.',
    variants: [
      { size: 'Small', price: 449 },
      { size: 'Medium', price: 599 },
      { size: 'Large', price: 899 }
    ]
  },
  {
    id: 'ceramic-planter',
    slug: 'ceramic-planter',
    name: 'Ceramic Planter (Fluted Tan)',
    subtitle: 'Minimalist glazed ceramic with drainage tray',
    category: 'Pots',
    price: 499,
    image: '/images/product-ceramic-planter.jpg',
    inStock: true,
    sunlight: 'Bright direct',
    watering: 'Moderate watering',
    careLevel: 'Easy care',
    description: 'Handcrafted stoneware pot fired in natural clay-sand hues with bottom drainage hole and matching saucer.',
    variants: [
      { size: 'Small', price: 349 },
      { size: 'Medium', price: 499 },
      { size: 'Large', price: 699 }
    ]
  },
  {
    id: 'organic-compost',
    slug: 'organic-compost',
    name: 'Organic Vermicompost',
    subtitle: 'Microbe-rich vermicompost for root health',
    category: 'Compost',
    price: 199,
    image: '/images/product-organic-compost.jpg',
    inStock: true,
    sunlight: 'Low light',
    watering: 'Low',
    careLevel: 'Easy care',
    description: '100% natural slow-release plant nutrition fortified with bio-enzymes to rejuvenate potted urban soil.',
    variants: [
      { size: '1 kg', price: 199 },
      { size: '5 kg', price: 699 }
    ]
  },
  {
    id: 'bonsai-ficus',
    slug: 'bonsai-ficus',
    name: 'Ficus Microcarpa Bonsai',
    subtitle: 'Stately living sculpture for coffee tables',
    category: 'Indoor',
    price: 899,
    image: '/images/product-bonsai.jpg',
    inStock: true,
    sunlight: 'Moderate light',
    watering: 'Moderate watering',
    careLevel: 'Moderate',
    description: 'A 5-year-old shaped miniature tree with robust aerial roots, potted in ceramic tray with moss accents.',
    variants: [
      { size: 'Medium', price: 899 },
      { size: 'Large', price: 1299 }
    ]
  },
  {
    id: 'air-purifier-trio',
    slug: 'air-purifier-trio',
    name: 'Air Purifier Trio Set',
    subtitle: 'Syngonium, Spider Plant & Pothos in eco pots',
    category: 'Indoor',
    price: 749,
    image: '/images/product-plant-set.jpg',
    inStock: true,
    sunlight: 'Moderate light',
    watering: 'Moderate watering',
    careLevel: 'Easy care',
    description: 'Curated bundle of three resilient indoor varieties known to filter household VOCs.',
    variants: [
      { size: 'Medium', price: 749 }
    ]
  },
  {
    id: 'terracotta-pot',
    slug: 'terracotta-pot',
    name: 'Handcrafted Terracotta Pot',
    subtitle: 'Porous earthen clay planter for healthy roots',
    category: 'Pots',
    price: 249,
    image: '/images/product-terracotta-pot.jpg',
    inStock: true,
    sunlight: 'Bright direct',
    watering: 'Low',
    careLevel: 'Easy care',
    description: 'Traditional porous baked red terracotta that enables root aeration and prevents root rot.',
    variants: [
      { size: 'Small', price: 179 },
      { size: 'Medium', price: 249 },
      { size: 'Large', price: 399 }
    ]
  }
];

export const productCategories = [
  'All',
  'Indoor',
  'Outdoor',
  'Balcony',
  'Pots',
  'Soil',
  'Compost'
] as const;
