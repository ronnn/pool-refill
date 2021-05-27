require("dotenv").config();

const oracledb = require("oracledb");
let pool;

const dbConfig = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  connectString: `${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_INSTANCE}?expire_time=${process.env.DB_EXPIRE_TIME}`,
  poolMin: Number(process.env.DB_POOL_MIN),
  poolMax: Number(process.env.DB_POOL_MAX),
  poolIncrement: Number(process.env.DB_POOL_INC),
  _enableStats: true,
};

async function useAndDrop() {
  try {
    const connection = await pool.getConnection();
    await connection.execute('SELECT * from dual');
    await connection.close({ drop: true });
  } catch (e) {
    console.error("Error in useAndDrop");
    console.error(e);
  }
}

async function main() {
  pool = await oracledb.createPool(dbConfig);
  console.log('Pool created');

  setInterval(async () => {
    await useAndDrop();
  }, 1000);

  setInterval(() => {
    pool._logStats();
  }, 5000);
}

main();
