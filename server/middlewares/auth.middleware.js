import passport from "passport";
import { match } from "node-match-path";
import publicPermission from "../../src/modules/user/public/public.permissions.js";

const authMiddleware = (req, res, next) => {
  try {
    const isPublicRoute = publicPermission.some((item) => {
      const { matches } = match(item.route, req.path);
      const isMethodMatch = item.methods.includes(req.method);
      return matches && isMethodMatch;
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
