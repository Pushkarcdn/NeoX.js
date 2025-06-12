import passport from "passport";
import { match } from "node-match-path";
import { unprotectedRoutes } from "../../configs/permissions.js";

const authMiddleware = (req, res, next) => {
  try {
    let isPublicRoute = false;

    unprotectedRoutes.forEach((item) => {
      const { matches } = match(item.route, req.path);
      const isMethodMatch = item.methods.includes(req.method);
      if (matches && isMethodMatch) {
        isPublicRoute = true;
      }
    });

    if (isPublicRoute) {
      next();
    } else {
      passport.authenticate("jwt", { session: false })(req, res, async () => {
        next();
      });
    }
  } catch (err) {
    next(err);
  }
};

export default authMiddleware;
