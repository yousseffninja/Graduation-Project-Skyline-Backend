const mongoose = require('mongoose')
const airplaneCompanyModel = require('./airplaneCompanyModel');

const flightSchema = new mongoose.Schema({
  flightName: {
    type: String,
    required: [true, 'Please provide flight name !']
  },
  seats: {
    type: Number,
    required: [true, 'Please provide how many seats available!']
  },
  classes: {
    type: String,
    required: [true, 'Please provide flight class!'],
    enum: {
      values: ['Class A', 'Class B', 'Class C'],
      message: 'Type must be Class A, Class B, Class C',
    },
  },
  rating: {
    type: Number,
    min: 1,
    max: 5
  },
  from: {
    type: String,
    required: [true, 'Please provide where flight go from ?']
  },
  to: {
    type: String,
    required: [true, 'Please provide where is flight go to ?'],
  },
  airplaneCompany: {
    type: mongoose.Schema.ObjectId,
    ref: 'airplane_company',
    required: [true, 'Please provide ID of airplane company']
  }
},
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  });

const Flight = mongoose.model('flights', flightSchema);


module.exports = Flight;