import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { toast } from 'react-toastify';

const MyOrdersScreen = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await api.get('/orders/myorders');
        setOrders(data);
      } catch (err) {
        toast.error('Failed to load orders');
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  if (loading) return <div style={{ textAlign: 'center', padding: '60px' }}>Loading orders...</div>;

  return (
    <div style={styles.page}>
      <h1 style={styles.title}>📦 My Orders</h1>

      {orders.length === 0 ? (
        <div style={styles.empty}>
          <div style={{ fontSize: '3rem' }}>📦</div>
          <h2>No orders yet</h2>
          <button onClick={() => navigate('/')} style={styles.shopBtn}>Start Shopping</button>
        </div>
      ) : (
        <div style={styles.list}>
          {orders.map((order) => (
            <div key={order._id} style={styles.orderCard}>
              <div style={styles.orderHeader}>
                <div>
                  <span style={styles.orderId}>Order #{order._id.slice(-8).toUpperCase()}</span>
                  <span style={styles.date}>{new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                </div>
                <span style={{ ...styles.status, background: order.isDelivered ? '#e8f5e9' : '#fff3e0', color: order.isDelivered ? '#2d6a4f' : '#e65100' }}>
                  {order.isDelivered ? '✅ Delivered' : '🚚 In Transit'}
                </span>
              </div>

              {order.orderItems.map((item, idx) => (
                <div key={idx} style={styles.itemRow}>
                  <img src={item.image} alt={item.name} style={styles.img} onError={(e) => e.target.src = 'https://via.placeholder.com/60x60'} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: '600', color: '#333' }}>{item.name}</div>
                    <div style={{ color: '#888', fontSize: '0.85rem' }}>Qty: {item.qty} | Seller: {item.sellerName}</div>
                    <div style={{ color: '#2d6a4f', fontWeight: '600' }}>₹{item.price}</div>
                  </div>
                  {order.isDelivered && (
                    <button
                      onClick={() => navigate(`/product/${item.product}/reviews`)}
                      style={styles.reviewBtn}
                    >
                      ⭐ Write Review
                    </button>
                  )}
                </div>
              ))}

              <div style={styles.orderFooter}>
                <div>
                  <span style={{ color: '#555', fontSize: '0.9rem' }}>Payment: {order.paymentMethod} | </span>
                  <span style={{ color: '#555', fontSize: '0.9rem' }}>
                    To: {order.shippingAddress.address}, {order.shippingAddress.city}
                  </span>
                </div>
                <span style={{ fontWeight: 'bold', color: '#1a1a2e' }}>Total: ₹{order.totalPrice?.toFixed(2)}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const styles = {
  page: { minHeight: '100vh', background: '#f8f9fa', padding: '24px' },
  title: { fontSize: '1.8rem', color: '#1a1a2e', marginBottom: '24px' },
  empty: { textAlign: 'center', padding: '60px', color: '#888' },
  shopBtn: { marginTop: '16px', background: '#2d6a4f', color: 'white', border: 'none', padding: '12px 28px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' },
  list: { display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '900px' },
  orderCard: { background: 'white', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 1px 8px rgba(0,0,0,0.06)' },
  orderHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', borderBottom: '1px solid #f0f0f0', flexWrap: 'wrap', gap: '8px' },
  orderId: { fontWeight: '700', color: '#1a1a2e', marginRight: '12px' },
  date: { color: '#888', fontSize: '0.85rem' },
  status: { padding: '4px 12px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: '600' },
  itemRow: { display: 'flex', alignItems: 'center', gap: '14px', padding: '14px 20px', borderBottom: '1px solid #f8f8f8' },
  img: { width: '60px', height: '60px', objectFit: 'cover', borderRadius: '8px', flexShrink: 0 },
  reviewBtn: { background: '#fff8e1', color: '#f0a500', border: '1px solid #f0a500', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: '600', whiteSpace: 'nowrap' },
  orderFooter: { display: 'flex', justifyContent: 'space-between', padding: '12px 20px', background: '#f8f9fa', flexWrap: 'wrap', gap: '8px' },
};

export default MyOrdersScreen;