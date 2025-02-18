const productImageService = require('../../services/international/productImageService');


const createProductImage = async (req, res) => {
    try {
        const { ProductID, ImageURL } = req.body;
        const newImage = await productImageService.addProductImage(ProductID, ImageURL);
        res.status(201).json(newImage);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


const getImagesByProduct = async (req, res) => {
    try {
        const { ProductID } = req.params;
        const images = await productImageService.getProductImages(ProductID);
        res.json(images);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


const deleteImage = async (req, res) => {
    try {
        const { ImageID } = req.params;
        const result = await productImageService.deleteProductImage(ImageID);
        res.json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteImagesByProductId = async (ProductID) => {
    try {
        await productImageService.deleteImagesByProductId(ProductID);
    } catch (error) {
        throw new Error(`Error deleting images for ProductID ${ProductID}: ${error.message}`);
    }
};

module.exports = {
    createProductImage,
    getImagesByProduct,
    deleteImage,
    deleteImagesByProductId
};