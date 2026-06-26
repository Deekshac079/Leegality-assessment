import { Routes, Route, Navigate } from 'react-router-dom';
import { FilterProvider } from './context/FilterContext';
import { CartProvider } from './context/CartContext';
import Navbar from './components/common/Navbar';
import ProductListingPage from './pages/ProductListingPage';
import ProductDetailPage from './pages/ProductDetailPage';

function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-center px-4">
      <span className="text-6xl" aria-hidden="true">🛒</span>
      <h1 className="text-2xl font-bold text-gray-800">Page not found</h1>
      <p className="text-gray-500 text-sm">The page you're looking for doesn't exist.</p>
      <a
        href="/"
        className="mt-2 px-5 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors font-medium"
      >
        Back to shop
      </a>
    </div>
  );
}

export default function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <CartProvider>
      <FilterProvider>
        <Navbar />
        <Routes>
          <Route path="/" element={<ProductListingPage />} />
          <Route path="/product/:id" element={<ProductDetailPage />} />
          <Route path="/404" element={<NotFound />} />
          <Route path="*" element={<Navigate to="/404" replace />} />
        </Routes>
      </FilterProvider>
      </CartProvider>
    </div>
  );
}
