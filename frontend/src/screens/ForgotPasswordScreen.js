import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { toast } from 'react-toastify';

const ForgotPasswordScreen = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const sendOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/users/forgot-password', { email });
      toast.success('OTP sent! Check your email (or server console).');
      setStep(2);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error');
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/users/reset-password', { email, otp, newPassword });
      toast.success('Password reset successfully! Please login.');
      navigate('/login');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.box}>
        <Link to="/login" style={styles.back}>← Back to Login</Link>
        <h2 style={styles.title}>🔑 Reset Password</h2>

        {step === 1 ? (
          <form onSubmit={sendOTP}>
            <p style={{ color: '#555', marginBottom: '20px' }}>Enter your registered email to receive a reset OTP.</p>
            <label style={styles.label}>Email Address</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} style={styles.input} placeholder="your@email.com" required />
            <button type="submit" disabled={loading} style={styles.btn}>{loading ? 'Sending...' : 'Send OTP'}</button>
          </form>
        ) : (
          <form onSubmit={resetPassword}>
            <label style={styles.label}>OTP</label>
            <input type="text" value={otp} onChange={(e) => setOtp(e.target.value)} style={{ ...styles.input, letterSpacing: '6px', textAlign: 'center', fontSize: '1.3rem' }} maxLength={6} required />
            <label style={{ ...styles.label, marginTop: '16px' }}>New Password</label>
            <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} style={styles.input} placeholder="New password (min 6 chars)" required minLength={6} />
            <button type="submit" disabled={loading} style={styles.btn}>{loading ? 'Resetting...' : 'Reset Password'}</button>
          </form>
        )}
      </div>
    </div>
  );
};

const styles = {
  page: { minHeight: '100vh', background: 'linear-gradient(135deg, #d8f3dc, #b7e4c7)', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  box: { background: 'white', padding: '40px', borderRadius: '16px', boxShadow: '0 10px 40px rgba(0,0,0,0.1)', maxWidth: '440px', width: '90%' },
  back: { color: '#2d6a4f', textDecoration: 'none', fontSize: '0.9rem' },
  title: { fontSize: '1.8rem', color: '#1a1a2e', margin: '16px 0 20px' },
  label: { display: 'block', marginBottom: '6px', fontWeight: '600', fontSize: '0.9rem', color: '#333' },
  input: { width: '100%', padding: '10px 14px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '1rem', boxSizing: 'border-box', marginBottom: '16px' },
  btn: { width: '100%', padding: '12px', background: '#2d6a4f', color: 'white', border: 'none', borderRadius: '8px', fontSize: '1rem', fontWeight: 'bold', cursor: 'pointer' },
};

export default ForgotPasswordScreen;