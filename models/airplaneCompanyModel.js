const mongoose = require('mongoose')

const AirplaneCompanySchema = new mongoose.Schema({
  airplaneName: {
    type: String,
    required: [true, 'Please provide airplane company name!']
  },
  description: {
    type: String,
    required: [true, 'Please provide airplane description'],
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