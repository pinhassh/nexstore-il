import { Loader2, PackageOpen } from 'lucide-react';
import type { Product } from '../types';
import { ProductCard } from './ProductCard';

interface ProductGridProps {
  products: Product[];
  loading: boolean;
  error: string | null;
}

export function ProductGrid({ products, loading, error }: ProductGridProps) {
  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center py-20">
        <Loader2 className="w-10 h-10 text-indigo-500 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center py-20 text-center">
        <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-4">
          <PackageOpen className="w-8 h-8 text-red-400" />
        </div>
        <h3 className="font-semibold text-gray-800 mb-1">Failed to load products</h3>
        <p className="text-sm text-gray-500">{error}</p>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center py-20 text-center">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <PackageOpen className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="font-semibold text-gray-800 mb-1">No products found</h3>
        <p className="text-sm text-gray-500">Try adjusting your filters.</p>
      </div>
    );
  }

  return (
    <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
      {products.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  );
}
