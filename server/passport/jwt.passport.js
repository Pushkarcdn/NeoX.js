import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import { jwtConfig } from "../../configs/env.js";
import { getAccessToken } from "../core/accessToken/accessToken.repository.js";
import { isUserAllowed } from "../../configs/permissions.js";

import { models } from "../../configs/server.js";

const { admin } = models;

let extractedToken = null;

const extractToken = (req) => {
  extractedToken = req?.cookies?.accessToken || null;
  return req?.cookies?.accessToken || null;
};

// Options for JWT strategy
const opts = {
  jwtFromRequest: ExtractJwt.fromExtractors([extractToken]),
  secretOrKey: jwtConfig.accessTokenSecret,
  algorithms: ["HS256"],
  passReqToCallback: true, // Enables req access in callback
};

const jwtPassportConfig = (passport) => {
  passport.use(
    new JwtStrategy(
      opts,
      /**
       * Passport callback function with req
       * @param {import('express').Request} req - Express request object
       * @param {Object} jwt_payload - Decoded JWT payload
       * @param {Function} done - Passport callback
       */
      async (req, jwt_payload, done) => {
        try {
          const { role, sub } = jwt_payload;

          extractedToken = req.cookies.accessToken;

          if (!extractedToken) return done(null, false);

          let user = null;

          // Fetch user based on role
          if (role === "buyer") {
            // user = await getBuyerByUserId(sub);
          } else if (role === "seller") {
            // user = await getSellerByUserId(sub);
          } else if (role === "admin" || role === "superAdmin") {
            user = await admin.findOne({
              where: { userId: sub },
            });
          }

          if (!user) return done(null, false);

          // Fetch the access token information
          const accessTokenRecord = await getAccessToken(extractedToken);

          if (!accessTokenRecord) return done(null, false);

          // Check if the access token is valid
          const { isActive } = accessTokenRecord.dataValues;
          if (!isActive) return done(null, false);

          // Check if the user is allowed to access the resource
          const route = req.originalUrl;
          const method = req.method;

          if (!isUserAllowed(route, method, role)) return done(null, false);

          // Remove sensitive information before returning
          delete user?.password;

          // Return authenticated user
          return done(null, user.dataValues);
        } catch (err) {
          // In case of error, pass it to done()
          console.error("errorrrrrr in jwt.passport.js");
          return done(err, false);
        }
      }
    )
  );
};

export default jwtPassportConfig;
