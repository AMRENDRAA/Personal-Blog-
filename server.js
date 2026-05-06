//Jai shree ram 

const dotenv = require("dotenv").config();
const { createProxyMiddleware } = require('http-proxy-middleware');
const express = require('express');

const app = express();



const connectDb = require('./Config/dbConnection');
connectDb();
app.use(express.json());
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

//not found middle ware
app.use((req, res, next) => {
    res.status(404).json({
        success: false,
        message: `Route not found: ${req.originalUrl}`
    });
});


const port = process.env.PORT;
app.listen(port, () => {

    console.log(` Server is running on the port ${port}`)

})

