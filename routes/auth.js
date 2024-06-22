const express = require("express");
const router = express.Router();
const {
  register,
  login,
  getProfile,
} = require("../controllers/authController");
const auth = require("../middleware/auth");

// @route    POST api/auth/register
// @desc     Register user
// @access   Public
router.post("/register", register);

// @route    POST api/auth/login
// @desc     Authenticate user & get token
// @access   Public
router.post("/login", login);

module.exports = router;
