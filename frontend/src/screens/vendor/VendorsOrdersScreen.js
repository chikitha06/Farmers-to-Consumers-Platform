import React, { useEffect, useState } from 'react';
import api from '../../utils/api';
import { toast } from 'react-toastify';

const VendorOrdersScreen = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const { data } = await api.get('/orders/sellerorders');
      setOrders(data.filter((o) => !o.isDelivered));
    } catch (err) {
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchOrders(); }, []);

  const markDelivered = async (orderId) => {
    try {
      await api.put(`/orders/${orderId}/deliver`);
      toast.success('Order marked as delivered!');
      fetchOrders();
    } catch (err) {
      toast.error('Failed to update');
    }
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '60px' }}>Loading...</div>;

  return (
    <div style={styles.page}>
      <h1 style={styles.title}>🚚 New Orders</h1>
      {orders.length === 0 ? (
        <div style={styles.empty}>
          <div style={{ fontSize: '3rem' }}>📭</div>
          <p>No pending orders right now.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {orders.map((order) => (
            <div key={order._id} style={styles.card}>
              <div style={styles.cardHeader}>
                <div>
                  <span style={styles.orderId}>Order #{order._id.slice(-8).toUpperCase()}</span>
                  <span style={styles.date}>{new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                </div>
                <span style={styles.pending}>⏳ Pending Delivery</span>
              </div>

              <div style={styles.customerInfo}>
                <strong>Customer:</strong> {order.user?.name} ({order.user?.email})
              </div>

              <div style={styles.address}>
                <strong>📍 Deliver to:</strong> {order.shippingAddress.address}, {order.shippingAddress.city}
                {order.shippingAddress.pincode && ` - ${order.shippingAddress.pincode}`}
              </div>

              {order.orderItems.map((item, i) => (
                <div key={i} style={styles.itemRow}>
                  <img src={item.image} alt={item.name} style={styles.img} onError={(e) => e.target.src = 'https://via.placeholder.com/60'} />
                  <div>
                    <div style={{ fontWeight: '600' }}>{item.name}</div>
                    <div style={{ color: '#888', fontSize: '0.85rem' }}>Qty: {item.qty} × ₹{item.price}</div>
                  </div>
                  <div style={{ marginLeft: 'auto', fontWeight: 'bold', color: '#2d6a4f' }}>
                    ₹{(item.qty * item.price).toFixed(2)}
                  </div>
                </div>
              ))}

              <div style={styles.cardFooter}>
                <span style={{ color: '#555', fontSize: '0.9rem' }}>Payment: {order.paymentMethod}</span>
                <button onClick={() => markDelivered(order._id)} style={styles.deliveredBtn}>
                  ✅ Mark as Delivered
                </button>
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
  card: { background: 'white', borderRadius: '12px', padding: '20px', boxShadow: '0 1px 8px rgba(0,0,0,0.06)' },
  cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '8px' },
  orderId: { fontWeight: '700', color: '#1a1a2e', marginRight: '10px' },
  date: { color: '#888', fontSize: '0.85rem' },
  pending: { background: '#fff3e0', color: '#e65100', padding: '4px 12px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: '600' },
  customerInfo: { color: '#555', fontSize: '0.9rem', marginBottom: '8px' },
  address: { background: '#f0f4ff', padding: '10px 14px', borderRadius: '8px', fontSize: '0.9rem', color: '#333', marginBottom: '14px' },
  itemRow: { display: 'flex', alignItems: 'center', gap: '14px', padding: '10px 0', borderTop: '1px solid #f0f0f0' },
  img: { width: '60px', height: '60px', objectFit: 'cover', borderRadius: '8px' },
  cardFooter: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '14px', paddingTop: '14px', borderTop: '1px solid #f0f0f0', flexWrap: 'wrap', gap: '10px' },
  deliveredBtn: { background: '#2d6a4f', color: 'white', border: 'none', padding: '10px 22px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' },
};

export default VendorOrdersScreen;