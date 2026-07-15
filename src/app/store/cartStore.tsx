import { createContext, useContext, useReducer, ReactNode } from 'react';

// ─── Types ────────────────────────────────────────────────────────────────────
export interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  isVeg: boolean;
  selectedCustomizations?: Record<string, string[]>;
  specialInstructions?: string;
}

interface CartState {
  items: CartItem[];
  couponCode: string;
  couponDiscount: number; // percentage
  tipAmount: number;
  tipPercent: number;
}

type CartAction =
  | { type: 'ADD_ITEM'; payload: Omit<CartItem, 'quantity'> }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { id: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'SET_COUPON'; payload: { code: string; discount: number } }
  | { type: 'REMOVE_COUPON' }
  | { type: 'SET_TIP'; payload: { amount: number; percent: number } };

// ─── Reducer ──────────────────────────────────────────────────────────────────
function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existing = state.items.find(i => i.id === action.payload.id);
      if (existing) {
        return {
          ...state,
          items: state.items.map(i =>
            i.id === action.payload.id ? { ...i, quantity: i.quantity + 1 } : i
          ),
        };
      }
      return { ...state, items: [...state.items, { ...action.payload, quantity: 1 }] };
    }
    case 'REMOVE_ITEM':
      return { ...state, items: state.items.filter(i => i.id !== action.payload) };
    case 'UPDATE_QUANTITY':
      if (action.payload.quantity <= 0) {
        return { ...state, items: state.items.filter(i => i.id !== action.payload.id) };
      }
      return {
        ...state,
        items: state.items.map(i =>
          i.id === action.payload.id ? { ...i, quantity: action.payload.quantity } : i
        ),
      };
    case 'CLEAR_CART':
      return { items: [], couponCode: '', couponDiscount: 0, tipAmount: 0, tipPercent: 0 };
    case 'SET_COUPON':
      return { ...state, couponCode: action.payload.code, couponDiscount: action.payload.discount };
    case 'REMOVE_COUPON':
      return { ...state, couponCode: '', couponDiscount: 0 };
    case 'SET_TIP':
      return { ...state, tipAmount: action.payload.amount, tipPercent: action.payload.percent };
    default:
      return state;
  }
}

const initialState: CartState = {
  items: [],
  couponCode: '',
  couponDiscount: 0,
  tipAmount: 0,
  tipPercent: 0,
};

// ─── Context ──────────────────────────────────────────────────────────────────
interface CartContextType {
  state: CartState;
  dispatch: React.Dispatch<CartAction>;
  itemCount: number;
  subtotal: number;
  gst: number;
  serviceCharge: number;
  couponSavings: number;
  grandTotal: number;
  addItem: (item: Omit<CartItem, 'quantity'>) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  getItemQuantity: (id: string) => number;
  setCoupon: (code: string, discount: number) => void;
  removeCoupon: () => void;
  setTip: (amount: number, percent: number) => void;
}

const CartContext = createContext<CartContextType | null>(null);

// ─── Provider ─────────────────────────────────────────────────────────────────
export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  const itemCount = state.items.reduce((acc, i) => acc + i.quantity, 0);
  const subtotal = state.items.reduce((acc, i) => acc + i.price * i.quantity, 0);
  const gst = Math.round(subtotal * 0.05);
  const serviceCharge = Math.round(subtotal * 0.1);
  const couponSavings = state.couponDiscount > 0 ? Math.round(subtotal * state.couponDiscount / 100) : 0;
  const grandTotal = Math.max(0, subtotal + gst + serviceCharge + state.tipAmount - couponSavings);

  const addItem = (item: Omit<CartItem, 'quantity'>) => dispatch({ type: 'ADD_ITEM', payload: item });
  const removeItem = (id: string) => dispatch({ type: 'REMOVE_ITEM', payload: id });
  const updateQuantity = (id: string, quantity: number) => dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } });
  const clearCart = () => dispatch({ type: 'CLEAR_CART' });
  const getItemQuantity = (id: string) => state.items.find(i => i.id === id)?.quantity ?? 0;
  const setCoupon = (code: string, discount: number) => dispatch({ type: 'SET_COUPON', payload: { code, discount } });
  const removeCoupon = () => dispatch({ type: 'REMOVE_COUPON' });
  const setTip = (amount: number, percent: number) => dispatch({ type: 'SET_TIP', payload: { amount, percent } });

  return (
    <CartContext.Provider value={{
      state, dispatch, itemCount, subtotal, gst, serviceCharge,
      couponSavings, grandTotal, addItem, removeItem, updateQuantity,
      clearCart, getItemQuantity, setCoupon, removeCoupon, setTip,
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
