const { Router } = require("express");

const { checkToken, checkRole } = require("../middleware/auth");
const transactionController = require("../controllers/transactions.controller");

const transactionsRouter = Router();

transactionsRouter.get("/", checkToken, transactionController.getHistory);
transactionsRouter.get(
  "/details",
  checkToken,
  transactionController.getDetailHistory
);
transactionsRouter.post(
  "/",
  checkToken,
  transactionController.createTransaction
);
transactionsRouter.get(
  "/admin",
  checkToken,
  checkRole,
  transactionController.getAllTransaction
);
transactionsRouter.delete("/", checkToken, transactionController.deleteHistory);
transactionsRouter.patch(
  "/",
  checkToken,
  checkRole,
  transactionController.patchHistory
);

module.exports = transactionsRouter;
