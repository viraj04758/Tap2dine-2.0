import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Heart, Clock, Star, Flame, Plus, Minus, ChefHat, TrendingUp, Zap } from 'lucide-react';
import type { MenuItem } from '@/app/data/menuData';
import { useCart } from '@/app/store/cartStore';

interface FoodCardProps {
  item: MenuItem;
  layout?: 'grid' | 'list';
}

export default function FoodCard({ item, layout = 'grid' }: FoodCardProps) {
  const navigate = useNavigate();
  const { addItem, removeItem, getItemQuantity, updateQuantity } = useCart();
  const [isFav, setIsFav] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const qty = getItemQuantity(item.id);

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsAdding(true);
    addItem({
      id: item.id,
      name: item.name,
      price: item.price,
      image: item.image,
      isVeg: item.dietType === 'veg',
    });
    setTimeout(() => setIsAdding(false), 300);
  };

  const handleIncrease = (e: React.MouseEvent) => {
    e.stopPropagation();
    updateQuantity(item.id, qty + 1);
  };

  const handleDecrease = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (qty === 1) removeItem(item.id);
    else updateQuantity(item.id, qty - 1);
  };

  const VegBadge = () => (
    <span
      className="w-4 h-4 flex-shrink-0 rounded-sm border-2 flex items-center justify-center"
      style={{
        borderColor: item.dietType === 'veg' ? '#22C55E' : item.dietType === 'egg' ? '#FACC15' : '#EF4444',
      }}
      title={item.dietType === 'veg' ? 'Veg' : item.dietType === 'egg' ? 'Contains Egg' : 'Non-Veg'}
    >
      <span
        className="w-2 h-2 rounded-full"
        style={{
          background: item.dietType === 'veg' ? '#22C55E' : item.dietType === 'egg' ? '#FACC15' : '#EF4444',
        }}
      />
    </span>
  );

  if (layout === 'list') {
    return (
      <div
        className="flex gap-3 p-3 rounded-2xl cursor-pointer active:scale-[0.99] transition-all duration-200"
        style={{ background: 'white', boxShadow: 'var(--app-shadow)' }}
        onClick={() => navigate(`/app/menu/${item.id}`)}
      >
        <div className="relative flex-shrink-0 w-24 h-24 rounded-xl overflow-hidden">
          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
          {item.discount && (
            <span
              className="absolute top-1 left-1 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-lg"
              style={{ background: 'var(--brand-orange)', fontFamily: 'var(--font-poppins)' }}
            >
              {item.discount}% OFF
            </span>
          )}
        </div>

        <div className="flex-1 min-w-0 flex flex-col justify-between">
          <div>
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-1.5 min-w-0">
                <VegBadge />
                <h3
                  className="text-sm font-semibold truncate"
                  style={{ fontFamily: 'var(--font-poppins)', color: 'var(--app-text)' }}
                >
                  {item.name}
                </h3>
              </div>
              <button
                onClick={(e) => { e.stopPropagation(); setIsFav(!isFav); }}
                className="flex-shrink-0 transition-transform active:scale-75"
              >
                <Heart size={16} fill={isFav ? '#EF4444' : 'none'} color={isFav ? '#EF4444' : '#CBD5E1'} />
              </button>
            </div>
            <p className="text-xs mt-0.5 line-clamp-2" style={{ color: 'var(--app-text-muted)', fontFamily: 'var(--font-inter)' }}>
              {item.desc}
            </p>
            <div className="flex items-center gap-2 mt-1">
              <div className="flex items-center gap-0.5">
                <Star size={11} fill="#FACC15" color="#FACC15" />
                <span className="text-[11px] font-medium" style={{ color: 'var(--app-text)', fontFamily: 'var(--font-inter)' }}>
                  {item.rating}
                </span>
              </div>
              <span style={{ color: '#CBD5E1' }}>·</span>
              <div className="flex items-center gap-0.5">
                <Clock size={11} style={{ color: 'var(--app-text-muted)' }} />
                <span className="text-[11px]" style={{ color: 'var(--app-text-muted)', fontFamily: 'var(--font-inter)' }}>
                  {item.prepTime}m
                </span>
              </div>
              {item.isSpicy && (
                <>
                  <span style={{ color: '#CBD5E1' }}>·</span>
                  <Flame size={11} color="#EF4444" />
                </>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between mt-1.5">
            <div className="flex items-baseline gap-1.5">
              <span className="text-base font-bold" style={{ fontFamily: 'var(--font-poppins)', color: 'var(--app-text)' }}>
                ₹{item.price}
              </span>
              {item.originalPrice && (
                <span className="text-xs line-through" style={{ color: '#CBD5E1', fontFamily: 'var(--font-inter)' }}>
                  ₹{item.originalPrice}
                </span>
              )}
            </div>

            {qty === 0 ? (
              <button
                onClick={handleAdd}
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-white text-xs font-bold transition-all active:scale-90"
                style={{
                  background: isAdding ? 'var(--brand-orange-dark)' : 'var(--brand-orange)',
                  fontFamily: 'var(--font-poppins)',
                  boxShadow: 'var(--app-shadow-orange)',
                  transform: isAdding ? 'scale(0.95)' : 'scale(1)',
                }}
              >
                <Plus size={12} />
                Add
              </button>
            ) : (
              <div
                className="flex items-center gap-2 rounded-xl overflow-hidden"
                style={{ background: 'var(--brand-orange)' }}
              >
                <button onClick={handleDecrease} className="w-7 h-7 flex items-center justify-center text-white active:scale-90 transition-transform">
                  <Minus size={12} />
                </button>
                <span className="text-xs font-bold text-white min-w-[16px] text-center" style={{ fontFamily: 'var(--font-poppins)' }}>
                  {qty}
                </span>
                <button onClick={handleIncrease} className="w-7 h-7 flex items-center justify-center text-white active:scale-90 transition-transform">
                  <Plus size={12} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Grid layout
  return (
    <div
      className="rounded-2xl overflow-hidden cursor-pointer transition-all duration-200 active:scale-[0.98]"
      style={{ background: 'white', boxShadow: 'var(--app-shadow)' }}
      onClick={() => navigate(`/app/menu/${item.id}`)}
    >
      {/* Image */}
      <div className="relative h-40 overflow-hidden">
        <img src={item.image} alt={item.name} className="w-full h-full object-cover transition-transform duration-500 hover:scale-110" />

        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

        {/* Badges top-left */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {item.isBestSeller && (
            <span
              className="text-white text-[9px] font-bold px-2 py-0.5 rounded-full flex items-center gap-0.5"
              style={{ background: 'var(--brand-orange)', fontFamily: 'var(--font-poppins)' }}
            >
              <TrendingUp size={9} />
              BEST SELLER
            </span>
          )}
          {item.isChefSpecial && !item.isBestSeller && (
            <span
              className="text-white text-[9px] font-bold px-2 py-0.5 rounded-full flex items-center gap-0.5"
              style={{ background: '#8B5CF6', fontFamily: 'var(--font-poppins)' }}
            >
              <ChefHat size={9} />
              CHEF'S SPECIAL
            </span>
          )}
          {item.isNew && (
            <span
              className="text-white text-[9px] font-bold px-2 py-0.5 rounded-full"
              style={{ background: '#22C55E', fontFamily: 'var(--font-poppins)' }}
            >
              NEW
            </span>
          )}
          {item.discount && !item.isBestSeller && !item.isChefSpecial && (
            <span
              className="text-white text-[9px] font-bold px-2 py-0.5 rounded-full"
              style={{ background: '#EF4444', fontFamily: 'var(--font-poppins)' }}
            >
              {item.discount}% OFF
            </span>
          )}
        </div>

        {/* Favourite */}
        <button
          onClick={(e) => { e.stopPropagation(); setIsFav(!isFav); }}
          className="absolute top-2 right-2 w-7 h-7 rounded-full flex items-center justify-center backdrop-blur-sm active:scale-75 transition-transform"
          style={{ background: 'rgba(255,255,255,0.85)' }}
        >
          <Heart size={14} fill={isFav ? '#EF4444' : 'none'} color={isFav ? '#EF4444' : '#94A3B8'} />
        </button>

        {/* Trending */}
        {item.isTrending && (
          <div className="absolute bottom-2 left-2 flex items-center gap-1">
            <Zap size={10} color="#FACC15" fill="#FACC15" />
            <span className="text-white text-[9px] font-semibold" style={{ fontFamily: 'var(--font-inter)' }}>Trending</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-3">
        <div className="flex items-start justify-between gap-1 mb-1">
          <div className="flex items-center gap-1.5 min-w-0">
            <VegBadge />
            <h3
              className="text-sm font-semibold line-clamp-1"
              style={{ fontFamily: 'var(--font-poppins)', color: 'var(--app-text)' }}
            >
              {item.name}
            </h3>
          </div>
        </div>

        <p className="text-[11px] line-clamp-2 mb-2 leading-relaxed" style={{ color: 'var(--app-text-muted)', fontFamily: 'var(--font-inter)' }}>
          {item.desc}
        </p>

        {/* Meta row */}
        <div className="flex items-center gap-2 mb-3 flex-wrap">
          <div className="flex items-center gap-0.5">
            <Star size={11} fill="#FACC15" color="#FACC15" />
            <span className="text-[11px] font-medium" style={{ color: 'var(--app-text)', fontFamily: 'var(--font-inter)' }}>
              {item.rating}
            </span>
            <span className="text-[10px]" style={{ color: '#CBD5E1', fontFamily: 'var(--font-inter)' }}>
              ({item.reviewCount > 999 ? `${Math.floor(item.reviewCount / 1000)}k` : item.reviewCount})
            </span>
          </div>
          <span style={{ color: '#E2E8F0' }}>•</span>
          <div className="flex items-center gap-0.5">
            <Clock size={11} style={{ color: 'var(--app-text-muted)' }} />
            <span className="text-[11px]" style={{ color: 'var(--app-text-muted)', fontFamily: 'var(--font-inter)' }}>
              {item.prepTime}m
            </span>
          </div>
          <span style={{ color: '#E2E8F0' }}>•</span>
          <span className="text-[11px]" style={{ color: 'var(--app-text-muted)', fontFamily: 'var(--font-inter)' }}>
            {item.calories} cal
          </span>
          {item.isSpicy && (
            <>
              <span style={{ color: '#E2E8F0' }}>•</span>
              <Flame size={11} color="#EF4444" />
            </>
          )}
        </div>

        {/* Price + Add */}
        <div className="flex items-center justify-between">
          <div className="flex items-baseline gap-1.5">
            <span className="text-base font-bold" style={{ fontFamily: 'var(--font-poppins)', color: 'var(--app-text)' }}>
              ₹{item.price}
            </span>
            {item.originalPrice && (
              <span className="text-xs line-through" style={{ color: '#CBD5E1', fontFamily: 'var(--font-inter)' }}>
                ₹{item.originalPrice}
              </span>
            )}
          </div>

          {qty === 0 ? (
            <button
              onClick={handleAdd}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-white text-xs font-bold transition-all active:scale-90"
              style={{
                background: 'var(--brand-orange)',
                fontFamily: 'var(--font-poppins)',
                boxShadow: '0 2px 12px rgba(255,107,53,0.35)',
                transform: isAdding ? 'scale(0.95)' : 'scale(1)',
              }}
            >
              <Plus size={12} />
              ADD
            </button>
          ) : (
            <div
              className="flex items-center rounded-xl overflow-hidden"
              style={{ background: 'var(--brand-orange)' }}
            >
              <button onClick={handleDecrease} className="w-7 h-7 flex items-center justify-center text-white active:scale-90 transition-transform">
                <Minus size={12} />
              </button>
              <span className="text-xs font-bold text-white min-w-[20px] text-center" style={{ fontFamily: 'var(--font-poppins)' }}>
                {qty}
              </span>
              <button onClick={handleIncrease} className="w-7 h-7 flex items-center justify-center text-white active:scale-90 transition-transform">
                <Plus size={12} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
