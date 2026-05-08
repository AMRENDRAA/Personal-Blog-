const express = require("express");
const router = express.Router();

const { registeruser, loginuser, currentuser } = require('../controller/userController');


router.post("/register", registeruser)

router.post("/login", loginuser)

router.post("/current", currentuser)

module.exports = router;