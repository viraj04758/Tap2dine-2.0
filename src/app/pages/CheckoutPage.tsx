import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Check, CreditCard, Smartphone, Banknote, Wallet, ChevronRight, Lock } from 'lucide-react';
import Navbar from '@/app/components/app/Navbar';
import BottomNav from '@/app/components/app/BottomNav';
import { useCart } from '@/app/store/cartStore';
import { useOrder } from '@/app/store/orderStore';
import { Toaster } from 'sonner';

const STEPS = ['Menu', 'Cart', 'Checkout', 'Payment', 'Done'];

type PaymentMethod = 'upi' | 'card' | 'cash' | 'wallet';

const PAYMENT_METHODS: { id: PaymentMethod; label: string; desc: string; Icon: React.ElementType; color: string }[] = [
  { id: 'upi',    label: 'UPI',          desc: 'GPay, PhonePe, Paytm',     Icon: Smartphone,  color: '#7C3AED' },
  { id: 'card',   label: 'Card',         desc: 'Debit / Credit card',       Icon: CreditCard,  color: '#0EA5E9' },
  { id: 'cash',   label: 'Pay at Table', desc: 'Pay when served',           Icon: Banknote,    color: '#22C55E' },
  { id: 'wallet', label: 'Wallet',       desc: 'Tap2Dine wallet balance',   Icon: Wallet,      color: '#F59E0B' },
];

const UPI_APPS = [
  { id: 'gpay',    label: 'Google Pay',  emoji: '🇬' },
  { id: 'phonepe', label: 'PhonePe',     emoji: '💜' },
  { id: 'paytm',   label: 'Paytm',       emoji: '🔵' },
  { id: 'bhim',    label: 'BHIM',        emoji: '🏦' },
];

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { state, itemCount, subtotal, gst, serviceCharge, couponSavings, grandTotal, clearCart } = useCart();
  const { placeOrder, tableNumber } = useOrder();

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('upi');
  const [selectedUpi, setSelectedUpi] = useState('gpay');
  const [upiId, setUpiId] = useState('');
  const [notes, setNotes] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [step] = useState(2); // Checkout step

  if (itemCount === 0) {
    navigate('/app/menu');
    return null;
  }

  const handlePlaceOrder = async () => {
    setIsProcessing(true);

    // Simulate payment processing
    await new Promise(res => setTimeout(res, 1800));

    const order = placeOrder({
      tableNumber,
      items: state.items.map(i => ({
        id: i.id,
        name: i.name,
        quantity: i.quantity,
        price: i.price,
        isVeg: i.isVeg,
      })),
      total: grandTotal,
      estimatedTime: 25,
      specialInstructions: notes,
    });

    clearCart();
    navigate(`/app/confirmation/${order.id}`);
  };

  return (
    <div className="min-h-screen pb-36" style={{ background: 'var(--app-bg)', fontFamily: 'var(--font-poppins)' }}>
      <Toaster position="top-center" richColors />
      <Navbar title="Checkout" showBack showSearch={false} />

      {/* Progress Steps */}
      <div className="px-4 py-3 overflow-x-auto">
        <div className="flex items-center min-w-max mx-auto justify-center gap-0">
          {STEPS.map((s, i) => {
            const isDone = i < step;
            const isActive = i === step;
            return (
              <div key={s} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
                    style={{
                      background: isDone ? 'var(--app-success)' : isActive ? 'var(--brand-orange)' : '#E2E8F0',
                      color: isDone || isActive ? 'white' : '#94A3B8',
                      fontFamily: 'var(--font-poppins)',
                    }}
                  >
                    {isDone ? <Check size={14} /> : i + 1}
                  </div>
                  <span
                    className="text-[9px] mt-1 font-medium whitespace-nowrap"
                    style={{ color: isActive ? 'var(--brand-orange)' : isDone ? 'var(--app-success)' : '#94A3B8' }}
                  >
                    {s}
                  </span>
                </div>
                {i < STEPS.length - 1 && (
                  <div
                    className="w-8 h-0.5 mb-4 mx-1"
                    style={{ background: isDone ? 'var(--app-success)' : '#E2E8F0' }}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="px-4 space-y-4">

        {/* Table Info */}
        <div className="p-4 rounded-2xl flex items-center gap-3" style={{ background: 'white', boxShadow: 'var(--app-shadow)' }}>
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
            style={{ background: 'var(--brand-orange-light)' }}
          >
            🪑
          </div>
          <div className="flex-1">
            <p className="text-xs font-medium" style={{ color: 'var(--app-text-muted)', fontFamily: 'var(--font-inter)' }}>Dining at</p>
            <p className="text-base font-bold" style={{ color: 'var(--app-text)' }}>Table {tableNumber}</p>
          </div>
          <div className="text-right">
            <p className="text-xs" style={{ color: 'var(--app-text-muted)', fontFamily: 'var(--font-inter)' }}>Items</p>
            <p className="text-sm font-bold" style={{ color: 'var(--app-text)' }}>{itemCount}</p>
          </div>
        </div>

        {/* Payment Method */}
        <div className="rounded-2xl overflow-hidden" style={{ background: 'white', boxShadow: 'var(--app-shadow)' }}>
          <div className="px-4 py-3 border-b" style={{ borderColor: '#F1F5F9' }}>
            <h3 className="text-sm font-bold" style={{ color: 'var(--app-text)' }}>💳 Payment Method</h3>
          </div>
          <div className="p-3 grid grid-cols-2 gap-2">
            {PAYMENT_METHODS.map(pm => {
              const isSelected = paymentMethod === pm.id;
              return (
                <button
                  key={pm.id}
                  onClick={() => setPaymentMethod(pm.id)}
                  className="p-3 rounded-xl text-left transition-all active:scale-95"
                  style={{
                    background: isSelected ? `${pm.color}12` : '#FAFAFA',
                    border: `2px solid ${isSelected ? pm.color : '#F1F5F9'}`,
                  }}
                >
                  <pm.Icon size={20} style={{ color: pm.color }} />
                  <p className="text-sm font-semibold mt-2" style={{ color: 'var(--app-text)', fontFamily: 'var(--font-poppins)' }}>
                    {pm.label}
                  </p>
                  <p className="text-[10px] mt-0.5" style={{ color: 'var(--app-text-muted)', fontFamily: 'var(--font-inter)' }}>
                    {pm.desc}
                  </p>
                  {isSelected && (
                    <div
                      className="w-4 h-4 rounded-full flex items-center justify-center mt-2"
                      style={{ background: pm.color }}
                    >
                      <Check size={10} color="white" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* UPI sub-options */}
          {paymentMethod === 'upi' && (
            <div className="px-3 pb-3">
              <div className="grid grid-cols-4 gap-2 mb-3">
                {UPI_APPS.map(app => (
                  <button
                    key={app.id}
                    onClick={() => setSelectedUpi(app.id)}
                    className="flex flex-col items-center p-2 rounded-xl transition-all active:scale-95"
                    style={{
                      background: selectedUpi === app.id ? 'var(--brand-orange-light)' : '#FAFAFA',
                      border: `1.5px solid ${selectedUpi === app.id ? 'var(--brand-orange)' : '#F1F5F9'}`,
                    }}
                  >
                    <span className="text-xl mb-1">{app.emoji}</span>
                    <span className="text-[9px] font-medium" style={{ color: 'var(--app-text-muted)', fontFamily: 'var(--font-inter)' }}>
                      {app.label}
                    </span>
                  </button>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Or enter UPI ID (name@bank)"
                  value={upiId}
                  onChange={e => setUpiId(e.target.value)}
                  className="flex-1 px-3 py-2 rounded-xl text-sm outline-none"
                  style={{ background: '#F8FAFC', border: '1.5px solid #E2E8F0', color: 'var(--app-text)', fontFamily: 'var(--font-inter)' }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Order Summary */}
        <div className="rounded-2xl overflow-hidden" style={{ background: 'white', boxShadow: 'var(--app-shadow)' }}>
          <div className="px-4 py-3 border-b" style={{ borderColor: '#F1F5F9' }}>
            <h3 className="text-sm font-bold" style={{ color: 'var(--app-text)' }}>🧾 Order Summary</h3>
          </div>
          <div className="px-4 py-3 divide-y" style={{ borderColor: '#F1F5F9' }}>
            {state.items.map(item => (
              <div key={item.id} className="flex justify-between items-center py-2">
                <span className="text-sm" style={{ color: 'var(--app-text)', fontFamily: 'var(--font-inter)' }}>
                  {item.name} × {item.quantity}
                </span>
                <span className="text-sm font-semibold" style={{ color: 'var(--app-text)', fontFamily: 'var(--font-inter)' }}>
                  ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                </span>
              </div>
            ))}
          </div>
          <div className="px-4 py-3 space-y-2 border-t" style={{ borderColor: '#F1F5F9' }}>
            {[
              { label: 'Subtotal', val: subtotal },
              { label: 'GST (5%)', val: gst },
              { label: 'Service (10%)', val: serviceCharge },
              ...(couponSavings > 0 ? [{ label: 'Coupon Discount', val: -couponSavings }] : []),
              ...(state.tipAmount > 0 ? [{ label: `Tip (${state.tipPercent}%)`, val: state.tipAmount }] : []),
            ].map(row => (
              <div key={row.label} className="flex justify-between">
                <span className="text-xs" style={{ color: 'var(--app-text-muted)', fontFamily: 'var(--font-inter)' }}>{row.label}</span>
                <span className="text-xs font-medium" style={{ color: row.val < 0 ? '#22C55E' : 'var(--app-text)', fontFamily: 'var(--font-inter)' }}>
                  {row.val < 0 ? '-' : ''}₹{Math.abs(row.val).toLocaleString('en-IN')}
                </span>
              </div>
            ))}
            <div className="flex justify-between pt-2 border-t" style={{ borderColor: '#F1F5F9' }}>
              <span className="text-base font-bold" style={{ color: 'var(--app-text)', fontFamily: 'var(--font-poppins)' }}>Total</span>
              <span className="text-base font-bold" style={{ color: 'var(--brand-orange)', fontFamily: 'var(--font-poppins)' }}>
                ₹{grandTotal.toLocaleString('en-IN')}
              </span>
            </div>
          </div>
        </div>

        {/* Notes for kitchen */}
        <div className="rounded-2xl overflow-hidden" style={{ background: 'white', boxShadow: 'var(--app-shadow)' }}>
          <div className="p-4">
            <h3 className="text-sm font-bold mb-2" style={{ color: 'var(--app-text)' }}>
              📝 Notes for Kitchen <span style={{ color: 'var(--app-text-muted)', fontWeight: 400 }}>(optional)</span>
            </h3>
            <textarea
              rows={2}
              placeholder="Any special requests or dietary requirements..."
              value={notes}
              onChange={e => setNotes(e.target.value)}
              className="w-full px-3 py-2 rounded-xl text-sm resize-none outline-none"
              style={{ background: '#F8FAFC', border: '1.5px solid #E2E8F0', color: 'var(--app-text)', fontFamily: 'var(--font-inter)' }}
              onFocus={e => e.target.style.borderColor = 'var(--brand-orange)'}
              onBlur={e => e.target.style.borderColor = '#E2E8F0'}
            />
          </div>
        </div>

        {/* Secure note */}
        <div className="flex items-center justify-center gap-2 py-2">
          <Lock size={12} style={{ color: '#94A3B8' }} />
          <span className="text-xs" style={{ color: '#94A3B8', fontFamily: 'var(--font-inter)' }}>
            Your payment is secured by 256-bit encryption
          </span>
        </div>
      </div>

      {/* Place Order button */}
      <div
        className="fixed bottom-16 left-0 right-0 px-4 pb-3 pt-2"
        style={{ background: 'rgba(250,250,250,0.97)', backdropFilter: 'blur(8px)', borderTop: '1px solid #F1F5F9' }}
      >
        <button
          onClick={handlePlaceOrder}
          disabled={isProcessing}
          className="w-full flex items-center justify-between px-6 py-4 rounded-2xl text-white font-bold transition-all active:scale-[0.98]"
          style={{
            background: isProcessing
              ? 'linear-gradient(135deg, #94A3B8 0%, #64748B 100%)'
              : 'linear-gradient(135deg, var(--brand-orange) 0%, var(--brand-orange-dark) 100%)',
            boxShadow: isProcessing ? 'none' : 'var(--app-shadow-orange)',
            fontFamily: 'var(--font-poppins)',
          }}
        >
          {isProcessing ? (
            <div className="flex items-center gap-3 mx-auto">
              <div className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              <span>Processing Payment...</span>
            </div>
          ) : (
            <>
              <span>Place Order</span>
              <div className="flex items-center gap-1">
                <span>₹{grandTotal.toLocaleString('en-IN')}</span>
                <ChevronRight size={18} />
              </div>
            </>
          )}
        </button>
      </div>

      <BottomNav />
    </div>
  );
}
