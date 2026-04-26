import { useForm } from 'react-hook-form';
import { Navbar } from '../components/Navbar';
import { productsApi } from '../lib/api';
import { useToast } from '../components/Toast';
import { PlusCircle, Loader2 } from 'lucide-react';
import type { Product } from '../types';

type FormData = Omit<Product, 'id'> & { inStockStr: string };

const CATEGORIES = ['Electronics', 'Clothing', 'Books', 'Home', 'Sports', 'Beauty', 'Toys', 'Food'];

export function AdminAddProduct() {
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ defaultValues: { inStockStr: 'true' } });

  async function onSubmit(data: FormData) {
    try {
      await productsApi.create({
        name: data.name,
        description: data.description,
        price: Number(data.price),
        category: data.category,
        inStock: data.inStockStr === 'true',
        imageUrl: data.imageUrl || undefined,
      });
      toast('Product added successfully!');
      reset({ inStockStr: 'true' });
    } catch (err) {
      toast((err as Error).message || 'Failed to add product', 'error');
    }
  }

  const fieldClass = (hasError: boolean) =>
    `w-full px-4 py-2.5 text-sm border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 transition ${
      hasError ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-gray-50 focus:bg-white'
    }`;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2 mb-6">
          <PlusCircle className="w-6 h-6 text-indigo-600" />
          Add New Product
        </h1>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Product Name</label>
              <input
                type="text"
                placeholder="e.g. Wireless Headphones"
                {...register('name', { required: 'Name is required', minLength: { value: 2, message: 'At least 2 characters' } })}
                className={fieldClass(!!errors.name)}
              />
              {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
              <textarea
                rows={3}
                placeholder="Describe the product…"
                {...register('description', { required: 'Description is required', minLength: { value: 10, message: 'At least 10 characters' } })}
                className={`${fieldClass(!!errors.description)} resize-none`}
              />
              {errors.description && <p className="mt-1 text-xs text-red-500">{errors.description.message}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Price ($)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  placeholder="29.99"
                  {...register('price', {
                    required: 'Price is required',
                    min: { value: 0.01, message: 'Price must be greater than 0' },
                    valueAsNumber: true,
                  })}
                  className={fieldClass(!!errors.price)}
                />
                {errors.price && <p className="mt-1 text-xs text-red-500">{errors.price.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Category</label>
                <select
                  {...register('category', { required: 'Category is required' })}
                  className={`${fieldClass(!!errors.category)} bg-white`}
                >
                  <option value="">Select category…</option>
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
                {errors.category && <p className="mt-1 text-xs text-red-500">{errors.category.message}</p>}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Image URL <span className="text-gray-400 font-normal">(optional)</span></label>
              <input
                type="url"
                placeholder="https://example.com/image.jpg"
                {...register('imageUrl')}
                className={fieldClass(false)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Stock Status</label>
              <div className="flex gap-4">
                {['true', 'false'].map((v) => (
                  <label key={v} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      value={v}
                      {...register('inStockStr')}
                      className="text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="text-sm text-gray-700">{v === 'true' ? 'In Stock' : 'Out of Stock'}</span>
                  </label>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white py-3 rounded-xl font-semibold hover:bg-indigo-700 transition-all active:scale-[0.98] disabled:opacity-70"
            >
              {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <PlusCircle className="w-4 h-4" />}
              {isSubmitting ? 'Adding product…' : 'Add Product'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
