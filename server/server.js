import express from "express";
import hpp from "hpp";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import compression from "compression";
import cookieParser from "cookie-parser";
import passport from "passport";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import httpContext from "express-http-context";

import routes from "./core/index.js";
import db from "./lib/sequelize.js";
import upload from "./lib/multer.js";
import authMiddleware from "./middlewares/auth.middleware.js";
import passportJwtConfig from "./passport/jwt.passport.js";
import { errorResponse, formattedMsg } from "./utils/index.js";
import { errorMsg } from "./utils/messages/message.js";
import { setIp } from "./middlewares/ip.middleware.js";
import { setupSwagger } from "./lib/swagger.js";
import { frontend, database, server } from "../configs/env.js";
import { limiter } from "../configs/server.js";

const app = express();
const router = express.Router();

app.set("trust proxy", server.noOfProxies); // Trusting the Proxy (Cloudflare or Load Balancer)
app.set("view engine", "ejs"); // EJS as templating engine for rendering views
app.use(hpp()); // Against HTTP parameter pollution
app.use(helmet()); // Add security-related HTTP headers
app.use(express.json({ limit: server.bodySizeLimit })); // Parse incoming JSON requests
app.use(express.urlencoded({ extended: true, limit: server.bodySizeLimit })); // Parse URL-encoded data
app.use(compression()); // Enable response compression for faster API responses
app.use(cookieParser()); // Parse cookies from HTTP requests
app.use(httpContext.middleware); // Attach request-scoped data (context)
app.use(setIp); // Set the IP address of the request origin in the request

// Initialize Passport
passportJwtConfig(passport);

app.use(authMiddleware); // Global authentication middleware

app.use(upload);

if (
  process.env.NODE_ENV === "local" ||
  process.env.NODE_ENV === "development"
) {
  app.use(
    cors({
      origin: true,
      credentials: true,
      methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    })
  );
  app.use(morgan("dev", {})); // Dev logging format
} else {
  app.use(
    cors({
      origin: frontend.url,
      credentials: true,
      methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    })
  );
  app.use(morgan("combined", {})); // More detailed logging for production
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
app.use(express.static(join(__dirname, "../public"))); // Serve static frontend files

await db.sequelize
  .authenticate()
  .then(() => {
    let syncMode = database.syncMode;

    if (syncMode == "force" || syncMode == "alter" || syncMode == "sync") {
      db.sequelize.sync({ [syncMode]: true, logging: false });
    }

    console.info(`DB connected with sync mode: ${syncMode}`);
  })
  .catch((err) => console.error(err.stack));

// Home GET route
app.get("/", (req, res, next) => {
  try {
    res.send({
      status: 200,
      message: `Hello, NeoX Backend is up!`,
      source: "/ [GET]",
      ip: req.ip || "Not Found!",
      ips: req.ips || "Not Found!",
      clientIp: req.clientIp || "Not Found!",
    });
  } catch (error) {
    next(error);
  }
});

//Initialize Application Routes
app.use("/api", limiter, await routes(router));

setupSwagger(app);

/**
 * 404 Error Handler
 * If no route matches, respond with a 404 error.
 */
app.use((req, res, next) => {
  const err = new Error();
  err.status = 404;
  err.message = "Not Found";
  next(err);
});

/**
 * Global Error Handling Middleware
 * Handles all errors thrown in the app.
 */
app.use((err, req, res, next) => {
  try {
    let errorObj;

    const status = err?.status || 500;
    const path = req?.path || "-- Unknown Path --";
    const method = req?.method || "-- Unknown Method --";
    const message = err?.message || "Something went wrong!";
    const source = err?.source || `[${method}] ${path}`;
    const stack = err?.stack || "No stack trace available";

    const modifiedMessage = errorMsg[message]
      ? formattedMsg(err, errorMsg)
      : message;

    console.error(
      `\n[${method}] ${path} >> StatusCode: ${status}, Message: ${message}`
    );

    console.error(
      `${"-".repeat(100)} \nStack: ${stack} \n${"-".repeat(100)}\n`
    );

    errorObj = errorResponse(status, modifiedMessage, source);

    return res.status(status).send(errorObj); // Send the error response as JSON
  } catch (error) {
    next(error); // In case of error in the error handler itself, call next middleware
  }
});

export default app;
