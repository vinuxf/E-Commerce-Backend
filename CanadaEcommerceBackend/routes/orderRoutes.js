const express = require("express");
const router = express.Router();
const {
  addOrder,
  getAllOrders,
  changeStatus,
  getOrderById,
  fetchOrdersByUserId,
} = require("../controllers/orderController");
router.get("/fetch-orders-by-user-id/:User_idUsers", fetchOrdersByUserId);
router.post("/", addOrder);
router.get("/", getAllOrders);
router.put("/change-status/:idOrder", changeStatus);
router.get("/:idOrder", getOrderById);
module.exports = router;
