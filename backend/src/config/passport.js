const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const GitHubStrategy = require("passport-github2").Strategy;
const JwtStrategy = require("passport-jwt").Strategy;
const { ExtractJwt } = require("passport-jwt");
const User = require("../modules/users/models/userModel");

const cookieExtractor = (req) => {
  let token = null;
  if (req && req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }
  return token;
};

const setupPassport = () => {
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (error) {
      done(error, null);
    }
  });

  passport.use(
    "jwt",
    new JwtStrategy(
      {
        jwtFromRequest: ExtractJwt.fromExtractors([
          ExtractJwt.fromAuthHeaderAsBearerToken(),
          cookieExtractor,
          ExtractJwt.fromHeader("x-access-token"),
        ]),
        secretOrKey: process.env.ACCESS_TOKEN_SECRET,
      },
      async (jwtPayload, done) => {
        try {
          const user = await User.findById(jwtPayload.id);

          if (!user) {
            return done(null, false, { message: "User not found" });
          }

          if (
            user.passwordChangedAt &&
            user.passwordChangedAt.getTime() > jwtPayload.iat * 1000
          ) {
            return done(null, false, {
              message: "Password changed, please login again",
            });
          }

          return done(null, user);
        } catch (error) {
          return done(error, false);
        }
      }
    )
  );

  if (process.env.ENABLE_GOOGLE_LOGIN === "true") {
    passport.use(
      "google",
      new GoogleStrategy(
        {
          clientID: process.env.GOOGLE_CLIENT_ID,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          callbackURL: process.env.GOOGLE_CALLBACK_URL,
          scope: ["profile", "email"],
        },
        async (accessToken, refreshToken, profile, done) => {
          try {
            let user = await User.findOne({ "oauth.google.id": profile.id });

            if (user) {
              user.oauth.google.token = accessToken;
              if (profile.photos && profile.photos.length > 0) {
                user.oauth.google.picture = profile.photos[0].value;
                user.avatar = profile.photos[0].value;
              }
              await user.save();
              return done(null, user);
            }

            user = await User.findOne({ email: profile.emails[0].value });

            if (user) {
              user.oauth.google = {
                id: profile.id,
                email: profile.emails[0].value,
                name: profile.displayName,
                picture:
                  profile.photos && profile.photos.length > 0
                    ? profile.photos[0].value
                    : null,
                token: accessToken,
              };

              if (!user.isVerified) {
                user.isVerified = true;
              }

              await user.save();
              return done(null, user);
            }

            const newUser = await User.create({
              name: profile.displayName,
              email: profile.emails[0].value,
              isVerified: true,
              avatar:
                profile.photos && profile.photos.length > 0
                  ? profile.photos[0].value
                  : undefined,
              oauth: {
                google: {
                  id: profile.id,
                  email: profile.emails[0].value,
                  name: profile.displayName,
                  picture:
                    profile.photos && profile.photos.length > 0
                      ? profile.photos[0].value
                      : null,
                  token: accessToken,
                },
              },
            });

            return done(null, newUser);
          } catch (error) {
            return done(error, false);
          }
        }
      )
    );
  }

  if (process.env.ENABLE_GITHUB_LOGIN === "true") {
    passport.use(
      "github",
      new GitHubStrategy(
        {
          clientID: process.env.GITHUB_CLIENT_ID,
          clientSecret: process.env.GITHUB_CLIENT_SECRET,
          callbackURL: process.env.GITHUB_CALLBACK_URL,
          scope: ["user:email"],
        },
        async (accessToken, refreshToken, profile, done) => {
          try {
            const email =
              profile.emails && profile.emails.length > 0
                ? profile.emails[0].value
                : `${profile.username}@github.com`;

            let user = await User.findOne({ "oauth.github.id": profile.id });

            if (user) {
              user.oauth.github.token = accessToken;
              if (profile.photos && profile.photos.length > 0) {
                user.oauth.github.picture = profile.photos[0].value;
                user.avatar = profile.photos[0].value;
              }
              await user.save();
              return done(null, user);
            }

            user = await User.findOne({ email: email });

            if (user) {
              user.oauth.github = {
                id: profile.id,
                email: email,
                name: profile.displayName || profile.username,
                picture:
                  profile.photos && profile.photos.length > 0
                    ? profile.photos[0].value
                    : null,
                token: accessToken,
              };

              await user.save();
              return done(null, user);
            }

            const newUser = await User.create({
              name: profile.displayName || profile.username,
              email: email,
              isVerified: true,
              avatar:
                profile.photos && profile.photos.length > 0
                  ? profile.photos[0].value
                  : undefined,
              oauth: {
                github: {
                  id: profile.id,
                  email: email,
                  name: profile.displayName || profile.username,
                  picture:
                    profile.photos && profile.photos.length > 0
                      ? profile.photos[0].value
                      : null,
                  token: accessToken,
                },
              },
            });

            return done(null, newUser);
          } catch (error) {
            return done(error, false);
          }
        }
      )
    );
  }

  return passport;
};

module.exports = setupPassport;
