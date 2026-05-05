const { Pool } = require("pg");
const env = require("./env");

let pool;

const getPool = () => {
  if (!env.DATABASE_URL) {
    throw new Error("DATABASE_URL is missing. Add it in backend/.env");
  }

  if (!pool) {
    pool = new Pool({
      connectionString: env.DATABASE_URL,
    });
  }

  return pool;
};

const query = async (text, params = []) => {
  const activePool = getPool();
  return activePool.query(text, params);
};

const closePool = async () => {
  if (pool) {
    await pool.end();
    pool = null;
  }
};

module.exports = {
  query,
  closePool,
};
