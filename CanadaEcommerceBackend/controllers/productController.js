const productDbService = require("../services/productDbService");

const addProduct = async (req, res) => {
  try {
    const {
      Name,
      Price,
      Weight,
      featured_list,
      productCategory_list,
      Featured_Category_Id,
      Sub_Category_Id,
    } = req.body;
    const picture = req.file;
    const Image = picture.filename;

    const adding_product = await productDbService.addProduct(
      Name,
      Price,
      Weight,
      Image,
      Featured_Category_Id,
      Sub_Category_Id
    );

    const insertedId = adding_product.insertId;

    let parsedFeaturedList = [];
    let parsedProductCategoryList = [];

    // Check if featured_list is already an array
    if (Array.isArray(featured_list)) {
      parsedFeaturedList = featured_list;
    } else {
      try {
        // Attempt to parse it as JSON if it comes as a string
        parsedFeaturedList = JSON.parse(featured_list);
      } catch (error) {
        console.error("Failed to parse featured_list:", error);
      }
    }

    if (Array.isArray(parsedFeaturedList) && parsedFeaturedList.length > 0) {
      parsedFeaturedList.map(async (item) => {
        await productDbService.addFeaturedCategories(
          insertedId,
          item.FeaturedCategory_idFeaturedCategory
        );
      });
    }

    if (Array.isArray(productCategory_list)) {
      parsedProductCategoryList = productCategory_list;
    } else {
      try {
        // Attempt to parse it as JSON if it comes as a string
        parsedProductCategoryList = JSON.parse(productCategory_list);
      } catch (error) {
        console.error("Failed to parse productCategory_list:", error);
      }
    }

    if (
      Array.isArray(parsedProductCategoryList) &&
      parsedProductCategoryList.length > 0
    ) {
      parsedProductCategoryList.map(async (item) => {
        await productDbService.addProductCategories(
          insertedId,
          item.ProductCategory_idProductCategory
        );
      });
    }

    res.status(201).json({ message: "Product adding completed!" });
  } catch (err) {
    res.status(500).json({
      message: "Somthing went wrong when adding the product!",
      error: err.message,
    });
  }
};

const getAllProducts = async (req, res) => {
  try {
    const fetched_results = await productDbService.getAllProducts();
    const baseURL = `${req.protocol}://${req.get("host")}/product-images/`;

    const data = await Promise.all(
      fetched_results.map(async (item) => {
        const all_product_categories =
          await productDbService.getAllProductCategoriesbyId(item.idProduct);
        const all_featured_categories =
          await productDbService.getAllFeaturedCategoriesbyId(item.idProduct);
        PictureURL = baseURL + item.Image;

        return {
          ...item,
          PictureURL,
          product_categories: all_product_categories,
          featuredProduct_categories: all_featured_categories,
        };
      })
    );
    res.status(201).json(data);
  } catch (err) {
    res.status(500).json({
      message: "Somthing went wrong when fetching the products!",
      error: err.message,
    });
  }
};

const getProductByID = async (req, res) => {
  try {
    const { idProduct } = req.params;
    const fetched_results = await productDbService.getProductByID(idProduct);
    const baseURL = `${req.protocol}://${req.get("host")}/product-images/`;
    const data = await Promise.all(
      fetched_results.map(async (item) => {
        const all_product_categories =
          await productDbService.getAllProductCategoriesbyId(item.idProduct);
        const all_featured_categories =
          await productDbService.getAllFeaturedCategoriesbyId(item.idProduct);
        PictureURL = baseURL + item.Image;
        return {
          ...item,
          PictureURL,
          product_categories: all_product_categories,
          featuredProduct_categories: all_featured_categories,
        };
      })
    );
    res.status(201).json(data);
  } catch (err) {
    res.status(500).json({
      message: "Somthing went wrong when fetching the product!",
      error: err.message,
    });
  }
};

const updateProduct = async (req, res) => {
  try {
    const { idProduct } = req.params;
    const {
      Name,
      Price,
      Weight,
      // featured_list,
      productCategory_list,
      Featured_Category_Id,
      Sub_Category_Id,
    } = req.body;

    console.log(productCategory_list);

    let parsedProductCategoryList;
    try {
      parsedProductCategoryList = JSON.parse(productCategory_list);
    } catch (error) {
      console.error("Failed to parse productCategory_list:", error);
      return res
        .status(400)
        .json({ message: "Invalid productCategory_list format" });
    }

    if (req.file) {
      const picture = req.file;
      const Image = picture.filename;

      console.log(productCategory_list);

      await productDbService.updateProduct(
        idProduct,
        Name,
        Price,
        Image,
        Weight,
        Featured_Category_Id,
        Sub_Category_Id
      );
    } else {
      await productDbService.updateProductWithoutPicture(
        idProduct,
        Name,
        Price,
        Weight,
        Featured_Category_Id,
        Sub_Category_Id
      );
    }

    // await productDbService.deleteFromProductHasCategoriesByProductID(idProduct);
    // await productDbService.deleteFromProductHasFeaturedCategoriesByID(
    //   idProduct
    // );
    // if (Array.isArray(featured_list) && featured_list.length > 0) {
    //   featured_list.map(async (item) => {
    //     await productDbService.addFeaturedCategories(
    //       idProduct,
    //       item.FeaturedCategory_idFeaturedCategory
    //     );
    //   });
    // }
    if (
      Array.isArray(productCategory_list) &&
      productCategory_list.length > 0
    ) {
      productCategory_list.map(async (item) => {
        await productDbService.addProductCategories(
          idProduct,
          item.ProductCategory_idProductCategory
        );
      });
    }

    res.status(201).json({ message: "Product updation completed!" });
  } catch (err) {
    res.status(500).json({
      message: "Somthing went wrong when updating the product!",
      error: err.message,
    });
  }
};

const changeProductStatus = async (req, res) => {
  try {
    const { idProduct } = req.params;
    const changeStatus = await productDbService.changeProductStatus(idProduct);
    if (changeStatus.affectedRows === 0) {
      return res
        .status(404)
        .json({ message: "product status changed succefully!" });
    }
    res.status(201).json({ message: "Status changed successfully!" });
  } catch (err) {
    res.status(500).json({
      message: "Somthing went wrong when changing the product status!",
      error: err.message,
    });
  }
};
//creating the pagination controller
const GetAllProductsByPagination = async (req, res) => {
  try {
    const page = req.query.page ? parseInt(req.query.page) : 1;
    const featured = req.query.featured ? parseInt(req.query.featured) : 0;
    const productCategory = req.query.product ? parseInt(req.query.product) : 0;
    const subCategory = req.query.sub ? parseInt(req.query.sub) : 0;

    if (page) {
      const limit = 50;
      const offset = (page - 1) * limit;

      const total_Products = await productDbService.countAllProducts(
        featured,
        productCategory,
        subCategory
      );
      const totalProducts = total_Products[0].total;

      const fetched_results = await productDbService.getAllProductsPaginated(
        limit,
        offset,
        featured,
        productCategory,
        subCategory
      );

      const baseURL = `${req.protocol}://${req.get("host")}/product-images/`;

      const data = await Promise.all(
        fetched_results.map(async (item) => {
          const all_product_categories =
            await productDbService.getAllProductCategoriesbyId(item.idProduct);
          const all_featured_categories =
            await productDbService.getAllFeaturedCategoriesbyId(item.idProduct);
          const PictureURL = baseURL + item.Image;

          return {
            ...item,
            PictureURL,
            product_categories: all_product_categories,
            featuredProduct_categories: all_featured_categories,
          };
        })
      );

      // Calculate total pages and prepare pagination response
      const totalPages = Math.ceil(totalProducts / limit);

      res.status(200).json({
        currentPage: page,
        totalPages,
        totalProducts,
        products: data,
      });
    } else {
      return res.status(409).json({ message: "Page number is required!" });
    }
  } catch (err) {
    res.status(500).json({
      message: "Somthing went wrong when fetching the products by pagination!",
      error: err.message,
    });
  }
};

const searchProduct = async (req, res) => {
  try {
    const { search } = req.body;
    const fetched_results = await productDbService.searchProduct(search);
    const baseURL = `${req.protocol}://${req.get("host")}/product-images/`;
    const data = await Promise.all(
      fetched_results.map(async (item) => {
        const PictureURL = baseURL + item.Image;

        return {
          ...item,
          PictureURL,
        };
      })
    );

    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({
      message: "Something went wrong when searching the products!",
      error: err.message,
    });
  }
};

module.exports = {
  addProduct,
  getAllProducts,
  getProductByID,
  updateProduct,
  changeProductStatus,
  GetAllProductsByPagination,
  searchProduct,
};
