const express = require("express");
const router = express.Router();

const { registeruser, loginuser, currentuser } = require('../controller/userController');
const { validateToken } = require('../middleware/ValidateTokenHandler')

//@ DESC LOGIN 
// login user route 

/**
 * @swagger
 * /api/users/register:
 *   post:      
 *     summary: Register a new user
 *     description: Creates a new user account
 *     tags:
 *       - Users
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Bad request

 */


router.post("/register", registeruser)



/**
 * @swagger
 * /api/users/login:
 *   post:
 *     summary: Login User API will return the Logged in user access token 
 *     description: Login the new user 
 *     tags:
 *       - Users
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: Login successfull
 *       400:
 *         description: Bad request

 */



//
router.post("/login", loginuser)

//@desc Post 
// Get the current user 
router.post("/current", validateToken, currentuser)


// POST /refresh
// POST /logout


// router.post("/refresh",)
// router.post("/logout",)
module.exports = router;


