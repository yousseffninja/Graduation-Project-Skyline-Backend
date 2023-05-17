const mongoose = require('mongoose');

const HotelSchema = new mongoose.Schema({
  hotelName: {
    type: String,
    required: [true, 'Please provide hotel name !']
  },
  price: {
    type: Number,
    required: [true, 'Please provide hotel price !']
  },
  country: {
    type: String,
    required: [true, 'Please provide hotel country location !'],
  },
  city: {
    type: String,
    required: [true, 'Please provide hotel city location !'],
  },
  images: [
    { type: String }
  ],
  address: {
    type: String,
    required: [true, 'Please Provide the room address'],
  },
  rooms: {
    type: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'room'
      }
    ],
  },
  ratingsAverage: {
    type: Number,
    default: 1,
    min: [1, 'Rating must be above 1.0'],
    max: [5, 'Rating must be below 5.0'],
    set: val => Math.round(val * 10) / 10
  },
  ratingsQuantity: {
    type: Number,
    default: 0
  },
  description: {
    type: String,
    required: [true, 'Please Provide the hotel description'],
  },
  location: {
    latitude: Number,
    longitude: Number
  },
  hotelPhoto: String,
  cloudinaryId: String

},{
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

const Hotel = mongoose.model('hotel', HotelSchema);

module.exports = Hotel;