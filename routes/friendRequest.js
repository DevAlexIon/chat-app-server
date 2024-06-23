const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const {
  sendFriendRequest,
  getFriendRequests,
  updateFriendRequest,
  getFriendList,
} = require("../controllers/friendRequestController");

// @route    POST /friends
// @desc     Send a friend request
// @access   Private
router.post("/", auth, sendFriendRequest);

// @route    GET /friends
// @desc     Retrieve friend requests
// @access   Private
router.get("/", auth, getFriendRequests);

// @route    PATCH /friends/:id
// @desc     Accept or reject a friend request
// @access   Private
router.patch("/:id", auth, updateFriendRequest);

router.get("/list", auth, getFriendList);

module.exports = router;
