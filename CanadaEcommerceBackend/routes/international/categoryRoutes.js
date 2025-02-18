const express = require('express');
const router = express.Router();
const categoriesController = require('../../controllers/international/categoriesController');

router.get('/:CategoryID/products/', categoriesController.fetchProductsByCategoryId); //category ekakata products okkoma
router.get('/categories-with-products', categoriesController.fetchCategoriesWithProducts);//category okkoma + products okkoma
router.get('/', categoriesController.getCategories); //category okkoma
router.get('/:CategoryID', categoriesController.getCategoryById);
router.post('/', categoriesController.createCategory);
router.put('/:CategoryID', categoriesController.updateCategory);
router.delete('/:CategoryID', categoriesController.deleteCategory);



module.exports = router;
