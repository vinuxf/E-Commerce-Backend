const express = require('express');
const router = express.Router();
const productImagesController = require('../../controllers/international/productImagesController');


router.post('/', productImagesController.createProductImage);
router.get('/:ProductID', productImagesController.getImagesByProduct);
router.delete('/:ImageID', productImagesController.deleteImage);
router.delete('/ProductID', productImagesController.deleteImagesByProductId);


module.exports = router;
