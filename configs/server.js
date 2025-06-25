import rateLimit from "express-rate-limit";
import db from "../server/lib/sequelize.js";
import { server } from "./env.js";
import sendEmail from "../server/utils/mail/node-mailer.js";

export const models = db;

export { sendEmail };

// Rate limiting
export const limiter = rateLimit({
  windowMs: server.rateLimit.windowMs * 60 * 1000, // converting minutes to milliseconds
  max: server.rateLimit.max,
  message: {
    status: 429,
    message: "Too many requests from this IP, Please try again later!",
  },
});
