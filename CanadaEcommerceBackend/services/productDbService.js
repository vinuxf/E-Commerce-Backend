const db = require("../db/db");

const addFeaturedCategories = (
  Product_idProduct,
  FeaturedCategory_idFeaturedCategory
) => {
  const sql = `INSERT INTO product_has_featured_category (Product_idProduct,FeaturedCategory_idFeaturedCategory) VALUES (?,?)`;
  return new Promise((resolve, reject) => {
    db.query(
      sql,
      [Product_idProduct, FeaturedCategory_idFeaturedCategory],
      (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results);
        }
      }
    );
  });
};

const addProduct = (
  Name,
  Price,
  Image,
  Weight,
  Featured_Category_Id,
  Sub_Category_Id
) => {
  const sql = `INSERT INTO products ( Name,
    Price,
    Image,Weight,Featured_Category_Id,
      Sub_Category_Id ) VALUES (?,?,?,?,?,?)`;
  return new Promise((resolve, reject) => {
    db.query(
      sql,
      [Name, Price, Weight, Image, Featured_Category_Id, Sub_Category_Id],
      (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results);
        }
      }
    );
  });
};

const addProductCategories = (
  Product_idProduct,
  ProductCategory_idProductCategory
) => {
  const sql = `INSERT INTO product_has_category (Product_idProduct,ProductCategory_idProductCategory) VALUES (?,?)`;
  return new Promise((resolve, reject) => {
    db.query(
      sql,
      [Product_idProduct, ProductCategory_idProductCategory],
      (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results);
        }
      }
    );
  });
};

const getAllProducts = () => {
  const sql = `SELECT * FROM products ORDER BY idProduct DESC`;
  return new Promise((resolve, reject) => {
    db.query(sql, (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
};

const getAllProductCategoriesbyId = (Product_idProduct) => {
  const sql = `SELECT phc.*, pc.*
FROM product_has_category phc
INNER JOIN product_category pc ON phc.ProductCategory_idProductCategory = pc.idProduct_Category
WHERE phc.Product_idProduct = ?;
`;
  return new Promise((resolve, reject) => {
    db.query(sql, [Product_idProduct], (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
};

const getAllFeaturedCategoriesbyId = (Product_idProduct) => {
  const sql = `SELECT phfc.*, fc.* 
FROM product_has_featured_category phfc
INNER JOIN featured_category fc ON phfc.FeaturedCategory_idFeaturedCategory = fc.idFeatured_Category
WHERE phfc.Product_idProduct = ?;
`;
  return new Promise((resolve, reject) => {
    db.query(sql, [Product_idProduct], (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
};

const getProductByID = (idProduct) => {
  const sql = `SELECT * FROM products WHERE idProduct = ?`;
  return new Promise((resolve, reject) => {
    db.query(sql, [idProduct], (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
};

const updateProduct = (
  idProduct,
  Name,
  Price,
  Image,
  Weight,
  Featured_Category_Id,
  Sub_Category_Id
) => {
  const sql = `UPDATE products SET Name=?, Price=?, Image = ?, Weight = ?,  Featured_Category_Id = ?, 
      Sub_Category_Id = ? WHERE idProduct = ?`; // Removed the extra comma before WHERE
  return new Promise((resolve, reject) => {
    db.query(
      sql,
      [
        Name,
        Price,
        Image,
        Weight,
        Featured_Category_Id,
        Sub_Category_Id,
        idProduct,
      ],
      (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results);
        }
      }
    );
  });
};

const updateProductWithoutPicture = (idProduct, Name, Price, Weight, Featured_Category_Id, Sub_Category_Id) => {
  const sql = `UPDATE products SET Name=?, Price=?,  Weight = ?,  Featured_Category_Id = ?, 
      Sub_Category_Id = ? WHERE idProduct = ?`;
  return new Promise((resolve, reject) => {
    db.query(sql, [Name, Price, Weight,Featured_Category_Id,Sub_Category_Id,   idProduct], (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
};

const deleteFromProductHasCategoriesByProductID = (Product_idProduct) => {
  const sql = `DELETE FROM product_has_category WHERE Product_idProduct = ?`;
  return new Promise((resolve, reject) => {
    db.query(sql, [Product_idProduct], (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
};

const deleteFromProductHasFeaturedCategoriesByID = (Product_idProduct) => {
  const sql = `DELETE FROM product_has_featured_category WHERE Product_idProduct = ?`;
  return new Promise((resolve, reject) => {
    db.query(sql, [Product_idProduct], (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
};

const changeProductStatus = (idProduct) => {
  const sql = `UPDATE products
SET Status = CASE 
    WHEN Status = 0 THEN 1
    WHEN Status = 1 THEN 0
END WHERE idProduct = ?;`;
  return new Promise((resolve, reject) => {
    db.query(sql, [idProduct], (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
};

//calculating the product count
const countAllProducts = (featured, productCategory, subCategory) => {
  let sql = `SELECT COUNT(*) AS total FROM products p WHERE p.Status = 1`;
  let params = [];

  if (featured !== 0) {
    sql += ` AND p.Featured_Category_Id = ?`;
    params.push(featured);
  }

  if (subCategory !== 0) {
    sql += ` AND p.Sub_Category_Id = ?`;
    params.push(subCategory);
  }

  if (productCategory !== 0) {
    sql += ` AND p.idProduct IN (
                SELECT phc.Product_idProduct 
                FROM product_has_category phc 
                WHERE phc.ProductCategory_idProductCategory = ?
              )`;
    params.push(productCategory);
  }

  return new Promise((resolve, reject) => {
    db.query(sql, params, (err, results) => {
      if (err) {
        console.error(err);
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
};

const getAllProductsPaginated = (
  limit,
  offset,
  featured,
  productCategory,
  subCategory
) => {
  let sql = `SELECT * FROM products p WHERE p.Status = 1`;
  let params = [];

  if (featured !== 0) {
    sql += ` AND p.Featured_Category_Id = ?`;
    params.push(featured);
  }

  if (subCategory !== 0) {
    sql += ` AND p.Sub_Category_Id = ?`;
    params.push(subCategory);
  }

  if (productCategory !== 0) {
    sql += ` AND p.idProduct IN (
                SELECT phc.Product_idProduct 
                FROM product_has_category phc 
                WHERE phc.ProductCategory_idProductCategory = ?
              )`;
    params.push(productCategory);
  }

  sql += ` LIMIT ? OFFSET ?`;
  params.push(limit, offset);

  return new Promise((resolve, reject) => {
    db.query(sql, params, (err, results) => {
      if (err) {
        console.error(err);
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
};

const searchProduct = (search) => {
  const sql = `SELECT * FROM products 
    WHERE Name LIKE ?`;
  const searchTerm = `%${search}%`;
  return new Promise((resolve, reject) => {
    db.query(sql, [searchTerm], (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
};



module.exports = {
  addFeaturedCategories,
  addProduct,
  addProductCategories,
  getAllProducts,
  getAllProductCategoriesbyId,
  getAllFeaturedCategoriesbyId,
  getProductByID,
  updateProduct,
  updateProductWithoutPicture,
  deleteFromProductHasCategoriesByProductID,
  deleteFromProductHasFeaturedCategoriesByID,
  changeProductStatus,
  countAllProducts,
  getAllProductsPaginated,
  searchProduct,
};
