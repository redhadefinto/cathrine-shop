const db = require("../configs/postgre");

const transactionModel = require("../models/transactions.model");

const createTransaction = async (req, res) => {
  const { authInfo, body } = req;
  const client = await db.connect();
  try {
    await client.query("BEGIN");
    function generateRandomNumber(length) {
      const minNumber = Math.pow(10, length - 1);
      const maxNumber = Math.pow(10, length) - 1;

      return Math.floor(
        Math.random() * (maxNumber - minNumber + 1) + minNumber
      );
    }
    const productIds = generateRandomNumber(10);

    const result = await transactionModel.createTransaction(
      client,
      body,
      authInfo.id,
      productIds
    );
    const transactionId = result.rows[0].id;
    await transactionModel.createDetailTransaction(client, body, transactionId);
    await client.query("COMMIT");
    const transactionWithDetail = await transactionModel.getTransaction(
      client,
      transactionId
    );
    client.release();
    res.status(200).json({
      data: transactionWithDetail.rows,
      msg: "OK",
    });
  } catch (error) {
    console.log(error);
    await client.query("ROLLBACK");
    client.release();
    res.status(500).json({
      msg: "Internal Server Error",
    });
  }
};

const getHistory = async (req, res) => {
  try {
    const { id } = req.authInfo;
    const { transaction_code } = req.body;
    const result = await transactionModel.getHistory(id, transaction_code);
    if (result.rows.length === 0) {
      res.status(404).json({
        msg: "Transactions Not Found",
      });
      return;
    }
    res.status(200).json({
      data: result.rows[0],
      msg: "ok",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "Internal Server Error",
    });
  }
};

const getAllTransaction = async (req, res) => {
  try {
    const result = await transactionModel.getAllTransaction();
    res.status(200).json({
      data: result.rows,
      msg: "ok",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "Internal Server Error",
    });
  }
};

const getDetailHistory = async (req, res) => {
  try {
    const { id } = req.authInfo;
    const { body } = req;
    const result = await transactionModel.getDetailHistory(
      id,
      body.transaction_code
    );
    if (result.rows.length === 0) {
      res.status(404).json({
        msg: "Transactions Not Found",
      });
      return;
    }
    res.status(200).json({
      data: result.rows,
      msg: "ok",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "Internal Server Error",
    });
  }
};
const deleteHistory = async (req, res) => {
  try {
    const { id } = req.authInfo;
    const { body } = req;
    await transactionModel.deleteHistory(id, body.tpsId);
    res.status(201).json({
      msg: "delete Success",
    });
  } catch (error) {
    res.status(500).json({
      msg: "Internal Server Error",
    });
  }
};

const patchHistory = async (req, res) => {
  try {
    const { body } = req;
    const result = await transactionModel.patchHistory(body);
    console.log(result);
    if (result.rows.length === 0) {
      return res.status(404).json({
        msg: "No updated history",
      });
    }
    res.status(201).json({
      msg: "Product Finished",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "Internal Server Error",
    });
  }
};

module.exports = {
  createTransaction,
  getHistory,
  deleteHistory,
  getDetailHistory,
  getAllTransaction,
  patchHistory,
};
