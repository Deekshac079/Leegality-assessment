import type { Product, ProductsResponse, Category } from '../types';

const BASE_URL = 'https://dummyjson.com';

async function request<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`API error ${res.status}: ${res.statusText}`);
  }
  return res.json() as Promise<T>;
}

export async function fetchProducts(limit = 200, skip = 0): Promise<ProductsResponse> {
  return request<ProductsResponse>(`${BASE_URL}/products?limit=${limit}&skip=${skip}`);
}

export async function fetchProductsByCategory(category: string): Promise<ProductsResponse> {
  return request<ProductsResponse>(`${BASE_URL}/products/category/${encodeURIComponent(category)}?limit=200`);
}

export async function fetchProductById(id: number): Promise<Product> {
  return request<Product>(`${BASE_URL}/products/${id}`);
}

export async function fetchCategories(): Promise<Category[]> {
  return request<Category[]>(`${BASE_URL}/products/categories`);
}

export async function searchProducts(query: string): Promise<ProductsResponse> {
  return request<ProductsResponse>(`${BASE_URL}/products/search?q=${encodeURIComponent(query)}&limit=200`);
}
