const Ticket = require('./../models/ticketModel');
const factory = require('./handlerFactory');

exports.getAllTickets = factory.getAll(Ticket);
exports.getTicket = factory.getOne(Ticket);
exports.deleteTicket = factory.deleteOne(Ticket);
exports.updateTicket = factory.updateOne(Ticket);