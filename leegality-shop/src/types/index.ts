export interface Review {
  rating: number;
  comment: string;
  date: string;
  reviewerName: string;
  reviewerEmail: string;
}

export interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  brand?: string;
  category: string;
  thumbnail: string;
  images: string[];
  reviews: Review[];
  tags: string[];
}

export interface ProductsResponse {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
}

export interface Category {
  slug: string;
  name: string;
  url: string;
}

export interface PriceRange {
  min: string;
  max: string;
}

export interface FilterState {
  categories: string[];
  priceRange: PriceRange;
  brands: string[];
  page: number;
  search: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}
