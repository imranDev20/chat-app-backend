const express = require("express");
const {
  registerUser,
  loginUser,
  verifyUser,
} = require("../../controller/userController");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/verify-user", verifyUser);

module.exports = router;
