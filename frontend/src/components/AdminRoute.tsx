import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Loader2, ShieldAlert } from 'lucide-react';

export function AdminRoute() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-indigo-500 animate-spin" />
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;

  if (user.role !== 'admin') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 text-center px-4">
        <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center">
          <ShieldAlert className="w-10 h-10 text-red-400" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800">Access Denied</h2>
        <p className="text-gray-500 max-w-sm">
          You don't have permission to view this page. Admin access is required.
        </p>
      </div>
    );
  }

  return <Outlet />;
}
