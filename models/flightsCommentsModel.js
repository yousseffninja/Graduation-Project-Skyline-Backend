const mongoose = require('mongoose');
const airplaneCompany = require('./airplaneCompanyModel');

const flightCommentsSchema = new mongoose.Schema({
  comment: {
    type: String,
    required: [true, 'Comment cant be empty']
  },
  rate: {
    type: Number,
    min: 1,
    max: 5,
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  airplaneCompany: {
    type: mongoose.Schema.ObjectId,
    ref: 'airplane_company',
    required: [true, 'Comment must be assign by flight']
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Comment must belong to a user']
  }
},
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  });

flightCommentsSchema.index({ airplaneCompany: 1, user: 1 }, { unique: true });

flightCommentsSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'user',
    select: 'username userPhoto'
  });
  next();
});

flightCommentsSchema.statics.calcAverageRatings = async function(flightId) {
  const stats = await this.aggregate([
    {
      $match: { airplaneCompany: flightId }
    },
    {
      $group: {
        _id: '$flight',
        nRating: { $sum: 1 },
        avgRating: { $avg: '$rate' }
      }
    }
  ]);

  if (stats.length > 0) {
    await airplaneCompany.findByIdAndUpdate(flightId, {
      ratingsQuantity: stats[0].nRating,
      ratingsAverage: stats[0].avgRating
    });
  } else {
    await airplaneCompany.findByIdAndUpdate(flightId, {
      ratingsQuantity: 0,
      ratingsAverage: 1
    })
  }
};

flightCommentsSchema.post('save', function() {
  this.constructor.calcAverageRatings(this.airplaneCompany);
});

flightCommentsSchema.pre(/^findOneAnd/, async function(next) {
  this.r = await this.findOne();
  next();
});

flightCommentsSchema.post(/^findOneAnd/, async function() {
  await this.r.constructor.calcAverageRatings(this.r.flight);
});

const FlightComment = mongoose.model('flight_comment', flightCommentsSchema);

module.exports = FlightComment