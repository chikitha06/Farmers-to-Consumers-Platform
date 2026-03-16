const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');
const { protect, admin } = require('../middleware/authMiddleware');

// GET /api/admin/vendors/:id/products
router.get('/vendors/:id/products', protect, admin, async (req, res) => {
  try {
    const products = await Product.find({ seller: req.params.id });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/admin/vendors/:id/orders
router.get('/vendors/:id/orders', protect, admin, async (req, res) => {
  try {
    const orders = await Order.find({ 'orderItems.seller': req.params.id })
      .populate('user', 'name email')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;