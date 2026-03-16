import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { toast } from 'react-toastify';

const RegisterScreen = () => {
  const [step, setStep] = useState(1); // 1=form, 2=otp
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'customer' });
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const submitRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/users/register', formData);
      toast.success('OTP sent to your email! (Check server console in dev mode)');
      setStep(2);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const submitOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/users/verify-otp', { email: formData.email, otp });
      toast.success('Account verified! Please login.');
      navigate('/login');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.box}>
        <Link to="/login" style={styles.back}>← Back to Login</Link>
        <h2 style={styles.title}>
          {step === 1 ? '🌾 Create Account' : '📧 Verify Email'}
        </h2>

        {step === 1 ? (
          <form onSubmit={submitRegister}>
            <Field label="Full Name">
              <input name="name" placeholder="Your name" value={formData.name} onChange={handleChange} style={styles.input} required />
            </Field>
            <Field label="Email Address">
              <input name="email" type="email" placeholder="your@email.com" value={formData.email} onChange={handleChange} style={styles.input} required />
            </Field>
            <Field label="Password">
              <input name="password" type="password" placeholder="Create a password" value={formData.password} onChange={handleChange} style={styles.input} required minLength={6} />
            </Field>
            <Field label="Register as">
              <select name="role" value={formData.role} onChange={handleChange} style={styles.input}>
                <option value="customer">Customer (Buyer)</option>
                <option value="seller">Seller (Farmer/Vendor)</option>
              </select>
            </Field>
            <button type="submit" disabled={loading} style={styles.btn}>
              {loading ? 'Sending OTP...' : 'Send Verification OTP'}
            </button>
          </form>
        ) : (
          <form onSubmit={submitOTP}>
            <p style={{ color: '#555', marginBottom: '20px' }}>
              An OTP has been sent to <strong>{formData.email}</strong>.
              <br /><span style={{ fontSize: '0.85rem', color: '#888' }}>In development, check the server terminal for OTP.</span>
            </p>
            <Field label="Enter OTP">
              <input
                type="text"
                placeholder="6-digit OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                style={{ ...styles.input, letterSpacing: '8px', fontSize: '1.5rem', textAlign: 'center' }}
                maxLength={6}
                required
              />
            </Field>
            <button type="submit" disabled={loading} style={styles.btn}>
              {loading ? 'Verifying...' : 'Verify & Create Account'}
            </button>
            <button type="button" onClick={() => setStep(1)} style={styles.backBtn}>
              Go back & re-enter details
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

const Field = ({ label, children }) => (
  <div style={{ marginBottom: '16px' }}>
    <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', fontSize: '0.9rem', color: '#333' }}>{label}</label>
    {children}
  </div>
);

const styles = {
  page: { minHeight: '100vh', background: 'linear-gradient(135deg, #d8f3dc, #b7e4c7)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' },
  box: { background: 'white', padding: '40px', borderRadius: '16px', boxShadow: '0 10px 40px rgba(0,0,0,0.1)', maxWidth: '460px', width: '100%' },
  back: { color: '#2d6a4f', textDecoration: 'none', fontSize: '0.9rem' },
  title: { fontSize: '1.8rem', color: '#1a1a2e', margin: '16px 0 24px' },
  input: { width: '100%', padding: '10px 14px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '1rem', boxSizing: 'border-box' },
  btn: { width: '100%', padding: '12px', background: '#2d6a4f', color: 'white', border: 'none', borderRadius: '8px', fontSize: '1rem', fontWeight: 'bold', cursor: 'pointer', marginTop: '8px' },
  backBtn: { width: '100%', padding: '10px', background: 'transparent', color: '#666', border: '1px solid #ddd', borderRadius: '8px', cursor: 'pointer', marginTop: '10px', fontSize: '0.9rem' },
};

export default RegisterScreen;