const { Router } = require("express");
const productsRouter = Router();
const productController = require("../controllers/products.controller");
const { checkToken, checkRole } = require("../middleware/auth");
const { memoryUpload, errorHandler } = require("../middleware/memoryUpload");

productsRouter.get("/", productController.getProducts);
productsRouter.get("/:productId", productController.getProductDetail);
productsRouter.post(
  "/add",
  checkToken,
  checkRole,
  (req, res, next) =>
    memoryUpload.single("image")(req, res, (err) => {
      errorHandler(err, res, next);
    }),
  productController.insertProduct
);
productsRouter.patch(
  "/:productId",
  checkToken,
  checkRole,
  (req, res, next) =>
    memoryUpload.single("image")(req, res, (err) => {
      errorHandler(err, res, next);
    }),
  productController.updateProduct
);
productsRouter.delete(
  "/:productId",
  checkToken,
  checkRole,
  productController.deleteProduct
);

module.exports = productsRouter;
