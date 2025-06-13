import SignUpController from "./signup.controller.js";

export default (router) => {
  // reset superadmin
  router.route("/reset-superadmin").get(SignUpController.resetSuperAdmin);
};
