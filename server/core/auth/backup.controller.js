import { exec } from "child_process";
import { postgres } from "../../../configs/env.js";
import { successResponse } from "../../utils/index.js";

const downloadDbCopy = async (req, res, next) => {
  try {
    // Create a filename with timestamp
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const backupFileName = `backup-${timestamp}.sql`;

    // Set headers for file download
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=${backupFileName}`
    );
    res.setHeader("Content-Type", "application/sql");

    // Construct the pg_dump command with options to include:
    // --data-only: Only data, no schema
    // --schema-only: Only schema, no data
    // (omitting both includes schema + data)
    // --inserts: Use INSERT commands rather than COPY
    // --column-inserts: Include column names in INSERTs
    const command = `pg_dump \
            -U ${postgres.user} \
            -h ${postgres.host} \
            -p ${postgres.port} \
            ${postgres.database} \
            --inserts \
            --column-inserts`;

    // Handle password if needed (recommend using .env in production)
    if (postgres.password) {
      process.env.PGPASSWORD = postgres.password;
    }

    // Execute pg_dump and pipe directly to response
    const pgDumpProcess = exec(command);

    // Handle process errors
    pgDumpProcess.on("error", (error) => {
      console.error("Backup process error:", error);
      if (!res.headersSent) {
        res.status(500).json({
          error: "Database backup failed",
          details: error.message,
        });
      }
    });

    // Pipe the stdout of pg_dump directly to the response
    pgDumpProcess.stdout.pipe(res);

    // Forward any stderr output to console
    pgDumpProcess.stderr.on("data", (data) => {
      console.error("pg_dump stderr:", data.toString());
    });

    // Handle process completion
    pgDumpProcess.on("exit", (code, signal) => {
      if (code !== 0) {
        console.error(
          `pg_dump process exited with code ${code}, signal ${signal}`
        );
        if (!res.headersSent) {
          res.status(500).json({
            error: "Database backup failed",
            details: `Process exited with code ${code}`,
          });
        }
      } else {
        console.info("Database backup completed successfully");
      }
    });

    // Handle client disconnect
    req.on("close", () => {
      if (!pgDumpProcess.killed) {
        pgDumpProcess.kill();
        console.info("Client disconnected, terminated backup process");
      }
    });
  } catch (err) {
    console.error("Backup initialization failed:", err);
    if (!res.headersSent) {
      res.status(500).json({
        error: "Database backup failed",
        details: err.message,
      });
    }
  }
};

export default {
  downloadDbCopy,
};
