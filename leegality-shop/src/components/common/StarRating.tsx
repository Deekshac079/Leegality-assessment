interface StarRatingProps {
  rating: number;
  showValue?: boolean;
  size?: 'sm' | 'md';
}

export default function StarRating({ rating, showValue = true, size = 'sm' }: StarRatingProps) {
  const starSize = size === 'sm' ? 'text-sm' : 'text-base';

  return (
    <span className="inline-flex items-center gap-1" aria-label={`Rating: ${rating} out of 5`}>
      <span className={`${starSize} leading-none`} aria-hidden="true">
        {[1, 2, 3, 4, 5].map((star) => {
          const filled = rating >= star;
          const half = !filled && rating >= star - 0.5;
          return (
            <span
              key={star}
              className={
                filled
                  ? 'text-amber-400'
                  : half
                  ? 'text-amber-300'
                  : 'text-gray-300'
              }
            >
              {half ? '★' : filled ? '★' : '☆'}
            </span>
          );
        })}
      </span>
      {showValue && (
        <span className="text-xs text-gray-500 font-medium">({rating.toFixed(1)})</span>
      )}
    </span>
  );
}
