const db = require("../db/db");

const addFeaturedCategory = (Name) => {
  const sql = `INSERT INTO featured_category (Name) VALUES (?)`;
  return new Promise((resolve, reject) => {
    db.query(sql, [Name], (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
};

const updateFeaturedCategory = (idFeatured_Category, Name) => {
  const sql = `UPDATE featured_category SET Name = ? WHERE idFeatured_Category = ?`;
  return new Promise((resolve, reject) => {
    db.query(sql, [Name, idFeatured_Category], (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
};

const getAllFeaturedCategories = () => {
  const sql = `
    SELECT 
      fc.idFeatured_Category, 
      fc.Name AS Featured_Category_Name,
      CONCAT(
        '[', 
        GROUP_CONCAT(
          JSON_OBJECT(
            'Id', sub_query.Sub_Category_Id, 
            'Name', sub_query.Sub_Category_Name
          )
        ), 
        ']'
      ) AS Sub_Categories
    FROM 
      featured_category fc
    LEFT JOIN (
      SELECT DISTINCT p.Featured_Category_Id, sc.Id AS Sub_Category_Id, sc.Name AS Sub_Category_Name
      FROM products p 
      JOIN sub_category sc ON p.Sub_Category_Id = sc.Id
    ) AS sub_query
    ON fc.idFeatured_Category = sub_query.Featured_Category_Id
    GROUP BY 
      fc.idFeatured_Category;
  `;

  return new Promise((resolve, reject) => {
    db.query(sql, (err, results) => {
      if (err) {
        reject(err);
      } else {
        // Manually parse Sub_Categories
        const formattedResults = results.map((row) => ({
          idFeatured_Category: row.idFeatured_Category,
          Featured_Category_Name: row.Featured_Category_Name,
          Sub_Categories: row.Sub_Categories 
            ? JSON.parse(row.Sub_Categories.replace(/'/g, '"')) 
            : [],
        }));
        resolve(formattedResults);
      }
    });
  });
};


const getFeaturedCategoryByID = (idFeatured_Category) => {
  const sql = `SELECT * FROM featured_category WHERE idFeatured_Category=?`;
  return new Promise((resolve, reject) => {
    db.query(sql, [idFeatured_Category], (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
};
module.exports = {
  addFeaturedCategory,
  updateFeaturedCategory,
  getAllFeaturedCategories,
  getFeaturedCategoryByID,
};
