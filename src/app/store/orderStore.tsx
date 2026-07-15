import { createContext, useContext, useState, ReactNode } from 'react';

// ─── Types ────────────────────────────────────────────────────────────────────
export type OrderStatus = 'received' | 'preparing' | 'cooking' | 'ready' | 'served';

export interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  isVeg: boolean;
}

export interface Order {
  id: string;
  tableNumber: number;
  items: OrderItem[];
  total: number;
  status: OrderStatus;
  placedAt: Date;
  estimatedTime: number; // minutes
  specialInstructions?: string;
}

export const ORDER_STATUS_STEPS: { status: OrderStatus; label: string; icon: string; desc: string }[] = [
  { status: 'received',  label: 'Order Received',  icon: '✅', desc: 'Your order has been placed' },
  { status: 'preparing', label: 'Preparing',        icon: '👨‍🍳', desc: 'Chef is getting ingredients ready' },
  { status: 'cooking',   label: 'Cooking',          icon: '🍳', desc: 'Your food is being cooked' },
  { status: 'ready',     label: 'Ready to Serve',   icon: '🔔', desc: 'Food is ready!' },
  { status: 'served',    label: 'Served',            icon: '🎉', desc: 'Enjoy your meal!' },
];

// ─── Context ──────────────────────────────────────────────────────────────────
interface OrderContextType {
  currentOrder: Order | null;
  tableNumber: number;
  setTableNumber: (n: number) => void;
  placeOrder: (data: Omit<Order, 'id' | 'status' | 'placedAt'>) => Order;
  updateOrderStatus: (status: OrderStatus) => void;
  clearOrder: () => void;
}

const OrderContext = createContext<OrderContextType | null>(null);

// ─── Provider ─────────────────────────────────────────────────────────────────
export function OrderProvider({ children }: { children: ReactNode }) {
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
  const [tableNumber, setTableNumber] = useState(1);

  const placeOrder = (data: Omit<Order, 'id' | 'status' | 'placedAt'>): Order => {
    const order: Order = {
      ...data,
      id: `T2D-${Date.now().toString(36).toUpperCase().slice(-6)}`,
      status: 'received',
      placedAt: new Date(),
    };
    setCurrentOrder(order);

    // Simulate status progression in demo mode
    const progression: OrderStatus[] = ['preparing', 'cooking', 'ready'];
    progression.forEach((status, i) => {
      setTimeout(() => {
        setCurrentOrder(prev => prev ? { ...prev, status } : null);
      }, (i + 1) * 15000); // every 15 seconds
    });

    return order;
  };

  const updateOrderStatus = (status: OrderStatus) => {
    if (currentOrder) setCurrentOrder({ ...currentOrder, status });
  };

  const clearOrder = () => setCurrentOrder(null);

  return (
    <OrderContext.Provider value={{ currentOrder, tableNumber, setTableNumber, placeOrder, updateOrderStatus, clearOrder }}>
      {children}
    </OrderContext.Provider>
  );
}

export function useOrder() {
  const ctx = useContext(OrderContext);
  if (!ctx) throw new Error('useOrder must be used within OrderProvider');
  return ctx;
}
