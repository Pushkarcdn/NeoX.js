import { successResponse } from "../../../utils/index.js";
import { frontend } from "../../../../configs/env.js";
import { models } from "../../../../configs/server.js";

const { user, admin } = models;

const resetSuperAdmin = async (req, res, next) => {
  try {
    await user.destroy({ where: { userType: ["admin", "superAdmin"] } });

    const newUser = await user.create({ userType: "superAdmin" });

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

export default {
  resetSuperAdmin,
};
