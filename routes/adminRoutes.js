const express = require('express');
const router = express.Router();
const {
  getDashboardStats,
  getAllOrders,
  getAllUsers,
  updateOrderStatus,
} = require('../controllers/adminController');
const { protect, admin } = require('../middleware/authMiddleware');

// Temporarily make admin routes public for demo purposes
// In production, you should require proper authentication
router.get('/dashboard', getDashboardStats);
router.get('/orders', getAllOrders);
router.get('/users', getAllUsers);
router.put('/orders/:id', updateOrderStatus);

module.exports = router;
