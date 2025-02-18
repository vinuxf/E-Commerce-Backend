const express = require("express");
const router = express.Router();
const authmiddleware = require("../middleware/authmiddleware");
const {
  register,
  login,
  checkToken,
  changeUserStatus,
  getAllUsers,
  makeUserActivationByDecreptingId,
} = require("../controllers/authController");

router.put("/activate-user/:activationid", makeUserActivationByDecreptingId);
router.get("/get-all-users", getAllUsers);
router.put("/change-status/:idUser", changeUserStatus);
router.post("/register", register);
router.post("/login", login);
router.get("/protected", authmiddleware, checkToken);

module.exports = router;
