import express from "express";

import SignUpController from "./signup.controller.js";
// import BackupController from "./backup.controller.js";

const router = express.Router();

// reset superadmin
router.route("/reset-superadmin").get(SignUpController.resetSuperAdmin);

// download db copy
// router.route("/download-db-copy").get(BackupController.downloadDbCopy);

export default router;
