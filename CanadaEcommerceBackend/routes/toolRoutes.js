const express = require("express");
const router = express.Router();
const {
  addTool,
  getTools,
  editTool,
} = require("../controllers/toolController");

router.post("/", addTool);
router.get("/", getTools);
router.put("/:idTools", editTool);

module.exports = router;
