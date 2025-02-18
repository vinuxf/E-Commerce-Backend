const express = require("express");
const router = express.Router();
const {
  addFeaturedCategory,
  updateFeaturedCategory,
  getAllFeaturedCategories,
  getFeaturedCategoryByID,
} = require("../controllers/featuredCategoryController");

router.get("/", getAllFeaturedCategories);
router.get("/:idFeatured_Category", getFeaturedCategoryByID);
router.post("/", addFeaturedCategory);
router.put("/:idFeatured_Category", updateFeaturedCategory);
module.exports = router;
