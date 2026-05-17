const express = require('express');
const router  = express.Router();
const {
  createCoupon, getCoupons, validateCoupon, deleteCoupon,
} = require('../controllers/couponController');
const { protect }   = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/adminMiddleware');

router.post('/',                protect, adminOnly, createCoupon);
router.get('/',                 protect, adminOnly, getCoupons);
router.get('/validate/:code',   protect, validateCoupon);
router.delete('/:id',           protect, adminOnly, deleteCoupon);

module.exports = router;