import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Trash2, Plus, Minus, Tag, X, ChevronRight } from 'lucide-react';
import Navbar from '@/app/components/app/Navbar';
import BottomNav from '@/app/components/app/BottomNav';
import { useCart } from '@/app/store/cartStore';
import { VALID_COUPONS } from '@/app/data/menuData';
import { toast, Toaster } from 'sonner';

const TIP_OPTIONS = [
  { percent: 0,  label: 'No Tip' },
  { percent: 5,  label: '5%' },
  { percent: 10, label: '10%' },
  { percent: 15, label: '15%' },
  { percent: 20, label: '20%' },
];

export default function CartPage() {
  const navigate = useNavigate();
  const {
    state, itemCount, subtotal, gst, serviceCharge,
    couponSavings, grandTotal, updateQuantity, removeItem,
    setCoupon, removeCoupon, setTip,
  } = useCart();

  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');
  const [selectedTip, setSelectedTip] = useState(0);

  const applyCoupon = () => {
    const code = couponInput.trim().toUpperCase();
    if (VALID_COUPONS[code]) {
      const { discount, label } = VALID_COUPONS[code];
      setCoupon(code, discount);
      setCouponError('');
      setCouponInput('');
      toast.success(`Coupon applied! ${label}`, { duration: 3000 });
    } else {
      setCouponError('Invalid coupon code. Try WELCOME20, TAP10, or FEAST15.');
    }
  };

  const handleTip = (percent: number) => {
    setSelectedTip(percent);
    const amount = Math.round(subtotal * percent / 100);
    setTip(amount, percent);
  };

  if (itemCount === 0) {
    return (
      <div className="min-h-screen flex flex-col" style={{ background: 'var(--app-bg)', fontFamily: 'var(--font-poppins)' }}>
        <Navbar title="My Cart" showBack showSearch={false} />
        <div className="flex-1 flex flex-col items-center justify-center px-6 text-center py-16">
          <div className="text-7xl mb-6" style={{ animation: 'float 3s ease-in-out infinite' }}>🛒</div>
          <h2 className="text-xl font-bold mb-2" style={{ color: 'var(--app-text)' }}>Your cart is empty</h2>
          <p className="text-sm mb-8" style={{ color: 'var(--app-text-muted)', fontFamily: 'var(--font-inter)', lineHeight: 1.6 }}>
            Looks like you haven't added anything yet. Explore our menu!
          </p>
          <button
            onClick={() => navigate('/app/menu')}
            className="px-8 py-3.5 rounded-2xl text-white font-bold"
            style={{ background: 'var(--brand-orange)', boxShadow: 'var(--app-shadow-orange)' }}
          >
            Browse Menu
          </button>
        </div>
        <BottomNav />
        <style>{`@keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }`}</style>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-36" style={{ background: 'var(--app-bg)', fontFamily: 'var(--font-poppins)' }}>
      <Toaster position="top-center" richColors />
      <Navbar title={`Cart (${itemCount})`} showBack showSearch={false} />

      <div className="px-4 pt-4 space-y-4">

        {/* Cart Items */}
        <div className="rounded-2xl overflow-hidden" style={{ background: 'white', boxShadow: 'var(--app-shadow)' }}>
          <div className="px-4 py-3 border-b" style={{ borderColor: '#F1F5F9' }}>
            <h2 className="text-sm font-bold" style={{ color: 'var(--app-text)' }}>
              🛍️ Order Items ({itemCount})
            </h2>
          </div>
          <div className="divide-y" style={{ borderColor: '#F1F5F9' }}>
            {state.items.map(item => (
              <div key={item.id} className="flex items-center gap-3 p-4">
                <div className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <span
                      className="w-3.5 h-3.5 flex-shrink-0 border-2 rounded-sm flex items-center justify-center"
                      style={{ borderColor: item.isVeg ? '#22C55E' : '#EF4444' }}
                    >
                      <span className="w-1.5 h-1.5 rounded-full" style={{ background: item.isVeg ? '#22C55E' : '#EF4444' }} />
                    </span>
                    <p className="text-sm font-semibold line-clamp-1" style={{ color: 'var(--app-text)' }}>
                      {item.name}
                    </p>
                  </div>
                  <p className="text-sm font-bold" style={{ color: 'var(--brand-orange)' }}>
                    ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                  </p>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <div className="flex items-center rounded-xl overflow-hidden" style={{ background: '#F8FAFC', border: '1.5px solid #E2E8F0' }}>
                    <button
                      onClick={() => {
                        if (item.quantity === 1) removeItem(item.id);
                        else updateQuantity(item.id, item.quantity - 1);
                      }}
                      className="w-7 h-7 flex items-center justify-center active:scale-90 transition-transform"
                    >
                      {item.quantity === 1
                        ? <Trash2 size={12} style={{ color: '#EF4444' }} />
                        : <Minus size={12} style={{ color: 'var(--app-text-muted)' }} />
                      }
                    </button>
                    <span className="text-xs font-bold min-w-[18px] text-center" style={{ color: 'var(--app-text)', fontFamily: 'var(--font-poppins)' }}>
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="w-7 h-7 flex items-center justify-center active:scale-90 transition-transform"
                    >
                      <Plus size={12} style={{ color: 'var(--brand-orange)' }} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Continue ordering */}
          <button
            onClick={() => navigate('/app/menu')}
            className="w-full flex items-center justify-center gap-2 py-3 border-t text-sm font-semibold"
            style={{ borderColor: '#F1F5F9', color: 'var(--brand-orange)', fontFamily: 'var(--font-poppins)' }}
          >
            + Add More Items
          </button>
        </div>

        {/* Coupon */}
        <div className="rounded-2xl overflow-hidden" style={{ background: 'white', boxShadow: 'var(--app-shadow)' }}>
          <div className="p-4">
            <h3 className="text-sm font-bold mb-3 flex items-center gap-2" style={{ color: 'var(--app-text)' }}>
              <Tag size={16} style={{ color: 'var(--brand-orange)' }} />
              Promo Code
            </h3>

            {state.couponCode ? (
              <div className="flex items-center justify-between p-3 rounded-xl" style={{ background: 'var(--brand-orange-light)', border: '1.5px dashed var(--brand-orange)' }}>
                <div>
                  <p className="text-sm font-bold" style={{ color: 'var(--brand-orange)' }}>{state.couponCode}</p>
                  <p className="text-xs" style={{ color: 'var(--app-text-muted)', fontFamily: 'var(--font-inter)' }}>
                    Saving ₹{couponSavings}
                  </p>
                </div>
                <button onClick={removeCoupon} className="p-1">
                  <X size={16} style={{ color: 'var(--brand-orange)' }} />
                </button>
              </div>
            ) : (
              <div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Enter code (try WELCOME20)"
                    value={couponInput}
                    onChange={e => { setCouponInput(e.target.value.toUpperCase()); setCouponError(''); }}
                    onKeyDown={e => e.key === 'Enter' && applyCoupon()}
                    className="flex-1 px-3 py-2.5 rounded-xl text-sm outline-none uppercase"
                    style={{
                      background: '#F8FAFC',
                      border: `1.5px solid ${couponError ? '#EF4444' : '#E2E8F0'}`,
                      color: 'var(--app-text)',
                      fontFamily: 'var(--font-inter)',
                    }}
                  />
                  <button
                    onClick={applyCoupon}
                    disabled={!couponInput}
                    className="px-4 py-2.5 rounded-xl text-sm font-bold text-white transition-all active:scale-95"
                    style={{
                      background: couponInput ? 'var(--brand-orange)' : '#E2E8F0',
                      fontFamily: 'var(--font-poppins)',
                    }}
                  >
                    Apply
                  </button>
                </div>
                {couponError && (
                  <p className="text-xs mt-1.5" style={{ color: '#EF4444', fontFamily: 'var(--font-inter)' }}>{couponError}</p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Tip */}
        <div className="rounded-2xl overflow-hidden" style={{ background: 'white', boxShadow: 'var(--app-shadow)' }}>
          <div className="p-4">
            <h3 className="text-sm font-bold mb-1" style={{ color: 'var(--app-text)' }}>💝 Tip Your Server</h3>
            <p className="text-xs mb-3" style={{ color: 'var(--app-text-muted)', fontFamily: 'var(--font-inter)' }}>
              100% goes to your server
            </p>
            <div className="flex gap-2 flex-wrap">
              {TIP_OPTIONS.map(opt => (
                <button
                  key={opt.percent}
                  onClick={() => handleTip(opt.percent)}
                  className="flex-1 min-w-[60px] py-2 rounded-xl text-xs font-semibold transition-all active:scale-95"
                  style={{
                    background: selectedTip === opt.percent ? 'var(--brand-orange)' : '#F8FAFC',
                    color: selectedTip === opt.percent ? 'white' : 'var(--app-text-muted)',
                    border: `1.5px solid ${selectedTip === opt.percent ? 'var(--brand-orange)' : '#E2E8F0'}`,
                    fontFamily: 'var(--font-poppins)',
                  }}
                >
                  {opt.label}
                  {opt.percent > 0 && (
                    <span className="block text-[9px] mt-0.5 opacity-80">
                      ₹{Math.round(subtotal * opt.percent / 100)}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Bill Summary */}
        <div className="rounded-2xl overflow-hidden" style={{ background: 'white', boxShadow: 'var(--app-shadow)' }}>
          <div className="px-4 py-3 border-b" style={{ borderColor: '#F1F5F9' }}>
            <h3 className="text-sm font-bold" style={{ color: 'var(--app-text)' }}>🧾 Bill Summary</h3>
          </div>
          <div className="p-4 space-y-3">
            {[
              { label: 'Subtotal', val: subtotal },
              { label: 'GST (5%)', val: gst },
              { label: 'Service Charge (10%)', val: serviceCharge },
              ...(state.tipAmount > 0 ? [{ label: 'Tip', val: state.tipAmount }] : []),
              ...(couponSavings > 0 ? [{ label: `Coupon (${state.couponCode})`, val: -couponSavings }] : []),
            ].map(row => (
              <div key={row.label} className="flex items-center justify-between">
                <span className="text-sm" style={{ color: 'var(--app-text-muted)', fontFamily: 'var(--font-inter)' }}>
                  {row.label}
                </span>
                <span
                  className="text-sm font-medium"
                  style={{ color: row.val < 0 ? '#22C55E' : 'var(--app-text)', fontFamily: 'var(--font-inter)' }}
                >
                  {row.val < 0 ? '-' : ''}₹{Math.abs(row.val).toLocaleString('en-IN')}
                </span>
              </div>
            ))}
            <div className="border-t pt-3 flex items-center justify-between" style={{ borderColor: '#F1F5F9' }}>
              <span className="text-base font-bold" style={{ color: 'var(--app-text)', fontFamily: 'var(--font-poppins)' }}>
                Total
              </span>
              <span className="text-lg font-bold" style={{ color: 'var(--brand-orange)', fontFamily: 'var(--font-poppins)' }}>
                ₹{grandTotal.toLocaleString('en-IN')}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Checkout button */}
      <div
        className="fixed bottom-16 left-0 right-0 px-4 pb-3 pt-2"
        style={{ background: 'rgba(250,250,250,0.97)', backdropFilter: 'blur(8px)' }}
      >
        <button
          onClick={() => navigate('/app/checkout')}
          className="w-full flex items-center justify-between px-6 py-4 rounded-2xl text-white font-bold transition-all active:scale-[0.98]"
          style={{
            background: 'linear-gradient(135deg, var(--brand-orange) 0%, var(--brand-orange-dark) 100%)',
            boxShadow: 'var(--app-shadow-orange)',
            fontFamily: 'var(--font-poppins)',
          }}
        >
          <span>Proceed to Checkout</span>
          <div className="flex items-center gap-1">
            <span>₹{grandTotal.toLocaleString('en-IN')}</span>
            <ChevronRight size={18} />
          </div>
        </button>
      </div>

      <BottomNav />
    </div>
  );
}
