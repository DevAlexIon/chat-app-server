const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const {
  createMessage,
  getMessagesBySender,
} = require("../controllers/messageController");

// @route    POST api/messages
// @desc     Create a new message
// @access   Private
router.post("/", auth, createMessage);

// @route    GET api/messages/sender/:senderId
// @desc     Get messages by sender
// @access   Private
router.get("/sender/:senderId", auth, getMessagesBySender);

module.exports = router;
