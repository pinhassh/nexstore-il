import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type KeyboardEvent,
} from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  MapPin,
  CreditCard,
  Loader2,
  ShoppingBag,
  Package,
  CheckCircle,
  Search,
  Navigation,
  Lock,
} from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { useCart } from '../context/CartContext';
import { useToast } from '../components/Toast';
import { ordersApi } from '../lib/api';
import { calcShippingCost, distanceFromIsraelKm } from '../lib/distance';

// ─── Nominatim types ────────────────────────────────────────────────────────

interface NominatimResult {
  place_id: number;
  display_name: string;
  lat: string;
  lon: string;
  address?: {
    country?: string;
    city?: string;
    town?: string;
    state?: string;
    postcode?: string;
  };
}

// ─── Address autocomplete hook ───────────────────────────────────────────────

function useAddressSearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<NominatimResult[]>([]);
  const [searching, setSearching] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (query.trim().length < 3) {
      setResults([]);
      return;
    }
    if (timerRef.current) clearTimeout(timerRef.current);

    // Nominatim ToS: max 1 req/s — 700ms debounce is safe
    timerRef.current = setTimeout(async () => {
      setSearching(true);
      try {
        const params = new URLSearchParams({
          q: query.trim(),
          format: 'json',
          addressdetails: '1',
          limit: '6',
          'accept-language': 'en',
        });
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?${params}`,
          { headers: { 'Accept-Language': 'en' } },
        );
        const data: NominatimResult[] = await res.json();
        setResults(data);
      } catch {
        setResults([]);
      } finally {
        setSearching(false);
      }
    }, 700);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [query]);

  return { query, setQuery, results, searching, clearResults: () => setResults([]) };
}

// ─── Card-number / expiry formatters ────────────────────────────────────────

function fmtCardNumber(raw: string): string {
  return raw
    .replace(/\D/g, '')
    .slice(0, 16)
    .replace(/(.{4})(?=.)/g, '$1 ');
}

function fmtExpiry(raw: string): string {
  const digits = raw.replace(/\D/g, '').slice(0, 4);
  return digits.length > 2 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits;
}

function detectCardType(num: string): string {
  const d = num.replace(/\s/g, '');
  if (/^4/.test(d)) return 'Visa';
  if (/^5[1-5]/.test(d)) return 'Mastercard';
  if (/^3[47]/.test(d)) return 'Amex';
  if (/^6(?:011|5)/.test(d)) return 'Discover';
  return '';
}

// ─── Checkout page ───────────────────────────────────────────────────────────

type PaymentMethod = 'credit_card' | 'paypal';

interface SelectedAddress {
  display: string;
  lat: number;
  lng: number;
}

interface CardForm {
  number: string;
  expiry: string;
  cvv: string;
  name: string;
}

export function Checkout() {
  const { items, total: subtotal, clearCart, itemCount } = useCart();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Redirect away if cart is empty
  useEffect(() => {
    if (itemCount === 0) navigate('/', { replace: true });
  }, [itemCount, navigate]);

  // Address autocomplete
  const { query, setQuery, results, searching, clearResults } = useAddressSearch();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [focusedIdx, setFocusedIdx] = useState(-1);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Selected address + derived shipping
  const [address, setAddress] = useState<SelectedAddress | null>(null);
  const shippingCost = address ? calcShippingCost(address.lat, address.lng) : null;
  const distanceKm = address
    ? Math.round(distanceFromIsraelKm(address.lat, address.lng))
    : null;
  const grandTotal =
    shippingCost !== null ? Math.round((subtotal + shippingCost) * 100) / 100 : null;

  // Payment
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('credit_card');
  const [card, setCard] = useState<CardForm>({ number: '', expiry: '', cvv: '', name: '' });
  const [paypalEmail, setPaypalEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Close dropdown on outside click
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  function handleQueryChange(e: ChangeEvent<HTMLInputElement>) {
    setQuery(e.target.value);
    setAddress(null);
    setDropdownOpen(true);
    setFocusedIdx(-1);
  }

  function selectResult(r: NominatimResult) {
    setAddress({ display: r.display_name, lat: Number(r.lat), lng: Number(r.lon) });
    setQuery(r.display_name);
    clearResults();
    setDropdownOpen(false);
    setFocusedIdx(-1);
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (!dropdownOpen || results.length === 0) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setFocusedIdx((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setFocusedIdx((i) => Math.max(i - 1, 0));
    } else if (e.key === 'Enter' && focusedIdx >= 0) {
      e.preventDefault();
      selectResult(results[focusedIdx]);
    } else if (e.key === 'Escape') {
      setDropdownOpen(false);
    }
  }

  function setCardField(field: keyof CardForm, raw: string) {
    let value = raw;
    if (field === 'number') value = fmtCardNumber(raw);
    if (field === 'expiry') value = fmtExpiry(raw);
    if (field === 'cvv') value = raw.replace(/\D/g, '').slice(0, 4);
    setCard((c) => ({ ...c, [field]: value }));
  }

  function isPaymentValid(): boolean {
    if (paymentMethod === 'credit_card') {
      const digits = card.number.replace(/\s/g, '');
      return (
        digits.length >= 13 &&
        card.expiry.length === 5 &&
        card.cvv.length >= 3 &&
        card.name.trim().length >= 2
      );
    }
    return /^\S+@\S+\.\S+$/.test(paypalEmail);
  }

  const canSubmit = address !== null && isPaymentValid() && !submitting;

  async function handleSubmit() {
    if (!canSubmit || shippingCost === null || !address) return;
    setSubmitting(true);
    try {
      await ordersApi.create({
        items: items.map((i) => ({ productId: i.product.id, quantity: i.quantity })),
        shippingAddress: address.display,
        shippingCost,
        paymentMethod,
      });
      clearCart();
      toast('Order placed successfully! 🎉');
      navigate('/orders');
    } catch (err) {
      toast((err as Error).message || 'Order failed — please try again.', 'error');
    } finally {
      setSubmitting(false);
    }
  }

  const cardType = detectCardType(card.number);

  if (itemCount === 0) return null; // redirect fires in useEffect

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-indigo-600 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to shop
        </Link>

        <h1 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-2">
          <ShoppingBag className="w-6 h-6 text-indigo-600" />
          Checkout
        </h1>

        <div className="grid lg:grid-cols-[1fr_380px] gap-8 items-start">
          {/* ── LEFT: forms ─────────────────────────────────────────────── */}
          <div className="space-y-6">

            {/* Section 1 — Shipping */}
            <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h2 className="font-semibold text-gray-900 flex items-center gap-2 mb-5">
                <span className="w-7 h-7 rounded-full bg-indigo-600 text-white text-xs font-bold flex items-center justify-center">
                  1
                </span>
                Shipping Address
              </h2>

              {/* Autocomplete */}
              <div ref={dropdownRef} className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Delivery address <span className="text-gray-400 font-normal">(global)</span>
                </label>

                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={handleQueryChange}
                    onFocus={() => results.length > 0 && setDropdownOpen(true)}
                    onKeyDown={handleKeyDown}
                    placeholder="Start typing any address worldwide…"
                    autoComplete="off"
                    className={`w-full pl-9 pr-10 py-2.5 text-sm border rounded-xl focus:outline-none focus:ring-2 transition ${
                      address
                        ? 'border-emerald-300 ring-0 bg-emerald-50/50 focus:ring-emerald-300'
                        : 'border-gray-200 bg-gray-50 focus:bg-white focus:ring-indigo-400'
                    }`}
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    {searching ? (
                      <Loader2 className="w-4 h-4 text-gray-400 animate-spin" />
                    ) : address ? (
                      <CheckCircle className="w-4 h-4 text-emerald-500" />
                    ) : (
                      <Search className="w-4 h-4 text-gray-300" />
                    )}
                  </div>
                </div>

                {/* Dropdown */}
                {dropdownOpen && results.length > 0 && (
                  <ul
                    role="listbox"
                    className="absolute z-30 mt-1 w-full bg-white border border-gray-100 rounded-xl shadow-xl overflow-hidden"
                  >
                    {results.map((r, i) => (
                      <li
                        key={r.place_id}
                        role="option"
                        aria-selected={i === focusedIdx}
                        onMouseDown={() => selectResult(r)}
                        className={`flex items-start gap-3 px-4 py-3 cursor-pointer text-sm transition-colors ${
                          i === focusedIdx ? 'bg-indigo-50' : 'hover:bg-gray-50'
                        }`}
                      >
                        <MapPin className="w-4 h-4 text-indigo-400 mt-0.5 shrink-0" />
                        <span className="text-gray-700 line-clamp-2">{r.display_name}</span>
                      </li>
                    ))}
                    <li className="px-4 py-2 text-xs text-gray-400 bg-gray-50/70 border-t border-gray-100">
                      Results from © OpenStreetMap / Nominatim
                    </li>
                  </ul>
                )}

                <p className="mt-1.5 text-xs text-gray-400">
                  Type at least 3 characters — results from OpenStreetMap Nominatim
                </p>
              </div>

              {/* Shipping distance badge */}
              {address && distanceKm !== null && shippingCost !== null && (
                <div className="mt-4 flex items-center gap-3 p-3 bg-indigo-50 rounded-xl text-sm">
                  <Navigation className="w-5 h-5 text-indigo-500 shrink-0" />
                  <div>
                    <span className="font-semibold text-indigo-700">
                      {distanceKm.toLocaleString()} km
                    </span>
                    <span className="text-indigo-500"> from Israel · </span>
                    <span className="font-semibold text-indigo-700">
                      Shipping: ${shippingCost.toFixed(2)}
                    </span>
                    <span className="text-indigo-400 ml-1">
                      ($5 base + ${(shippingCost - 5).toFixed(2)} distance)
                    </span>
                  </div>
                </div>
              )}
            </section>

            {/* Section 2 — Payment */}
            <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h2 className="font-semibold text-gray-900 flex items-center gap-2 mb-5">
                <span className="w-7 h-7 rounded-full bg-indigo-600 text-white text-xs font-bold flex items-center justify-center">
                  2
                </span>
                Payment Method
              </h2>

              {/* Toggle */}
              <div className="flex gap-3 mb-6">
                {(['credit_card', 'paypal'] as const).map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setPaymentMethod(m)}
                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border text-sm font-semibold transition-all ${
                      paymentMethod === m
                        ? 'border-indigo-500 bg-indigo-50 text-indigo-700 shadow-sm'
                        : 'border-gray-200 text-gray-500 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {m === 'credit_card' ? (
                      <>
                        <CreditCard className="w-4 h-4" />
                        Credit Card
                      </>
                    ) : (
                      <>
                        <span className="font-extrabold text-[#003087]">Pay</span>
                        <span className="font-extrabold text-[#009cde]">Pal</span>
                      </>
                    )}
                  </button>
                ))}
              </div>

              {paymentMethod === 'credit_card' ? (
                <div className="space-y-4">
                  {/* Card number */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Card number
                    </label>
                    <div className="relative">
                      <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                      <input
                        type="text"
                        inputMode="numeric"
                        placeholder="1234 5678 9012 3456"
                        value={card.number}
                        onChange={(e) => setCardField('number', e.target.value)}
                        className="w-full pl-9 pr-20 py-2.5 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400 transition font-mono tracking-wider"
                      />
                      {cardType && (
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-indigo-500 bg-indigo-50 px-2 py-0.5 rounded">
                          {cardType}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Expiry + CVV */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Expiry
                      </label>
                      <input
                        type="text"
                        inputMode="numeric"
                        placeholder="MM/YY"
                        value={card.expiry}
                        onChange={(e) => setCardField('expiry', e.target.value)}
                        className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400 transition font-mono tracking-wider"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        CVV
                      </label>
                      <input
                        type="password"
                        inputMode="numeric"
                        placeholder="•••"
                        value={card.cvv}
                        onChange={(e) => setCardField('cvv', e.target.value)}
                        className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400 transition font-mono"
                      />
                    </div>
                  </div>

                  {/* Cardholder name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Cardholder name
                    </label>
                    <input
                      type="text"
                      placeholder="Name as printed on card"
                      value={card.name}
                      onChange={(e) => setCard((c) => ({ ...c, name: e.target.value }))}
                      className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
                    />
                  </div>

                  {/* Mock security note */}
                  <div className="flex items-center gap-2 text-xs text-gray-400 mt-1">
                    <Lock className="w-3.5 h-3.5" />
                    This is a demo — no real card data is processed or stored.
                  </div>
                </div>
              ) : (
                /* PayPal mock */
                <div className="space-y-4">
                  <div className="p-5 rounded-xl border-2 border-dashed border-[#009cde]/40 bg-[#f0f8ff] flex flex-col items-center gap-3">
                    <div className="text-2xl font-extrabold">
                      <span className="text-[#003087]">Pay</span>
                      <span className="text-[#009cde]">Pal</span>
                    </div>
                    <p className="text-sm text-gray-600 text-center">
                      Enter your PayPal email to complete the mock payment.
                    </p>
                    <input
                      type="email"
                      placeholder="paypal@example.com"
                      value={paypalEmail}
                      onChange={(e) => setPaypalEmail(e.target.value)}
                      className="w-full px-4 py-2.5 text-sm border border-[#009cde]/30 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-[#009cde] transition"
                    />
                  </div>
                  <p className="text-xs text-gray-400 flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5" />
                    Demo only — you won't be redirected to PayPal.
                  </p>
                </div>
              )}
            </section>
          </div>

          {/* ── RIGHT: order summary ─────────────────────────────────────── */}
          <div className="space-y-4">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sticky top-24">
              <h2 className="font-semibold text-gray-900 flex items-center gap-2 mb-5">
                <ShoppingBag className="w-5 h-5 text-indigo-500" />
                Order Summary
              </h2>

              {/* Items */}
              <ul className="space-y-3 mb-5">
                {items.map((item) => (
                  <li key={item.product.id} className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gray-100 overflow-hidden shrink-0">
                      {item.product.imageUrl ? (
                        <img
                          src={item.product.imageUrl}
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Package className="w-5 h-5 text-gray-400" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {item.product.name}
                      </p>
                      <p className="text-xs text-gray-400">
                        {item.quantity} × ${item.product.price.toFixed(2)}
                      </p>
                    </div>
                    <span className="text-sm font-semibold text-gray-800 shrink-0">
                      ${(item.product.price * item.quantity).toFixed(2)}
                    </span>
                  </li>
                ))}
              </ul>

              {/* Totals */}
              <div className="border-t border-gray-100 pt-4 space-y-2">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>

                <div className="flex justify-between text-sm text-gray-600">
                  <span className="flex items-center gap-1.5">
                    Shipping
                    {distanceKm !== null && (
                      <span className="text-xs text-gray-400">
                        ({distanceKm.toLocaleString()} km)
                      </span>
                    )}
                  </span>
                  {shippingCost !== null ? (
                    <span className="text-emerald-600 font-medium">
                      +${shippingCost.toFixed(2)}
                    </span>
                  ) : (
                    <span className="text-gray-400 text-xs">Select address</span>
                  )}
                </div>

                <div className="flex justify-between font-bold text-gray-900 text-base pt-2 border-t border-gray-100">
                  <span>Total</span>
                  <span>
                    {grandTotal !== null ? `$${grandTotal.toFixed(2)}` : '—'}
                  </span>
                </div>
              </div>

              {/* Pay Now */}
              <button
                type="button"
                disabled={!canSubmit}
                onClick={handleSubmit}
                className="mt-5 w-full flex items-center justify-center gap-2 bg-indigo-600 text-white py-3.5 rounded-xl font-semibold hover:bg-indigo-700 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-100"
              >
                {submitting ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Lock className="w-4 h-4" />
                )}
                {submitting ? 'Placing order…' : `Pay Now${grandTotal ? ` · $${grandTotal.toFixed(2)}` : ''}`}
              </button>

              {!address && (
                <p className="mt-2 text-center text-xs text-gray-400">
                  Select a shipping address to enable payment.
                </p>
              )}

              {/* Trust badge */}
              <div className="mt-4 flex items-center justify-center gap-1.5 text-xs text-gray-400">
                <Lock className="w-3.5 h-3.5" />
                Secured · SSL encrypted · Demo store
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
