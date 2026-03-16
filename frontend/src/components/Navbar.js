import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Navbar = () => {
  const { userInfo, logout } = useAuth();
  const { totalItems } = useCart();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav style={styles.nav}>
      <Link to="/" style={styles.brand}>
        🌾 FarmerMarket
      </Link>

      <div style={styles.links}>
        {/* Customer links */}
        {(!userInfo || userInfo.role === 'customer') && (
          <>
            <Link to="/" style={styles.link}>Home</Link>
            <Link to="/categories" style={styles.link}>Categories</Link>
            {userInfo && (
              <>
                <Link to="/cart" style={styles.link}>
                  🛒 Cart {totalItems > 0 && <span style={styles.badge}>{totalItems}</span>}
                </Link>
                <Link to="/my-orders" style={styles.link}>My Orders</Link>
              </>
            )}
          </>
        )}

        {/* Vendor links */}
        {userInfo?.role === 'seller' && (
          <>
            <Link to="/vendor/add-product" style={styles.link}>Add Product</Link>
            <Link to="/vendor/my-products" style={styles.link}>My Products</Link>
            <Link to="/vendor/orders" style={styles.link}>New Orders</Link>
            <Link to="/vendor/order-history" style={styles.link}>Order History</Link>
            <Link to="/vendor/notifications" style={styles.link}>🔔 Notifications</Link>
          </>
        )}

        {/* Admin links */}
        {userInfo?.role === 'admin' && (
          <>
            <Link to="/admin/pending-products" style={styles.link}>New Requests</Link>
            <Link to="/admin/vendors" style={styles.link}>Vendors</Link>
            <Link to="/admin/orders" style={styles.link}>All Orders</Link>
          </>
        )}

        {/* Auth */}
        {userInfo ? (
          <div style={styles.userArea}>
            <span style={styles.userName}>👤 {userInfo.name}</span>
            <button onClick={handleLogout} style={styles.logoutBtn}>Logout</button>
          </div>
        ) : (
          <Link to="/login" style={styles.loginBtn}>Login / Register</Link>
        )}
      </div>
    </nav>
  );
};

const styles = {
  nav: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 24px',
    height: '60px',
    background: '#2d6a4f',
    color: 'white',
    position: 'sticky',
    top: 0,
    zIndex: 1000,
    boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
  },
  brand: {
    color: 'white',
    textDecoration: 'none',
    fontSize: '1.4rem',
    fontWeight: 'bold',
  },
  links: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    flexWrap: 'wrap',
  },
  link: {
    color: 'rgba(255,255,255,0.9)',
    textDecoration: 'none',
    fontSize: '0.9rem',
    padding: '4px 8px',
    borderRadius: '4px',
    transition: 'background 0.2s',
  },
  badge: {
    background: '#ff4757',
    color: 'white',
    borderRadius: '50%',
    padding: '1px 6px',
    fontSize: '0.75rem',
    marginLeft: '4px',
  },
  userArea: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  userName: {
    fontSize: '0.9rem',
    color: 'rgba(255,255,255,0.9)',
  },
  logoutBtn: {
    background: '#d62828',
    color: 'white',
    border: 'none',
    padding: '6px 14px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '0.85rem',
  },
  loginBtn: {
    background: '#52b788',
    color: 'white',
    textDecoration: 'none',
    padding: '7px 16px',
    borderRadius: '6px',
    fontSize: '0.9rem',
  },
};

export default Navbar;