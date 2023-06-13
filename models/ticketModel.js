const mongoose = require('mongoose');

const ticketModel = new mongoose.Schema({
  price: {
    type: Number,
    required: [true, 'Please provide ticket price'],
  },
  flight: [{
    type: mongoose.Schema.ObjectId,
    ref: 'flights',
  }],
  seatId: {
    type: String,
  },
  hotel: {
    type: mongoose.Schema.ObjectId,
    ref: 'hotel',
  },
  room: {
    type: mongoose.Schema.ObjectId,
    ref: 'room',
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