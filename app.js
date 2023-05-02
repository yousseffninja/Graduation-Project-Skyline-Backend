const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const session = require('express-session');
const cors = require('cors');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const userRouter = require('./routes/userRoutes');
const tourRouter = require('./routes/tourRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const bookingRouter = require('./routes/bookingRoutes');
const airplaneCompanyRouter = require('./routes/airplaneCompanyRoutes');
const flightsRouter = require('./routes/FlightRoutes');
const HotelRouter= require('./routes/hotelRoutes');
const roomsRouter = require('./routes/roomRoutes');

const app = express();

app.enable('trust proxy');
app.use(cors({
  origin:['*','http://*','http://localhost:3000','http://localhost:5000','http://localhost:8000'],
  credentials:true,
  optionSuccessStatus:200
}));
app.use(helmet({
        crossOriginEmbedderPolicy: false,
        crossOriginResourcePolicy: {
            allowOrigins: ['*'],
        },
        contentSecurityPolicy: {
            directives: {
                defaultSrc: ['*'],
                scriptSrc: ["* data: 'unsafe-eval' 'unsafe-inline' blob:"],
            },
        },
    })
);

if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

require('./utils/googleOAuth20')(passport);
require('./utils/facebookAuth')(passport);

app.use(session({
  secret: 'keyboard car',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: true },
}));
app.use(passport.authenticate('session'));
app.use(passport.initialize(undefined));
app.use(passport.session(undefined));

const limiter = rateLimit({
    max: 10000,
    windowMs: 60 * 60 * 1000,
    message: 'Too many requests from this IP, please try again in an hour!'
});

app.use('/api', limiter);

app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());

app.use(mongoSanitize());

app.use(xss());

app.use((req, res, next) => {
    req.requestTime = new Date().toISOString();
    console.log(req.cookies);
    next();
});

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);
app.use('/api/v1/bookings', bookingRouter);
app.use('/api/v1/airplaneCompany', airplaneCompanyRouter);
app.use('/api/v1/flights', flightsRouter);
app.use('/api/v1/hotels', HotelRouter);
app.use('/api/v1/rooms', roomsRouter);

app.all('*', (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;