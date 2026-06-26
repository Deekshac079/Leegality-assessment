import { useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProductDetail } from '../hooks/useProductDetail';
import { useCart } from '../context/CartContext';
import StarRating from '../components/common/StarRating';
import Pagination from '../components/common/Pagination';
import ErrorState from '../components/common/ErrorState';

function DetailSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-6 animate-pulse">
      <div className="h-9 w-24 bg-gray-200 rounded-lg mb-5" />
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col md:flex-row">
        <div className="md:w-[45%] shrink-0 bg-gray-100 h-96" />
        <div className="flex-1 p-8 space-y-4">
          <div className="h-8 bg-gray-200 rounded w-3/4" />
          <div className="flex gap-4">
            <div className="h-8 bg-gray-200 rounded w-24" />
            <div className="h-6 bg-gray-200 rounded w-36 self-center" />
          </div>
          <div className="h-4 bg-gray-200 rounded w-40" />
          <div className="h-4 bg-gray-200 rounded w-36" />
          <div className="h-5 bg-gray-200 rounded w-28 mt-4" />
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded" />
            <div className="h-4 bg-gray-200 rounded w-5/6" />
            <div className="h-4 bg-gray-200 rounded w-4/6" />
          </div>
        </div>
      </div>
    </div>
  );
}

function QuantitySelector({
  value,
  max,
  onChange,
}: {
  value: number;
  max: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden w-fit">
      <button
        onClick={() => onChange(Math.max(1, value - 1))}
        disabled={value <= 1}
        className="w-9 h-9 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors text-lg disabled:opacity-40 disabled:cursor-not-allowed"
        aria-label="Decrease quantity"
      >
        −
      </button>
      <span
        className="w-10 text-center text-sm font-bold text-gray-900 select-none border-x border-gray-300"
        aria-live="polite"
        aria-label={`Quantity: ${value}`}
      >
        {value}
      </span>
      <button
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
        className="w-9 h-9 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors text-lg disabled:opacity-40 disabled:cursor-not-allowed"
        aria-label="Increase quantity"
      >
        +
      </button>
    </div>
  );
}

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeImage, setActiveImage] = useState(0);
  const [qty, setQty] = useState(1);
  const [addedFeedback, setAddedFeedback] = useState(false);
  const productId = id ? parseInt(id, 10) : null;

  const { product, loading, error } = useProductDetail(productId);
  const { addItem, getQuantity } = useCart();

  const handleAddToCart = useCallback(() => {
    if (!product) return;
    addItem(product, qty);
    setAddedFeedback(true);
    setTimeout(() => setAddedFeedback(false), 2000);
  }, [product, qty, addItem]);

  if (loading) return <DetailSkeleton />;

  if (error || !product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-6">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 px-4 py-2 mb-5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:text-blue-600 transition-colors shadow-sm"
        >
          ← Back
        </button>
        <ErrorState message={error ?? 'Product not found.'} onRetry={() => navigate(-1)} />
      </div>
    );
  }

  const images = product.images?.length ? product.images : [product.thumbnail];
  const totalImages = images.length;
  const inCartQty = getQuantity(product.id);
  const isOutOfStock = product.stock === 0;

  const effectivePrice =
    product.discountPercentage > 0
      ? product.price * (1 - product.discountPercentage / 100)
      : null;

  const displayPrice = effectivePrice ?? product.price;

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">

      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-2 px-4 py-2 mb-5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:text-blue-600 transition-colors shadow-sm"
        aria-label="Back to product listing"
      >
        ← Back
      </button>

      <article className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-start">

          {/* ── LEFT: image + image pagination + add to cart ── */}
          <div className="md:w-[45%] shrink-0 flex flex-col border-b md:border-b-0 md:border-r border-gray-200 bg-gray-50">

            {/* Main product image */}
            <div className="flex items-center justify-center px-8 pt-8 pb-4 min-h-80 bg-gray-50">
              <img
                src={images[activeImage]}
                alt={`${product.title} — image ${activeImage + 1} of ${totalImages}`}
                className="max-h-80 max-w-full object-contain"
              />
            </div>

            {/* Image pagination — same style as listing page */}
            {totalImages > 1 && (
              <div className="border-t border-gray-200 bg-white">
                <Pagination
                  currentPage={activeImage + 1}
                  totalPages={totalImages}
                  onPageChange={(page) => setActiveImage(page - 1)}
                />
              </div>
            )}

            {/* Add to Cart — directly below image/pagination */}
            <div className="border-t border-gray-200 p-5 bg-white">
              {inCartQty > 0 && (
                <p className="text-sm text-blue-700 font-medium mb-3 flex items-center gap-1.5">
                  <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {inCartQty} already in cart
                </p>
              )}

              {!isOutOfStock ? (
                <>
                  <div className="flex items-center gap-3 mb-2">
                    <QuantitySelector value={qty} max={product.stock} onChange={setQty} />
                    <button
                      onClick={handleAddToCart}
                      disabled={addedFeedback}
                      className={`flex-1 h-10 px-4 rounded-lg font-semibold text-sm transition-all duration-200 flex items-center justify-center gap-2 ${
                        addedFeedback
                          ? 'bg-green-600 text-white cursor-default'
                          : 'bg-blue-600 hover:bg-blue-700 active:scale-[0.97] text-white shadow-sm hover:shadow-md'
                      }`}
                      aria-label={addedFeedback ? 'Added to cart' : `Add ${qty} to cart`}
                    >
                      {addedFeedback ? (
                        <>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                          </svg>
                          Added to Cart!
                        </>
                      ) : (
                        <>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.4 5.6A1 1 0 006.6 20H18M9 21a1 1 0 100-2 1 1 0 000 2zm9 0a1 1 0 100-2 1 1 0 000 2z" />
                          </svg>
                          Add to Cart
                        </>
                      )}
                    </button>
                  </div>
                  <p className="text-xs text-gray-400">
                    Total:{' '}
                    <span className="font-semibold text-gray-700">
                      ${(displayPrice * qty).toFixed(2)}
                    </span>
                    {qty > 1 && ` (${qty} × $${displayPrice.toFixed(2)})`}
                  </p>
                </>
              ) : (
                <button
                  disabled
                  className="w-full h-10 rounded-lg font-semibold text-sm bg-gray-200 text-gray-500 cursor-not-allowed"
                >
                  Out of Stock
                </button>
              )}
            </div>
          </div>

          {/* ── RIGHT: info → description → reviews (scrollable, hidden scrollbar) ── */}
          <div className="flex-1 md:overflow-y-auto md:max-h-[600px] scrollbar-hide p-6 md:p-8">

            {/* Product name */}
            <h1 className="text-2xl font-bold text-gray-900 leading-tight mb-3">
              {product.title}
            </h1>

            {/* Price + Rating on the same line — matches PDF */}
            <div className="flex items-center gap-3 flex-wrap mb-4">
              <span className="text-3xl font-bold text-gray-900">
                ${displayPrice.toFixed(2)}
              </span>
              {effectivePrice && (
                <>
                  <span className="text-base text-gray-400 line-through">
                    ${product.price.toFixed(2)}
                  </span>
                  <span className="text-xs font-semibold text-red-500 bg-red-50 px-2 py-0.5 rounded-full">
                    -{Math.round(product.discountPercentage)}%
                  </span>
                </>
              )}
              <StarRating rating={product.rating} size="md" />
            </div>

            {/* Brand / Category — plain inline text matching PDF style */}
            <div className="text-sm text-gray-700 space-y-1 mb-5">
              {product.brand && (
                <p>
                  <span className="font-semibold">Brand:</span>{' '}
                  <span className="text-gray-600">{product.brand}</span>
                </p>
              )}
              <p>
                <span className="font-semibold">Category:</span>{' '}
                <span className="text-gray-600 capitalize">{product.category}</span>
              </p>
              <p>
                <span className="font-semibold">Stock:</span>{' '}
                <span className={isOutOfStock ? 'text-red-500' : 'text-green-600'}>
                  {isOutOfStock ? 'Out of stock' : `${product.stock} available`}
                </span>
              </p>
            </div>

            {/* Description */}
            <section aria-labelledby="desc-heading" className="mb-5">
              <h2 id="desc-heading" className="text-base font-bold text-gray-800 mb-2">
                Description
              </h2>
              <p className="text-sm text-gray-600 leading-relaxed">{product.description}</p>
            </section>

            {/* Tags */}
            {product.tags?.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-5">
                {product.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2.5 py-0.5 text-xs bg-blue-50 text-blue-700 rounded-full border border-blue-200"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Reviews — directly after description, matching PDF */}
            {product.reviews?.length > 0 && (
              <section aria-labelledby="reviews-heading" className="border-t border-gray-100 pt-5">
                <h2 id="reviews-heading" className="text-base font-bold text-gray-800 mb-4">
                  Reviews
                </h2>
                <ul className="space-y-3" role="list">
                  {product.reviews.map((review, idx) => (
                    <li key={idx} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                      {/* Reviewer name + rating on same line — matches PDF */}
                      <div className="flex items-center gap-3 mb-1 flex-wrap">
                        <span className="font-semibold text-sm text-gray-800">{review.reviewerName}</span>
                        <StarRating rating={review.rating} size="sm" />
                        <time dateTime={review.date} className="text-xs text-gray-400 ml-auto shrink-0">
                          {new Date(review.date).toLocaleDateString(undefined, {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          })}
                        </time>
                      </div>
                      <p className="text-sm text-gray-600 leading-relaxed">{review.comment}</p>
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </div>
        </div>
      </article>
    </div>
  );
}
