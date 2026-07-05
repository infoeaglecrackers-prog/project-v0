import { Routes, Route } from "react-router-dom";
import { Toaster, ToastBar, toast } from "react-hot-toast";
import { X } from "lucide-react";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "./hooks/useAppDispatch";
import { fetchMe, setToken } from "./store/slices/authSlice";
import { fetchCart } from "./store/slices/cartSlice";
import { fetchWishlist } from "./store/slices/wishlistSlice";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import WhatsAppButton from "./components/common/WhatsAppButton";
import ProtectedRoute from "./components/layout/ProtectedRoute";
import AdminLayout from "./components/layout/AdminLayout";

// Public pages
import HomePage from "./pages/HomePage";
import ProductListPage from "./pages/ProductListPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import NotFoundPage from "./pages/NotFoundPage";

// Protected pages
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import OrdersPage from "./pages/OrdersPage";
import OrderDetailPage from "./pages/OrderDetailPage";
import ProfilePage from "./pages/ProfilePage";
import WishlistPage from "./pages/WishlistPage";

// Admin pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminProducts from "./pages/admin/AdminProducts";
import AdminAddProduct from "./pages/admin/AdminAddProduct";
import AdminEditProduct from "./pages/admin/AdminEditProduct";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminOrderDetail from "./pages/admin/AdminOrderDetail";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminCategories from "./pages/admin/AdminCategories";
import AdminPromoCodes from "./pages/admin/AdminPromoCodes";

function AppContent() {
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector((s) => s.auth.isAuthenticated);

  // On mount: restore token from localStorage into Redux, then always validate session
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) dispatch(setToken(token));
    dispatch(fetchMe()); // interceptor auto-refreshes if token expired
  }, [dispatch]);

  // Fetch cart & wishlist only once user is confirmed authenticated
  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchCart());
      dispatch(fetchWishlist());
    }
  }, [isAuthenticated, dispatch]);

  return (
    <>
      <Toaster position="top-right" toastOptions={{ duration: 3000, style: { borderRadius: "12px", fontSize: "14px", paddingRight: "10px" } }}>
        {(t) => (
          <ToastBar toast={t}>
            {({ icon, message }) => (
              <>
                {icon}
                {message}
                {t.type !== "loading" && (
                  <button
                    onClick={() => toast.dismiss(t.id)}
                    aria-label="Dismiss"
                    className="ml-2 p-1 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    <X size={14} />
                  </button>
                )}
              </>
            )}
          </ToastBar>
        )}
      </Toaster>
      <Routes>
        {/* Admin routes */}
        <Route element={<ProtectedRoute adminOnly />}>
          <Route element={<AdminLayout />}>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/products" element={<AdminProducts />} />
            <Route path="/admin/products/add" element={<AdminAddProduct />} />
            <Route path="/admin/products/edit/:id" element={<AdminEditProduct />} />
            <Route path="/admin/orders" element={<AdminOrders />} />
            <Route path="/admin/orders/:id" element={<AdminOrderDetail />} />
            <Route path="/admin/users" element={<AdminUsers />} />
            <Route path="/admin/categories" element={<AdminCategories />} />
            <Route path="/admin/promo-codes" element={<AdminPromoCodes />} />
          </Route>
        </Route>

        {/* Store routes with Navbar + Footer */}
        <Route
          path="/*"
          element={
            <div className="flex flex-col min-h-screen bg-bg">
              <Navbar />
              <div className="flex-1">
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/products" element={<ProductListPage />} />
                  <Route path="/products/:id" element={<ProductDetailPage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />
                  <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                  <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
                  <Route element={<ProtectedRoute />}>
                    <Route path="/cart" element={<CartPage />} />
                    <Route path="/checkout" element={<CheckoutPage />} />
                    <Route path="/orders" element={<OrdersPage />} />
                    <Route path="/orders/:id" element={<OrderDetailPage />} />
                    <Route path="/profile" element={<ProfilePage />} />
                    <Route path="/wishlist" element={<WishlistPage />} />
                  </Route>
                  <Route path="*" element={<NotFoundPage />} />
                </Routes>
              </div>
              <Footer />
              <WhatsAppButton />
            </div>
          }
        />
      </Routes>
    </>
  );
}

export default function App() {
  return <AppContent />;
}


