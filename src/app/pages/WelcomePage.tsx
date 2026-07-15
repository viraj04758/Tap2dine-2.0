import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { Utensils, ArrowRight, Clock, Wifi, QrCode } from 'lucide-react';
import { useOrder } from '@/app/store/orderStore';

const RESTAURANT_INFO = {
  name: 'Tap2Dine',
  tagline: 'Fine Dining, Reimagined',
  cuisine: 'Modern Indian · Premium',
  logo: '🍽️',
  waitTime: '10–15 min',
  openTime: '11:00 AM – 11:00 PM',
  address: 'Connaught Place, New Delhi',
};

export default function WelcomePage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { setTableNumber, tableNumber } = useOrder();

  const tableParam = searchParams.get('table');

  useEffect(() => {
    if (tableParam) {
      const n = parseInt(tableParam, 10);
      if (!isNaN(n) && n > 0) setTableNumber(n);
    }
  }, [tableParam, setTableNumber]);

  const handleStartOrdering = () => {
    navigate('/app/menu');
  };

  return (
    <div
      className="min-h-screen flex flex-col relative overflow-hidden"
      style={{ background: '#0F0F0F', fontFamily: 'var(--font-poppins)' }}
    >
      {/* Background image with overlay */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1200&h=1600&fit=crop&auto=format"
          alt="Restaurant ambiance"
          className="w-full h-full object-cover"
          style={{ opacity: 0.25 }}
        />
        <div className="absolute inset-0" style={{
          background: 'linear-gradient(to bottom, rgba(15,15,15,0.7) 0%, rgba(15,15,15,0.5) 40%, rgba(15,15,15,0.9) 80%, #0F0F0F 100%)'
        }} />
      </div>

      {/* Animated gradient orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute -top-40 -right-40 w-80 h-80 rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(255,107,53,0.2) 0%, transparent 70%)',
            animation: 'pulse 4s ease-in-out infinite',
          }}
        />
        <div
          className="absolute -bottom-20 -left-20 w-64 h-64 rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(255,107,53,0.15) 0%, transparent 70%)',
            animation: 'pulse 4s ease-in-out infinite 2s',
          }}
        />
      </div>

      {/* Header — WiFi & QR indicator */}
      <div className="relative z-10 flex items-center justify-between px-6 pt-12 pb-4">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full" style={{ background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(8px)' }}>
          <Wifi size={12} color="rgba(255,255,255,0.7)" />
          <span className="text-white text-[11px] font-medium" style={{ opacity: 0.7 }}>Connected</span>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full" style={{ background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(8px)' }}>
          <QrCode size={12} color="rgba(255,255,255,0.7)" />
          <span className="text-white text-[11px] font-medium" style={{ opacity: 0.7 }}>QR Verified</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 text-center">

        {/* Logo animation */}
        <div
          className="w-24 h-24 rounded-3xl flex items-center justify-center mb-6"
          style={{
            background: 'linear-gradient(135deg, var(--brand-orange) 0%, #FF8C5A 100%)',
            boxShadow: '0 0 60px rgba(255,107,53,0.5)',
            animation: 'logoEntrance 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) both',
          }}
        >
          <Utensils size={44} color="white" />
        </div>

        {/* Restaurant name */}
        <div style={{ animation: 'fadeSlideUp 0.6s ease 0.3s both' }}>
          <h1 className="text-4xl font-bold text-white mb-1" style={{ letterSpacing: '-0.02em' }}>
            {RESTAURANT_INFO.name}
          </h1>
          <p className="text-sm font-medium mb-2" style={{ color: 'rgba(255,255,255,0.5)' }}>
            {RESTAURANT_INFO.cuisine}
          </p>
          <p className="text-base italic" style={{ color: 'rgba(255,255,255,0.7)', fontFamily: "'EB Garamond', serif" }}>
            "{RESTAURANT_INFO.tagline}"
          </p>
        </div>

        {/* Table badge */}
        <div
          className="mt-6 px-6 py-3 rounded-2xl flex items-center gap-3"
          style={{
            background: 'rgba(255,255,255,0.08)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(255,255,255,0.12)',
            animation: 'fadeSlideUp 0.6s ease 0.5s both',
          }}
        >
          <div className="text-3xl">🪑</div>
          <div className="text-left">
            <p className="text-xs font-medium" style={{ color: 'rgba(255,255,255,0.5)' }}>Your Table</p>
            <p className="text-xl font-bold text-white">Table {tableNumber}</p>
          </div>
          <div className="w-px h-10 mx-2" style={{ background: 'rgba(255,255,255,0.12)' }} />
          <div className="text-left">
            <p className="text-xs font-medium" style={{ color: 'rgba(255,255,255,0.5)' }}>Est. Wait</p>
            <div className="flex items-center gap-1">
              <Clock size={14} style={{ color: 'var(--brand-orange)' }} />
              <p className="text-base font-bold text-white">{RESTAURANT_INFO.waitTime}</p>
            </div>
          </div>
        </div>

        {/* Welcome message */}
        <p
          className="mt-6 text-sm leading-relaxed"
          style={{
            color: 'rgba(255,255,255,0.55)',
            fontFamily: 'var(--font-inter)',
            maxWidth: 280,
            animation: 'fadeSlideUp 0.6s ease 0.7s both',
          }}
        >
          Welcome! Scan, order, and enjoy — your dining experience starts here.
        </p>
      </div>

      {/* Bottom actions */}
      <div
        className="relative z-10 px-6 pb-10 space-y-3"
        style={{ animation: 'fadeSlideUp 0.6s ease 0.9s both' }}
      >
        {/* Info strip */}
        <div
          className="flex items-center justify-center gap-4 px-4 py-3 rounded-xl mb-2"
          style={{ background: 'rgba(255,255,255,0.06)' }}
        >
          <div className="flex items-center gap-1.5">
            <span className="text-sm">🕐</span>
            <span className="text-[11px] font-medium" style={{ color: 'rgba(255,255,255,0.6)' }}>
              {RESTAURANT_INFO.openTime}
            </span>
          </div>
          <div className="w-px h-4" style={{ background: 'rgba(255,255,255,0.15)' }} />
          <div className="flex items-center gap-1.5">
            <span className="text-sm">📍</span>
            <span className="text-[11px] font-medium" style={{ color: 'rgba(255,255,255,0.6)' }}>
              {RESTAURANT_INFO.address}
            </span>
          </div>
        </div>

        {/* Start Ordering button */}
        <button
          onClick={handleStartOrdering}
          className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl text-white font-bold text-base transition-all active:scale-[0.98]"
          style={{
            background: 'linear-gradient(135deg, var(--brand-orange) 0%, var(--brand-orange-dark) 100%)',
            boxShadow: '0 8px 32px rgba(255,107,53,0.5)',
          }}
        >
          Start Ordering
          <ArrowRight size={20} />
        </button>

        <p className="text-center text-[11px]" style={{ color: 'rgba(255,255,255,0.35)', fontFamily: 'var(--font-inter)' }}>
          By ordering, you agree to our terms & conditions
        </p>
      </div>

      <style>{`
        @keyframes logoEntrance {
          from { transform: scale(0.5) rotate(-10deg); opacity: 0; }
          to { transform: scale(1) rotate(0deg); opacity: 1; }
        }
        @keyframes fadeSlideUp {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 0.5; }
          50% { transform: scale(1.1); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
