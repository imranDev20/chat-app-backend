const express = require("express");
const router = express.Router();
const { verifyToken } = require("../../middleware/authMiddleware");
const {
  getContacts,
  addContact,
} = require("../../controller/contactController");

router.get("/", verifyToken, getContacts);
router.post("/", verifyToken, addContact);

module.exports = router;
