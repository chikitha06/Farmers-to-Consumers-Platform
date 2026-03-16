import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const ProductScreen = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [allSellers, setAllSellers] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const { addToCart, cartItems } = useCart();
  const { userInfo } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await api.get(`/products/${id}`);
        setProduct(data);
        setSelectedProduct(data);

        // Fetch all sellers for this product
        const { data: sellers } = await api.get(`/products/sellers?name=${encodeURIComponent(data.name)}`);
        setAllSellers(sellers);
        // Default: lowest price is pre-selected
        if (sellers.length > 0) setSelectedProduct(sellers[0]);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [id]);

  const qtyInCart = selectedProduct
    ? cartItems
        .filter((x) => x.product === selectedProduct._id && x.seller === selectedProduct.seller?._id)
        .reduce((a, x) => a + x.qty, 0)
    : 0;

  const totalQtyInCart = product
    ? cartItems
        .filter((x) => x.product === id || allSellers.some((s) => s._id === x.product))
        .reduce((a, x) => a + x.qty, 0)
    : 0;

  const handleAddToCart = () => {
    if (!userInfo) { navigate('/login'); return; }
    if (!selectedProduct || selectedProduct.countInStock === 0) { toast.error('Out of stock'); return; }
    addToCart({
      product: selectedProduct._id,
      seller: selectedProduct.seller._id,
      sellerName: selectedProduct.seller.name,
      name: selectedProduct.name,
      image: selectedProduct.image,
      price: selectedProduct.price,
      qty: 1,
    });
    toast.success('Added to cart!');
  };

  const handleBuyNow = () => {
    if (!userInfo) { navigate('/login'); return; }
    handleAddToCart();
    navigate('/checkout');
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '60px' }}>Loading product...</div>;
  if (!product) return <div style={{ textAlign: 'center', padding: '60px', color: 'red' }}>Product not found</div>;

  const discount = selectedProduct ? Math.round(((selectedProduct.mrp - selectedProduct.price) / selectedProduct.mrp) * 100) : 0;
  const stars = '★'.repeat(Math.round(product.rating || 0)) + '☆'.repeat(5 - Math.round(product.rating || 0));

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        {/* Left: Image */}
        <div style={styles.imageSection}>
          <img
            src={selectedProduct?.image || product.image}
            alt={product.name}
            style={styles.img}
            onError={(e) => e.target.src = 'https://via.placeholder.com/400x350?text=No+Image'}
          />
          <span style={styles.category}>{product.category}</span>
        </div>

        {/* Right: Details */}
        <div style={styles.details}>
          <h1 style={styles.name}>{product.name}</h1>

          <div style={styles.ratingRow}>
            <span style={{ color: '#f0a500' }}>{stars}</span>
            <span style={{ color: '#888', fontSize: '0.9rem' }}>({product.numReviews} reviews)</span>
            <button onClick={() => navigate(`/product/${id}/reviews`)} style={styles.reviewLink}>
              View Reviews →
            </button>
          </div>

          {selectedProduct && (
            <>
              <div style={styles.priceRow}>
                <span style={styles.price}>₹{selectedProduct.price}</span>
                <span style={styles.mrp}><s>₹{selectedProduct.mrp}</s></span>
                {discount > 0 && <span style={styles.discount}>{discount}% OFF</span>}
              </div>

              <div style={styles.stockInfo}>
                {selectedProduct.countInStock > 0 ? (
                  <span style={{ color: '#2d6a4f', fontWeight: '600' }}>✓ In Stock ({selectedProduct.countInStock} units)</span>
                ) : (
                  <span style={{ color: '#d62828', fontWeight: '600' }}>✗ Out of Stock</span>
                )}
              </div>

              {qtyInCart > 0 && (
                <div style={styles.cartInfo}>
                  <span>In cart (this seller): <strong>{qtyInCart}</strong></span>
                  {totalQtyInCart > qtyInCart && <span> | Total in cart: <strong>{totalQtyInCart}</strong></span>}
                </div>
              )}
            </>
          )}

          <p style={styles.description}>{product.description}</p>

          {/* Seller Selection */}
          {allSellers.length > 1 && (
            <div style={styles.sellerBox}>
              <h3 style={styles.sellerTitle}>Select Seller</h3>
              <div style={styles.sellerList}>
                {allSellers.map((s) => (
                  <div
                    key={s._id}
                    style={{
                      ...styles.sellerOption,
                      ...(selectedProduct?._id === s._id ? styles.sellerOptionActive : {}),
                    }}
                    onClick={() => setSelectedProduct(s)}
                  >
                    <div style={{ fontWeight: '600' }}>{s.seller.name}</div>
                    <div style={{ fontSize: '0.85rem', color: '#555' }}>₹{s.price} • {s.countInStock > 0 ? `${s.countInStock} left` : 'Out of stock'}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {allSellers.length === 1 && (
            <div style={styles.singleSeller}>
              Sold by: <strong>{allSellers[0]?.seller?.name}</strong>
            </div>
          )}

          {/* Action Buttons */}
          <div style={styles.actions}>
            <button
              onClick={handleAddToCart}
              disabled={!selectedProduct || selectedProduct.countInStock === 0}
              style={styles.cartBtn}
            >
              🛒 Add to Cart
            </button>
            <button
              onClick={handleBuyNow}
              disabled={!selectedProduct || selectedProduct.countInStock === 0}
              style={styles.buyBtn}
            >
              ⚡ Buy Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  page: { minHeight: '100vh', background: '#f8f9fa', padding: '24px' },
  container: { display: 'flex', gap: '32px', maxWidth: '1000px', margin: '0 auto', background: 'white', borderRadius: '16px', padding: '32px', boxShadow: '0 2px 20px rgba(0,0,0,0.08)', flexWrap: 'wrap' },
  imageSection: { flex: '1', minWidth: '280px', position: 'relative' },
  img: { width: '100%', borderRadius: '12px', objectFit: 'cover', maxHeight: '380px' },
  category: { position: 'absolute', top: '12px', right: '12px', background: '#2d6a4f', color: 'white', padding: '4px 12px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: '600' },
  details: { flex: '1.2', minWidth: '280px' },
  name: { fontSize: '1.8rem', color: '#1a1a2e', marginBottom: '10px' },
  ratingRow: { display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px', flexWrap: 'wrap' },
  reviewLink: { background: 'none', border: 'none', color: '#2d6a4f', cursor: 'pointer', fontSize: '0.9rem', textDecoration: 'underline' },
  priceRow: { display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' },
  price: { fontSize: '2rem', fontWeight: 'bold', color: '#2d6a4f' },
  mrp: { fontSize: '1.1rem', color: '#999' },
  discount: { background: '#e8f5e9', color: '#2d6a4f', padding: '3px 10px', borderRadius: '6px', fontSize: '0.9rem', fontWeight: 'bold' },
  stockInfo: { marginBottom: '12px' },
  cartInfo: { background: '#fff3e0', padding: '8px 12px', borderRadius: '6px', fontSize: '0.9rem', color: '#e65100', marginBottom: '12px' },
  description: { color: '#555', lineHeight: 1.7, marginBottom: '20px', fontSize: '0.95rem' },
  sellerBox: { background: '#f8f9fa', borderRadius: '10px', padding: '16px', marginBottom: '20px' },
  sellerTitle: { fontSize: '1rem', color: '#333', marginBottom: '10px' },
  sellerList: { display: 'flex', flexDirection: 'column', gap: '8px' },
  sellerOption: { border: '2px solid #e0e0e0', borderRadius: '8px', padding: '10px 14px', cursor: 'pointer', background: 'white', transition: 'all 0.2s' },
  sellerOptionActive: { borderColor: '#2d6a4f', background: '#e8f5e9' },
  singleSeller: { color: '#555', marginBottom: '20px', fontSize: '0.95rem' },
  actions: { display: 'flex', gap: '12px', flexWrap: 'wrap' },
  cartBtn: { flex: 1, padding: '14px', border: '2px solid #2d6a4f', background: 'white', color: '#2d6a4f', borderRadius: '10px', fontSize: '1rem', fontWeight: 'bold', cursor: 'pointer', minWidth: '140px' },
  buyBtn: { flex: 1, padding: '14px', background: '#2d6a4f', color: 'white', border: 'none', borderRadius: '10px', fontSize: '1rem', fontWeight: 'bold', cursor: 'pointer', minWidth: '140px' },
};

export default ProductScreen;