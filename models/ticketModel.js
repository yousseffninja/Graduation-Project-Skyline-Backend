const mongoose = require('mongoose');

const ticketModel = new mongoose.Schema({
  price: {
    type: Number,
    required: [true, 'Please provide ticket price'],
  },
  // flight: [{
  //   type: mongoose.Schema.ObjectId,
  //   ref: 'flights',
  // }],
  flight: [Object],
  seatId: {
    type: String,
  },
  hotel: Object,
  room: Object,
  createdAt: {
    type: Date,
    default: Date.now
  },
  type: String,
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'user',
    required: [true, 'Need user information!']
  },
  orderId: {
    type: String,
    required: [true, 'Need order ID']
  },
  paymentStatus: {
    type: Boolean,
    required: [true, 'Need payment Status !']
  }
});

const Ticket = mongoose.model('ticket', ticketModel);

module.exports = Ticket;