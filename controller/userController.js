const User = require('../Models/articleUserModel')
const bcrypt = require("bcrypt");

const jwt = require("jsonwebtoken")

const registeruser = async (req, res) => {

    try {

        // COLLECT THE USERNAME ,PASSWORD ,EMAIL FROM THE BODY CLIENT(USER SIDE)

        const { username, email, password } = req.body;

        //CHECK FOR THE VALID EMAIL ,USERNAME ,PASSWORD

        if (!username || !email || !password) {

            res.status(400).json({
                "status": "Failed",
                message: "Missing fields "
            })

        }

        //SEARCH FOR THE USER 

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


const loginuser = async (req, res) => {


    try {

        const { email, password } = req.body;
        if (!email || !password) {
            res.status(400).json({
                status: " Failed",
                message: "Enter email or password"
            })
        }

        const user = await User.findOne({ email });

        //compare password with hashed password 

        if (user && (await bcrypt.compare(password, user.password))) {


            const accesstoken = jwt.sign({
                user: {
                    username: user.username,
                    email: user.email,
                    id: user.id
                },


            }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "15m" })
            res.status(200).json({ accesstoken })

        } else {
            res.status(401).json({
                status: "Failed",

                err: "invalid credential"
            })
        }



    } catch (err) {
        console.log(err);

        return res.status(500).json({
            status: "Failed",
            error: err.message

        })










    }

}





const currentuser = (req, res) => {
    res.send({ message: "this is current day" })
    res.status(200).json(req.user);

}

module.exports = {
    registeruser,
    loginuser,
    currentuser
}


