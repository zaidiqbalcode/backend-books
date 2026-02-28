const mongoose = require('mongoose');

const adEventSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    sessionId: {
      type: String,
      required: true,
    },
    eventType: {
      type: String,
      enum: ['view', 'click', 'add_to_cart', 'purchase', 'page_view'],
      required: true,
    },
    book: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Book',
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
    },
    ipAddress: String,
    userAgent: String,
  },
  {
    timestamps: true,
  }
);

// Index for better query performance
adEventSchema.index({ user: 1, eventType: 1, createdAt: -1 });
adEventSchema.index({ sessionId: 1 });

module.exports = mongoose.model('AdEvent', adEventSchema);
