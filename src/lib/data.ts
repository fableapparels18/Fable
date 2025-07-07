export interface Product {
  id: number;
  name: string;
  price: number;
  category: 'Oversized' | 'Hoodie' | 'Full Sleeves' | 'Half Sleeves' | 'Sweatshirt';
  image: string;
  isTrending: boolean;
  isNew: boolean;
  data_ai_hint: string;
}

const products: Product[] = [
  {
    id: 1,
    name: 'Monochrome Echo Tee',
    price: 34.99,
    category: 'Oversized',
    image: 'https://placehold.co/400x500.png',
    isTrending: true,
    isNew: false,
    data_ai_hint: 'graphic tee',
  },
  {
    id: 2,
    name: 'Urban Canvas Hoodie',
    price: 69.99,
    category: 'Hoodie',
    image: 'https://placehold.co/400x500.png',
    isTrending: true,
    isNew: false,
    data_ai_hint: 'streetwear hoodie'
  },
  {
    id: 3,
    name: 'Shadow Stripe Long Sleeve',
    price: 42.00,
    category: 'Full Sleeves',
    image: 'https://placehold.co/400x500.png',
    isTrending: false,
    isNew: true,
    data_ai_hint: 'mens fashion'
  },
  {
    id: 4,
    name: 'Minimalist Signature Tee',
    price: 29.99,
    category: 'Half Sleeves',
    image: 'https://placehold.co/400x500.png',
    isTrending: true,
    isNew: true,
    data_ai_hint: 'white t-shirt'
  },
  {
    id: 5,
    name: 'Fable-Knit Sweatshirt',
    price: 55.50,
    category: 'Sweatshirt',
    image: 'https://placehold.co/400x500.png',
    isTrending: false,
    isNew: true,
    data_ai_hint: 'black sweatshirt'
  },
  {
    id: 6,
    name: 'Noir Essential Tee',
    price: 28.00,
    category: 'Half Sleeves',
    image: 'https://placehold.co/400x500.png',
    isTrending: false,
    isNew: false,
    data_ai_hint: 'black t-shirt'
  },
  {
    id: 7,
    name: 'Asymmetric Flow Tee',
    price: 36.00,
    category: 'Oversized',
    image: 'https://placehold.co/400x500.png',
    isTrending: true,
    isNew: true,
    data_ai_hint: 'fashion style'
  },
  {
    id: 8,
    name: 'Static Graphic Hoodie',
    price: 75.00,
    category: 'Hoodie',
    image: 'https://placehold.co/400x500.png',
    isTrending: false,
    isNew: true,
    data_ai_hint: 'urban fashion'
  },
];

export function getTrendingProducts(): Product[] {
  return products.filter((p) => p.isTrending);
}

export function getNewProducts(): Product[] {
  return products.filter((p) => p.isNew);
}

export function getAllProducts(): Product[] {
  return products;
}
