const express = require("express");
const { signupUser, removeAdmin } = require("../controller/UserController");

const router = express.Router();

router.post("/register", signupUser);
router.delete("/remove-admin/:id", removeAdmin);


module.exports = router;
