const db = require("../configs/postgre");

const getProfile = (id) => {
  return new Promise((resolve, reject) => {
    let sqlQuery = `select email, phone, image from users where id = $1`;
    db.query(sqlQuery, [id], (err, result) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(result);
    });
  });
};

module.exports = {
  getProfile,
};
