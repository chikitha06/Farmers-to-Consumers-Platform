import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/api';
import { toast } from 'react-toastify';

const AddProductScreen = () => {
  const [formData, setFormData] = useState({
    name: '', price: '', mrp: '', description: '', image: '', category: 'Vegetables', countInStock: '',
  });
  const [imageFile, setImageFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const uploadImage = async () => {
    if (!imageFile) return formData.image;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('image', imageFile);
      const { data } = await api.post('/upload', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      setUploading(false);
      return data.imagePath;
    } catch (err) {
      setUploading(false);
      toast.error('Image upload failed');
      return formData.image;
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const imagePath = await uploadImage();
      await api.post('/products', { ...formData, image: imagePath || 'https://via.placeholder.com/400x300?text=Product', price: Number(formData.price), mrp: Number(formData.mrp), countInStock: Number(formData.countInStock) });
      toast.success('Product request sent to Admin for approval!');
      navigate('/vendor/my-products');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <h1 style={styles.title}>➕ Request New Product</h1>
      <div style={styles.card}>
        <p style={styles.note}>📋 Your request will be reviewed by admin before going live.</p>
        <form onSubmit={submitHandler}>
          <div style={styles.grid}>
            <Field label="Product Name">
              <input name="name" value={formData.name} onChange={handleChange} style={styles.input} placeholder="e.g. Organic Tomatoes" required />
            </Field>
            <Field label="Category">
              <select name="category" value={formData.category} onChange={handleChange} style={styles.input}>
                {['Vegetables', 'Fruits', 'Grains', 'Dairy'].map((c) => <option key={c}>{c}</option>)}
              </select>
            </Field>
            <Field label="Your Price (₹)">
              <input name="price" type="number" value={formData.price} onChange={handleChange} style={styles.input} placeholder="Price you'll sell at" required min="1" />
            </Field>
            <Field label="MRP (₹)">
              <input name="mrp" type="number" value={formData.mrp} onChange={handleChange} style={styles.input} placeholder="Maximum Retail Price" required min="1" />
            </Field>
            <Field label="Stock (units)">
              <input name="countInStock" type="number" value={formData.countInStock} onChange={handleChange} style={styles.input} placeholder="How many units available" required min="0" />
            </Field>
            <Field label="Image URL (optional)">
              <input name="image" value={formData.image} onChange={handleChange} style={styles.input} placeholder="https://..." />
            </Field>
          </div>

          <Field label="Upload Product Image">
            <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files[0])} style={{ marginTop: '6px' }} />
            {uploading && <span style={{ color: '#888', fontSize: '0.85rem' }}>Uploading...</span>}
          </Field>

          <Field label="Product Description">
            <textarea name="description" value={formData.description} onChange={handleChange} style={{ ...styles.input, height: '100px', resize: 'vertical' }} placeholder="Describe your product: origin, quality, farming method..." required />
          </Field>

          <button type="submit" disabled={loading || uploading} style={styles.btn}>
            {loading ? 'Submitting...' : '📤 Submit for Admin Review'}
          </button>
        </form>
      </div>
    </div>
  );
};

const Field = ({ label, children }) => (
  <div style={{ marginBottom: '16px' }}>
    <label style={{ display: 'block', fontWeight: '600', fontSize: '0.9rem', color: '#333', marginBottom: '6px' }}>{label}</label>
    {children}
  </div>
);

const styles = {
  page: { minHeight: '100vh', background: '#f8f9fa', padding: '24px' },
  title: { fontSize: '1.8rem', color: '#1a1a2e', marginBottom: '20px' },
  card: { background: 'white', borderRadius: '12px', padding: '28px', maxWidth: '800px', boxShadow: '0 1px 8px rgba(0,0,0,0.06)' },
  note: { background: '#fff8e1', color: '#e65100', padding: '12px 16px', borderRadius: '8px', marginBottom: '24px', fontSize: '0.9rem' },
  grid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 16px' },
  input: { width: '100%', padding: '10px 14px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '0.95rem', boxSizing: 'border-box' },
  btn: { background: '#2d6a4f', color: 'white', border: 'none', padding: '13px 32px', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold', fontSize: '1rem', marginTop: '8px' },
};

export default AddProductScreen;