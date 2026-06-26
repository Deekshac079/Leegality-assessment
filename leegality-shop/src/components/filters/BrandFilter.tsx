import { useState } from 'react';
import { useFilters } from '../../context/FilterContext';

interface BrandFilterProps {
  brands: string[];
}

export default function BrandFilter({ brands }: BrandFilterProps) {
  const { filters, toggleBrand } = useFilters();
  const [showAll, setShowAll] = useState(false);

  if (brands.length === 0) return null;

  const visible = showAll ? brands : brands.slice(0, 6);

  return (
    <section aria-labelledby="brand-heading">
      <h3 id="brand-heading" className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">
        Brands
      </h3>
      <ul className="space-y-1.5" role="list">
        {visible.map((brand) => (
          <li key={brand}>
            <label className="flex items-center gap-2 cursor-pointer group">
              <input
                type="checkbox"
                value={brand}
                checked={filters.brands.includes(brand)}
                onChange={() => toggleBrand(brand)}
                className="accent-blue-600 rounded"
              />
              <span className="text-sm text-gray-700 group-hover:text-blue-600 transition-colors">
                {brand}
              </span>
            </label>
          </li>
        ))}
      </ul>

      {brands.length > 6 && (
        <button
          onClick={() => setShowAll((prev) => !prev)}
          className="mt-2 text-xs text-blue-600 hover:underline"
        >
          {showAll ? 'Show less' : `Show ${brands.length - 6} more`}
        </button>
      )}
    </section>
  );
}
