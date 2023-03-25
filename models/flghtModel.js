const mongoose = require('mongoose')
const airplaneCompanyModel = require('./airplaneCompanyModel');

const flightSchema = new mongoose.Schema({
  flightName: {
    type: String,
    required: [true, 'Please provide flight name !']
  },
  numOfSeats: {
    type: Number,
    required: [true, 'Please provide how many seats available!']
  },
  Seats: {
    type: [{
      seatCode: {
        type: String,
        validate: {
          validator: function(v) {
            const re = /^[A-E]{1}[1-6]{1}$/;
            return (!v || !v.trim().length) || re.test(v)
          },
          message: 'Please Provide A correct notation for Seats'
        },
      },
      taken: {
        type: Boolean,
        default: false,
      },
      user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
      }
    }],
  },
  classes: {
    type: String,
    required: [true, 'Please provide flight class!'],
    enum: {
      values: ['Class A', 'Class B', 'Class C', 'Business'],
      message: 'Type must be Class A, Class B, Class C, or Business',
    },
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
    min: [1, 'Rating must be above 1.0'],
    max: [5, 'Rating must be below 5.0'],
    set: val => Math.round(val * 10) / 10
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