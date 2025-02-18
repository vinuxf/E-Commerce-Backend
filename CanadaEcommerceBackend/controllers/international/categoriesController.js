const categoryService = require('../../services/international/categoryService');

const getCategories = async (req, res) => {
    const categories = await categoryService.getCategories();
    res.json(categories);
};

const createCategory = async (req, res) => {
    try {
      const { CategoryName } = req.body; 
      const newCategory = await categoryService.addCategory(CategoryName); 
      res.status(201).json(newCategory); 
    } catch (error) {
      res.status(500).json({ error: error.message }); 
    }
  };


  const fetchCategoriesWithProducts = async (req, res) => {
    try {
      // Get categories with products from the service
      const categories = await categoryService.getCategoriesWithProducts();
  
      // Get the base URL for image serving
      const baseURL = `${req.protocol}://${req.get("host")}/productImagesInternational/`;
  
      // Map over categories and products to append the base URL to each image URL
      const updatedCategories = categories.map(category => {
        if (!category.Products || category.Products.length === 0) {
          category.Products = []; 
        }
  
        category.Products = category.Products.map(product => {
          // Ensure ImageURLs is an array and has valid image data
          const updatedImageURLs = product.ImageURLs && product.ImageURLs.length > 0
            ? product.ImageURLs.map(imageURL => baseURL + imageURL)
            : []; 
  
          return {
            ...product,
            ImageURLs: updatedImageURLs // Update the ImageURLs array
          };
        });
  
        return category;
      });
  
      // Send the updated categories with the full ImageURLs
      res.json(updatedCategories);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  
  

const fetchProductsByCategoryId = async (req, res) => {
  try {
      const { CategoryID: categoryId } = req.params;
      const products = await categoryService.getProductsByCategoryId(categoryId);
      res.json(products);
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
};


  const updateCategory = async (req, res) => {
    const {  CategoryName } = req.body;
    const { CategoryID } = req.params
    try {
      const updatedCategory = await categoryService.updateCategory(CategoryID, CategoryName); 
      if (updatedCategory.affectedRows === 0) {
        return res.status(404).json({ message: 'Category not found' }); 
      }
      res.json(updatedCategory); 
    } catch (error) {
      res.status(500).json({ error: error.message }); 
    }
  };

  const deleteCategory = async (req, res) => {
    const { CategoryID } = req.params; 
    try {
      const result = await categoryService.deleteCategory(CategoryID); 
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Category not found' }); 
      }
      res.status(204).send(); 
    } catch (error) {
      res.status(500).json({ error: error.message }); 
    }
  };

  const getCategoryById = async (req, res) => {
    const { CategoryID } = req.params; 
    try {
      const category = await categoryService.getCategoryById(CategoryID); 
      if (!category) {
        return res.status(404).json({ message: 'Category not found' }); 
      }
      res.json(category); 
    } catch (error) {
      res.status(500).json({ error: error.message }); 
    }
  };
  
  

module.exports = {
    getCategories,
    createCategory,
    updateCategory,
    deleteCategory,
    getCategoryById,
    fetchProductsByCategoryId,
    fetchCategoriesWithProducts
};