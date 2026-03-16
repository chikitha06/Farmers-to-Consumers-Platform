const User = require('../models/User');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const nodemailer = require('nodemailer');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const sendOTPEmail = async (email, otp, name) => {
  // In development, just log the OTP if email not configured
  if (!process.env.EMAIL_USER || process.env.EMAIL_USER === 'your_email@gmail.com') {
    console.log(`\n=============================`);
    console.log(`OTP for ${email}: ${otp}`);
    console.log(`=============================\n`);
    return true;
  }

  const transporter = nodemailer.createTransporter({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: `"FarmerMarket" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Verify your FarmerMarket account',
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 500px;">
        <h2 style="color: #2d6a4f;">Welcome to FarmerMarket, ${name}!</h2>
        <p>Your OTP for account verification is:</p>
        <div style="background: #f0f0f0; padding: 20px; text-align: center; font-size: 32px; font-weight: bold; letter-spacing: 8px; border-radius: 8px;">
          ${otp}
        </div>
        <p>This OTP expires in 10 minutes.</p>
      </div>
    `,
  });
  return true;
};

// @desc    Register user + send OTP
// @route   POST /api/users/register
const registerUser = async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    const userExists = await User.findOne({ email: email.toLowerCase() });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 min

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password,
      role: role || 'customer',
      isVerified: false,
      otp,
      otpExpiry,
    });

    await sendOTPEmail(user.email, otp, user.name);

    res.status(201).json({
      message: 'OTP sent to your email. Please verify your account.',
      email: user.email,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Verify OTP
// @route   POST /api/users/verify-otp
const verifyOTP = async (req, res) => {
  const { email, otp } = req.body;

  try {
    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) return res.status(404).json({ message: 'User not found' });
    if (user.isVerified) return res.status(400).json({ message: 'Account already verified' });
    if (user.otp !== otp) return res.status(400).json({ message: 'Invalid OTP' });
    if (user.otpExpiry < new Date()) return res.status(400).json({ message: 'OTP expired. Please register again.' });

    user.isVerified = true;
    user.otp = undefined;
    user.otpExpiry = undefined;
    await user.save();

    res.json({ message: 'Account verified successfully! You can now login.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Login user
// @route   POST /api/users/login
const authUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email: email.toLowerCase() });
    
    if (!user) return res.status(401).json({ message: 'Invalid email or password' });
    if (!user.isVerified) return res.status(401).json({ message: 'Please verify your email first' });
    if (!user.isActive) return res.status(401).json({ message: 'Account has been suspended' });

    const isMatch = await user.matchPassword(password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid email or password' });

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      address: user.address,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Forgot password - send OTP
// @route   POST /api/users/forgot-password
const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(404).json({ message: 'No account found with that email' });

    const otp = generateOTP();
    user.otp = otp;
    user.otpExpiry = new Date(Date.now() + 10 * 60 * 1000);
    await user.save();

    await sendOTPEmail(user.email, otp, user.name);
    res.json({ message: 'Password reset OTP sent to your email' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Reset password with OTP
// @route   POST /api/users/reset-password
const resetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;

  try {
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (user.otp !== otp) return res.status(400).json({ message: 'Invalid OTP' });
    if (user.otpExpiry < new Date()) return res.status(400).json({ message: 'OTP expired' });

    user.password = newPassword;
    user.otp = undefined;
    user.otpExpiry = undefined;
    await user.save();

    res.json({ message: 'Password reset successfully! Please login.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user profile
// @route   GET /api/users/profile
const getUserProfile = async (req, res) => {
  const user = await User.findById(req.user._id).select('-password');
  if (user) {
    res.json(user);
  } else {
    res.status(404).json({ message: 'User not found' });
  }
};

// @desc    Admin: Get all vendors
// @route   GET /api/users/vendors
const getVendors = async (req, res) => {
  try {
    const vendors = await User.find({ role: 'seller' }).select('-password');
    res.json(vendors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Admin: Get vendor details
// @route   GET /api/users/vendors/:id
const getVendorById = async (req, res) => {
  try {
    const vendor = await User.findById(req.params.id).select('-password');
    if (!vendor) return res.status(404).json({ message: 'Vendor not found' });
    res.json(vendor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Admin: Delete/deactivate vendor
// @route   DELETE /api/users/vendors/:id
const deleteVendor = async (req, res) => {
  try {
    const vendor = await User.findById(req.params.id);
    if (!vendor) return res.status(404).json({ message: 'Vendor not found' });

    vendor.isActive = false;
    await vendor.save();

    // Hide all their products
    const Product = require('../models/Product');
    await Product.updateMany({ seller: vendor._id }, { isVerified: false });

    res.json({ message: 'Vendor removed and products hidden' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  registerUser,
  verifyOTP,
  authUser,
  forgotPassword,
  resetPassword,
  getUserProfile,
  getVendors,
  getVendorById,
  deleteVendor,
};