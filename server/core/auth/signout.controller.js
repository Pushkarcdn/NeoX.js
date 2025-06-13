import { AuthException } from "../../exceptions/index.js";
import { successResponse } from "../../utils/index.js";

import { models } from "../../../configs/server.js";

const { accessToken } = models;

const signOutUser = async (req, res, next) => {
  try {
    const accessTokenFromCookie = req.cookies.accessToken;

    if (!accessTokenFromCookie)
      throw new AuthException("Signed out already!", "signout");

    await accessToken.update(
      {
        isActive: false,
      },
      {
        where: {
          accessToken: accessTokenFromCookie,
        },
      }
    );

    res.clearCookie("accessToken", {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });

    return successResponse(
      res,
      "User signed out successfully!",
      "loggedOut",
      "auth.signout"
    );
  } catch (error) {
    next(error);
  }
};

export default { signOutUser };
