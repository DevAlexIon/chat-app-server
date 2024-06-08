const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const { createMessage } = require("../controllers/messageController");

// @route    POST api/messages
// @desc     Create a new message
// @access   Private
router.post("/", auth, createMessage);

module.exports = router;
