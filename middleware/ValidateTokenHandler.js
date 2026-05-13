const jwt = require("jsonwebtoken");

const validateToken = (req, res, next) => {

    const authHeader = req.headers.authorization;

    // Token not present 

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({
            message: "Authorization header missing"
        });
    }

    const token = authHeader.split(" ")[1];

    try {

        const decoded = jwt.verify(
            token,
            process.env.ACCESS_TOKEN_SECRET
        );
        console.log(req);

        req.user = decoded;

        next();

    } catch (err) {

        return res.status(401).json({
            message: "Invalid token"
        });
    }

    console.log("This is the middle ware");
    next();
};

module.exports = { validateToken };