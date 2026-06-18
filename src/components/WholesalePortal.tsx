import { useState, useMemo, useEffect, type FormEvent } from 'react';
import type { CustomerConfig, ItemGroup } from '../wholesale/types';

// ─────────────────────────────────────────────────────────────
//  CONFIG — update before deploying
// ─────────────────────────────────────────────────────────────
const LAMBDA_URL   = 'https://f1hhdoctn3.execute-api.us-east-1.amazonaws.com/form';
const PHP_AUTH_URL = 'https://bigdipper.com/wholesale-auth.php';

// ─────────────────────────────────────────────────────────────
//  HELPERS
// ─────────────────────────────────────────────────────────────
function minDate(days: number): string {
  return new Date(Date.now() + days * 86400000).toISOString().split('T')[0];
}

/** Build a stable React key from an item name (handles dupes across groups) */
function itemKey(groupIdx: number, itemIdx: number): string {
  return `${groupIdx}-${itemIdx}`;
}

// ─────────────────────────────────────────────────────────────
//  ORDER FORM  (renders from a CustomerConfig)
// ─────────────────────────────────────────────────────────────
function WholesaleOrderForm({ customer }: { customer: CustomerConfig }) {
  const leadDays = customer.leadTimeDays ?? 0;
  const hasLocations = (customer.locations?.length ?? 0) > 1;

  const [location, setLocation] = useState(customer.locations?.[0] ?? '');
  const [email, setEmail]       = useState('');
  const [date, setDate]         = useState('');
  const [extra, setExtra]       = useState('');
  const [status, setStatus]     = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errMsg, setErrMsg]     = useState('');

  // Resolve the catalog for the selected location (or the default catalog)
  const catalog: ItemGroup[] = useMemo(() => {
    if (customer.catalogByLocation && location && customer.catalogByLocation[location]) {
      return customer.catalogByLocation[location];
    }
    return customer.catalog ?? [];
  }, [customer, location]);

  // Quantities keyed by "groupIdx-itemIdx"
  const [quantities, setQuantities] = useState<Record<string, number>>({});

  const setQty = (key: string, value: number) => {
    setQuantities(prev => ({ ...prev, [key]: Math.max(0, value) }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    setErrMsg('');

    // Build the list of ordered items (qty > 0 only), tagged with their category
    const orderedItems: { name: string; quantity: number; category: string }[] = [];
    catalog.forEach((group, gi) => {
      const category = group.heading ?? 'Items';
      group.items.forEach((name, ii) => {
        const qty = quantities[itemKey(gi, ii)] ?? 0;
        if (qty > 0) orderedItems.push({ name, quantity: qty, category });
      });
    });

    if (orderedItems.length === 0 && !extra.trim()) {
      setErrMsg('Please enter a quantity for at least one item, or describe what you need below.');
      setStatus('error');
      return;
    }

    const subject = hasLocations
      ? `Wholesale Order — ${customer.name} / ${location}`
      : `Wholesale Order — ${customer.name}`;

    try {
      const res = await fetch(LAMBDA_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'wholesale',
          subject,
          customerName: customer.name,
          location: hasLocations ? location : null,
          email,
          deliveryDate: date,
          items: orderedItems,
          additionalItems: extra,
        }),
      });
      if (!res.ok) throw new Error(`Server error ${res.status}`);
      setStatus('success');
    } catch (err) {
      setStatus('error');
      setErrMsg(err instanceof Error ? err.message : 'Something went wrong. Please call us.');
    }
  };

  if (status === 'success') {
    return (
      <div className="text-center py-20 max-w-lg mx-auto px-4">
        <h2 className="font-display text-4xl font-bold text-chocolate mb-3">Order Submitted!</h2>
        <p className="font-body text-chocolate/70 mb-2">
          A confirmation was sent to <strong>{email}</strong>.
        </p>
        <p className="font-body text-chocolate/50 text-sm mb-8">
          Delivery requested for {date}.
        </p>
        <button
          onClick={() => {
            setStatus('idle');
            setQuantities({});
            setEmail('');
            setDate('');
            setExtra('');
          }}
          className="btn-primary"
        >
          Place Another Order
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-6">

      {/* Header */}
      <div className="bg-chocolate text-white rounded-2xl px-6 py-4 flex items-center gap-4">
        <div>
          <div className="font-display font-bold text-lg">{customer.name}</div>
          {hasLocations && <div className="text-cream-200 text-sm">Select your location below</div>}
        </div>
      </div>

      {customer.orderNote && (
        <div className="bg-cream-100 border border-cream-300 rounded-2xl px-5 py-3 font-body text-sm text-chocolate/80">
          {customer.orderNote}
        </div>
      )}

      {/* Order details */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-cream-200 space-y-5">
        {hasLocations && (
          <div>
            <label className="form-label">Which location is ordering? *</label>
            <select
              required
              value={location}
              onChange={e => setLocation(e.target.value)}
              className="form-input"
            >
              {customer.locations!.map(loc => <option key={loc}>{loc}</option>)}
            </select>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="form-label">
              Email * <span className="normal-case font-normal text-chocolate/40">(confirmation sent here)</span>
            </label>
            <input
              type="email" required value={email}
              onChange={e => setEmail(e.target.value)}
              className="form-input" placeholder="you@yourbusiness.com"
            />
          </div>
          <div>
            <label className="form-label">
              Date * <span className="normal-case font-normal text-chocolate/40">(min {leadDays} days)</span>
            </label>
            <input
              type="date" required value={date}
              min={minDate(leadDays)}
              onChange={e => setDate(e.target.value)}
              className="form-input"
            />
          </div>
        </div>
      </div>

      {/* Item groups */}
      {catalog.map((group, gi) => (
        <div key={gi} className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-cream-200">
          {group.heading && (
            <h2 className="font-display font-bold text-chocolate text-xl mb-5">{group.heading}</h2>
          )}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {group.items.map((name, ii) => {
              const key = itemKey(gi, ii);
              return (
                <div key={key}>
                  <label className="font-body text-sm font-bold text-chocolate block mb-1.5 leading-snug">
                    {name}
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={999}
                    inputMode="numeric"
                    value={quantities[key] ?? ''}
                    placeholder="0"
                    onChange={e => {
                      const v = e.target.value;
                      setQty(key, v === '' ? 0 : parseInt(v) || 0);
                    }}
                    className="form-input text-center"
                  />
                </div>
              );
            })}
          </div>
        </div>
      ))}

      {/* Additional items */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-cream-200">
        <label className="form-label mb-2 block">
          Want to order anything not on this list? Specify below:
        </label>
        <textarea
          value={extra}
          onChange={e => setExtra(e.target.value)}
          rows={3}
          className="form-input resize-none"
          placeholder="Item name, quantity, or any other details…"
        />
      </div>

      {status === 'error' && (
        <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 text-rose-700 font-body text-sm">
          {errMsg}
        </div>
      )}

      <button
        type="submit"
        disabled={status === 'submitting'}
        className="btn-primary w-full justify-center text-lg py-4 disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {status === 'submitting'
          ? <>Submitting…</>
          : <>Submit Order</>}
      </button>

      <p className="text-center text-xs text-chocolate/50 font-body pb-4">
        A confirmation will be sent to your email. Minimum {leadDays}-day lead time required.
      </p>
    </form>
  );
}

// ─────────────────────────────────────────────────────────────
//  AUTH SCREEN
// ─────────────────────────────────────────────────────────────
function AuthScreen({ onAuth }: { onAuth: (customer: CustomerConfig) => void }) {
  const [password, setPassword]         = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [status, setStatus]             = useState<'idle' | 'checking' | 'error'>('idle');
  const [csrfToken, setCsrfToken]       = useState<string | null>(null);
  const [tokenLoading, setTokenLoading] = useState(true);

  // Fetch a CSRF token on mount (and once only, even under Strict Mode)
  useEffect(() => {
    let cancelled = false;

    fetch(PHP_AUTH_URL, { method: 'GET', credentials: 'include' })
      .then(res => res.json())
      .then(data => {
        if (!cancelled) {
          setCsrfToken(data.csrfToken ?? null);
          setTokenLoading(false);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setCsrfToken(null);
          setTokenLoading(false);
        }
      });

    return () => { cancelled = true; };
  }, []);

  const handleAuth = async (e: FormEvent) => {
    e.preventDefault();

    if (!csrfToken) {
      setStatus('error');
      return;
    }

    setStatus('checking');

    try {
      const res = await fetch(PHP_AUTH_URL, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password, csrfToken }),
      });
      const data = await res.json();

      if (data.success && data.customerId) {
        const { getCustomerById } = await import('../wholesale/registry');
        const customer = getCustomerById(data.customerId);
        if (customer) { onAuth(customer); return; }
      }

      // Refresh the CSRF token after any failed attempt — the server
      // rotates it on success, and we want a fresh one ready either way.
      try {
        const refreshRes = await fetch(PHP_AUTH_URL, { method: 'GET', credentials: 'include' });
        const refreshData = await refreshRes.json();
        setCsrfToken(refreshData.csrfToken ?? null);
      } catch {
        setCsrfToken(null);
      }

      setStatus('error');
      setPassword('');
    } catch {
      setStatus('error');
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <div className="bg-white rounded-3xl p-10 shadow-lg border border-cream-200 text-center">
        <h2 className="font-display text-3xl font-bold text-chocolate mb-2">Wholesale Portal</h2>
        <p className="font-body text-chocolate/55 text-sm mb-8 leading-relaxed">
          Authorized partners only. Enter your account password to access your order form.
        </p>

        <form onSubmit={handleAuth} className="space-y-4 text-left">
          <div>
            <label className="form-label">Account Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={e => { setPassword(e.target.value); setStatus('idle'); }}
                className="form-input pr-16"
                placeholder="Enter your password"
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(v => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-chocolate/40 hover:text-chocolate/80 transition-colors text-xs font-bold uppercase tracking-wide"
                aria-label="Toggle visibility"
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>

          {status === 'error' && (
            <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 text-rose-700 text-sm font-body">
              Incorrect password. <a href="/contact" className="underline">Contact us</a> if you need help.
            </div>
          )}

          <button
            type="submit"
            disabled={status === 'checking' || !password || tokenLoading}
            className="btn-primary w-full justify-center disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {status === 'checking'
              ? <>Verifying…</>
              : 'Access My Order Form'}
          </button>
        </form>

        <p className="text-xs text-chocolate/40 mt-7 font-body">
          Not a partner? <a href="/contact" className="text-strawberry hover:underline">Contact us</a> to get set up.
        </p>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
//  ROOT
// ─────────────────────────────────────────────────────────────
export default function WholesalePortal() {
  const [customer, setCustomer] = useState<CustomerConfig | null>(null);
  return customer
    ? <WholesaleOrderForm customer={customer} />
    : <AuthScreen onAuth={setCustomer} />;
}