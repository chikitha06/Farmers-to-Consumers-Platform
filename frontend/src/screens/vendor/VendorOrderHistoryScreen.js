import React, { useEffect, useState } from 'react';
import api from '../../utils/api';

const VendorOrderHistoryScreen = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await api.get('/orders/sellerorders/history');
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
      <h1 style={{ fontSize: '1.8rem', color: '#1a1a2e', marginBottom: '24px' }}>📋 Order History</h1>

      {orders.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px', color: '#888' }}>
          <div style={{ fontSize: '3rem' }}>📭</div>
          <p>No delivered orders yet.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', maxWidth: '900px' }}>
          {orders.map((order) => (
            <div key={order._id} style={{ background: 'white', borderRadius: '12px', padding: '18px', boxShadow: '0 1px 6px rgba(0,0,0,0.06)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', flexWrap: 'wrap', gap: '8px' }}>
                <span style={{ fontWeight: '700', color: '#1a1a2e' }}>Order #{order._id.slice(-8).toUpperCase()}</span>
                <span style={{ background: '#e8f5e9', color: '#2d6a4f', padding: '3px 12px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: '600' }}>✅ Delivered</span>
              </div>
              <div style={{ color: '#555', fontSize: '0.88rem', marginBottom: '10px' }}>
                Customer: {order.user?.name} | Delivered: {order.deliveredAt ? new Date(order.deliveredAt).toLocaleDateString('en-IN') : 'N/A'}
              </div>
              {order.orderItems.map((item, i) => (
                <div key={i} style={{ display: 'flex', gap: '12px', padding: '8px 0', borderTop: '1px solid #f5f5f5', alignItems: 'center' }}>
                  <img src={item.image} alt={item.name} style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '6px' }} onError={(e) => e.target.src = 'https://via.placeholder.com/50'} />
                  <div>
                    <div style={{ fontWeight: '600', fontSize: '0.9rem' }}>{item.name}</div>
                    <div style={{ color: '#888', fontSize: '0.82rem' }}>Qty: {item.qty} × ₹{item.price}</div>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default VendorOrderHistoryScreen;