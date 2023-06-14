const mongoose = require('mongoose')

const AirplaneCompanySchema = new mongoose.Schema({
  airplaneName: {
    type: String,
    required: [true, 'Please provide airplane company name!']
  },
  cloudinaryIdAirplane: {
    type: String,
  },
  airplaneCompanyPhoto: {
    type: String,
  },
  description: {
    type: String,
    required: [true, 'Please provide airplane description'],
  },
  rating: {
    type: Number,
    min: 1,
    max: 5
  },
  ratingsQuantity: {
    type: Number,
    default: 0
  },
  ratingsAverage: {
    type: Number,
    default: 1,
    min: [1, 'Rating must be above 1.0'],
    max: [5, 'Rating must be below 5.0'],
    set: val => Math.round(val * 10) / 10
  },
  flights: {
    type: [{
      type: mongoose.Schema.ObjectId,
      ref: 'flights',
    }],
  },
},{
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

const airplaneCompany = mongoose.model('airplane_company', AirplaneCompanySchema);

module.exports = airplaneCompany