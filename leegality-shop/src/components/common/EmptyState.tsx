interface EmptyStateProps {
  onClear: () => void;
}

export default function EmptyState({ onClear }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center gap-4">
      <span className="text-5xl" aria-hidden="true">🔍</span>
      <h3 className="text-lg font-semibold text-gray-800">No products found</h3>
      <p className="text-gray-500 text-sm max-w-xs">
        No products match your current filters. Try adjusting your search or clearing filters.
      </p>
      <button
        onClick={onClear}
        className="px-5 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors font-medium"
      >
        Clear all filters
      </button>
    </div>
  );
}
