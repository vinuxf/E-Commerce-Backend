const multer = require("multer");
const path = require("path");

// Set up storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "productImagesInternational/"); // Set the upload folder
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Use timestamp and original file extension
  },
});

// Set up the multer upload middleware
const uploadInternationalProduct = multer({
  storage: storage,
});

module.exports = uploadInternationalProduct;
