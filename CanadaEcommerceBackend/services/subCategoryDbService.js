const db = require("../db/db");

const addSubCategory = (Name) => {
  const sql = `INSERT INTO sub_category (Name) VALUES (?)`;
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

const updateSubCategory = (Id, Name) => {
  const sql = `UPDATE sub_category SET Name = ? WHERE Id  = ?`;
  return new Promise((resolve, reject) => {
    db.query(sql, [Name, Id], (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
};

const getAllSubCategories = () => {
  const sql = `SELECT * FROM sub_category`;
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

const getSubCategoryByID = (Id) => {
  const sql = `SELECT * FROM sub_category WHERE Id=?`;
  return new Promise((resolve, reject) => {
    db.query(sql, [Id], (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
};
module.exports = {
  addSubCategory,
  updateSubCategory,
  getAllSubCategories,
  getSubCategoryByID,
};
