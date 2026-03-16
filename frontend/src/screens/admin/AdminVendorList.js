import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/api';
import { toast } from 'react-toastify';

const AdminVendorList = () => {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [vendorProducts, setVendorProducts] = useState([]);
  const [vendorOrders, setVendorOrders] = useState([]);
  const [tab, setTab] = useState('details');
  const navigate = useNavigate();

  const fetchVendors = async () => {
    try {
      const { data } = await api.get('/users/vendors');
      setVendors(data);
    } catch (err) {
      toast.error('Failed to load vendors');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchVendors(); }, []);

  const viewVendor = async (vendor) => {
    setSelectedVendor(vendor);
    setTab('details');
    try {
      const [{ data: prods }, { data: ords }] = await Promise.all([
        api.get(`/admin/vendors/${vendor._id}/products`),
        api.get(`/admin/vendors/${vendor._id}/orders`),
      ]);
      setVendorProducts(prods);
      setVendorOrders(ords);
    } catch (err) {
      console.error(err);
    }
  };

  const deleteVendor = async (id) => {
    if (!window.confirm('Remove this vendor? Their products will be hidden.')) return;
    try {
      await api.delete(`/users/vendors/${id}`);
      toast.success('Vendor removed');
      setSelectedVendor(null);
      fetchVendors();
    } catch (err) {
      toast.error('Failed to remove vendor');
    }
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '60px' }}>Loading...</div>;

  return (
    <div style={{ minHeight: '100vh', background: '#f8f9fa', padding: '24px', display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
      {/* Vendor List */}
      <div style={{ flex: '1', minWidth: '280px' }}>
        <h1 style={{ fontSize: '1.8rem', color: '#1a1a2e', marginBottom: '20px' }}>👥 Vendor List</h1>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {vendors.map((v) => (
            <div
              key={v._id}
              style={{ background: selectedVendor?._id === v._id ? '#e8f5e9' : 'white', border: selectedVendor?._id === v._id ? '2px solid #2d6a4f' : '1px solid #eee', borderRadius: '10px', padding: '14px 16px', cursor: 'pointer', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}
              onClick={() => viewVendor(v)}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontWeight: '700', color: '#1a1a2e' }}>{v.name}</div>
                  <div style={{ color: '#888', fontSize: '0.83rem' }}>{v.email}</div>
                </div>
                <span style={{ background: v.isActive ? '#e8f5e9' : '#ffebee', color: v.isActive ? '#2d6a4f' : '#d62828', padding: '2px 8px', borderRadius: '10px', fontSize: '0.75rem' }}>
                  {v.isActive ? 'Active' : 'Removed'}
                </span>
              </div>
            </div>
          ))}
          {vendors.length === 0 && <p style={{ color: '#888', textAlign: 'center', padding: '30px' }}>No vendors registered.</p>}
        </div>
      </div>

      {/* Vendor Details Panel */}
      {selectedVendor && (
        <div style={{ flex: '2', minWidth: '320px', background: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 8px rgba(0,0,0,0.06)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
            <h2 style={{ margin: 0, color: '#1a1a2e' }}>{selectedVendor.name}</h2>
            <button
              onClick={() => deleteVendor(selectedVendor._id)}
              style={{ background: '#ffebee', color: '#d62828', border: '1px solid #d62828', padding: '7px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '0.85rem' }}
            >
              🚫 Remove Vendor
            </button>
          </div>

          {/* Tabs */}
          <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', borderBottom: '1px solid #eee', paddingBottom: '12px' }}>
            {['details', 'products', 'orders'].map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                style={{ padding: '7px 18px', border: 'none', borderRadius: '20px', cursor: 'pointer', fontWeight: '600', fontSize: '0.88rem', background: tab === t ? '#2d6a4f' : '#f0f0f0', color: tab === t ? 'white' : '#555' }}
              >
                {t === 'details' ? '📋 Details' : t === 'products' ? `📦 Products (${vendorProducts.length})` : `🧾 Orders (${vendorOrders.length})`}
              </button>
            ))}
          </div>

          {tab === 'details' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {[
                { label: 'Email', value: selectedVendor.email },
                { label: 'Phone', value: selectedVendor.phone || 'Not provided' },
                { label: 'Address', value: selectedVendor.address || 'Not provided' },
                { label: 'Joined', value: new Date(selectedVendor.createdAt).toLocaleDateString('en-IN') },
                { label: 'Status', value: selectedVendor.isActive ? '✅ Active' : '❌ Removed' },
              ].map(({ label, value }) => (
                <div key={label} style={{ display: 'flex', gap: '12px', padding: '10px 0', borderBottom: '1px solid #f5f5f5' }}>
                  <span style={{ fontWeight: '600', color: '#555', minWidth: '80px' }}>{label}:</span>
                  <span style={{ color: '#333' }}>{value}</span>
                </div>
              ))}
            </div>
          )}

          {tab === 'products' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {vendorProducts.length === 0 ? <p style={{ color: '#888' }}>No products.</p> :
                vendorProducts.map((p) => (
                  <div key={p._id} style={{ display: 'flex', gap: '12px', alignItems: 'center', padding: '10px', background: '#f8f9fa', borderRadius: '8px' }}>
                    <img src={p.image} alt={p.name} style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '6px' }} onError={(e) => e.target.src = 'https://via.placeholder.com/50'} />
                    <div>
                      <div style={{ fontWeight: '600', fontSize: '0.9rem' }}>{p.name}</div>
                      <div style={{ color: '#888', fontSize: '0.82rem' }}>₹{p.price} | Stock: {p.countInStock} | {p.isVerified ? '✅ Live' : '⏳ Pending'}</div>
                    </div>
                  </div>
                ))
              }
            </div>
          )}

          {tab === 'orders' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {vendorOrders.length === 0 ? <p style={{ color: '#888' }}>No orders.</p> :
                vendorOrders.map((o) => (
                  <div key={o._id} style={{ padding: '12px', background: '#f8f9fa', borderRadius: '8px', fontSize: '0.88rem' }}>
                    <div style={{ fontWeight: '700', marginBottom: '4px' }}>#{o._id.slice(-8).toUpperCase()}</div>
                    <div style={{ color: '#555' }}>Customer: {o.user?.name} | {new Date(o.createdAt).toLocaleDateString('en-IN')}</div>
                    <div style={{ color: o.isDelivered ? '#2d6a4f' : '#e65100', fontWeight: '600', marginTop: '4px' }}>
                      {o.isDelivered ? '✅ Delivered' : '🚚 Pending'}
                    </div>
                  </div>
                ))
              }
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminVendorList;