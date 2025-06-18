import PasswordController from "./password.controller.js";

export default (router) => {
  router.route("/change-my-password").put(PasswordController.changeMyPassword);
};
