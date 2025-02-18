const db = require('../../db/db'); 

// Add a new quote request
const addQuoteRequest = (name, companyName, phoneNumber, email, product, quantity) => {
  const sql = `
    INSERT INTO quote_requests (name, company_name, phone_number, email, product, quantity)
    VALUES (?, ?, ?, ?, ?, ?)
  `;
  return new Promise((resolve, reject) => {
    db.query(sql, [name, companyName, phoneNumber, email, product, quantity], (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
};

// Fetch all quote requests
const getQuoteRequests = () => {
  const sql = `SELECT * FROM quote_requests ORDER BY created_at DESC`;
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

const updateStatus = (id, status) => {
  const sql = `UPDATE quote_requests SET status = ? WHERE id = ?`;
  return new Promise((resolve, reject) => {
    db.query(sql, [status, id], (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results); // Resolve with the results of the query
      }
    });
  });
};

module.exports = {
  addQuoteRequest,
  getQuoteRequests,
  updateStatus
};
