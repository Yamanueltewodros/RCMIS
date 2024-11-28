const express = require("express");
const { login, refreshToken } = require("../controller/Login");

const router = express.Router();

router.post("/login", login);
router.post("/refresh-token", refreshToken);

module.exports = router;