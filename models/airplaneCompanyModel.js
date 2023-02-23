const mongoose = require('mongoose')

const AirplaneCompanySchema = new mongoose.Schema({
  airplaneName: {
    type: String,
    require: [true, 'Please provide airplane company name!']
  },
  flights: {
    type: [{
      type: mongoose.Schema.ObjectId,
      ref: 'flights',
    }],
    required: [true, 'Need som Flights !']
  }
},{
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

const airplaneCompany = mongoose.model('airplane_company', AirplaneCompanySchema);

module.exports = airplaneCompany