const featuredCategoryDbService = require("../services/featuredCategoryDbService");

const addFeaturedCategory = async (req, res) => {
  try {
    const { Featured_Category_Name } = req.body;
    const add_result = await featuredCategoryDbService.addFeaturedCategory(
      Featured_Category_Name
    );
    res.status(201).json({ message: "Featured Category adding completed!" });
  } catch (err) {
    res.status(500).json({
      message: "Somthing went wrong when adding featured category!",
      error: err.message,
    });
  }
};

const updateFeaturedCategory = async (req, res) => {
  try {
    const { idFeatured_Category } = req.params;
    const { Name } = req.body;
    await featuredCategoryDbService.updateFeaturedCategory(
      idFeatured_Category,
      Name
    );
    res.status(201).json({ message: "Featured Category updation completed!" });
  } catch (err) {
    res.status(500).json({
      message: "Somthing went wrong when updating featured category!",
      error: err.message,
    });
  }
};

const getAllFeaturedCategories = async (req, res) => {
  try {
    const fetched_results =
      await featuredCategoryDbService.getAllFeaturedCategories();
    res.status(202).json(fetched_results);
  } catch (err) {
    res.status(500).json({
      message: "Somthing went wrong when fetching all featured categories!",
      error: err.message,
    });
  }
};

const getFeaturedCategoryByID = async (req, res) => {
  try {
    const { idFeatured_Category } = req.params;
    const fetched_results =
      await featuredCategoryDbService.getFeaturedCategoryByID(
        idFeatured_Category
      );
    res.status(202).json(fetched_results);
  } catch (err) {
    res.status(500).json({
      message: "Somthing went wrong when fetching  featured category by id!",
      error: err.message,
    });
  }
};

module.exports = {
  addFeaturedCategory,
  updateFeaturedCategory,
  getAllFeaturedCategories,
  getFeaturedCategoryByID,
};
