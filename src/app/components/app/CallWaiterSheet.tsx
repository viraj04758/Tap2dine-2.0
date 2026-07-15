import { useState } from 'react';
import { X } from 'lucide-react';
import { toast } from 'sonner';

const WAITER_OPTIONS = [
  { id: 'water',     emoji: '💧', label: 'Water',          desc: 'Request drinking water' },
  { id: 'bill',      emoji: '🧾', label: 'Bill',           desc: 'Request your bill' },
  { id: 'cutlery',   emoji: '🍴', label: 'Cutlery',        desc: 'Need extra cutlery' },
  { id: 'cleaning',  emoji: '🧹', label: 'Clean Table',    desc: 'Clean the table' },
  { id: 'assist',    emoji: '🙋', label: 'Need Help',      desc: 'General assistance' },
];

interface CallWaiterSheetProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CallWaiterSheet({ isOpen, onClose }: CallWaiterSheetProps) {
  const [sent, setSent] = useState<string | null>(null);

  const handleRequest = (option: typeof WAITER_OPTIONS[0]) => {
    setSent(option.id);
    toast.success(`Waiter notified: ${option.label}`, {
      description: 'A team member will assist you shortly.',
      duration: 4000,
    });
    setTimeout(() => {
      setSent(null);
      onClose();
    }, 1500);
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
        style={{ animation: 'fadeIn 0.2s ease' }}
      />

      {/* Sheet */}
      <div
        className="fixed bottom-0 left-0 right-0 z-50 rounded-t-3xl overflow-hidden"
        style={{
          background: 'white',
          animation: 'slideUp 0.3s cubic-bezier(0.32, 0.72, 0, 1)',
          boxShadow: '0 -8px 40px rgba(0,0,0,0.15)',
          maxHeight: '70vh',
        }}
      >
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full" style={{ background: '#E2E8F0' }} />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b" style={{ borderColor: '#F1F5F9' }}>
          <div>
            <h2 className="text-base font-bold" style={{ fontFamily: 'var(--font-poppins)', color: 'var(--app-text)' }}>
              Call Waiter 🙋
            </h2>
            <p className="text-xs mt-0.5" style={{ color: 'var(--app-text-muted)', fontFamily: 'var(--font-inter)' }}>
              Select what you need — we'll be right there
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center"
            style={{ background: '#F1F5F9' }}
          >
            <X size={16} style={{ color: 'var(--app-text-muted)' }} />
          </button>
        </div>

        {/* Options */}
        <div className="p-4 grid grid-cols-2 gap-3 overflow-y-auto">
          {WAITER_OPTIONS.map((option) => {
            const isSending = sent === option.id;
            return (
              <button
                key={option.id}
                onClick={() => handleRequest(option)}
                disabled={sent !== null}
                className="p-4 rounded-2xl text-left transition-all active:scale-95"
                style={{
                  background: isSending ? 'var(--brand-orange-light)' : '#FAFAFA',
                  border: `2px solid ${isSending ? 'var(--brand-orange)' : '#F1F5F9'}`,
                  cursor: sent ? 'not-allowed' : 'pointer',
                  opacity: sent && !isSending ? 0.5 : 1,
                }}
              >
                <span className="text-3xl block mb-2">{option.emoji}</span>
                <p className="font-semibold text-sm" style={{ fontFamily: 'var(--font-poppins)', color: 'var(--app-text)' }}>
                  {option.label}
                </p>
                <p className="text-[11px] mt-0.5" style={{ color: 'var(--app-text-muted)', fontFamily: 'var(--font-inter)' }}>
                  {option.desc}
                </p>
                {isSending && (
                  <p className="text-xs font-semibold mt-1" style={{ color: 'var(--brand-orange)', fontFamily: 'var(--font-poppins)' }}>
                    ✓ Sent!
                  </p>
                )}
              </button>
            );
          })}
        </div>

        <div className="h-6" /> {/* safe area spacing */}
      </div>

      <style>{`
        @keyframes slideUp {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </>
  );
}
