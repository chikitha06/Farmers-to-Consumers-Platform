const Order = require('../models/Order');
const Product = require('../models/Product');

// @desc    Create new order
// @route   POST /api/orders
const addOrderItems = async (req, res) => {
  const { orderItems, shippingAddress, paymentMethod } = req.body;

  if (!orderItems || orderItems.length === 0) {
    return res.status(400).json({ message: 'No order items' });
  }

  try {
    // Validate stock and calculate total
    let totalPrice = 0;
    const validatedItems = [];

    for (const item of orderItems) {
      const product = await Product.findById(item.product).populate('seller', 'name');
      if (!product) return res.status(404).json({ message: `Product not found: ${item.name}` });
      if (product.countInStock < item.qty) {
        return res.status(400).json({ message: `Insufficient stock for ${product.name}` });
      }

      // Deduct stock
      product.countInStock -= item.qty;
      await product.save();

      totalPrice += product.price * item.qty;
      validatedItems.push({
        name: product.name,
        qty: item.qty,
        image: product.image,
        price: product.price,
        product: product._id,
        seller: product.seller._id,
        sellerName: product.seller.name,
      });
    }

    const order = new Order({
      user: req.user._id,
      orderItems: validatedItems,
      shippingAddress,
      paymentMethod,
      totalPrice,
    });

    const createdOrder = await order.save();
    res.status(201).json(createdOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get logged in user's orders
// @route   GET /api/orders/myorders
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single order by ID
// @route   GET /api/orders/:id
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'name email');
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Vendor: Get orders for this seller
// @route   GET /api/orders/sellerorders
const getSellerOrders = async (req, res) => {
  try {
    const orders = await Order.find({ 'orderItems.seller': req.user._id })
      .populate('user', 'name email')
      .sort({ createdAt: 1 });

    // Filter orderItems to only show this seller's items
    const filteredOrders = orders.map((order) => {
      const myItems = order.orderItems.filter(
        (item) => item.seller.toString() === req.user._id.toString()
      );
      return {
        _id: order._id,
        user: order.user,
        orderItems: myItems,
        shippingAddress: order.shippingAddress,
        paymentMethod: order.paymentMethod,
        isDelivered: order.isDelivered,
        deliveredAt: order.deliveredAt,
        createdAt: order.createdAt,
      };
    });

    res.json(filteredOrders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Vendor: Get delivered (history) orders
// @route   GET /api/orders/sellerorders/history
const getSellerOrderHistory = async (req, res) => {
  try {
    const orders = await Order.find({
      'orderItems.seller': req.user._id,
      isDelivered: true,
    })
      .populate('user', 'name email')
      .sort({ deliveredAt: -1 });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Vendor: Mark order as delivered
// @route   PUT /api/orders/:id/deliver
const updateOrderToDelivered = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    const isOwner = order.orderItems.some(
      (item) => item.seller.toString() === req.user._id.toString()
    );
    if (!isOwner && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    order.isDelivered = true;
    order.deliveredAt = Date.now();
    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Admin: Get all orders
// @route   GET /api/orders
const getOrders = async (req, res) => {
  try {
    const orders = await Order.find({}).populate('user', 'name email').sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  addOrderItems,
  getMyOrders,
  getOrderById,
  getSellerOrders,
  getSellerOrderHistory,
  updateOrderToDelivered,
  getOrders,
};