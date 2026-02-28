// @desc    Get UPI payment details
// @route   POST /api/payment/create-order
// @access  Private
exports.createPaymentOrder = async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ message: 'Invalid amount' });
    }

    // Generate a unique order ID
    const orderId = 'ORDER_' + Date.now() + Math.random().toString(36).substr(2, 9).toUpperCase();

    // Return UPI payment details
    res.json({
      success: true,
      data: {
        orderId,
        amount,
        currency: 'INR',
        upiId: process.env.UPI_ID,
        upiName: process.env.UPI_NAME || 'ZAID IQBAL',
        qrCodeUrl: process.env.UPI_QR_CODE_URL || '/public/upi-qr.png',
        paymentMethod: 'UPI',
        instructions: [
          '1. Scan the QR code using any UPI app (Google Pay, PhonePe, Paytm, etc.)',
          '2. Enter the exact amount: ₹' + amount,
          '3. Complete the payment',
          '4. Take a screenshot of the payment confirmation',
          '5. Copy the transaction ID/UTR number',
          '6. Submit both for verification',
        ],
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Verify payment
// @route   POST /api/payment/verify
// @access  Private
exports.verifyPayment = async (req, res) => {
  try {
    const { orderId, transactionId, paymentScreenshot } = req.body;

    if (!orderId || !transactionId) {
      return res.status(400).json({ message: 'Missing payment details' });
    }

    // In production, you would verify the transaction with your payment gateway
    // For now, we'll mark it as pending verification

    res.json({
      success: true,
      message: 'Payment submitted for verification',
      data: {
        orderId,
        transactionId,
        status: 'pending',
        verified: false,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get payment status
// @route   GET /api/payment/status/:orderId
// @access  Private
exports.getPaymentStatus = async (req, res) => {
  try {
    const { orderId } = req.params;

    // In production, check actual payment status
    // For demo, return pending

    res.json({
      success: true,
      data: {
        orderId,
        status: 'pending',
        message: 'Payment verification in progress',
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
