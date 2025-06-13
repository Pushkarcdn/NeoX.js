import { AuthException } from "../../exceptions/index.js";
import { successResponse } from "../../utils/index.js";
import { invalidateAccessToken } from "../accessToken/accessToken.repository.js";

const signOutUser = async (req, res, next) => {
  try {
    const accessToken = req.cookies.accessToken;

    if (!accessToken) throw new AuthException("Signed out already!", "signout");

    invalidateAccessToken(accessToken);

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
