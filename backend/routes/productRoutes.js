const express = require('express');
const router = express.Router();
const {
  getProducts,
  getProductSellers,
  getProductById,
  createProduct,
  updateProduct,
  getMyProducts,
  getPendingProducts,
  verifyProductRequest,
  createProductReview,
  getProductReviews,
} = require('../controllers/productController');
const { protect, admin, seller } = require('../middleware/authMiddleware');

router.route('/').get(getProducts).post(protect, seller, createProduct);
router.get('/sellers', getProductSellers);
router.get('/myproducts', protect, seller, getMyProducts);
router.get('/pending', protect, admin, getPendingProducts);
router.put('/:id/verify', protect, admin, verifyProductRequest);
router.route('/:id/reviews').post(protect, createProductReview).get(getProductReviews);
router.route('/:id').get(getProductById).put(protect, seller, updateProduct);

module.exports = router;