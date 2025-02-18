const db = require("../db/db");

const addProductCategory = (Name, Image) => {
  const sql = `INSERT INTO product_category (Name,Image) VALUES (?,?)`;
  return new Promise((resolve, reject) => {
    db.query(sql, [Name, Image], (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
};

const updateProductCategory = (idProduct_Category, Name, Image) => {
  const sql = `UPDATE product_category SET Name = ? , Image = ? WHERE idProduct_Category = ?`;
  return new Promise((resolve, reject) => {
    db.query(sql, [Name, Image, idProduct_Category, Image], (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
};

const getAllProductCategories = () => {
  const sql = `SELECT * FROM product_category`;
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

const getProductCategoryByID = (idProduct_Category) => {
  const sql = `SELECT * FROM product_category WHERE idProduct_Category=?`;
  return new Promise((resolve, reject) => {
    db.query(sql, [idProduct_Category], (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
};

const addProductCategoryWithImage = (Name, Image) => {
  const sql = `INSERT INTO product_category (Name, Image) VALUES (?, ?)`; // Update your table structure accordingly
  return new Promise((resolve, reject) => {
    db.query(sql, [Name, Image], (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
};

const changeProductCategoryStatus = (idProduct_Category) => {
  const sqlToggleCategoryStatus = `
    UPDATE product_category 
    SET status = CASE 
                  WHEN status = 1 THEN 0 
                  ELSE 1 
                END 
    WHERE idProduct_Category = ?;
  `;

  const sqlGetProductIds = `
    SELECT Product_idProduct 
    FROM product_has_category 
    WHERE ProductCategory_idProductCategory = ?;
  `;

  const sqlUpdateProductStatus = `
    UPDATE products 
    SET status = CASE 
                  WHEN status = 1 THEN 0 
                  ELSE 1 
                END 
    WHERE idProduct IN (?);
  `;

  return new Promise((resolve, reject) => {
    db.query(
      sqlToggleCategoryStatus,
      [idProduct_Category],
      (err, categoryResults) => {
        if (err) {
          reject(err);
          return;
        }
        // Fetch associated product IDs
        db.query(
          sqlGetProductIds,
          [idProduct_Category],
          (err, productResults) => {
            if (err) {
              reject(err);
              return;
            }

            const productIds = productResults.map(
              (row) => row.Product_idProduct
            );

            console.log(productIds);

            // Update status for associated products
            if (productIds.length > 0) {
              db.query(
                sqlUpdateProductStatus,
                [productIds],
                (err, updateResults) => {
                  if (err) {
                    reject(err);
                  } else {
                    resolve({ categoryResults, updateResults });
                  }
                }
              );
            } else {
              // No associated products, resolve with category update results only
              resolve({ categoryResults });
            }
          }
        );
      }
    );
  });
};

const getActiveStatusProductCategories = () => {
  const sql = `SELECT * FROM product_category WHERE Status = ?`;
  return new Promise((resolve, reject) => {
    db.query(sql, [1], (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
};

module.exports = {
  addProductCategory,
  updateProductCategory,
  getAllProductCategories,
  getProductCategoryByID,
  addProductCategoryWithImage,
  changeProductCategoryStatus,
  getActiveStatusProductCategories,
};
