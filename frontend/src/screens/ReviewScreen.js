import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { toast } from 'react-toastify';

const ReviewScreen = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [hovered, setHovered] = useState(0);

  useEffect(() => {
    const fetch = async () => {
      const { data: p } = await api.get(`/products/${id}`);
      setProduct(p);
      const { data: r } = await api.get(`/products/${id}/reviews`);
      setReviews(r);
    };
    fetch();
  }, [id]);

  const submitReview = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post(`/products/${id}/reviews`, { rating, comment });
      toast.success('Review submitted!');
      const { data: r } = await api.get(`/products/${id}/reviews`);
      setReviews(r);
      setComment('');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit review');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <button onClick={() => navigate(-1)} style={styles.back}>← Back to Product</button>
      <h1 style={styles.title}>Reviews: {product?.name}</h1>

      {/* Write Review Form */}
      <div style={styles.card}>
        <h2 style={styles.cardTitle}>Write a Review</h2>
        <form onSubmit={submitReview}>
          <div style={{ marginBottom: '16px' }}>
            <label style={styles.label}>Your Rating</label>
            <div style={{ display: 'flex', gap: '4px', fontSize: '2rem' }}>
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  style={{ cursor: 'pointer', color: star <= (hovered || rating) ? '#f0a500' : '#ddd', transition: 'color 0.1s' }}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHovered(star)}
                  onMouseLeave={() => setHovered(0)}
                >★</span>
              ))}
            </div>
            <div style={{ color: '#888', fontSize: '0.85rem', marginTop: '4px' }}>
              {['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent'][hovered || rating]}
            </div>
          </div>
          <div style={{ marginBottom: '16px' }}>
            <label style={styles.label}>Your Review</label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share your experience with this product..."
              style={styles.textarea}
              required
              rows={4}
            />
          </div>
          <button type="submit" disabled={loading} style={styles.submitBtn}>
            {loading ? 'Submitting...' : 'Submit Review'}
          </button>
        </form>
      </div>

      {/* Reviews List */}
      <div style={styles.card}>
        <h2 style={styles.cardTitle}>All Reviews ({reviews.length})</h2>
        {reviews.length === 0 ? (
          <p style={{ color: '#888' }}>No reviews yet. Be the first!</p>
        ) : (
          reviews.map((r, i) => (
            <div key={i} style={styles.reviewItem}>
              <div style={styles.reviewHeader}>
                <strong>{r.name}</strong>
                <span style={{ color: '#f0a500' }}>{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</span>
                <span style={{ color: '#aaa', fontSize: '0.8rem' }}>{new Date(r.createdAt).toLocaleDateString('en-IN')}</span>
              </div>
              <p style={{ color: '#555', margin: '6px 0 0', lineHeight: 1.6 }}>{r.comment}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

const styles = {
  page: { minHeight: '100vh', background: '#f8f9fa', padding: '24px', maxWidth: '700px', margin: '0 auto' },
  back: { background: 'none', border: 'none', color: '#2d6a4f', cursor: 'pointer', fontSize: '0.95rem', marginBottom: '16px', padding: 0 },
  title: { fontSize: '1.6rem', color: '#1a1a2e', marginBottom: '20px' },
  card: { background: 'white', borderRadius: '12px', padding: '24px', marginBottom: '20px', boxShadow: '0 1px 8px rgba(0,0,0,0.06)' },
  cardTitle: { fontSize: '1.1rem', color: '#333', marginBottom: '18px', borderBottom: '1px solid #eee', paddingBottom: '10px' },
  label: { display: 'block', fontWeight: '600', fontSize: '0.9rem', color: '#333', marginBottom: '8px' },
  textarea: { width: '100%', padding: '10px 14px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '0.95rem', boxSizing: 'border-box', resize: 'vertical' },
  submitBtn: { background: '#2d6a4f', color: 'white', border: 'none', padding: '11px 28px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.95rem' },
  reviewItem: { borderBottom: '1px solid #f0f0f0', paddingBottom: '16px', marginBottom: '16px' },
  reviewHeader: { display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' },
};

export default ReviewScreen;