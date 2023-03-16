const LocalStrategy = require("passport-local").Strategy;

const ls = new LocalStrategy(
  {
    usernameField: "email",
    passwordField: "password",
  },
  async function (email, password, done) {
    try {
      const user = await User.findOne({ email });

      if (!user) {
        return done(null, false, { message: "Incorrect email or password" });
      }

      const passwordMatch = await user.checkPassword(password);

      if (!passwordMatch) {
        return done(null, false, { message: "Incorrect email or password" });
      }

      return done(null, user);
    } catch (error) {
      return done(error);
    }
  }
);

module.exports = ls;
