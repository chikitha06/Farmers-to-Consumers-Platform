import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';

const CATEGORIES = ['Vegetables', 'Fruits', 'Grains', 'Dairy'];

const CategoriesScreen = () => {
  const [products, setProducts] = useState([]);
  const [selected, setSelected] = useState('All');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetch = async () => {
      try {
        const url = selected === 'All' ? '/products' : `/products?category=${selected}`;
        const { data } = await api.get(url);
        setProducts(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [selected]);

  const isNew = (date) => new Date(date) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

  return (
    <div style={{ padding: '24px', minHeight: '100vh', background: '#f8f9fa' }}>
      <h1 style={{ fontSize: '1.8rem', color: '#1a1a2e', marginBottom: '20px' }}>Shop by Category</h1>

      <div style={styles.categoryBar}>
        {['All', ...CATEGORIES].map((cat) => (
          <button
            key={cat}
            onClick={() => { setSelected(cat); setLoading(true); }}
            style={{ ...styles.catBtn, ...(selected === cat ? styles.catBtnActive : {}) }}
          >
            {cat === 'Vegetables' ? '🥦' : cat === 'Fruits' ? '🍎' : cat === 'Grains' ? '🌾' : cat === 'Dairy' ? '🥛' : '🛒'} {cat}
          </button>
        ))}
      </div>

      {loading ? (
        <p style={{ textAlign: 'center', padding: '40px' }}>Loading...</p>
      ) : (
        <div style={styles.grid}>
          {products.map((product) => {
            const stars = '★'.repeat(Math.round(product.avgRating || 0)) + '☆'.repeat(5 - Math.round(product.avgRating || 0));
            return (
              <div key={product._id} style={styles.card} onClick={() => navigate(`/product/${product.productId}`)}>
                {isNew(product.createdAt) && <span style={styles.newBadge}>NEW</span>}
                <img src={product.image} alt={product._id} style={styles.img} onError={(e) => e.target.src = 'https://via.placeholder.com/300x200?text=No+Image'} />
                <div style={{ padding: '14px' }}>
                  <span style={styles.catTag}>{product.category}</span>
                  <h3 style={styles.name}>{product._id}</h3>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '6px' }}>
                    <span style={styles.price}>₹{product.minPrice}</span>
                    <span style={{ color: '#999', fontSize: '0.85rem' }}><s>₹{product.mrp}</s></span>
                  </div>
                  <div style={{ color: '#f0a500', fontSize: '0.85rem' }}>
                    {stars} <span style={{ color: '#888' }}>({product.totalReviews})</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
      {!loading && products.length === 0 && (
        <p style={{ textAlign: 'center', color: '#888', padding: '40px' }}>No products in this category yet.</p>
      )}
    </div>
  );
};

const styles = {
  categoryBar: { display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '28px' },
  catBtn: { padding: '9px 20px', border: '2px solid #e0e0e0', background: 'white', borderRadius: '30px', cursor: 'pointer', fontSize: '0.9rem', fontWeight: '600', color: '#555', transition: 'all 0.2s' },
  catBtnActive: { background: '#2d6a4f', color: 'white', borderColor: '#2d6a4f' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(230px, 1fr))', gap: '20px' },
  card: { background: 'white', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 2px 10px rgba(0,0,0,0.08)', cursor: 'pointer', position: 'relative' },
  newBadge: { position: 'absolute', top: '10px', left: '10px', background: '#ff4757', color: 'white', padding: '3px 9px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 'bold' },
  img: { width: '100%', height: '180px', objectFit: 'cover' },
  catTag: { background: '#e8f5e9', color: '#2d6a4f', padding: '2px 8px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: '600' },
  name: { fontSize: '1rem', color: '#1a1a2e', margin: '8px 0 6px', fontWeight: '600' },
  price: { fontSize: '1.1rem', fontWeight: 'bold', color: '#2d6a4f' },
};

export default CategoriesScreen;