import { type ChangeEvent } from 'react';
import { SlidersHorizontal, X } from 'lucide-react';
import type { ProductQuery } from '../types';

const CATEGORIES = ['Electronics', 'Clothing', 'Books', 'Home', 'Sports', 'Beauty', 'Toys', 'Food'];

interface FilterSidebarProps {
  filters: ProductQuery;
  onChange: (filters: ProductQuery) => void;
  onReset: () => void;
}

export function FilterSidebar({ filters, onChange, onReset }: FilterSidebarProps) {
  const set = (key: keyof ProductQuery, value: unknown) =>
    onChange({ ...filters, [key]: value });

  const hasFilters =
    filters.category ||
    filters.minPrice !== undefined ||
    filters.maxPrice !== undefined ||
    filters.inStockOnly ||
    (filters.sortBy && filters.sortBy !== 'name');

  return (
    <aside className="w-64 shrink-0 space-y-6">
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-900 flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-indigo-500" />
            Filters
          </h3>
          {hasFilters && (
            <button
              onClick={onReset}
              className="text-xs text-indigo-500 hover:text-indigo-700 flex items-center gap-1 transition-colors"
            >
              <X className="w-3 h-3" /> Reset
            </button>
          )}
        </div>

        {/* Category */}
        <div className="mb-5">
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
            Category
          </label>
          <div className="space-y-1">
            <button
              onClick={() => set('category', undefined)}
              className={`w-full text-left px-3 py-1.5 rounded-lg text-sm transition-colors ${
                !filters.category
                  ? 'bg-indigo-50 text-indigo-700 font-medium'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              All Categories
            </button>
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => set('category', filters.category === cat ? undefined : cat)}
                className={`w-full text-left px-3 py-1.5 rounded-lg text-sm transition-colors ${
                  filters.category === cat
                    ? 'bg-indigo-50 text-indigo-700 font-medium'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Price Range */}
        <div className="mb-5">
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
            Price Range
          </label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              placeholder="Min"
              min={0}
              value={filters.minPrice ?? ''}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                set('minPrice', e.target.value ? Number(e.target.value) : undefined)
              }
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
            <span className="text-gray-400 text-sm">–</span>
            <input
              type="number"
              placeholder="Max"
              min={0}
              value={filters.maxPrice ?? ''}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                set('maxPrice', e.target.value ? Number(e.target.value) : undefined)
              }
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>
        </div>

        {/* In Stock */}
        <div className="mb-5">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={!!filters.inStockOnly}
              onChange={(e) => set('inStockOnly', e.target.checked || undefined)}
              className="w-4 h-4 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500"
            />
            <span className="text-sm text-gray-700">In Stock Only</span>
          </label>
        </div>

        {/* Sort */}
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
            Sort By
          </label>
          <select
            value={`${filters.sortBy ?? ''}:${filters.sortOrder ?? ''}`}
            onChange={(e) => {
              const [sortBy, sortOrder] = e.target.value.split(':');
              onChange({
                ...filters,
                sortBy: (sortBy as ProductQuery['sortBy']) || undefined,
                sortOrder: (sortOrder as ProductQuery['sortOrder']) || undefined,
              });
            }}
            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white"
          >
            <option value=":">Default</option>
            <option value="name:asc">Name (A–Z)</option>
            <option value="name:desc">Name (Z–A)</option>
            <option value="price:asc">Price (Low to High)</option>
            <option value="price:desc">Price (High to Low)</option>
          </select>
        </div>
      </div>
    </aside>
  );
}
