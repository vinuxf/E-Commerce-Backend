const productCategoryDbService = require("../services/productCategoryDbService");

const addProductCategory = async (req, res) => {
  try {
    const { Name } = req.body;
    const picture = req.file;
    const Image = picture ? picture.filename : null; // Get image filename

    const add_result = await productCategoryDbService.addProductCategory(
      Name,
      Image
    );
    res.status(201).json({ message: "Product Category adding completed!" });
  } catch (err) {
    res.status(500).json({
      message: "Somthing went wrong when adding product category!",
      error: err.message,
    });
  }
};

// const updateProductCategory = async (req, res) => {
//   try {
//     const { idProduct_Category } = req.params;
//     const { Name } = req.body;
//     const picture = req.file;
//     const Image = picture ? picture.filename : null; // Get image filename if available

//     await productCategoryDbService.updateProductCategory(
//       idProduct_Category,
//       Name,
//       Image
//     );
//     res.status(201).json({ message: "Product Category updation completed!" });
//   } catch (err) {
//     res.status(500).json({
//       message: "Somthing went wrong when updating product category!",
//       error: err.message,
//     });saved
//   }
// };

// new function
const updateProductCategory = async (req, res) => {
  try {
    const { idProduct_Category } = req.params;
    const { Name } = req.body;
    const picture = req.file;
    const Image = picture ? picture.filename : null;

    // Check if the category exists
    const existingCategory =
      await productCategoryDbService.getProductCategoryByID(idProduct_Category);
    if (!existingCategory.length) {
      return res.status(404).json({
        message: "There is no such product category.",
      });
    }

    const updates = [];
    if (Name) {
      updates.push(`Name updated to '${Name}'`);
    }
    if (Image) {
      updates.push(`Image updated to '${Image}'`);
    }

    await productCategoryDbService.updateProductCategory(
      idProduct_Category,
      Name,
      Image
    );
    const updateMessage = updates.length
      ? updates.join(" and ")
      : "No updates were made.";

    res.status(200).json({
      message: `Product Category updation completed! (${updateMessage})`,
    });
  } catch (err) {
    res.status(500).json({
      message: "Something went wrong when updating the product category!",
      error: err.message,
    });
  }
};

const getAllProductCategories = async (req, res) => {
  try {
    const fetched_results =
      await productCategoryDbService.getAllProductCategories();
    const baseURL = `${req.protocol}://${req.get(
      "host"
    )}/product-category-images/`;

    const data = await Promise.all(
      fetched_results.map(async (item) => {
        const PictureURL = baseURL + item.Image;
        return { ...item, PictureURL };
      })
    );
    res.status(202).json(data);
  } catch (err) {
    res.status(500).json({
      message: "Somthing went wrong when fetching all product categories!",
      error: err.message,
    });
  }
};

const getProductCategoryByID = async (req, res) => {
  try {
    const { idProduct_Category } = req.params;
    const fetched_results =
      await productCategoryDbService.getProductCategoryByID(idProduct_Category);
    const baseURL = `${req.protocol}://${req.get(
      "host"
    )}/product-category-images/`;

    const data = fetched_results.map((item) => {
      const PictureURL = baseURL + item.Image; // Add image URL to the response
      return { ...item, PictureURL };
    });
    res.status(202).json(data);
  } catch (err) {
    res.status(500).json({
      message: "Somthing went wrong when fetching  product category by id!",
      error: err.message,
    });
  }
};

const changeProductCategoryStatus = async (req, res) => {
  try {
    const { idProduct_Category } = req.params;
    await productCategoryDbService.changeProductCategoryStatus(
      idProduct_Category
    );
    res.status(201).json({ message: "Status changed successfully!" });
  } catch (err) {
    res.status(500).json({
      message:
        "Something went wrong when changing the product category status!",
      error: err.message,
    });
  }
};

const getActiveStatusProductCategories = async (req, res) => {
  try {
    const fetched_results =
      await productCategoryDbService.getActiveStatusProductCategories();
    const baseURL = `${req.protocol}://${req.get(
      "host"
    )}/product-category-images/`;

    const data = await Promise.all(
      fetched_results.map(async (item) => {
        const PictureURL = baseURL + item.Image;
        return { ...item, PictureURL };
      })
    );
    res.status(202).json(data);
  } catch (err) {
    res.status(500).json({
      message:
        "Somthing went wrong when fetching all active product categories!",
      error: err.message,
    });
  }
};

module.exports = {
  addProductCategory,
  updateProductCategory,
  getAllProductCategories,
  getProductCategoryByID,
  changeProductCategoryStatus,
  getActiveStatusProductCategories,
};
