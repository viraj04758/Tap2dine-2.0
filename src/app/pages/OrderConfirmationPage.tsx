import { useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router';
import { ArrowRight, UtensilsCrossed } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useOrder } from '@/app/store/orderStore';

export default function OrderConfirmationPage() {
  const navigate = useNavigate();
  const { orderId } = useParams<{ orderId: string }>();
  const { currentOrder } = useOrder();
  const confettiFired = useRef(false);

  // Fire confetti on mount
  useEffect(() => {
    if (confettiFired.current) return;
    confettiFired.current = true;

    const fire = (particleRatio: number, opts: confetti.Options) =>
      confetti({
        origin: { y: 0.7 },
        ...opts,
        particleCount: Math.floor(200 * particleRatio),
      });

    // Staggered burst
    setTimeout(() => {
      fire(0.25, { spread: 26, startVelocity: 55, colors: ['#FF6B35', '#FFD700', '#22C55E'] });
    }, 300);
    setTimeout(() => {
      fire(0.2, { spread: 60, colors: ['#FF6B35', '#FF8C5A', '#FFFFFF'] });
    }, 600);
    setTimeout(() => {
      fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
    }, 900);
    setTimeout(() => {
      fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
    }, 1200);
    setTimeout(() => {
      fire(0.1, { spread: 120, startVelocity: 45 });
    }, 1400);
  }, []);

  const displayId = orderId || currentOrder?.id || 'T2D-DEMO01';
  const tableNum  = currentOrder?.tableNumber ?? 1;
  const estTime   = currentOrder?.estimatedTime ?? 25;
  const total     = currentOrder?.total ?? 0;

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-6 text-center relative overflow-hidden"
      style={{ background: 'var(--app-bg)', fontFamily: 'var(--font-poppins)' }}
    >
      {/* Background gradient blobs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute top-20 left-1/2 -translate-x-1/2 w-64 h-64 rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(255,107,53,0.12) 0%, transparent 70%)' }}
        />
        <div
          className="absolute bottom-32 right-10 w-48 h-48 rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(34,197,94,0.1) 0%, transparent 70%)' }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-sm">

        {/* Success icon */}
        <div
          className="w-24 h-24 rounded-3xl flex items-center justify-center mx-auto mb-6"
          style={{
            background: 'linear-gradient(135deg, #22C55E 0%, #16A34A 100%)',
            boxShadow: '0 8px 32px rgba(34,197,94,0.4)',
            animation: 'successBounce 0.7s cubic-bezier(0.34, 1.56, 0.64, 1) both',
          }}
        >
          <span className="text-5xl" style={{ animation: 'checkmark 0.5s ease 0.5s both' }}>✅</span>
        </div>

        <h1
          className="text-2xl font-bold mb-2"
          style={{
            color: 'var(--app-text)',
            animation: 'fadeSlideUp 0.5s ease 0.4s both',
          }}
        >
          Order Placed! 🎉
        </h1>
        <p
          className="text-sm mb-8 leading-relaxed"
          style={{
            color: 'var(--app-text-muted)',
            fontFamily: 'var(--font-inter)',
            animation: 'fadeSlideUp 0.5s ease 0.5s both',
          }}
        >
          Your order has been received and the chef is on it. Sit back and relax!
        </p>

        {/* Order details card */}
        <div
          className="w-full rounded-3xl p-5 mb-4 text-left"
          style={{
            background: 'white',
            boxShadow: '0 8px 40px rgba(0,0,0,0.10)',
            animation: 'fadeSlideUp 0.5s ease 0.6s both',
          }}
        >
          {[
            { label: 'Order ID',  value: displayId, highlight: true },
            { label: 'Table',     value: `Table ${tableNum}` },
            { label: 'Est. Time', value: `${estTime} minutes ⏱️` },
            ...(total > 0 ? [{ label: 'Total Paid', value: `₹${total.toLocaleString('en-IN')}` }] : []),
          ].map((row, i) => (
            <div
              key={row.label}
              className={`flex items-center justify-between py-3 ${i < 3 ? 'border-b' : ''}`}
              style={{ borderColor: '#F1F5F9' }}
            >
              <span className="text-sm" style={{ color: 'var(--app-text-muted)', fontFamily: 'var(--font-inter)' }}>
                {row.label}
              </span>
              <span
                className="text-sm font-bold"
                style={{
                  color: row.highlight ? 'var(--brand-orange)' : 'var(--app-text)',
                  fontFamily: 'var(--font-poppins)',
                }}
              >
                {row.value}
              </span>
            </div>
          ))}
        </div>

        {/* Estimated time ring */}
        <div
          className="mx-auto w-28 h-28 rounded-full flex flex-col items-center justify-center mb-6"
          style={{
            background: 'var(--brand-orange-light)',
            border: '3px solid var(--brand-orange)',
            animation: 'fadeSlideUp 0.5s ease 0.8s both',
          }}
        >
          <span className="text-3xl font-extrabold" style={{ color: 'var(--brand-orange)', fontFamily: 'var(--font-poppins)' }}>
            {estTime}
          </span>
          <span className="text-xs font-medium" style={{ color: 'var(--brand-orange)', fontFamily: 'var(--font-inter)' }}>
            minutes
          </span>
        </div>

        {/* CTA buttons */}
        <div
          className="flex flex-col gap-3 w-full"
          style={{ animation: 'fadeSlideUp 0.5s ease 1s both' }}
        >
          <button
            onClick={() => navigate(`/app/track/${displayId}`)}
            className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl text-white font-bold"
            style={{
              background: 'linear-gradient(135deg, var(--brand-orange) 0%, var(--brand-orange-dark) 100%)',
              boxShadow: 'var(--app-shadow-orange)',
              fontFamily: 'var(--font-poppins)',
            }}
          >
            Track My Order
            <ArrowRight size={18} />
          </button>

          <button
            onClick={() => navigate('/app/menu')}
            className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl font-semibold"
            style={{
              background: '#F8FAFC',
              color: 'var(--app-text)',
              border: '1.5px solid #E2E8F0',
              fontFamily: 'var(--font-poppins)',
            }}
          >
            <UtensilsCrossed size={18} />
            Back to Menu
          </button>
        </div>
      </div>

      <style>{`
        @keyframes successBounce {
          from { transform: scale(0.3); opacity: 0; }
          to   { transform: scale(1);   opacity: 1; }
        }
        @keyframes checkmark {
          from { transform: scale(0) rotate(-180deg); }
          to   { transform: scale(1) rotate(0deg); }
        }
        @keyframes fadeSlideUp {
          from { transform: translateY(20px); opacity: 0; }
          to   { transform: translateY(0);    opacity: 1; }
        }
      `}</style>
    </div>
  );
}
