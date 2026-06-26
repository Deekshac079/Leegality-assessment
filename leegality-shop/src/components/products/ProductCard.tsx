import { Link } from 'react-router-dom';
import type { Product } from '../../types';
import StarRating from '../common/StarRating';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const discountedPrice =
    product.discountPercentage > 0
      ? product.price * (1 - product.discountPercentage / 100)
      : null;

  return (
    <Link
      to={`/product/${product.id}`}
      className="group bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg hover:border-blue-300 transition-all duration-200 flex flex-col focus-visible:outline-2 focus-visible:outline-blue-500"
      aria-label={`${product.title}, $${product.price}`}
    >
      <div className="relative overflow-hidden bg-gray-50 h-52 flex items-center justify-center">
        <img
          src={product.thumbnail}
          alt={product.title}
          loading="lazy"
          className="object-contain h-full w-full p-3 group-hover:scale-105 transition-transform duration-300"
        />
        {product.discountPercentage > 0 && (
          <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
            -{Math.round(product.discountPercentage)}%
          </span>
        )}
      </div>

      <div className="p-4 flex flex-col gap-1 flex-1">
        <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 leading-snug group-hover:text-blue-700 transition-colors">
          {product.title}
        </h3>

        {product.brand && (
          <p className="text-xs text-gray-400">{product.brand}</p>
        )}

        <div className="mt-auto pt-2 flex items-center justify-between flex-wrap gap-1">
          <div className="flex items-baseline gap-1.5">
            <span className="text-base font-bold text-gray-900">
              ${discountedPrice ? discountedPrice.toFixed(2) : product.price.toFixed(2)}
            </span>
            {discountedPrice && (
              <span className="text-xs text-gray-400 line-through">${product.price.toFixed(2)}</span>
            )}
          </div>
          <StarRating rating={product.rating} />
        </div>
      </div>
    </Link>
  );
}
