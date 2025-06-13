import path from "path";
import fs from "fs";

export default (router) => {
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
  console.info("Routes detected: ", routes);

  // Import and attach routes
  (async () => {
    try {
      const modules = await Promise.all(
        routes.map((filePath) => import(filePath))
      );
      modules.forEach(async (module) => {
        router.use(await module.default(router));
      });
    } catch (err) {
      console.error("Error loading routes:", err);
    }
  })();

  return router;
};
