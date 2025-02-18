const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "productCategoryImages/"); // Directory to save images
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Save image with unique name
  },
});

const uploadProductCategoryMiddleware = multer({ storage: storage });

module.exports = uploadProductCategoryMiddleware;
