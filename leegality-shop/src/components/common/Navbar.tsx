import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useFilters } from '../../context/FilterContext';
import { useCart } from '../../context/CartContext';
import CartDrawer from '../cart/CartDrawer';

export default function Navbar() {
  const { filters, setSearch, toggleSidebar } = useFilters();
  const { totalItems } = useCart();
  const [localSearch, setLocalSearch] = useState(filters.search);
  const [cartOpen, setCartOpen] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    setLocalSearch(filters.search);
  }, [filters.search]);

  const handleChange = (val: string) => {
    setLocalSearch(val);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      navigate('/', { replace: false });
      setSearch(val);
    }, 400);
  };

  return (
    <>
      <header className="bg-gray-800 text-white sticky top-0 z-50 shadow-md">
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center gap-4">
          <button onClick={toggleSidebar} className="text-white p-1 rounded hover:bg-gray-700 transition-colors" aria-label="Menu">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          <Link to="/" className="text-white font-bold text-lg tracking-tight shrink-0 hover:text-blue-300 transition-colors">
            ShopLite
          </Link>

          <div className="flex-1 max-w-2xl mx-auto relative">
            <label htmlFor="global-search" className="sr-only">Search products</label>
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" aria-hidden="true">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </span>
            <input
              id="global-search"
              type="search"
              value={localSearch}
              onChange={(e) => handleChange(e.target.value)}
              placeholder="Search products..."
              className="w-full pl-9 pr-4 py-1.5 text-sm rounded bg-white text-gray-900 placeholder-gray-400 border-0 outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div className="flex items-center gap-3 ml-auto shrink-0">
            {/* Cart icon with live badge */}
            <button
              onClick={() => setCartOpen(true)}
              className="relative p-1.5 rounded hover:bg-gray-700 transition-colors"
              aria-label={`Shopping cart, ${totalItems} item${totalItems !== 1 ? 's' : ''}`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.4 5.6A1 1 0 006.6 20H18M9 21a1 1 0 100-2 1 1 0 000 2zm9 0a1 1 0 100-2 1 1 0 000 2z" />
              </svg>
              {totalItems > 0 && (
                <span
                  className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center leading-none"
                  aria-hidden="true"
                >
                  {totalItems > 99 ? '99+' : totalItems}
                </span>
              )}
            </button>

            <button className="p-1.5 rounded hover:bg-gray-700 transition-colors" aria-label="Profile">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </button>

            <button className="p-1.5 rounded hover:bg-gray-700 transition-colors" aria-label="User account">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}
