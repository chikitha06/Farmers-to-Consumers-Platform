const express = require('express');
const router = express.Router();
const {
  addOrderItems,
  getMyOrders,
  getOrderById,
  getSellerOrders,
  getSellerOrderHistory,
  updateOrderToDelivered,
  getOrders,
} = require('../controllers/orderController');
const { protect, admin, seller } = require('../middleware/authMiddleware');

router.route('/').post(protect, addOrderItems).get(protect, admin, getOrders);
router.get('/myorders', protect, getMyOrders);
router.get('/sellerorders', protect, seller, getSellerOrders);
router.get('/sellerorders/history', protect, seller, getSellerOrderHistory);
router.get('/:id', protect, getOrderById);
router.put('/:id/deliver', protect, seller, updateOrderToDelivered);

module.exports = router;