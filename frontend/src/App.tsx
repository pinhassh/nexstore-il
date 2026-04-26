import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { ToastProvider } from './components/Toast';
import { ProtectedRoute } from './components/ProtectedRoute';
import { AdminRoute } from './components/AdminRoute';
import { Dashboard } from './pages/Dashboard';
import { ProductDetail } from './pages/ProductDetail';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { OrderHistory } from './pages/OrderHistory';
import { ProfileSettings } from './pages/ProfileSettings';
import { AdminAddProduct } from './pages/AdminAddProduct';
import { AdminUsers } from './pages/AdminUsers';
import { Checkout } from './pages/Checkout';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <ToastProvider>
            <Routes>
              {/* Public */}
              <Route path="/" element={<Dashboard />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Protected (logged-in users) */}
              <Route element={<ProtectedRoute />}>
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/orders" element={<OrderHistory />} />
                <Route path="/profile" element={<ProfileSettings />} />
              </Route>

              {/* Admin only */}
              <Route element={<AdminRoute />}>
                <Route path="/admin/add-product" element={<AdminAddProduct />} />
                <Route path="/admin/users" element={<AdminUsers />} />
              </Route>
            </Routes>
          </ToastProvider>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
