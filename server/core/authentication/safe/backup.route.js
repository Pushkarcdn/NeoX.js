import BackupController from "./backup.controller.js";

export default (router) => {
  // reset superadmin
  router.route("/reset-superadmin").get(BackupController.resetSuperAdmin);
};
