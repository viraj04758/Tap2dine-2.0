import { useNavigate, useLocation } from 'react-router';
import { Home, UtensilsCrossed, ShoppingCart, ClipboardList, User } from 'lucide-react';
import { useCart } from '@/app/store/cartStore';

const NAV_ITEMS = [
  { path: '/app/menu',    label: 'Menu',    Icon: UtensilsCrossed },
  { path: '/app/cart',    label: 'Cart',    Icon: ShoppingCart },
  { path: '/',            label: 'Home',    Icon: Home },
  { path: '/app/track',   label: 'Orders',  Icon: ClipboardList },
  { path: '/app/profile', label: 'Profile', Icon: User },
];

export default function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const { itemCount } = useCart();

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 safe-area-pb"
      style={{
        background: 'rgba(255,255,255,0.97)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderTop: '1px solid rgba(0,0,0,0.07)',
        boxShadow: '0 -4px 24px rgba(0,0,0,0.08)',
      }}
    >
      <div className="max-w-xl mx-auto flex items-center justify-around px-2 py-2">
        {NAV_ITEMS.map(({ path, label, Icon }) => {
          const isActive = location.pathname === path ||
            (path !== '/' && location.pathname.startsWith(path));
          const isCart = path === '/app/cart';

          return (
            <button
              key={path}
              onClick={() => navigate(path)}
              className="flex flex-col items-center justify-center gap-0.5 px-3 py-1.5 rounded-2xl transition-all duration-200 active:scale-90 min-w-[60px]"
              style={{
                background: isActive ? 'var(--brand-orange-light)' : 'transparent',
              }}
              aria-label={label}
              aria-current={isActive ? 'page' : undefined}
            >
              <div className="relative">
                <Icon
                  size={22}
                  style={{
                    color: isActive ? 'var(--brand-orange)' : '#94A3B8',
                    strokeWidth: isActive ? 2.5 : 1.8,
                    transition: 'all 0.2s ease',
                  }}
                />
                {isCart && itemCount > 0 && (
                  <span
                    className="absolute -top-2 -right-2 w-4 h-4 text-[9px] font-bold text-white rounded-full flex items-center justify-center"
                    style={{ background: 'var(--brand-orange)', fontFamily: 'var(--font-poppins)' }}
                  >
                    {itemCount > 9 ? '9+' : itemCount}
                  </span>
                )}
              </div>
              <span
                className="text-[10px] font-medium leading-none"
                style={{
                  color: isActive ? 'var(--brand-orange)' : '#94A3B8',
                  fontFamily: 'var(--font-inter)',
                  fontWeight: isActive ? 600 : 500,
                  transition: 'all 0.2s ease',
                }}
              >
                {label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
