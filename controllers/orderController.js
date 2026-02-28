const Order = require('../models/Order');
const Book = require('../models/Book');

// @desc    Create new order
// @route   POST /api/orders
// @access  Public (Guest checkout allowed)
exports.createOrder = async (req, res) => {
  try {
    const { books, totalAmount, customerDetails, paymentId, transactionId } = req.body;

    if (!books || books.length === 0) {
      return res.status(400).json({ message: 'No order items' });
    }

    if (!customerDetails || !customerDetails.fullName || !customerDetails.email) {
      return res.status(400).json({ message: 'Customer details are required' });
    }

    // Create order (user is optional for guest checkout)
    const order = await Order.create({
      user: req.user?._id || null, // null for guest orders
      books,
      totalAmount,
      customerDetails,
      paymentId: paymentId || 'ORDER_' + Date.now(),
      transactionId: transactionId || '',
      status: 'pending',
    });

    res.status(201).json({
      success: true,
      data: order,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user orders
// @route   GET /api/orders/my-orders
// @access  Private
exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate('books.book', 'title author image')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: orders.length,
      data: orders,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single order
// @route   GET /api/orders/:id
// @access  Private
exports.getOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate(
      'books.book',
      'title author image price'
    );

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Make sure user owns this order
    if (order.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(401).json({ message: 'Not authorized' });
    }

    res.json({
      success: true,
      data: order,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update order status
// @route   PUT /api/orders/:id
// @access  Private
exports.updateOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Only allow user to update their own order or admin
    if (order.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(401).json({ message: 'Not authorized' });
    }

    // Update fields
    if (req.body.paymentId) order.paymentId = req.body.paymentId;
    if (req.body.transactionId) order.transactionId = req.body.transactionId;
    if (req.body.status) order.status = req.body.status;
    if (req.body.paymentScreenshot) order.paymentScreenshot = req.body.paymentScreenshot;

    const updatedOrder = await order.save();

    res.json({
      success: true,
      data: updatedOrder,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
