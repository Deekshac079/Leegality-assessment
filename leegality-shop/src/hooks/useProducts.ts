import { useState, useEffect, useMemo } from 'react';
import { fetchProducts, searchProducts } from '../api/products';
import { applyClientFilters, extractUniqueBrands } from '../utils/filters';
import type { Product, FilterState } from '../types';

const PAGE_SIZE = 12;

interface UseProductsResult {
  products: Product[];
  allBrands: string[];
  totalItems: number;
  loading: boolean;
  error: string | null;
  retry: () => void;
}

export function useProducts(filters: FilterState): UseProductsResult {
  const [rawProducts, setRawProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    const load = async () => {
      try {
        const data = filters.search.trim()
          ? await searchProducts(filters.search.trim())
          : await fetchProducts(200, 0);

        if (!cancelled) setRawProducts(data.products);
      } catch (err: unknown) {
        if (!cancelled)
          setError(err instanceof Error ? err.message : 'Failed to load products');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => { cancelled = true; };
  }, [filters.search, retryCount]);

  // Client-side category filter — supports multi-select
  const categoryFiltered = useMemo(() => {
    if (filters.categories.length === 0) return rawProducts;
    return rawProducts.filter((p) => filters.categories.includes(p.category));
  }, [rawProducts, filters.categories]);

  // Brands shown = only those present in the category-filtered set
  const allBrands = useMemo(() => extractUniqueBrands(categoryFiltered), [categoryFiltered]);

  // Apply price + brand filters on top of category-filtered list
  const filteredProducts = useMemo(
    () => applyClientFilters(categoryFiltered, filters),
    [categoryFiltered, filters]
  );

  const pagedProducts = useMemo(() => {
    const start = (filters.page - 1) * PAGE_SIZE;
    return filteredProducts.slice(start, start + PAGE_SIZE);
  }, [filteredProducts, filters.page]);

  return {
    products: pagedProducts,
    allBrands,
    totalItems: filteredProducts.length,
    loading,
    error,
    retry: () => setRetryCount((c) => c + 1),
  };
}

export { PAGE_SIZE };
