const mongoose = require('mongoose');

const orderSchema = mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    orderItems: [
      {
        name: { type: String, required: true },
        qty: { type: Number, required: true },
        image: { type: String, required: true },
        price: { type: Number, required: true },
        product: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Product' },
        seller: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
        sellerName: { type: String },
      },
    ],
    shippingAddress: {
      address: { type: String, required: true },
      city: { type: String, required: true },
      pincode: { type: String, default: '' },
    },
    paymentMethod: { type: String, required: true },
    totalPrice: { type: Number, required: true, default: 0 },
    isDelivered: { type: Boolean, required: true, default: false },
    deliveredAt: { type: Date },
    isReviewed: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Order', orderSchema);