const express = require('express');
const router = express.Router();
const {
  createOrder,
  getMyOrders,
  getOrder,
  updateOrder,
} = require('../controllers/orderController');
const { protect } = require('../middleware/authMiddleware');

// Public route - no authentication required for guest checkout
router.post('/', createOrder);
router.get('/my-orders', protect, getMyOrders);
router.get('/:id', protect, getOrder);
router.put('/:id', protect, updateOrder);

module.exports = router;
