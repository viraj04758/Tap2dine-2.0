import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router";
import { CartProvider } from "@/app/store/cartStore";
import { OrderProvider } from "@/app/store/orderStore";

// Landing page (existing)
import App from "./app/App.tsx";

// QR Ordering App pages
import WelcomePage from "@/app/pages/WelcomePage";
import MenuPage from "@/app/pages/MenuPage";
import FoodDetailPage from "@/app/pages/FoodDetailPage";
import CartPage from "@/app/pages/CartPage";
import CheckoutPage from "@/app/pages/CheckoutPage";
import OrderConfirmationPage from "@/app/pages/OrderConfirmationPage";
import OrderTrackingPage from "@/app/pages/OrderTrackingPage";
import ProfilePage from "@/app/pages/ProfilePage";

import "./styles/index.css";

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <CartProvider>
      <OrderProvider>
        <Routes>
          {/* ── QR Ordering App ── */}
          <Route path="/app" element={<WelcomePage />} />
          <Route path="/app/menu" element={<MenuPage />} />
          <Route path="/app/menu/:id" element={<FoodDetailPage />} />
          <Route path="/app/cart" element={<CartPage />} />
          <Route path="/app/checkout" element={<CheckoutPage />} />
          <Route path="/app/confirmation/:orderId" element={<OrderConfirmationPage />} />
          <Route path="/app/track/:orderId" element={<OrderTrackingPage />} />
          <Route path="/app/track" element={<OrderTrackingPage />} />
          <Route path="/app/profile" element={<ProfilePage />} />

          {/* ── Public Landing Page ── */}
          <Route path="/*" element={<App />} />
        </Routes>
      </OrderProvider>
    </CartProvider>
  </BrowserRouter>
);
