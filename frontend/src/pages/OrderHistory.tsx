import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { ordersApi } from '../lib/api';
import type { Order } from '../types';
import { Loader2, PackageOpen, ClipboardList } from 'lucide-react';

const STATUS_STYLES: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-700',
  confirmed: 'bg-blue-100 text-blue-700',
  shipped: 'bg-purple-100 text-purple-700',
  delivered: 'bg-emerald-100 text-emerald-700',
  cancelled: 'bg-red-100 text-red-600',
};

export function OrderHistory() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    ordersApi.getMine()
      .then(setOrders)
      .catch((err) => setError((err as Error).message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2 mb-6">
          <ClipboardList className="w-6 h-6 text-indigo-600" />
          Order History
        </h1>

        {loading && (
          <div className="flex justify-center py-20">
            <Loader2 className="w-10 h-10 text-indigo-500 animate-spin" />
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm">
            {error}
          </div>
        )}

        {!loading && !error && orders.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <PackageOpen className="w-16 h-16 text-gray-300 mb-4" />
            <h3 className="font-semibold text-gray-700 mb-1">No orders yet</h3>
            <p className="text-sm text-gray-500 mb-4">Start shopping to see your orders here.</p>
            <Link to="/" className="text-sm font-semibold text-indigo-600 hover:text-indigo-700">
              Browse products →
            </Link>
          </div>
        )}

        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-xs text-gray-400 font-mono">#{order.id.slice(0, 8).toUpperCase()}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(order.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric', month: 'long', day: 'numeric',
                    })}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-xs font-semibold px-3 py-1 rounded-full capitalize ${STATUS_STYLES[order.status] ?? 'bg-gray-100 text-gray-600'}`}>
                    {order.status}
                  </span>
                  <span className="text-base font-bold text-gray-900">
                    ${order.totalPrice.toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="border-t border-gray-50 pt-4">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Items</p>
                <div className="space-y-1">
                  {order.items.map((item, i) => (
                    <div key={i} className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">
                        Product #{item.productId} × {item.quantity}
                      </span>
                      <span className="font-medium text-gray-800">
                        ${(item.unitPrice * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
