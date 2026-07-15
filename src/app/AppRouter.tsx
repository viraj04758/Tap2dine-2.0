import { BrowserRouter, Routes, Route, Navigate } from 'react-router';
import { CartProvider } from '@/app/store/cartStore';
import { OrderProvider } from '@/app/store/orderStore';
import WelcomePage from '@/app/pages/WelcomePage';
import MenuPage from '@/app/pages/MenuPage';
import FoodDetailPage from '@/app/pages/FoodDetailPage';
import CartPage from '@/app/pages/CartPage';
import CheckoutPage from '@/app/pages/CheckoutPage';
import OrderConfirmationPage from '@/app/pages/OrderConfirmationPage';
import OrderTrackingPage from '@/app/pages/OrderTrackingPage';
import ProfilePage from '@/app/pages/ProfilePage';

export default function AppRouter() {
  return (
    <BrowserRouter>
      <CartProvider>
        <OrderProvider>
          <Routes>
            {/* QR App entry — shows welcome screen */}
            <Route path="/app" element={<WelcomePage />} />

            {/* Menu */}
            <Route path="/app/menu" element={<MenuPage />} />
            <Route path="/app/menu/:id" element={<FoodDetailPage />} />

            {/* Cart & Checkout flow */}
            <Route path="/app/cart" element={<CartPage />} />
            <Route path="/app/checkout" element={<CheckoutPage />} />

            {/* Post-order */}
            <Route path="/app/confirmation/:orderId" element={<OrderConfirmationPage />} />
            <Route path="/app/track/:orderId" element={<OrderTrackingPage />} />
            <Route path="/app/track" element={<OrderTrackingPage />} />

            {/* Profile */}
            <Route path="/app/profile" element={<ProfilePage />} />

            {/* Catch-all → welcome */}
            <Route path="/app/*" element={<Navigate to="/app" replace />} />
          </Routes>
        </OrderProvider>
      </CartProvider>
    </BrowserRouter>
  );
}
