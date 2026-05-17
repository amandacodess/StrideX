const express = require('express');
const router  = express.Router();
const { createOrder, getUserOrders, getAllOrders, updateOrderStatus } = require('../controllers/orderController');
const { protect } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/adminMiddleware');

router.post('/',         protect, createOrder);
router.get('/',          protect, getUserOrders);
router.get('/all',       protect, adminOnly, getAllOrders);
router.put('/:id',       protect, adminOnly, updateOrderStatus);

module.exports = router;