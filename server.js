//Jai shree ram 

const dotenv = require("dotenv").config();
const { createProxyMiddleware } = require('http-proxy-middleware');
const express = require('express');


const rateLimit = require('express-rate-limit');
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // max requests per IP
    message: "Too many requests, please try again later"
});

const app = express();
const swaggerUi = require("swagger-ui-express");

const swaggerSpec = require("./swagger");
var morgan = require('morgan')

const helmet = require('helmet');

// const rateLimit = require('express-rate-limit');

const connectDb = require('./Config/dbConnection');
connectDb();
app.use(morgan('combined'))

app.use(helmet());
app.use(limiter);
app.use(express.json());
const cookieParser = require("cookie-parser");

app.use(cookieParser());




//PROXY


app.use(
    '/api/external',
    createProxyMiddleware({
        target: 'https://jsonplaceholder.typicode.com',
        changeOrigin: true,
        pathRewrite: {
            '^/api/external': '',
        },
        onProxyReq: (proxyReq, req, res) => {
            console.log('Proxying:', req.method, req.originalUrl);
        },
    })
);
//ROUTES 

app.use("/api/articles", require("./routes/articleRoute"));
app.use("/api/users", require("./routes/userRoutes"));

app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec)
);

//not found middle ware
app.use((req, res, next) => {
    res.status(404).json({
        success: false,
        message: `Route not found: ${req.originalUrl}`
    });
});

//Rate Limiter 




const port = process.env.PORT;
app.listen(port, () => {

    console.log(` Server is running on the port ${port}`)

})

