import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/api';
import { toast } from 'react-toastify';

const MyProductsScreen = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editId, setEditId] = useState(null);
  const [editData, setEditData] = useState({ price: '', addStock: '', removeStock: '' });
  const navigate = useNavigate();

  const fetchProducts = async () => {
    try {
      const { data } = await api.get('/products/myproducts');
      setProducts(data);
    } catch (err) {
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProducts(); }, []);

  const saveEdit = async (id) => {
    try {
      const payload = {};
      if (editData.price) payload.price = Number(editData.price);
      if (editData.addStock) payload.addStock = Number(editData.addStock);
      if (editData.removeStock) payload.removeStock = Number(editData.removeStock);
      await api.put(`/products/${id}`, payload);
      toast.success('Product updated!');
      setEditId(null);
      fetchProducts();
    } catch (err) {
      toast.error('Failed to update');
    }
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '60px' }}>Loading...</div>;

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <h1 style={styles.title}>📦 My Products</h1>
        <button onClick={() => navigate('/vendor/add-product')} style={styles.addBtn}>+ Add Product</button>
      </div>

      {products.length === 0 ? (
        <div style={styles.empty}>
          <p>You haven't added any products yet.</p>
          <button onClick={() => navigate('/vendor/add-product')} style={styles.addBtn}>Add Your First Product</button>
        </div>
      ) : (
        <div style={styles.grid}>
          {products.map((p) => (
            <div key={p._id} style={styles.card}>
              <div style={styles.statusBadge(p.isVerified)}>
                {p.isVerified ? '✅ Live' : '⏳ Pending Approval'}
              </div>
              <img src={p.image} alt={p.name} style={styles.img} onError={(e) => e.target.src = 'https://via.placeholder.com/200x150'} />
              <div style={styles.cardBody}>
                <h3 style={styles.name}>{p.name}</h3>
                <div style={styles.catTag}>{p.category}</div>
                <div style={styles.infoRow}><span>Price:</span><strong>₹{p.price}</strong></div>
                <div style={styles.infoRow}><span>MRP:</span><strong>₹{p.mrp}</strong></div>
                <div style={styles.infoRow}><span>Stock:</span><strong style={{ color: p.countInStock > 0 ? '#2d6a4f' : '#d62828' }}>{p.countInStock} units</strong></div>

                {editId === p._id ? (
                  <div style={styles.editBox}>
                    <input type="number" placeholder="New price" value={editData.price} onChange={(e) => setEditData({ ...editData, price: e.target.value })} style={styles.editInput} />
                    <input type="number" placeholder="Add stock" value={editData.addStock} onChange={(e) => setEditData({ ...editData, addStock: e.target.value })} style={styles.editInput} />
                    <input type="number" placeholder="Remove stock" value={editData.removeStock} onChange={(e) => setEditData({ ...editData, removeStock: e.target.value })} style={styles.editInput} />
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button onClick={() => saveEdit(p._id)} style={styles.saveBtn}>Save</button>
                      <button onClick={() => setEditId(null)} style={styles.cancelBtn}>Cancel</button>
                    </div>
                  </div>
                ) : (
                  <button onClick={() => { setEditId(p._id); setEditData({ price: p.price, addStock: '', removeStock: '' }); }} style={styles.editBtn}>
                    ✏️ Edit Price/Stock
                  </button>
                )}
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
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' },
  title: { fontSize: '1.8rem', color: '#1a1a2e', margin: 0 },
  addBtn: { background: '#2d6a4f', color: 'white', border: 'none', padding: '10px 22px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' },
  empty: { textAlign: 'center', padding: '60px', color: '#888' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '20px' },
  card: { background: 'white', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 1px 8px rgba(0,0,0,0.06)', position: 'relative' },
  statusBadge: (verified) => ({ position: 'absolute', top: '10px', right: '10px', background: verified ? '#e8f5e9' : '#fff3e0', color: verified ? '#2d6a4f' : '#e65100', padding: '3px 10px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: '600', zIndex: 1 }),
  img: { width: '100%', height: '160px', objectFit: 'cover' },
  cardBody: { padding: '14px' },
  name: { fontSize: '1rem', fontWeight: '700', color: '#1a1a2e', marginBottom: '4px' },
  catTag: { display: 'inline-block', background: '#e8f5e9', color: '#2d6a4f', padding: '2px 8px', borderRadius: '10px', fontSize: '0.75rem', marginBottom: '10px' },
  infoRow: { display: 'flex', justifyContent: 'space-between', color: '#555', fontSize: '0.88rem', marginBottom: '4px' },
  editBox: { marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '8px' },
  editInput: { padding: '8px 10px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '0.88rem' },
  saveBtn: { flex: 1, background: '#2d6a4f', color: 'white', border: 'none', padding: '8px', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' },
  cancelBtn: { flex: 1, background: '#f0f0f0', color: '#555', border: 'none', padding: '8px', borderRadius: '6px', cursor: 'pointer' },
  editBtn: { marginTop: '10px', width: '100%', background: '#f8f9fa', color: '#2d6a4f', border: '1px solid #2d6a4f', padding: '8px', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '0.88rem' },
};

export default MyProductsScreen;