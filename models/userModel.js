const crypto = require('crypto');
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'Please tell us first name!']
  },
  lastName: {
    type: String,
    required: [true, 'Please tell us last name!']
  },
  username: {
    type: String,
    required: [true, 'Please provide your email !'],
    unique: [true, 'This username is used, Please try another one!'],
    minLength: [3, 'Please provide username with 3 letter or more and 35 letter or less'],
    maxLength: [35, 'Please provide username with 3 letter or more and 35 letter or less'],
  },
  email: {
    type: String,
    required: [true, 'Please provide your email'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email']
  },
  phone: {
    type: String,
    validate: {
      validator: function(v) {
        const re = /^\d{10}$/;
        return (!v || !v.trim().length) || re.test(v)
      },
      message: 'Provided phone number is invalid.'
    }
  },
  birthDate: {
    type: Date,
    // required: [true, 'Please provide your birthdate']
  },
  userPhoto: {
    type: String,
  },
  cloudinaryId: {
    type: String,
  },
  frontIDPhoto: {
    type: String,
  },
  cloudinaryIdIDFront: {
    type: String,
  },
  frontBackPhoto: {
    type: String,
  },
  cloudinaryIdIDBack: {
    type: String,
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minLength: [8, 'Password should contain 8 letter or more and 32 letter or less'],
    maxLength: [32, 'Password should contain 8 letter or more and 32 letter or less'],
    select: false
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm your password'],
    validate: {
      validator: function(el) {
        return el === this.password;
      },
      message: 'Passwords are not the same!'
    }
  },
  address: {
    type: String,
  },
  emailActive: {
    type: Boolean,
    default: false,
  },
  IDActive: {
    type: Boolean,
    default: false,
  },
  phoneActive: {
    type: Boolean,
    default: false,
  },
  googleId: {
    type: String,
  },
  facebookId: {
    type: String,
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetTokenOTP: String,
  passwordResetExpires: Date,
  emailVerificationToken: String,
  emailVerificationTokenExpired: Date,
  active: {
    type: Boolean,
    default: true,
    select: false
  }
});

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
  next();
});

userSchema.pre('save', function(next) {
  if (!this.isModified('password') || this.isNew) return next();
  this.passwordChangedAt = Date.now() - 1000;
  next();
});

userSchema.pre(/^find/, function(next) {
  this.find({ active: { $ne: false } });

  next();
});

userSchema.methods.correctPassword = async function(
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function(JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    return JWTTimestamp < changedTimestamp;
  }
  return false;
};

userSchema.methods.createPasswordResetToken = function() {
  const resetToken = crypto.randomBytes(32).toString('hex');

  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  console.log({ resetToken }, this.passwordResetToken);

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

userSchema.methods.createPasswordResetTokenOTP = function() {
  const resetToken = Math.floor(100000 + Math.random() * 900000).toString()

  this.passwordResetTokenOTP = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  console.log({ resetToken }, this.passwordResetToken);

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

userSchema.methods.createEmailVerificationToken = function() {
  const verificationToken = crypto.randomBytes(32).toString('hex');

  this.emailVerificationToken = crypto
    .createHash('sha256')
    .update(verificationToken)
    .digest('hex');

  console.log({ verificationToken }, this.emailVerificationToken);

  this.emailVerificationTokenExpired = Date.now() + 10 * 60 * 1000;

  return verificationToken;
};

const User = mongoose.model('User', userSchema);

module.exports = User;