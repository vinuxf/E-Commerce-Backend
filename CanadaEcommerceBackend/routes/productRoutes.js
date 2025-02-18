const express = require("express");
const router = express.Router();
const {
  addProduct,
  getAllProducts,
  getProductByID,
  updateProduct,
  changeProductStatus,
  GetAllProductsByPagination,
  searchProduct,
} = require("../controllers/productController");
router.post("/search-product", searchProduct);
const uploadProductMiddleware = require("../middleware/uploadProductMiddleware");
router.get("/get-all-products-paginated", GetAllProductsByPagination);
router.put("/change-status/:idProduct", changeProductStatus);
router.post("/", uploadProductMiddleware.single("Image"), addProduct);
router.get("/", getAllProducts);
router.get("/:idProduct", getProductByID);
router.put(
  "/:idProduct",
  uploadProductMiddleware.single("Image"),
  updateProduct
);


module.exports = router;
