import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShoppingCart,
  Store,
  LogOut,
  Settings,
  ClipboardList,
  ChevronDown,
  Search,
  Users,
  PlusSquare,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

interface NavbarProps {
  onSearch?: (q: string) => void;
  searchValue?: string;
}

export function Navbar({ onSearch, searchValue = '' }: NavbarProps) {
  const { user, logout } = useAuth();
  const { itemCount } = useCart();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [cartPulse, setCartPulse] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const prevCount = useRef(itemCount);

  useEffect(() => {
    if (itemCount > prevCount.current) {
      setCartPulse(true);
      setTimeout(() => setCartPulse(false), 400);
    }
    prevCount.current = itemCount;
  }, [itemCount]);

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  function handleLogout() {
    logout();
    setDropdownOpen(false);
    navigate('/login');
  }

  const initials = user?.name
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <nav className="sticky top-0 z-40 bg-white/90 backdrop-blur border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2 font-bold text-xl text-indigo-600 shrink-0 hover:text-indigo-700 transition-colors"
          >
            <Store className="w-7 h-7" />
            <span>NexStoreIL</span>
          </Link>

          {/* Search bar */}
          <div className="flex-1 max-w-lg relative hidden sm:flex">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Search products…"
              value={searchValue}
              onChange={(e) => onSearch?.(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm rounded-lg border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:bg-white transition"
            />
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3">
            {/* Cart */}
            <Link
              to="/"
              className="relative p-2 text-gray-500 hover:text-indigo-600 transition-colors rounded-lg hover:bg-indigo-50"
              aria-label="Cart"
            >
              <ShoppingCart className={`w-6 h-6 transition-transform ${cartPulse ? 'scale-125' : ''}`} />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-indigo-600 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                  {itemCount > 99 ? '99+' : itemCount}
                </span>
              )}
            </Link>

            {/* Auth */}
            {user ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen((v) => !v)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-gray-100 transition-colors text-sm font-medium text-gray-700"
                >
                  <span className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs font-bold">
                    {initials}
                  </span>
                  <span className="hidden sm:block max-w-[100px] truncate">{user.name}</span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-50">
                    <div className="px-4 py-2 border-b border-gray-50 mb-1">
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        {user.role === 'admin' ? '⚡ Admin' : 'Account'}
                      </p>
                      <p className="text-sm font-medium text-gray-800 truncate">{user.name}</p>
                    </div>

                    <DropdownLink to="/profile" icon={<Settings className="w-4 h-4" />} onClick={() => setDropdownOpen(false)}>
                      Profile Settings
                    </DropdownLink>
                    <DropdownLink to="/orders" icon={<ClipboardList className="w-4 h-4" />} onClick={() => setDropdownOpen(false)}>
                      Order History
                    </DropdownLink>

                    {user.role === 'admin' && (
                      <>
                        <div className="my-1 border-t border-gray-100" />
                        <DropdownLink to="/admin/users" icon={<Users className="w-4 h-4" />} onClick={() => setDropdownOpen(false)}>
                          Manage Users
                        </DropdownLink>
                        <DropdownLink to="/admin/add-product" icon={<PlusSquare className="w-4 h-4" />} onClick={() => setDropdownOpen(false)}>
                          Add Product
                        </DropdownLink>
                      </>
                    )}

                    <div className="my-1 border-t border-gray-100" />
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="text-sm font-medium text-gray-600 hover:text-indigo-600 transition-colors px-3 py-1.5 rounded-lg hover:bg-indigo-50"
                >
                  Sign in
                </Link>
                <Link
                  to="/register"
                  className="text-sm font-medium bg-indigo-600 text-white px-4 py-1.5 rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

function DropdownLink({
  to,
  icon,
  onClick,
  children,
}: {
  to: string;
  icon: React.ReactNode;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
    >
      <span className="text-gray-400">{icon}</span>
      {children}
    </Link>
  );
}
