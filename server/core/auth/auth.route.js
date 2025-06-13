import SigninController from "./signin.controller.js";
import SignupController from "./signup.controller.js";
import SignOutController from "./signout.controller.js";

export default (router) => {
  // test
  router.route("/test").get((req, res) => {
    res.send("Hello World");
  });

  // signup user
  router.route("/signup/:userType").post(SignupController.signupUser);

  // sign in user
  router.route("/signin/:userType").post(SigninController.signInUser);

  // current user
  router.route("/me").get(SigninController.currentUser);

  // sign out
  router.route("/signout").get(SignOutController.signOutUser);

  // send verification email to self
  router
    .route("/send-verification-email/:email")
    .get(SignupController.sendVerificationEmail);

  // email verification endpoint
  router.route("/verify-email/:token").get(SignupController.verifyEmail);

  return router;
};
