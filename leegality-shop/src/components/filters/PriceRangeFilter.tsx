import { useState, useEffect } from 'react';
import { useFilters } from '../../context/FilterContext';

export default function PriceRangeFilter() {
  const { filters, setPriceRange } = useFilters();
  const [localMin, setLocalMin] = useState(filters.priceRange.min);
  const [localMax, setLocalMax] = useState(filters.priceRange.max);
  const [error, setError] = useState('');

  useEffect(() => {
    setLocalMin(filters.priceRange.min);
    setLocalMax(filters.priceRange.max);
  }, [filters.priceRange.min, filters.priceRange.max]);

  const handleApply = () => {
    const min = parseFloat(localMin);
    const max = parseFloat(localMax);

    if (localMin && localMax && !isNaN(min) && !isNaN(max) && min > max) {
      setError('Min price cannot exceed max price.');
      return;
    }
    setError('');
    setPriceRange({ min: localMin, max: localMax });
  };

  const handleClear = () => {
    setLocalMin('');
    setLocalMax('');
    setError('');
    setPriceRange({ min: '', max: '' });
  };

  return (
    <section aria-labelledby="price-heading">
      <h3 id="price-heading" className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">
        Price Range
      </h3>
      <div className="flex gap-2">
        <div className="flex-1">
          <label htmlFor="price-min" className="sr-only">Minimum price</label>
          <input
            id="price-min"
            type="number"
            min="0"
            placeholder="Min"
            value={localMin}
            onChange={(e) => { setLocalMin(e.target.value); setError(''); }}
            className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
        <div className="flex-1">
          <label htmlFor="price-max" className="sr-only">Maximum price</label>
          <input
            id="price-max"
            type="number"
            min="0"
            placeholder="Max"
            value={localMax}
            onChange={(e) => { setLocalMax(e.target.value); setError(''); }}
            className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
      </div>

      {error && (
        <p className="text-red-500 text-xs mt-1" role="alert">{error}</p>
      )}

      <div className="flex gap-2 mt-2">
        <button
          onClick={handleApply}
          className="flex-1 py-1.5 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors font-medium"
        >
          Apply
        </button>
        {(filters.priceRange.min || filters.priceRange.max) && (
          <button
            onClick={handleClear}
            className="px-3 py-1.5 text-sm border border-gray-300 rounded hover:bg-gray-50 transition-colors text-gray-600"
          >
            Clear
          </button>
        )}
      </div>
    </section>
  );
}
