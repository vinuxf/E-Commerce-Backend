const express = require('express');
const router = express.Router();
const productsController = require('../../controllers/international/productsController');
const uploadInternationalProducts = require('../../middleware/uploadInternationalProducts');


router.get('/:productId', productsController.getProductByID);
router.get("/with-images/:ProductID", productsController.getProductDetailsWithImages);//mekath getbyID ekama thamai
router.get('/', productsController.getAllProductsController);
router.post('/', uploadInternationalProducts.array('images'), productsController.createProduct); 
router.put('/:ProductID', uploadInternationalProducts.array('images', 5), productsController.updateProduct);
router.delete('/:productId', productsController.deleteProduct);

module.exports = router;
