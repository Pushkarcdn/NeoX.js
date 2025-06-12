import express from "express";
import path from "path";
import { glob } from "glob";

const router = express.Router();

// Use process.cwd() as recommended by Vercel
const BASE_DIR = process.cwd();
const ROUTES_DIR = path.join(BASE_DIR, "server/core");

async function loadRoutes() {
  try {
    // Find all route files using glob (more reliable than fs.readdir)
    const routeFiles = await glob("**/*.route.js", {
      cwd: ROUTES_DIR,
      absolute: true,
    });

    console.info("Route Files: ", routeFiles);

    // Import and register routes
    await Promise.all(
      routeFiles.map(async (filePath) => {
        try {
          // Use dynamic import with file:// protocol for Vercel compatibility
          const module = await import(`file://${filePath}`);
          router.use(module.default);
          console.log(
            `✅ Successfully loaded route: ${path.relative(ROUTES_DIR, filePath)}`
          );
        } catch (err) {
          console.error(`❌ Failed to load route ${filePath}:`, err);
        }
      })
    );
  } catch (err) {
    console.error("Error discovering routes:", err);
  }

  return router;
}

// Initialize and export the router
const routes = await loadRoutes();

// export { routes as default };

export default router;
