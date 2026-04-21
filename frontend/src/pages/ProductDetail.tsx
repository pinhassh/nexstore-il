import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  ShoppingCart,
  Package,
  Tag,
  CheckCircle,
  XCircle,
  Loader2,
} from 'lucide-react';
import { productsApi } from '../lib/api';
import type { Product } from '../types';
import { useCart } from '../context/CartContext';
import { useToast } from '../components/Toast';
import { Navbar } from '../components/Navbar';

export function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCart();
  const { toast } = useToast();

  useEffect(() => {
    async function load() {
      try {
        const all = await productsApi.getAll();
        const found = all.find((p) => p.id === Number(id));
        setProduct(found ?? null);
      } catch {
        setProduct(null);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center py-32">
          <Loader2 className="w-10 h-10 text-indigo-500 animate-spin" />
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex flex-col items-center justify-center py-32 gap-4">
          <Package className="w-16 h-16 text-gray-300" />
          <h2 className="text-xl font-bold text-gray-700">Product not found</h2>
          <Link to="/" className="text-indigo-600 hover:underline text-sm">
            Back to shop
          </Link>
        </div>
      </div>
    );
  }

  function handleAdd() {
    if (!product || !product.inStock) return;
    addItem(product, quantity);
    toast(`${quantity}x "${product.name}" added to cart`);
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-indigo-600 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="grid md:grid-cols-2 gap-0">
            {/* Image */}
            <div className="h-64 md:h-auto min-h-[300px] bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
              {product.imageUrl ? (
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <Package className="w-24 h-24 text-gray-300" />
              )}
            </div>

            {/* Info */}
            <div className="p-8 flex flex-col">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full flex items-center gap-1">
                  <Tag className="w-3 h-3" />
                  {product.category}
                </span>
                <span
                  className={`text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1 ${
                    product.inStock
                      ? 'bg-emerald-50 text-emerald-700'
                      : 'bg-red-50 text-red-600'
                  }`}
                >
                  {product.inStock ? (
                    <CheckCircle className="w-3 h-3" />
                  ) : (
                    <XCircle className="w-3 h-3" />
                  )}
                  {product.inStock ? 'In Stock' : 'Out of Stock'}
                </span>
              </div>

              <h1 className="text-2xl font-bold text-gray-900 mb-3">{product.name}</h1>
              <p className="text-gray-600 text-sm leading-relaxed mb-6 flex-1">
                {product.description}
              </p>

              <div className="mt-auto">
                <div className="text-3xl font-bold text-gray-900 mb-6">
                  ${product.price.toFixed(2)}
                </div>

                {product.inStock && (
                  <div className="flex items-center gap-3 mb-4">
                    <label className="text-sm font-medium text-gray-700">Qty:</label>
                    <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                      <button
                        onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                        className="w-9 h-9 flex items-center justify-center hover:bg-gray-50 transition text-gray-600"
                      >
                        −
                      </button>
                      <span className="w-10 text-center text-sm font-semibold">{quantity}</span>
                      <button
                        onClick={() => setQuantity((q) => q + 1)}
                        className="w-9 h-9 flex items-center justify-center hover:bg-gray-50 transition text-gray-600"
                      >
                        +
                      </button>
                    </div>
                  </div>
                )}

                <button
                  onClick={handleAdd}
                  disabled={!product.inStock}
                  className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold transition-all active:scale-[0.98] ${
                    product.inStock
                      ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  <ShoppingCart className="w-5 h-5" />
                  {product.inStock ? 'Add to Cart' : 'Out of Stock'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
