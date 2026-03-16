import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const CartScreen = () => {
  const { cartItems, updateQty, removeFromCart, totalPrice } = useCart();
  const navigate = useNavigate();

  return (
    <div style={styles.page}>
      <h1 style={styles.title}>🛒 Shopping Cart</h1>

      {cartItems.length === 0 ? (
        <div style={styles.empty}>
          <div style={{ fontSize: '4rem', marginBottom: '16px' }}>🛒</div>
          <h2>Your cart is empty</h2>
          <Link to="/" style={styles.shopBtn}>Continue Shopping</Link>
        </div>
      ) : (
        <div style={styles.layout}>
          <div style={styles.itemList}>
            {cartItems.map((item) => (
              <div key={`${item.product}-${item.seller}`} style={styles.row}>
                <img
                  src={item.image}
                  alt={item.name}
                  style={styles.img}
                  onError={(e) => e.target.src = 'https://via.placeholder.com/80x80?text=No+Image'}
                />
                <div style={styles.info}>
                  <Link to={`/product/${item.product}`} style={styles.productLink}>{item.name}</Link>
                  <p style={styles.sellerName}>Seller: {item.sellerName}</p>
                  <p style={styles.unitPrice}>₹{item.price} per unit</p>
                </div>
                <div style={styles.qtyControls}>
                  <button onClick={() => updateQty(item.product, item.seller, item.qty - 1)} style={styles.qtyBtn}>−</button>
                  <span style={styles.qty}>{item.qty}</span>
                  <button onClick={() => updateQty(item.product, item.seller, item.qty + 1)} style={styles.qtyBtn}>+</button>
                </div>
                <div style={styles.itemTotal}>₹{(item.qty * item.price).toFixed(2)}</div>
                <button onClick={() => removeFromCart(item.product, item.seller)} style={styles.deleteBtn}>🗑</button>
              </div>
            ))}
          </div>

          <div style={styles.summary}>
            <h2 style={{ marginBottom: '16px' }}>Order Summary</h2>
            <div style={styles.summaryRow}>
              <span>Items ({cartItems.reduce((a, x) => a + x.qty, 0)})</span>
              <span>₹{totalPrice.toFixed(2)}</span>
            </div>
            <div style={styles.summaryRow}>
              <span>Delivery</span>
              <span style={{ color: '#2d6a4f' }}>FREE</span>
            </div>
            <div style={{ ...styles.summaryRow, fontWeight: 'bold', fontSize: '1.1rem', borderTop: '1px solid #eee', paddingTop: '12px', marginTop: '8px' }}>
              <span>Total</span>
              <span>₹{totalPrice.toFixed(2)}</span>
            </div>
            <button
              onClick={() => navigate('/checkout')}
              style={styles.checkoutBtn}
            >
              Proceed to Checkout →
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  page: { minHeight: '100vh', background: '#f8f9fa', padding: '24px' },
  title: { fontSize: '1.8rem', color: '#1a1a2e', marginBottom: '24px' },
  empty: { textAlign: 'center', padding: '80px 20px', color: '#888' },
  shopBtn: { display: 'inline-block', marginTop: '16px', background: '#2d6a4f', color: 'white', padding: '12px 28px', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold' },
  layout: { display: 'flex', gap: '24px', alignItems: 'flex-start', flexWrap: 'wrap' },
  itemList: { flex: 2, minWidth: '300px', display: 'flex', flexDirection: 'column', gap: '12px' },
  row: { display: 'flex', alignItems: 'center', gap: '16px', background: 'white', padding: '16px', borderRadius: '12px', boxShadow: '0 1px 6px rgba(0,0,0,0.06)', flexWrap: 'wrap' },
  img: { width: '80px', height: '80px', objectFit: 'cover', borderRadius: '8px', flexShrink: 0 },
  info: { flex: 1, minWidth: '120px' },
  productLink: { color: '#1a1a2e', fontWeight: '600', textDecoration: 'none', fontSize: '0.95rem' },
  sellerName: { color: '#888', fontSize: '0.85rem', margin: '4px 0 2px' },
  unitPrice: { color: '#2d6a4f', fontWeight: '600', fontSize: '0.9rem', margin: 0 },
  qtyControls: { display: 'flex', alignItems: 'center', gap: '8px', background: '#f0f0f0', borderRadius: '8px', padding: '4px 8px' },
  qtyBtn: { background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.1rem', fontWeight: 'bold', color: '#333', padding: '0 4px' },
  qty: { fontWeight: '700', minWidth: '24px', textAlign: 'center' },
  itemTotal: { fontWeight: 'bold', color: '#1a1a2e', minWidth: '70px', textAlign: 'right' },
  deleteBtn: { background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem', color: '#d62828', padding: '4px' },
  summary: { flex: 1, minWidth: '240px', background: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 1px 6px rgba(0,0,0,0.06)', position: 'sticky', top: '80px' },
  summaryRow: { display: 'flex', justifyContent: 'space-between', marginBottom: '10px', color: '#555' },
  checkoutBtn: { width: '100%', padding: '14px', background: '#2d6a4f', color: 'white', border: 'none', borderRadius: '10px', fontSize: '1rem', fontWeight: 'bold', cursor: 'pointer', marginTop: '16px' },
};

export default CartScreen;