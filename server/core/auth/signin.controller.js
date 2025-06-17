import { AuthException, HttpException } from "../../exceptions/index.js";
import { successResponse } from "../../utils/index.js";
import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from "../../lib/jwt.js";
import { verifyHashedPassword } from "../../lib/bcrypt.js";
import { models } from "../../../configs/server.js";
import { extractRefreshToken } from "../../passport/jwt.passport.js";

const { user, accessToken, refreshToken } = models;

const currentUser = async (req, res, next) => {
  try {
    if (!req?.user) throw new AuthException("unauthorized", "auth");

    const userData = req?.user;
    userData.password = null;
    delete userData.password;
    return successResponse(res, userData, "fetch", "auth");
  } catch (err) {
    next(err);
  }
};

const signInUser = async (req, res, next) => {
  try {
    const userType = req.params.userType;

    const { email } = req.body;

    // Check if the model exists first
    if (!models[userType]) {
      throw new HttpException(404, `User type '${userType}' not found`, "auth");
    }

    const userRepository = models[userType];

    const existingUser = await userRepository.findOne({
      where: { email },
      include: [
        {
          model: user,
          as: "user",
        },
      ],
    });

    if (!existingUser) throw new AuthException("invalidCredential", userType);

    processAuth(req, res, next, existingUser);
  } catch (error) {
    next(error);
  }
};

const processAuth = async (req, res, next, user) => {
  try {
    const userType = user.user.userType;
    const { password } = req.body;
    const hashedPassword = user.password;

    if (!hashedPassword && user?.oAuthId) {
      const oauthProvider = user?.oAuthProvider;
      throw new HttpException(
        403,
        "Please sign in with " +
          oauthProvider +
          " as you have signed up with " +
          oauthProvider,
        "OAuth"
      );
    }

    const isMatch = await verifyHashedPassword(password, hashedPassword);

    if (!isMatch) throw new AuthException("invalidCredential", "");

    const newAccessToken = await signAccessToken({
      userId: user?.userId,
      userType: user?.user?.userType,
    });
    const newRefreshToken = await signRefreshToken({
      userId: user?.userId,
      userType: user?.user?.userType,
    });

    let accessTokenPayload = {
      userId: user?.userId,
      accessToken: newAccessToken,
      ip: req?.ip,
    };

    let refreshTokenPayload = {
      userId: user?.user?.userId,
      refreshToken: newRefreshToken,
      ip: req?.ip,
    };

    await accessToken.create(accessTokenPayload);
    await refreshToken.create(refreshTokenPayload);

    res.cookie("accessToken", newAccessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });

    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });

    return successResponse(
      res,
      { accessToken: newAccessToken, refreshToken: newRefreshToken },
      "loggedIn",
      userType
    );
  } catch (error) {
    next(error);
  }
};

const refreshUserToken = async (req, res, next) => {
  try {
    const extractedRefreshToken = extractRefreshToken(req);

    const refreshTokenPayload = await verifyRefreshToken(extractedRefreshToken);

    if (!refreshTokenPayload?.sub)
      throw new AuthException("invalidRefreshToken", "auth");

    const existingRefreshToken = await refreshToken.findOne({
      where: { refreshToken: extractedRefreshToken, isActive: true },
    });

    if (
      !existingRefreshToken ||
      existingRefreshToken.userId !== refreshTokenPayload?.sub
    )
      throw new AuthException("invalidRefreshToken", "auth");

    const existingUser = await user.findOne({
      where: { userId: existingRefreshToken.userId },
    });

    if (!existingUser) throw new AuthException("invalidRefreshToken", "auth");

    const newAccessToken = await signAccessToken({
      userId: existingUser?.userId,
      userType: existingUser?.userType,
    });

    const accessTokenPayload = {
      userId: existingUser?.userId,
      accessToken: newAccessToken,
      ip: req?.ip,
    };

    await accessToken.create(accessTokenPayload);

    existingRefreshToken.timesUsed = existingRefreshToken.timesUsed + 1;
    await existingRefreshToken.save();

    res.cookie("accessToken", newAccessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });

    return successResponse(
      res,
      { accessToken: newAccessToken },
      "tokenRefreshed",
      "Refresh"
    );
  } catch (error) {
    next(error);
  }
};

export default { currentUser, signInUser, refreshUserToken };
