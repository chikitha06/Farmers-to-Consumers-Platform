import React, { useEffect, useState } from 'react';
import api from '../../utils/api';
import { toast } from 'react-toastify';

const NotificationsScreen = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    try {
      const { data } = await api.get('/notifications');
      setNotifications(data);
    } catch (err) {
      toast.error('Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchNotifications(); }, []);

  const markAllRead = async () => {
    await api.put('/notifications/read-all');
    fetchNotifications();
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '60px' }}>Loading...</div>;

  const unread = notifications.filter((n) => !n.isRead).length;

  return (
    <div style={{ minHeight: '100vh', background: '#f8f9fa', padding: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '10px' }}>
        <h1 style={{ fontSize: '1.8rem', color: '#1a1a2e', margin: 0 }}>
          🔔 Notifications {unread > 0 && <span style={{ background: '#ff4757', color: 'white', borderRadius: '50%', padding: '2px 8px', fontSize: '0.8rem', marginLeft: '8px' }}>{unread}</span>}
        </h1>
        {unread > 0 && (
          <button onClick={markAllRead} style={{ background: 'transparent', color: '#2d6a4f', border: '1px solid #2d6a4f', padding: '7px 16px', borderRadius: '8px', cursor: 'pointer', fontSize: '0.88rem' }}>
            Mark all as read
          </button>
        )}
      </div>

      {notifications.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px', color: '#888' }}>
          <div style={{ fontSize: '3rem' }}>🔔</div>
          <p>No notifications yet.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '700px' }}>
          {notifications.map((n) => (
            <div key={n._id} style={{ background: n.isRead ? 'white' : '#f0f8ff', border: n.isRead ? '1px solid #f0f0f0' : '1px solid #c0d8f0', borderRadius: '10px', padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px' }}>
              <div>
                <p style={{ color: '#333', margin: 0, lineHeight: 1.5 }}>{n.message}</p>
                <span style={{ color: '#aaa', fontSize: '0.8rem' }}>{new Date(n.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
              </div>
              {!n.isRead && <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#2196f3', flexShrink: 0, marginTop: '4px' }} />}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NotificationsScreen;