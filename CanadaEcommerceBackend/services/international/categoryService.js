const db = require('../../db/db'); 

const addCategory = (CategoryName) => {
    const sql = `INSERT INTO international_categories(CategoryName) VALUES (?)`;
    return new Promise((resolve, reject) => {
      db.query(sql, [CategoryName], (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results);
        }
      });
    });
  };

const getCategories = () => {
    const sql = `SELECT * FROM international_categories`;
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

const getProductsByCategoryId = (categoryId) => {
  const sql = `
      SELECT p.ProductID, p.ProductName, p.Price, i.ImageURL
      FROM international_products AS p
      LEFT JOIN international_productimages AS i ON p.ProductID = i.ProductID
      WHERE p.CategoryID = ?
  `;
  return new Promise((resolve, reject) => {
      db.query(sql, [categoryId], (err, results) => {
          if (err) {
              reject(err);
          } else {
              const response = { categoryId: categoryId, products: [] };

              if (results.length === 0) {
                  resolve({ message: "No products found under this category." });
              } else {
                  // product id ekata group karala multiple images handle karanwa
                  const products = {};
                  results.forEach(row => {
                      if (!products[row.ProductID]) {
                          products[row.ProductID] = {
                              ProductID: row.ProductID,
                              ProductName: row.ProductName,
                              Price: row.Price,
                              Images: []
                          };
                      }
                      if (row.ImageURL) {
                          products[row.ProductID].Images.push(row.ImageURL);
                      }
                  });
            
                  response.products = Object.values(products);
                  resolve(response);
              }
          }
      });
  });
};

const getCategoriesWithProducts = () => {
    const sql = `
      SELECT c.CategoryID, c.CategoryName,
             p.ProductID, p.ProductName, 
             pi.ImageURL
      FROM international_categories AS c
      LEFT JOIN international_products AS p ON c.CategoryID = p.CategoryID
      LEFT JOIN international_productimages AS pi ON p.ProductID = pi.ProductID
    `;
  
    return new Promise((resolve, reject) => {
      db.query(sql, (err, results) => {
        if (err) {
          reject(err);
        } else {
          const categories = {};
  
          // Iterate over the rows to group products and their images
          results.forEach(row => {
            // Initialize category if not exists
            if (!categories[row.CategoryID]) {
              categories[row.CategoryID] = {
                CategoryID: row.CategoryID,
                CategoryName: row.CategoryName,
                Products: []
              };
            }
  
            // Find the product in the category
            let product = categories[row.CategoryID].Products.find(p => p.ProductID === row.ProductID);
  
            if (!product) {
              // If the product doesn't exist yet, create a new one
              product = {
                ProductID: row.ProductID,
                ProductName: row.ProductName,
                ImageURLs: [] // Initialize the image array
              };
              categories[row.CategoryID].Products.push(product);
            }
  
            // If there's an imageURL, add it to the product's imageURLs array
            if (row.ImageURL) {
              product.ImageURLs.push(row.ImageURL);
            }
          });
  
          // Now, remove any redundant ImageURL field from the product
          Object.values(categories).forEach(category => {
            category.Products.forEach(product => {
              // The ImageURL field is not needed anymore, so we can safely delete it
              delete product.ImageURL;
            });
          });
  
          // Return the structured data with categories and products
          resolve(Object.values(categories));
        }
      });
    });
  };
  

  


const updateCategory = (CategoryID, CategoryName) => {
    const sql = `UPDATE international_categories SET CategoryName = ?  WHERE CategoryID = ?`;
    return new Promise((resolve, reject) => {
        db.query(sql, [CategoryName, CategoryID], (err, results) => {
            if (err) {
                reject(err);
            } else {
                resolve(results);
            }
        });
    });
};


const deleteCategory = (CategoryID) => {
  const checkProductsSQL = `SELECT COUNT(*) AS productCount FROM international_products WHERE CategoryID = ?`;
  const deleteCategorySQL = `DELETE FROM international_categories WHERE CategoryID = ?`;

  return new Promise((resolve, reject) => {
      db.query(checkProductsSQL, [CategoryID], (err, results) => {
          if (err) {
              reject(err);
          } else {
              const productCount = results[0].productCount;
              if (productCount > 0) {
                  reject(new Error('Cannot delete category: Some Products are associated with this category.'));
              } else {
                  db.query(deleteCategorySQL, [CategoryID], (err, deleteResults) => {
                      if (err) {
                          reject(err);
                      } else {
                          resolve(deleteResults);
                      }
                  });
              }
          }
      });
  });
};


const getCategoryById = (CategoryID) => {
    const sql = `SELECT * FROM international_categories WHERE CategoryID = ?`;
    return new Promise((resolve, reject) => {
      db.query(sql, [CategoryID], (err, results) => {
        if (err) {
          reject(err);
        } else {
          if (results.length === 0) {
            resolve(null); 
          } else {
            resolve(results[0]); 
          }
        }
      });
    });
  };




module.exports = {
    addCategory,
    getCategories,
    updateCategory,
    deleteCategory,
    getCategoryById,
    getCategoriesWithProducts,
    getProductsByCategoryId
};


