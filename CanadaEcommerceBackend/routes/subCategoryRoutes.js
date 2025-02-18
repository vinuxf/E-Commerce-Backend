const express = require("express");
const router = express.Router();
const {
  addSubCategory,
  updateSubCategory,
  getAllSubCategories,
  getSubCategoryByID,
} = require("../controllers/subCategoryController");

router.get("/", getAllSubCategories);
router.get("/:Id", getSubCategoryByID);
router.post("/", addSubCategory);
router.put("/:Id", updateSubCategory);

module.exports = router;
