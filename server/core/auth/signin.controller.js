import { AuthException, HttpException } from "../../exceptions/index.js";
import { successResponse } from "../../utils/index.js";
import { signAccessToken } from "../../lib/jwt.js";
import { saveAccessToken } from "../accessToken/accessToken.repository.js";
import { verifyHashedPassword } from "../../lib/bcrypt.js";
import { models } from "../../../configs/server.js";

const { user } = models;

const currentUser = async (req, res, next) => {
  try {
    if (req?.user) {
      delete req?.user?.password;
      return successResponse(res, req?.user, "fetch", "auth");
    } else {
      throw new AuthException("unauthorized", "auth");
    }
  } catch (err) {
    next(err);
  }
};

// signin user
const signInUser = async (req, res, next) => {
  try {
    const userType = req.params.userType;

    const { email } = req.body;

    const userRepository = models[userType];

    if (!userRepository) {
      throw new HttpException(404, "User type not found", "auth");
    }

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

    processLogin(req, res, next, existingUser);
  } catch (error) {
    next(error);
  }
};

const processLogin = async (req, res, next, user) => {
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

    const accessToken = await signAccessToken(user);

    let tokenPayload = {
      accessToken,
      email: user?.email,
      ip: req?.ip,
      userId: user?.user?.userId,
    };

    await saveAccessToken(tokenPayload);

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });

    return successResponse(res, "Successfully Logged in", "loggedIn", userType);
  } catch (error) {
    next(error);
  }
};

export default { currentUser, signInUser };
