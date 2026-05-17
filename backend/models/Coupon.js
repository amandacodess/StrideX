const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema(
  {
    code:        { type: String, required: true, unique: true, uppercase: true, trim: true },
    discount:    { type: Number, required: true, min: 1, max: 100 }, // percentage
    expiryDate:  { type: Date, required: true },
    usageLimit:  { type: Number, required: true, default: 100 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Coupon', couponSchema);