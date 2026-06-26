import type { Category } from '../../types';
import { useFilters } from '../../context/FilterContext';

interface CategoryFilterProps {
  categories: Category[];
  loading: boolean;
}

export default function CategoryFilter({ categories, loading }: CategoryFilterProps) {
  const { filters, toggleCategory, clearCategories } = useFilters();

  return (
    <section aria-labelledby="category-heading">
      <div className="flex items-center justify-between mb-3">
        <h3 id="category-heading" className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
          Categories
        </h3>
        {filters.categories.length > 0 && (
          <button
            onClick={clearCategories}
            className="text-xs text-blue-600 hover:underline font-medium"
          >
            Clear
          </button>
        )}
      </div>

      {loading ? (
        <div className="space-y-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-4 bg-gray-200 rounded animate-pulse w-3/4" />
          ))}
        </div>
      ) : (
        <ul className="space-y-1.5" role="list">
          {categories.map((cat) => {
            const checked = filters.categories.includes(cat.slug);
            return (
              <li key={cat.slug}>
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="checkbox"
                    value={cat.slug}
                    checked={checked}
                    onChange={() => toggleCategory(cat.slug)}
                    className="accent-blue-600 w-4 h-4 rounded"
                  />
                  <span
                    className={`text-sm capitalize transition-colors ${
                      checked
                        ? 'text-blue-600 font-medium'
                        : 'text-gray-700 group-hover:text-blue-600'
                    }`}
                  >
                    {cat.name}
                  </span>
                </label>
              </li>
            );
          })}
        </ul>
      )}

      {filters.categories.length > 0 && (
        <p className="mt-2 text-xs text-gray-400">
          {filters.categories.length} selected
        </p>
      )}
    </section>
  );
}
