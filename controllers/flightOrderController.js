const Orders = require('./../models/orderHistory');
const factory = require('./../controllers/handlerFactory');

exports.getOrders = factory.getAll(Orders);