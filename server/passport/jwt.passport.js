import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import { jwtConfig } from "../../configs/env.js";
import { isUserAllowed } from "../../configs/permission.js";

import { models } from "../../configs/server.js";

const { accessToken } = models;

let extractedToken = null;

export const extractToken = (req) => {
  const extractedToken =
    req?.cookies?.accessToken ||
    req?.headers?.authorization?.split(" ")[1] ||
    null;
  console.log("extractedToken: ", extractedToken);
  return extractedToken;
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
          const { userType, sub } = jwt_payload;

          extractedToken = extractToken(req);

          if (!extractedToken) return done(null, false);

          const user = await models[userType]?.findOne({
            where: { userId: sub },
          });

          if (!user) return done(null, false);

          // Fetch the access token information
          const accessTokenRecord = await accessToken.findOne({
            where: {
              accessToken: extractedToken,
              isActive: true,
            },
          });

          if (!accessTokenRecord) return done(null, false);

          // Check if the user is allowed to access the resource
          const route = req.originalUrl;
          const method = req.method;

          const isAllowed = await isUserAllowed(route, method, userType);

          if (!isAllowed) return done(null, false);

          // Remove sensitive information before returning
          delete user?.password;

          // Return authenticated user
          return done(null, user);
        } catch (err) {
          // In case of error, pass it to done()
          console.error("Error in jwt.passport.js: ", err);
          return done(err, false);
        }
      }
    )
  );
};

export default jwtPassportConfig;
