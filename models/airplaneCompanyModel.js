const mongoose = require('mongoose')

const AirplaneCompanySchema = new mongoose.Schema({
  airplaneName: {
    type: String,
    require: [true, 'Please provide airplane company name!']
  },
  flights: {
    type: Array,
    required: [true, 'Need som Flights !']
  }
});

const airplaneCompany = mongoose.model('airplane_company', AirplaneCompanySchema);

module.exports = airplaneCompany