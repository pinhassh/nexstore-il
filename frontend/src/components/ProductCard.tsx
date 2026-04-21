import { ShoppingCart, Package } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Product } from '../types';
import { useCart } from '../context/CartContext';
import { useToast } from './Toast';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();
  const { toast } = useToast();

  function handleAddToCart(e: React.MouseEvent) {
    e.preventDefault();
    if (!product.inStock) return;
    addItem(product);
    toast(`"${product.name}" added to cart`);
  }

  return (
    <Link
      to={`/product/${product.id}`}
      className="group relative bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200 overflow-hidden cursor-pointer flex flex-col"
    >
      {/* Image */}
      <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).style.display = 'none';
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Package className="w-16 h-16 text-gray-300" />
          </div>
        )}

        {/* Stock badge */}
        <span
          className={`absolute top-3 left-3 text-xs font-semibold px-2.5 py-1 rounded-full ${
            product.inStock
              ? 'bg-emerald-100 text-emerald-700'
              : 'bg-red-100 text-red-600'
          }`}
        >
          {product.inStock ? 'In Stock' : 'Out of Stock'}
        </span>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        {/* Category */}
        <span className="inline-block text-xs font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full mb-2 w-fit">
          {product.category}
        </span>

        <h3 className="font-semibold text-gray-900 text-sm leading-tight mb-1 line-clamp-2 group-hover:text-indigo-600 transition-colors">
          {product.name}
        </h3>

        <p className="text-xs text-gray-500 line-clamp-2 mb-4 flex-1">
          {product.description}
        </p>

        <div className="flex items-center justify-between mt-auto">
          <span className="text-lg font-bold text-gray-900">
            ${product.price.toFixed(2)}
          </span>
          <button
            onClick={handleAddToCart}
            disabled={!product.inStock}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              product.inStock
                ? 'bg-indigo-600 text-white hover:bg-indigo-700 active:scale-95'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            Add to Cart
          </button>
        </div>
      </div>
    </Link>
  );
}
