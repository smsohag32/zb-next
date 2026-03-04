export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  originalPrice?: number;
  images: string[];
  category: string;
  brand: string;
  sizes: ProductSize[];
  colors: ProductColor[];
  rating: number;
  reviewCount: number;
  isNew?: boolean;
  isFeatured?: boolean;
  inStock: boolean;
}

export interface ProductSize {
  name?: string;
  size?: string;
  quantity?: number;
  inStock: boolean;
}

export interface ProductColor {
  color: string;
  name: string;
  hex: string;
}


export interface CartItem {
  product: Product;
  quantity: number;
  size: string;
  color: string;
}

export interface FilterState {
  categories: string[];
  priceRange: [number, number];
  sizes: string[];
  brands: string[];
  sortBy: 'relevance' | 'price-asc' | 'price-desc' | 'newest';
}
