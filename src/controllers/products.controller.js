const productsModel = require("../models/products.model");
const { uploader } = require("../utils/cloudinary");

const getProducts = async (req, res) => {
  try {
    const { query } = req;
    const result = await productsModel.getProducts(query);
    if (result.rows.length === 0) {
      res.status(404).json({
        data: result.rows,
        msg: "Product Tidak Ditemukan",
      });
      return;
    }
    const meta = await productsModel.getMetaProducts(query, result.rows);
    res.status(200).json({
      data: result.rows,
      meta,
      msg: "Get Success",
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({
      msg: "Internal Server Error",
    });
  }
};

const getProductDetail = async (req, res) => {
  try {
    const { params } = req;
    const result = await productsModel.getProductDetail(params);
    if (result.rows.length === 0) {
      res.status(404).json({
        data: result.rows,
        msg: "Product Tidak Ditemukan",
      });
      return;
    }
    res.status(200).json({
      data: result.rows,
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({
      msg: "Internal Server Error",
    });
  }
};

const insertProduct = async (req, res) => {
  try {
    const { body } = req;
    const result = await productsModel.insertProduct(body);
    const id = result.rows[0].id;
    const { data, err, msg } = await uploader(req, "product", id);
    if (err) throw { msg, err };
    if (!data) return res.status(200).json({ msg: "No File Uploaded" });
    const urlImage = data.secure_url;
    const datas = await productsModel.updateProductImage(urlImage, id);
    res.status(201).json({
      data: datas.rows,
      msg: "Create Success",
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({
      msg: "Internal Server Error",
    });
  }
};

const updateProduct = async (req, res) => {
  try {
    const { body, params } = req;
    await productsModel.updateProduct(body, params);
    const { data, err, msg } = await uploader(req, "product", params.productId);
    if (err) throw { msg, err };
    if (!data) return res.status(200).json({ msg: "No File Uploaded" });
    const urlImage = data.secure_url;
    const datas = await productsModel.updateProductImage(
      urlImage,
      params.productId
    );
    res.status(200).json({
      data: datas.rows,
      msg: "Update Success",
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({
      msg: "Internal Server Error",
    });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const { params } = req;
    const result = await productsModel.deleteProduct(params);
    res.status(200).json({
      data: result.rows,
      msg: "Delete Success",
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({
      msg: "Internal Server Error",
    });
  }
};

module.exports = {
  getProducts,
  insertProduct,
  getProductDetail,
  updateProduct,
  deleteProduct,
};
