const db = require("../db/db");

const addOrder = (
  Subtotal,
  DeliveryFee,
  Total,
  Firstname,
  Lastname,
  Address1,
  Address2,
  City,
  DeliveryMethod,
  Province,
  PostalCode,
  Contact,
  User_idUsers,
  SaveIt,
  Created_At,
  Discount
) => {
  const sql = `INSERT INTO orders (Subtotal,
    DeliveryFee,
    Total,
    Firstname,
    Lastname,
    Address1,
    Address2,
    City,
    DeliveryMethod,
    Province,
    PostalCode,
    Contact,
    User_idUsers,
    SaveIt,Created_At,Discount) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;

  return new Promise((resolve, reject) => {
    db.query(
      sql,
      [
        Subtotal,
        DeliveryFee,
        Total,
        Firstname,
        Lastname,
        Address1,
        Address2,
        City,
        DeliveryMethod,
        Province,
        PostalCode,
        Contact,
        User_idUsers,
        SaveIt,
        Created_At,
        Discount
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

const addCustomerDetails = (
  Firstname,
  Lastname,
  Address1,
  Address2,
  City,
  Province,
  PostalCode,
  Contact,
  DeliveryMethod,
  User_idUsers
) => {
  const sql = `INSERT INTO customer_details (Firstname,
  Lastname,
  Address1,
  Address2,
  City,
  Province,
  PostalCode,
  Contact,
  DeliveryMethod,User_idUsers) VALUES (?,?,?,?,?,?,?,?,?,?)`;

  return new Promise((resolve, reject) => {
    db.query(
      sql,
      [
        Firstname,
        Lastname,
        Address1,
        Address2,
        City,
        Province,
        PostalCode,
        Contact,
        DeliveryMethod,
        User_idUsers,
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

const checkCustomer = (User_idUsers) => {
  const sql = `DELETE FROM customer_details WHERE User_idUsers = ?`;
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

const addOrderHasProducts = (Quantity, Order_idOrders, Product_idProducts) => {
  const sql = `INSERT INTO order_has_products (Quantity,Order_idOrders,Product_idProducts) VALUES (?,?,?)`;
  return new Promise((resolve, reject) => {
    db.query(
      sql,
      [Quantity, Order_idOrders, Product_idProducts],
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

const getAllOrderedProducts = (Order_idOrders) => {
  const sql = `SELECT * FROM order_has_products WHERE Order_idOrders = ?`;
  return new Promise((resolve, reject) => {
    db.query(sql, [Order_idOrders], (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
};

const getAllOrders = () => {
  const sql = `SELECT * FROM orders ORDER BY idOrder DESC`;
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

const changeStatus = (idOrder) => {
  const sql = `UPDATE orders 
    SET Status = CASE 
      WHEN Status = 0 THEN 1 
      WHEN Status = 1 THEN 2 
      WHEN Status = 2 THEN 3 
      WHEN Status = 3 THEN 0
      ELSE Status 
    END 
    WHERE idOrder = ?`;
  return new Promise((resolve, reject) => {
    db.query(sql, [idOrder], (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
};

const getOrderById = (idOrder) => {
  const sql = `SELECT * FROM orders WHERE idOrder= ?`;
  return new Promise((resolve, reject) => {
    db.query(sql, [idOrder], (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
};

const getAllDetailsByIDFROMPRODUCT = (Product_idProducts) => {
  const sql = `SELECT * FROM products WHERE idProduct = ?`;
  return new Promise((resolve, reject) => {
    db.query(sql, [Product_idProducts], (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
};

const fetchOrdersByUserId = (User_idUsers) => {
  const sql = `SELECT * FROM orders WHERE User_idUsers = ?`;
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

const fetchAllProductsAccordintoOrderid = (Order_idOrders) => {
  const sql = `SELECT 
    ohp.*,
   p.*
FROM 
    order_has_products ohp
INNER JOIN 
    products p ON ohp.Product_idProducts = p.idProduct
WHERE 
    ohp.Order_idOrders = ?;
`;
  return new Promise((resolve, reject) => {
    db.query(sql, [Order_idOrders], (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
};

module.exports = {
  addOrder,
  addCustomerDetails,
  checkCustomer,
  addOrderHasProducts,
  getAllOrderedProducts,
  getAllOrders,
  changeStatus,
  getOrderById,
  getAllDetailsByIDFROMPRODUCT,
  fetchOrdersByUserId,
  fetchAllProductsAccordintoOrderid,
};
