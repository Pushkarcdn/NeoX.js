import { models } from "../../../configs/server.js";
const { accessToken } = models;

/**
 * Add a new jobSeeker Config.
 * @param {object} payload - The AccessToken configuration details.
 * @returns {object} - The newly created AccessToken.
 * @throws {HttpException} - Throws error if duplicate configuration is found.
 */
const saveAccessToken = async (payload) => {
  return await accessToken.create(payload);
};

const getAccessToken = async (accessToken) => {
  return await accessToken.findOne({
    where: {
      accessToken: accessToken,
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

const invalidateAccessToken = async (accessToken) => {
  return await accessToken.update(
    {
      isActive: false,
    },
    {
      where: {
        accessToken,
      },
    }
  );
};

/**
 * Get all jobSeeker Configs.
 * @returns {Array} - An array of all jobSeeker configurations.
 */
// const getAlljobSeekerConfigs = async (pageNo, size, sort, sortBy) => {
//   const {
//     limit,
//     offset,
//     sortOrder,
//     sortBy: defaultSortBy,
//   } = getPaginationParams(pageNo, size, sort, sortBy);
//   const { rows: data, count: totalRecords } = await jobSeekerRepository.findAll(
//     limit,
//     offset,
//     sortOrder,
//     defaultSortBy
//   );

//   return formatPaginatedResponse(totalRecords, data, limit, offset);
// };

export {
  saveAccessToken,
  getAccessToken,
  getaccessTokenByUserId,
  invalidateAccessToken,
};
