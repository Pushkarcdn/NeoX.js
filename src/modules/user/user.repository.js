import { models } from "../../../configs/server.js";
const { user } = models;

const createUser = async (userType) => {
  return await user.create({ userType });
};

const getByUserId = async (userId) => {
  return await user.findByPk(userId);
};

const deleteUser = async (userId) => {
  await user.destroy({ where: { userId: userId } });
};

const deleteUserByFieldName = async (where) => {
  await user.destroy({ where });
};

export default { createUser, getByUserId, deleteUser, deleteUserByFieldName };
