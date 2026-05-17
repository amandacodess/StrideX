const express = require('express');
const router  = express.Router();
const {
  getDashboardStats, getAllUsers, updateUserRole, deleteUser,
  getAllPayments, getInventory,
} = require('../controllers/adminController');
const { protect }   = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/adminMiddleware');

router.use(protect, adminOnly);

router.get('/stats',           getDashboardStats);
router.get('/users',           getAllUsers);
router.put('/users/:id/role',  updateUserRole);
router.delete('/users/:id',    deleteUser);
router.get('/payments',        getAllPayments);
router.get('/inventory',       getInventory);

module.exports = router;
