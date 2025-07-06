import passport from "passport";
import { frontend } from "../../../../configs/env.config.js";
import { models } from "../../../../configs/server.config.js";

export default (router) => {
  router.route("/auth/google/callback").get((req, res, next) => {
    passport.authenticate("google", { session: true }, (err, user, info) => {
      if (err) {
        console.error("Google auth error:", err);
        return res.redirect("/");
      }

      if (!user) {
        console.error("No user found");
        return res.redirect("/");
      }

      try {
        // Login the user to establish the session
        req.login(user, (loginErr) => {
          if (loginErr) {
            console.error("Login error:", loginErr);
            return res.redirect("/");
          }

          // Set the access token in a cookie
          res.cookie("accessToken", req.accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV !== "local",
            sameSite: "lax",
          });

          // Redirect based on the user's role
          const userType = user.userType;

          if (!userType) {
            console.error("No user type found");
            return res.redirect("/");
          }

          const userModel = models?.[userType];

          if (!userModel) {
            console.error("No user model found for type:", userType);
            return res.redirect("/");
          }

          // Update last login time
          userModel
            .update({ lastLogin: new Date() }, { where: { id: user.id } })
            .catch((err) => console.error("Error updating last login:", err));

          // Redirect to frontend
          const redirectUrl = `${frontend.url}/dashboard`;
          return res.redirect(redirectUrl);
        });
      } catch (error) {
        console.error("Error in Google callback:", error);
        return res.redirect("/");
      }
    })(req, res, next);
  });

  router.route("/auth/google/:userType").get((req, res, next) => {
    const { userType } = req.params;

    passport.authenticate("google", {
      scope: ["profile", "email"],
      state: userType,
    })(req, res, next);
  });
};
