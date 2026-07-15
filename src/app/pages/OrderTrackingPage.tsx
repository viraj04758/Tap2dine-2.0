import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Bell, UtensilsCrossed, Phone, MessageCircle } from 'lucide-react';
import Navbar from '@/app/components/app/Navbar';
import BottomNav from '@/app/components/app/BottomNav';
import CallWaiterSheet from '@/app/components/app/CallWaiterSheet';
import { useOrder, ORDER_STATUS_STEPS } from '@/app/store/orderStore';
import type { OrderStatus } from '@/app/store/orderStore';
import { Toaster } from 'sonner';

const STATUS_COLORS: Record<OrderStatus, string> = {
  received:  '#FF6B35',
  preparing: '#F59E0B',
  cooking:   '#EF4444',
  ready:     '#8B5CF6',
  served:    '#22C55E',
};

function getStepIndex(status: OrderStatus): number {
  return ORDER_STATUS_STEPS.findIndex(s => s.status === status);
}

export default function OrderTrackingPage() {
  const navigate = useNavigate();
  const { currentOrder } = useOrder();
  const [showWaiter, setShowWaiter] = useState(false);
  const [elapsed, setElapsed] = useState(0);

  // Tick elapsed time
  useEffect(() => {
    if (!currentOrder) return;
    const interval = setInterval(() => {
      const secs = Math.floor((Date.now() - currentOrder.placedAt.getTime()) / 1000);
      setElapsed(secs);
    }, 1000);
    return () => clearInterval(interval);
  }, [currentOrder]);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  // Demo fallback order
  const order = currentOrder || {
    id: 'T2D-DEMO01',
    tableNumber: 5,
    status: 'cooking' as OrderStatus,
    estimatedTime: 25,
    placedAt: new Date(Date.now() - 5 * 60 * 1000),
    items: [
      { id: '1', name: 'Butter Chicken', quantity: 1, price: 380, isVeg: false },
      { id: '2', name: 'Garlic Naan', quantity: 2, price: 70, isVeg: true },
    ],
    total: 580,
  };

  const currentStepIndex = getStepIndex(order.status);
  const currentStepData = ORDER_STATUS_STEPS[currentStepIndex];
  const progressPct = ((currentStepIndex) / (ORDER_STATUS_STEPS.length - 1)) * 100;

  const remainingMinutes = Math.max(0,
    order.estimatedTime - Math.floor(elapsed / 60)
  );

  return (
    <div className="min-h-screen pb-24" style={{ background: 'var(--app-bg)', fontFamily: 'var(--font-poppins)' }}>
      <Toaster position="top-center" richColors />
      <Navbar title="Order Tracking" showBack showSearch={false} />

      <div className="px-4 pt-4 space-y-4">

        {/* Order ID + Status Hero */}
        <div
          className="rounded-3xl p-5 text-center"
          style={{
            background: `linear-gradient(135deg, ${STATUS_COLORS[order.status]}15 0%, ${STATUS_COLORS[order.status]}08 100%)`,
            border: `2px solid ${STATUS_COLORS[order.status]}30`,
          }}
        >
          <div
            className="text-5xl mb-3"
            style={{ animation: 'pulse 2s ease-in-out infinite' }}
          >
            {currentStepData?.icon ?? '⏳'}
          </div>
          <h2
            className="text-xl font-bold mb-1"
            style={{ color: STATUS_COLORS[order.status], fontFamily: 'var(--font-poppins)' }}
          >
            {currentStepData?.label ?? 'Processing...'}
          </h2>
          <p className="text-sm" style={{ color: 'var(--app-text-muted)', fontFamily: 'var(--font-inter)' }}>
            {currentStepData?.desc}
          </p>

          {/* Time display */}
          <div className="flex items-center justify-center gap-6 mt-4">
            <div className="text-center">
              <p className="text-2xl font-extrabold" style={{ color: 'var(--app-text)', fontFamily: 'var(--font-poppins)' }}>
                {formatTime(elapsed)}
              </p>
              <p className="text-xs" style={{ color: 'var(--app-text-muted)', fontFamily: 'var(--font-inter)' }}>Elapsed</p>
            </div>
            <div className="w-px h-10" style={{ background: '#E2E8F0' }} />
            <div className="text-center">
              <p
                className="text-2xl font-extrabold"
                style={{ color: STATUS_COLORS[order.status], fontFamily: 'var(--font-poppins)' }}
              >
                ~{remainingMinutes}m
              </p>
              <p className="text-xs" style={{ color: 'var(--app-text-muted)', fontFamily: 'var(--font-inter)' }}>Remaining</p>
            </div>
            <div className="w-px h-10" style={{ background: '#E2E8F0' }} />
            <div className="text-center">
              <p className="text-2xl font-extrabold" style={{ color: 'var(--app-text)', fontFamily: 'var(--font-poppins)' }}>
                {order.tableNumber}
              </p>
              <p className="text-xs" style={{ color: 'var(--app-text-muted)', fontFamily: 'var(--font-inter)' }}>Table</p>
            </div>
          </div>

          {/* Progress bar */}
          <div className="mt-4 h-2 rounded-full overflow-hidden" style={{ background: 'rgba(0,0,0,0.06)' }}>
            <div
              className="h-full rounded-full transition-all duration-1000 ease-out"
              style={{
                width: `${progressPct}%`,
                background: `linear-gradient(90deg, ${STATUS_COLORS[order.status]}, ${STATUS_COLORS[order.status]}CC)`,
              }}
            />
          </div>
          <p className="text-xs mt-1.5" style={{ color: 'var(--app-text-muted)', fontFamily: 'var(--font-inter)' }}>
            Order ID: <span className="font-bold" style={{ color: 'var(--app-text)' }}>{order.id}</span>
          </p>
        </div>

        {/* Timeline */}
        <div className="rounded-2xl overflow-hidden" style={{ background: 'white', boxShadow: 'var(--app-shadow)' }}>
          <div className="px-4 py-3 border-b" style={{ borderColor: '#F1F5F9' }}>
            <h3 className="text-sm font-bold" style={{ color: 'var(--app-text)' }}>📍 Order Progress</h3>
          </div>
          <div className="p-4">
            {ORDER_STATUS_STEPS.map((step, i) => {
              const isDone    = i < currentStepIndex;
              const isActive  = i === currentStepIndex;
              const isPending = i > currentStepIndex;
              const color     = STATUS_COLORS[step.status];

              return (
                <div key={step.status} className="flex gap-4">
                  {/* Left — icon + connector */}
                  <div className="flex flex-col items-center">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center text-lg flex-shrink-0 transition-all duration-500"
                      style={{
                        background: isDone ? '#F0FDF4' : isActive ? `${color}20` : '#F8FAFC',
                        border: `2px solid ${isDone ? '#22C55E' : isActive ? color : '#E2E8F0'}`,
                        boxShadow: isActive ? `0 0 0 4px ${color}20` : 'none',
                        animation: isActive ? 'ripple 2s ease-in-out infinite' : 'none',
                      }}
                    >
                      {isDone ? '✅' : step.icon}
                    </div>
                    {i < ORDER_STATUS_STEPS.length - 1 && (
                      <div
                        className="w-0.5 flex-1 my-1 min-h-[24px] transition-all duration-700"
                        style={{ background: isDone ? '#22C55E' : '#E2E8F0' }}
                      />
                    )}
                  </div>

                  {/* Right — content */}
                  <div className="flex-1 pb-4">
                    <div className="flex items-center justify-between mb-0.5">
                      <p
                        className="text-sm font-semibold"
                        style={{
                          color: isDone ? '#22C55E' : isActive ? color : '#94A3B8',
                          fontFamily: 'var(--font-poppins)',
                        }}
                      >
                        {step.label}
                      </p>
                      {isActive && (
                        <span
                          className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                          style={{
                            background: `${color}15`,
                            color: color,
                            fontFamily: 'var(--font-poppins)',
                            animation: 'blink 1.5s ease-in-out infinite',
                          }}
                        >
                          LIVE
                        </span>
                      )}
                    </div>
                    <p
                      className="text-xs"
                      style={{
                        color: isPending ? '#CBD5E1' : 'var(--app-text-muted)',
                        fontFamily: 'var(--font-inter)',
                      }}
                    >
                      {step.desc}
                    </p>
                    {isDone && (
                      <p className="text-[10px] mt-0.5 font-medium" style={{ color: '#22C55E', fontFamily: 'var(--font-inter)' }}>
                        Completed ✓
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Order items summary */}
        <div className="rounded-2xl overflow-hidden" style={{ background: 'white', boxShadow: 'var(--app-shadow)' }}>
          <div className="px-4 py-3 border-b" style={{ borderColor: '#F1F5F9' }}>
            <h3 className="text-sm font-bold" style={{ color: 'var(--app-text)' }}>🛍️ Your Order</h3>
          </div>
          <div className="divide-y" style={{ borderColor: '#F1F5F9' }}>
            {order.items.map(item => (
              <div key={item.id} className="flex justify-between items-center px-4 py-3">
                <div className="flex items-center gap-2">
                  <span
                    className="w-3 h-3 rounded-sm border-2 flex-shrink-0"
                    style={{ borderColor: item.isVeg ? '#22C55E' : '#EF4444' }}
                  />
                  <span className="text-sm" style={{ color: 'var(--app-text)', fontFamily: 'var(--font-inter)' }}>
                    {item.name}
                  </span>
                  <span className="text-xs px-1.5 py-0.5 rounded-full" style={{ background: '#F1F5F9', color: 'var(--app-text-muted)' }}>
                    ×{item.quantity}
                  </span>
                </div>
                <span className="text-sm font-semibold" style={{ color: 'var(--app-text)', fontFamily: 'var(--font-inter)' }}>
                  ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                </span>
              </div>
            ))}
          </div>
          <div className="flex justify-between items-center px-4 py-3 border-t" style={{ borderColor: '#F1F5F9' }}>
            <span className="text-sm font-bold" style={{ color: 'var(--app-text)', fontFamily: 'var(--font-poppins)' }}>Total</span>
            <span className="text-base font-bold" style={{ color: 'var(--brand-orange)', fontFamily: 'var(--font-poppins)' }}>
              ₹{order.total.toLocaleString('en-IN')}
            </span>
          </div>
        </div>

        {/* Restaurant message */}
        <div
          className="rounded-2xl p-4 flex gap-3"
          style={{ background: 'var(--brand-orange-light)', border: '1.5px solid rgba(255,107,53,0.2)' }}
        >
          <span className="text-2xl flex-shrink-0">👨‍🍳</span>
          <div>
            <p className="text-sm font-semibold mb-0.5" style={{ color: '#7C2D12', fontFamily: 'var(--font-poppins)' }}>
              Message from Chef
            </p>
            <p className="text-xs leading-relaxed" style={{ color: '#9A3412', fontFamily: 'var(--font-inter)' }}>
              "Your food is being prepared with love and the freshest ingredients. Thank you for your patience!"
            </p>
          </div>
        </div>

        {/* Action buttons */}
        <div className="grid grid-cols-3 gap-3">
          <button
            onClick={() => setShowWaiter(true)}
            className="flex flex-col items-center gap-2 p-3 rounded-2xl transition-all active:scale-95"
            style={{ background: 'white', boxShadow: 'var(--app-shadow)' }}
          >
            <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: 'var(--brand-orange-light)' }}>
              <Bell size={18} style={{ color: 'var(--brand-orange)' }} />
            </div>
            <span className="text-xs font-medium" style={{ color: 'var(--app-text)', fontFamily: 'var(--font-inter)' }}>
              Call Waiter
            </span>
          </button>

          <button
            onClick={() => navigate('/app/menu')}
            className="flex flex-col items-center gap-2 p-3 rounded-2xl transition-all active:scale-95"
            style={{ background: 'white', boxShadow: 'var(--app-shadow)' }}
          >
            <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: '#EFF6FF' }}>
              <UtensilsCrossed size={18} style={{ color: '#3B82F6' }} />
            </div>
            <span className="text-xs font-medium" style={{ color: 'var(--app-text)', fontFamily: 'var(--font-inter)' }}>
              Add More
            </span>
          </button>

          <button
            className="flex flex-col items-center gap-2 p-3 rounded-2xl transition-all active:scale-95"
            style={{ background: 'white', boxShadow: 'var(--app-shadow)' }}
          >
            <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: '#F0FDF4' }}>
              <MessageCircle size={18} style={{ color: '#22C55E' }} />
            </div>
            <span className="text-xs font-medium" style={{ color: 'var(--app-text)', fontFamily: 'var(--font-inter)' }}>
              Support
            </span>
          </button>
        </div>
      </div>

      <CallWaiterSheet isOpen={showWaiter} onClose={() => setShowWaiter(false)} />
      <BottomNav />

      <style>{`
        @keyframes ripple {
          0%, 100% { box-shadow: 0 0 0 0px rgba(255,107,53,0.3); }
          50%       { box-shadow: 0 0 0 8px rgba(255,107,53,0); }
        }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.5; }
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50%       { transform: scale(1.05); }
        }
      `}</style>
    </div>
  );
}
