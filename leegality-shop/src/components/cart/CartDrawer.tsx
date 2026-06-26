import { useEffect, useRef } from 'react';
import { useCart } from '../../context/CartContext';
import type { CartItem } from '../../types';

interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
}

function CartItemRow({ item, onRemove, onQtyChange }: {
  item: CartItem;
  onRemove: () => void;
  onQtyChange: (q: number) => void;
}) {
  const effectivePrice =
    item.product.discountPercentage > 0
      ? item.product.price * (1 - item.product.discountPercentage / 100)
      : item.product.price;

  return (
    <li className="flex gap-3 py-4 border-b border-gray-100 last:border-0">
      <img
        src={item.product.thumbnail}
        alt={item.product.title}
        className="w-16 h-16 rounded-lg object-contain bg-gray-50 border border-gray-200 shrink-0"
      />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900 line-clamp-2 leading-snug mb-1">
          {item.product.title}
        </p>
        <p className="text-sm font-bold text-gray-900">
          ${(effectivePrice * item.quantity).toFixed(2)}
          {item.quantity > 1 && (
            <span className="text-xs text-gray-400 font-normal ml-1">
              (${effectivePrice.toFixed(2)} each)
            </span>
          )}
        </p>

        <div className="flex items-center gap-2 mt-2">
          <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
            <button
              onClick={() => onQtyChange(item.quantity - 1)}
              className="w-7 h-7 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors text-base font-medium"
              aria-label="Decrease quantity"
            >
              −
            </button>
            <span className="w-8 text-center text-sm font-semibold text-gray-800 select-none">
              {item.quantity}
            </span>
            <button
              onClick={() => onQtyChange(item.quantity + 1)}
              disabled={item.quantity >= item.product.stock}
              className="w-7 h-7 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors text-base font-medium disabled:opacity-40 disabled:cursor-not-allowed"
              aria-label="Increase quantity"
            >
              +
            </button>
          </div>

          <button
            onClick={onRemove}
            className="text-xs text-red-500 hover:text-red-700 transition-colors ml-1 hover:underline"
            aria-label={`Remove ${item.product.title}`}
          >
            Remove
          </button>
        </div>
      </div>
    </li>
  );
}

export default function CartDrawer({ open, onClose }: CartDrawerProps) {
  const { items, totalItems, totalPrice, removeItem, updateQuantity, clearCart } = useCart();
  const drawerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/50 z-50 transition-opacity duration-300 ${
          open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
        aria-label="Shopping cart"
        className={`fixed top-0 right-0 h-full w-full sm:w-96 bg-white shadow-2xl z-50 flex flex-col transition-transform duration-300 ease-in-out ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
          <h2 className="text-lg font-bold text-gray-900">
            Cart
            {totalItems > 0 && (
              <span className="ml-2 text-sm font-normal text-gray-500">({totalItems} item{totalItems !== 1 ? 's' : ''})</span>
            )}
          </h2>
          <div className="flex items-center gap-3">
            {items.length > 0 && (
              <button
                onClick={clearCart}
                className="text-xs text-red-500 hover:text-red-700 hover:underline transition-colors"
              >
                Clear all
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="Close cart"
            >
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-5">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-3 text-center pb-20">
              <span className="text-5xl" aria-hidden="true">🛒</span>
              <p className="text-gray-600 font-medium">Your cart is empty</p>
              <p className="text-gray-400 text-sm">Add some products to get started</p>
              <button
                onClick={onClose}
                className="mt-2 px-5 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Continue shopping
              </button>
            </div>
          ) : (
            <ul className="divide-y divide-gray-100" role="list">
              {items.map((item) => (
                <CartItemRow
                  key={item.product.id}
                  item={item}
                  onRemove={() => removeItem(item.product.id)}
                  onQtyChange={(q) => updateQuantity(item.product.id, q)}
                />
              ))}
            </ul>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-gray-200 px-5 py-4 space-y-3 bg-gray-50">
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>Subtotal ({totalItems} item{totalItems !== 1 ? 's' : ''})</span>
              <span className="font-semibold text-gray-900">${totalPrice.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between text-xs text-gray-400">
              <span>Shipping</span>
              <span className="text-green-600 font-medium">FREE</span>
            </div>
            <div className="flex items-center justify-between text-base font-bold text-gray-900 pt-1 border-t border-gray-200">
              <span>Total</span>
              <span>${totalPrice.toFixed(2)}</span>
            </div>
            <button className="w-full py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 active:scale-[0.98] transition-all text-sm">
              Proceed to Checkout
            </button>
            <button
              onClick={onClose}
              className="w-full py-2.5 border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-100 transition-colors text-sm"
            >
              Continue Shopping
            </button>
          </div>
        )}
      </div>
    </>
  );
}
