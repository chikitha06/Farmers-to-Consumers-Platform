import React, { useEffect, useState } from 'react';
import api from '../../utils/api';
import { toast } from 'react-toastify';

const AdminPendingProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const fetchPending = async () => {
    try {
      const { data } = await api.get('/products/pending');
      setProducts(data);
    } catch (err) {
      toast.error('Failed to load pending products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPending(); }, []);

  const handleVerify = async (id, status) => {
    try {
      await api.put(`/products/${id}/verify`, { status });
      toast.success(status === 'accept' ? 'Product approved!' : 'Product rejected.');
      setSelectedProduct(null);
      fetchPending();
    } catch (err) {
      toast.error('Action failed');
    }
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '60px' }}>Loading...</div>;

  return (
    <div style={{ minHeight: '100vh', background: '#f8f9fa', padding: '24px' }}>
      <h1 style={{ fontSize: '1.8rem', color: '#1a1a2e', marginBottom: '8px' }}>
        🆕 New Product Requests
      </h1>
      <p style={{ color: '#888', marginBottom: '24px' }}>{products.length} pending request(s)</p>

      {products.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px', color: '#888' }}>
          <div style={{ fontSize: '3rem' }}>✅</div>
          <p>All product requests have been reviewed.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
          {products.map((p) => (
            <div key={p._id} style={{ background: 'white', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 1px 8px rgba(0,0,0,0.06)' }}>
              <img src={p.image} alt={p.name} style={{ width: '100%', height: '160px', objectFit: 'cover' }} onError={(e) => e.target.src = 'https://via.placeholder.com/300x160'} />
              <div style={{ padding: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                  <h3 style={{ fontSize: '1rem', color: '#1a1a2e', margin: 0 }}>{p.name}</h3>
                  <span style={{ background: '#e8f5e9', color: '#2d6a4f', padding: '2px 8px', borderRadius: '10px', fontSize: '0.75rem' }}>{p.category}</span>
                </div>
                <div style={{ color: '#555', fontSize: '0.85rem', marginBottom: '6px' }}>
                  By: <strong>{p.seller?.name}</strong> ({p.seller?.email})
                </div>
                <div style={{ display: 'flex', gap: '16px', marginBottom: '12px', fontSize: '0.9rem' }}>
                  <span>Price: <strong>₹{p.price}</strong></span>
                  <span>MRP: <strong>₹{p.mrp}</strong></span>
                  <span>Stock: <strong>{p.countInStock}</strong></span>
                </div>
                <p style={{ color: '#777', fontSize: '0.83rem', marginBottom: '14px', lineHeight: 1.5 }}>
                  {p.description.slice(0, 100)}{p.description.length > 100 ? '...' : ''}
                </p>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button
                    onClick={() => handleVerify(p._id, 'accept')}
                    style={{ flex: 1, background: '#2d6a4f', color: 'white', border: 'none', padding: '9px', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}
                  >
                    ✅ Accept
                  </button>
                  <button
                    onClick={() => handleVerify(p._id, 'reject')}
                    style={{ flex: 1, background: '#fff0f0', color: '#d62828', border: '1px solid #d62828', padding: '9px', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}
                  >
                    ❌ Reject
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminPendingProducts;