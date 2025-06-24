import {
  resendVerificationEmail,
  verifyEmail,
} from "./emailVerification.controller.js";

export default (router) => {
  router
    .route("/resend-verification-email/:userType/:email")
    .get(resendVerificationEmail);

  router.route("/verify-email/:token").get(verifyEmail);
};
