import { useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { Star, Clock, Flame, ChefHat, Heart, Plus, Minus, ShoppingCart, Info, TrendingUp } from 'lucide-react';
import { getItemById, getRecommendedItems } from '@/app/data/menuData';
import { useCart } from '@/app/store/cartStore';
import Navbar from '@/app/components/app/Navbar';
import FoodCard from '@/app/components/app/FoodCard';
import BottomNav from '@/app/components/app/BottomNav';
import { toast } from 'sonner';
import { Toaster } from 'sonner';

export default function FoodDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addItem, getItemQuantity, updateQuantity, removeItem } = useCart();
  const [isFav, setIsFav] = useState(false);
  const [qty, setQty] = useState(1);
  const [spiceLevel, setSpiceLevel] = useState<'mild' | 'medium' | 'hot'>('medium');
  const [specialNote, setSpecialNote] = useState('');
  const [activeTab, setActiveTab] = useState<'about' | 'nutrition' | 'reviews'>('about');

  const item = id ? getItemById(id) : undefined;
  const recommended = id ? getRecommendedItems(id, 4) : [];
  const cartQty = id ? getItemQuantity(id) : 0;

  if (!item) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--app-bg)' }}>
        <div className="text-center px-4">
          <p className="text-5xl mb-4">🍽️</p>
          <h2 className="text-lg font-bold mb-2" style={{ fontFamily: 'var(--font-poppins)', color: 'var(--app-text)' }}>
            Dish not found
          </h2>
          <button
            onClick={() => navigate('/app/menu')}
            className="mt-2 px-4 py-2 rounded-xl text-sm font-semibold text-white"
            style={{ background: 'var(--brand-orange)' }}
          >
            Browse Menu
          </button>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    addItem({ id: item.id, name: item.name, price: item.price, image: item.image, isVeg: item.dietType === 'veg' });
    updateQuantity(item.id, qty);
    toast.success(`${item.name} added to cart!`, {
      description: `Qty: ${qty} · ₹${item.price * qty}`,
      duration: 2500,
    });
    navigate(-1);
  };

  const VegIndicator = () => (
    <span
      className="inline-flex items-center justify-center w-5 h-5 rounded border-2"
      style={{ borderColor: item.dietType === 'veg' ? '#22C55E' : item.dietType === 'egg' ? '#FACC15' : '#EF4444' }}
    >
      <span
        className="w-2.5 h-2.5 rounded-full"
        style={{ background: item.dietType === 'veg' ? '#22C55E' : item.dietType === 'egg' ? '#FACC15' : '#EF4444' }}
      />
    </span>
  );

  return (
    <div className="min-h-screen pb-32" style={{ background: 'var(--app-bg)', fontFamily: 'var(--font-poppins)' }}>
      <Toaster position="top-center" richColors />
      <Navbar title={item.name} showBack showSearch={false} />

      {/* Hero Image */}
      <div className="relative h-72 overflow-hidden">
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

        {/* Badges */}
        <div className="absolute top-4 left-4 flex flex-wrap gap-2">
          {item.isBestSeller && (
            <span className="text-white text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1"
              style={{ background: 'var(--brand-orange)', fontFamily: 'var(--font-poppins)' }}>
              <TrendingUp size={11} /> BEST SELLER
            </span>
          )}
          {item.isChefSpecial && (
            <span className="text-white text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1"
              style={{ background: '#8B5CF6' }}>
              <ChefHat size={11} /> CHEF'S SPECIAL
            </span>
          )}
          {item.discount && (
            <span className="text-white text-xs font-bold px-2.5 py-1 rounded-full"
              style={{ background: '#EF4444' }}>
              {item.discount}% OFF
            </span>
          )}
        </div>

        {/* Fav button */}
        <button
          onClick={() => setIsFav(!isFav)}
          className="absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-sm active:scale-75 transition-transform"
          style={{ background: 'rgba(255,255,255,0.9)' }}
        >
          <Heart size={18} fill={isFav ? '#EF4444' : 'none'} color={isFav ? '#EF4444' : '#64748B'} />
        </button>
      </div>

      {/* Content */}
      <div
        className="relative -mt-5 rounded-t-3xl pt-5 px-4"
        style={{ background: 'var(--app-bg)' }}
      >
        {/* Name & diet */}
        <div className="flex items-start justify-between gap-3 mb-2">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <VegIndicator />
              <h1 className="text-xl font-bold" style={{ color: 'var(--app-text)' }}>
                {item.name}
              </h1>
            </div>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--app-text-muted)', fontFamily: 'var(--font-inter)' }}>
              {item.desc}
            </p>
          </div>
        </div>

        {/* Meta chips */}
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <div className="flex items-center gap-1 px-3 py-1.5 rounded-full" style={{ background: '#FFF9C4' }}>
            <Star size={12} fill="#FACC15" color="#FACC15" />
            <span className="text-xs font-bold" style={{ color: '#92400E' }}>{item.rating}</span>
            <span className="text-xs" style={{ color: '#B45309' }}>({item.reviewCount.toLocaleString()})</span>
          </div>
          <div className="flex items-center gap-1 px-3 py-1.5 rounded-full" style={{ background: '#EFF6FF' }}>
            <Clock size={12} style={{ color: '#3B82F6' }} />
            <span className="text-xs font-medium" style={{ color: '#1D4ED8' }}>{item.prepTime} min</span>
          </div>
          <div className="flex items-center gap-1 px-3 py-1.5 rounded-full" style={{ background: '#F0FDF4' }}>
            <span className="text-xs font-medium" style={{ color: '#166534' }}>🔥 {item.calories} cal</span>
          </div>
          {item.isSpicy && (
            <div className="flex items-center gap-1 px-3 py-1.5 rounded-full" style={{ background: '#FEF2F2' }}>
              <Flame size={12} color="#EF4444" />
              <span className="text-xs font-medium" style={{ color: '#DC2626' }}>Spicy</span>
            </div>
          )}
        </div>

        {/* Price */}
        <div className="flex items-baseline gap-3 mb-5 pb-4 border-b" style={{ borderColor: '#F1F5F9' }}>
          <span className="text-2xl font-bold" style={{ color: 'var(--app-text)' }}>₹{item.price}</span>
          {item.originalPrice && (
            <>
              <span className="text-base line-through" style={{ color: '#CBD5E1' }}>₹{item.originalPrice}</span>
              <span className="text-sm font-semibold px-2 py-0.5 rounded-full"
                style={{ background: 'var(--brand-orange-light)', color: 'var(--brand-orange)' }}>
                Save ₹{item.originalPrice - item.price}
              </span>
            </>
          )}
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-4 border-b" style={{ borderColor: '#F1F5F9' }}>
          {(['about', 'nutrition', 'reviews'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className="pb-2 text-sm font-semibold capitalize transition-colors"
              style={{
                color: activeTab === tab ? 'var(--brand-orange)' : 'var(--app-text-muted)',
                borderBottom: activeTab === tab ? '2px solid var(--brand-orange)' : '2px solid transparent',
                fontFamily: 'var(--font-poppins)',
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab content */}
        {activeTab === 'about' && (
          <div className="space-y-4 mb-6">
            {item.ingredients && item.ingredients.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold mb-2" style={{ color: 'var(--app-text)' }}>Ingredients</h3>
                <div className="flex flex-wrap gap-2">
                  {item.ingredients.map(ing => (
                    <span key={ing} className="px-3 py-1 rounded-full text-xs" style={{ background: '#F8FAFC', color: 'var(--app-text-muted)', border: '1px solid #E2E8F0', fontFamily: 'var(--font-inter)' }}>
                      {ing}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {item.allergens && item.allergens.length > 0 && (
              <div
                className="flex items-start gap-2 p-3 rounded-xl"
                style={{ background: '#FEF9EC', border: '1px solid #FDE68A' }}
              >
                <Info size={16} color="#D97706" className="flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-semibold mb-0.5" style={{ color: '#92400E' }}>Allergen Warning</p>
                  <p className="text-xs" style={{ color: '#B45309', fontFamily: 'var(--font-inter)' }}>
                    Contains: {item.allergens.join(', ')}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'nutrition' && item.nutritionPer100g && (
          <div className="mb-6">
            <p className="text-xs mb-3" style={{ color: 'var(--app-text-muted)', fontFamily: 'var(--font-inter)' }}>Per 100g serving</p>
            <div className="grid grid-cols-4 gap-2">
              {[
                { label: 'Protein', val: item.nutritionPer100g.protein, unit: 'g', color: '#3B82F6' },
                { label: 'Carbs',   val: item.nutritionPer100g.carbs,   unit: 'g', color: '#F59E0B' },
                { label: 'Fat',     val: item.nutritionPer100g.fat,     unit: 'g', color: '#EF4444' },
                { label: 'Fiber',   val: item.nutritionPer100g.fiber,   unit: 'g', color: '#22C55E' },
              ].map(n => (
                <div key={n.label} className="p-3 rounded-2xl text-center" style={{ background: 'white', boxShadow: 'var(--app-shadow)' }}>
                  <p className="text-lg font-bold" style={{ color: n.color, fontFamily: 'var(--font-poppins)' }}>
                    {n.val}{n.unit}
                  </p>
                  <p className="text-[10px] mt-0.5" style={{ color: 'var(--app-text-muted)', fontFamily: 'var(--font-inter)' }}>
                    {n.label}
                  </p>
                </div>
              ))}
            </div>
            <div className="mt-3 p-3 rounded-xl text-center" style={{ background: '#F0FDF4' }}>
              <p className="text-sm font-bold" style={{ color: '#166534', fontFamily: 'var(--font-poppins)' }}>
                {item.calories} kcal total
              </p>
            </div>
          </div>
        )}

        {activeTab === 'reviews' && (
          <div className="mb-6 space-y-3">
            {[
              { name: 'Aanya S.', rating: 5, comment: 'Absolutely delicious! The spices are perfectly balanced.', date: '2 days ago', verified: true },
              { name: 'Rohan M.', rating: 4, comment: 'Great taste, generous portion. Would order again!', date: '1 week ago', verified: true },
              { name: 'Priya K.', rating: 5, comment: "This is the best dish I've had in a long time. Highly recommend!", date: '2 weeks ago', verified: false },
            ].map((review, i) => (
              <div key={i} className="p-3 rounded-2xl" style={{ background: 'white', boxShadow: 'var(--app-shadow)' }}>
                <div className="flex items-start justify-between mb-1.5">
                  <div>
                    <p className="text-sm font-semibold" style={{ color: 'var(--app-text)', fontFamily: 'var(--font-poppins)' }}>
                      {review.name}
                      {review.verified && (
                        <span className="ml-1.5 text-[9px] px-1.5 py-0.5 rounded-full" style={{ background: '#ECFDF5', color: '#059669' }}>
                          ✓ Verified
                        </span>
                      )}
                    </p>
                    <div className="flex gap-0.5 mt-0.5">
                      {Array.from({ length: 5 }).map((_, j) => (
                        <Star key={j} size={11} fill={j < review.rating ? '#FACC15' : 'none'} color={j < review.rating ? '#FACC15' : '#E2E8F0'} />
                      ))}
                    </div>
                  </div>
                  <span className="text-[10px]" style={{ color: 'var(--app-text-muted)', fontFamily: 'var(--font-inter)' }}>
                    {review.date}
                  </span>
                </div>
                <p className="text-xs leading-relaxed" style={{ color: 'var(--app-text-muted)', fontFamily: 'var(--font-inter)' }}>
                  {review.comment}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Spice selector */}
        {item.isSpicy && (
          <div className="mb-5">
            <h3 className="text-sm font-semibold mb-3" style={{ color: 'var(--app-text)' }}>Spice Level</h3>
            <div className="flex gap-2">
              {(['mild', 'medium', 'hot'] as const).map(level => (
                <button
                  key={level}
                  onClick={() => setSpiceLevel(level)}
                  className="flex-1 py-2 rounded-xl text-xs font-semibold capitalize transition-all active:scale-95"
                  style={{
                    background: spiceLevel === level ? 'var(--brand-orange)' : '#F8FAFC',
                    color: spiceLevel === level ? 'white' : 'var(--app-text-muted)',
                    border: `1.5px solid ${spiceLevel === level ? 'var(--brand-orange)' : '#E2E8F0'}`,
                    fontFamily: 'var(--font-poppins)',
                  }}
                >
                  {level === 'hot' ? '🌶️ Hot' : level === 'medium' ? '🌶 Medium' : '😌 Mild'}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Special instructions */}
        <div className="mb-5">
          <h3 className="text-sm font-semibold mb-2" style={{ color: 'var(--app-text)' }}>
            Special Instructions <span style={{ color: 'var(--app-text-muted)', fontWeight: 400 }}>(optional)</span>
          </h3>
          <textarea
            rows={2}
            placeholder="E.g. Less spice, no onion, extra sauce..."
            value={specialNote}
            onChange={e => setSpecialNote(e.target.value)}
            className="w-full px-3 py-2.5 rounded-xl text-sm resize-none outline-none transition-all"
            style={{
              background: '#F8FAFC',
              border: '1.5px solid #E2E8F0',
              color: 'var(--app-text)',
              fontFamily: 'var(--font-inter)',
            }}
            onFocus={e => e.target.style.borderColor = 'var(--brand-orange)'}
            onBlur={e => e.target.style.borderColor = '#E2E8F0'}
          />
        </div>

        {/* Recommended */}
        {recommended.length > 0 && (
          <div className="mb-6">
            <h3 className="text-sm font-semibold mb-3" style={{ color: 'var(--app-text)' }}>You Might Also Like</h3>
            <div className="overflow-x-auto scrollbar-none">
              <div className="flex gap-3 pb-1" style={{ minWidth: 'max-content' }}>
                {recommended.map(rec => (
                  <div key={rec.id} style={{ width: 155 }}>
                    <FoodCard item={rec} layout="grid" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Fixed bottom bar */}
      <div
        className="fixed bottom-0 left-0 right-0 z-50 px-4 pb-4 pt-3"
        style={{ background: 'rgba(255,255,255,0.97)', backdropFilter: 'blur(12px)', borderTop: '1px solid #F1F5F9' }}
      >
        <div className="max-w-xl mx-auto flex items-center gap-3">
          {/* Quantity control */}
          <div
            className="flex items-center gap-3 rounded-2xl px-3 py-2"
            style={{ background: '#F8FAFC', border: '1.5px solid #E2E8F0' }}
          >
            <button
              onClick={() => setQty(q => Math.max(1, q - 1))}
              className="w-7 h-7 rounded-full flex items-center justify-center active:scale-90 transition-transform"
              style={{ background: qty > 1 ? 'var(--brand-orange-light)' : '#E2E8F0' }}
            >
              <Minus size={14} style={{ color: qty > 1 ? 'var(--brand-orange)' : '#94A3B8' }} />
            </button>
            <span className="text-base font-bold min-w-[20px] text-center" style={{ color: 'var(--app-text)', fontFamily: 'var(--font-poppins)' }}>
              {qty}
            </span>
            <button
              onClick={() => setQty(q => q + 1)}
              className="w-7 h-7 rounded-full flex items-center justify-center active:scale-90 transition-transform"
              style={{ background: 'var(--brand-orange-light)' }}
            >
              <Plus size={14} style={{ color: 'var(--brand-orange)' }} />
            </button>
          </div>

          {/* Add to Cart */}
          <button
            onClick={handleAddToCart}
            className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl text-white font-bold text-sm transition-all active:scale-[0.98]"
            style={{
              background: 'linear-gradient(135deg, var(--brand-orange) 0%, var(--brand-orange-dark) 100%)',
              boxShadow: 'var(--app-shadow-orange)',
              fontFamily: 'var(--font-poppins)',
            }}
          >
            <ShoppingCart size={18} />
            Add to Cart · ₹{(item.price * qty).toLocaleString('en-IN')}
          </button>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
