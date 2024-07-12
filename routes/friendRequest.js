const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const {
  sendFriendRequest,
  getFriendRequests,
  updateFriendRequest,
  getFriendList,
  searchUsers,
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

// @route    GET /friends/list
// @desc     Retrieve friend requests
// @access   Private
router.get("/list", auth, getFriendList);

// @route    GET /friends/search
// @desc     Search for new friends
// @access   Private
router.get("/search", auth, searchUsers);

module.exports = router;
