// const { db } = require("../configs/environment");
const db = require("../configs/postgre");

const createTransaction = (client, body, userId, productIds) => {
  return new Promise((resolve, reject) => {
    const { payment_id, notes, status_id } = body;
    const sql =
      "INSERT INTO transactions (transactions_code, user_id, payment_id, notes, status_id) values ($1, $2, $3, $4, $5) RETURNING id";
    const values = [productIds, userId, payment_id, notes, status_id];
    client.query(sql, values, (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
};

const createDetailTransaction = (client, body, transactionId) => {
  return new Promise((resolve, reject) => {
    const { products } = body;
    let sql = `INSERT INTO transactions_products (transactions_id, product_id, quantity, subtotal) values`;
    let values = [];
    products.forEach((product, idx) => {
      const { product_id, size_id, quantity, subtotal } = product;
      if (values.length) sql += ", ";
      sql += `($${1 + 4 * idx}, $${2 + 4 * idx}, $${3 + 4 * idx}, $${
        4 + 4 * idx
      })`;
      values.push(transactionId, product_id, quantity, subtotal);
    });
    client.query(sql, values, (err) => {
      if (err) return reject(err);
      resolve();
    });
  });
};

const getTransaction = (client, transactionId) => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT t.transactions_code, u.email, p.name, p.image, py."method" AS "payment_method", st."name" AS "status", tps.quantity, tps.subtotal 
    FROM transactions_products tps
    JOIN transactions t ON t.id = tps.transactions_id 
    JOIN products p ON p.id = tps.product_id
    JOIN users u ON u.id = t.user_id
    JOIN payments py ON py.id = t.payment_id 
    JOIN status st ON st.id = t.status_id 
    WHERE t.id = $1 
    ORDER BY tps.transactions_id DESC;
    ;`;
    client.query(sql, [transactionId], (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
};

const getHistory = (id, transaction_code) => {
  return new Promise((resolve, reject) => {
    let sql = `select t.transactions_code, u.email, p.name, p.image, py."method" as "payment_method", st."name" as "status", tps.quantity, tps.subtotal, TO_CHAR(t.created_at, 'YYYY-MM-DD') AS created_at  from transactions_products tps
    join transactions t on t.id = tps.transactions_id 
    join products p on p.id = tps.product_id
    join users u on u.id = t.user_id
    join payments py on py.id = t.payment_id 
    join status st on st.id = t.status_id`;

    if (transaction_code) {
      sql += ` WHERE lower(t.transactions_code) LIKE lower('%${transaction_code}%')`;
    }

    sql += ` AND u.id = $1 ORDER BY t.id DESC`;
    db.query(sql, [id], (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
};

const getDetailHistory = (id, transaction_code) => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT t.transactions_code, u.email, p.name, p.image, p.price, c.category, py."method" AS "payment_method", st."name" AS "status", tps.quantity, tps.subtotal, TO_CHAR(t.created_at, 'YYYY-MM-DD') AS created_at 
      FROM transactions_products tps
      JOIN transactions t ON t.id = tps.transactions_id 
      JOIN products p ON p.id = tps.product_id
      JOIN categories c ON c.id = p.id
      JOIN users u ON u.id = t.user_id
      JOIN payments py ON py.id = t.payment_id 
      JOIN status st ON st.id = t.status_id 
      WHERE u.id = $1 AND t.transactions_code = $2;`;
    db.query(sql, [id, transaction_code], (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
};

const deleteHistory = (id, tpsId) => {
  return new Promise((resolve, reject) => {
    const sql = `DELETE FROM transactions WHERE user_id = $1 AND id = $2;`;
    db.query(sql, [id, tpsId], (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
};

const getAllTransaction = () => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT t.transactions_code, u.email, p.id as product_id, p.name, p.image, p.price, py."method" AS "payment_method", st."name" AS "status", tps.quantity, tps.subtotal, TO_CHAR(t.created_at, 'YYYY-MM-DD') AS created_at
      FROM transactions_products tps
      JOIN transactions t ON t.id = tps.transactions_id 
      JOIN products p ON p.id = tps.product_id
      JOIN users u ON u.id = t.user_id
      JOIN payments py ON py.id = t.payment_id  
      JOIN status st ON st.id = t.status_id`;
    db.query(sql, (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
};

const patchHistory = (body) => {
  return new Promise((resolve, reject) => {
    const sql = `UPDATE transactions AS t
        SET status_id = 3
        FROM transactions_products AS tps
        WHERE tps.transaction_code = $1
          AND tps.product_id = $2
          AND t.user_id = $3
        RETURNING t.status_id, tps.transactions_code;
          `;
    db.query(
      sql,
      [body.transaction_code, body.product_id, body.user_id],
      (err, result) => {
        if (err) return reject(err);
        resolve(result);
      }
    );
  });
};

module.exports = {
  createTransaction,
  createDetailTransaction,
  getTransaction,
  getHistory,
  getDetailHistory,
  deleteHistory,
  getAllTransaction,
  patchHistory,
};
