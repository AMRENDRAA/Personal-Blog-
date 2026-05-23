const User = require('../Models/articleUserModel')
const bcrypt = require("bcrypt");

const jwt = require("jsonwebtoken")


// 1. Client sends registration request
// 2. Backend validates input fields
// 3. Backend checks if user already exists
// 4. Password hashed using bcrypt
// 5. User stored in database
// 6. Success response sent to client

const registeruser = async (req, res) => {

    try {

        // COLLECT THE USERNAME ,PASSWORD ,EMAIL FROM THE BODY CLIENT(USER SIDE)

        const { username, email, password } = req.body;

        //CHECK FOR THE VALID EMAIL ,USERNAME ,PASSWORD
        // Backend validates input

        if (!username || !email || !password) {

            res.status(400).json({
                "status": "Failed",
                message: "Missing fields "
            })

        }

        //SEARCH FOR THE USER 
        //  Backend checks existing user

        const useravailable = await User.findOne({ email });

        //IF USER IS ALREADY EXIST IN THE DB THEN USER CANNOT RE REGISTER 

        if (useravailable) {
            res.status(400).json({
                status: "Failed",
                message: "User already registered"
            })
        }

        // IF NEW USEER THEN WE WILL HASH ITS PASSWORD 

        //hash password 
        const hashedpassword = await bcrypt.hash(password, 10);
        console.log(hashedpassword);

        // create the new user here we will not store the password as plain
        // but we will store the hashed passsword
        //Store user in DB


        const newuser = await User.create({
            username,
            email,
            password: hashedpassword,

        })

        // we will return the response as 201 we will return the _id , email not the hashed 
        //password because it is security threat

        if (newuser) {
            res.status(201).json({
                _id: newuser.id,
                email: newuser.email
            })

            // if something goes wrong in this interview 

        } else {
            res.status(400).json({
                status: "Failed",
                err: "Data is invalid"
            })
        }


    } catch (err) {

        // Catch block to catch any error 
        res.status(500).json({


            "status": "Failed",
            err: err.message
        })


    }

}

//LOGIN FLOW 

// 7. Client sends login request
// 8. Backend validates credentials
// 9. Backend finds user by email
// 10. bcrypt compares passwords
// 11. JWT access token generated
// 12. Token sent to client

const loginuser = async (req, res) => {


    try {

        // Body will bring the email ,password 
        //Backend validates fields

        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({
                status: " Failed",
                message: "Enter email or password"
            })
        }

        // we will find the user if exist or not

        const user = await User.findOne({ email });

        //if user exists in db compare password with hashed password 

        // bcrypt compares passwords

        // JWT access token generated

        if (user && (await bcrypt.compare(password, user.password))) {


            const accesstoken = jwt.sign({

                // jwt sign uses three parameter
                // payload 
                // access_token_Secret
                // exprires in 
                user: {
                    username: user.username,
                    email: user.email,
                    id: user.id
                },


            }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "15m" })




            //Now we will implement the Refresh token 

            const refreshToken = jwt.sign(
                { id: user.id },
                process.env.REFRESH_TOKEN_SECRET,
                { expiresIn: "7d" }

            )

            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                secure: true,
                sameSite: 'Lax',
                maxAge: 7 * 24 * 60 * 60 * 1000
            })

            // After generating the access token we will return the accesstoken to the user
            console.log(refreshToken);

            return res.status(200).json({ accesstoken })

        } else {
            res.status(401).json({

                // if failed 
                status: "Failed",

                err: "invalid credential"
            })
        }



    } catch (err) {
        console.log(err);

        // in case of any err


        return res.status(500).json({
            status: "Failed",
            error: err.message

        })










    }

}

// 13. Client accesses protected route
// 14. Client sends JWT in Authorization header
// 15. Middleware extracts token
// 16. Middleware verifies token
// 17. Decoded user extracted
// 18. req.user attached
// 19. next() passes control
// 20. Protected controller executes
// 21. Controller accesses req.user
// 22. Response sent



const currentuser = (req, res) => {
    res.send({ message: "this is current day" })

    // here we will send the req.user data 

    res.status(200).json(req.user);

}


const refreshTokenHandler = async (req, res) => {

    //Get cookies from request

    const cookies = req.cookies;

    //check if refresh token exists 
    if (!cookies || !cookies.refreshToken) {
        return res.status(401).json({
            status: "Failed",
            message: "refresh token missing "
        })
    }

    // Extract refresh token

    const refreshToken = cookies.refreshToken;

    try {
        //verify refresh token 
        const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
        //GENERATE NEW ACCESS TOKEN 

        const accessToken = jwt.sign(
            {
                user: {
                    id: decoded.id

                }

            }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "15m" }

        )

        return res.status(200).json({
            status: "Success",
            accessToken
        });

    } catch (err) {
        return res.status(403).json({
            status: "Failed",
            message: "Invalid or expired refresh token"
        });




    }

}


const logout = async (req, res) => {

    //clear refresh token cookie
    res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: false,
        sameSite: "Lax"
    });
    return res.status(200).json({
        status: "Success",
        message: "User logged out successfully"
    });
}


module.exports = {
    registeruser,
    loginuser,
    currentuser,
    refreshTokenHandler,
    logout
}


