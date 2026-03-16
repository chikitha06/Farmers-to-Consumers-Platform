import React, { useEffect, useState } from 'react';
import api from '../../utils/api';

const AdminAllOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await api.get('/orders');
        setOrders(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  if (loading) return <div style={{ textAlign: 'center', padding: '60px' }}>Loading...</div>;

  return (
    <div style={{ minHeight: '100vh', background: '#f8f9fa', padding: '24px' }}>
      <h1 style={{ fontSize: '1.8rem', color: '#1a1a2e', marginBottom: '24px' }}>
        🧾 All Orders ({orders.length})
      </h1>

      {orders.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px', color: '#888' }}>No orders placed yet.</div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', background: 'white', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 1px 8px rgba(0,0,0,0.06)' }}>
            <thead>
              <tr style={{ background: '#2d6a4f', color: 'white' }}>
                {['Order ID', 'Customer', 'Date', 'Items', 'Total', 'Payment', 'Status'].map((h) => (
                  <th key={h} style={{ padding: '14px 16px', textAlign: 'left', fontSize: '0.88rem', fontWeight: '600' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {orders.map((order, idx) => (
                <tr key={order._id} style={{ background: idx % 2 === 0 ? 'white' : '#f8f9fa' }}>
                  <td style={styles.td}>#{order._id.slice(-8).toUpperCase()}</td>
                  <td style={styles.td}>
                    <div style={{ fontWeight: '600' }}>{order.user?.name}</div>
                    <div style={{ color: '#888', fontSize: '0.8rem' }}>{order.user?.email}</div>
                  </td>
                  <td style={styles.td}>{new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                  <td style={styles.td}>{order.orderItems.length} item(s)</td>
                  <td style={{ ...styles.td, fontWeight: 'bold', color: '#2d6a4f' }}>₹{order.totalPrice?.toFixed(2)}</td>
                  <td style={styles.td}>{order.paymentMethod}</td>
                  <td style={styles.td}>
                    <span style={{ background: order.isDelivered ? '#e8f5e9' : '#fff3e0', color: order.isDelivered ? '#2d6a4f' : '#e65100', padding: '3px 10px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: '600' }}>
                      {order.isDelivered ? '✅ Delivered' : '🚚 In Transit'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

const styles = {
  td: { padding: '12px 16px', fontSize: '0.88rem', color: '#333', verticalAlign: 'middle', borderBottom: '1px solid #f0f0f0' },
};

export default AdminAllOrders;