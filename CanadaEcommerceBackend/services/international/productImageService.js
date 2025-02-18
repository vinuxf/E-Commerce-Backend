const db = require('../../db/db'); 


const addProductImage = (ProductID, ImageURL) => {
    const sql = `INSERT INTO international_productimages (ProductID, ImageURL) VALUES (?, ?)`;
    return new Promise((resolve, reject) => {
        db.query(sql, [ProductID, ImageURL], (err, results) => {
            if (err) {
                reject(err);
            } else {
                resolve(results);
            }
        });
    });
};


const updateProductImage = (ProductID, ImageURL) => {
    const sql = `UPDATE international_productimages SET ImageURL = ? WHERE ProductID = ?`;
    return new Promise((resolve, reject) => {
        db.query(sql, [ImageURL, ProductID], (err, results) => {
            if (err) {
                reject(err);
            } else {
                resolve(results); 
            }
        });
    });
};



const getProductImages = (ProductID) => {
    const sql = `SELECT * FROM international_productimages WHERE ProductID = ?`;
    return new Promise((resolve, reject) => {
        db.query(sql, [ProductID], (err, results) => {
            if (err) {
                reject(err);
            } else {
                resolve(results); 
            }
        });
    });
};


const deleteProductImage = (ImageID) => {
    const sql = `DELETE FROM international_productimages WHERE ImageID = ?`;
    return new Promise((resolve, reject) => {
        db.query(sql, [ImageID], (err, results) => {
            if (err) {
                reject(err);
            } else {
                resolve(results);
            }
        });
    });
};


const deleteImagesByProductId = (ProductID) => {
    const sql = `DELETE FROM international_productimages WHERE ProductID = ?`;
    return new Promise((resolve, reject) => {
        db.query(sql, [ProductID], (err, results) => {
            if (err) {
                reject(err);
            } else {
                resolve(results);
            }
        });
    });
};


module.exports = {
    addProductImage,
    updateProductImage,
    getProductImages,
    deleteProductImage,
    deleteImagesByProductId
};


