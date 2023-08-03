const multer = require("multer");
const path = require("path");
const storage = multer.memoryStorage();

const limits = {
  fileSize: 2 * 1024 * 1024, // 2 MB
};

const fileFilter = (req, file, cb) => {
  const pettern = /jpg|png|webp|jpeg/i;
  const ext = path.extname(file.originalname);
  if (!pettern.test(ext))
    return cb(
      new Error("Only Use Allowed Extension (JPG, PNG, JPEG, WEBP)"),
      false
    );
  cb(null, true);
};

const memoryUpload = multer({
  storage,
  limits,
  fileFilter,
});

const errorHandler = (err, res, next) => {
  if (err instanceof multer.MulterError) {
    return res.status(401).json({ status: "Upload Error", msg: err.message });
  }
  if (err) {
    if (err.code === "LIMIT_UNEXPECTED_FILE") {
      return res.status(400).json("Too many files to upload. 5pict only");
    }
    if (err.message === "Only Use Allowed Extension (JPG, PNG, JPEG, WEBP)") {
      return res.status(401).json({
        status: 401,
        msg: err.message,
      });
    }
    return res
      .status(500)
      .json({ status: "Internal Server Error", msg: err.message });
  }
  next();
};

module.exports = { memoryUpload, errorHandler };
