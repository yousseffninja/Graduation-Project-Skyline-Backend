const mongoose = require('mongoose');

const RoomSchema = new mongoose.Schema({
  type: {
    type: String,
    required: [true, 'Please Provide the type of Room'],
    enum: {
      values: ['Single', 'Double', 'Triple'],
      message: 'Type must be Single, Double or Triple',
    },
  },
  space: {
    type: Number,
    required: [true, 'Please Provide Room space']
  },
  Beds: {
    bed: Number,
    bigBed: Number
  },
  facilities: [{
    type: String,
    enum: ['free wifi', 'Break fast', 'garden view', 'kitchen',  'sea view'],
  }],
  notfacilities: [{
    type: String,
    enum: ['partially refundable'],
  }],
  price: {
    type: Number,
    required: [true, 'Please provide room Price per day']
  },
  hotelId: {
    type: mongoose.Schema.ObjectId,
    ref: 'hotel'
  },
  roomPhoto: String,
  cloudinaryId: String,
});

const Room = mongoose.model('room', RoomSchema);

module.exports = Room