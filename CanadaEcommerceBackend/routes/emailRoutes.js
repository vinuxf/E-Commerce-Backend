const express = require("express");
const router = express.Router();
const { sendEmail } = require("../controllers/emailController");

router.post("/", sendEmail);
module.exports = router;
