import { models } from "../../../configs/server.js";
const { accessToken } = models;

const saveAccessToken = async (payload) => {
  return await accessToken.create(payload);
};

const getAccessToken = async (token) => {
  return await accessToken.findOne({
    where: {
      accessToken: token,
    },
  });
};

const getaccessTokenByUserId = async (userId) => {
  return await accessToken.find({
    where: {
      userId,
    },
  });
};

const invalidateAccessToken = async (token) => {
  await accessToken.update(
    {
      isActive: false,
    },
    {
      where: {
        accessToken: token,
      },
    }
  );
};

export {
  saveAccessToken,
  getAccessToken,
  getaccessTokenByUserId,
  invalidateAccessToken,
};
