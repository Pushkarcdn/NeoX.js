// utils/successResponse.js

import util from "util";
import { successMsg } from "../messages/message.js";
import { SuccessResponse } from "./response.js";

const successResponse = (res, result, message, source) => {
  if (!result)
    throw new Error("Result data is required to send response to client");
  if (!message) throw new Error("Message key is required");

  const success = new SuccessResponse();
  success.status = 200;
  success.message = util.format(successMsg[message] ?? message, source);
  success.source = source;

  // Check if result includes pagination details
  if (result.pagination) {
    const { data, pagination } = result;
    success.data = data;
    success.pagination = {
      currentPage: pagination.currentPage,
      totalPages: pagination.totalPages,
      totalRecords: pagination.totalRecords,
      hasNext: pagination.hasNext,
    };
  } else {
    success.data = result;
  }

  return res.status(200).send(success);
};

export default successResponse;
