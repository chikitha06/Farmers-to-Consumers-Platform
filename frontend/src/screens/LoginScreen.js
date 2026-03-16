import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post('/users/login', { email, password });
      login(data);
      toast.success(`Welcome back, ${data.name}!`);
      if (data.role === 'admin') navigate('/admin/pending-products');
      else if (data.role === 'seller') navigate('/vendor/my-products');
      else navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <div style={styles.left}>
          <h1 style={styles.heroTitle}>🌾 FarmerMarket</h1>
          <p style={styles.heroText}>
            Fresh produce directly from farmers to your doorstep. Support local agriculture.
          </p>
          <div style={styles.ctaBox}>
            <p>Don't have an account?</p>
            <Link to="/register" style={styles.registerBtn}>Create Account →</Link>
          </div>
        </div>

        <div style={styles.right}>
          <h2 style={styles.title}>Sign In</h2>
          <form onSubmit={submitHandler}>
            <div style={styles.field}>
              <label style={styles.label}>Email Address</label>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={styles.input}
                required
              />
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Password</label>
              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={styles.input}
                required
              />
            </div>
            <div style={{ textAlign: 'right', marginBottom: '16px' }}>
              <Link to="/forgot-password" style={{ color: '#2d6a4f', fontSize: '0.85rem' }}>
                Forgot Password?
              </Link>
            </div>
            <button type="submit" disabled={loading} style={styles.btn}>
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div style={styles.demo}>
            <p style={{ fontSize: '0.8rem', color: '#777', marginBottom: '8px' }}>Demo Accounts:</p>
            <div style={styles.demoGrid}>
              {[
                { label: 'Customer', email: 'john@example.com' },
                { label: 'Seller', email: 'ram@farmer.com' },
                { label: 'Admin', email: 'admin@example.com' },
              ].map((acc) => (
                <button
                  key={acc.label}
                  style={styles.demoBtn}
                  onClick={() => { setEmail(acc.email); setPassword('password123'); }}
                >
                  {acc.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  page: { minHeight: '100vh', background: 'linear-gradient(135deg, #d8f3dc, #b7e4c7)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' },
  container: { display: 'flex', background: 'white', borderRadius: '16px', boxShadow: '0 10px 40px rgba(0,0,0,0.1)', overflow: 'hidden', maxWidth: '800px', width: '100%' },
  left: { background: '#2d6a4f', color: 'white', padding: '48px 32px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' },
  heroTitle: { fontSize: '2rem', marginBottom: '16px' },
  heroText: { fontSize: '1rem', lineHeight: 1.7, opacity: 0.9, marginBottom: '32px' },
  ctaBox: { background: 'rgba(255,255,255,0.1)', padding: '20px', borderRadius: '10px' },
  registerBtn: { display: 'inline-block', marginTop: '8px', color: '#95d5b2', fontWeight: 'bold', textDecoration: 'none', fontSize: '1rem' },
  right: { padding: '48px 40px', flex: 1 },
  title: { fontSize: '1.8rem', color: '#1a1a2e', marginBottom: '28px' },
  field: { marginBottom: '18px' },
  label: { display: 'block', marginBottom: '6px', fontWeight: '600', color: '#333', fontSize: '0.9rem' },
  input: { width: '100%', padding: '10px 14px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '1rem', boxSizing: 'border-box', outline: 'none' },
  btn: { width: '100%', padding: '12px', background: '#2d6a4f', color: 'white', border: 'none', borderRadius: '8px', fontSize: '1rem', fontWeight: 'bold', cursor: 'pointer' },
  demo: { marginTop: '24px', borderTop: '1px solid #eee', paddingTop: '16px' },
  demoGrid: { display: 'flex', gap: '8px' },
  demoBtn: { flex: 1, padding: '7px', background: '#f0f0f0', border: '1px solid #ddd', borderRadius: '6px', cursor: 'pointer', fontSize: '0.8rem' },
};

export default LoginScreen;