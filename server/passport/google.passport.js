import GoogleStrategy from "passport-google-oauth20";
import { oauth } from "../../configs/env.config.js";
import { signAccessToken } from "../lib/jwt.js";
import { models } from "../../configs/server.config.js";

const { accessToken: accessTokenModel } = models;

export default (passport) => {
  passport.serializeUser((user, done) => {
    done(null, {
      userId: user.userId,
      userType: user.userType,
    });
  });

  passport.deserializeUser(async (userObj, done) => {
    try {
      const { userId, userType } = userObj;
      let user = null;

      const userModel = models?.[userType];

      if (!userModel) return done(null, null);

      user = await userModel.findOne({ where: { userId } });

      done(null, user);
    } catch (err) {
      done(err, null);
    }
  });

  passport.use(
    new GoogleStrategy(
      {
        clientID: oauth.google.clientId,
        clientSecret: oauth.google.clientSecret,
        callbackURL: "/api/auth/google/callback",
        passReqToCallback: true,
        session: true,
      },
      async (req, accessToken, refreshToken, profile, done) => {
        try {
          const userType = req.query.state;
          const { id } = profile;
          let user = null;

          const userModel = models?.[userType];

          if (!userModel) return done(null, null);

          user = await userModel.findOne({ where: { oAuthId: id } });

          if (!user) {
            user = await userModel.findOne({
              where: { email: profile.emails[0].value },
            });
          }

          if (user?.id && !user.oAuthId) {
            await userModel.update(
              {
                oAuthId: id,
                oAuthProvider: "google",
                isEmailVerified: true,
              },
              { where: { id: user.id } },
            );
          }

          if (!user) {
            const newUser = await models.user.create({ userType });
            user = await userModel.create({
              oAuthId: id,
              oAuthProvider: "google",
              userId: newUser.userId,
              isEmailVerified: true,
              email: profile.emails[0].value,
              name: profile.displayName,
              profilePicture: profile.photos[0].value,
              firstName: profile.name.givenName,
              lastName: profile.name.familyName,
              ip: req.ip,
              profileImage: profile.photos[0].value,
              phone: profile.phoneNumber || null,
              gender: profile.gender || null,
            });
          }

          const jwtToken = await signAccessToken({
            userId: user.userId,
            userType,
          });

          let tokenPayload = {
            userId: user.userId,
            accessToken: jwtToken,
            ip: req.ip,
          };

          await accessTokenModel.create(tokenPayload);

          // Store the token on the request object for the callback route
          req.accessToken = jwtToken;

          // Return a plain object for the user to avoid serialization issues
          return done(null, {
            id: user.id,
            userId: user.userId,
            userType,
            email: user.email,
            name: user.name || `${user.firstName} ${user.lastName}`,
          });
        } catch (err) {
          console.error("Google OAuth Error:", err);
          return done(err, null);
        }
      },
    ),
  );
};
