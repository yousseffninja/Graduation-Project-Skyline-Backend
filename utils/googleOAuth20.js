const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('./../models/userModel');

module.exports = (passport) => {
  passport.use(new GoogleStrategy({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.CALLBACK_URL,
    },
    async function (accessToken, refreshToken, profile, cb)  {
        const user = await User.find({email: profile.emails[0].value});
        if (user.length !== 0) {
          return cb(null, user[0]);
        } else {
          const newUser = {
            googleId: profile.id,
            username: profile.id,
            firstName: profile.name.givenName,
            lastName: profile.name.familyName,
            email: profile.emails[0].value,
            password: profile.id,
            passwordConfirm: profile.id,
            userPhoto: profile.photos[0].value,
            emailActive: true,
          };
          const user = await User.create(newUser);
          console.log(user)
          return cb(null, user);
        }
    }
  ));

  passport.serializeUser((user, cb) => {
    cb(null, user);
  });

  passport.deserializeUser((id, cb) => {
    User.find({googleId: id}, (err, user) => {
      cb(err, user);
    })
  })
}