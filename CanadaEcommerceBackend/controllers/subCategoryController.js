const subCategoryDbService = require("../services/subCategoryDbService");

const addSubCategory = async (req, res) => {
  try {
    const { Name } = req.body;
    const add_result = await subCategoryDbService.addSubCategory(Name);
    res.status(201).json({ message: "Sub Category adding completed!" });
  } catch (err) {
    res.status(500).json({
      message: "Somthing went wrong when adding sub category!",
      error: err.message,
    });
  }
};

const updateSubCategory = async (req, res) => {
  try {
    const { Id } = req.params;
    const { Name } = req.body;
    await subCategoryDbService.updateSubCategory(Id, Name);
    res.status(201).json({ message: "Sub Category updation completed!" });
  } catch (err) {
    res.status(500).json({
      message: "Somthing went wrong when updating featursub category!",
      error: err.message,
    });
  }
};

const getAllSubCategories = async (req, res) => {
  try {
    const fetched_results = await subCategoryDbService.getAllSubCategories();
    res.status(202).json(fetched_results);
  } catch (err) {
    res.status(500).json({
      message: "Somthing went wrong when fetching all featured categories!",
      error: err.message,
    });
  }
};

const getSubCategoryByID = async (req, res) => {
  try {
    const { Id } = req.params;
    const fetched_results = await subCategoryDbService.getSubCategoryByID(Id);
    res.status(202).json(fetched_results);
  } catch (err) {
    res.status(500).json({
      message: "Somthing went wrong when fetching  sub category by id!",
      error: err.message,
    });
  }
};

module.exports = {
  addSubCategory,
  updateSubCategory,
  getAllSubCategories,
  getSubCategoryByID,
};
