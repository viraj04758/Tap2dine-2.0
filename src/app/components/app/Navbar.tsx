import { useNavigate, useLocation } from 'react-router';
import { Search, Bell, ShoppingCart, ChevronLeft, Utensils } from 'lucide-react';
import { useCart } from '@/app/store/cartStore';
import { useOrder } from '@/app/store/orderStore';

interface NavbarProps {
  title?: string;
  showBack?: boolean;
  showSearch?: boolean;
  onSearchClick?: () => void;
}

export default function Navbar({ title, showBack, showSearch = true, onSearchClick }: NavbarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { itemCount } = useCart();
  const { tableNumber } = useOrder();

  const isMenuPage = location.pathname === '/app/menu';

  return (
    <header
      className="sticky top-0 z-50 w-full"
      style={{
        background: 'rgba(255,255,255,0.95)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderBottom: '1px solid rgba(0,0,0,0.06)',
        boxShadow: '0 2px 16px rgba(0,0,0,0.06)',
      }}
    >
      <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between gap-3">

        {/* Left — back or logo */}
        <div className="flex items-center gap-3 min-w-0">
          {showBack ? (
            <button
              onClick={() => navigate(-1)}
              className="flex items-center justify-center w-9 h-9 rounded-full transition-all active:scale-95"
              style={{ background: 'var(--app-muted)' }}
              aria-label="Go back"
            >
              <ChevronLeft size={20} style={{ color: 'var(--app-text)' }} />
            </button>
          ) : (
            <button
              onClick={() => navigate('/app/menu')}
              className="flex items-center gap-2"
            >
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center"
                style={{ background: 'var(--brand-orange)' }}
              >
                <Utensils size={16} color="white" />
              </div>
              <span
                className="text-lg font-bold hidden sm:block"
                style={{ fontFamily: 'var(--font-poppins)', color: 'var(--app-text)' }}
              >
                Tap2Dine
              </span>
            </button>
          )}

          {title && (
            <h1
              className="text-base font-semibold truncate"
              style={{ fontFamily: 'var(--font-poppins)', color: 'var(--app-text)' }}
            >
              {title}
            </h1>
          )}
        </div>

        {/* Center — Table badge (show on menu/home) */}
        {!showBack && isMenuPage && (
          <div
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold"
            style={{
              background: 'var(--brand-orange-light)',
              color: 'var(--brand-orange)',
              fontFamily: 'var(--font-poppins)',
            }}
          >
            <span>🍽️</span>
            <span>Table {tableNumber}</span>
          </div>
        )}

        {/* Right — actions */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {showSearch && (
            <button
              onClick={onSearchClick}
              className="w-9 h-9 rounded-full flex items-center justify-center transition-all active:scale-95"
              style={{ background: 'var(--app-muted)' }}
              aria-label="Search"
            >
              <Search size={18} style={{ color: 'var(--app-text-muted)' }} />
            </button>
          )}

          <button
            onClick={() => navigate('/app/notifications')}
            className="w-9 h-9 rounded-full flex items-center justify-center relative transition-all active:scale-95"
            style={{ background: 'var(--app-muted)' }}
            aria-label="Notifications"
          >
            <Bell size={18} style={{ color: 'var(--app-text-muted)' }} />
            <span
              className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full"
              style={{ background: 'var(--brand-orange)' }}
            />
          </button>

          <button
            onClick={() => navigate('/app/cart')}
            className="relative w-9 h-9 rounded-full flex items-center justify-center transition-all active:scale-95"
            style={{
              background: itemCount > 0 ? 'var(--brand-orange)' : 'var(--app-muted)',
            }}
            aria-label={`Cart, ${itemCount} items`}
          >
            <ShoppingCart size={18} color={itemCount > 0 ? 'white' : 'var(--app-text-muted)'} />
            {itemCount > 0 && (
              <span
                className="absolute -top-1 -right-1 w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center text-white"
                style={{ background: '#1E293B', fontFamily: 'var(--font-poppins)' }}
              >
                {itemCount > 9 ? '9+' : itemCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
