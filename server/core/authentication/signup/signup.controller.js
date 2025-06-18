import { hashPassword } from "../../../lib/bcrypt.js";
import { successResponse } from "../../../utils/index.js";
import { ConflictException, HttpException } from "../../../exceptions/index.js";

import { models } from "../../../../configs/server.js";

const { user } = models;

const signupUser = async (req, res, next) => {
  try {
    const userType = req.params.userType;

    const userRepository = models[userType];

    if (!userRepository) {
      throw new HttpException(404, "User type not found", "auth");
    }

    const email = req.body.email;

    const existingUser = await userRepository.findOne({
      where: { email },
      include: [
        {
          model: user,
          as: "user",
        },
      ],
    });

    if (existingUser) throw new ConflictException("duplicateData", "user");

    const newUserId = (await user.create({ userType })).userId;

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

export default {
  signupUser,
};
