import React, { createContext, useContext, useCallback, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import type { FilterState, PriceRange } from '../types';

interface FilterContextValue {
  filters: FilterState;
  sidebarOpen: boolean;
  toggleSidebar: () => void;
  toggleCategory: (category: string) => void;
  clearCategories: () => void;
  setPriceRange: (range: PriceRange) => void;
  toggleBrand: (brand: string) => void;
  setPage: (page: number) => void;
  setSearch: (search: string) => void;
  clearAllFilters: () => void;
}

const FilterContext = createContext<FilterContextValue | null>(null);

export function FilterProvider({ children }: { children: React.ReactNode }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const toggleSidebar = useCallback(() => setSidebarOpen((prev) => !prev), []);

  const filters: FilterState = {
    categories: searchParams.get('categories') ? searchParams.get('categories')!.split(',') : [],
    priceRange: {
      min: searchParams.get('minPrice') ?? '',
      max: searchParams.get('maxPrice') ?? '',
    },
    brands: searchParams.get('brands') ? searchParams.get('brands')!.split(',') : [],
    page: Number(searchParams.get('page') ?? '1'),
    search: searchParams.get('search') ?? '',
  };

  const updateParams = useCallback(
    (updates: Record<string, string | null>) => {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          for (const [key, value] of Object.entries(updates)) {
            if (value === null || value === '') {
              next.delete(key);
            } else {
              next.set(key, value);
            }
          }
          return next;
        },
        { replace: true }
      );
    },
    [setSearchParams]
  );

  const toggleCategory = useCallback(
    (category: string) => {
      const current = filters.categories;
      const next = current.includes(category)
        ? current.filter((c) => c !== category)
        : [...current, category];
      updateParams({ categories: next.length ? next.join(',') : null, page: null });
    },
    [filters.categories, updateParams]
  );

  const clearCategories = useCallback(() => {
    updateParams({ categories: null, page: null });
  }, [updateParams]);

  const setPriceRange = useCallback(
    (range: PriceRange) => {
      updateParams({
        minPrice: range.min || null,
        maxPrice: range.max || null,
        page: null,
      });
    },
    [updateParams]
  );

  const toggleBrand = useCallback(
    (brand: string) => {
      const current = filters.brands;
      const next = current.includes(brand)
        ? current.filter((b) => b !== brand)
        : [...current, brand];
      updateParams({ brands: next.length ? next.join(',') : null, page: null });
    },
    [filters.brands, updateParams]
  );

  const setPage = useCallback(
    (page: number) => {
      updateParams({ page: page > 1 ? String(page) : null });
    },
    [updateParams]
  );

  const setSearch = useCallback(
    (search: string) => {
      updateParams({ search: search || null, page: null });
    },
    [updateParams]
  );

  const clearAllFilters = useCallback(() => {
    setSearchParams({}, { replace: true });
  }, [setSearchParams]);

  return (
    <FilterContext.Provider
      value={{
        filters,
        sidebarOpen,
        toggleSidebar,
        toggleCategory,
        clearCategories,
        setPriceRange,
        toggleBrand,
        setPage,
        setSearch,
        clearAllFilters,
      }}
    >
      {children}
    </FilterContext.Provider>
  );
}

export function useFilters(): FilterContextValue {
  const ctx = useContext(FilterContext);
  if (!ctx) throw new Error('useFilters must be used inside FilterProvider');
  return ctx;
}
