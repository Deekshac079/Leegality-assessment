import { useState, useEffect } from 'react';
import { fetchProductById } from '../api/products';
import type { Product } from '../types';

export function useProductDetail(id: number | null) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id === null || isNaN(id)) return;
    let cancelled = false;

    setLoading(true);
    setError(null);

    fetchProductById(id)
      .then((data) => {
        if (!cancelled) setProduct(data);
      })
      .catch((err: unknown) => {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Failed to load product');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, [id]);

  return { product, loading, error };
}
