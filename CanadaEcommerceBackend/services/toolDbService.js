const db = require("../db/db");

const getTools = () => {
  const sql = `SELECT * FROM tools`;
  return new Promise((resolve, reject) => {
    db.query(sql, (err, res) => {
      db.query(sql, (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results);
        }
      });
    });
  });
};

const editTool = (idTools, Currency) => {
  const sql = `UPDATE tools SET Currency = ? WHERE idTools = ?`;
  return new Promise((resolve, reject) => {
    db.query(sql, [Currency, idTools], (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
};

const addTool = (Currency) => {
  const sql = `INSERT INTO tools (Currency) VALUES (?)`;
  return new Promise((resolve, reject) => {
    db.query(sql, [Currency], (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
};

const getCurrencyType = () => {
  const sql = `SELECT Currency FROM tools`;
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

module.exports = {
  getTools,
  editTool,
  addTool,
  getCurrencyType,
};
