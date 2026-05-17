const User    = require('../models/User');
const Product = require('../models/Product');
const Order   = require('../models/Order');
const Payment = require('../models/Payment');

// GET /api/admin/stats
const getDashboardStats = async (req, res) => {
  try {
    const totalProducts  = await Product.countDocuments();
    const totalOrders    = await Order.countDocuments();
    const totalUsers     = await User.countDocuments({ role: 'customer' });
    const lowStockItems  = await Product.find({ stock: { $lt: 5 } }).select('name stock');
    const revenueData    = await Order.aggregate([
      { $match: { paymentStatus: 'Paid' } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } },
    ]);
    const totalRevenue   = revenueData[0]?.total || 0;
    const recentOrders   = await Order
      .find()
      .populate('userId', 'name email')
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      totalProducts,
      totalOrders,
      totalUsers,
      totalRevenue,
      lowStockItems,
      recentOrders,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/admin/users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PUT /api/admin/users/:id/role
const updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    if (!['customer', 'admin'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    ).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE /api/admin/users/:id
const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ message: 'User deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/admin/payments
const getAllPayments = async (req, res) => {
  try {
    const payments = await Payment
      .find()
      .populate('userId',  'name email')
      .populate('orderId', 'orderStatus totalAmount')
      .sort({ createdAt: -1 });
    res.json(payments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/admin/inventory
const getInventory = async (req, res) => {
  try {
    const products = await Product
      .find()
      .select('name category stock images')
      .sort({ stock: 1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getDashboardStats,
  getAllUsers,
  updateUserRole,
  deleteUser,
  getAllPayments,
  getInventory,
};