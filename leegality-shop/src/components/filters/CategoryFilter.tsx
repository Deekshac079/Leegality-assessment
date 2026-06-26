import type { Category } from '../../types';
import { useFilters } from '../../context/FilterContext';

interface CategoryFilterProps {
  categories: Category[];
  loading: boolean;
}

export default function CategoryFilter({ categories, loading }: CategoryFilterProps) {
  const { filters, setCategory } = useFilters();

  return (
    <section aria-labelledby="category-heading">
      <h3 id="category-heading" className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">
        Categories
      </h3>

      {loading ? (
        <div className="space-y-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-4 bg-gray-200 rounded animate-pulse w-3/4" />
          ))}
        </div>
      ) : (
        <ul className="space-y-1.5" role="list">
          <li>
            <label className="flex items-center gap-2 cursor-pointer group">
              <input
                type="radio"
                name="category"
                value=""
                checked={filters.category === ''}
                onChange={() => setCategory('')}
                className="accent-blue-600"
              />
              <span className="text-sm text-gray-700 group-hover:text-blue-600 transition-colors capitalize">
                All Categories
              </span>
            </label>
          </li>
          {categories.map((cat) => (
            <li key={cat.slug}>
              <label className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="radio"
                  name="category"
                  value={cat.slug}
                  checked={filters.category === cat.slug}
                  onChange={() => setCategory(cat.slug)}
                  className="accent-blue-600"
                />
                <span className="text-sm text-gray-700 group-hover:text-blue-600 transition-colors capitalize">
                  {cat.name}
                </span>
              </label>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
