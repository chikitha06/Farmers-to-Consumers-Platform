import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const OrderConfirmation = () => {
  const { state } = useLocation();
  const orderId = state?.orderId;

  return (
    <div style={styles.page}>
      <div style={styles.box}>
        <div style={styles.icon}>✅</div>
        <h1 style={styles.title}>Order Confirmed!</h1>
        <p style={styles.text}>
          Your order has been placed successfully. The vendor will process and deliver it soon.
        </p>
        {orderId && (
          <p style={styles.orderId}>
            Order ID: <strong>#{orderId.slice(-8).toUpperCase()}</strong>
          </p>
        )}
        <div style={styles.actions}>
          <Link to="/my-orders" style={styles.primaryBtn}>📦 View My Orders</Link>
          <Link to="/" style={styles.secondaryBtn}>Continue Shopping</Link>
        </div>
      </div>
    </div>
  );
};

const styles = {
  page: { minHeight: '100vh', background: 'linear-gradient(135deg, #d8f3dc, #b7e4c7)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' },
  box: { background: 'white', padding: '48px 40px', borderRadius: '16px', boxShadow: '0 10px 40px rgba(0,0,0,0.1)', textAlign: 'center', maxWidth: '480px', width: '100%' },
  icon: { fontSize: '4rem', marginBottom: '16px' },
  title: { fontSize: '2rem', color: '#2d6a4f', marginBottom: '12px' },
  text: { color: '#555', lineHeight: 1.6, marginBottom: '16px' },
  orderId: { background: '#f8f9fa', padding: '10px', borderRadius: '8px', color: '#333', marginBottom: '24px' },
  actions: { display: 'flex', flexDirection: 'column', gap: '12px' },
  primaryBtn: { background: '#2d6a4f', color: 'white', padding: '14px', borderRadius: '10px', textDecoration: 'none', fontWeight: 'bold', fontSize: '1rem' },
  secondaryBtn: { color: '#2d6a4f', textDecoration: 'none', fontWeight: '600', fontSize: '0.95rem' },
};

export default OrderConfirmation;