const db = require('../../db/db'); 


const createProduct = (ProductName, CategoryID, LongDescription) => {
    const sql = `INSERT INTO international_products (ProductName, CategoryID, LongDescription) VALUES (?, ?, ?)`;
    return new Promise((resolve, reject) => {
        db.query(sql, [ProductName, CategoryID, LongDescription], (err, results) => {
            if (err) {
                reject(err);
            } else {
                resolve(results.insertId); 
            }
        });
    });
};

const getAllProducts = async () => {
    const sql = `
        SELECT p.ProductID, p.ProductName, p.CategoryID, p.LongDescription, 
               GROUP_CONCAT(i.ImageURL) AS Images
        FROM international_products p
        LEFT JOIN international_productimages i ON p.ProductID = i.ProductID
        GROUP BY p.ProductID
    `;

    return new Promise((resolve, reject) => {
        db.query(sql, (err, results) => {
            if (err) {
                reject(err);
            } else {
                // Split image URLs into arrays
                results = results.map(product => ({
                    
                    ...product,
                    Images: product.Images ? product.Images.split(",") : []
                }));
                resolve(results);
            }
        });
    });
};




const getProductByID = async (productId) => {
    const sql = `
        SELECT p.ProductID, p.ProductName, p.CategoryID, c.CategoryName, p.LongDescription, 
               GROUP_CONCAT(i.ImageURL) AS Images
        FROM international_products p
        LEFT JOIN international_productimages i ON p.ProductID = i.ProductID
        LEFT JOIN international_categories c ON p.CategoryID = c.CategoryID
        WHERE p.ProductID = ?
        GROUP BY p.ProductID
    `;

    return new Promise((resolve, reject) => {
        db.query(sql, [productId], (err, results) => {
            if (err) {
                reject(err);
            } else if (results.length > 0) {
                const product = results[0];
                product.Images = product.Images ? product.Images.split(",") : [];
                resolve(product);
            } else {
                resolve(null);
            }
        });
    });
};

const updateProduct = (ProductID, ProductName, CategoryID, LongDescription) => {
    const sql = `
        UPDATE international_products 
        SET ProductName = ?, CategoryID = ?, LongDescription = ?
        WHERE ProductID = ?
    `;

    return new Promise((resolve, reject) => {
        db.query(sql, [ProductName, CategoryID, LongDescription,  ProductID], (err, results) => {
            if (err) {
                reject(err);
            } else {
                resolve(results);
            }
        });
    });
};


const deleteProduct = (ProductID) => {
    const deleteImagesSQL = `DELETE FROM international_productimages WHERE ProductID = ?`;
    const deleteProductSQL = `DELETE FROM international_products WHERE ProductID = ?`;

    return new Promise((resolve, reject) => {
        db.query(deleteImagesSQL, [ProductID], (err, imageResults) => {
            if (err) {
                reject(err);
            } else {
                db.query(deleteProductSQL, [ProductID], (err, productResults) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(productResults);
                    }
                });
            }
        });
    });
};

const getProductWithImages = (ProductID) => {
    const sqlProduct = `SELECT * FROM international_products WHERE ProductID = ?`;
    const sqlImages = `SELECT ImageURL FROM international_productimages WHERE ProductID = ?`;
  
    return new Promise((resolve, reject) => {
      db.query(sqlProduct, [ProductID], (err, productResults) => {
        if (err) {
          reject(err);
        } else if (productResults.length === 0) {
          resolve(null); 
        } else {
   
          db.query(sqlImages, [ProductID], (err, imageResults) => {
            if (err) {
              reject(err);
            } else {
              const productWithImages = {
                ...productResults[0],
                images: imageResults.map((img) => img.ImageURL),
              };
              resolve(productWithImages);
            }
          });
        }
      });
    });
  };
  

module.exports = {
    createProduct,
    getAllProducts,
    getProductByID,
    updateProduct,
    deleteProduct,
    getProductWithImages
};