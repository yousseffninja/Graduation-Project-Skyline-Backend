const mongoose = require('mongoose')
const airplaneCompanyModel = require('./airplaneCompanyModel');

const flightSchema = new mongoose.Schema({
  flightNo: {
    type: String,
    required: [true, 'Please provide flight name !'],
    validate: {
      validator: function(v) {
        const re = /^[A-Z]{2}[0-9]{3}$/;
        return (!v || !v.trim().length) || re.test(v)
      }
    }
  },
  Seats: {
    type: Object,
    default: {
      Row1: [  //right side
        { id: 'A1', empty: true, selected: false },
        { id: 'B1', empty: false, selected: false },
        { id: 'A2', empty: true, selected: false },
        { id: 'B2', empty: false, selected: true },
        { id: 'A3', empty: true, selected: false },
        { id: 'B3', empty: false, selected: false },
        { id: 'A2', empty: true, selected: false },
        { id: 'B4', empty: true, selected: false },
        { id: 'A5', empty: false, selected: true },
        { id: 'B5', empty: true, selected: false },
        { id: 'A6', empty: true, selected: false },
        { id: 'B6', empty: false, selected: true },
      ],
      Row2: [ //left side
        { id: 'C1', empty: false, selected: false },
        { id: 'D1', empty: true, selected: false },
        { id: 'E1', empty: false, selected: false },
        { id: 'C2', empty: false, selected: true },
        { id: 'D2', empty: true, selected: false },
        { id: 'E2', empty: false, selected: false },
        { id: 'C3', empty: true, selected: false },
        { id: 'A2', empty: true, selected: false },
        { id: 'E3', empty: true, selected: false },
        { id: 'C4', empty: true, selected: false },
        { id: 'D4', empty: false, selected: false },
        { id: 'E4', empty: true, selected: false },
        { id: 'A2', empty: true, selected: false },
        { id: 'D5', empty: true, selected: false },
        { id: 'E5', empty: true, selected: false },
        { id: 'C6', empty: true, selected: false },
        { id: 'D6', empty: false, selected: true },
        { id: 'E6', empty: true, selected: false },
      ]
    },
    // type: [{
    //   seatCode: {
    //     type: String,
    //     validate: {
    //       validator: function(v) {
    //         const re = /^[A-E]{1}[1-6]{1}$/;
    //         return (!v || !v.trim().length) || re.test(v)
    //       },
    //       message: 'Please Provide A correct notation for Seats'
    //     },
    //   },
    //   empty: {
    //     type: Boolean,
    //     default: true,
    //   },
    //   selected: {
    //     type: Boolean,
    //     default: true,
    //   },
    //   user: {
    //     type: mongoose.Schema.ObjectId,
    //     ref: 'User',
    //   }
    // }],
  },
  classes: {
    type: String,
    required: [true, 'Please provide flight class!'],
    enum: {
      values: ['Class A', 'Class B', 'Class C', 'Business', 'Economy'],
      message: 'Type must be Class A, Class B, Class C, Economy, or Business',
    },
  },
  from: {
    type: {
      location: {
        type: String,
        required: [true, 'Please Provide Location'],
      },
      time: {
        type: Date,
        required: [true, 'Please Provide Time to Launch']
      },
    }
  },
  to: {
    type: {
      location: {
        type: String,
        required: [true, 'Please Provide Location'],
      },
      time: {
        type: Date,
        required: [true, 'Please Provide Time to Land']
      },
    }
  },
  gate: {
    type: String,
    required: [true, 'Please Provide The gate Code!'],
    validate: {
      validator: function(v) {
        const re = /^[A-Z]{1}[0-9]{1}$/;
        return (!v || !v.trim().length) || re.test(v)
      },
    },
  },
  maxBagPerPerson: {
    type: Number,
    required: [true, 'Please provide max number of bags'],
    min: 1,
    max: 5,
  },
  price: {
    type: Number,
    required: [true, 'Please Provide Flight Price!']
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