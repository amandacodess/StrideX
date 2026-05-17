const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    products: [
      {
        productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
        name:      { type: String },
        price:     { type: Number },
        quantity:  { type: Number },
        size:      { type: String },
        variant:   { type: String },
        image:     { type: String },
      },
    ],
    shippingAddress: {
      fullName: { type: String, required: true },
      phone:    { type: String, required: true },
      street:   { type: String, required: true },
      city:     { type: String, required: true },
      state:    { type: String, required: true },
      pincode:  { type: String, required: true },
    },
    couponCode:    { type: String, default: null },
    discount:      { type: Number, default: 0 },
    totalAmount:   { type: Number, required: true },
    paymentMethod: { type: String, default: 'simulated' },
    paymentStatus: { type: String, enum: ['Pending', 'Paid', 'Failed'], default: 'Pending' },
    orderStatus:   {
      type: String,
      enum: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'],
      default: 'Pending',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Order', orderSchema);