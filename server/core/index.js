import express from "express";
import path from "path";
import fs from "fs";

const router = express.Router();

const routeDirectories = ["server/core", "src/modules"];

let routes = [];

/**
 * Recursively get all .route.js files from the given directory.
 */
const getRouteFiles = (dir) => {
  const filesAndFolders = fs.readdirSync(dir);

  filesAndFolders.forEach((entry) => {
    const fullPath = path.join(dir, entry);
    if (fs.statSync(fullPath).isDirectory()) {
      getRouteFiles(fullPath); // Recursive call for nested folders
    } else if (entry.endsWith(".route.js")) {
      routes.push(fullPath);
    }
  });
};

// Start collecting routes
routeDirectories.forEach((dir) => {
  const fullPath = path.resolve(dir);
  getRouteFiles(fullPath);
});

// Log all routes
console.info("Routes Loaded: ", routes);

// Import and attach routes
(async () => {
  try {
    const modules = await Promise.all(
      routes.map((filePath) => import(filePath))
    );
    modules.forEach((module) => {
      router.use(module.default);
    });
  } catch (err) {
    console.error("Error loading routes:", err);
  }
})();

export default router;
