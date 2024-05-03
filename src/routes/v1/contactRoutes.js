const express = require("express");
const router = express.Router();

const { verifyToken } = require("../../middleware/authMiddleware");
const {
  getContacts,
  addContact,
} = require("../../controller/contactController");

// Get contacts
router.get("/", verifyToken, getContacts);

// Add contact
router.post("/", verifyToken, addContact);

module.exports = router;
