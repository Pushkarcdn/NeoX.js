import jwt from "jsonwebtoken";
import { jwtConfig } from "../../configs/env.js";

const signAccessToken = (user) => {
  return new Promise((resolve, reject) => {
    const payload = {
      sub: user.user.userId,
      userType: user.user.userType,
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

const verifyRefreshToken = (refreshToken) => {
  return new Promise((resolve, reject) => {
    jwt.verify(refreshToken, jwtConfig.refreshTokenSecret, (err, payload) => {
      if (err) {
        reject(new Error("Invalid refresh token"));
        return;
      }
      const userId = payload.sub;
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
