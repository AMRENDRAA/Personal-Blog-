const express = require("express");
const router = express.Router();

const { registeruser, loginuser, currentuser } = require('../controller/userController');
const { validateToken } = require('../middleware/ValidateTokenHandler')


router.post("/register", registeruser)
//@ DESC LOGIN 
// login user route 

//
router.post("/login", loginuser)

//@desc Post 
// Get the current user 
router.post("/current", validateToken, currentuser)



module.exports = router;