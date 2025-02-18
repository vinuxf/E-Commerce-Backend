const db = require("../db/db");

const register = async (FirstName, LastName, hash, Email, Address, Role) => {
  const sql = `INSERT INTO users (FirstName,LastName, Password,Email,Address,Role) VALUES (?,?,?,?,?,?)`;
  return new Promise((resolve, reject) => {
    db.query(
      sql,
      [FirstName, LastName, hash, Email, Address, Role],
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

const checkUser = (Email) => {
  const sql = `SELECT * FROM users WHERE Email = ? `;
  return new Promise((resolve, reject) => {
    db.query(sql, [Email], (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
};

const getDataOfHimIfHeisExist = (User_idUsers) => {
  const sql = `SELECT * FROM customer_details WHERE User_idUsers = ?`;
  return new Promise((resolve, reject) => {
    db.query(sql, [User_idUsers], (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
};

const getUserRole = (idUser) => {
  const sql = `SELECT Role FROM users WHERE idUser = ?`;
  return new Promise((resolve, reject) => {
    db.query(sql, [idUser], (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
};

const changeUserStatus = (idUser) => {
  const sql = `UPDATE users SET Status = CASE WHEN Status = 1 THEN 0 WHEN Status = 0 THEN 1 END WHERE idUser = ?`;
  return new Promise((resolve, reject) => {
    db.query(sql, [idUser], (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
};

const getAllUsers = () => {
  const sql = `SELECT * FROM users WHERE Role = ? ORDER BY users.idUser DESC`;
  return new Promise((resolve, reject) => {
    db.query(sql, [2], (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
};

const getCurrentUserData = (idUser) => {
  const sql = `SELECT FirstName,Email FROM users WHERE idUser = ?`;
  return new Promise((resolve, reject) => {
    db.query(sql, [idUser], (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
};

const updateStatusWhenActivated = (idUser) => {
  const sql = `UPDATE users SET Status = ? WHERE idUser = ?`;
  return new Promise((resolve, reject) => {
    db.query(sql, [2, idUser], (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
};
module.exports = {
  register,
  checkUser,
  getDataOfHimIfHeisExist,
  getUserRole,
  changeUserStatus,
  getAllUsers,
  getCurrentUserData,
  updateStatusWhenActivated,
};
