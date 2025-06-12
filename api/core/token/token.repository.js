import { models } from "../../../configs/server.js";
const { token } = models;

const saveToken = async (payload) => {
  return await token.create(payload);
};

const getToken = async (token) => {
  return await token.findOne({
    where: {
      token,
      isActive: true,
      isUsed: false,
    },
  });
};

const getTokenByUserId = async (userId) => {
  return await token.find({
    where: {
      userId,
    },
  });
};

const invalidateToken = async (token) => {
  return await token.update(
    {
      isUsed: true,
    },
    {
      where: {
        token,
      },
    }
  );
};

export { saveToken, getToken, getTokenByUserId, invalidateToken };
