const { Pool } = require("pg");

const env = require("./environment");

const postgre = new Pool({
  host: env.host,
  database: env.db,
  port: env.dbPort,
  user: env.user,
  password: env.pwd,
});

module.exports = postgre;
