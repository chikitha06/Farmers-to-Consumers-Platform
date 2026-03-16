import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import PrivateRoute from './components/PrivateRoute';
import Navbar from './components/Navbar';

// Auth
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import ForgotPasswordScreen from './screens/ForgotPasswordScreen';

// Customer
import HomeScreen from './screens/HomeScreen';
import CategoriesScreen from './screens/CategoriesScreen';
import ProductScreen from './screens/ProductScreen';
import CartScreen from './screens/CartScreen';
import CheckoutScreen from './screens/CheckoutScreen';
import OrderConfirmation from './screens/OrderConfirmation';
import MyOrdersScreen from './screens/MyOrderScreen';
import ReviewScreen from './screens/ReviewScreen';
import ContactScreen from './screens/ContactScreen';

// Vendor
import AddProductScreen from './screens/vendor/AddProductScreen';
import MyProductsScreen from './screens/vendor/MyProductsScreen';
import VendorOrdersScreen from './screens/vendor/VendorsOrdersScreen';
import VendorOrderHistoryScreen from './screens/vendor/VendorOrderHistoryScreen';
import NotificationsScreen from './screens/vendor/NotificationsScreen';

// Admin
import AdminPendingProducts from './screens/admin/AdminPendingProductsScreen';
import AdminVendorList from './screens/admin/AdminVendorList';
import AdminAllOrders from './screens/admin/AdminAllOrders';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <Navbar />
          <Routes>
            {/* Public */}
            <Route path="/login" element={<LoginScreen />} />
            <Route path="/register" element={<RegisterScreen />} />
            <Route path="/forgot-password" element={<ForgotPasswordScreen />} />

            {/* Customer - public browsing */}
            <Route path="/" element={<HomeScreen />} />
            <Route path="/categories" element={<CategoriesScreen />} />
            <Route path="/product/:id" element={<ProductScreen />} />
            <Route path="/contact" element={<ContactScreen />} />

            {/* Customer - auth required */}
            <Route path="/cart" element={<PrivateRoute roles={['customer']}><CartScreen /></PrivateRoute>} />
            <Route path="/checkout" element={<PrivateRoute roles={['customer']}><CheckoutScreen /></PrivateRoute>} />
            <Route path="/confirmation" element={<PrivateRoute roles={['customer']}><OrderConfirmation /></PrivateRoute>} />
            <Route path="/my-orders" element={<PrivateRoute roles={['customer']}><MyOrdersScreen /></PrivateRoute>} />
            <Route path="/product/:id/reviews" element={<PrivateRoute roles={['customer']}><ReviewScreen /></PrivateRoute>} />

            {/* Vendor Routes */}
            <Route path="/vendor/add-product" element={<PrivateRoute roles={['seller']}><AddProductScreen /></PrivateRoute>} />
            <Route path="/vendor/my-products" element={<PrivateRoute roles={['seller']}><MyProductsScreen /></PrivateRoute>} />
            <Route path="/vendor/orders" element={<PrivateRoute roles={['seller']}><VendorOrdersScreen /></PrivateRoute>} />
            <Route path="/vendor/order-history" element={<PrivateRoute roles={['seller']}><VendorOrderHistoryScreen /></PrivateRoute>} />
            <Route path="/vendor/notifications" element={<PrivateRoute roles={['seller']}><NotificationsScreen /></PrivateRoute>} />

            {/* Admin Routes */}
            <Route path="/admin/pending-products" element={<PrivateRoute roles={['admin']}><AdminPendingProducts /></PrivateRoute>} />
            <Route path="/admin/vendors" element={<PrivateRoute roles={['admin']}><AdminVendorList /></PrivateRoute>} />
            <Route path="/admin/orders" element={<PrivateRoute roles={['admin']}><AdminAllOrders /></PrivateRoute>} />
          </Routes>
          <ToastContainer position="top-right" autoClose={3000} />
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;