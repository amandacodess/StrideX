const Order        = require('../models/Order');
const Payment      = require('../models/Payment');
const Product      = require('../models/Product');
const Coupon       = require('../models/Coupon');
const generateTxnId = require('../utils/generateTxnId');

// POST /api/orders
const createOrder = async (req, res) => {
  try {
    const { products, shippingAddress, couponCode, paymentMethod } = req.body;
    const userId = req.user._id;

    if (!products || products.length === 0) {
      return res.status(400).json({ message: 'No products in order' });
    }

    // Calculate total from DB prices (never trust client-sent prices)
    let totalAmount = 0;
    const resolvedProducts = [];

    for (const item of products) {
      const product = await Product.findById(item.productId);
      if (!product) return res.status(404).json({ message: `Product not found: ${item.productId}` });
      if (product.stock < item.quantity) {
        return res.status(400).json({ message: `Insufficient stock for ${product.name}` });
      }

      const lineTotal = product.price * item.quantity;
      totalAmount += lineTotal;

      resolvedProducts.push({
        productId: product._id,
        name:      product.name,
        price:     product.price,
        quantity:  item.quantity,
        size:      item.size || '',
        variant:   item.variant || '',
        image:     product.images?.[0] || '',
      });

      // Decrement stock
      product.stock -= item.quantity;
      await product.save();
    }

    // Apply coupon discount
    let discount = 0;
    let appliedCoupon = null;

    if (couponCode) {
      const coupon = await Coupon.findOne({ code: couponCode.toUpperCase() });
      if (coupon && new Date(coupon.expiryDate) > new Date() && coupon.usageLimit > 0) {
        discount = Math.round((totalAmount * coupon.discount) / 100);
        totalAmount -= discount;
        coupon.usageLimit -= 1;
        await coupon.save();
        appliedCoupon = couponCode.toUpperCase();
      }
    }

    // Save order
    const order = await Order.create({
      userId,
      products:        resolvedProducts,
      shippingAddress,
      couponCode:      appliedCoupon,
      discount,
      totalAmount,
      paymentMethod:   paymentMethod || 'simulated',
      paymentStatus:   'Paid',     // simulated — always succeeds
      orderStatus:     'Pending',
    });

    // Generate fake transaction ID and save payment record
    const transactionId = generateTxnId();

    const payment = await Payment.create({
      orderId:       order._id,
      userId,
      transactionId,
      amount:        totalAmount,
      paymentMethod: paymentMethod || 'simulated',
      paymentStatus: 'Paid',
    });

    res.status(201).json({
      message:       'Order placed successfully',
      orderId:       order._id,
      transactionId: payment.transactionId,
      totalAmount,
      orderStatus:   order.orderStatus,
    });

  } catch (err) {
    console.error('createOrder error:', err);
    res.status(500).json({ message: 'Server error placing order' });
  }
};

// GET /api/orders — user's own orders
const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// GET /api/orders/all — admin only
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate('userId', 'name email').sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// PUT /api/orders/:id — admin updates status
const updateOrderStatus = async (req, res) => {
  try {
    const { orderStatus } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { orderStatus },
      { new: true }
    );
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { createOrder, getUserOrders, getAllOrders, updateOrderStatus };