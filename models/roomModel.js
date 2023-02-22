const mongoose = require('mongoose');

const RoomSchema = new mongoose.Schema({
  type: {
    type: String,
    required: [true, 'Please Provide the type of Room'],
    enum: ['Single', 'Double', 'Triple'],
  },
  price: {
    type: Number,
    required: [true, 'Please provide room Price per day']
  },
});

const Room = mongoose.model('room', RoomSchema);

module.exports = Room