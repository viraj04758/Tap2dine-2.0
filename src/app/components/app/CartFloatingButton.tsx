import { useNavigate } from 'react-router';
import { ShoppingCart, ArrowRight } from 'lucide-react';
import { useCart } from '@/app/store/cartStore';

export default function CartFloatingButton() {
  const navigate = useNavigate();
  const { itemCount, grandTotal } = useCart();

  if (itemCount === 0) return null;

  return (
    <div
      className="fixed bottom-20 left-0 right-0 z-40 px-4 pointer-events-none"
    >
      <div className="max-w-xl mx-auto">
        <button
          onClick={() => navigate('/app/cart')}
          className="w-full flex items-center justify-between px-5 py-3.5 rounded-2xl text-white pointer-events-auto transition-all active:scale-[0.98]"
          style={{
            background: 'linear-gradient(135deg, var(--brand-orange) 0%, var(--brand-orange-dark) 100%)',
            boxShadow: '0 8px 32px rgba(255, 107, 53, 0.45)',
          }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center"
              style={{ background: 'rgba(255,255,255,0.2)' }}
            >
              <span className="text-sm font-bold" style={{ fontFamily: 'var(--font-poppins)' }}>
                {itemCount}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <ShoppingCart size={18} />
              <span className="font-semibold text-sm" style={{ fontFamily: 'var(--font-poppins)' }}>
                View Cart
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="font-bold text-sm" style={{ fontFamily: 'var(--font-poppins)' }}>
              ₹{grandTotal.toLocaleString('en-IN')}
            </span>
            <ArrowRight size={16} />
          </div>
        </button>
      </div>
    </div>
  );
}
