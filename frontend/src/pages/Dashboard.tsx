import { useEffect, useState, useCallback, useRef } from 'react';
import { FilterSidebar } from '../components/FilterSidebar';
import { ProductGrid } from '../components/ProductGrid';
import { Navbar } from '../components/Navbar';
import { productsApi } from '../lib/api';
import type { Product, ProductQuery } from '../types';
import { useCart } from '../context/CartContext';
import { ShoppingCart, X, Plus, Minus, Trash2, CreditCard } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const DEFAULT_FILTERS: ProductQuery = {};

export function Dashboard() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<ProductQuery>(DEFAULT_FILTERS);
  const [search, setSearch] = useState('');
  const [cartOpen, setCartOpen] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { items, removeItem, updateQuantity, itemCount, total } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const fetchProducts = useCallback(async (q: ProductQuery) => {
    setLoading(true);
    setError(null);
    try {
      const data = await productsApi.getAll(q);
      setProducts(data);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      fetchProducts({ ...filters, search: search || undefined });
    }, 300);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [filters, search, fetchProducts]);

  function handleCheckout() {
    if (!user) {
      navigate('/login', { state: { from: '/checkout' } });
      return;
    }
    setCartOpen(false);
    navigate('/checkout');
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar onSearch={setSearch} searchValue={search} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            Shop <span className="text-indigo-600">NexStoreIL</span>
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            {loading ? 'Loading…' : `${products.length} product${products.length !== 1 ? 's' : ''} found`}
          </p>
        </div>

        <div className="flex gap-6">
          <FilterSidebar
            filters={filters}
            onChange={setFilters}
            onReset={() => { setFilters(DEFAULT_FILTERS); setSearch(''); }}
          />
          <ProductGrid products={products} loading={loading} error={error} />
        </div>
      </main>

      {/* Floating Cart Button */}
      {itemCount > 0 && (
        <button
          onClick={() => setCartOpen(true)}
          className="fixed bottom-6 right-6 bg-indigo-600 text-white px-5 py-3 rounded-2xl shadow-xl shadow-indigo-200 flex items-center gap-3 hover:bg-indigo-700 transition-all active:scale-95 z-30"
        >
          <ShoppingCart className="w-5 h-5" />
          <span className="font-semibold">{itemCount} item{itemCount !== 1 ? 's' : ''}</span>
          <span className="font-bold">${total.toFixed(2)}</span>
        </button>
      )}

      {/* Cart Drawer */}
      {cartOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div className="flex-1 bg-black/40 backdrop-blur-sm" onClick={() => setCartOpen(false)} />
          <div className="w-full max-w-md bg-white flex flex-col h-full shadow-2xl">
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <ShoppingCart className="w-5 h-5 text-indigo-600" />
                Your Cart
              </h2>
              <button onClick={() => setCartOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
              {items.map((item) => (
                <div key={item.product.id} className="flex gap-4 p-3 bg-gray-50 rounded-xl">
                  <div className="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden shrink-0">
                    {item.product.imageUrl ? (
                      <img src={item.product.imageUrl} alt={item.product.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">IMG</div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">{item.product.name}</p>
                    <p className="text-xs text-gray-500">${item.product.price.toFixed(2)} each</p>
                    <div className="flex items-center gap-2 mt-2">
                      <button onClick={() => updateQuantity(item.product.id, item.quantity - 1)} className="w-6 h-6 flex items-center justify-center bg-white border rounded-lg hover:bg-gray-50 transition">
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-sm font-semibold w-5 text-center">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.product.id, item.quantity + 1)} className="w-6 h-6 flex items-center justify-center bg-white border rounded-lg hover:bg-gray-50 transition">
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                  <div className="flex flex-col items-end justify-between">
                    <button onClick={() => removeItem(item.product.id)} className="text-gray-300 hover:text-red-400 transition">
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <span className="text-sm font-bold text-gray-900">
                      ${(item.product.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="px-6 py-4 border-t space-y-3 bg-white">
              <div className="flex items-center justify-between text-base font-bold text-gray-900">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <button
                onClick={handleCheckout}
                className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white py-3 rounded-xl font-semibold hover:bg-indigo-700 transition-all active:scale-[0.98]"
              >
                <CreditCard className="w-4 h-4" />
                Checkout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
