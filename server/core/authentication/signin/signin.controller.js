import { AuthException, HttpException } from "../../../exceptions/index.js";
import { successResponse } from "../../../utils/index.js";
import { signAccessToken, signRefreshToken } from "../../../lib/jwt.js";
import { verifyHashedPassword } from "../../../lib/bcrypt.js";
import { models } from "../../../../configs/server.js";

const { user, accessToken, refreshToken } = models;

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
      "Logged in successfully!",
      "loggedIn",
      userType
    );
  } catch (error) {
    next(error);
  }
};

export default { signInUser };
