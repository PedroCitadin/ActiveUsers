const oracledb = require("oracledb");
require("dotenv").config();

oracledb.initOracleClient({
  libDir: process.env.DB_LIB
});

async function getConnection() {
  return await oracledb.getConnection({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    connectString: process.env.DB_CONNECT_STRING
  });
}

module.exports = { getConnection };
