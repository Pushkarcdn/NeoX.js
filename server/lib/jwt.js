// jwt.js

/**
 * JWT Utility Module
 * This module provides functions to generate and verify JSON Web Tokens (JWTs) for user authentication.
 * It includes functions to sign access and refresh tokens as well as to verify refresh tokens.
 *
 * Dependencies:
 * - jsonwebtoken: Library for signing and verifying JWT tokens.
 * - jwtConfig: Configuration settings for JWT, including secrets and expiration times.
 * - UserData: Data module to retrieve user information for verification purposes.
 */

import jwt from "jsonwebtoken";
import { jwtConfig } from "../../configs/env.js";

/**
 * Sign an access token for a user.
 *
 * @param {Object} user - The user object, containing at least the userId.
 * @returns {Promise<string>} - Resolves to a signed JWT token.
 */
const signAccessToken = (user) => {
  return new Promise((resolve, reject) => {
    const payload = {
      sub: user.user.userId,
      userType: user.user.userType,
      email: user.email,
      iat: Date.now(),
    };

    const expiresIn = jwtConfig.accessTokenExpiresIn;

    jwt.sign(
      payload,
      jwtConfig.accessTokenSecret,
      { expiresIn, algorithm: "HS256" },
      (err, token) => {
        if (err) {
          console.error("Error signing access token:", err.message);
          reject(new Error("Failed to sign access token"));
          return;
        }
        resolve(token);
      }
    );
  });
};

/**
 * Sign a refresh token for a user.
 *
 * @param {Object} user - The user object, containing at least the userId.
 * @returns {Promise<string>} - Resolves to a signed JWT refresh token.
 */
const signRefreshToken = (user) => {
  return new Promise((resolve, reject) => {
    const payload = {
      sub: user.userId,
      iat: Date.now(),
    };
    const expiresIn = jwtConfig.refreshTokenExpiresIn || "2h";

    jwt.sign(
      payload,
      jwtConfig.refreshTokenSecret,
      { expiresIn, algorithm: "HS256" },
      (err, token) => {
        if (err) {
          console.error("Error signing refresh token:", err.message);
          reject(new Error("Failed to sign refresh token"));
          return;
        }
        resolve(token);
      }
    );
  });
};

const signGeneralToken = (payload) => {
  return new Promise((resolve, reject) => {
    const expiresIn = jwtConfig.generalTokenExpiresIn;

    jwt.sign(
      payload,
      jwtConfig.generalTokenSecret,
      { expiresIn, algorithm: "HS256" },
      (err, token) => {
        if (err) {
          console.error("Error signing access token:", err.message);
          reject(new Error("Failed to sign access token"));
          return;
        }
        resolve(token);
      }
    );
  });
};

/**
 * Verify and decode a refresh token.
 * This function checks the validity of the provided refresh token, returning user data if successful.
 *
 * @param {string} refreshToken - The refresh token to verify.
 * @returns {Promise<Object|null>} - Resolves to the user info if valid, otherwise rejects with an error.
 */
const verifyRefreshToken = (refreshToken) => {
  return new Promise((resolve, reject) => {
    jwt.verify(refreshToken, jwtConfig.refreshTokenSecret, (err, payload) => {
      if (err) {
        reject(new Error("Invalid refresh token"));
        return;
      }
      const userId = payload.sub;
      /**
       * This part is subject to change as per the logic or structure of your user management module
       */
      // UserData.findOneByField({ userId })
      //   .then((userInfo) => {
      //     if (!userInfo) {
      //       reject(new Error("User not found"));
      //     } else {
      //       resolve(userInfo);
      //     }
      //   })
      //   .catch((error) => {
      //     console.error("Error fetching user data:", error.message);
      //     reject(new Error("Failed to retrieve user information"));
      //   });
    });
  });
};

const verifyGeneralToken = (token) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, jwtConfig.generalTokenSecret, (err, decoded) => {
      if (err) {
        console.error("Token validation failed:", err.message);
        reject(new Error("Invalid or expired token"));
        return;
      }
      resolve(decoded); // Returns decoded payload if valid
    });
  });
};

export {
  signAccessToken,
  signRefreshToken,
  signGeneralToken,
  verifyRefreshToken,
  verifyGeneralToken,
};
