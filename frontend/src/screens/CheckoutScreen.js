import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { useCart } from '../context/CartContext';
import { toast } from 'react-toastify';

const CheckoutScreen = () => {
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [pincode, setPincode] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [loading, setLoading] = useState(false);
  const { cartItems, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();

  if (cartItems.length === 0) {
    navigate('/cart');
    return null;
  }

  const placeOrderHandler = async () => {
    if (!address || !city) { toast.error('Please fill in delivery address'); return; }
    setLoading(true);
    try {
      const orderItems = cartItems.map((item) => ({
        name: item.name,
        qty: item.qty,
        image: item.image,
        price: item.price,
        product: item.product,
        seller: item.seller,
      }));

      const { data } = await api.post('/orders', {
        orderItems,
        shippingAddress: { address, city, pincode },
        paymentMethod,
      });

      clearCart();
      navigate('/confirmation', { state: { orderId: data._id } });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <h1 style={styles.title}>Checkout</h1>
      <div style={styles.layout}>
        {/* Left: Form */}
        <div style={styles.formSection}>
          <div style={styles.card}>
            <h2 style={styles.cardTitle}>📦 Delivery Address</h2>
            <Field label="Street Address">
              <input style={styles.input} value={address} onChange={(e) => setAddress(e.target.value)} placeholder="House no, Street, Area" required />
            </Field>
            <div style={{ display: 'flex', gap: '12px' }}>
              <Field label="City" style={{ flex: 1 }}>
                <input style={styles.input} value={city} onChange={(e) => setCity(e.target.value)} placeholder="City" required />
              </Field>
              <Field label="Pincode" style={{ flex: 1 }}>
                <input style={styles.input} value={pincode} onChange={(e) => setPincode(e.target.value)} placeholder="6-digit pincode" />
              </Field>
            </div>
          </div>

          <div style={styles.card}>
            <h2 style={styles.cardTitle}>💳 Payment Method</h2>
            {['COD', 'Online'].map((method) => (
              <label key={method} style={styles.radioLabel}>
                <input
                  type="radio"
                  value={method}
                  checked={paymentMethod === method}
                  onChange={() => setPaymentMethod(method)}
                  style={{ marginRight: '8px' }}
                />
                {method === 'COD' ? '💵 Cash on Delivery' : '💳 Online Payment (UPI/Card)'}
              </label>
            ))}
          </div>
        </div>

        {/* Right: Order Summary */}
        <div style={styles.summarySection}>
          <div style={styles.card}>
            <h2 style={styles.cardTitle}>🧾 Order Summary</h2>
            {cartItems.map((item) => (
              <div key={`${item.product}-${item.seller}`} style={styles.summaryItem}>
                <span>{item.name} × {item.qty}</span>
                <span>₹{(item.price * item.qty).toFixed(2)}</span>
              </div>
            ))}
            <div style={styles.divider} />
            <div style={{ ...styles.summaryItem, fontWeight: 'bold', fontSize: '1.1rem' }}>
              <span>Total</span>
              <span>₹{totalPrice.toFixed(2)}</span>
            </div>
            <button
              onClick={placeOrderHandler}
              disabled={loading}
              style={styles.orderBtn}
            >
              {loading ? 'Placing Order...' : '✅ Confirm & Place Order'}
            </button>
            <p style={{ color: '#888', fontSize: '0.8rem', textAlign: 'center', marginTop: '8px' }}>
              By placing the order, you confirm all details are correct.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const Field = ({ label, children, style }) => (
  <div style={{ marginBottom: '14px', ...style }}>
    <label style={{ display: 'block', fontWeight: '600', fontSize: '0.9rem', color: '#333', marginBottom: '5px' }}>{label}</label>
    {children}
  </div>
);

const styles = {
  page: { minHeight: '100vh', background: '#f8f9fa', padding: '24px' },
  title: { fontSize: '1.8rem', color: '#1a1a2e', marginBottom: '24px' },
  layout: { display: 'flex', gap: '24px', alignItems: 'flex-start', flexWrap: 'wrap' },
  formSection: { flex: 2, minWidth: '300px', display: 'flex', flexDirection: 'column', gap: '16px' },
  summarySection: { flex: 1, minWidth: '260px' },
  card: { background: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 1px 8px rgba(0,0,0,0.06)' },
  cardTitle: { fontSize: '1.1rem', color: '#333', marginBottom: '18px', paddingBottom: '10px', borderBottom: '1px solid #eee' },
  input: { width: '100%', padding: '10px 14px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '0.95rem', boxSizing: 'border-box' },
  radioLabel: { display: 'block', padding: '12px', border: '1px solid #eee', borderRadius: '8px', cursor: 'pointer', marginBottom: '10px', fontSize: '0.95rem' },
  summaryItem: { display: 'flex', justifyContent: 'space-between', color: '#555', marginBottom: '8px', fontSize: '0.9rem' },
  divider: { borderTop: '1px solid #eee', margin: '12px 0' },
  orderBtn: { width: '100%', padding: '14px', background: '#2d6a4f', color: 'white', border: 'none', borderRadius: '10px', fontSize: '1rem', fontWeight: 'bold', cursor: 'pointer', marginTop: '16px' },
};

export default CheckoutScreen;