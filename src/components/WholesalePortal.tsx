import { useState, type FormEvent } from 'react';
import type {
  CustomerConfig,
  ProductCategory,
  QuartCategory,
  TubCategory,
  PieCategory,
  CakeCategory,
  UfoCategory,
  SorbetCategory,
  MixCategory,
  GenericCategory,
} from './wholesale/types';

// ─────────────────────────────────────────────────────────────
//  CONFIG  — update these two URLs before deploying
// ─────────────────────────────────────────────────────────────
const LAMBDA_URL  = 'https://YOUR_LAMBDA_URL.amazonaws.com/prod/send-order';
const SHOP_EMAIL  = 'wholesale@yourdomain.com';   // fixed shop inbox for all wholesale orders
const PHP_AUTH_URL = 'https://yourdomain.com/wholesale-auth.php';

// ─────────────────────────────────────────────────────────────
//  ORDER LINE TYPE
// ─────────────────────────────────────────────────────────────
interface OrderLine {
  categoryLabel: string;
  categoryType: string;
  description: string;
  quantity: number;
  flavor?: string;
  size?: string;
  cookie?: string;
  item?: string;
}

// ─────────────────────────────────────────────────────────────
//  HELPERS
// ─────────────────────────────────────────────────────────────
function minDate(days: number): string {
  return new Date(Date.now() + days * 86400000).toISOString().split('T')[0];
}

function buildEmailSummary(
  customer: CustomerConfig,
  location: string,
  email: string,
  deliveryDate: string,
  lines: OrderLine[],
  notes: string,
): string {
  const showLocation = customer.locations.length > 1;
  const header = [
    'WHOLESALE ORDER',
    `Customer: ${customer.name}`,
    showLocation ? `Location: ${location}` : '',
    `Email: ${email}`,
    `Delivery Date: ${deliveryDate}`,
    '',
  ].filter(Boolean).join('\n');

  const grouped = lines.reduce<Record<string, OrderLine[]>>((acc, line) => {
    acc[line.categoryLabel] = acc[line.categoryLabel] ?? [];
    acc[line.categoryLabel].push(line);
    return acc;
  }, {});

  const body = Object.entries(grouped)
    .map(([cat, catLines]) =>
      `${cat}:\n${catLines.map(l => `  • ${l.description} × ${l.quantity}`).join('\n')}`
    ).join('\n\n');

  return `${header}${body}${notes ? `\n\nNotes: ${notes}` : ''}`;
}

// ─────────────────────────────────────────────────────────────
//  SHARED UI PIECES
// ─────────────────────────────────────────────────────────────
function LineRow({ line, onRemove }: { line: OrderLine; onRemove: () => void }) {
  return (
    <div className="flex items-center justify-between bg-white rounded-xl px-4 py-2.5 border border-cream-200 gap-3">
      <span className="font-body text-sm text-chocolate flex-1">{line.description}</span>
      <div className="flex items-center gap-3 flex-shrink-0">
        <span className="font-display font-bold text-chocolate text-sm">× {line.quantity}</span>
        <button type="button" onClick={onRemove}
          className="text-rose-300 hover:text-rose-500 font-bold text-xs px-1.5 py-0.5 rounded hover:bg-rose-50 transition-colors">✕</button>
      </div>
    </div>
  );
}

function AddBtn({ onClick }: { onClick: () => void }) {
  return (
    <button type="button" onClick={onClick}
      className="mt-3 px-5 py-2.5 bg-strawberry text-white font-body font-bold text-sm rounded-xl hover:bg-rose-600 transition-colors">
      Add
    </button>
  );
}

function QtyInput({ value, onChange }: { value: number; onChange: (n: number) => void }) {
  return (
    <div className="w-24">
      <label className="form-label">Qty</label>
      <input type="number" min={1} max={999} value={value}
        onChange={e => onChange(Math.max(1, parseInt(e.target.value) || 1))}
        className="form-input" />
    </div>
  );
}

interface SectionProps {
  lines: OrderLine[];
  onAdd: (line: OrderLine) => void;
  onRemove: (idx: number) => void;
}

// ─────────────────────────────────────────────────────────────
//  CATEGORY SECTIONS  (one per product type)
// ─────────────────────────────────────────────────────────────
function QuartsSection({ cat, lines, onAdd, onRemove }: { cat: QuartCategory } & SectionProps) {
  const [flavor, setFlavor] = useState(cat.flavors[0] ?? '');
  const [qty, setQty] = useState(1);
  return (
    <div className="space-y-2">
      {lines.map((l, i) => <LineRow key={i} line={l} onRemove={() => onRemove(i)} />)}
      <div className="flex gap-3 items-end flex-wrap">
        <div className="flex-1 min-w-[180px]">
          <label className="form-label">Flavor</label>
          <select value={flavor} onChange={e => setFlavor(e.target.value)} className="form-input">
            {cat.flavors.map(f => <option key={f}>{f}</option>)}
          </select>
        </div>
        <QtyInput value={qty} onChange={setQty} />
        <AddBtn onClick={() => { onAdd({ categoryLabel: cat.label, categoryType: 'quarts', description: flavor, flavor, quantity: qty }); setQty(1); }} />
      </div>
    </div>
  );
}

function TubsSection({ cat, lines, onAdd, onRemove }: { cat: TubCategory } & SectionProps) {
  const [flavor, setFlavor] = useState(cat.flavors[0] ?? '');
  const [size, setSize] = useState(cat.sizes[0] ?? '');
  const [qty, setQty] = useState(1);
  return (
    <div className="space-y-2">
      {lines.map((l, i) => <LineRow key={i} line={l} onRemove={() => onRemove(i)} />)}
      <div className="flex gap-3 items-end flex-wrap">
        <div className="flex-1 min-w-[180px]">
          <label className="form-label">Flavor</label>
          <select value={flavor} onChange={e => setFlavor(e.target.value)} className="form-input">
            {cat.flavors.map(f => <option key={f}>{f}</option>)}
          </select>
        </div>
        <div className="w-36">
          <label className="form-label">Size</label>
          <select value={size} onChange={e => setSize(e.target.value)} className="form-input">
            {cat.sizes.map(s => <option key={s}>{s}</option>)}
          </select>
        </div>
        <QtyInput value={qty} onChange={setQty} />
        <AddBtn onClick={() => { onAdd({ categoryLabel: cat.label, categoryType: 'tubs', description: `${flavor} — ${size}`, flavor, size, quantity: qty }); setQty(1); }} />
      </div>
    </div>
  );
}

function PiesSection({ cat, lines, onAdd, onRemove }: { cat: PieCategory } & SectionProps) {
  const [flavor, setFlavor] = useState(cat.flavors[0] ?? '');
  const [size, setSize] = useState(cat.sizes[0] ?? '');
  const [qty, setQty] = useState(1);
  return (
    <div className="space-y-2">
      {lines.map((l, i) => <LineRow key={i} line={l} onRemove={() => onRemove(i)} />)}
      <div className="flex gap-3 items-end flex-wrap">
        <div className="flex-1 min-w-[180px]">
          <label className="form-label">Flavor</label>
          <select value={flavor} onChange={e => setFlavor(e.target.value)} className="form-input">
            {cat.flavors.map(f => <option key={f}>{f}</option>)}
          </select>
        </div>
        <div className="w-28">
          <label className="form-label">Size</label>
          <select value={size} onChange={e => setSize(e.target.value)} className="form-input">
            {cat.sizes.map(s => <option key={s}>{s}</option>)}
          </select>
        </div>
        <QtyInput value={qty} onChange={setQty} />
        <AddBtn onClick={() => { onAdd({ categoryLabel: cat.label, categoryType: 'pies', description: `${flavor} — ${size}`, flavor, size, quantity: qty }); setQty(1); }} />
      </div>
    </div>
  );
}

function CakesSection({ cat, lines, onAdd, onRemove }: { cat: CakeCategory } & SectionProps) {
  const [flavor, setFlavor] = useState(cat.flavors[0] ?? '');
  const [size, setSize] = useState(cat.sizes[0] ?? '');
  const [qty, setQty] = useState(1);
  return (
    <div className="space-y-2">
      {lines.map((l, i) => <LineRow key={i} line={l} onRemove={() => onRemove(i)} />)}
      <div className="flex gap-3 items-end flex-wrap">
        <div className="flex-1 min-w-[180px]">
          <label className="form-label">Flavor</label>
          <select value={flavor} onChange={e => setFlavor(e.target.value)} className="form-input">
            {cat.flavors.map(f => <option key={f}>{f}</option>)}
          </select>
        </div>
        <div className="w-40">
          <label className="form-label">Size</label>
          <select value={size} onChange={e => setSize(e.target.value)} className="form-input">
            {cat.sizes.map(s => <option key={s}>{s}</option>)}
          </select>
        </div>
        <QtyInput value={qty} onChange={setQty} />
        <AddBtn onClick={() => { onAdd({ categoryLabel: cat.label, categoryType: 'cakes', description: `${flavor} — ${size}`, flavor, size, quantity: qty }); setQty(1); }} />
      </div>
    </div>
  );
}

function UfosSection({ cat, lines, onAdd, onRemove }: { cat: UfoCategory } & SectionProps) {
  const [flavor, setFlavor] = useState(cat.flavors[0] ?? '');
  const [cookie, setCookie] = useState(cat.cookies[0] ?? '');
  const [qty, setQty] = useState(1);
  return (
    <div className="space-y-2">
      {lines.map((l, i) => <LineRow key={i} line={l} onRemove={() => onRemove(i)} />)}
      <div className="flex gap-3 items-end flex-wrap">
        <div className="flex-1 min-w-[140px]">
          <label className="form-label">Flavor</label>
          <select value={flavor} onChange={e => setFlavor(e.target.value)} className="form-input">
            {cat.flavors.map(f => <option key={f}>{f}</option>)}
          </select>
        </div>
        <div className="flex-1 min-w-[160px]">
          <label className="form-label">Cookie</label>
          <select value={cookie} onChange={e => setCookie(e.target.value)} className="form-input">
            {cat.cookies.map(c => <option key={c}>{c}</option>)}
          </select>
        </div>
        <QtyInput value={qty} onChange={setQty} />
        <AddBtn onClick={() => { onAdd({ categoryLabel: cat.label, categoryType: 'ufos', description: `${flavor} / ${cookie}`, flavor, cookie, quantity: qty }); setQty(1); }} />
      </div>
    </div>
  );
}

function SorbetSection({ cat, lines, onAdd, onRemove }: { cat: SorbetCategory } & SectionProps) {
  const [flavor, setFlavor] = useState(cat.flavors[0] ?? '');
  const [size, setSize] = useState(cat.sizes[0] ?? '');
  const [qty, setQty] = useState(1);
  return (
    <div className="space-y-2">
      {lines.map((l, i) => <LineRow key={i} line={l} onRemove={() => onRemove(i)} />)}
      <div className="flex gap-3 items-end flex-wrap">
        <div className="flex-1 min-w-[180px]">
          <label className="form-label">Flavor</label>
          <select value={flavor} onChange={e => setFlavor(e.target.value)} className="form-input">
            {cat.flavors.map(f => <option key={f}>{f}</option>)}
          </select>
        </div>
        <div className="w-32">
          <label className="form-label">Size</label>
          <select value={size} onChange={e => setSize(e.target.value)} className="form-input">
            {cat.sizes.map(s => <option key={s}>{s}</option>)}
          </select>
        </div>
        <QtyInput value={qty} onChange={setQty} />
        <AddBtn onClick={() => { onAdd({ categoryLabel: cat.label, categoryType: 'sorbet', description: `${flavor} — ${size}`, flavor, size, quantity: qty }); setQty(1); }} />
      </div>
    </div>
  );
}

function MixesSection({ cat, lines, onAdd, onRemove }: { cat: MixCategory } & SectionProps) {
  const [item, setItem] = useState(cat.items[0] ?? '');
  const [qty, setQty] = useState(1);
  return (
    <div className="space-y-2">
      {lines.map((l, i) => <LineRow key={i} line={l} onRemove={() => onRemove(i)} />)}
      <div className="flex gap-3 items-end flex-wrap">
        <div className="flex-1 min-w-[200px]">
          <label className="form-label">Item</label>
          <select value={item} onChange={e => setItem(e.target.value)} className="form-input">
            {cat.items.map(it => <option key={it}>{it}</option>)}
          </select>
        </div>
        <QtyInput value={qty} onChange={setQty} />
        <AddBtn onClick={() => { onAdd({ categoryLabel: cat.label, categoryType: 'mixes', description: item, item, quantity: qty }); setQty(1); }} />
      </div>
    </div>
  );
}

function GenericSection({ cat, lines, onAdd, onRemove }: { cat: GenericCategory } & SectionProps) {
  const [item, setItem] = useState(cat.items[0] ?? '');
  const [qty, setQty] = useState(1);
  return (
    <div className="space-y-2">
      {lines.map((l, i) => <LineRow key={i} line={l} onRemove={() => onRemove(i)} />)}
      <div className="flex gap-3 items-end flex-wrap">
        <div className="flex-1 min-w-[200px]">
          <label className="form-label">Item</label>
          <select value={item} onChange={e => setItem(e.target.value)} className="form-input">
            {cat.items.map(it => <option key={it}>{it}</option>)}
          </select>
        </div>
        <QtyInput value={qty} onChange={setQty} />
        <AddBtn onClick={() => { onAdd({ categoryLabel: cat.label, categoryType: 'generic', description: item, item, quantity: qty }); setQty(1); }} />
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
//  CATEGORY CARD WRAPPER
// ─────────────────────────────────────────────────────────────
const CAT_STYLE: Record<string, { color: string; border: string; emoji: string }> = {
  quarts:  { color: 'bg-sky-50',    border: 'border-sky-200',    emoji: '🍦' },
  tubs:    { color: 'bg-amber-50',  border: 'border-amber-200',  emoji: '🪣' },
  pies:    { color: 'bg-orange-50', border: 'border-orange-200', emoji: '🥧' },
  cakes:   { color: 'bg-rose-50',   border: 'border-rose-200',   emoji: '🎂' },
  ufos:    { color: 'bg-purple-50', border: 'border-purple-200', emoji: '🛸' },
  sorbet:  { color: 'bg-green-50',  border: 'border-green-200',  emoji: '🍧' },
  mixes:   { color: 'bg-indigo-50', border: 'border-indigo-200', emoji: '🥤' },
  generic: { color: 'bg-cream-50',  border: 'border-cream-200',  emoji: '📦' },
};

function CategoryCard({
  cat, catIndex, allLines, onAdd, onRemove,
}: {
  cat: ProductCategory; catIndex: number;
  allLines: OrderLine[];
  onAdd: (line: OrderLine) => void;
  onRemove: (globalIdx: number) => void;
}) {
  const style = CAT_STYLE[cat.type] ?? CAT_STYLE.generic;

  // Map global indices for this category's lines
  const catEntries = allLines
    .map((l, gi) => ({ l, gi }))
    .filter(({ l }) => l.categoryLabel === cat.label);

  const catLines   = catEntries.map(e => e.l);
  const globalIdxs = catEntries.map(e => e.gi);

  const props: SectionProps = {
    lines: catLines,
    onAdd,
    onRemove: (localIdx: number) => onRemove(globalIdxs[localIdx]),
  };

  return (
    <div className={`rounded-2xl border-2 ${style.border} overflow-hidden`}>
      <div className={`flex items-center gap-2 px-5 py-3 ${style.color} border-b ${style.border}`}>
        <span className="text-xl">{style.emoji}</span>
        <span className="font-display font-bold text-chocolate">{cat.label}</span>
        {catLines.length > 0 && (
          <span className="ml-auto font-body text-xs text-chocolate/50 font-bold">
            {catLines.length} line{catLines.length !== 1 ? 's' : ''}
          </span>
        )}
      </div>
      <div className="p-5 bg-white/70">
        {cat.type === 'quarts'  && <QuartsSection  cat={cat as QuartCategory}   {...props} />}
        {cat.type === 'tubs'    && <TubsSection    cat={cat as TubCategory}     {...props} />}
        {cat.type === 'pies'    && <PiesSection    cat={cat as PieCategory}     {...props} />}
        {cat.type === 'cakes'   && <CakesSection   cat={cat as CakeCategory}    {...props} />}
        {cat.type === 'ufos'    && <UfosSection    cat={cat as UfoCategory}     {...props} />}
        {cat.type === 'sorbet'  && <SorbetSection  cat={cat as SorbetCategory}  {...props} />}
        {cat.type === 'mixes'   && <MixesSection   cat={cat as MixCategory}     {...props} />}
        {cat.type === 'generic' && <GenericSection cat={cat as GenericCategory} {...props} />}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
//  ORDER FORM
// ─────────────────────────────────────────────────────────────
function WholesaleOrderForm({ customer }: { customer: CustomerConfig }) {
  const multiLoc   = customer.locations.length > 1;
  const leadDays   = customer.leadTimeDays ?? 3;

  const [location,     setLocation]     = useState(customer.locations[0]);
  const [email,        setEmail]        = useState('');
  const [deliveryDate, setDeliveryDate] = useState('');
  const [notes,        setNotes]        = useState('');
  const [lines,        setLines]        = useState<OrderLine[]>([]);
  const [status,       setStatus]       = useState<'idle'|'submitting'|'success'|'error'>('idle');
  const [errMsg,       setErrMsg]       = useState('');

  const addLine    = (line: OrderLine) => setLines(p => [...p, line]);
  const removeLine = (idx: number)     => setLines(p => p.filter((_, i) => i !== idx));

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (lines.length === 0) {
      setErrMsg('Please add at least one item before submitting.');
      setStatus('error');
      return;
    }
    setStatus('submitting');
    setErrMsg('');

    const subject = multiLoc
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
          location: multiLoc ? location : customer.name,
          email,
          deliveryDate,
          lines,
          notes,
          summary: buildEmailSummary(customer, location, email, deliveryDate, lines, notes),
          shopEmail: SHOP_EMAIL,
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
        <div className="text-7xl mb-6">✅</div>
        <h2 className="font-display text-4xl font-bold text-chocolate mb-3">Order Submitted!</h2>
        <p className="font-body text-chocolate/70 mb-2">
          A confirmation was sent to <strong>{email}</strong>.
        </p>
        <p className="font-body text-chocolate/50 text-sm mb-8">
          Delivery requested for {deliveryDate}.
        </p>
        <button
          onClick={() => {
            setStatus('idle');
            setLines([]);
            setEmail('');
            setDeliveryDate('');
            setNotes('');
            setLocation(customer.locations[0]);
          }}
          className="btn-primary"
        >
          Place Another Order
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-6">

      {/* Header badge */}
      <div className="bg-chocolate text-white rounded-2xl px-6 py-4 flex items-center gap-4">
        <span className="text-3xl">🏢</span>
        <div>
          <div className="font-display font-bold text-lg">{customer.name}</div>
          {multiLoc && <div className="text-cream-200 text-sm">Select your location below</div>}
        </div>
      </div>

      {/* Customer note */}
      {customer.orderNote && (
        <div className="bg-cream-100 border border-cream-300 rounded-2xl px-5 py-3 font-body text-sm text-chocolate/80">
          📌 {customer.orderNote}
        </div>
      )}

      {/* Order details */}
      <div className="bg-white rounded-3xl p-8 shadow-sm border border-cream-200 space-y-5">
        <h2 className="font-display font-bold text-chocolate text-xl flex items-center gap-2">
          <span>📋</span> Order Details
        </h2>

        {multiLoc && (
          <div>
            <label className="form-label">Location *</label>
            <select required value={location} onChange={e => setLocation(e.target.value)} className="form-input">
              {customer.locations.map(loc => <option key={loc}>{loc}</option>)}
            </select>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="form-label">
              Your Email * <span className="normal-case font-normal text-chocolate/40">(confirmation sent here)</span>
            </label>
            <input type="email" required value={email}
              onChange={e => setEmail(e.target.value)}
              className="form-input" placeholder="you@yourbusiness.com" />
          </div>
          <div>
            <label className="form-label">
              Delivery Date * <span className="normal-case font-normal text-chocolate/40">(min {leadDays} days)</span>
            </label>
            <input type="date" required value={deliveryDate}
              min={minDate(leadDays)}
              onChange={e => setDeliveryDate(e.target.value)}
              className="form-input" />
          </div>
        </div>
      </div>

      {/* Product categories */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <h2 className="font-display font-bold text-chocolate text-xl flex items-center gap-2">
            <span>🛒</span> Your Order
          </h2>
          <span className="font-body text-sm text-chocolate/50">
            {lines.length} item{lines.length !== 1 ? 's' : ''} added
          </span>
        </div>

        {customer.catalog.map((cat, i) => (
          <CategoryCard
            key={`${cat.type}-${i}`}
            cat={cat}
            catIndex={i}
            allLines={lines}
            onAdd={addLine}
            onRemove={removeLine}
          />
        ))}
      </div>

      {/* Order summary */}
      {lines.length > 0 && (
        <div className="bg-cream-50 border-2 border-cream-200 rounded-2xl p-5">
          <h3 className="font-display font-bold text-chocolate text-sm uppercase tracking-wider mb-3">
            Order Summary
          </h3>
          <div className="space-y-1.5">
            {lines.map((l, i) => (
              <div key={i} className="flex justify-between font-body text-sm text-chocolate/80">
                <span>{l.categoryLabel} — {l.description}</span>
                <span className="font-bold ml-4 flex-shrink-0">× {l.quantity}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Notes */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-cream-200">
        <label className="form-label mb-2 block">📝 Notes / Special Instructions</label>
        <textarea value={notes} onChange={e => setNotes(e.target.value)}
          rows={3} className="form-input resize-none"
          placeholder="Delivery instructions, substitutions, anything else…" />
      </div>

      {status === 'error' && (
        <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 text-rose-700 font-body text-sm">
          ⚠️ {errMsg}
        </div>
      )}

      <button type="submit" disabled={status === 'submitting'}
        className="btn-primary w-full justify-center text-lg py-4 disabled:opacity-60 disabled:cursor-not-allowed">
        {status === 'submitting'
          ? <><span className="animate-spin inline-block">⏳</span> Submitting…</>
          : <>📦 Submit Wholesale Order</>}
      </button>

      <p className="text-center text-xs text-chocolate/50 font-body pb-4">
        Confirmation sent to your email. Minimum {leadDays}-day lead time required.
      </p>
    </form>
  );
}

// ─────────────────────────────────────────────────────────────
//  AUTH SCREEN
// ─────────────────────────────────────────────────────────────
function AuthScreen({ onAuth }: { onAuth: (customer: CustomerConfig) => void }) {
  const [password,     setPassword]     = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [status,       setStatus]       = useState<'idle'|'checking'|'error'>('idle');

  const handleAuth = async (e: FormEvent) => {
    e.preventDefault();
    setStatus('checking');

    try {
      const res  = await fetch(PHP_AUTH_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();

      if (data.success && data.customerId) {
        const { getCustomerById } = await import('./wholesale/customers/registry');
        const customer = getCustomerById(data.customerId);
        if (customer) { onAuth(customer); return; }
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
        <div className="text-6xl mb-5">🔒</div>
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
                className="form-input pr-12"
                placeholder="Enter your password"
                autoComplete="current-password"
              />
              <button type="button" onClick={() => setShowPassword(v => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-chocolate/40 hover:text-chocolate/80 transition-colors"
                aria-label="Toggle visibility">
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          {status === 'error' && (
            <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 text-rose-700 text-sm font-body">
              ⚠️ Incorrect password. <a href="/contact" className="underline">Contact us</a> if you need help.
            </div>
          )}

          <button type="submit" disabled={status === 'checking' || !password}
            className="btn-primary w-full justify-center disabled:opacity-60 disabled:cursor-not-allowed">
            {status === 'checking'
              ? <><span className="animate-spin inline-block">⏳</span> Verifying…</>
              : '🔓 Access My Order Form'}
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