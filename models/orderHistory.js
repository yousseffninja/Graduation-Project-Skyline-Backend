const mongoose = require('mongoose');

const orderHistorySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
  },
  flight: {
    type: mongoose.Schema.ObjectId,
    ref: 'flights',
  },
  seat: {
    type: String,
  },
  price: {
    type: Number,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  });

const Orders = mongoose.model('order_history', orderHistorySchema);

module.exports = Orders;