const mongoose = require('mongoose');

const AddressSchema = new mongoose.Schema({
  address: {
    type: String,
    required:[true, 'Please tell us your address']
  },
  country: {
    type: String,
    required:[true, 'Please tell us your country']
  },
  city: {
    type: String,
    required:[true, 'Please tell us your country']
  },
  state: {
    type: String,
    required:[true, 'Please tell us your state']
  },
});

const Address = mongoose.model('address', AddressSchema);

module.exports = Address;