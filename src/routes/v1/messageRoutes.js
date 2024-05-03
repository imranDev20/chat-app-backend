const express = require("express");
const router = express.Router();
const { getMessage } = require("../../controller/messageController");

router.get("/:sender/:recipient", getMessage);

module.exports = router;
