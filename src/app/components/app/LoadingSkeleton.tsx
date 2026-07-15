export function FoodCardSkeleton() {
  return (
    <div className="rounded-2xl overflow-hidden" style={{ background: 'white', boxShadow: 'var(--app-shadow)' }}>
      <div className="h-40 animate-pulse" style={{ background: '#F1F5F9' }} />
      <div className="p-3 space-y-2">
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-4 rounded-sm animate-pulse" style={{ background: '#F1F5F9' }} />
          <div className="h-4 rounded-lg w-3/4 animate-pulse" style={{ background: '#F1F5F9' }} />
        </div>
        <div className="h-3 rounded-lg w-full animate-pulse" style={{ background: '#F1F5F9' }} />
        <div className="h-3 rounded-lg w-2/3 animate-pulse" style={{ background: '#F1F5F9' }} />
        <div className="flex justify-between items-center pt-1">
          <div className="h-5 rounded-lg w-16 animate-pulse" style={{ background: '#F1F5F9' }} />
          <div className="h-8 rounded-xl w-16 animate-pulse" style={{ background: '#F1F5F9' }} />
        </div>
      </div>
    </div>
  );
}

export function MenuPageSkeleton() {
  return (
    <div className="px-4 py-4">
      {/* Search skeleton */}
      <div className="h-12 rounded-2xl w-full animate-pulse mb-4" style={{ background: '#F1F5F9' }} />

      {/* Category tabs */}
      <div className="flex gap-2 mb-4 overflow-hidden">
        {[100, 120, 90, 110, 80].map((w, i) => (
          <div key={i} className="h-9 rounded-full flex-shrink-0 animate-pulse" style={{ background: '#F1F5F9', width: w }} />
        ))}
      </div>

      {/* Cards grid */}
      <div className="grid grid-cols-2 gap-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <FoodCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}

export function OrderTrackingSkeleton() {
  return (
    <div className="px-4 py-6 space-y-4">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full animate-pulse flex-shrink-0" style={{ background: '#F1F5F9' }} />
          <div className="flex-1 space-y-1.5">
            <div className="h-4 rounded-lg w-1/2 animate-pulse" style={{ background: '#F1F5F9' }} />
            <div className="h-3 rounded-lg w-3/4 animate-pulse" style={{ background: '#F1F5F9' }} />
          </div>
        </div>
      ))}
    </div>
  );
}
