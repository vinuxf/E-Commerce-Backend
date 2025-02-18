const express = require("express");
const router = express.Router();
const {
  addProductCategory,
  updateProductCategory,
  getAllProductCategories,
  getProductCategoryByID,
  changeProductCategoryStatus,
  getActiveStatusProductCategories,
} = require("../controllers/productCategoryController");
const uploadProductCategoryMiddleware = require("../middleware/uploadProductCategoryMiddleware");

router.get("/active-status", getActiveStatusProductCategories);
router.put("/change-status/:idProduct_Category", changeProductCategoryStatus);
router.get("/", getAllProductCategories);
router.get("/:idProduct_Category", getProductCategoryByID);
// router.post("/", addProductCategory);
// router.put("/:idProduct_Category", updateProductCategory);
router.post(
  "/",
  uploadProductCategoryMiddleware.single("Image"),
  addProductCategory
);
router.put(
  "/:idProduct_Category",
  uploadProductCategoryMiddleware.single("Image"),
  updateProductCategory
); // Update to handle image



module.exports = router;
