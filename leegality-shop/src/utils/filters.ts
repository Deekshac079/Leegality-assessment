import type { Product, FilterState } from '../types';

export function applyClientFilters(products: Product[], filters: FilterState): Product[] {
  let result = products;

  if (filters.priceRange.min !== '') {
    const min = parseFloat(filters.priceRange.min);
    if (!isNaN(min)) {
      result = result.filter((p) => p.price >= min);
    }
  }

  if (filters.priceRange.max !== '') {
    const max = parseFloat(filters.priceRange.max);
    if (!isNaN(max)) {
      result = result.filter((p) => p.price <= max);
    }
  }

  if (filters.brands.length > 0) {
    result = result.filter((p) => p.brand && filters.brands.includes(p.brand));
  }

  return result;
}

export function extractUniqueBrands(products: Product[]): string[] {
  const brands = new Set<string>();
  for (const p of products) {
    if (p.brand && p.brand.trim()) brands.add(p.brand.trim());
  }
  return Array.from(brands).sort();
}

export function paginate<T>(items: T[], page: number, perPage: number): T[] {
  const start = (page - 1) * perPage;
  return items.slice(start, start + perPage);
}

export function totalPages(totalItems: number, perPage: number): number {
  return Math.ceil(totalItems / perPage);
}
