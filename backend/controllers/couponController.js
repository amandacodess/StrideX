const Coupon = require('../models/Coupon');

// POST /api/coupons  (admin)
const createCoupon = async (req, res) => {
  try {
    const { code, discount, expiryDate, usageLimit } = req.body;
    const exists = await Coupon.findOne({ code: code.toUpperCase() });
    if (exists) return res.status(400).json({ message: 'Coupon code already exists' });

    const coupon = await Coupon.create({ code, discount, expiryDate, usageLimit });
    res.status(201).json(coupon);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/coupons  (admin)
const getCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find().sort({ createdAt: -1 });
    res.json(coupons);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/coupons/validate/:code  (protected — customer)
const validateCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findOne({ code: req.params.code.toUpperCase() });

    if (!coupon) return res.status(404).json({ message: 'Coupon not found' });
    if (new Date(coupon.expiryDate) < new Date()) {
      return res.status(400).json({ message: 'Coupon has expired' });
    }
    if (coupon.usageLimit <= 0) {
      return res.status(400).json({ message: 'Coupon usage limit reached' });
    }

    res.json({ code: coupon.code, discount: coupon.discount });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE /api/coupons/:id  (admin)
const deleteCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findByIdAndDelete(req.params.id);
    if (!coupon) return res.status(404).json({ message: 'Coupon not found' });
    res.json({ message: 'Coupon deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createCoupon, getCoupons, validateCoupon, deleteCoupon };