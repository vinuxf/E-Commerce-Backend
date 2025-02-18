const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  // const token = req.headers.authorization?.split(" ")[1];
  // if (!token) {
  //   return res.status(400).send("Token is required!");
  // } else {
  //   jwt.verify(token, "secret_key", (err, decoded) => {
  //     if (err) {
  //       return res.status(400).send("Invalid token!");
  //     } else {
  //       req.idUser = decoded.idUser;
  //       next();
  //     }
  //   });
  // }
  next();
};
module.exports = verifyToken;
