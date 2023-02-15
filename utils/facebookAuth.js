const FacebookStrategy = require('passport-facebook').Strategy
const User = require('./../models/userModel');

module.exports = (passport) => {
  passport.use(new FacebookStrategy({
      clientID: process.env.FACEBOOK_APP_ID,
      clientSecret: process.env.FACEBOOK_APP_SECRET,
      callbackURL: process.env.CALLBACK_URL_FACEBOOK,
    },
    async function(accessToken, refreshToken, profile, cb) {
    console.log(profile);
      const user = await User.find({ email: profile.emails[0].value });
      if (user.length !== 0) {
        return cb(null, user[0]);
      } else {
        const newUser = {
          facebookId: profile.id,
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
    User.find({ facebookId: id }, (err, user) => {
      cb(err, user);
    })
  })
}
