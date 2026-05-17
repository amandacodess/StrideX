import { BrowserRouter, Routes, Route } from "react-router-dom";

import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";

import Home             from "./pages/Home";
import Products         from "./pages/Products";
import ProductDetail    from "./pages/ProductDetail";
import Cart             from "./pages/Cart";
import Checkout         from "./pages/Checkout";
import Login            from "./pages/Login";
import Register         from "./pages/Register";
import Profile          from "./pages/Profile";
import OrderConfirmation from "./pages/admin/OrderConfirmation";

import Dashboard        from "./pages/admin/Dashboard";
import AdminProducts    from "./pages/admin/AdminProducts";
import AdminOrders      from "./pages/admin/AdminOrders";
import AdminInventory   from "./pages/admin/AdminInventory";
import AdminCoupons     from "./pages/admin/AdminCoupons";
import AdminUsers       from "./pages/admin/AdminUsers";
import AdminPayments    from "./pages/admin/AdminPayments";

import Navbar           from "./components/Navbar";
import Footer           from "./components/Footer";
import ProtectedRoute   from "./routes/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <Routes>
            {/* Admin routes — no Navbar/Footer */}
            <Route path="/admin" element={<ProtectedRoute adminOnly><Dashboard /></ProtectedRoute>} />
            <Route path="/admin/products"  element={<ProtectedRoute adminOnly><AdminProducts /></ProtectedRoute>} />
            <Route path="/admin/orders"    element={<ProtectedRoute adminOnly><AdminOrders /></ProtectedRoute>} />
            <Route path="/admin/inventory" element={<ProtectedRoute adminOnly><AdminInventory /></ProtectedRoute>} />
            <Route path="/admin/coupons"   element={<ProtectedRoute adminOnly><AdminCoupons /></ProtectedRoute>} />
            <Route path="/admin/users"     element={<ProtectedRoute adminOnly><AdminUsers /></ProtectedRoute>} />
            <Route path="/admin/payments"  element={<ProtectedRoute adminOnly><AdminPayments /></ProtectedRoute>} />

            {/* Customer routes — with Navbar/Footer */}
            <Route path="*" element={
              <div className="min-h-screen flex flex-col">
                <Navbar />
                <main className="flex-1">
                  <Routes>
                    <Route path="/"                   element={<Home />} />
                    <Route path="/products"           element={<Products />} />
                    <Route path="/product/:id"        element={<ProductDetail />} />
                    <Route path="/cart"               element={<Cart />} />
                    <Route path="/checkout"           element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
                    <Route path="/login"              element={<Login />} />
                    <Route path="/register"           element={<Register />} />
                    <Route path="/profile"            element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                    <Route path="/order-confirmation" element={<OrderConfirmation />} />
                  </Routes>
                </main>
                <Footer />
              </div>
            } />
          </Routes>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
