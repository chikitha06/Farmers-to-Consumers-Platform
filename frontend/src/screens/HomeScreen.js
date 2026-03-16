import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../utils/api';

const HomeScreen = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await api.get('/products');
        setProducts(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const isNew = (date) => new Date(date) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

  if (loading) return <div style={styles.loading}>Loading products...</div>;

  return (
    <div style={styles.page}>
      {/* Hero */}
      <div style={styles.hero}>
        <h1 style={styles.heroTitle}>🌾 Fresh From the Farm</h1>
        <p style={styles.heroSub}>Buy directly from verified local farmers. Fresher, cheaper, better.</p>
        <button onClick={() => navigate('/categories')} style={styles.heroBtn}>Browse All Categories →</button>
      </div>

      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>Latest Products</h2>
        <div style={styles.grid}>
          {products.map((product) => (
            <ProductCard key={product._id} product={product} isNew={isNew(product.createdAt)} />
          ))}
        </div>
      </div>
    </div>
  );
};

const ProductCard = ({ product, isNew }) => {
  const navigate = useNavigate();
  const stars = '★'.repeat(Math.round(product.avgRating || 0)) + '☆'.repeat(5 - Math.round(product.avgRating || 0));

  return (
    <div style={styles.card} onClick={() => navigate(`/product/${product.productId}`)}>
      {isNew && <span style={styles.newBadge}>NEW</span>}
      <img src={product.image} alt={product._id} style={styles.img} onError={(e) => e.target.src = 'https://via.placeholder.com/300x200?text=No+Image'} />
      <div style={styles.cardBody}>
        <span style={styles.category}>{product.category}</span>
        <h3 style={styles.productName}>{product._id}</h3>
        <div style={styles.priceRow}>
          <span style={styles.minPrice}>₹{product.minPrice}</span>
          <span style={styles.mrp}><s>₹{product.mrp}</s></span>
        </div>
        <div style={styles.ratingRow}>
          <span style={styles.stars}>{stars}</span>
          <span style={styles.reviewCount}>({product.totalReviews})</span>
          {product.sellerCount > 1 && <span style={styles.sellerTag}>{product.sellerCount} sellers</span>}
        </div>
      </div>
    </div>
  );
};

const styles = {
  page: { minHeight: '100vh', background: '#f8f9fa' },
  loading: { textAlign: 'center', padding: '60px', fontSize: '1.2rem', color: '#666' },
  hero: { background: 'linear-gradient(135deg, #2d6a4f, #52b788)', color: 'white', padding: '60px 40px', textAlign: 'center' },
  heroTitle: { fontSize: '2.5rem', marginBottom: '12px' },
  heroSub: { fontSize: '1.1rem', opacity: 0.9, marginBottom: '28px' },
  heroBtn: { background: 'white', color: '#2d6a4f', border: 'none', padding: '12px 28px', borderRadius: '30px', fontSize: '1rem', fontWeight: 'bold', cursor: 'pointer' },
  section: { padding: '40px 24px' },
  sectionTitle: { fontSize: '1.6rem', color: '#1a1a2e', marginBottom: '24px' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '20px' },
  card: { background: 'white', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 2px 10px rgba(0,0,0,0.08)', cursor: 'pointer', position: 'relative', transition: 'transform 0.2s, box-shadow 0.2s' },
  newBadge: { position: 'absolute', top: '10px', left: '10px', background: '#ff4757', color: 'white', padding: '3px 9px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 'bold', zIndex: 1 },
  img: { width: '100%', height: '180px', objectFit: 'cover' },
  cardBody: { padding: '14px' },
  category: { background: '#e8f5e9', color: '#2d6a4f', padding: '2px 8px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: '600' },
  productName: { fontSize: '1rem', color: '#1a1a2e', margin: '8px 0 6px', fontWeight: '600' },
  priceRow: { display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' },
  minPrice: { fontSize: '1.1rem', fontWeight: 'bold', color: '#2d6a4f' },
  mrp: { color: '#999', fontSize: '0.85rem' },
  ratingRow: { display: 'flex', alignItems: 'center', gap: '6px' },
  stars: { color: '#f0a500', fontSize: '0.85rem' },
  reviewCount: { color: '#888', fontSize: '0.8rem' },
  sellerTag: { background: '#fff3e0', color: '#e65100', padding: '1px 7px', borderRadius: '10px', fontSize: '0.72rem' },
};

export default HomeScreen;