const productService = require('../../services/international/productService');
const productImageService = require('../../services/international/productImageService');



const createProduct = async (req, res) => {
    try {
        const { ProductName, CategoryID, LongDescription } = req.body;
        const newProductId = await productService.createProduct(ProductName, CategoryID, LongDescription);
        const images = req.files ? req.files.map(file => file.filename) : []; // Save only the filename in the database

        if (images.length > 0) {
            await Promise.all(images.map(imageURL => productImageService.addProductImage(newProductId, imageURL)));
        }

        res.status(201).json({ id: newProductId });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateProduct = async (req, res) => {
    try {
      const { ProductID } = req.params;
      const { ProductName, CategoryID, LongDescription } = req.body;
  
      if (!ProductID) {
        return res.status(400).json({ message: 'ProductID is required' });
      }
  
      // if (req.files && req.files.length > 0) {
      //   await productImageService.deleteImagesByProductId(ProductID);
      // }
    
      if (req.files && req.files.length > 0) {
        for (const file of req.files) {
          const imageUrl = file.filename;  
          await productImageService.addProductImage(ProductID, imageUrl);
        }
      }

      await productService.updateProduct(ProductID, ProductName, CategoryID, LongDescription);
  
      res.status(200).json({ message: 'Product updated successfully' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  
  

  const getAllProductsController = async (req, res) => {
    try {

      const products = await productService.getAllProducts();
      const baseURL = `${req.protocol}://${req.get("host")}/productImagesInternational/`;
  
     
      const updatedProducts = products.map(product => {
        const updatedImages = product.Images.map(image => baseURL + image);
        return {
          ...product,
          Images: updatedImages  
        };
      });

      res.json(updatedProducts);
    } catch (error) {
      res.status(500).json({ message: "Error retrieving products.", error });
    }
  };
  
  


const getProductByID = async (req, res) => {
    try {
        const { productId } = req.params;
        const product = await productService.getProductByID(productId);
        const baseURL = `${req.protocol}://${req.get("host")}/productImagesInternational/`;
        product.Images = product.Images.map(image => baseURL + image);
       
        res.json(product);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};





const deleteProduct = async (req, res) => {
    try {
        const { productId } = req.params;
        await productService.deleteProduct(productId);
        res.status(200).json({ message: 'Product deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getProductDetailsWithImages = async (req, res) => {
  const { ProductID } = req.params;

  try {
    const productWithImages = await productService.getProductWithImages(ProductID);

    if (productWithImages) {
      // Dynamically generate the base URL using the request's protocol and host
      const baseURL = `${req.protocol}://${req.get("host")}/productImagesInternational/`;

      // Map over the images and prepend the base URL
      const updatedImages = productWithImages.images.map(image => baseURL + image);
      
      // Return the updated product with images
      const updatedProductWithImages = {
        ...productWithImages,
        images: updatedImages,
      };

      res.json(updatedProductWithImages);
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

  

module.exports = {
    createProduct,
    getProductByID,
    updateProduct,
    deleteProduct,
    getProductDetailsWithImages,
    getAllProductsController
};