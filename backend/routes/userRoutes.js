const express = require('express');
const router = express.Router();
const {
  registerUser,
  verifyOTP,
  authUser,
  forgotPassword,
  resetPassword,
  getUserProfile,
  getVendors,
  getVendorById,
  deleteVendor,
} = require('../controllers/userController');
const { protect, admin } = require('../middleware/authMiddleware');

router.post('/register', registerUser);
router.post('/verify-otp', verifyOTP);
router.post('/login', authUser);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.get('/profile', protect, getUserProfile);

// Admin routes
router.get('/vendors', protect, admin, getVendors);
router.get('/vendors/:id', protect, admin, getVendorById);
router.delete('/vendors/:id', protect, admin, deleteVendor);

module.exports = router;