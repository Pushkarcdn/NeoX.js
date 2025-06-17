import SigninController from "./signin.controller.js";
import SignupController from "./signup.controller.js";
import SignOutController from "./signout.controller.js";

export default (router) => {
  /**
   * @swagger
   * /me:
   *   get:
   *     tags:
   *       - Authentication
   *     summary: Get current user
   *     responses:
   *       200:
   *         description: Current user information
   *       401:
   *         description: Unauthorized
   */
  router.route("/me").get(SigninController.currentUser);

  /**
   * @swagger
   * /signup/{userType}:
   *   post:
   *     tags:
   *       - Authentication
   *     summary: Register new user
   *     parameters:
   *       - in: path
   *         name: userType
   *         required: true
   *         schema:
   *           type: string
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - firstName
   *               - lastName
   *               - email
   *               - password
   *             properties:
   *               firstName:
   *                 type: string
   *               lastName:
   *                 type: string
   *               email:
   *                 type: string
   *                 format: email
   *               password:
   *                 type: string
   *               phone:
   *                 type: string
   *               address:
   *                 type: string
   *               profileImage:
   *                 type: string
   *               profession:
   *                 type: string
   *               companyName:
   *                 type: string
   *               gender:
   *                 type: string
   *               isTermsAndConditionsAccepted:
   *                 type: boolean
   *     responses:
   *       200:
   *         description: User created successfully
   *       400:
   *         description: Validation error
   *       409:
   *         description: User already exists
   */
  router.route("/signup/:userType").post(SignupController.signupUser);

  /**
   * @swagger
   * /signin/{userType}:
   *   post:
   *     tags:
   *       - Authentication
   *     summary: Sign in user
   *     parameters:
   *       - in: path
   *         name: userType
   *         required: true
   *         schema:
   *           type: string
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - email
   *               - password
   *             properties:
   *               email:
   *                 type: string
   *                 format: email
   *               password:
   *                 type: string
   *     responses:
   *       200:
   *         description: Login successful
   *       401:
   *         description: Invalid credentials
   *       404:
   *         description: User not found
   */
  router.route("/signin/:userType").post(SigninController.signInUser);

  /**
   * @swagger
   * /refresh:
   *   post:
   *     tags:
   *       - Authentication
   *     summary: Refresh access token
   *     responses:
   *       200:
   *         description: Token refreshed successfully
   *       401:
   *         description: Invalid refresh token
   */
  router.route("/refresh").post(SigninController.refreshUserToken);

  /**
   * @swagger
   * /signout:
   *   get:
   *     tags:
   *       - Authentication
   *     summary: Sign out user
   *     responses:
   *       200:
   *         description: Signed out successfully
   *       401:
   *         description: Already signed out
   */
  router.route("/signout").get(SignOutController.signOutUser);
};
