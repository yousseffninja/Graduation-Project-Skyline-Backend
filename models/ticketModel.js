const mongoose = require('mongoose');
const flightModel = require('./flghtModel')

const ticketModel = new mongoose.Schema({
  price: {
    type: Number,
    required: [true, 'Please provide ticket price'],
  },
  flight: {
    type: mongoose.Schema.ObjectId,
    ref: 'flights',
    required: [true, 'Please provide ID for flight']
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'user',
    required: [true, 'Need user information!']
  },
});

const Ticket = mongoose.model('ticket', ticketModel);

module.exports = Ticket;