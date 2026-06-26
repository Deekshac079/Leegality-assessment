import type { Category } from '../../types';
import { useFilters } from '../../context/FilterContext';
import CategoryFilter from './CategoryFilter';
import PriceRangeFilter from './PriceRangeFilter';
import BrandFilter from './BrandFilter';

interface FilterPanelProps {
  categories: Category[];
  categoriesLoading: boolean;
  brands: string[];
  isOpen: boolean;
  onClose: () => void;
}

export default function FilterPanel({
  categories,
  categoriesLoading,
  brands,
  isOpen,
  onClose,
}: FilterPanelProps) {
  const { filters, clearAllFilters } = useFilters();

  const activeCount =
    (filters.category ? 1 : 0) +
    (filters.priceRange.min || filters.priceRange.max ? 1 : 0) +
    filters.brands.length;

  const panelContent = (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-bold text-gray-800 flex items-center gap-2">
          <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z" />
          </svg>
          Filters
          {activeCount > 0 && (
            <span className="ml-1 bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold">
              {activeCount}
            </span>
          )}
        </h2>
        {activeCount > 0 && (
          <button
            onClick={clearAllFilters}
            className="text-xs text-blue-600 hover:underline font-medium"
          >
            Clear all
          </button>
        )}
      </div>

      <div className="border-t border-gray-200 pt-5">
        <CategoryFilter categories={categories} loading={categoriesLoading} />
      </div>

      <div className="border-t border-gray-200 pt-5">
        <PriceRangeFilter />
      </div>

      <div className="border-t border-gray-200 pt-5">
        <BrandFilter brands={brands} />
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar — toggled by hamburger */}
      <aside className={`${isOpen ? 'hidden lg:block' : 'hidden'} w-60 shrink-0`} aria-label="Product filters">
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          {panelContent}
        </div>
      </aside>

      {/* Mobile drawer */}
      {isOpen && (
        <div className="lg:hidden fixed inset-0 z-40 flex">
          <div
            className="fixed inset-0 bg-black/50 transition-opacity"
            onClick={onClose}
            aria-hidden="true"
          />
          <aside
            className="relative w-72 max-w-full bg-white h-full overflow-y-auto p-5 shadow-xl z-50"
            aria-label="Product filters"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="font-semibold text-gray-800">Filters</span>
              <button
                onClick={onClose}
                className="p-1 rounded hover:bg-gray-100 transition-colors"
                aria-label="Close filters"
              >
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            {panelContent}
          </aside>
        </div>
      )}
    </>
  );
}
