import React from 'react';

const ContactScreen = () => (
  <div style={{ minHeight: '100vh', background: '#f8f9fa', padding: '40px 24px' }}>
    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '1.8rem', color: '#1a1a2e', marginBottom: '8px' }}>📞 Contact Us</h1>
      <p style={{ color: '#666', marginBottom: '28px' }}>We're here to help with any issues regarding your orders or produce.</p>

      <div style={{ background: 'white', borderRadius: '12px', padding: '28px', boxShadow: '0 1px 8px rgba(0,0,0,0.06)' }}>
        {[
          { icon: '📧', label: 'Email', value: 'support@farmerconnect.com' },
          { icon: '📱', label: 'Phone', value: '+91 98765 43210' },
          { icon: '📍', label: 'Address', value: '123 Agri-Market Hub, Telangana, India' },
          { icon: '🕐', label: 'Hours', value: 'Mon–Sat: 9AM – 6PM' },
        ].map(({ icon, label, value }) => (
          <div key={label} style={{ display: 'flex', alignItems: 'flex-start', gap: '14px', padding: '14px 0', borderBottom: '1px solid #f0f0f0' }}>
            <span style={{ fontSize: '1.4rem' }}>{icon}</span>
            <div>
              <div style={{ fontWeight: '600', color: '#333', marginBottom: '2px' }}>{label}</div>
              <div style={{ color: '#666' }}>{value}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default ContactScreen;