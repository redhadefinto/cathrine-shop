const db = require("../configs/postgre");

const getEmail = (body) => {
  return new Promise((resolve, reject) => {
    const sqlQuery = "select email from users where email = $1";
    db.query(sqlQuery, [body.email], (err, result) => {
      if (err) reject(err);
      resolve(result);
    });
  });
};

const register = (data, hashedPassword, otp) => {
  return new Promise((resolve, reject) => {
    const sqlQuery = `insert into users (email, password, otp, status) values ($1, $2, $3, $4) RETURNING email`;
    // parameterized query
    const values = [data.email, hashedPassword, otp, "Not Active"];
    db.query(sqlQuery, values, (err, result) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(result);
    });
  });
};

const getOtp = (email) => {
  return new Promise((resolve, reject) => {
    const sqlQuery = "select otp from users where email = $1";
    db.query(sqlQuery, [email], (err, result) => {
      if (err) reject(err);
      resolve(result);
    });
  });
};

const verify = (email) => {
  return new Promise((resolve, reject) => {
    const sqlQuery =
      "update users SET status = $1 where email = $2 RETURNING email, status";
    db.query(sqlQuery, ["active", email], (err, result) => {
      if (err) reject(err);
      resolve(result);
    });
  });
};

module.exports = {
  getEmail,
  register,
  getOtp,
  verify,
};
