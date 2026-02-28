const AdEvent = require('../models/AdEvent');

// @desc    Track ad event
// @route   POST /api/ads/track
// @access  Public/Private
exports.trackEvent = async (req, res) => {
  try {
    const { sessionId, eventType, bookId, metadata } = req.body;

    if (!sessionId || !eventType) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const eventData = {
      sessionId,
      eventType,
      metadata,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    };

    // Add user if authenticated
    if (req.user) {
      eventData.user = req.user._id;
    }

    // Add book if provided
    if (bookId) {
      eventData.book = bookId;
    }

    const adEvent = await AdEvent.create(eventData);

    res.status(201).json({
      success: true,
      data: adEvent,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get ad analytics
// @route   GET /api/ads/analytics
// @access  Private/Admin
exports.getAnalytics = async (req, res) => {
  try {
    const { startDate, endDate, eventType } = req.query;

    let query = {};

    // Date range filter
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    // Event type filter
    if (eventType) {
      query.eventType = eventType;
    }

    // Get event counts by type
    const eventCounts = await AdEvent.aggregate([
      { $match: query },
      {
        $group: {
          _id: '$eventType',
          count: { $sum: 1 },
        },
      },
    ]);

    // Get top viewed books
    const topBooks = await AdEvent.aggregate([
      { $match: { eventType: 'view', book: { $exists: true } } },
      {
        $group: {
          _id: '$book',
          views: { $sum: 1 },
        },
      },
      { $sort: { views: -1 } },
      { $limit: 10 },
      {
        $lookup: {
          from: 'books',
          localField: '_id',
          foreignField: '_id',
          as: 'bookDetails',
        },
      },
    ]);

    res.json({
      success: true,
      data: {
        eventCounts,
        topBooks,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
