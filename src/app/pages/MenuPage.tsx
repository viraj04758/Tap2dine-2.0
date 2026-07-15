import { useState, useMemo, useRef } from 'react';
import { Search, X, SlidersHorizontal, LayoutGrid, List, Bell } from 'lucide-react';
import Navbar from '@/app/components/app/Navbar';
import BottomNav from '@/app/components/app/BottomNav';
import FoodCard from '@/app/components/app/FoodCard';
import CartFloatingButton from '@/app/components/app/CartFloatingButton';
import CallWaiterSheet from '@/app/components/app/CallWaiterSheet';
import { MENU_ITEMS, MENU_CATEGORIES } from '@/app/data/menuData';
import type { MenuItem } from '@/app/data/menuData';
import { Toaster } from 'sonner';

type Filter = 'veg' | 'nonveg' | 'jain' | 'spicy' | 'bestseller' | 'chefspecial';
type SortKey = 'popular' | 'rating' | 'price_low' | 'price_high' | 'time';

const FILTER_CHIPS: { id: Filter; label: string; emoji: string }[] = [
  { id: 'veg',        label: 'Veg',          emoji: '🥦' },
  { id: 'nonveg',     label: 'Non-Veg',      emoji: '🍗' },
  { id: 'jain',       label: 'Jain',         emoji: '🌿' },
  { id: 'spicy',      label: 'Spicy 🌶️',     emoji: '' },
  { id: 'bestseller', label: 'Best Sellers', emoji: '🔥' },
  { id: 'chefspecial',label: "Chef's Pick",  emoji: '👨‍🍳' },
];

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: 'popular',    label: 'Most Popular' },
  { value: 'rating',     label: 'Top Rated' },
  { value: 'price_low',  label: 'Price: Low to High' },
  { value: 'price_high', label: 'Price: High to Low' },
  { value: 'time',       label: 'Fastest First' },
];

function applyFilter(items: MenuItem[], filters: Set<Filter>): MenuItem[] {
  if (filters.size === 0) return items;
  return items.filter(item => {
    if (filters.has('veg')        && item.dietType !== 'veg')    return false;
    if (filters.has('nonveg')     && item.dietType !== 'nonveg') return false;
    if (filters.has('jain')       && !item.isJain)               return false;
    if (filters.has('spicy')      && !item.isSpicy)              return false;
    if (filters.has('bestseller') && !item.isBestSeller)         return false;
    if (filters.has('chefspecial')&& !item.isChefSpecial)        return false;
    return true;
  });
}

function applySort(items: MenuItem[], sort: SortKey): MenuItem[] {
  const copy = [...items];
  switch (sort) {
    case 'rating':     return copy.sort((a, b) => b.rating - a.rating);
    case 'price_low':  return copy.sort((a, b) => a.price - b.price);
    case 'price_high': return copy.sort((a, b) => b.price - a.price);
    case 'time':       return copy.sort((a, b) => a.prepTime - b.prepTime);
    case 'popular':    return copy.sort((a, b) => b.reviewCount - a.reviewCount);
    default:           return copy;
  }
}

export default function MenuPage() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [activeFilters, setActiveFilters] = useState<Set<Filter>>(new Set());
  const [sortBy, setSortBy] = useState<SortKey>('popular');
  const [layout, setLayout] = useState<'grid' | 'list'>('grid');
  const [showSort, setShowSort] = useState(false);
  const [showWaiter, setShowWaiter] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);

  const toggleFilter = (f: Filter) => {
    setActiveFilters(prev => {
      const n = new Set(prev);
      if (n.has(f)) n.delete(f);
      else n.add(f);
      return n;
    });
  };

  const filteredItems = useMemo(() => {
    let items = MENU_ITEMS;

    // Category filter
    if (activeCategory !== 'all') {
      items = items.filter(i => i.category === activeCategory);
    }

    // Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      items = items.filter(i =>
        i.name.toLowerCase().includes(q) ||
        i.desc.toLowerCase().includes(q) ||
        i.ingredients?.some(ing => ing.toLowerCase().includes(q))
      );
    }

    // Chip filters
    items = applyFilter(items, activeFilters);

    // Sort
    items = applySort(items, sortBy);

    return items;
  }, [activeCategory, searchQuery, activeFilters, sortBy]);

  const trendingItems = useMemo(() =>
    MENU_ITEMS.filter(i => i.isTrending).slice(0, 6),
    []
  );

  return (
    <div className="min-h-screen pb-36" style={{ background: 'var(--app-bg)', fontFamily: 'var(--font-poppins)' }}>
      <Toaster position="top-center" richColors />

      {/* Navbar */}
      <Navbar
        showSearch={false}
        onSearchClick={() => { setIsSearching(true); setTimeout(() => searchRef.current?.focus(), 100); }}
      />

      {/* Search bar — always visible below navbar */}
      <div className="px-4 pt-3 pb-2 sticky top-16 z-40" style={{ background: 'var(--app-bg)' }}>
        <div
          className="flex items-center gap-3 px-4 py-3 rounded-2xl"
          style={{ background: 'white', boxShadow: 'var(--app-shadow)' }}
        >
          <Search size={18} style={{ color: '#94A3B8', flexShrink: 0 }} />
          <input
            ref={searchRef}
            type="text"
            placeholder="Search dishes, ingredients..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            onFocus={() => setIsSearching(true)}
            className="flex-1 bg-transparent text-sm outline-none"
            style={{ color: 'var(--app-text)', fontFamily: 'var(--font-inter)' }}
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="transition-transform active:scale-90">
              <X size={16} style={{ color: '#94A3B8' }} />
            </button>
          )}
          <div className="w-px h-5" style={{ background: '#E2E8F0' }} />
          <button
            onClick={() => setShowSort(!showSort)}
            className="flex items-center gap-1 transition-colors"
            style={{ color: showSort ? 'var(--brand-orange)' : '#94A3B8' }}
          >
            <SlidersHorizontal size={18} />
          </button>
        </div>

        {/* Sort dropdown */}
        {showSort && (
          <div
            className="mt-2 rounded-2xl overflow-hidden"
            style={{ background: 'white', boxShadow: 'var(--app-shadow-lg)' }}
          >
            {SORT_OPTIONS.map(opt => (
              <button
                key={opt.value}
                onClick={() => { setSortBy(opt.value); setShowSort(false); }}
                className="w-full flex items-center justify-between px-4 py-3 text-sm hover:bg-gray-50 transition-colors border-b last:border-b-0"
                style={{
                  borderColor: '#F1F5F9',
                  color: sortBy === opt.value ? 'var(--brand-orange)' : 'var(--app-text)',
                  fontFamily: 'var(--font-inter)',
                  fontWeight: sortBy === opt.value ? 600 : 400,
                }}
              >
                {opt.label}
                {sortBy === opt.value && <span>✓</span>}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Category Tabs */}
      <div className="overflow-x-auto scrollbar-none px-4 mb-3">
        <div className="flex gap-2 pb-1" style={{ minWidth: 'max-content' }}>
          {MENU_CATEGORIES.map(cat => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200 active:scale-95"
                style={{
                  background: isActive ? 'var(--brand-orange)' : 'white',
                  color: isActive ? 'white' : 'var(--app-text-muted)',
                  boxShadow: isActive ? 'var(--app-shadow-orange)' : 'var(--app-shadow)',
                  fontFamily: 'var(--font-poppins)',
                  fontWeight: isActive ? 600 : 500,
                }}
              >
                {cat.emoji && <span>{cat.emoji}</span>}
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Filter chips */}
      <div className="overflow-x-auto scrollbar-none px-4 mb-4">
        <div className="flex gap-2 pb-1" style={{ minWidth: 'max-content' }}>
          {FILTER_CHIPS.map(chip => {
            const isActive = activeFilters.has(chip.id);
            return (
              <button
                key={chip.id}
                onClick={() => toggleFilter(chip.id)}
                className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all duration-200 active:scale-95"
                style={{
                  background: isActive ? 'var(--brand-orange-light)' : '#F8FAFC',
                  color: isActive ? 'var(--brand-orange)' : 'var(--app-text-muted)',
                  border: `1.5px solid ${isActive ? 'var(--brand-orange)' : '#E2E8F0'}`,
                  fontFamily: 'var(--font-inter)',
                  fontWeight: isActive ? 600 : 400,
                }}
              >
                {chip.emoji && <span>{chip.emoji}</span>}
                {chip.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Trending Section — only show when no filters/search */}
      {!searchQuery && activeCategory === 'all' && activeFilters.size === 0 && (
        <div className="mb-4">
          <div className="px-4 mb-3 flex items-center justify-between">
            <h2 className="text-base font-bold" style={{ color: 'var(--app-text)' }}>
              🔥 Trending Now
            </h2>
            <span className="text-xs" style={{ color: 'var(--brand-orange)', fontFamily: 'var(--font-inter)' }}>
              {trendingItems.length} dishes
            </span>
          </div>
          <div className="overflow-x-auto scrollbar-none px-4">
            <div className="flex gap-3 pb-1" style={{ minWidth: 'max-content' }}>
              {trendingItems.map(item => (
                <div key={item.id} style={{ width: 160 }}>
                  <FoodCard item={item} layout="grid" />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Layout toggle + results count */}
      <div className="px-4 mb-3 flex items-center justify-between">
        <p className="text-sm font-medium" style={{ color: 'var(--app-text-muted)', fontFamily: 'var(--font-inter)' }}>
          {filteredItems.length} {filteredItems.length === 1 ? 'dish' : 'dishes'}
          {activeCategory !== 'all' && ` in ${MENU_CATEGORIES.find(c => c.id === activeCategory)?.label}`}
        </p>
        <div className="flex items-center gap-1 p-1 rounded-xl" style={{ background: '#F1F5F9' }}>
          {(['grid', 'list'] as const).map(l => (
            <button
              key={l}
              onClick={() => setLayout(l)}
              className="p-1.5 rounded-lg transition-all"
              style={{ background: layout === l ? 'white' : 'transparent' }}
            >
              {l === 'grid' ? <LayoutGrid size={16} style={{ color: layout === l ? 'var(--brand-orange)' : '#94A3B8' }} />
                           : <List size={16} style={{ color: layout === l ? 'var(--brand-orange)' : '#94A3B8' }} />}
            </button>
          ))}
        </div>
      </div>

      {/* Food Items */}
      <div className="px-4">
        {filteredItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <p className="text-5xl mb-4">🔍</p>
            <h3 className="text-base font-bold mb-2" style={{ color: 'var(--app-text)', fontFamily: 'var(--font-poppins)' }}>
              No dishes found
            </h3>
            <p className="text-sm" style={{ color: 'var(--app-text-muted)', fontFamily: 'var(--font-inter)' }}>
              Try adjusting your filters or search query
            </p>
            <button
              onClick={() => { setSearchQuery(''); setActiveFilters(new Set()); setActiveCategory('all'); }}
              className="mt-4 px-4 py-2 rounded-xl text-sm font-semibold"
              style={{ background: 'var(--brand-orange-light)', color: 'var(--brand-orange)', fontFamily: 'var(--font-poppins)' }}
            >
              Clear Filters
            </button>
          </div>
        ) : layout === 'grid' ? (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {filteredItems.map(item => (
              <FoodCard key={item.id} item={item} layout="grid" />
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {filteredItems.map(item => (
              <FoodCard key={item.id} item={item} layout="list" />
            ))}
          </div>
        )}
      </div>

      {/* Floating cart */}
      <CartFloatingButton />

      {/* Call Waiter FAB */}
      <button
        onClick={() => setShowWaiter(true)}
        className="fixed right-4 bottom-24 z-40 w-12 h-12 rounded-full flex items-center justify-center text-white text-xl transition-all active:scale-90"
        style={{
          background: 'linear-gradient(135deg, #1E293B 0%, #334155 100%)',
          boxShadow: '0 4px 20px rgba(30,41,59,0.4)',
        }}
        aria-label="Call Waiter"
        title="Call Waiter"
      >
        <Bell size={20} />
      </button>

      <CallWaiterSheet isOpen={showWaiter} onClose={() => setShowWaiter(false)} />

      <BottomNav />
    </div>
  );
}
