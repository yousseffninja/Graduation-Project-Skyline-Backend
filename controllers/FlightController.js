const Flight = require('./../models/flghtModel');
const AirplaneCompany = require('./../models/airplaneCompanyModel');
const catchAsync = require('./../utils/catchAsync');
const factory = require('./handlerFactory');

const findConnectingFlights = async (from, to, currentLegs = []) => {
  let queue = [{ from, path: [] }];
  const visited = new Set();
  const results = [];

  while (queue.length > 0) {
    const { from, path } = queue.shift();

    if (visited.has(from)) continue;
    visited.add(from);

    const flightsFrom = await Flight.find({ from }).select('-Seats');

    for (const flight of flightsFrom) {
      if (flight.to === to) {
        results.push([...path, flight]);
      } else {
        queue.push({ from: flight.to, path: [...path, flight] });
      }
    }
  }

  return results;
};

exports.CreateFlight = catchAsync(async (req, res, next) => {
  const flight = await Flight.create(req.body);
  const airplane = await AirplaneCompany.findByIdAndUpdate(flight.airplaneCompany, {
    $push: { "flights": flight.id },
  });

  res.status(201).json({
    status: 'success',
    data: {
      flight,
      airplane
    }
  });
});

exports.getAllMultiLegFlight = catchAsync(async(req, res, next) => {
  const { from, to, fromDate, toDate , firstDate, lastDate} = req.query;

  let allFlights = await findConnectingFlights(from || "", to || "");

  if (fromDate && toDate){
    allFlights = allFlights.filter(flightGroup => {
      return flightGroup.some(flight => {
        return flight.fromDate >= fromDate && flight.toDate <= toDate;
      });
    });
  }

  let multiLegFlights = allFlights.map(flights => {
    const legs = Array.isArray(flights) ? flights : [flights];
    const price = legs.reduce((sum, leg) => sum + leg.price, 0);
    const rating = legs.reduce((sum, leg) => sum + leg.rating, 0) / legs.length;
    const ratingsQuantity = legs.reduce((sum, leg) => sum + leg.ratingsQuantity, 0);
    const ratingsAverage = legs.reduce((sum, leg) => sum + leg.ratingsAverage, 0) / legs.length;

    legs.sort((a, b) => new Date(a.date) - new Date(b.date));

    const firstDate = legs[0].date;
    const lastDate = legs[legs.length - 1].date;

    return {
      flightNo: legs.map(leg => leg.flightNo).join('-'),
      type: 'Multi Destination',
      classes: legs[0]?.classes,
      from: legs[0]?.from,
      to: legs[legs.length - 1]?.to,
      fromDate: legs[0]?.fromDate,
      toDate: legs[legs.length - 1]?.toDate,
      date: legs[0]?.date || legs[1]?.date,
      sala: legs[0]?.sala,
      gate: legs[0]?.gate,
      maxBagPerPerson: legs.reduce((min, leg) => Math.min(min, leg.maxBagPerPerson), Infinity),
      price,
      rating,
      ratingsQuantity,
      ratingsAverage,
      firstDate: firstDate || new Date(),
      lastDate: lastDate || new Date((new Date()).getTime() + 30*24*60*60*1000),
      airplaneCompany: legs[0].airplaneCompany,
      airplaneCompanyrecieve: legs[legs.length - 1].airplaneCompany,
    };
  });

  if (firstDate && lastDate) {
    multiLegFlights = multiLegFlights.filter(flight => {
      const flightFirstDate = new Date(flight.firstDate);
      const flightLastDate = new Date(flight.lastDate);
      const queryFirstDate = new Date(firstDate);
      const queryLastDate = new Date(lastDate);

      return flightFirstDate >= queryFirstDate && flightLastDate <= queryLastDate;
    });
  }

  res.status(200).json({
    status: 'success',
    length: multiLegFlights.length,
    multiLegFlights,
    allFlights
  });

});

exports.generateRoundTripFlights = catchAsync(async (req, res, next) => {
  const { from, to, flightNoSend, flightNoREceive, airplaneCompany, airplaneCompanyrecieve, price, maxBagPerPerson, gate } = req.body;

  const d = Date();

  const outboundFlight = await Flight.create({
    flightNo: flightNoSend,
    from,
    to,
    type: 'Round Trip',
    airplaneCompany: airplaneCompany,
    airplaneCompanyrecieve: airplaneCompanyrecieve,
    price: price,
    date: new Date(),
    maxBagPerPerson: maxBagPerPerson,
    gate: gate,
    classes: 'Economy',
  });
  const returnFlight = await Flight.create({
    flightNo: flightNoREceive,
    from: to,
    to: from,
    type: 'Round Trip',
    airplaneCompany: airplaneCompanyrecieve,
    airplaneCompanyrecieve: airplaneCompany,
    price: price,
    date: new Date((new Date()).getTime() + 30*24*60*60*1000),
    maxBagPerPerson: maxBagPerPerson,
    gate: gate,
    classes: 'Economy',
  });

  outboundFlight.roundTrip = returnFlight._id;
  returnFlight.roundTrip = outboundFlight._id;
  await outboundFlight.save();
  await returnFlight.save();

  res.status(201).json({
    status: 'success',
    data: {
      outboundFlight,
      returnFlight
    }
  });
});

exports.findRoundTripFlights = catchAsync(async (req, res, next) => {
  const { from, to, firstDate, lastDate } = req.query;

  let outboundFlights;

  if (from && to) {
    outboundFlights = await Flight.find({
      from,
      to,
      type: 'Round Trip'
    }).select('-Seats');
  } else {
    outboundFlights = await Flight.find({
      type: 'Round Trip'
    }).select('-Seats');
  }

  const roundTripFlights = [];
  const includedFlights = new Set();

  for (const outboundFlight of outboundFlights) {
    if (includedFlights.has(outboundFlight._id.toString())) {
      continue;
    }

    let returnFlight;

    if (from && to) {
      returnFlight = await Flight.findOne({
        from: to,
        to: from,
        roundTrip: outboundFlight._id
      }).select('-Seats');
    } else {
      returnFlight = await Flight.findOne({
        from: outboundFlight.to,
        to: outboundFlight.from,
        roundTrip: outboundFlight._id
      }).select('-Seats');
    }

    if (returnFlight) {

      const flights = [outboundFlight, returnFlight].sort((a, b) => new Date(a.date) - new Date(b.date));
      const firstFlightDate = flights[0].date;
      const lastFlightDate = flights[flights.length - 1].date;

      if ((!firstDate || new Date(firstFlightDate) >= new Date(firstDate)) && (!lastDate || new Date(lastFlightDate) <= new Date(lastDate))) {
        roundTripFlights.push({
          outboundFlight,
          returnFlight,
          firstDate: firstFlightDate,
          lastDate: lastFlightDate
        });
        includedFlights.add(returnFlight._id.toString());
      }
    }
  }

  res.status(200).json({
    status: 'success',
    length: roundTripFlights.length,
    data: roundTripFlights
  });
});

exports.getAllFlight = factory.getAll(Flight);
exports.getFlight = factory.getOne(Flight);
exports.updateFlight= factory.updateOne(Flight);
exports.deleteFlight= factory.deleteOne(Flight);