// Import the Express app instance from the app.js file
import app from "./server/server.js";

// Import the port configuration from the config file
import { server } from "./configs/env.js";

// Start the Express server on the specified port.
app.listen(server.port, "0.0.0.0", () => {
  console.info(`\n===========================================`);
  console.info(`======= Environment: ${process.env.NODE_ENV} ========`);
  console.info(`🚀 App listening on the port ${server.port}`);
  console.info(`===========================================\n\n`);
});
