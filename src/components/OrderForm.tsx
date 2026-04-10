import { useState, type FormEvent } from 'react';

// ─── Types ───────────────────────────────────────────────
interface OrderItem {
  flavor: string;
  size: string;
  quantity: number;
  container: string;
}

interface FormData {
  name: string;
  email: string;
  phone: string;
  pickupDate: string;
  pickupTime: string;
  specialInstructions: string;
  items: OrderItem[];
}

// ─── Constants ───────────────────────────────────────────
const FLAVORS = [
  'Strawberry Fields', 'Midnight Chocolate', 'Mint Chip Madness',
  'Honey Lavender', 'Wild Blueberry', 'Peach Cobbler',
  'Matcha Dream', 'Birthday Cake', 'Vanilla Bean', 'Salted Caramel',
  'Lemon Sorbet', 'Mango Tango', 'Cookies & Cream', 'Pistachio Dream',
  'Butter Pecan', 'Seasonal Special',
];

const SIZES = [
  { label: 'Single Scoop', value: 'single', price: 4.50 },
  { label: 'Double Scoop', value: 'double', price: 6.50 },
  { label: 'Triple Scoop', value: 'triple', price: 8.50 },
  { label: 'Pint (16oz)', value: 'pint', price: 9.00 },
  { label: 'Quart (32oz)', value: 'quart', price: 16.00 },
];

const CONTAINERS = ['Waffle Cone', 'Sugar Cone', 'Cake Cone', 'Cup'];

const LAMBDA_URL = 'https://YOUR_LAMBDA_URL.amazonaws.com/prod/send-order';

// ─── Empty Item Factory ───────────────────────────────────
const newItem = (): OrderItem => ({
  flavor: FLAVORS[0],
  size: 'single',
  quantity: 1,
  container: 'Waffle Cone',
});

// ─── Component ───────────────────────────────────────────
export default function OrderForm() {
  const [form, setForm] = useState<FormData>({
    name: '', email: '', phone: '',
    pickupDate: '', pickupTime: '',
    specialInstructions: '',
    items: [newItem()],
  });

  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  // ── Item helpers ──────────────────────────────────────
  const addItem = () => {
    setForm(f => ({ ...f, items: [...f.items, newItem()] }));
  };

  const removeItem = (i: number) => {
    setForm(f => ({ ...f, items: f.items.filter((_, idx) => idx !== i) }));
  };

  const updateItem = (i: number, field: keyof OrderItem, value: string | number) => {
    setForm(f => {
      const items = [...f.items];
      items[i] = { ...items[i], [field]: value };
      return { ...f, items };
    });
  };

  // ── Price calc ────────────────────────────────────────
  const calcTotal = () => {
    return form.items.reduce((sum, item) => {
      const size = SIZES.find(s => s.value === item.size);
      return sum + (size?.price ?? 0) * item.quantity;
    }, 0).toFixed(2);
  };

  // ── Submit ────────────────────────────────────────────
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    setErrorMsg('');

    try {
      const res = await fetch(LAMBDA_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'retail',
          ...form,
          orderTotal: calcTotal(),
        }),
      });

      if (!res.ok) throw new Error(`Server responded with ${res.status}`);
      setStatus('success');
    } catch (err) {
      setStatus('error');
      setErrorMsg(err instanceof Error ? err.message : 'Something went wrong. Please try again or call us.');
    }
  };

  // ── Success screen ────────────────────────────────────
  if (status === 'success') {
    return (
      <div className="text-center py-20 px-4">
        <div className="text-7xl mb-6 animate-bounce">🎉</div>
        <h2 className="font-display text-4xl font-bold text-chocolate mb-4">Order Received!</h2>
        <p className="font-body text-chocolate/70 text-lg max-w-md mx-auto mb-8">
          A confirmation has been sent to <strong>{form.email}</strong>. We'll have your order ready at pickup. See you soon!
        </p>
        <button
          onClick={() => { setStatus('idle'); setForm({ name:'', email:'', phone:'', pickupDate:'', pickupTime:'', specialInstructions:'', items:[newItem()] }); }}
          className="btn-primary"
        >
          Place Another Order
        </button>
      </div>
    );
  }

  // ── Form ──────────────────────────────────────────────
  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-8">

      {/* Contact Info */}
      <div className="bg-white rounded-3xl p-8 shadow-sm border border-cream-200">
        <h2 className="font-display font-bold text-chocolate text-2xl mb-6 flex items-center gap-2">
          <span>👤</span> Your Information
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="sm:col-span-2">
            <label className="form-label">Full Name *</label>
            <input type="text" required value={form.name} onChange={e => setForm(f => ({...f, name: e.target.value}))}
              className="form-input" placeholder="Jane Smith" />
          </div>
          <div>
            <label className="form-label">Email Address *</label>
            <input type="email" required value={form.email} onChange={e => setForm(f => ({...f, email: e.target.value}))}
              className="form-input" placeholder="jane@example.com" />
          </div>
          <div>
            <label className="form-label">Phone Number</label>
            <input type="tel" value={form.phone} onChange={e => setForm(f => ({...f, phone: e.target.value}))}
              className="form-input" placeholder="(555) 000-0000" />
          </div>
        </div>
      </div>

      {/* Pickup Time */}
      <div className="bg-white rounded-3xl p-8 shadow-sm border border-cream-200">
        <h2 className="font-display font-bold text-chocolate text-2xl mb-6 flex items-center gap-2">
          <span>📅</span> Pickup Details
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="form-label">Pickup Date *</label>
            <input type="date" required value={form.pickupDate}
              min={new Date().toISOString().split('T')[0]}
              onChange={e => setForm(f => ({...f, pickupDate: e.target.value}))}
              className="form-input" />
          </div>
          <div>
            <label className="form-label">Pickup Time *</label>
            <select required value={form.pickupTime} onChange={e => setForm(f => ({...f, pickupTime: e.target.value}))} className="form-input">
              <option value="">Select a time...</option>
              {['11:00 AM','11:30 AM','12:00 PM','12:30 PM','1:00 PM','1:30 PM',
                '2:00 PM','2:30 PM','3:00 PM','3:30 PM','4:00 PM','4:30 PM',
                '5:00 PM','5:30 PM','6:00 PM','6:30 PM','7:00 PM','7:30 PM',
                '8:00 PM','8:30 PM'].map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Order Items */}
      <div className="bg-white rounded-3xl p-8 shadow-sm border border-cream-200">
        <h2 className="font-display font-bold text-chocolate text-2xl mb-6 flex items-center gap-2">
          <span>🍦</span> Your Order
        </h2>

        <div className="space-y-6">
          {form.items.map((item, i) => (
            <div key={i} className="bg-cream-50 rounded-2xl p-5 border border-cream-200 relative">
              {form.items.length > 1 && (
                <button type="button" onClick={() => removeItem(i)}
                  className="absolute top-3 right-3 text-rose-400 hover:text-rose-600 text-sm font-bold px-2 py-0.5 rounded-lg hover:bg-rose-50 transition-colors">
                  ✕ Remove
                </button>
              )}
              <div className="text-xs font-bold uppercase tracking-widest text-strawberry mb-4">Item {i + 1}</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="form-label">Flavor *</label>
                  <select required value={item.flavor} onChange={e => updateItem(i, 'flavor', e.target.value)} className="form-input">
                    {FLAVORS.map(f => <option key={f} value={f}>{f}</option>)}
                  </select>
                </div>
                <div>
                  <label className="form-label">Size *</label>
                  <select required value={item.size} onChange={e => updateItem(i, 'size', e.target.value)} className="form-input">
                    {SIZES.map(s => (
                      <option key={s.value} value={s.value}>{s.label} — ${s.price.toFixed(2)}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="form-label">Container</label>
                  <select value={item.container} onChange={e => updateItem(i, 'container', e.target.value)} className="form-input">
                    {CONTAINERS.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="form-label">Quantity *</label>
                  <input type="number" min="1" max="24" required value={item.quantity}
                    onChange={e => updateItem(i, 'quantity', parseInt(e.target.value) || 1)}
                    className="form-input" />
                </div>
                <div className="flex items-end">
                  <div className="bg-strawberry/10 text-strawberry font-display font-bold rounded-xl px-4 py-2 text-sm">
                    Subtotal: ${((SIZES.find(s => s.value === item.size)?.price ?? 0) * item.quantity).toFixed(2)}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <button type="button" onClick={addItem}
          className="mt-5 flex items-center gap-2 text-strawberry font-display font-semibold text-sm hover:text-rose-600 transition-colors">
          <span className="w-6 h-6 bg-strawberry/10 rounded-full flex items-center justify-center">+</span>
          Add Another Item
        </button>

        {/* Order Total */}
        <div className="mt-6 pt-6 border-t-2 border-dashed border-cream-300 flex items-center justify-between">
          <span className="font-display font-bold text-chocolate text-lg">Estimated Total</span>
          <span className="font-display font-bold text-strawberry text-2xl">${calcTotal()}</span>
        </div>
        <p className="text-xs text-chocolate/50 mt-2 font-body">Final total confirmed at pickup. Tax not included.</p>
      </div>

      {/* Special Instructions */}
      <div className="bg-white rounded-3xl p-8 shadow-sm border border-cream-200">
        <h2 className="font-display font-bold text-chocolate text-2xl mb-6 flex items-center gap-2">
          <span>📝</span> Special Instructions
        </h2>
        <textarea
          value={form.specialInstructions}
          onChange={e => setForm(f => ({...f, specialInstructions: e.target.value}))}
          rows={3}
          className="form-input resize-none"
          placeholder="Allergies, special requests, or anything else we should know..."
        />
      </div>

      {/* Error */}
      {status === 'error' && (
        <div className="bg-rose-50 border border-rose-200 rounded-2xl p-5 text-rose-700 font-body text-sm">
          ⚠️ {errorMsg || 'Something went wrong. Please call us at (555) 123-4567.'}
        </div>
      )}

      {/* Submit */}
      <button type="submit" disabled={status === 'submitting'}
        className="btn-primary w-full justify-center text-lg py-4 disabled:opacity-60 disabled:cursor-not-allowed">
        {status === 'submitting' ? (
          <><span className="animate-spin">🍦</span> Placing Order...</>
        ) : (
          <>🍦 Place Order</>
        )}
      </button>

      <p className="text-center text-xs text-chocolate/50 font-body">
        A confirmation email will be sent to your address. Orders must be placed at least 2 hours before pickup.
      </p>
    </form>
  );
}
