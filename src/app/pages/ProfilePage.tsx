import { useNavigate } from 'react-router';
import {
  User, Star, Gift, ChevronRight, Heart, History,
  Settings, LogOut, Moon, Bell, Globe, Shield, HelpCircle
} from 'lucide-react';
import Navbar from '@/app/components/app/Navbar';
import BottomNav from '@/app/components/app/BottomNav';

const USER = {
  name: 'Aanya Sharma',
  phone: '+91 98765 43210',
  points: 1240,
  level: 'Gold Member',
  ordersCount: 18,
  savedAmount: 840,
  avatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=Aanya&backgroundColor=b6e3f4',
};

const PAST_ORDERS = [
  { id: 'T2D-AB12CD', date: '14 Jul 2026', items: 'Butter Chicken, Garlic Naan ×2', total: 520, status: 'Served', rating: 5 },
  { id: 'T2D-EF34GH', date: '10 Jul 2026', items: 'Hyderabadi Biryani, Raita',       total: 440, status: 'Served', rating: 4 },
  { id: 'T2D-IJ56KL', date: '5 Jul 2026',  items: 'Desi Feast Combo',               total: 720, status: 'Served', rating: 5 },
];

const FAVOURITE_DISHES = [
  { id: 'cs-01', name: 'Butter Chicken',       price: 380, emoji: '🍛' },
  { id: 'br-01', name: 'Hyderabadi Biryani',   price: 420, emoji: '🍚' },
  { id: 'ds-02', name: 'Kulfi Falooda',         price: 180, emoji: '🍦' },
];

const SETTINGS_ITEMS = [
  { icon: Moon,    label: 'Dark Mode',       desc: 'Switch to dark theme',      action: 'toggle' },
  { icon: Bell,    label: 'Notifications',   desc: 'Manage alerts',             action: 'nav' },
  { icon: Globe,   label: 'Language',        desc: 'English (India)',            action: 'nav' },
  { icon: Shield,  label: 'Privacy',         desc: 'Data & privacy settings',   action: 'nav' },
  { icon: HelpCircle, label: 'Help & Support', desc: 'FAQs & contact us',       action: 'nav' },
];

export default function ProfilePage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen pb-24" style={{ background: 'var(--app-bg)', fontFamily: 'var(--font-poppins)' }}>
      <Navbar title="My Profile" showBack showSearch={false} />

      <div className="px-4 pt-4 space-y-4">

        {/* Profile Hero */}
        <div
          className="rounded-3xl p-5 relative overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, #1E293B 0%, #334155 100%)',
            boxShadow: '0 8px 32px rgba(30,41,59,0.3)',
          }}
        >
          {/* Decorative orb */}
          <div
            className="absolute -top-10 -right-10 w-32 h-32 rounded-full opacity-20"
            style={{ background: 'var(--brand-orange)' }}
          />

          <div className="flex items-center gap-4">
            <div className="relative">
              <div
                className="w-16 h-16 rounded-2xl overflow-hidden flex items-center justify-center text-3xl"
                style={{ background: '#F1F5F9' }}
              >
                <User size={32} style={{ color: '#94A3B8' }} />
              </div>
              <div
                className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-white flex items-center justify-center"
                style={{ background: 'var(--brand-orange)' }}
              >
                <Star size={10} fill="white" color="white" />
              </div>
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-bold text-white">{USER.name}</h2>
              <p className="text-sm opacity-70 text-white" style={{ fontFamily: 'var(--font-inter)' }}>{USER.phone}</p>
              <div
                className="inline-flex items-center gap-1 mt-1.5 px-2.5 py-1 rounded-full text-xs font-bold"
                style={{ background: 'rgba(255,107,53,0.25)', color: 'var(--brand-orange)' }}
              >
                ⭐ {USER.level}
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="flex gap-3 mt-4">
            {[
              { label: 'Orders',  value: USER.ordersCount,            suffix: '' },
              { label: 'Points',  value: USER.points.toLocaleString(), suffix: ' pts' },
              { label: 'Saved',   value: `₹${USER.savedAmount}`,       suffix: '' },
            ].map(stat => (
              <div
                key={stat.label}
                className="flex-1 text-center py-2.5 rounded-xl"
                style={{ background: 'rgba(255,255,255,0.08)' }}
              >
                <p className="text-base font-extrabold text-white">
                  {stat.value}{stat.suffix}
                </p>
                <p className="text-[10px] mt-0.5 opacity-60 text-white" style={{ fontFamily: 'var(--font-inter)' }}>
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Loyalty Points Card */}
        <div
          className="rounded-2xl p-4 flex items-center gap-4"
          style={{
            background: 'linear-gradient(135deg, var(--brand-orange-light) 0%, #FFF3ED 100%)',
            border: '1.5px solid rgba(255,107,53,0.2)',
          }}
        >
          <div className="text-4xl">🏆</div>
          <div className="flex-1">
            <p className="text-sm font-bold" style={{ color: 'var(--app-text)' }}>Loyalty Points</p>
            <p className="text-2xl font-extrabold" style={{ color: 'var(--brand-orange)', fontFamily: 'var(--font-poppins)' }}>
              {USER.points.toLocaleString()} pts
            </p>
            <p className="text-xs" style={{ color: 'var(--app-text-muted)', fontFamily: 'var(--font-inter)' }}>
              Worth ₹{Math.floor(USER.points / 10)} · {3000 - USER.points} pts to Platinum
            </p>
          </div>
          <Gift size={20} style={{ color: 'var(--brand-orange)' }} />
        </div>

        {/* Favourite Dishes */}
        <div className="rounded-2xl overflow-hidden" style={{ background: 'white', boxShadow: 'var(--app-shadow)' }}>
          <div className="px-4 py-3 border-b flex items-center justify-between" style={{ borderColor: '#F1F5F9' }}>
            <h3 className="text-sm font-bold flex items-center gap-2" style={{ color: 'var(--app-text)' }}>
              <Heart size={16} style={{ color: 'var(--brand-orange)' }} />
              Favourite Dishes
            </h3>
            <button
              onClick={() => navigate('/app/menu')}
              className="text-xs font-semibold"
              style={{ color: 'var(--brand-orange)', fontFamily: 'var(--font-inter)' }}
            >
              Order Again
            </button>
          </div>
          <div className="divide-y" style={{ borderColor: '#F1F5F9' }}>
            {FAVOURITE_DISHES.map(dish => (
              <button
                key={dish.id}
                onClick={() => navigate(`/app/menu/${dish.id}`)}
                className="w-full flex items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-gray-50 active:scale-[0.99]"
              >
                <span className="text-2xl">{dish.emoji}</span>
                <div className="flex-1">
                  <p className="text-sm font-semibold" style={{ color: 'var(--app-text)', fontFamily: 'var(--font-poppins)' }}>
                    {dish.name}
                  </p>
                  <p className="text-xs" style={{ color: 'var(--app-text-muted)', fontFamily: 'var(--font-inter)' }}>
                    ₹{dish.price}
                  </p>
                </div>
                <ChevronRight size={16} style={{ color: '#CBD5E1' }} />
              </button>
            ))}
          </div>
        </div>

        {/* Past Orders */}
        <div className="rounded-2xl overflow-hidden" style={{ background: 'white', boxShadow: 'var(--app-shadow)' }}>
          <div className="px-4 py-3 border-b flex items-center justify-between" style={{ borderColor: '#F1F5F9' }}>
            <h3 className="text-sm font-bold flex items-center gap-2" style={{ color: 'var(--app-text)' }}>
              <History size={16} style={{ color: '#64748B' }} />
              Past Orders
            </h3>
          </div>
          <div className="divide-y" style={{ borderColor: '#F1F5F9' }}>
            {PAST_ORDERS.map(order => (
              <div key={order.id} className="px-4 py-3">
                <div className="flex items-start justify-between mb-1">
                  <div>
                    <p className="text-sm font-semibold" style={{ color: 'var(--app-text)', fontFamily: 'var(--font-poppins)' }}>
                      {order.id}
                    </p>
                    <p className="text-[11px]" style={{ color: 'var(--app-text-muted)', fontFamily: 'var(--font-inter)' }}>
                      {order.date}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold" style={{ color: 'var(--app-text)', fontFamily: 'var(--font-poppins)' }}>
                      ₹{order.total}
                    </p>
                    <div className="flex gap-0.5 justify-end mt-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} size={10} fill={i < order.rating ? '#FACC15' : 'none'} color={i < order.rating ? '#FACC15' : '#E2E8F0'} />
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-xs line-clamp-1" style={{ color: 'var(--app-text-muted)', fontFamily: 'var(--font-inter)' }}>
                  {order.items}
                </p>
                <div className="flex items-center justify-between mt-2">
                  <span
                    className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                    style={{ background: '#F0FDF4', color: '#166534' }}
                  >
                    ✓ {order.status}
                  </span>
                  <button
                    onClick={() => navigate('/app/menu')}
                    className="text-xs font-semibold"
                    style={{ color: 'var(--brand-orange)', fontFamily: 'var(--font-poppins)' }}
                  >
                    Reorder
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Settings */}
        <div className="rounded-2xl overflow-hidden" style={{ background: 'white', boxShadow: 'var(--app-shadow)' }}>
          <div className="px-4 py-3 border-b" style={{ borderColor: '#F1F5F9' }}>
            <h3 className="text-sm font-bold flex items-center gap-2" style={{ color: 'var(--app-text)' }}>
              <Settings size={16} style={{ color: '#64748B' }} />
              Settings
            </h3>
          </div>
          <div className="divide-y" style={{ borderColor: '#F1F5F9' }}>
            {SETTINGS_ITEMS.map(item => (
              <button
                key={item.label}
                className="w-full flex items-center gap-3 px-4 py-3.5 text-left transition-colors hover:bg-gray-50 active:scale-[0.99]"
              >
                <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: '#F8FAFC' }}>
                  <item.icon size={18} style={{ color: '#64748B' }} />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold" style={{ color: 'var(--app-text)', fontFamily: 'var(--font-poppins)' }}>
                    {item.label}
                  </p>
                  <p className="text-xs" style={{ color: 'var(--app-text-muted)', fontFamily: 'var(--font-inter)' }}>
                    {item.desc}
                  </p>
                </div>
                <ChevronRight size={16} style={{ color: '#CBD5E1' }} />
              </button>
            ))}
          </div>
        </div>

        {/* Logout */}
        <button
          className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl font-semibold transition-all active:scale-[0.98]"
          style={{
            background: '#FEF2F2',
            color: '#EF4444',
            border: '1.5px solid #FEE2E2',
            fontFamily: 'var(--font-poppins)',
          }}
        >
          <LogOut size={18} />
          Logout
        </button>

        <div className="text-center pb-4">
          <p className="text-xs" style={{ color: '#CBD5E1', fontFamily: 'var(--font-inter)' }}>
            Tap2Dine v2.0 · Made with ❤️ in India
          </p>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
