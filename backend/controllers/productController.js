const Product = require('../models/Product');
const Notification = require('../models/Notification');

// @desc    Fetch all verified products grouped by name (Customer Side)
// @route   GET /api/products
const getProducts = async (req, res) => {
  try {
    const { category } = req.query;
    const matchStage = { isVerified: true };
    if (category) matchStage.category = category;

    const products = await Product.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: '$name',
          productId: { $first: '$_id' },
          image: { $first: '$image' },
          category: { $first: '$category' },
          description: { $first: '$description' },
          minPrice: { $min: '$price' },
          mrp: { $first: '$mrp' },
          avgRating: { $avg: '$rating' },
          totalReviews: { $sum: '$numReviews' },
          totalStock: { $sum: '$countInStock' },
          createdAt: { $first: '$createdAt' },
          sellerCount: { $sum: 1 },
        },
      },
      { $sort: { createdAt: -1 } },
    ]);

    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all sellers for a product by name
// @route   GET /api/products/sellers?name=ProductName
const getProductSellers = async (req, res) => {
  try {
    const { name } = req.query;
    if (!name) return res.status(400).json({ message: 'Product name required' });

    const products = await Product.find({ name, isVerified: true, countInStock: { $gt: 0 } })
      .populate('seller', 'name email phone')
      .sort({ price: 1 }); // Sort by lowest price first

    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single product by ID
// @route   GET /api/products/:id
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('seller', 'name email phone');
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Vendor: Create product request
// @route   POST /api/products
const createProduct = async (req, res) => {
  const { name, price, mrp, description, image, category, countInStock } = req.body;

  try {
    const product = new Product({
      name,
      price,
      mrp,
      description,
      image: image || '/uploads/placeholder.jpg',
      category,
      countInStock,
      seller: req.user._id,
      isVerified: false,
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Vendor: Update own product price/stock
// @route   PUT /api/products/:id
const updateProduct = async (req, res) => {
  const { price, countInStock, addStock, removeStock } = req.body;

  try {
    const product = await Product.findById(req.params.id);

    if (!product) return res.status(404).json({ message: 'Product not found' });
    if (product.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this product' });
    }

    if (price !== undefined) product.price = price;
    if (countInStock !== undefined) product.countInStock = countInStock;
    if (addStock !== undefined) product.countInStock += Number(addStock);
    if (removeStock !== undefined) product.countInStock = Math.max(0, product.countInStock - Number(removeStock));

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Vendor: Get own products
// @route   GET /api/products/myproducts
const getMyProducts = async (req, res) => {
  try {
    const products = await Product.find({ seller: req.user._id });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Admin: Get all pending products
// @route   GET /api/products/pending
const getPendingProducts = async (req, res) => {
  try {
    const products = await Product.find({ isVerified: false }).populate('seller', 'name email');
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Admin: Accept or Reject product request
// @route   PUT /api/products/:id/verify
const verifyProductRequest = async (req, res) => {
  const { status } = req.body;

  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    if (status === 'accept') {
      product.isVerified = true;
      await product.save();

      await Notification.create({
        user: product.seller,
        message: `✅ Your product "${product.name}" has been approved and is now live on the website!`,
      });

      res.json({ message: 'Product accepted and now live' });
    } else {
      const sellerRef = product.seller;
      const productName = product.name;
      await Product.findByIdAndDelete(req.params.id);

      await Notification.create({
        user: sellerRef,
        message: `❌ Your product request for "${productName}" was rejected by admin.`,
      });

      res.json({ message: 'Product rejected and removed' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Customer: Create product review (only after delivery, once)
// @route   POST /api/products/:id/reviews
const createProductReview = async (req, res) => {
  const { rating, comment } = req.body;

  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    const alreadyReviewed = product.reviews.find(
      (r) => r.user.toString() === req.user._id.toString()
    );
    if (alreadyReviewed) {
      return res.status(400).json({ message: 'You have already reviewed this product' });
    }

    const review = {
      user: req.user._id,
      name: req.user.name,
      rating: Number(rating),
      comment,
    };

    product.reviews.push(review);
    product.numReviews = product.reviews.length;
    product.rating = product.reviews.reduce((acc, r) => r.rating + acc, 0) / product.reviews.length;

    await product.save();
    res.status(201).json({ message: 'Review added successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get product reviews
// @route   GET /api/products/:id/reviews
const getProductReviews = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('reviews.user', 'name');
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product.reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
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
};