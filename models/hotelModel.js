const mongoose = require('mongoose');

const HotelSchema = new mongoose.Schema({
  hotelName: {
    type: String,
    required: [true, 'Please provide hotel name !']
  },
  type: {
    type: String,
    required: [true, 'Please provide hotel name !'],
    enum: ['Class A', 'Class B', 'Class C'],
  },
  city: {
    type: String,
    required: [true, 'Please provide hotel city location !'],
  },
  addresses: {
    type: Array,
    required: [true, 'Please Provide the room details'],
  },
  rooms: {
    type: Array,
    required: [true, 'Please Provide the room details'],
  },
  description: {
    type: String,
    required: [true, 'Please Provide the hotel description'],
  }
});

const Hotel = mongoose.model('hotel', HotelSchema);

module.exports = Hotel;