const app = require("./app");
const env = require("./config/env");
const logger = require("./utils/logger");
const { closePool } = require("./config/db");

const server = app.listen(env.PORT, () => {
  logger.info(`Server running on port ${env.PORT}`);
});

const shutdown = async (signal) => {
  logger.info(`${signal} received. Closing server...`);
  server.close(async () => {
    await closePool();
    logger.info("Server closed gracefully.");
    process.exit(0);
  });
};

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));
