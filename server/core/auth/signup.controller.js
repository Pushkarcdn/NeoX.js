import { hashPassword } from "../../lib/bcrypt.js";
import { successResponse } from "../../utils/index.js";
import { AuthException } from "../../exceptions/index.js";
import { backend, frontend } from "../../../configs/env.js";
import { signGeneralToken, verifyGeneralToken } from "../../lib/jwt.js";
import sendEmailVerificationMail from "../../utils/mail/email-verification-mail.js";

import UserRepository from "../../../src/modules/user/user.repository.js";
import {
  saveToken,
  getToken,
  invalidateToken,
} from "../token/token.repository.js";

import { models } from "../../../configs/server.js";

const { user, admin } = models;

const signupUser = async (req, res, next) => {
  try {
    const userType = req.params.userType;

    const email = req.body.email;

    const userRepository = models[`${userType}s`];

    const existingUser = await userRepository.findOne({
      where: { email },
      include: [
        {
          model: user,
          as: "user",
        },
      ],
    });

    if (existingUser) throw new AuthException("duplicateData", "user");

    const newUserId = (await UserRepository.createUser(userType)).userId;

    const userPayload = {
      ...req.body,
      userId: newUserId,
      password: await hashPassword(req.body.password),
      ip: req.ip,
    };

    const createdUser = await userRepository.create(userPayload);

    return successResponse(res, createdUser, "create", userType);
  } catch (error) {
    next(error);
  }
};

const resetSuperAdmin = async (req, res, next) => {
  try {
    await UserRepository.deleteUserByFieldName({ userType: "admin" });

    await UserRepository.deleteUserByFieldName({ userType: "superAdmin" });

    const newUser = await UserRepository.createUser("superAdmin");

    const superAdminPayload = {
      userId: newUser.userId,
      firstName: "Super",
      lastName: "Admin",
      email: "superadmin@example.com",
      phone: "+919876543210",
      password: "$2a$15$uWvTy8eVz.gPFKC5T15dre263j1xN7Dvmvx8SdpsCOEubHmQuv0AC",
      profileImage: `${frontend.url}/favicon.ico`,
      address: "Rajasthan, India",
      ip: req.ip,
    };

    await admin.create(superAdminPayload);

    return successResponse(res, "Success!", "update", "settings");
  } catch (error) {
    console.error(error);
    next(error);
  }
};

// seperate api for re-sending verification email
const sendVerificationEmail = async (req, res, next) => {
  try {
    // const email = req.params.email;

    // const mentor = await getMentorByEmail(email);
    // if (!mentor) throw new AuthException("User not found", "mentor");

    // if (!mentor.isEmailVerified) {
    // await initiateEmailVerification(mentor, req.ip);
    // }

    return successResponse(
      res,
      "verification email sent",
      "send",
      "verification email"
    );
  } catch (error) {
    next(error);
  }
};

const initiateEmailVerification = async (user, ip) => {
  try {
    const verificationToken = await signGeneralToken({
      userId: user.userId,
      type: "emailVerification",
      ip: ip,
    });

    // save the token in the database
    const tokenPayload = {
      userId: user.userId,
      token: verificationToken,
      type: "emailVerification",
      ip: ip,
    };
    await saveToken(tokenPayload);

    // send mail
    const mailData = {
      email: user.email,
      name: user.firstName,
      link: `${backend.url}/api/verify-email/${verificationToken}`,
    };
    await sendEmailVerificationMail(mailData);
  } catch (error) {
    console.error(error);
  }
};

const verifyEmail = async (req, res) => {
  try {
    const token = req.params.token;

    const tokenData = await verifyGeneralToken(token);
    if (!tokenData)
      return res.redirect(`${frontend.url}/email-verification/failed`);

    const savedToken = await getToken(token);
    if (!savedToken || savedToken?.type !== "emailVerification")
      return res.redirect(`${frontend.url}/email-verification/failed`);

    // find user
    const user = await UserRepository.getByUserId(savedToken.userId);

    // pre set condition and update
    const condition = {
      userId: user.userId,
    };

    const update = {
      isEmailVerified: true,
    };

    let url;

    // update user based on user type
    switch (user?.userType) {
      case "mentor":
        // await updateMentorByFieldName(condition, update);
        url = `${frontend.url}/mentor/signin`;
        break;
      default:
        throw new AuthException("invalidToken", "email verification");
    }

    await invalidateToken(token);

    return res.redirect(url);
  } catch (error) {
    console.error(error);
    return res.redirect(`${frontend.url}/email-verification/failed`);
    // next(error);
  }
};

export default {
  signupUser,
  resetSuperAdmin,
  sendVerificationEmail,
  verifyEmail,
};
