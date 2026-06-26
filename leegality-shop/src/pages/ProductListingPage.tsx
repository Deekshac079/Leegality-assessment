import { useRef, useEffect, useState } from 'react';
import { useFilters } from '../context/FilterContext';
import { useProducts, PAGE_SIZE } from '../hooks/useProducts';
import { useCategories } from '../hooks/useCategories';
import { totalPages } from '../utils/filters';
import FilterPanel from '../components/filters/FilterPanel';
import ProductGrid from '../components/products/ProductGrid';
import Pagination from '../components/common/Pagination';
import { ProductGridSkeleton } from '../components/common/ProductCardSkeleton';
import ErrorState from '../components/common/ErrorState';
import EmptyState from '../components/common/EmptyState';

export default function ProductListingPage() {
  const { filters, setPage, clearAllFilters, sidebarOpen, toggleSidebar } = useFilters();

  // Sticky-bottom right panel: sticks exactly when its bottom hits the viewport bottom.
  // Formula: top = 100vh - element_height  (negative when element is taller than viewport)
  // position:relative on the flex container bounds the sticky range to the left panel's height,
  // so the right panel naturally un-sticks when the user reaches the absolute bottom.
  const mainRef = useRef<HTMLElement>(null);
  const [stickyTop, setStickyTop] = useState('0px');

  useEffect(() => {
    const el = mainRef.current;
    if (!el) return;
    const update = () => setStickyTop(`calc(100vh - ${el.offsetHeight}px)`);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const { categories, loading: catsLoading } = useCategories();
  const { products, allBrands, totalItems, loading, error, retry } = useProducts(filters);

  const pages = totalPages(totalItems, PAGE_SIZE);

  const hasActiveFilters =
    filters.category !== '' ||
    filters.priceRange.min !== '' ||
    filters.priceRange.max !== '' ||
    filters.brands.length > 0 ||
    filters.search !== '';

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Mobile filter trigger */}
      <div className="lg:hidden flex items-center justify-between mb-4">
        <p className="text-sm text-gray-500">
          {loading ? 'Loading…' : `${totalItems} product${totalItems !== 1 ? 's' : ''}`}
        </p>
        <button
          onClick={toggleSidebar}
          className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          aria-expanded={sidebarOpen}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z" />
          </svg>
          Filters
          {hasActiveFilters && <span className="w-2 h-2 rounded-full bg-blue-600 ml-1" />}
        </button>
      </div>

      {/* relative bounds the sticky right panel within the taller left column */}
      <div className="relative flex gap-6">
        <FilterPanel
          categories={categories}
          categoriesLoading={catsLoading}
          brands={allBrands}
          isOpen={sidebarOpen}
          onClose={toggleSidebar}
        />

        <main ref={mainRef} className="flex-1 min-w-0 self-start sticky" style={{ top: stickyTop }}>
          {/* Results bar */}
          <div className="hidden lg:flex items-center justify-between mb-4">
            <p className="text-sm text-gray-500">
              {loading
                ? 'Loading products…'
                : `Showing ${products.length} of ${totalItems} product${totalItems !== 1 ? 's' : ''}`}
            </p>
          </div>

          {error ? (
            <ErrorState message={error} onRetry={retry} />
          ) : loading ? (
            <ProductGridSkeleton count={8} />
          ) : products.length === 0 ? (
            <EmptyState onClear={clearAllFilters} />
          ) : (
            <>
              <ProductGrid products={products} />
              <Pagination
                currentPage={filters.page}
                totalPages={pages}
                onPageChange={(p) => {
                  setPage(p);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              />
            </>
          )}
        </main>
      </div>
    </div>
  );
}
