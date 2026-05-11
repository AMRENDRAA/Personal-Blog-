const User = require('../Models/articleUserModel')
const bcrypt = require("bcrypt");

const jwt = require("jsonwebtoken")

const registeruser = async (req, res) => {

    try {

        const { username, email, password } = req.body;

        if (!username || !email || !password) {

            res.status(400).json({
                "status": "Failed",
                message: "Missing fields "
            })

        }

        const useravailable = await User.findOne({ email });

        if (useravailable) {
            res.status(400).json({
                status: "Failed",
                message: "User already registered"
            })
        }

        //hash password 
        const hashedpassword = await bcrypt.hash(password, 10);
        console.log(hashedpassword);


        const newuser = await User.create({
            username,
            email,
            password: hashedpassword,

        })

        if (newuser) {
            res.status(201).json({
                _id: newuser.id,
                email: newuser.email
            })
        } else {
            res.status(400).json({
                status: "Failed",
                err: "Data is invalid"
            })
        }


    } catch (err) {
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
                err: "invalid credential"
            })
        }



    } catch (Err) {
        console.log(Err);

        return res.status(500).json({
            status: "Failed",
            error: Err.message

        })










    }

}





const currentuser = (req, res) => {
    res.send({ message: "this is current day" })
}

module.exports = {
    registeruser,
    loginuser,
    currentuser
}


